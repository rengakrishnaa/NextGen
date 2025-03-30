from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from kyber import Kyber512
import logging
import sys

logger = logging.getLogger(__name__)

class ApplicantManager(BaseUserManager):
    def create_user(self, wallet, email, **extra_fields):
        if not wallet:
            raise ValueError("The wallet address must be set")
        user = self.model(wallet=wallet, email=email, **extra_fields)
        user.save(using=self._db)        
        return user

    def create_user_with_encryption(self, email, wallet, adhaar, pan, bank_details, adhaarDob=None):
        logger.debug(f"Called create_user_with_encryption with: email={email}, wallet={wallet}, adhaar={adhaar}, pan={pan}, bank_details={bank_details}, adhaarDob={adhaarDob}")
        print("Creating user with encryption...")  # Checkpoint 1
        user = self.create_user(wallet=wallet, email=email, adhaarDob=adhaarDob)  # Use create_user method here
        print("User created, now encrypting data...")  # Checkpoint 2
        user.encrypt_sensitive_data(adhaar, pan, bank_details)
        user.save(using=self._db)
        return user

    def create_superuser(self, wallet, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(wallet, **extra_fields)

class Applicant(AbstractBaseUser):
    wallet = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50)
    qualification = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    mother_name = models.CharField(max_length=100)
    address_street = models.CharField(max_length=255)
    address_district = models.CharField(max_length=100)
    father_phone = models.CharField(max_length=50)
    mother_phone = models.CharField(max_length=50)
    adhaarName = models.CharField(max_length=100)
    adhaarPhone = models.CharField(max_length=50)
    adhaarAddress = models.CharField(max_length=255)
    adhaar_beneficiary = models.CharField(max_length=100)
    pan = models.CharField(max_length=100)
    bankName = models.CharField(max_length=100)
    bank_account = models.CharField(max_length=100)
    ifsc = models.CharField(max_length=100)

    # Fields to store ciphertext lengths
    adhaar_ct_length = models.PositiveIntegerField(default=0)
    pan_ct_length = models.PositiveIntegerField(default=0)
    bank_ct_length = models.PositiveIntegerField(default=0)

    encrypted_data = models.BinaryField()
    public_key = models.BinaryField()

    objects = ApplicantManager()

    USERNAME_FIELD = 'wallet'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.wallet
    
    def generate_keypair(self):
        """Generate a public and private key pair using Kyber."""
        keypair = Kyber512.keygen()
        public_key, private_key = keypair  # Unpack the tuple into public and private keys
        self.public_key = public_key  # Store the public key
        self.private_key = private_key  # Optional: Store the private key if you need it later
        return public_key

    def encrypt_data(self, data, public_key):
        """Encrypts the data and returns the ciphertext and ciphertext length."""
        data_bytes = data.encode() if isinstance(data, str) else data
        if not isinstance(public_key, bytes):
            if isinstance(public_key, str):
                public_key = public_key.encode()  # Convert from string to bytes
            else:
                raise TypeError("public_key must be a bytes object or a string.")
        ciphertext, _ = Kyber512.enc(public_key)  # Perform encryption with the bytes
        return ciphertext, len(ciphertext)

    def encrypt_sensitive_data(self, adhaarAddress, pan, bank_account):
        print("Encrypting sensitive data...")
        logger.debug("Encrypting sensitive data...")
        
        # Generate key pair
        pk,_ = Kyber512.keygen()
        self.public_key = pk

        print(f"Public Key Length: {len(self.public_key)}")
        sys.stdout.flush()  # Ensure immediate output

        # Encrypt each field separately
        ct_adhaarAddress, adhaar_len = self.encrypt_data(adhaarAddress, pk)
        ct_pan, pan_len = self.encrypt_data(pan, pk)
        ct_bank_account, bank_len = self.encrypt_data(bank_account, pk)
        # Store lengths
        self.adhaar_ct_length = adhaar_len
        self.pan_ct_length = pan_len
        self.bank_ct_length = bank_len

        # Check if each ciphertext is populated
        if ct_adhaarAddress:
            print(f"Aadhaar Address Ciphertext Length: {len(ct_adhaarAddress)}")
        else:
            print("Error: Aadhaar ciphertext is empty!")

        if ct_pan:
            print(f"PAN Ciphertext Length: {len(ct_pan)}")
        else:
            print("Error: PAN ciphertext is empty!")

        if ct_bank_account:
            print(f"Bank Account Ciphertext Length: {len(ct_bank_account)}")
        else:
            print("Error: Bank account ciphertext is empty!")

        # Concatenate and save encrypted data
        if all((ct_adhaarAddress, ct_pan, ct_bank_account)):
            self.encrypted_data = ct_adhaarAddress + ct_pan + ct_bank_account
            logger.debug("Encrypted data combined and saved.")
        else:
            logger.error("Error: One or more ciphertexts are empty!")
            raise ValueError("Error: One or more ciphertexts are empty!")

        # Verify that encrypted_data is not empty before saving
        if self.encrypted_data:
            self.save()
            logger.debug("Encrypted data successfully saved.")
        else:
            logger.error("Error: Encrypted data field is empty, save operation aborted.")
            raise ValueError("Error: Encrypted data field is empty.")

    def decrypt_sensitive_data(self, sk):
        # Extract based on lengths
        ct_adhaarAddress = self.encrypted_data[:self.adhaar_ct_length]
        ct_pan = self.encrypted_data[self.adhaar_ct_length:self.adhaar_ct_length + self.pan_ct_length]
        ct_bank_account = self.encrypted_data[self.adhaar_ct_length + self.pan_ct_length:]

        # Decrypt
        adhaar = Kyber512.dec(sk, ct_adhaarAddress)
        pan = Kyber512.dec(sk, ct_pan)
        bank_details = Kyber512.dec(sk, ct_bank_account)
        
        return {
            'adhaar': adhaar,
            'pan': pan,
            'bank_details': bank_details,
        }

def get_decrypted_details(user_id, sk):
    user = Applicant.objects.get(id=user_id)
    logger.debug(f"Public Key (binary): {user.public_key}")
    logger.debug(f"Encrypted Data (binary): {user.encrypted_data}")
    decrypted_data = user.decrypt_sensitive_data(sk)
    logger.debug(decrypted_data)  # Display decrypted Aadhaar, PAN, and bank details
    return decrypted_data