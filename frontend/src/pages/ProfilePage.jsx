import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaTrash, 
  FaEye, 
  FaCalendarAlt, 
  FaQuestionCircle, 
  FaTrophy, 
  FaPlus,
  FaUser,
  FaBook,
  FaChartBar,
  FaClock,
  FaEdit
} from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchQuizzes = async () => {
    if (!token) {
      setError("Please log in to view your quizzes.");
      setIsLoading(false);
      return;
    }

    try {
      let res = await fetch(" https://note2tests.onrender.com/api/user-quizzes/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 && refreshToken) {
        const refreshRes = await fetch(
          " https://note2tests.onrender.com/api/token/refresh/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          }
        );

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem("access_token", data.access);

          res = await fetch(" https://note2tests.onrender.com/api/user-quizzes/", {
            headers: { Authorization: `Bearer ${data.access}` },
          });
        }
      }

      if (!res.ok) throw new Error("Failed to fetch quizzes");
      const data = await res.json();
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (quizId, e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    setLoadingDelete(quizId);
    try {
      const res = await fetch(
        ` https://note2tests.onrender.com/api/delete-quiz/${quizId}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete quiz");

      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingDelete(null);
    }
  };

  const getTotalQuestions = () => {
    return quizzes.reduce((total, quiz) => total + (quiz.questions ? quiz.questions.length : 0), 0);
  };

  const getAverageQuestions = () => {
    if (quizzes.length === 0) return 0;
    return Math.round(getTotalQuestions() / quizzes.length);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} handleLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-500 text-sm">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} handleLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Error</h3>
                <div className="mt-1 text-sm text-gray-600">{error}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <FaUser className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {user?.name || 'My Profile'}
                  </h1>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/upload')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FaPlus className="w-4 h-4" />
                <span>New Quiz</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <FaBook className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Quizzes</p>
                <p className="text-xl font-semibold text-gray-900">{quizzes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FaQuestionCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-xl font-semibold text-gray-900">{getTotalQuestions()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <FaChartBar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg per Quiz</p>
                <p className="text-xl font-semibold text-gray-900">{getAverageQuestions()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Your Quizzes</h2>
              <span className="text-sm text-gray-500">
                {quizzes.length} quiz{quizzes.length !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>

          {quizzes.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
              <p className="text-gray-600 mb-6 text-sm">Create your first quiz to get started</p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Create First Quiz
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {quiz.title || 'Untitled Quiz'}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {quiz.questions ? quiz.questions.length : 0} questions
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FaClock className="w-3 h-3" />
                          <span>{formatDate(quiz.generated_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                        title="Take Quiz"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                        disabled={loadingDelete === quiz.id}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors disabled:opacity-50"
                        title="Delete Quiz"
                      >
                        {loadingDelete === quiz.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <FaTrash className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}