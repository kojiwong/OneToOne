from django.db import models
from django.conf import settings
from calendars.models import Calendar
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.db import models

# Create your models here.
class Attendee(models.Model):
    status = models.BooleanField(default=False)
    accepted = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return f"Attendee {self.id}"
    

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, first_name=None, last_name=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        if not first_name:
            raise ValueError('The First Name field must be set')
        if not last_name:
            raise ValueError('The Last Name field must be set')
        user = self.model(username=username, email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)  # This field is implicitly included in AbstractBaseUser
    contacts = models.ManyToManyField('self', symmetrical=False, related_name='user_contacts', blank=True)

    objects = CustomUserManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return self.username
# custom user model
# has friends
# has calendars
# is like regular user (inherits from User)
