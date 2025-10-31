import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultPage = () => {
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

    const { category, total, correct, incorrect, attempted, answers = [] } = results;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
                        Quiz Results
                    </h1>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                            Quiz Completed!
                        </h1>
                        <p className="text-gray-600">{category}</p>
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
                        >
                            {percentage}
                        </div>
                        <p className="text-gray-600">Score</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <StatCard icon="check" color="green" label="Correct" value={correct} />
                        <StatCard icon="x" color="red" label="Incorrect" value={incorrect} />
                        <StatCard icon="info" color="blue" label="Attempted" value={attempted} />
                    </div>

                    <div className="text-center text-sm text-gray-600 mb-6">
                        Total Questions: {total}
                    </div>

                    <button
                        onClick={handleReturnHome}
                        className="w-full py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        Take Another Quiz
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                        Answer Review
                    </h2>

                    {answers.length > 0 ? (
                        <div className="space-y-6">
                            {answers.map((a, index) => (
                                <div key={index} className="border rounded-lg p-5">
                                    <h3
                                        className="font-medium text-lg mb-3"
                                        dangerouslySetInnerHTML={{ __html: `${index + 1}. ${a.question}` }}
                                    />
                                    <p>
                                        <span className="font-semibold">Your Answer: </span>
                                        <span
                                            className={a.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}
                                            dangerouslySetInnerHTML={{ __html: a.selectedAnswer }}
                                        />
                                    </p>
                                    {!a.isCorrect && (
                                        <p>
                                            <span className="font-semibold">Correct Answer: </span>
                                            <span className="text-green-600" dangerouslySetInnerHTML={{ __html: a.correctAnswer }} />
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No answer data available.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ icon, color, label, value }) => {
    const icons = {
        check: (
            <svg className={`w-8 h-8 text-${color}-500 mx-auto mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        x: (
            <svg className={`w-8 h-8 text-${color}-500 mx-auto mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className={`w-8 h-8 text-${color}-500 mx-auto mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
        )
    };
    return (
        <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
            {icons[icon]}
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    );
};

export default ResultPage;
