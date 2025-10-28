import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizPage = ({ user }) => {
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedProgress = localStorage.getItem('quizProgress');
        if (!savedProgress) {
            navigate('/');
            return;
        }

        const progress = JSON.parse(savedProgress);
        setQuizData(progress);
        setCurrentQuestion(progress.questions[progress.currentIndex]);

        const elapsed = Math.floor((Date.now() - progress.startTime) / 1000);
        const remaining = Math.max(0, progress.timer - elapsed);
        setTimeRemaining(remaining);
    }, [navigate]);

    useEffect(() => {
        if (timeRemaining <= 0 && quizData) {
            handleQuizEnd();
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, quizData]);

    const handleQuizEnd = useCallback(() => {
        if (!quizData) return;

        const results = {
            category: quizData.category,
            total: quizData.questions.length,
            attempted: quizData.answers.length,
            correct: quizData.answers.filter((a) => a.isCorrect).length,
            incorrect: quizData.answers.filter((a) => !a.isCorrect).length
        };

        localStorage.setItem('quizResults', JSON.stringify(results));
        localStorage.removeItem('quizProgress');
        navigate('/result');
    }, [quizData, navigate]);

    const handleAnswer = (answer) => {
        if (!quizData || !currentQuestion) return;

        setSelectedAnswer(answer);

        setTimeout(() => {
            const isCorrect = answer === currentQuestion.correct_answer;
            const updatedAnswers = [
                ...quizData.answers,
                {
                    question: currentQuestion.question,
                    selectedAnswer: answer,
                    correctAnswer: currentQuestion.correct_answer,
                    isCorrect
                }
            ];

            const nextIndex = quizData.currentIndex + 1;

            if (nextIndex >= quizData.questions.length) {
                const results = {
                    category: quizData.category,
                    total: quizData.questions.length,
                    attempted: updatedAnswers.length,
                    correct: updatedAnswers.filter((a) => a.isCorrect).length,
                    incorrect: updatedAnswers.filter((a) => !a.isCorrect).length
                };

                localStorage.setItem('quizResults', JSON.stringify(results));
                localStorage.removeItem('quizProgress');
                navigate('/result');
            } else {
                const updatedQuizData = {
                    ...quizData,
                    currentIndex: nextIndex,
                    answers: updatedAnswers
                };

                localStorage.setItem('quizProgress', JSON.stringify(updatedQuizData));
                setQuizData(updatedQuizData);
                setCurrentQuestion(updatedQuizData.questions[nextIndex]);
                setSelectedAnswer(null);
            }
        }, 500);
    };

    if (!quizData || !currentQuestion) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const allAnswers = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer
    ].sort(() => Math.random() - 0.5);

    const progress = ((quizData.currentIndex + 1) / quizData.questions.length) * 100;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }} data-testid="quiz-category">
                                {quizData.category}
                            </h1>
                            <p className="text-sm text-gray-600" data-testid="quiz-progress">
                                Question {quizData.currentIndex + 1} of {quizData.questions.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-semibold" data-testid="timer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className={timeRemaining < 60 ? 'text-red-600' : ''}>
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2" data-testid="quiz-progress-bar">
                        <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%`, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        ></div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8" data-testid="question-card">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-semibold" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} data-testid="question-text" />
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap capitalize" data-testid="question-difficulty">
                            {currentQuestion.difficulty}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {allAnswers.map((answer, index) => {
                            const isSelected = selectedAnswer === answer;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(answer)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${isSelected
                                            ? 'border-transparent text-white'
                                            : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                                        } ${selectedAnswer !== null && !isSelected ? 'opacity-50' : ''}`}
                                    style={isSelected ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } : {}}
                                    data-testid={`answer-option-${index}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span dangerouslySetInnerHTML={{ __html: answer }} />
                                        {isSelected && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p data-testid="attempted-count">Attempted: {quizData.answers.length} / {quizData.questions.length}</p>
                </div>
            </main>
        </div>
    );
};

export default QuizPage;