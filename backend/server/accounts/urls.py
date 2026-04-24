from django.urls import path
from .views import evaluate_answer 
from .views import (
    RegisterView,
    DeleteAccountView,
    contact_message,
    UploadResumeView,
    CreateResumePDFView,
    GenerateResumeView,
    FindJobsView,
    AdminLoginView,
    UserListView,        # ✅ ADD
    ContactListView,     # ✅ ADD
    AdminStatsView,
    GenerateQuestionsView       # ✅ ADD
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),

    path("contact/", contact_message),

    path("upload-resume/", UploadResumeView.as_view()),
    
    path("generate-resume/", GenerateResumeView.as_view()),
    path("create-resume-pdf/", CreateResumePDFView.as_view()),  # ✅ FIXED

    path("find-jobs/", FindJobsView.as_view()),

    path("admin-login/", AdminLoginView.as_view()),
    path("admin-users/", UserListView.as_view()),
    path("admin-messages/", ContactListView.as_view()),
    path("admin-stats/", AdminStatsView.as_view()),

    path("generate-questions/", GenerateQuestionsView.as_view()),
    path("evaluate-answer/", evaluate_answer),
]