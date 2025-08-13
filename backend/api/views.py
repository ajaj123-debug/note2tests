import fitz  # PyMuPDF
import logging
from django.shortcuts import render

# Create your views here.
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
import google.generativeai as genai


import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from dotenv import load_dotenv
import google.generativeai as genai

from .models import Quiz

def extract_pdf_text(file):
    """Reads a PDF file and returns its text."""
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def generate_quiz_from_text(text):
    """Uses Gemini API to generate a quiz JSON from text."""
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""
    Generate a JSON quiz from this text. 
    Format:
    {{
      "questions": [
        {{
          "question": "...",
          "options": ["...", "...", "...", "..."],
          "answer": "..."
        }}
      ]
    }}
    Text:
    {text}
    """
    response = model.generate_content(prompt)
    quiz_text = response.text.strip()

    if quiz_text.startswith("```json"):
        quiz_text = quiz_text[len("```json"):].strip()
    if quiz_text.endswith("```"):
        quiz_text = quiz_text[:-3].strip()

    return json.loads(quiz_text)


load_dotenv()
genai.configure(api_key=settings.GEMINI_API_KEY)

@csrf_exempt
@csrf_exempt
def upload_pdf(request):
    if request.method == "POST":
        pdf_file = request.FILES.get("file")
        if not pdf_file:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        text = extract_pdf_text(pdf_file)
        quiz_json = generate_quiz_from_text(text)

        return JsonResponse(quiz_json)

    return JsonResponse({"error": "Invalid request"}, status=400)



genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def generate_quiz(request):
    if request.method == "POST":
        doc_file = request.FILES.get('document')
        if not doc_file:
            return JsonResponse({"error": "No document uploaded"}, status=400)

        text = extract_pdf_text(doc_file)

        if not text.strip():
            return JsonResponse({"error": "Uploaded document has no extractable text"}, status=400)

        quiz_json = generate_quiz_from_text(text)

        doc_file.seek(0)
        user = request.user

        filename = os.path.splitext(doc_file.name)[0]
        quiz = Quiz.objects.create(
            user=user,
            title=filename or "Generated Quiz",
            pdf_file=doc_file,
            questions=quiz_json
        )

        return JsonResponse({
            "id": quiz.id,
            "title": quiz.title,
            "questions": quiz.questions.get("questions", [])
        })

    return JsonResponse({"error": "Invalid request"}, status=400)




from rest_framework.generics import RetrieveAPIView
from .models import Quiz
from .serializers import QuizSerializer

class QuizDetailView(RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from django.conf import settings

@api_view(['POST'])
def google_login(request):
    token = request.data.get('token')
    if not token:
        return Response({'error': 'No token provided'}, status=400)
    
    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
        
        
        # Extract user info
        google_user_id = idinfo['sub']
        email = idinfo.get('email')
        name = idinfo.get('name', email.split('@')[0])
        
        # Get or create Django user
        user, created = User.objects.get_or_create(username=email, defaults={'email': email, 'first_name': name})
        
        # Create JWT tokens for this user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
            }
        })
        
    except ValueError as e:
        logging.exception("Google token verification failed")
        return Response({'error': f'Invalid token: {str(e)}'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_quizzes(request):
    user = request.user
    quizzes = Quiz.objects.filter(user=user).order_by('-generated_at')
    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_quiz(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id, user=request.user)
        quiz.delete()
        return Response({"message": "Quiz deleted successfully"}, status=204)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=404)




# import logging
# from django.shortcuts import render

# # Create your views here.
# import json
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.core.files.storage import default_storage
# import google.generativeai as genai


# import os
# import json
# import fitz  # PyMuPDF
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.conf import settings
# from dotenv import load_dotenv
# import google.generativeai as genai

# from .models import Quiz

# load_dotenv()
# genai.configure(api_key=settings.GEMINI_API_KEY)

# @csrf_exempt
# def upload_pdf(request):
#     if request.method == "POST":
#         pdf_file = request.FILES.get("file")
#         if not pdf_file:
#             return JsonResponse({"error": "No file uploaded"}, status=400)

#         # Read PDF text
#         doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
#         text = ""
#         for page in doc:
#             text += page.get_text()

#         # Prompt Gemini for quiz generation
#         model = genai.GenerativeModel("gemini-1.5-flash")
#         prompt = f"""
#         Generate a JSON quiz from this text. 
#         Format:
#         {{
#           "questions": [
#             {{
#               "question": "...",
#               "options": ["...", "...", "...", "..."],
#               "answer": "..."
#             }}
#           ]
#         }}
#         Text:
#         {text}
#         """

