from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import applicant_create, get_user_details
from . import views
from .views import authorize_user, csrf_token_view

urlpatterns = [
    path('applicant/', applicant_create, name='applicant-create'),
    path('authorize/', authorize_user, name='authorize-user'),
    path('csrf/', csrf_token_view, name='csrf_token'),
    path('user-details/<str:wallet_address>/', get_user_details, name='get_user_details'),
    path('decrypt/<int:user_id>/', views.decrypt_user_data, name='decrypt_user_data'),
    
]