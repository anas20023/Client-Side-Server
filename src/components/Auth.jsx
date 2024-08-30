/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaEnvelope, FaInstagram, FaGithub, FaBehance, FaGlobe } from 'react-icons/fa';

const Auth = ({ onLogin }) => {
    const [username, setUsername] = useState('user@admin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        // console.log(username, password);
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
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 w-full max-w-xs sm:max-w-sm md:max-w-md animate-fadeIn">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-100">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername("user@admin")}
                            placeholder="user@admin"
                            className="w-full px-4 py-3 text-sm text-gray-400 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition duration-300 ease-in-out placeholder-gray-400"
                            disabled
                            required
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zM12 14a4 4 0 100-8 4 4 0 000 8zm4 2H8a2 2 0 00-2 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 00-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition duration-300 ease-in-out placeholder-gray-400"
                            required
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11V5m0 6v6m6 0H6" />
                            </svg>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-center animate-pulse">{error}</p>}
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg text-sm font-semibold text-white transition duration-300 ease-in-out ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <div className='flex flex-col justify-between items-center mt-8'>
                <h2 className='py-5 text-white'>Need a Server Like this ?</h2>
                <div className="flex flex-row space-x-6">
                    {/* <a href="https://www.facebook.com/anasib2000004/" target='_blank' className="text-gray-300 hover:text-gray-400">
                        <FaFacebook size={22} />
                    </a> */}
                    {/* <a href="https://www.instagram.com/alpha000w/" target='_blank' className="text-gray-300 hover:text-gray-400">
                        <FaInstagram size={22} />
                    </a> */}
                    <a href="https://www.github.com/anas20023" target='_blank' className="text-gray-300 hover:text-gray-400">
                        <FaGithub size={22} />
                    </a>
                    <a href="https://anasib.tech/" target='_blank' className="text-gray-300 hover:text-gray-400">
                        <FaEnvelope size={22} />
                    </a>
                    <a href="target='_blank'" target='_blank' className="text-gray-300 hover:text-gray-400">
                        <FaBehance size={22} />
                    </a>

                </div>
            </div>
        </div>

    );
};

export default Auth;
