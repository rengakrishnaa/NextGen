from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from kyber import Kyber512
from backend import settings
from .serializers import ApplicantSerializer
from .models import Applicant
from eth_account.messages import encode_defunct
from web3 import Web3
import json
import logging
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import permission_classes
from django.middleware.csrf import get_token
from rest_framework.permissions import IsAuthenticated
import time
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from .models import get_decrypted_details
from rest_framework_simplejwt.tokens import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import TokenError

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from web3 import Web3
from eth_account.messages import encode_defunct
from .models import Applicant
from .utils import generate_token, invalidate_existing_tokens  # Assuming these functions are defined in utils.py
import logging

logger = logging.getLogger(__name__)

def invalidate_existing_tokens(user):
    # Blacklist all outstanding tokens for the user
    for token in OutstandingToken.objects.filter(user=user):
        _, created = BlacklistedToken.objects.get_or_create(token=token)

def invalidate_existing_tokens(user):
    try:
        tokens = OutstandingToken.objects.filter(user=user)
        for token in tokens:
            BlacklistedToken.objects.create(token=token)
    except TokenError as e:
        logger.error(f"Token error: {str(e)}")

# def invalidate_existing_tokens(user):
#     # Fetch all outstanding tokens for the user
#     outstanding_tokens = OutstandingToken.objects.filter(user=user)
    
#     for token in outstanding_tokens:
#         # Blacklist each token
#         BlacklistedToken.objects.create(token=token)

def generate_token(user,wallet):
    refresh = RefreshToken.for_user(user)
    refresh['wallet'] = wallet
    refresh['timestamp'] = int(time.time())
    return str(refresh.access_token)

# Initialize Web3
w3 = Web3(Web3.HTTPProvider('http://localhost:7545'))  # Ensure Ethereum node is running

# Load contract ABI and address
with open(r"C:\Users\user\Desktop\7th sem\TARP\E-Governance_with_req_file\GOEASE\MyBlockchain\build\contracts\ApplicantStorage.json") as f:
    contract_abi = json.load(f)['abi']
contract_address = '0x70b06EF410A4C47c9175934ef656D66F035C3326'  # Your contract address
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# User Registration
@api_view(['POST'])
@permission_classes([AllowAny])
def applicant_create(request):
    if not request.data.get('username'):
        request.data['username'] = request.data['email'].split('@')[0]
        
    wallet_address = request.data.get('wallet')
    adhaar = request.data.get('adhaar')  # Assuming aadhaar is passed
    pan = request.data.get('pan')  # Assuming pan is passed
    bank_details = request.data.get('bank_details')
    serializer = ApplicantSerializer(data=request.data)
    if serializer.is_valid():
        applicant = serializer.save()
        applicant.save()
        logger.info(f"Wallet address captured: {wallet_address}")  # Save applicant to PostgreSQL database
        public_key, secret_key = Kyber512.keygen()

        # Store the public key in the database (for encryption)
        applicant.public_key = public_key
        applicant.save()

        # Store the secret key temporarily in settings (development mode)
        settings.SECRET_KEY_STORAGE[applicant.email] = secret_key
        return Response({
            "message": "Registration successful",
            "applicant": serializer.data  # Return user data
        }, status=status.HTTP_201_CREATED)
    else:
        logger.error(f"Validation error: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from web3 import Web3
from eth_account.messages import encode_defunct
from .models import Applicant
from .utils import generate_token, invalidate_existing_tokens  # Assuming these functions are defined in utils.py
import logging

# Initialize logger
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def authorize_user(request):
    wallet = request.data.get("wallet")
    signature = request.data.get("signature")

    logger.debug(f"Incoming request data: Wallet: {wallet}, Signature: {signature}")

    # Validate input
    if not wallet or not signature:
        logger.error("Wallet address or signature is missing.")
        return Response({"error": "Wallet address and signature are required"}, status=400)

    try:
        # Create the message and encode it
        message = "I am signing in"
        message_encoded = encode_defunct(text=message)
        checksum_address = Web3.toChecksumAddress(wallet)

        # Recover the address from the signature
        recovered_address = w3.eth.account.recover_message(message_encoded, signature=signature)
        recovered_address_str = Web3.toChecksumAddress(recovered_address)

        logger.debug(f"Recovered address: {recovered_address_str}, Checksum address: {checksum_address}")

        # Verify the recovered address matches the wallet address
        if recovered_address_str.lower() == checksum_address.lower():
            # Fetch the user from the database
            user = Applicant.objects.get(wallet=wallet)

            # Invalidate existing tokens for the user
            invalidate_existing_tokens(user)

            # Generate a new token
            token = generate_token(user, wallet)

            logger.info(f"Authorization successful for wallet: {wallet}")
            return Response({"success": True, "message": "Authorization successful", "token": token})

        else:
            logger.error("Invalid signature: The recovered address does not match the wallet address.")
            return Response({"success": False, "error": "Invalid signature"}, status=401)

    except Applicant.DoesNotExist:
        logger.error(f"User not found for wallet: {wallet}")
        return Response({"error": "User not found"}, status=404)

    except Exception as e:
        logger.error(f"Authorization failed: {str(e)}")
        return Response({"error": "Authorization failed"}, status=500)
    

from django.shortcuts import get_object_or_404

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_details(request, wallet_address):
    try:
        user = Applicant.objects.get(wallet=wallet_address)  # Fetch user by wallet address
        # secret_key = settings.SECRET_KEY_STORAGE.get(user.email)
        
        # decrypted_data = user.decrypt_sensitive_data(secret_key)  # Decrypt data
        user_data = {
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address_street,    # Adjust field names as per your model
            # "aadhaar": decrypted_data['aadhaar'],
            # "pan": decrypted_data['pan'],
            # "bank_details": decrypted_data['bank_details']
        }
        return Response(user_data, status=200)
    except Applicant.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
def csrf_token_view(request):
    csrf_token = get_token(request)
    response = JsonResponse({'csrftoken': csrf_token})
    response.set_cookie('csrftoken', csrf_token, httponly=False, samesite='None')  # Set the CSRF cookie
    return response  # Return the response object




def decrypt_user_data(request, user_id):
    if request.method == 'POST':
        try:
            user_data = Applicant.objects.get(id=user_id)
            # Add your decryption logic here
            decrypted_data = get_decrypted_details(user_data.encrypted_field)
            return JsonResponse({'data': decrypted_data})
        except Applicant.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)