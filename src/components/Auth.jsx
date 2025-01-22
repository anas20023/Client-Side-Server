/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaEnvelope, FaGithub, FaBehance } from 'react-icons/fa';

const Auth = ({ onLogin }) => {
    const [username, setUsername] = useState('user@admin');
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
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 p-4">
            <div className="bg-white bg-opacity-90 px-8 py-14 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative w-full group">
                        <input
                            type="text"
                            name="floating_username"
                            id="floating_username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input input-bordered input-primary w-full text-sm text-gray-700 bg-transparent"
                            placeholder="Username"
                            readOnly
                            required
                        />
                    </div>

                    <div className="relative w-full group">
                        <input
                            type="password"
                            name="floating_password"
                            id="floating_password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered input-primary w-full text-sm text-gray-700 bg-transparent"
                            placeholder="Password"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        className={`btn btn-outline w-full text-slate-900 py-3 rounded-lg text-sm font-semibold transition duration-300 ease-in-out ${loading ? 'btn-disabled' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8l4 4-4 4V12H4z"
                                    ></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>

            <div className="flex flex-col justify-center items-center mt-8">
                <h2 className="text-xl py-5 text-gray-800">Need a Server Like This?</h2>
                <div className="flex space-x-6 text-gray-100">
                    <a href="https://www.github.com/anas20023" target='_blank' rel="noopener noreferrer" className="hover:text-gray-700">
                        <FaGithub size={22} />
                    </a>
                    <a href="https://anasib.tech/" target='_blank' rel="noopener noreferrer" className="hover:text-gray-700">
                        <FaEnvelope size={22} />
                    </a>
                    <a href="https://www.behance.net" target='_blank' rel="noopener noreferrer" className="hover:text-gray-700">
                        <FaBehance size={22} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Auth;
