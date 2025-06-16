/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faSignOutAlt, 
  faChartArea, 
  faFolderClosed, 
  faGear,
  faXmark,
  faUser,
  faEnvelope,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

const Aside = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activePage, setActivePage] = useState('statistics');
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  const toggleSidebar = () => setIsOpen(prev => !prev);
  const toggleProfileDetails = () => setShowProfileDetails(prev => !prev);
  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleConfirmLogout = () => { setShowLogoutModal(false); onLogout(); };
  const handleCancelLogout = () => setShowLogoutModal(false);
  const handleNavClick = page => {
    setActivePage(page);
    setIsOpen(false);
  };

  // Safe user data
  const username = JSON.parse(localStorage.getItem('user') || '"Guest User"');
  const userEmail = JSON.parse(localStorage.getItem('user_email') || '"user@example.com"');
  const getInitials = name => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="flex">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between w-full p-4 bg-slate-800">
        <button onClick={toggleSidebar} aria-label="Open sidebar" className="text-white">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
            {getInitials(username)}
          </div>
          <span className="text-white font-medium truncate">{username.split(' ')[0]}</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 bg-gradient-to-b from-gray-900 to-slate-900 text-white p-4 lg:p-6 shadow-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          w-64 md:w-20 lg:w-64
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold hidden lg:block">Dashboard</h2>
          <button className="md:hidden text-gray-300" onClick={toggleSidebar} aria-label="Close sidebar">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Profile Box */}
        <div onClick={toggleProfileDetails} className="cursor-pointer mb-6 p-3 bg-slate-800/40 rounded-xl border border-blue-900/30 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-lg font-bold">{getInitials(username)}</div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center border-2 border-blue-500">
                <FontAwesomeIcon icon={faUser} className="text-cyan-300" size="sm" />
              </div>
            </div>
            <div className="ml-3 flex items-center">
              <div className="hidden lg:flex flex-col">
                <span className="font-bold truncate max-w-[140px]">{username}</span>
                <div className="flex items-center mt-1 text-blue-300">
                  <FontAwesomeIcon icon={faEnvelope} size="xs" className="mr-1" />
                  <span className="truncate max-w-[120px] text-xs">{userEmail}</span>
                </div>
              </div>
              <FontAwesomeIcon icon={showProfileDetails ? faChevronUp : faChevronDown} className="ml-auto lg:hidden" />
            </div>
          </div>
          {/* Details */}
          <div className={`${showProfileDetails ? 'block' : 'hidden'} lg:block mt-4 pt-4 border-t border-blue-900/30`}>            
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-300 text-xs font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-3">
            {[
              { page: 'statistics', icon: faChartArea, label: 'Statistics', to: '/statistics' },
              { page: 'files', icon: faFolderClosed, label: 'Manage Files', to: '/files' },
              { page: 'settings', icon: faGear, label: 'System Settings', to: '/settings' }
            ].map(item => (
              <li key={item.page}>
                <Link
                  to={item.to}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300
                    ${activePage === item.page ? 'bg-blue-900/30 border-l-4 border-cyan-400' : 'hover:bg-blue-900/20'}
                  `}
                >
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="truncate text-sm lg:text-base">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center mt-8 py-3 rounded-lg bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 transition-shadow shadow-lg"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-slate-900 p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-700 text-center">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-r from-rose-700 to-rose-800 flex items-center justify-center">
              <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Confirm Logout</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to sign out, <span className="font-semibold text-white">{username.split(' ')[0]}</span>?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleCancelLogout} className="flex-1 py-3 px-6 bg-slate-800 rounded-xl hover:bg-slate-700 font-medium">
                Cancel
              </button>
              <button onClick={handleConfirmLogout} className="flex-1 py-3 px-6 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 rounded-xl font-medium shadow-md">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aside;
