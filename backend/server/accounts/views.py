from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from .serializers import CustomTokenObtainPairSerializer
import pdfplumber
from rest_framework.views import APIView
from rest_framework.response import Response
from reportlab.pdfgen import canvas
from django.http import HttpResponse
import io
from pdfminer.high_level import extract_text
import pdfkit
import re
import requests
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
import google.generativeai as genai
from django.conf import settings
from openai import OpenAI
import json


from .serializers import RegisterSerializer
from .models import ContactMessage


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user

        if user.is_staff or user.is_superuser:
            return Response(
                {"error": "Admin account cannot be deleted"},
                status=status.HTTP_403_FORBIDDEN
            )

        user.delete()
        return Response(
            {"message": "Account deleted successfully"},
            status=status.HTTP_200_OK
        )
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(["POST"])
def contact_message(request):

    name = request.data.get("name")
    email = request.data.get("email")
    message = request.data.get("message")

    ContactMessage.objects.create(
        name=name,
        email=email,
        message=message
    )

    return Response({"message": "Message sent successfully"})



# ✅ Section keywords mapping
SECTION_KEYWORDS = {
    "summary": ["career objective", "objective", "summary"],
    "skills": ["skills", "technical skills"],
    "projects": ["projects"],
    "education": ["education"],
    "experience": ["experience", "internship"],
    "certifications": ["certifications"],
    "hobbies": ["hobbies"],
    "languages": ["languages"]
}


# ✅ Detect section function
def detect_section(line):
    line = line.lower()
    for key, keywords in SECTION_KEYWORDS.items():
        for word in keywords:
            if word in line:
                return key
    return None


class UploadResumeView(APIView):
    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        try:
            pdf_file = io.BytesIO(file.read())

            text = ""
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""

            lines = text.split("\n")

            data = {
                "name": lines[0] if lines else "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "portfolio": "",
                "summary": [],
                "skills": [],
                "projects": [],
                "education": [],
                "experience": [],
                "certifications": [],
                "hobbies": [],
                "languages": []
            }

            current_section = None

            summary_done = False
            summary_lines_count = 0

            # ✅ MAIN LOOP (FIXED INDENTATION)
            for line in lines:
                clean = line.strip()
                lower = clean.lower()

                if not clean:
                    continue

                # ✅ EMAIL
                if re.search(r'\S+@\S+\.\S+', clean):
                    data["email"] = clean
                    continue

            
                # ✅ PHONE (Indian + general)
                if re.search(r'(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}', clean):
                    data["phone"] = clean
                    continue
                
                if "linkedin.com" in lower:
                    data["linkedin"] = clean
                    continue
                
                if "github.com" in lower:
                    data["github"] = clean
                    continue
                
                if "http" in lower and not any(x in lower for x in ["linkedin", "github"]):
                    data["portfolio"] = clean
                    continue
                
                if current_section != "summary" and any(x in lower for x in ["@", "linkedin", "github", "http"]):
                    continue

                # 🔥 SUMMARY DETECTION
                if any(k in lower for k in ["career objective", "objective", "summary"]):
                    current_section = "summary"
                    summary_done = False
                    summary_lines_count = 0
                    continue

                elif any(k in lower for k in ["technical skills", "skills"]):
                    current_section = "skills"
                    summary_done = True   # 🔥 STOP SUMMARY
                    continue

                elif "education" in lower:
                    current_section = "education"
                    summary_done = True
                    continue

                elif "project" in lower:
                    current_section = "projects"
                    summary_done = True
                    continue

                elif any(k in lower for k in ["internship", "experience"]):
                    current_section = "experience"
                    summary_done = True
                    continue

                elif "certification" in lower:
                    current_section = "certifications"
                    continue

                elif "hobbies" in lower:
                    current_section = "hobbies"
                    continue

                elif "languages" in lower:
                    current_section = "languages"
                    continue

                # ❌ Skip unwanted links
                if any(x in lower for x in ["linkedin", "github", "portfolio"]):
                    continue

                # 🚨 FILTER LOGIC
                if current_section:

                    # Prevent summary mixing into skills
                    if current_section == "skills":
                        if len(clean.split()) > 5:
                            continue

                    if current_section == "summary":
                        # 🚫 STOP if already captured enough
                        if summary_done:
                            continue
                        # skip small garbage lines
                        if len(clean.split()) < 4:
                            continue
                        data["summary"].append(clean)
                        summary_lines_count += 1
                        if summary_lines_count >= 2:
                            summary_done = True
                            current_section = None
                            
                        continue

                    data[current_section].append(clean)


            # 🔥 CLEAN SKILLS
            clean_skills = []
            for item in data["skills"]:
                parts = re.split(r',|•|-|\n', item)

                for p in parts:
                    p = p.strip()

                    if (
                        2 < len(p) < 25 and
                        len(p.split()) <= 3 and
                        not any(word in p.lower() for word in ["objective", "responsible", "experience"])
                    ):
                        clean_skills.append(p)

            data["skills"] = list(set(clean_skills))

            # 🔥 CLEAN SUMMARY
            if data["summary"]:
                data["summary"] = [" ".join(data["summary"][:5])]

            return Response({"data": data})

        except Exception as e:
            return Response({"error": str(e)}, status=500)
        


    

