from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.db import models
from django.contrib.postgres.fields import JSONField  # If using PostgreSQL

class Quiz(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    pdf_file = models.FileField(upload_to='pdfs/')
    generated_at = models.DateTimeField(auto_now_add=True)
    questions = models.JSONField()  # stores quiz questions and answers as JSON

    def __str__(self):
        return self.title


