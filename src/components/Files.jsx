/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import UploadSection from './UploadSection';
import FileList from './FileList';
import Notification from './Notification';

// Custom hook to debounce a value
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Helper function to perform character-by-character (subsequence) matching
const isSubsequence = (query, text) => {
    if (!query) return true; // if query is empty, always match
    let qi = 0;
    for (let char of text) {
        if (char === query[qi]) {
            qi++;
        }
        if (qi === query.length) return true;
    }
    return false;
};
const Files = () => {
    const [files, setFiles] = useState([]);
    const [fileContents, setFileContents] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDeletingId, setIsDeletingId] = useState(null);
    const [downloadingFileId, setDownloadingFileId] = useState(null);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [s, setS] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        const userName = localStorage.getItem('user_name');

        if (!userName) {
            console.error('User not logged in');
            return;
        }

        try {
            const url="https://cloud-file-storage-backend.vercel.app/api/files"
            // const url="http://localhost:3000/api/files"
            const response = await axios.get(
                url,
                {
                    params: { user_name: userName },
                }
            );

            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };


    const handleDrop = (acceptedFiles) => {
        const filteredFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
        setS(acceptedFiles[0]?.size || 0);
        if (filteredFiles.length !== acceptedFiles.length) {
            setNotification({ type: 'error', message: "Some files exceed the size limit and won't be uploaded." });
        }
        setFileContents(filteredFiles);
        setFileNames(filteredFiles.map(file => file.name));
    };

    const handleUpload = async () => {
        if (!fileContents.length || !fileNames.length) {
            setNotification({
                type: 'error',
                message: 'Please select files to upload.',
            });
            return;
        }

        const userName = localStorage.getItem('user_name');
        if (!userName) {
            setNotification({
                type: 'error',
                message: 'User not logged in. Please login again.',
            });
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        const formData = new FormData();

        fileContents.forEach((file) => {
            formData.append('files', file);
        });

        formData.append('fileNames', JSON.stringify(fileNames));
        formData.append('user_name', userName);

        try {
            const url ="https://cloud-file-storage-backend.vercel.app/api/upload";
            // const url = "http://localhost:3000/api/upload";

            await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    }
                },
            });

            setNotification({
                type: 'success',
                message: 'Files uploaded successfully.',
            });

            setFileContents([]);
            setFileNames([]);
            fetchFiles();
        } catch (error) {
            console.error(error);
            setNotification({
                type: 'error',
                message: 'Failed to upload files. Please try again.',
            });
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };


    const handleDownloadFile = (fileURL, id) => {
        setDownloadingFileId(id);
        try {
            const link = document.createElement('a');
            link.href = fileURL;
            link.target = "_blank";
            link.download = fileURL.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        } finally {
            setDownloadingFileId(null);
        }
    };

    const handleDeleteFile = async (id) => {
        setIsDeletingId(id);
        try {
            await axios.delete(`https://cloud-file-storage-backend.vercel.app/api/files/${id}`);
            fetchFiles();
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to delete file. Please try again.' });
        } finally {
            setIsDeletingId(null);
            setNotification({ type: 'success', message: 'File deleted successfully!' });
        }
    };

    // Debounce the search query for 300ms to prevent filtering on every keystroke
    const debouncedSearchQuery = useDebounce(searchQuery.toLowerCase(), 300);

    const filteredFiles = useMemo(() => {
        const query = debouncedSearchQuery.trim();
        return files.filter((file) => {
            const fileName = file.fileName ? file.fileName.toLowerCase() : '';
            return isSubsequence(query, fileName);
        });
    }, [files, debouncedSearchQuery]);


    return (
        <section id="files" className="p-6 bg-white dark:bg-gray-900 text-white min-h-screen">
            <h3 className="text-3xl font-extrabold text-center mb-8 text-slate-800 dark:text-white">Manage Files</h3>

            <UploadSection
                fileNames={fileNames}
                handleDrop={handleDrop}
                handleUpload={handleUpload}
                loading={loading}
                uploadProgress={uploadProgress}
            />

            <div className="flex flex-row justify-between items-center my-8 gap-2">
                <input
                    type="search"
                    className="w-full p-2 pl-8 text-sm text-gray-700 placeholder-gray border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredFiles.length === 0 && (
                <p className="text-gray-500 text-center mt-4">No files found matching the search query.</p>
            )}

            <FileList
                files={filteredFiles}
                onDownload={handleDownloadFile}
                onDelete={handleDeleteFile}
                downloadingFileId={downloadingFileId}
                deletingFileId={isDeletingId}
            />

            {notification.message && (
                <div className={`toast ${notification.type === 'error' ? 'toast-error' : 'toast-success'}`}>
                    <div className="max-w-xs">
                        <div className="alert">
                            <span>{notification.message}</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Files;
