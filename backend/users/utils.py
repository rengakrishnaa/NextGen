# utils.py
from rest_framework_simplejwt.tokens import RefreshToken

def generate_token(user, wallet):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def invalidate_existing_tokens(user):
    # Logic to invalidate existing tokens for the user if needed
    # This can be specific to your authentication strategy
    pass
