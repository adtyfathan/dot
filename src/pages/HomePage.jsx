import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
// category images
import general from '../assets/images/general.jpg';
import books from '../assets/images/books.jpg';
import films from '../assets/images/film.jpg';
import music from '../assets/images/music.jpg';
import theatre from '../assets/images/theatre.jpg';
import television from '../assets/images/television.jpg';
import games from '../assets/images/games.jpg';
import board from '../assets/images/board.jpg';
import science from '../assets/images/science.jpg';
import computer from '../assets/images/computer.jpg';
import math from '../assets/images/math.jpg';
import myth from '../assets/images/myth.jpg';
import sports from '../assets/images/sports.jpg';
import geography from '../assets/images/geography.jpg';
import history from '../assets/images/history.jpg';
import politics from '../assets/images/politics.jpg';
import art from '../assets/images/art.jpg';
import celebrity from '../assets/images/celebrity.jpg';
import animals from '../assets/images/animal.jpg';
import vechile from '../assets/images/vehicle.jpg';
import comic from '../assets/images/comics.jpg';
import gadget from '../assets/images/gadget.jpg';
import anime from '../assets/images/anime.jpg';
import cartoon from '../assets/images/cartoon.jpg';


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
    const [isDisabled, setIsDisabled] = useState(false);
    const [quizConfig, setQuizConfig] = useState({
        amount: '10',
        difficulty: 'easy',
        timer: '5'
    });
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const categoryImages = [
        general, 
        books,
        films,
        music,
        theatre,
        television,
        games,
        board,
        science,
        computer,
        math,
        myth,
        sports,
        geography,
        history,
        politics,
        art,
        celebrity,
        animals,
        vechile,
        comic,
        gadget,
        anime,
        cartoon
    ];

    useEffect(() => {
        fetchCategories();
        checkResumeQuiz();
    }, []);

    const checkResumeQuiz = () => {
        const savedProgress = localStorage.getItem('quizProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setIsDisabled(true)
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
                    <div className='flex items-center gap-4'>
                        <img src="/images/logo.png" alt="logo" className='w-10' />
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }} data-testid="app-title">
                            Quizis
                        </h1>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className='lg:flex items-center gap-4 hidden'>
                            <img src="/images/profile.png" alt="profile" className='w-8' />
                            <span className="text-sm text-gray-600" data-testid="user-welcome">{user.username}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-indigo-400 border rounded-lg hover:bg-indigo-500 transition text-white font-bold flex items-center gap-2"
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

            <div className="flex flex-col-reverse md:flex-row min-h-[90vh] w-full max-w-7xl mx-auto items-center justify-center text-center md:text-left">
                <div className="flex-1 flex flex-col justify-center lg:space-y-12 space-y-6">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-snug sm:leading-tight">
                        Challenge Your <span className="text-indigo-400">Knowledge</span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-md sm:max-w-lg mx-auto md:mx-0 px-2 sm:px-0">
                        Quizis is the daily quiz platform that brings challenge and fun into your everyday life!
                    </p>
                    <a
                        href="#quizSection"
                        className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 w-fit mx-auto md:mx-0"
                    >
                        Play Now
                    </a>
                </div>

                <div className="flex-1 flex justify-center md:justify-end relative">
                    <img
                        src="/images/hero.png"
                        alt="Quiz Hero"
                        className="relative w-64 sm:w-80 md:w-96 lg:w-[560px] object-contain drop-shadow-2xl max-w-full"
                    />
                </div>
            </div>

            <section className="bg-indigo-100 py-16 px-6 sm:px-12 lg:px-20">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-800" style={{ fontFamily: 'Space Grotesk' }}>
                        How to Play
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-indigo-50 rounded-2xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition-shadow">
                            <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 4a1 1 0 011-1h3.5a1 1 0 01.707.293l1.707 1.707H21a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Category</h3>
                            <p className="text-gray-600 text-sm">Pick from various quiz topics that interest you most.</p>
                        </div>

                        <div className="bg-indigo-50 rounded-2xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition-shadow">
                            <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Set Your Timer</h3>
                            <p className="text-gray-600 text-sm">Decide how long you want your quiz session to last.</p>
                        </div>

                        <div className="bg-indigo-50 rounded-2xl shadow-md p-8 flex flex-col items-center hover:shadow-lg transition-shadow">
                            <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Playing</h3>
                            <p className="text-gray-600 text-sm">Answer the questions, beat the timer, and see your score!</p>
                        </div>
                    </div>
                </div>
            </section>


            <main id='quizSection' className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Choose Your Quiz</h2>
                    <p className="text-gray-600">Select a category and configure your quiz settings</p>
                </div>

                <div
                    className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl shadow-md border border-gray-200 p-8 mb-10 hover:shadow-lg transition-shadow duration-300"
                    data-testid="quiz-config-card"
                >
                    <div className="mb-6 text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">Quiz Configuration</h3>
                        <p className="text-sm text-gray-600">Customize your quiz experience</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                Number of Questions
                            </label>
                            <select
                                value={quizConfig.amount}
                                onChange={(e) => setQuizConfig({ ...quizConfig, amount: e.target.value })}
                                className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700 font-medium"
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
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                                Difficulty
                            </label>
                            <select
                                value={quizConfig.difficulty}
                                onChange={(e) => setQuizConfig({ ...quizConfig, difficulty: e.target.value })}
                                className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700 font-medium"
                                data-testid="difficulty-select"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Timer (minutes)
                            </label>
                            <select
                                value={quizConfig.timer}
                                onChange={(e) => setQuizConfig({ ...quizConfig, timer: e.target.value })}
                                className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700 font-medium"
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <CategoryCard 
                            key={category.id}
                            category={category}
                            image={categoryImages[index]}
                            onStartQuiz={startQuiz}
                            isDisabled={isDisabled}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;