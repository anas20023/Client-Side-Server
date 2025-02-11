/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt, faCloudMoonRain, faClipboard, faTerminal, faChartArea, faFolderClosed, faGear } from '@fortawesome/free-solid-svg-icons';

const Aside = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal state

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true); // Show confirmation modal on logout click
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false); // Close the modal
        onLogout(); // Proceed with logout
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false); // Just close the modal
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
                    className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={toggleSidebar}
                    aria-label="Open sidebar"
                >
                    <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white p-6`}
                aria-hidden={!isOpen}
            >
                <h2 className="text-2xl font-semibold mb-8 text-center text-blue-400">Dashboard</h2>
                <nav>
                    <ul>
                        <li className="mb-6">
                            <Link
                                to="/statistics"
                                className="flex items-center py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={faChartArea} className="h-5 w-5 mr-3" />
                                <span>Statistics</span>
                            </Link>
                        </li>
                        <li className="mb-6">
                            <Link
                                to="/files"
                                className="flex items-center py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={faFolderClosed} className="h-5 w-5 mr-3" />
                                <span>Manage Files</span>
                            </Link>
                        </li>
                        <li className="mb-6">
                            <Link
                                to="/weather"
                                className="flex items-center py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={faCloudMoonRain} className="h-5 w-5 mr-3" />
                                <span>Weather</span>
                            </Link>
                        </li>
                        <li className="mb-6">
                            <Link
                                to="/editor"
                                className="flex items-center py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={faTerminal} className="h-5 w-5 mr-3" />
                                <span>Code Space</span>
                            </Link>
                        </li>
                        <li className="mb-6">
                            <Link
                                to="/notepad"
                                className="flex items-center py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={faClipboard} className="h-5 w-5 mr-3" />
                                <span>NotePad</span>
                            </Link>
                        </li>
                        <li className="mb-6">
                            <Link
                                to="/settings"
                                className="flex items-center py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={faGear} className="h-5 w-5 mr-3" />
                                <span>Show System</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                {/* Logout Button */}
                <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 transition-all duration-300 text-white py-3 rounded-lg shadow-lg hover:shadow-2xl mt-10 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label="Logout"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 mr-2" />
                    Logout
                </button>
            </aside>

            {/* Overlay for mobile when the sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-60 z-30 md:hidden"
                    onClick={toggleSidebar}
                    aria-hidden={!isOpen}
                ></div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
                        <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-6">
                            <button
                                onClick={handleCancelLogout}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Aside;
