from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import CharField
from rest_framework import serializers
from .models import Calendar, Event, EventType
from users.models import Attendee
from .models import Calendar, Event

class CalendarSerializer(ModelSerializer):
    calendar_id = serializers.IntegerField(source='id', read_only=True)
    is_finalized = False
    class Meta:
        model = Calendar
        fields = ['calendar_id', 'name', 'start_date', 'end_date', 'deadline', 'owner', 'is_finalized']
        read_only_fields = ('owner',)
    
    def validate(self, data):
        """
        Custom validation for the serializer.
        """
        # TODO: Add validation logic here
        if data['end_date'] <= data['start_date']:
            raise serializers.ValidationError("End date must be greater than start date.")
        return data
    

class EventSerializer(ModelSerializer):
    event_id = serializers.IntegerField(source='id', read_only=True)
    class Meta:
        model = Event
        fields = ['event_id', 'name', 'start_time', 'end_time', 'event_type', 'owner', 'calendar']
        read_only_fields = ("owner", )
    
    def validate(self, data):
        """
        Custom validation for the serializer.
        """
        # TODO: Add validation logic here
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End date must be greater than start date.")
        
        calendar = data["calendar"]
        attendee = Attendee.objects.filter(user=self.context['request'].user, calendar = calendar)

        # for now, don't let people add "final events"
        if data["event_type"] == EventType.FINAL:
            raise serializers.ValidationError("Cannot add final type event")

        # is owner
        if self.context['request'].user == calendar.owner:
            data["name"] = "self " + data["event_type"]
        
        # is attendee
        elif len(attendee) >= 1:
            data["name"] = self.context['request'].user.first_name + " " + data["event_type"]
            attendee[0].accepted = True
            attendee[0].save()

        else:
            raise serializers.ValidationError("You don't have access to this calendar")
        

        if calendar.owner == self.context['request'].user:
            data["name"] = "self " + data["event_type"]

        # add check to make sure time is within calendar start and end date
        return data

class AttendeeSerializer(ModelSerializer):
    attendee_id = serializers.IntegerField(source='id', read_only=True)
    class Meta:
        model = Attendee
        fields = ['attendee_id', 'accepted', 'user', 'calendar']

    def validate(self, data):
        """
        Custom validation for the serializer.
        """
        
        calendar = data["calendar"]


        if calendar.owner != self.context['request'].user:
             raise serializers.ValidationError("User must be owner of calendar")

        if data['user'] == self.context['request'].user:
             raise serializers.ValidationError("Cannot invite calendar owner")
        
        if len(Attendee.objects.filter(user=data['user'], calendar = calendar)) > 0:
            raise serializers.ValidationError("User has already been invited")
        
        return data

class RemindAttendeeSerializer(ModelSerializer):
    attendee_id = serializers.IntegerField(source='id', read_only=True)
    class Meta:
        model = Attendee
        fields = ['attendee_id', 'user', 'calendar']

    def validate(self, data):
        """
        Custom validation for the serializer.
        """
        
        calendar = data["calendar"]

        if calendar.owner != self.context['request'].user:
             raise serializers.ValidationError("User must be owner of calendar")

        if data['user'] == self.context['request'].user:
             raise serializers.ValidationError("Cannot remind calendar owner")
        
        # if data['attendee_id'] == self.context['request'].user:
        #     raise serializers.ValidationError("Attendee already provided information")
        return data
    