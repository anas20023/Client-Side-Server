/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Aside from './components/Aside';
import Statistics from './components/Statistics';
import Files from './components/Files';
import Settings from './components/Settings';
import { useState, useEffect, useCallback, useRef } from 'react';
import Auth from './components/Auth';
import WeatherBoard from './components/Weather'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    const auth = localStorage.getItem('authenticated');
    if (auth) {
      setIsAuthenticated(true);
      startAutoLogoutTimer();
    }

    return () => {
      clearTimeout(logoutTimerRef.current);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const startAutoLogoutTimer = useCallback(() => {
    // Clear any existing timer
    clearTimeout(logoutTimerRef.current);

    // Set a new timer for 2 minutes
    logoutTimerRef.current = setTimeout(() => {
      if (isAuthenticated) {
        handleLogout();
        // alert('You have been logged out due to inactivity');
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
                <Route path='/weather' element={<WeatherBoard />} />
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
