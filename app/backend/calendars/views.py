 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Calendar
from .serializers import CalendarSerializer, EventSerializer, AttendeeSerializer, RemindAttendeeSerializer
from .models import Calendar, Event, EventType
from django.shortcuts import get_object_or_404
from .serializers import CalendarSerializer, EventSerializer
from rest_framework import serializers, generics
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from users.models import Attendee, CustomUser
from datetime import timedelta, datetime
import json
import random

class CreateCalendarAPIView(CreateAPIView):
    """
    Endpoint: /calendars/{calendar_id}/create/
    Method: POST
    Example Payload: 
        {
            "name": "calendar 100",
            "description": "example description",
            "deadline": "2023-04-15"
            "start_date": "2023-04-16",
            "end_date": "2023-04-20",
        }
    """
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer: CalendarSerializer):
        # Set the owner field to the current user's ID
        serializer.save(owner=self.request.user)

class ViewCalendarAPIView(APIView):
    """
    Endpoint: /calendars/{calendar_id}/view/
    Method: GET
    Payload: None, gets by calendar_id in URLConf
    """
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id, *args, **kwargs):
        calendar = Calendar.objects.get(pk=calendar_id)
        calendar = get_object_or_404(Calendar, pk=calendar_id)
        if request.user == calendar.owner:
            serializer = CalendarSerializer(calendar)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
class EditCalendarAPIView(APIView):
    """
    Endpoint: /calendars/{calendar_id}/edit/
    Method: POST
    Payload: 
        {
            "name": "new calendar name",
            "description": "new description",
            "deadline": "2023-06-15"
            "start_date": "2023-06-16",
            "end_date": "2023-06-20",
        }
    """
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, calendar_id, *args, **kwargs):
        calendar = Calendar.objects.get(pk=calendar_id)
        if request.user == calendar.owner:
            serializer = CalendarSerializer(calendar, data=request.data, context={"request": request})
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class CreateEventAPIView(CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer: EventSerializer):
        # Set the owner field to the current user's ID
        serializer.save(owner=self.request.user)



class CreateAttendeeAPIView(CreateAPIView):
    serializer_class = AttendeeSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer: AttendeeSerializer):
        # Set the owner field to the current user's ID
        serializer.save()

class CreateEventAPIView(CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer: EventSerializer):
        # Set the owner field to the current user's ID
        serializer.save(owner=self.request.user)

class UpdateEventAPIView(APIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, calendar_id, event_id, *args, **kwargs):
        event = get_object_or_404(Event, pk=event_id)
        
        if request.user == event.owner:
            serializer = EventSerializer(event, data=request.data, context={"request": request})
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

        
class AttendeeStatusListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id):
        try:
            attendees = Attendee.objects.filter(calendar__id=calendar_id)
        except Attendee.DoesNotExist:
            return Response({"error": "Attendees not found for this calendar"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the attendees' data
        serialized_data = []
        for attendee in attendees:
            serialized_data.append({
                'user_id': attendee.user.id,
                'username': attendee.user.username,
                'accepted': attendee.accepted,
                'full_name': attendee.user.first_name + " " + attendee.user.last_name,
                'first_name': attendee.user.first_name
            })

        return Response(serialized_data)


class ContactEventsListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, contact_id):
        user = request.user
        user_contacts = request.user.contacts.all()
        if not user_contacts.filter(id=contact_id).exists():
            return Response({"error": "Contact not found in your contacts list"}, status=status.HTTP_404_NOT_FOUND)

        events = Event.objects.filter(calendar__owner_id=contact_id, attendees=request.user)
        serialized_data = []
        for event in events:
            serialized_data.append({
                'id': event.id,
                'name': event.name,
            })

        return Response(serialized_data)

class ContactAvailabilityAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, calendar_id, user_id):
        user = request.user
        calendar = Calendar.objects.get(pk=calendar_id, owner=user)
        if calendar: # is the owner
            arr = []
            events = Event.objects.filter(calendar=calendar_id, owner=user_id)
            for event in events:
                e = EventSerializer(event)
                arr.append(e.data)
            return Response({f"events for {user_id}": arr})
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

class ReminderEmailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, attendee_id):
        user = request.user
        attendee = Attendee.objects.get(pk=attendee_id)
        
        calendar = attendee.calendar

        if calendar.owner == user: # is the owner
            if not attendee.status:
                send_mail(
                    "OneOnOne Reminder",
                    "Hi {},\nplease submit your availability to {} before {}.\nThank you, OneOnOne Calendar".format(attendee.user.first_name, calendar, calendar.deadline),
                    "roy.lin@mail.utoronto.ca",
                    ["roy0728@outlook.com",attendee.user.email],
                    fail_silently=False,
                )

                return Response({"status":status.HTTP_200_OK, "message":"Email reminder sent successfully to " + attendee.user.first_name})
            else:
                return Response({"status":status.HTTP_400_BAD_REQUEST, "message": "This user has already posted their availability"})
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

