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
from django.http import HttpResponse
import io
import os
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
from django.template.loader import render_to_string
from weasyprint import HTML
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


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
        

        # ✅ PDF GENERATION (INSIDE FUNCTION)
        

class FindJobsView(APIView):

    def post(self, request):
        skills = request.data.get("skills", [])

        # ✅ STEP 1: CREATE QUERY
        query = skills[0] if skills else "software developer"

        url = "https://api.adzuna.com/v1/api/jobs/in/search/1"

        params = {
            "app_id": os.getenv("ADZUNA_APP_ID"),
             "app_key": os.getenv("ADZUNA_APP_KEY"),
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

    try:
        result = json.loads(response.choices[0].message.content)
    except:
        return Response({"error": "Invalid AI response"}, status=500)

    return Response(result)





# ADD THIS NEW CLASS AT THE BOTTOM
@method_decorator(csrf_exempt, name='dispatch')
class CreateResumePDFView(APIView):
    """
    Generates a PDF resume from React data.
    """
    def post(self, request):
        try:
            # 1. Get Data
            incoming_data = request.data
            resume_data = incoming_data.get('data', incoming_data)

            # 2. Render HTML Template
            # Django looks for 'resume_template.html' in the templates folder
            html_string = render_to_string('resume_template.html', {'data': resume_data})

            # 3. Generate PDF
            html = HTML(string=html_string, base_url=request.build_absolute_uri())
            pdf_file = html.write_pdf()

            # 4. Return Response
            response = HttpResponse(pdf_file, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="My_Resume.pdf"'
            return response

        except Exception as e:
            print(f"PDF Generation Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)