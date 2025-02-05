/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaEnvelope, FaGithub, FaBehance } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';

const Auth = ({ onLogin }) => {
    const [username, setUsername] = useState('user@admin');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('https://cloud-file-storage-backend.vercel.app/api/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        <div className="min-h-screen w-full bg-[#4361ee] flex items-center justify-center p-4 font-inter">
            <div className="w-full max-w-[1000px] bg-white rounded-2xl shadow-xl flex overflow-hidden flex-col md:flex-row">
                {/* Login Form Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-2xl font-bold mb-8">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Username or email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border bg-gray-100 focus:outline-none focus:border-[#4361ee] transition-colors"
                                required
                                readOnly
                            />
                        </div>

                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-10 rounded-lg border bg-gray-100 focus:outline-none focus:border-[#4361ee] transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>


                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 bg-[#4361ee] text-white rounded-lg font-medium hover:bg-[#3651d4] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                       
                    </form>
                </div>
                {/* Illustration Section */}
                <div className="hidden md:flex md:w-1/2 bg-gray-50 p-12 flex-col justify-center items-center text-center">
                    <img
                        src="https://media-hosting.imagekit.io//a669204e1bce4a1f/vecteezy_3d-isometric-web-hosting-server-transparent-background_22418264.png?Expires=1833384538&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=UpLqSq21ha2RrDnaxBUo9T1TxYBAaBSf5LcTvUAUAuNJ~-KSWJvoG-kLct0GmdBPDuVHpK1xVeBczyUgcfRMXYTHI581AEPdLR7fuBB8uEndYa6DBfnyvEOm7~FMM5XT1F3OgTSmbFLIKDRiR750VbXCHUmn~jMuposKN2bMniSluNwkfCbMrmgD51QRBIvtuKlZJLtt0nv537hxuHIqGpBy4CKXd5-QO20tf7PkxX6rkJEJ~8jFeoCxrJoH81NWO6sYM2DUVjCfUxo8qrJZh3WveAPTpdnuK~IBWHSrHWbq7Mg-HOLZ4PEBocUcIOtO02tFj8R8Xoam1YPFENDtcg__"
                        alt="Project Progress"
                        className="w-72 h-72 object-cover mb-8"
                    />
                    <h3 className="text-xl font-semibold mb-4">Data is Important !</h3>
                    <p className="text-gray-600">
                        Track and manage your projects efficiently with our comprehensive dashboard and analytics tools.
                    </p>
                    <div className="flex space-x-6 text-gray-600 mt-6">
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
        </div>
    );
};

export default Auth;
