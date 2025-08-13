import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const questionRefs = useRef([]);
  const startTime = useRef(Date.now());

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };
  const [score, setScore] = useState(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`http://localhost:8000/api/quizzes/${id}/`);
        if (!res.ok) {
          const text = await res.text();
          setError(`Failed to fetch quiz: ${text}`);
          return;
        }
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        setError('Network error: ' + err.message);
      }
    }
    fetchQuiz();
  }, [id]);

  // Update active question based on scroll position (desktop only)
  useEffect(() => {
    function onScroll() {
      if (!questionRefs.current || window.innerWidth < 768) return; // Only on desktop
      const offsets = questionRefs.current.map(ref =>
        ref ? ref.getBoundingClientRect().top : Infinity
      );
      const visibleIndex = offsets.findIndex(offset => offset > 100);
      const activeIdx = visibleIndex === -1 ? quiz.questions.length - 1 : Math.max(0, visibleIndex - 1);
      setActiveQuestion(activeIdx);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [quiz]);

  const toggleOption = (qIdx, optIdx) => {
    if (isSubmitted) return; // Prevent changes after submission
    setAnswers(prev => {
      const selected = prev[qIdx] || [];
      if (selected.includes(optIdx)) {
        return { ...prev, [qIdx]: selected.filter(i => i !== optIdx) };
      } else {
        return { ...prev, [qIdx]: [...selected, optIdx] };
      }
    });
  };

  const handleSubmit = () => {
  if (!quiz) return;

  let score = 0;
  const total = quiz.questions.length;

  quiz.questions.forEach((question, qIdx) => {
      const correctAnswer = question.answer;
    const userSelectedIndexes = answers[qIdx] || [];

    let correctIndex;
    if (typeof correctAnswer === 'string') {
      correctIndex = question.options.indexOf(correctAnswer);
    } else {
        correctIndex = correctAnswer;
    }

    if (userSelectedIndexes.length === 1 && userSelectedIndexes[0] === correctIndex) {
      score += 1;
    }
    });

    setScore(score);
    setIsSubmitted(true);
    setShowResults(true);
  };

  const scrollToQuestion = (index) => {
    if (questionRefs.current[index]) {
      questionRefs.current[index].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      setActiveQuestion(index);
      setShowMobileNav(false); // Close mobile nav after selection
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!quiz) return 0;
    return (Object.keys(answers).length / quiz.questions.length) * 100;
  };

  const isQuestionAnswered = (qIdx) => {
    return answers[qIdx] && answers[qIdx].length > 0;
  };

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

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} handleLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-500 text-sm">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Progress Bar */}
        <div className="md:hidden mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Object.keys(answers).length}/{quiz.questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">Time: {formatTime(timeSpent)}</span>
              <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                {showMobileNav ? 'Hide' : 'Show'} Navigator
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Question Navigator */}
        {showMobileNav && (
          <div className="md:hidden mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Question Navigator</h3>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {quiz.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToQuestion(idx)}
                    className={`p-2 rounded text-xs font-medium transition-all duration-200 ${
                      idx === activeQuestion 
                        ? 'bg-blue-600 text-white' 
                        : isQuestionAnswered(idx)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title || 'Quiz'}</h1>
                    <p className="text-gray-600">{quiz.questions.length} questions</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Time: {formatTime(timeSpent)}
                    </div>
                    <div className="hidden sm:block text-sm text-gray-500">
                      Progress: {Object.keys(answers).length}/{quiz.questions.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="p-6">
          {quiz.questions.map((q, qIdx) => (
            <section
              key={qIdx}
              ref={el => (questionRefs.current[qIdx] = el)}
              id={`question-${qIdx}`}
                    className={`mb-6 p-4 sm:p-6 rounded-lg border-2 transition-all duration-300 ${
                      qIdx === activeQuestion 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isQuestionAnswered(qIdx) ? 'bg-green-50 border-green-300' : ''}`}
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                          Q{qIdx + 1}
                        </span>
                        {isQuestionAnswered(qIdx) && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {qIdx + 1} of {quiz.questions.length}
                      </span>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-relaxed">
                      {q.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-2 sm:space-y-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = answers[qIdx]?.includes(optIdx) || false;
                        const isCorrect = showResults && optIdx === (typeof q.answer === 'string' ? q.options.indexOf(q.answer) : q.answer);
                        const isWrong = showResults && isSelected && !isCorrect;
                        
                        return (
                          <label 
                            key={optIdx} 
                            className={`block cursor-pointer select-none transition-all duration-200 ${
                              isSubmitted ? 'cursor-default' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                              isSelected 
                                ? isCorrect 
                                  ? 'border-green-500 bg-green-50' 
                                  : isWrong 
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-blue-500 bg-blue-50'
                                : isCorrect && showResults
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="flex items-center">
                                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                                  isSelected 
                                    ? isCorrect 
                                      ? 'border-green-500 bg-green-500' 
                                      : isWrong 
                                        ? 'border-red-500 bg-red-500'
                                        : 'border-blue-500 bg-blue-500'
                                    : isCorrect && showResults
                                      ? 'border-green-500 bg-green-500'
                                      : 'border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                  {isCorrect && showResults && !isSelected && (
                                    <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <span className={`text-gray-900 text-sm sm:text-base ${
                                  isCorrect && showResults ? 'font-semibold' : ''
                                }`}>
                                  {opt}
                                </span>
                                {showResults && isCorrect && (
                                  <span className="ml-auto text-green-600 font-semibold text-sm">✓</span>
                                )}
                                {showResults && isWrong && (
                                  <span className="ml-auto text-red-600 font-semibold text-sm">✗</span>
                                )}
                              </div>
                            </div>
                    <input
                      type="checkbox"
                              checked={isSelected}
                      onChange={() => toggleOption(qIdx, optIdx)}
                              className="sr-only"
                              disabled={isSubmitted}
                    />
                  </label>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              {/* Submit Button */}
              {!isSubmitted && (
                <div className="p-4 sm:p-6 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
                    disabled={Object.keys(answers).length === 0}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                      Object.keys(answers).length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg'
                    }`}
                  >
                    Submit Quiz
          </button>
          </div>
)}

              {/* Results */}
              {showResults && (
                <div className="p-4 sm:p-6 border-t bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Quiz Completed!
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-4">
                      You scored <span className="font-bold text-blue-600">{score}</span> out of <span className="font-bold">{quiz.questions.length}</span>
                    </p>
                    <div className="text-sm text-gray-500">
                      Time taken: {formatTime(timeSpent)}
                    </div>
                  </div>
                </div>
              )}
            </div>
        </main>

          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Question Navigator
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
            {quiz.questions.map((_, idx) => (
                <button
                    key={idx}
                  onClick={() => scrollToQuestion(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                      idx === activeQuestion 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : isQuestionAnswered(idx)
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="font-medium">Question {idx + 1}</span>
                    <div className="flex items-center space-x-2">
                      {isQuestionAnswered(idx) && (
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {idx === activeQuestion && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                </button>
                ))}
              </div>

              {/* Progress Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Object.keys(answers).length}/{quiz.questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
        </aside>
        </div>
      </div>
    </div>
  );
}