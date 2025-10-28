import React, { useState } from 'react';

const Toast = ({ message, type, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`}>
            {message}
        </div>
    );
};

const LoginPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (!isLogin && !formData.username) {
            showToast('Please enter a username', 'error');
            return;
        }

        if (isLogin) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === formData.email && u.password === formData.password);

            if (user) {
                showToast('Login successful!', 'success');
                onLogin({ username: user.username, email: user.email });
            } else {
                showToast('Invalid email or password', 'error');
            }
        } else {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = users.find(u => u.email === formData.email);

            if (existingUser) {
                showToast('Email already registered', 'error');
                return;
            }

            const newUser = {
                username: formData.username,
                email: formData.email,
                password: formData.password
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            showToast('Registration successful!', 'success');
            onLogin({ username: newUser.username, email: newUser.email });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" data-testid="login-card">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                        Quiz Master
                    </h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Login to start your quiz journey' : 'Create an account to get started'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                data-testid="username-input"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            data-testid="email-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                            data-testid="password-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        data-testid="submit-button"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-purple-600 hover:text-purple-700 font-medium transition"
                        data-testid="toggle-auth-button"
                    >
                        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;