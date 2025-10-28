import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Toast = ({ message, onClose, action }) => {
    React.useEffect(() => {
        if (!action) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [onClose, action]);

    return (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
            <span>{message}</span>
            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-white text-blue-500 px-3 py-1 rounded font-medium hover:bg-gray-100 transition"
                >
                    {action.label}
                </button>
            )}
            <button onClick={onClose} className="ml-2 hover:text-gray-200">✕</button>
        </div>
    );
};

const HomePage = ({ user, onLogout }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quizConfig, setQuizConfig] = useState({
        amount: '10',
        difficulty: 'easy',
        timer: '5'
    });
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        checkResumeQuiz();
    }, []);

    const checkResumeQuiz = () => {
        const savedProgress = localStorage.getItem('quizProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            if (progress.questions && progress.currentIndex < progress.questions.length) {
                setToast({
                    message: 'You have an incomplete quiz. Resume from where you left off!',
                    action: {
                        label: 'Resume',
                        onClick: () => navigate('/quiz')
                    }
                });
            }
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://opentdb.com/api_category.php');
            const data = await response.json();
            setCategories(data.trivia_categories || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = async (category) => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                amount: quizConfig.amount,
                category: category.id,
                difficulty: quizConfig.difficulty
            });

            const response = await fetch(`https://opentdb.com/api.php?${params}`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const quizData = {
                    category: category.name,
                    questions: data.results,
                    currentIndex: 0,
                    answers: [],
                    timer: parseInt(quizConfig.timer) * 60,
                    startTime: Date.now()
                };
                localStorage.setItem('quizProgress', JSON.stringify(quizData));
                navigate('/quiz');
            } else {
                setToast({ message: 'No questions available for this configuration' });
            }
        } catch (error) {
            setToast({ message: 'Failed to start quiz' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && <Toast message={toast.message} action={toast.action} onClose={() => setToast(null)} />}

            <nav className="border-b bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }} data-testid="app-title">
                        Quiz Master
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600" data-testid="user-welcome">Welcome, {user.username}</span>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                            data-testid="logout-button"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Choose Your Quiz</h2>
                    <p className="text-gray-600">Select a category and configure your quiz settings</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8" data-testid="quiz-config-card">
                    <h3 className="text-lg font-semibold mb-1">Quiz Configuration</h3>
                    <p className="text-sm text-gray-600 mb-4">Customize your quiz experience</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Number of Questions
                            </label>
                            <select
                                value={quizConfig.amount}
                                onChange={(e) => setQuizConfig({ ...quizConfig, amount: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                data-testid="question-count-select"
                            >
                                <option value="5">5 Questions</option>
                                <option value="10">10 Questions</option>
                                <option value="15">15 Questions</option>
                                <option value="20">20 Questions</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                Difficulty
                            </label>
                            <select
                                value={quizConfig.difficulty}
                                onChange={(e) => setQuizConfig({ ...quizConfig, difficulty: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                data-testid="difficulty-select"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Timer (minutes)
                            </label>
                            <select
                                value={quizConfig.timer}
                                onChange={(e) => setQuizConfig({ ...quizConfig, timer: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                data-testid="timer-select"
                            >
                                <option value="3">3 Minutes</option>
                                <option value="5">5 Minutes</option>
                                <option value="10">10 Minutes</option>
                                <option value="15">15 Minutes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-600">Loading categories...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow p-6"
                                data-testid={`category-card-${category.id}`}
                            >
                                <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                                <button
                                    onClick={() => startQuiz(category)}
                                    className="w-full py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                    data-testid={`start-quiz-button-${category.id}`}
                                >
                                    Start Quiz
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;