config = pdfkit.configuration(
    wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
)


class GenerateResumeView(APIView):

    def post(self, request):
        data = request.data.get("data", {})

        # ✅ EDUCATION
        education_html = ""
        edu = data.get("education", [])
        for i in range(0, len(edu), 3):
            title = edu[i] if i < len(edu) else ""
            sub = edu[i+1] if i+1 < len(edu) else ""
            extra = edu[i+2] if i+2 < len(edu) else ""

            education_html += f"""
            <p class="title">{title}</p>
            <p class="sub">{sub}</p>
            <p class="sub">{extra}</p>
            """

        # ✅ EXPERIENCE
        exp_html = ""
        for e in data.get("experience", []):
            if any(x in e.lower() for x in ["intern", "company", "tech"]):
                exp_html += f'<p class="title">{e}</p>'
            else:
                exp_html += f'<p class="sub">{e}</p>'

        # ✅ PROJECTS
        proj_html = ""
        for p in data.get("projects", []):
            if "(" in p:
                proj_html += f'<p class="title">{p}</p>'
            else:
                proj_html += f'<p class="sub">{p}</p>'

        # ✅ HTML TEMPLATE
        html = f"""
<html>
<head>
<style>

@page {{
    size: A4;
    margin: 0;
}}

body {{
    margin: 0;
    font-family: Arial, sans-serif;
    color: #222;
}}

.main {{
    width: 794px;
    height: 1123px;
}}

.header {{
    background: #cfcfcf;
    text-align: center;
    padding: 18px;
    font-size: 26px;
    font-weight: bold;
    letter-spacing: 2px;
}}

.container {{
    display: table;
    width: 100%;
    height: 100%;
    table-layout: fixed;
}}

.left {{
    display: table-cell;
    width: 32%;
    background: #efefef;
    padding: 18px;
    vertical-align: top;
}}

.right {{
    display: table-cell;
    width: 68%;
    padding: 18px 22px;
    vertical-align: top;
}}

.section-title {{
    font-weight: bold;
    font-size: 13px;
    border-bottom: 2px solid #333;
    margin-top: 14px;
    margin-bottom: 6px;
    letter-spacing: 1px;
}}

p {{
    margin: 3px 0;
    font-size: 12.5px;
    line-height: 1.4;
}}

ul {{
    margin: 4px 0;
    padding-left: 14px;
}}

li {{
    font-size: 12.5px;
    margin-bottom: 3px;
}}

.title {{
    font-weight: bold;
    font-size: 13px;
}}

.sub {{
    font-size: 12.5px;
}}

.small-gap {{
    margin-bottom: 6px;
}}

</style>
</head>

<body>

<div class="main">

<div class="header">
{data.get('name', '')}
</div>

<div class="container">

<!-- LEFT -->
<div class="left">

<div class="section-title">CONTACT DETAILS</div>
<p>{data.get('phone', '')}</p>
<p>{data.get('email', '')}</p>
<p>{data.get('linkedin', '')}</p>
<p>{data.get('github', '')}</p>
<p>{data.get('portfolio', '')}</p>

<div class="section-title">LANGUAGES</div>
{''.join([f"<p>{l}</p>" for l in data.get('languages', [])])}

<div class="section-title">SKILLS</div>
<ul>
{''.join([f"<li>{s}</li>" for s in data.get('skills', [])])}
</ul>

<div class="section-title">HOBBIES</div>
{''.join([f"<p>{h}</p>" for h in data.get('hobbies', [])])}

<div class="section-title">STRENGTHS</div>
<ul>
{''.join([f"<li>{s}</li>" for s in data.get('strengths', [])])}
</ul>

</div>

<!-- RIGHT -->
<div class="right">

<div class="section-title">CAREER OBJECTIVE</div>
<p class="small-gap">{' '.join(data.get('summary', []))}</p>

<div class="section-title">EDUCATION</div>
{''.join([f"<p class='title'>{e}</p>" for e in data.get('education', [])])}

<div class="section-title">INTERNSHIP EXPERIENCE</div>
{''.join([f"<p>{e}</p>" for e in data.get('experience', [])])}

<div class="section-title">PROJECT</div>
{''.join([f"<p>{p}</p>" for p in data.get('projects', [])])}

<div class="section-title">CERTIFICATIONS</div>
<ul>
{''.join([f"<li>{c}</li>" for c in data.get('certifications', [])])}
</ul>

</div>

</div>

</div>

</body>
</html>
"""

        # ✅ PDF GENERATION (INSIDE FUNCTION)
        pdf = pdfkit.from_string(html, False, configuration=config)

        return HttpResponse(
            pdf,
            content_type='application/pdf',
            headers={
                'Content-Disposition': 'attachment; filename="resume.pdf"'
            }
        )
    

