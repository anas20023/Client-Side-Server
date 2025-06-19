/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import {  FaGithub, FaLinkedin } from 'react-icons/fa';
import { TbWorldBolt } from "react-icons/tb";
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img from '../assets/server-concept-illustration.png' 

const Auth = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('https://sgm.anasibnbelal.live/api/auth/getuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('authenticated', 'true');
                localStorage.setItem('user', JSON.stringify(data.user.name));
                localStorage.setItem('user_email', JSON.stringify(data.user.email));
                localStorage.setItem('user_name', JSON.stringify(data.user.username));
                onLogin();
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            console.error('There was an error with the login:', error);
            setError('Invalid credentials');
            setUsername("");
            setPassword("");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error); 
        }
    }, [error]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#4361ee] to-[#3a56e0] flex items-center justify-center p-4 font-inter">
            <div className="w-full max-w-[1000px] bg-white rounded-2xl shadow-2xl flex overflow-hidden flex-col md:flex-row">
                {/* Left Panel - Form */}
                <div className="w-full flex flex-col justify-center items-center md:w-1/2 p-6 md:p-10">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-6">
                            <div className="mx-auto bg-[#4361ee] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                            <p className="text-gray-600 mt-2">Sign in to continue</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6 px-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <div className="relative">
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:border-transparent transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-3 px-4 bg-gradient-to-r from-[#4361ee] to-[#3a56e0] text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Panel - Illustration */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#f0f4ff] to-[#e6ebff] p-10 flex-col justify-center items-center text-center">
                    <div className="mb-8">
                       <img src={img} className='h-80' alt="" />
                    </div>
                    <p className="text-gray-700 italic mb-6">&quot; Want a trial ? Contact Now &quot;</p>
                    
                    <div className="flex space-x-5">
                        <a href="https://www.github.com/anas20023" target='_blank' rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                            <FaGithub className="text-gray-700 hover:text-gray-900 transition-colors" />
                        </a>
                        <a href="https://anasibnbelal.live/" target='_blank' rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                            <TbWorldBolt className="text-gray-700 hover:text-gray-900 transition-colors" />
                        </a>
                        <a href="https://www.linkedin.com/in/anasibelal004/" target='_blank' rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                            <FaLinkedin className="text-gray-700 hover:text-gray-900 transition-colors" />
                        </a>
                    </div>
                </div>
            </div>
             <ToastContainer 
                position="top-right" 
                autoClose={2000}
                toastClassName="!bg-gray-100 !text-gray-800 !rounded-lg !shadow-md !border !border-gray-200"
                progressClassName="!bg-[#4361ee]" 
                bodyClassName="!p-4 !font-medium"
                closeButton={false}
            />
        </div>
    );
};

export default Auth;