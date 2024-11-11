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
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 p-4">
            <div className="bg-white bg-opacity-90 px-8 py-14 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-700">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative z-0 w-full group">
                        <input
                            type="text"
                            name="floating_username"
                            id="floating_username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block py-3 px-2 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 peer placeholder-gray-400"
                            placeholder=" "
                            readOnly  // Fix: use readOnly instead of disabled
                            required
                        />
                        <label
                            htmlFor="floating_username"
                            className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Username
                        </label>
                    </div>

                    <div className="relative z-0 w-full group">
                        <input
                            type="password"
                            name="floating_password"
                            id="floating_password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block py-3 px-4 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 peer placeholder-gray-400"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="floating_password"
                            className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Password
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg text-sm font-semibold text-white transition duration-300 ease-in-out ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                            } shadow-lg`}
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

            <div className='flex flex-col justify-between items-center mt-8'>
                <h2 className='py-5 text-gray-700'>Need a Server Like this?</h2>
                <div className="flex flex-row space-x-6">
                    <a href="https://www.github.com/anas20023" target='_blank' rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700">
                        <FaGithub size={22} />
                    </a>
                    <a href="https://anasib.tech/" target='_blank' rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700">
                        <FaEnvelope size={22} />
                    </a>
                    <a href="https://www.behance.net" target='_blank' rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700">
                        <FaBehance size={22} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Auth;