class SuggestedEventsAPIView(APIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, calendar_id):
        calendar = Calendar.objects.get(pk=calendar_id)
        user = request.user

        if calendar.owner == user: # is the owner

            # for attendee in Attendee.objects.filter(calendar=calendar):
            #     finished &= attendee.status

            thing = random.randint(0,1)
            overlap = False
            
            if thing == 1:
                # sort events by earliest finish time
                attendee_events = Event.objects.filter(calendar=calendar).exclude(owner=user).order_by('end_time').values()

                # create these and return these events but don't save them, only save when finalizing
                suggested_events = []

                # give each attendee only one suggested event
                seen = set()

                # make sure new suggested does not overlap with the previous suggested time
                for event in attendee_events:
                    # if event["owner_id"] not in seen:
                    #     found = False
                    #     i = 0
                        # while not found and i < len(owner_events):
                        #     owner_event = owner_events[i]
                    if event["owner_id"] not in seen:
                        earliest_start = event["start_time"]
                        latest_end = event["end_time"]

                        # this is to make sure we're not overlapping with previous suggested events
                        if len(suggested_events) > 0:
                            earliest_start = max(earliest_start, suggested_events[-1]["end_time"])

                        time_diff = latest_end - earliest_start

                        # if there is a 1 hour overlap, then created a suggested event
                        if time_diff.total_seconds() < 3600:
                            overlap = True

                        attendee_user = CustomUser.objects.get(pk=event["owner_id"])

                        suggested_events.append({
                            "name": "suggested: " + attendee_user.first_name,
                            "event_type": "FN",
                            "calendar": calendar.pk,
                            "start_time": earliest_start,
                            "end_time": earliest_start + timedelta(hours=1),
                            "owner": attendee_user.pk,
                        })

                        seen.add(event["owner_id"])
                        # found = True
                    
                    # i += 1

                return Response({"suggested_events": suggested_events, "overlap": overlap})
            
            else:
                # sort events by earliest finish time
                attendee_events = Event.objects.filter(calendar=calendar).exclude(owner=user).order_by('end_time').values()

                # create these and return these events but don't save them, only save when finalizing
                suggested_events = []

                # give each attendee only one suggested event
                seen = set()

                # make sure new suggested does not overlap with the previous suggested time
                for event in attendee_events:
                    # if event["owner_id"] not in seen:
                    #     found = False
                    #     i = 0
                        # while not found and i < len(owner_events):
                        #     owner_event = owner_events[i]
                    if event["owner_id"] not in seen:
                        earliest_start = event["start_time"]
                        latest_end = event["end_time"]

                        # this is to make sure we're not overlapping with previous suggested events
                        if len(suggested_events) > 0:
                            earliest_start = max(earliest_start, suggested_events[-1]["end_time"])

                        time_diff = latest_end - earliest_start

                        # if there is a 1 hour overlap, then created a suggested event
                        if time_diff.total_seconds() < 3600:
                            overlap = True

                        attendee_user = CustomUser.objects.get(pk=event["owner_id"])

                        suggested_events.append({
                            "name": "suggested: " + attendee_user.first_name,
                            "event_type": "FN",
                            "calendar": calendar.pk,
                            "start_time": latest_end - timedelta(hours=1),
                            "end_time": latest_end,
                            "owner": attendee_user.pk,
                        })

                        seen.add(event["owner_id"])

                return Response({"suggested_events": suggested_events, "overlap": overlap})


        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class FinalizeCalendarAPIView(APIView):
    """
    Endpoint: /calendars/{calendar_id}/finalize/
    Method: POST
    Example Payload: 
        {
            events:[{start_time: , end_time: , owner: , calendar: , event_type: FN}]
        }
    """

    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, calendar_id):
        calendar = Calendar.objects.get(pk=calendar_id)

        if calendar.is_finalized:
            return Response({"status" : status.HTTP_400_BAD_REQUEST, "message" :"This calendar is already finalized"})

        # given list of final meeting events as json, create and save them to the database
        data = json.loads(request.data["events"])
        events = data

        # 2024-03-15T12:20:00Z
        events.sort(key=lambda e: datetime.strptime(e["end_time"], "%Y-%m-%dT%H:%M:%SZ"))

        # check for overlaps
        for i in range(1, len(events)):
            start = datetime.strptime(events[i]["start_time"], "%Y-%m-%dT%H:%M:%SZ")
            prev_end = datetime.strptime(events[i - 1]["end_time"], "%Y-%m-%dT%H:%M:%SZ")
            if start < prev_end:
                return Response({"status":status.HTTP_400_BAD_REQUEST, "message": "There are overlaps in the final meeting times"})

        # create the events
        serializer = EventSerializer()

        for e in events:
            attendee_user = CustomUser.objects.get(pk=e["owner"])
            serializer.create({
                "name": attendee_user.first_name,
                "event_type": "FN",
                "calendar": calendar,
                "start_time": e["start_time"],
                "end_time": e["end_time"],
                "owner": attendee_user,
            })

        # set calendar to finalized
        calendar.is_finalized = True

        calendar.save()

        # maybe delete all the other events
        old_events = Event.objects.filter(calendar=calendar).exclude(event_type=EventType.FINAL)
        
        for e in old_events:
            e.delete()
        
        return Response({"message":"calendar finalized"})

        
class GetAllEventsInCalendar(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id):
        calendar = get_object_or_404(Calendar, pk=calendar_id)

        if request.user == calendar.owner:
            events = Event.objects.filter(calendar=calendar)
            serialized = []

            for e in events:
                serialized.append(EventSerializer(e).data)

            return Response({"events": serialized})
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

class GetEventsForInvitee(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, calendar_id, invitee_id):
        # Retrieve the calendar object
        calendar = get_object_or_404(Calendar, pk=calendar_id)
        
        # Check if the logged-in user is the invitee of the calendar
        if invitee_id != request.user.id:
            return Response({"error": "You are not authorized to view this calendar's events."}, status=403)
        
        # Retrieve the events added by the invitee for the calendar
        events = Event.objects.filter(calendar=calendar, owner=request.user)
        
        # Serialize the events data
        serialized_events = EventSerializer(events, many=True).data
        
        # Return the serialized events
        return Response({"events": serialized_events})
    
class DeleteEventView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, event_id):

        event = get_object_or_404(Event, pk=event_id)
        if request.user == event.owner:
            event.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
