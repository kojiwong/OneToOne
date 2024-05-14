from django.urls import path
from . import views
 
urlpatterns = [
    path('create/', views.CreateCalendarAPIView.as_view(), name='add-calendar'),
    path('<int:calendar_id>/view/', views.ViewCalendarAPIView.as_view(), name='view-calendar'),
    path('<int:calendar_id>/edit/', views.EditCalendarAPIView.as_view(), name='edit-calendar'),
    path('events/add/', views.CreateEventAPIView.as_view(), name='add-event'),
    path('invite/', views.CreateAttendeeAPIView.as_view(), name='invite-attendee'),
    # path('<int:calendar_id>/finalize/', views.EditCalendarAPIView.as_view(), name='finalize-calendar'),
    path('<int:calendar_id>/list/status/', views.AttendeeStatusListAPIView.as_view(), name='attendee_status_list'),
    path('<int:calendar_id>/event/<int:event_id>/update/', views.UpdateEventAPIView.as_view(), name='update-event'),
    path('<int:calendar_id>/contact/<user_id>/view/', views.ContactAvailabilityAPIView.as_view(), name='contacts-event'),
    path('<int:attendee_id>/reminder/', views.ReminderEmailAPIView.as_view(), name='reminder-email'),
    path('<int:calendar_id>/suggested/', views.SuggestedEventsAPIView.as_view(), name='suggested-events'),
    path('<int:calendar_id>/finalize/', views.FinalizeCalendarAPIView.as_view(), name='finalize-calendar'),
    path('<int:calendar_id>/get_events/', views.GetAllEventsInCalendar.as_view(), name='get-all-events'),
    path('<int:calendar_id>/get_events/<int:invitee_id>/', views.GetEventsForInvitee.as_view(), name='get_events_for_invitee'),
    path('events/<int:event_id>/delete/', views.DeleteEventView.as_view(), name='delete_event'),
]