class FindJobsView(APIView):

    def post(self, request):
        skills = request.data.get("skills", [])

        # ✅ STEP 1: CREATE QUERY
        query = skills[0] if skills else "software developer"

        url = "https://api.adzuna.com/v1/api/jobs/in/search/1"

        params = {
            "app_id": "695ea0cb",
            "app_key": "8051c317c49d675e38ba16ca72e91922",
            "what": query,
            "results_per_page": 4
        }

        try:
            response = requests.get(url, params=params)
            data = response.json()

            jobs = []

            # ✅ FIRST FETCH
            for job in data.get("results", []):
                jobs.append({
                    "title": job.get("title"),
                    "company": job.get("company", {}).get("display_name"),
                    "location": job.get("location", {}).get("display_name"),
                    "url": job.get("redirect_url"),
                })

            # 🔥 STEP 3: FALLBACK (ADD HERE)
            if not jobs:
                print("No jobs found, using fallback...")

                params["what"] = "software developer"

                response = requests.get(url, params=params)
                data = response.json()

                for job in data.get("results", []):
                    jobs.append({
                        "title": job.get("title"),
                        "company": job.get("company", {}).get("display_name"),
                        "location": job.get("location", {}).get("display_name"),
                        "url": job.get("redirect_url"),
                    })

            return Response({"jobs": jobs})

        except Exception as e:
            return Response({"error": str(e)})
        



class AdminLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=email, password=password)

        if user and user.is_superuser:
            refresh = RefreshToken.for_user(user)

            return Response({
                "token": str(refresh.access_token),
                "message": "Admin login successful"
            })

        return Response({"error": "Invalid admin credentials"}, status=401)
    

User = get_user_model()   # 🔥 IMPORTANT FIX

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        print("USER:", request.user)
        print("AUTH:", request.auth)

        # ❌ TEMP REMOVE THIS (for debugging)
        # if not request.user.is_superuser:
        #     return Response({"error": "Unauthorized"}, status=403)

        users = User.objects.all()

        data = []
        for u in users:
            data.append({
                "email": u.email,
                "mobile": getattr(u, "mobile", ""),  # safe access
                "is_active": u.is_active,
            })

        return Response(data)
    

class ContactListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        messages = ContactMessage.objects.all().values(
            "name", "email", "message"
        )
        return Response(messages)
    

class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        user_count = User.objects.count()
        message_count = ContactMessage.objects.count()

        # 👉 TEMP (until resume model)
        resume_count = 0  

        return Response({
            "users": user_count,
            "messages": message_count,
            "resumes": resume_count,
            "jobs": 0
        })
    

genai.configure(api_key=settings.GEMINI_API_KEY)

class GenerateQuestionsView(APIView):

    def post(self, request):
        skills = request.data.get("skills", [])
        certifications = request.data.get("certifications", [])

        prompt = f"""
        Generate 10 interview questions based on:

        Skills: {skills}
        Certifications: {certifications}

        Include:
        - Technical questions
        - Scenario-based questions
        - One HR question

        Return only questions in list format.
        """

        try:
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(prompt)

            text = response.text

            # simple split
            questions = [q.strip("- ").strip()
                         for q in text.split("\n") if q.strip()]

            return Response({"questions": questions[:10]})

        except Exception as e:
            return Response({"error": str(e)})
        

client = OpenAI()

@api_view(["POST"])
def evaluate_answer(request):
    question = request.data.get("question")
    answer = request.data.get("answer")

    prompt = f"""
    Evaluate the following interview answer.

    Question: {question}
    Answer: {answer}

    Give score out of 10 based on:
    1. Grammar (0-3)
    2. Relevance (0-4)
    3. Clarity & Depth (0-3)

    Return ONLY JSON like:
    {{
      "score": number,
      "grammar": number,
      "relevance": number,
      "clarity": number,
      "feedback": "short feedback"
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    result = json.loads(response.choices[0].message.content)

    return Response(result)