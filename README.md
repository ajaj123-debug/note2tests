# Note2Test

**Note2Test** is an AI-powered quiz generation platform that allows users to upload study documents (PDFs) and automatically generate quizzes using Google's Gemini API. Users can register/login using Google OAuth, view their quizzes, and attempt them interactively.

---

## Features

- Upload PDFs and automatically extract text.
- Generate quizzes in JSON format using Gemini AI.
- JWT-based authentication using Google OAuth or username/password.
- View, delete, and manage user-specific quizzes.
- REST API endpoints with authentication.
- React frontend (hosted on Vercel) communicates securely with Django backend.

---

## Tech Stack

- **Backend:** Django 5, Django REST Framework, PyMuPDF (fitz), Google Gemini API
- **Authentication:** JWT (djangorestframework-simplejwt), Google OAuth
- **Frontend:** React (Vite recommended)
- **Database:** SQLite (development) / Postgres recommended for production
- **Hosting:** Render (backend) + Vercel (frontend)
- **Environment Variables:** `.env` file or Render environment

---

## Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/ajaj123-debug/note2tests.git
cd note2test/backend
````

2. **Create a virtual environment**

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Set environment variables**

Create a `.env` file in `backend/`:

```
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
SECRET_KEY=your_django_secret_key
DEBUG=True
```

5. **Run migrations**

```bash
python manage.py migrate
```

6. **Run server**

```bash
python manage.py runserver
```

Backend API will run at: `http://127.0.0.1:8000/`

---

## API Endpoints

| Endpoint                 | Method | Description                                           |
| ------------------------ | ------ | ----------------------------------------------------- |
| `/auth/google/`          | POST   | Login/register via Google OAuth                       |
| `/api/token/`            | POST   | Obtain JWT token                                      |
| `/api/token/refresh/`    | POST   | Refresh JWT token                                     |
| `/api/upload/`           | POST   | Upload PDF & generate quiz (public or auth-protected) |
| `/api/generate-quiz/`    | POST   | Authenticated endpoint to generate and save quiz      |
| `/api/quizzes/<id>/`     | GET    | Retrieve details of a quiz                            |
| `/api/user-quizzes/`     | GET    | Retrieve all quizzes of authenticated user            |
| `/api/delete-quiz/<id>/` | DELETE | Delete a quiz owned by user                           |

---

## Frontend

Frontend is implemented in React and connects to backend via API. Recommended hosting on **Vercel**. Ensure `CORS_ALLOWED_ORIGINS` in Django matches the frontend URL.

---

## Important Notes

* **PDF Parsing:** Uses PyMuPDF (`fitz`) for text extraction.
* **Gemini API:** Ensure `GEMINI_API_KEY` is valid.
* **Authentication:** JWT access tokens must be included in `Authorization` header as `Bearer <token>`.
* **Error Handling:** The backend gracefully handles invalid PDFs, empty content, or invalid Gemini API responses.

---

## Deployment

**Backend (Render):**

* Root directory: `backend/`
* Build command: `pip install -r requirements.txt`
* Start command: `gunicorn note2test.wsgi:application --log-file -`
* Environment variables: `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `SECRET_KEY`

**Frontend (Vercel):**

* Point to React app directory.
* Set API URL in frontend environment variables.

---

## Author

Ajaj – Final Year Engineering Student
[GitHub](https://github.com/ajaj123-debug)