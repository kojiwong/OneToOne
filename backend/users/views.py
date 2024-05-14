from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .models import Attendee
from calendars.models import Calendar
from calendars.serializers import CalendarSerializer



from django.contrib.auth import authenticate, logout
from users.models import CustomUser
from users.serializers import UserSerializer, UserProfileSerializer

# helper function
def get_all_contacts(user):
    contacts = []
    for contact in user.contacts.all():  # Access the queryset using `.all()`
        contacts.append({
            'name': contact.first_name + ' ' + contact.last_name,
            'email': contact.email,
        })
    return contacts

class RegisterView(APIView):
    """
    Description: Register a new user.
    Endpoint: /users/register/ 
    Methods: POST
    Fields/payload: username, password1, password2, email, first_name, last_name
    Validation errors: 
        -  The username field is required.
        -  The password field is required.
        -  The password field is required.
        -  The first name field is required.
        -  The last name field is required.
        -  The email field is required.
        -  The passwords do not match.
        -  The password must be at least 8 characters long.
        -  A user with that username already exists.
        -  A user with that email already exists.
    """
    permission_classes = [AllowAny]  # Allow registration for anonymous users

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            contacts = get_all_contacts(user)
            return Response({
                'message': 'User registered successfully',
                'user_id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'contacts': contacts,
                
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
"""
Note: The LoginView is implemented with the Django Rest Framework's TokenObtainPairView. 
    - Description: Login the user.
    - Endpoint: /users/login/ OR /users/login/refresh/
    - Methods: POST
    - Fields/payload: username, password
    - Validation errors:
        -  The username field is required.
        -  The password field is required.
        -  A user with that username does not exist.
        -  The password is incorrect.

"""
class LogoutView(APIView): 
    """
    Description: Logout the user.
    Endpoint: /users/logout/
    Methods: POST
    Fields/payload: refresh_token
    Validation errors:
        -  The refresh token field is required.
    """

    permission_classes = [IsAuthenticated]  # Require authentication to access this endpoint

    def post(self, request):
        # print(request.data)
        try:
            print(request.data)
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': f'Logout successful {refresh_token}'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

class UserProfileView(APIView):
    """
    Description: Get the user's profile.
    Endpoint: /users/profile/view/
    Methods: GET
    Fields/payload: None
    Validation errors: None
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the authenticated user
        contacts = get_all_contacts(user)
        return Response({
                'message': 'User registered successfully',
                'user_id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'contacts': contacts,  
            })

class UserProfileEditView(APIView):
    """
    Description: Edit the user's profile.
    Endpoint: /users/profile/edit/
    Methods: POST
    Fields/payload: first_name, last_name, email, password1, password2
    Validation errors:
        -  The passwords do not match.
        -  The password must be at least 8 characters long.
        -  A user with that username already exists.
        -  A user with that email already exists.

    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddContactView(APIView):
    """
    Description: Add a contact to the user's profile (via email).
    Endpoint: /users/contacts/add/
    Methods: POST
    Fields/payload: contact_email
    Validation errors:
        -  The contact email field is required.
        -  A user with that email does not exist.
        -  You cannot add yourself as a contact.
        -  You cannot add the same contact twice.
    """
    permission_classes = [IsAuthenticated]
    def post(self, request):
        contact_email = request.data.get('contact_email')
        if contact_email:
            try:
                contact = CustomUser.objects.get(email=contact_email)
                if contact != request.user:  # Ensure user is not trying to add themselves
                    if not request.user.contacts.filter(email=contact_email).exists():  # Ensure user is not trying to add the same contact twice
                        # Add contact to user's contacts
                        request.user.contacts.add(contact)
                        return Response({"message": "Contact added successfully", "contact": contact}, status=status.HTTP_201_CREATED)
                    else: 
                        return Response({"message": "You cannot add the same contact twice"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"message": "You cannot add yourself as a contact"}, status=status.HTTP_400_BAD_REQUEST)
            except CustomUser.DoesNotExist:
                return Response({"message": "Contact with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "Please provide an email address"}, status=status.HTTP_400_BAD_REQUEST)


class RemoveContactView(APIView):
    """
    Description: Remove a contact from the user's profile (via email).
    Endpoint: /users/contacts/remove/
    Methods: POST
    Fields/payload: contact_email
    Validation errors:
        -  The contact email field is required.
        -  A user with that email does not exist.
        -  You cannot remove yourself as a contact.
        -  You cannot remove a contact that is not in your contacts.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        contact_email = request.data.get('contact_email')
        if contact_email:
            try:
                contact = CustomUser.objects.get(email=contact_email)
                if contact != request.user:  # Ensure user is not trying to add themselves
                    if request.user.contacts.filter(email=contact_email).exists():  # Ensure removed user is in user's contacts
                        # Add contact to user's contacts
                        request.user.contacts.remove(contact)
                        return Response({"message": "Contact removed successfully"}, status=status.HTTP_201_CREATED)
                    else: 
                        return Response({"message": "The user with this email is not a contact"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"message": "You cannot remove yourself"}, status=status.HTTP_400_BAD_REQUEST)
            except CustomUser.DoesNotExist:
                return Response({"message": "Contact with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "Please provide an email address"}, status=status.HTTP_400_BAD_REQUEST)
        
class ViewContactsView(APIView):
    """
    Description: View all of the user's contacts.
    Endpoint: /users/contacts/view/
    Methods: GET
    Validation errors: None
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        contacts = get_all_contacts(user)
        return Response({"contacts": contacts})

class ViewContactProfileView(APIView):
    """
    Description: View the profile of a specific contact.
    Endpoint: /users/<contact_id>/profile/
    Methods: GET
    Fields/payload:  
    Validation errors:
        - Contact not found
        - Contact is not in your contacts list
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, contact_id):
        user = request.user

        # Check if the specified contact exists
        contact = get_object_or_404(CustomUser, id=contact_id)
        if not contact:
            return Response({"detail": "Contact not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the contact is in the user's contacts list
        if contact not in user.contacts.all():
            return Response({"detail": "Contact is not in your contacts list"}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize the contact's profile data
        serializer = UserProfileSerializer(contact)
        contact_id = contact.id

        return Response({
            'name': contact.first_name + ' ' + contact.last_name,
            'email': contact.email, 
        })

class AcceptInvitationAPIView(APIView):
    
    permission_classes = [IsAuthenticated]
    def post(self, request, attendee_id):
        try:
            attendee = Attendee.objects.get(id=attendee_id)
        except Attendee.DoesNotExist:
            return Response({"error": "Attendee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        attendee.accepted = True
        attendee.save()
        
        return Response({"status": "success"})
    
class AcceptInvitationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, attendee_id):
        try:
            attendee = Attendee.objects.get(id=attendee_id)
        except Attendee.DoesNotExist:
            return Response({"error": "Attendee not found"}, status=status.HTTP_404_NOT_FOUND)
    
        if not attendee.accepted:
            attendee.accepted = True
            attendee.save()
        
            return Response({"status": "success"})
        return Response({"message": "you have already accepted this invitation"})
    
class ViewCalendarsView(APIView):
    """
    Description: View all of the user's calendars.
    Endpoint: /users/calendars/view/
    Methods: GET
    Validation errors: None
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        calendars = Calendar.objects.filter(owner=request.user)
        arr = []
        for calendar in calendars:
            serializer = CalendarSerializer(calendar)
            arr.append(serializer.data)
        # user = request.user
        # calendars = self.get_all_calendars(user)
        return Response({"calendars": arr})
    
class ViewUnacceptedInvitedCalendarsView(APIView):
    """
    Description: View all of the user's calendars.
    Endpoint: /users/invitedcalendars/view/unaccepted/
    Methods: GET
    Validation errors: None
    """
    # TODO: fix this
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all the Attendee objects where the current user is listed and not accepted yet
        invited_attendees = Attendee.objects.filter(user=request.user, accepted=False)
        # Extract calendar IDs from the invited attendees
        calendar_ids = invited_attendees.values_list('calendar_id', flat=True)

        # Retrieve the Calendar objects based on the extracted IDs
        invited_calendars = Calendar.objects.filter(id__in=calendar_ids)
        
        # Serialize the calendar data
        serializer = CalendarSerializer(invited_calendars, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class ViewAcceptedInvitedCalendarsView(APIView):
    """
    Description: View all of the user's calendars.
    Endpoint: /users/invitedcalendars/view/accepted/
    Methods: GET
    Validation errors: None
    """
    # TODO: fix this
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all the Attendee objects where the current user is listed and accepted yet
        invited_attendees = Attendee.objects.filter(user=request.user, accepted=True)
        # Extract calendar IDs from the invited attendees
        calendar_ids = invited_attendees.values_list('calendar_id', flat=True)

        # Retrieve the Calendar objects based on the extracted IDs
        invited_calendars = Calendar.objects.filter(id__in=calendar_ids, is_finalized=False)
        
        # Serialize the calendar data
        serializer = CalendarSerializer(invited_calendars, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ViewFinalizedInvitedCalendarsView(APIView):
    """
    Description: View all of the user's calendars.
    Endpoint: /users/invitedcalendars/view/accepted/
    Methods: GET
    Validation errors: None
    """
    # TODO: fix this
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all the Attendee objects where the current user is listed and accepted yet
        invited_attendees = Attendee.objects.filter(user=request.user, accepted=True)
        # Extract calendar IDs from the invited attendees
        calendar_ids = invited_attendees.values_list('calendar_id', flat=True)

        # Retrieve the Calendar objects based on the extracted IDs
        invited_calendars = Calendar.objects.filter(id__in=calendar_ids, is_finalized=True)
        
        # Serialize the calendar data
        serializer = CalendarSerializer(invited_calendars, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetUserIdByEmailView(APIView):
    """
    Description: Get a user's id by their email
    Endpoint: /users/<user_email>/id/
    Methods: GET
    Validation errors: None
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_email):
        user = get_object_or_404(CustomUser, email=user_email)

        return Response({"user_id": user.id})
    
class GetUserNameEmailByIdView(APIView):
    """
    Description: Get a user's name and email by their user id
    Endpoint: /users/<user_id>/nameAndEmail/
    Methods: GET
    Validation errors: None
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_object_or_404(CustomUser, id=user_id)

        return Response({
            "name": user.first_name + " " + user.last_name,
            "email": user.email
        })


