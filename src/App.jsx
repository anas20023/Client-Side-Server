/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Aside from './components/Aside';
import Statistics from './components/Statistics';
import Files from './components/Files';
import Settings from './components/Settings';
import { useState, useEffect, useCallback, useRef } from 'react';
import Auth from './components/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    const auth = localStorage.getItem('authenticated');
    if (auth) {
      setIsAuthenticated(true);
      startAutoLogoutTimer();
    }

    const resetTimer = () => {
      clearTimeout(logoutTimerRef.current);
      startAutoLogoutTimer();
    };

    window.addEventListener('mousemove', resetTimer);

    return () => {
      clearTimeout(logoutTimerRef.current);
      window.removeEventListener('mousemove', resetTimer);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const startAutoLogoutTimer = useCallback(() => {
    logoutTimerRef.current = setTimeout(() => {
      if (isAuthenticated) {
        handleLogout();
        //alert('You have been logged out due to inactivity');
      }
    }, 120000); // 2 minutes
  }, [isAuthenticated]);

  const handleLogin = useCallback(() => {
    localStorage.setItem('authenticated', 'true');
    setIsAuthenticated(true);
    startAutoLogoutTimer();
  }, [startAutoLogoutTimer]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authenticated');
    setIsAuthenticated(false);
    clearTimeout(logoutTimerRef.current);
  }, []);

  return (
    <Router>
      <div className="flex flex-col md:flex-row h-auto min-h-screen bg-gray-100">
        {isAuthenticated ? (
          <>
            <Aside onLogout={handleLogout} />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/files" element={<Files />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/statistics" />} />
              </Routes>
            </main>
          </>
        ) : (
          <Auth onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
