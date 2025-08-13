from django.contrib import admin
from django.urls import path
from api.views import QuizDetailView, generate_quiz, upload_pdf
from api.views import google_login
from api.views import user_quizzes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import delete_quiz


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/upload/", upload_pdf, name="upload_pdf"),
    path('api/generate-quiz/', generate_quiz, name='generate_quiz'),
    path('api/quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('auth/google/', google_login, name='google-login'),
    path('api/user-quizzes/', user_quizzes, name='user-quizzes'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/delete-quiz/<int:quiz_id>/', delete_quiz, name='delete-quiz'),
]
