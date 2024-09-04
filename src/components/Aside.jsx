/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGear, faFolderClosed, faChartArea, faSignOutAlt, faCloudMoonRain, faTerminal, faClipboard } from '@fortawesome/free-solid-svg-icons';

const Aside = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Menu Icon for Smaller Screens */}
            {!isOpen && (
                <button
                    className="md:hidden font-[inter] fixed top-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={toggleSidebar}
                    aria-label="Open sidebar"
                >
                    <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed  inset-y-0 left-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-gray-900 text-white p-6 shadow-xl`}
                aria-hidden={!isOpen}
            >
                <h2 className="text-xl md:text-2xl font-semibold mb-5 md:mb-6">Dashboard</h2>
                <nav>
                    <ul>
                        <li className="mb-3 flex items-center">
                            <Link
                                to="/statistics"
                                className="flex items-center py-2 md:py-2.5 px-3 md:px-3.5 rounded hover:bg-gray-700 w-full transition-colors duration-200"
                                onClick={() => setIsOpen(false)} // Close sidebar on link click for small screens
                            >
                                <FontAwesomeIcon icon={faChartArea} className="h-4 w-4 md:h-5 md:w-5 mr-3 text-white" />
                                <span className="text-sm md:text-base">Statistics</span>
                            </Link>
                        </li>
                        <li className="mb-3 flex items-center">
                            <Link
                                to="/files"
                                className="flex items-center py-2 md:py-2.5 px-3 md:px-3.5 rounded hover:bg-gray-700 w-full transition-colors duration-200"
                                onClick={() => setIsOpen(false)} // Close sidebar on link click for small screens
                            >
                                <FontAwesomeIcon icon={faFolderClosed} className="h-4 w-4 md:h-5 md:w-5 mr-3 text-white" />
                                <span className="text-sm md:text-base">Manage Files</span>
                            </Link>
                        </li>
                        <li className="mb-3 flex items-center">
                            <Link
                                to="/weather"
                                className="flex items-center py-2 md:py-2.5 px-3 md:px-3.5 rounded hover:bg-gray-700 w-full transition-colors duration-200"
                                onClick={() => setIsOpen(false)} // Close sidebar on link click for small screens
                            >
                                <FontAwesomeIcon icon={faCloudMoonRain} className="h-4 w-4 md:h-5 md:w-5 mr-3 text-white" />
                                <span className="text-sm md:text-base">Weather</span>
                            </Link>
                        </li>
                        <li className="mb-3 flex items-center">
                            <Link
                                to="/editor"
                                className="flex items-center py-2 md:py-2.5 px-3 md:px-3.5 rounded hover:bg-gray-700 w-full transition-colors duration-200"
                                onClick={() => setIsOpen(false)} // Close sidebar on link click for small screens
                            >
                                <FontAwesomeIcon icon={faTerminal} className="h-4 w-4 md:h-5 md:w-5 mr-3 text-white" />
                                <span className="text-sm md:text-base">Code Space</span>
                            </Link>
                        </li>
                        <li className="mb-3 flex items-center">
                            <Link
                                to="/notepad"
                                className="flex items-center py-2 md:py-2.5 px-3 md:px-3.5 rounded hover:bg-gray-700 w-full transition-colors duration-200"
                                onClick={() => setIsOpen(false)} // Close sidebar on link click for small screens
                            >
                                <FontAwesomeIcon icon={faClipboard} className="h-4 w-4 md:h-5 md:w-5 mr-3 text-white" />
                                <span className="text-sm md:text-base">NotePad</span>
                            </Link>
                        </li>
                        <li className="mb-3 flex items-center">
                            <Link
                                to="/settings"
                                className="flex items-center py-2 md:py-2.5 px-3 md:px-3.5 rounded hover:bg-gray-700 w-full transition-colors duration-200"
                                onClick={() => setIsOpen(false)} // Close sidebar on link click for small screens
                            >
                                <FontAwesomeIcon icon={faGear} className="h-4 w-4 md:h-5 md:w-5 mr-3 text-white" />
                                <span className="text-sm md:text-base">Show System</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center bg-red-500 text-white py-2 md:py-2.5 px-3 md:px-3.5 rounded hover:bg-red-600 transition-colors duration-200 mt-6 md:mt-8 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label="Logout"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 md:h-5 md:w-5 mr-2 text-white" />
                    Logout
                </button>
            </aside>

            {/* Overlay for mobile when the sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar} // Close sidebar on overlay click
                    aria-hidden={!isOpen}
                ></div>
            )}
        </>
    );
};

export default Aside;
