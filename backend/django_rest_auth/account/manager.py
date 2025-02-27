from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError(_("Invalid email address"))
    
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("The Email field must be set"))
        if not first_name:
            raise ValueError(_("The first name field must be set"))
        if not last_name:
            raise ValueError(_("The last name field must be set"))
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_("is staff must be true for superuser"))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_("is superuser must be true for admin user"))
        user = self.create_user(email, first_name, last_name, password, **extra_fields)
        user.save(using=self._db)
        return user