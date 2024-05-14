from django.urls import path
from .views import (
    RegisterView, LogoutView, 
    UserProfileView, UserProfileEditView,
    AddContactView, RemoveContactView, ViewContactsView,
    ViewContactProfileView, AcceptInvitationAPIView, ViewCalendarsView, 
    GetUserIdByEmailView, ViewUnacceptedInvitedCalendarsView, ViewAcceptedInvitedCalendarsView, ViewFinalizedInvitedCalendarsView,
    GetUserNameEmailByIdView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/view/', UserProfileView.as_view(), name='profile'),
    path('profile/edit/', UserProfileEditView.as_view(), name='edit_profile'),
    path('contacts/view/', ViewContactsView.as_view(), name='contacts'),
    path('contacts/add/', AddContactView.as_view(), name='add_contact'),
    path('contacts/remove/', RemoveContactView.as_view(), name='remove_contact'),
    path('<int:contact_id>/profile/', ViewContactProfileView.as_view(), name='contacts_detail'),
    path('accept/<int:attendee_id>/', AcceptInvitationAPIView.as_view(), name='accept_invitation'),
    path('calendars/view/', ViewCalendarsView.as_view(), name='attendee_status_list'),
    path('invitedcalendars/view/unaccepted/', ViewUnacceptedInvitedCalendarsView.as_view(), name='unaccepted_invited_attendee_status_list'),
    path('invitedcalendars/view/accepted/', ViewAcceptedInvitedCalendarsView.as_view(), name='accepted_invited_attendee_status_list'),
    path('invitedcalendars/view/finalized/', ViewFinalizedInvitedCalendarsView.as_view(), name='accepted_invited_attendee_status_list'),
    path('<user_email>/id/', GetUserIdByEmailView.as_view(), name='get_user_id'),
    path('<user_id>/nameAndEmail/', GetUserNameEmailByIdView.as_view(), name='get_user_nameEmail')
]
