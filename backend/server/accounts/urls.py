from django.urls import path
from .views import RegisterView, DeleteAccountView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
]
