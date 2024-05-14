from django.db import models
from django.conf import settings
from django.utils.translation import gettext as _

class Calendar(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    deadline = models.DateField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_finalized = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return f"Calendar {self.name}"

class EventType(models.TextChoices):
    HIGHPREF = "HP", _("High Pref")
    LOWPREF = "LP", _("Low Pref")
    FINAL = "FN", _("Final") 

class Event(models.Model):
    class EventType(models.TextChoices):
        HIGHPREF = "HP", _("High Pref")
        LOWPREF = "LP", _("Low Pref")
        FINAL = "FN", _("Final")

    name = models.CharField(max_length=50)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    # date = models.DateField()
    last_modified = models.TimeField(auto_now=True)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event_type = models.CharField(
        max_length=50,
        choices=EventType.choices
    )

    def isPlanEvent(self):
        return self.event_type in {
            self.EventType.HIGHPREF,
            self.EventType.LOWPREF,
        } 
    
    def __str__(self) -> str:
        return f"Event {self.name}"
    
