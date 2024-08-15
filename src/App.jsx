/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Aside from './components/Aside';
import Statistics from './components/Statistics';
import Files from './components/Files';
import Settings from './components/Settings';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Auth from './components/Auth'; // Import the Auth component

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('authenticated');
    if (auth) {
      setIsAuthenticated(true);
      autoLogout();
    }
  }, []);

  const autoLogout = () => {
    setTimeout(() => {
      localStorage.removeItem('authenticated');
      setIsAuthenticated(false);
      alert('You have been logged out');
    }, 120000); // 2 minutes
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    autoLogout();
  };

  // Fetch files from the server
  const fetchFiles = async () => {
    try {
      const response = await axios.get('https://cloud-file-storage-backend.vercel.app/api/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (fileContents, fileNames) => {
    setLoading(true);
    setProgress(0);

    const formData = new FormData();

    // Loop through all files and append them to the FormData object
    fileContents.forEach((fileContent, index) => {
      formData.append('files', fileContent);
    });
    formData.append('fileNames', JSON.stringify(fileNames)); // Send as JSON array

    try {
      await axios.post('https://cloud-file-storage-backend.vercel.app/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      // Reset states after upload completes
      setLoading(false);
      setFiles([]); // Reset local file state

      // Refresh the file list after upload
      fetchFiles();
    } catch (error) {
      setLoading(false);
      console.error('Error during file upload:', error);
    }
  };

  const handleDownload = async (fileURL) => {
    try {
      const response = await axios.get(fileURL, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileURL.split('/').pop()); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
      window.URL.revokeObjectURL(url); // Revoke the object URL to free up memory
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`https://cloud-file-storage-backend.vercel.app/api/files/${fileId}`);
      fetchFiles(); // Refresh the file list after delete
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <Router>
      <div className="flex flex-col md:flex-row h-auto min-h-screen bg-gray-100">
        {isAuthenticated ? (
          <>
            <Aside />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/statistics" element={<Statistics />} />
                <Route
                  path="/files"
                  element={
                    <Files
                      files={files}
                      fetchFiles={fetchFiles}
                      loading={loading}
                      progress={progress}
                      handleUpload={handleUpload}
                      handleDownload={handleDownload}
                      handleDelete={handleDelete}
                    />
                  }
                />
                <Route path="/settings" element={<Settings />} /> {/* Add your settings route */}
                {/* You can add more routes here */}
                <Route path="*" element={<Navigate to="/files" />} />
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
