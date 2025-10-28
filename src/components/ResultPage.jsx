import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultPage = ({ user, onLogout }) => {
    const [results, setResults] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedResults = localStorage.getItem('quizResults');
        if (!savedResults) {
            navigate('/');
            return;
        }
        setResults(JSON.parse(savedResults));
    }, [navigate]);

    const handleReturnHome = () => {
        localStorage.removeItem('quizResults');
        navigate('/');
    };

    if (!results) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const percentage = results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0;

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8" data-testid="result-card">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" data-testid="trophy-icon">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                        Quiz Completed!
                    </h1>
                    <p className="text-gray-600" data-testid="result-category">{results.category}</p>
                </div>

                <div className="text-center mb-8">
                    <div
                        className="text-6xl font-bold mb-2"
                        style={{
                            fontFamily: 'Space Grotesk',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                        data-testid="score-percentage"
                    >
                        {percentage}%
                    </div>
                    <p className="text-gray-600">Score</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                        <svg className="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-2xl font-bold" data-testid="correct-count">{results.correct}</div>
                        <div className="text-sm text-gray-600">Correct</div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                        <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-2xl font-bold" data-testid="incorrect-count">{results.incorrect}</div>
                        <div className="text-sm text-gray-600">Incorrect</div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                        <svg className="w-8 h-8 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-2xl font-bold" data-testid="attempted-count">{results.attempted}</div>
                        <div className="text-sm text-gray-600">Attempted</div>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-600 mb-6" data-testid="total-questions">
                    Total Questions: {results.total}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleReturnHome}
                        className="flex-1 py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        data-testid="return-home-button"
                    >
                        Take Another Quiz
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition"
                        data-testid="logout-button"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;