#         response = model.generate_content(prompt)
#         quiz_json = json.loads(response.text)

#         return JsonResponse(quiz_json)

#     return JsonResponse({"error": "Invalid request"}, status=400)



# genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# from rest_framework.permissions import IsAuthenticated
# from rest_framework.decorators import api_view, permission_classes
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# @csrf_exempt
# def generate_quiz(request):
#     if request.method == "POST":
#         doc_file = request.FILES.get('document')
#         if not doc_file:
#             return JsonResponse({"error": "No document uploaded"}, status=400)
        
#         try:
#             import fitz
#             doc = fitz.open(stream=doc_file.read(), filetype="pdf")
#             text = ""
#             for page in doc:
#                 text += page.get_text()
#             extracted_text = text
            
#             if not extracted_text.strip():
#                 return JsonResponse({"error": "Uploaded document has no extractable text"}, status=400)

#             # Gemini prompt as before
#             model = genai.GenerativeModel("gemini-1.5-flash")
#             prompt = f"""
#             Generate a quiz in JSON format from the following text:
#             {extracted_text}
#             Format:
#             {{
#               "questions": [
#                 {{"question": "...", "options": ["opt1","opt2","opt3","opt4"], "answer": "opt1"}}
#               ]
#             }}
#             """

#             response = model.generate_content(prompt)
#             response_text = response.text.strip()

#             if response_text.startswith("```json"):
#                 response_text = response_text[len("```json"):].strip()
#             if response_text.endswith("```"):
#                 response_text = response_text[:-3].strip()

#             quiz_json = json.loads(response_text)

#             # Save quiz with pdf file and quiz json
#             # Rewind the file for saving since you read it already
#             doc_file.seek(0)

#             user = request.user if request.user.is_authenticated else None
#             import os

#             filename = os.path.splitext(doc_file.name)[0]  # Removes extension
#             quiz = Quiz.objects.create(
#                 user=user,
#                 title=filename or "Generated Quiz",
#                 pdf_file=doc_file,
#                 questions=quiz_json
#             )


#             # Return the saved quiz (you can exclude pdf_file path if you want)
#             return JsonResponse({
#                 "id": quiz.id,
#                 "title": quiz.title,
#                 "questions": quiz.questions.get("questions", [])
#             })

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON response from Gemini API"}, status=500)
#         except Exception as e:
#             print("Error:", str(e))
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request"}, status=400)



# from rest_framework.generics import RetrieveAPIView
# from .models import Quiz
# from .serializers import QuizSerializer

# class QuizDetailView(RetrieveAPIView):
#     queryset = Quiz.objects.all()
#     serializer_class = QuizSerializer


# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from google.oauth2 import id_token
# from google.auth.transport import requests
# from django.contrib.auth.models import User
# from django.conf import settings

# @api_view(['POST'])
# def google_login(request):
#     token = request.data.get('token')
#     if not token:
#         return Response({'error': 'No token provided'}, status=400)
    
#     try:
#         # Verify the token with Google
#         idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
        
        
#         # Extract user info
#         google_user_id = idinfo['sub']
#         email = idinfo.get('email')
#         name = idinfo.get('name', email.split('@')[0])
        
#         # Get or create Django user
#         user, created = User.objects.get_or_create(username=email, defaults={'email': email, 'first_name': name})
        
#         # Create JWT tokens for this user
#         refresh = RefreshToken.for_user(user)
        
#         return Response({
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#             'user': {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'first_name': user.first_name,
#             }
#         })
        
#     except ValueError as e:
#         logging.exception("Google token verification failed")
#         return Response({'error': f'Invalid token: {str(e)}'}, status=400)


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_quizzes(request):
#     user = request.user
#     quizzes = Quiz.objects.filter(user=user).order_by('-generated_at')
#     serializer = QuizSerializer(quizzes, many=True)
#     return Response(serializer.data)

# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
# def delete_quiz(request, quiz_id):
#     try:
#         quiz = Quiz.objects.get(id=quiz_id, user=request.user)
#         quiz.delete()
#         return Response({"message": "Quiz deleted successfully"}, status=204)
#     except Quiz.DoesNotExist:
#         return Response({"error": "Quiz not found"}, status=404)
