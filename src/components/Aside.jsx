import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGear, faFolderClosed, faChartArea } from '@fortawesome/free-solid-svg-icons';

const Aside = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // Automatically open the sidebar on smaller screens when the component is mounted
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
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
                    className="md:hidden fixed top-4 right-4 z-50 bg-blue-900 text-white p-2 rounded"
                    onClick={toggleSidebar}
                >
                    <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-blue-900 text-white p-6`}
            >
                <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
                <nav>
                    <ul>
                        <li className="mb-4 flex items-center">
                            <Link
                                to="/statistics"
                                className="block py-2 px-4 rounded hover:bg-blue-700 w-full"
                                onClick={() => setIsOpen(false)}  // Close sidebar on link click for small screens
                            >
                                <FontAwesomeIcon icon={faChartArea} className="h-4 w-4 mr-2 text-white" />
                                Statistics
                            </Link>
                        </li>
                        <li className="mb-4 flex items-center">
                            <Link
                                to="/files"
                                className="block py-2 px-4 rounded hover:bg-blue-700 w-full"
                                onClick={() => setIsOpen(false)}  // Close sidebar on link click for small screens
                            >
                                <FontAwesomeIcon icon={faFolderClosed} className="h-4 w-4 mr-2 text-white" />
                                Manage Files
                            </Link>
                        </li>
                        <li className="mb-4 flex items-center">
                            <Link
                                to="/settings"
                                className="block py-2 px-4 rounded hover:bg-blue-700 w-full"
                                onClick={() => setIsOpen(false)}  // Close sidebar on link click for small screens
                            >
                                <FontAwesomeIcon icon={faGear} className="h-4 w-4 mr-2 text-white" />
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Overlay for mobile when the sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar} // Close sidebar on overlay click
                ></div>
            )}
        </>
    );
};

export default Aside;
