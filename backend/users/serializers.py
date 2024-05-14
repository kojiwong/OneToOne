from rest_framework import serializers
from django.contrib.auth.models import User

from users.models import CustomUser


# helper function
def is_valid_email(email):
    if not email:
        return False
    if "@" not in email or "." not in email:
        return False
    return True

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, max_length=120, min_length=1)
    first_name = serializers.CharField(required=True, max_length=120, min_length=1)
    last_name = serializers.CharField(required=True, max_length=120, min_length=1)
    email = serializers.EmailField(required=True, max_length=120, min_length=1)
    password1 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        # model = User
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        # check for blank fields
        if not attrs['username']:
            raise serializers.ValidationError("The username field is required.")
        if not attrs['password1']:
            raise serializers.ValidationError("The password field is required.")
        if not attrs['password2']:
            raise serializers.ValidationError("The password field is required.")
        if not attrs['first_name']:
            raise serializers.ValidationError("The first name field is required.")
        if not attrs['last_name']:
            raise serializers.ValidationError("The last name field is required.")
        if not attrs['email']:
            raise serializers.ValidationError("The email field is required.")
        # check passwords are the same
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("The passwords do not match.")
        # check password length is at least 8 characters
        if len(attrs['password1']) < 8:
            raise serializers.ValidationError("The password must be at least 8 characters long.")
        # check username is unique
        if CustomUser.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        # check email is unique
        if CustomUser.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')  # Remove 'password2' from validated_data
        password = validated_data.pop('password1')  # Extract 'password1' from validated_data
        user = CustomUser.objects.create_user(**validated_data, password=password)
        return user
    

class UserProfileSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField( style={'input_type': 'password'}, required=False)
    password2 = serializers.CharField( style={'input_type': 'password'}, required=False)
    
    class Meta:
        # model = User
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']
        extra_kwargs = {
            'username': {'read_only': True},
            # 'password1': {'required': False},
            # 'password2': {'required': False},
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }
    
    def validate(self, attrs):
        if 'password1' in attrs and 'password2' in attrs:
            password1 = attrs.get('password1')
            password2 = attrs.get('password2')
            if password1 != password2:
                raise serializers.ValidationError("Passwords do not match.")
            if len(password1) < 8:
                raise serializers.ValidationError("Password must be at least 8 characters long.")
        if 'email' in attrs:
            email = attrs.get('email')
            if email != '' and not is_valid_email(email):
                raise serializers.ValidationError("Enter a valid email address.")
        return attrs

    def update(self, instance, validated_data):
        # Update the instance with the validated data
        if 'first_name' in validated_data:
            new_first_name = validated_data.get('first_name', instance.first_name)
            if new_first_name != instance.first_name and new_first_name != '':
                instance.first_name = new_first_name
        if 'last_name' in validated_data:
            new_last_name = validated_data.get('last_name', instance.last_name)
            if new_last_name != instance.last_name and new_last_name != '':
                instance.last_name = new_last_name
        if 'email' in validated_data:
            new_email = validated_data.get('email', instance.email)
            if new_email != instance.email and new_email != '':
                instance.email = new_email

        # If 'password1' is present in validated_data, update the password
        if 'password1' in validated_data and 'password2' in validated_data:
            if 'password1' != '' and 'password2' != '':
                print("new password:", validated_data['password1'])
                instance.set_password(validated_data['password1'])

        # Save the updated instance
        instance.save()
        return instance