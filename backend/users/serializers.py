from rest_framework import serializers
from .models import Applicant  


    
class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = '__all__'
        extra_kwargs = {'wallet': {'required': True},
                        'public_key': {'read_only': True}
                        }

    