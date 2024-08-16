/* eslint-disable react/prop-types */
import { useState } from 'react';

const Auth = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('https://cloud-file-storage-backend.vercel.app/api/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.authenticated) {
                localStorage.setItem('authenticated', 'true');
                onLogin();
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            console.error('There was an error with the login:', error);
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex mx-auto items-center justify-center min-h-screen bg-gray-900 w-full">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-200">Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full px-4 py-2 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-2 mb-6 border border-gray-700 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                        required
                    />
                    {error && <p className="text-red-500 text-center mb-4 animate-shake">{error}</p>}
                    <button
                        type="submit"
                        className={`w-full ${loading ? 'bg-gray-600' : 'bg-blue-600'} ${loading ? 'hover:bg-gray-600' : 'hover:bg-blue-700'} text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8l4 4-4 4V12H4z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
