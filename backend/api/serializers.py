from rest_framework import serializers
from .models import Quiz

class QuizSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions', 'generated_at']

    def get_questions(self, obj):
        # obj.questions is the stored JSON object with "questions" key
        if obj.questions and isinstance(obj.questions, dict):
            return obj.questions.get("questions", [])
        return []
