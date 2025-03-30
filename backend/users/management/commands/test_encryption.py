from django.core.management.base import BaseCommand
from users.models import Applicant


class Command(BaseCommand):
    help = 'Test encryption and decryption'

    def handle(self, *args, **kwargs):
        # Create an applicant instance
        applicant = Applicant(
            name='John Doe',
            email='john@example.com',
            phone='1234567890',
            dob='1990-01-01',
            qualification='B.Sc.',
            father_name='Father Name',
            mother_name='Mother Name',
            address_street='123 Main St',
            address_district='District Name',
            father_phone='0987654321',
            mother_phone='1230984567',
            adhaarName='John Doe',
            adhaarPhone='1234567890',
            adhaarDob='1990-01-01',
            adhaarAddress='123 Main St',
            adhaar_beneficiary='John Doe',
            pan='ABCDE1234F',
            bankName='Bank Name',
            bank_account='1234567890',
            ifsc='IFSC1234'
        )
        applicant.save()

        # Retrieve the saved applicant and test decryption
        saved_applicant = Applicant.objects.get(email='john@example.com')
        encrypted_data = saved_applicant.encrypted_data

        data_to_encrypt = f"{applicant.adhaarName} {applicant.pan} {applicant.bank_account}"
        encrypted_data = applicant.encrypt_data(data_to_encrypt)
        print("Encrypted data:", encrypted_data)

        decrypted_data = applicant.decrypt_data(encrypted_data)
        print('Decrypted data:', decrypted_data)
