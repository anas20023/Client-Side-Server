/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import UploadSection from './UploadSection';
import FileList from './FileList';
import Notification from './Notification';

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
    const [sortOrder, setSortOrder] = useState('asc');

    const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('https://cloud-file-storage-backend.vercel.app/api/files');
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
        if (fileContents.length === 0 || fileNames.length === 0) {
            setNotification({ type: 'error', message: 'Please select files to upload.' });
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        const formData = new FormData();
        fileContents.forEach((fileContent) => {
            formData.append('files', fileContent);
        });
        formData.append('fileNames', JSON.stringify(fileNames));

        try {
            const url = s < 10000000
                ? 'https://cloud-file-storage-backend.vercel.app/api/upload'
                : 'https://cloud-file-storage-backend-2pr4.onrender.com/api/upload';

            await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total > 0) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                }
            });

            setNotification({ message: 'File uploaded successfully', type: 'success' });
            setFileContents([]);
            setFileNames([]);
            fetchFiles();
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to upload files. Please try again.' });
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

    const filteredAndSortedFiles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const filteredFiles = files.filter((file) => {
            return !query || (file.name && file.name.toLowerCase().includes(query));
        });

        return filteredFiles.sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
    }, [files, searchQuery, sortOrder]);

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
                    className="w-9/12 p-2 pl-8 text-sm text-gray-700 placeholder-gray border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="w-1/4 p-2 text-sm text-gray-700 placeholder-gray border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>

            {filteredAndSortedFiles.length === 0 && (
                <p className="text-gray-500 text-center mt-4">No files found matching the search query.</p>
            )}

            <FileList
                files={filteredAndSortedFiles}
                onDownload={handleDownloadFile}
                onDelete={handleDeleteFile}
                downloadingFileId={downloadingFileId}
                deletingFileId={isDeletingId}
            />

            {/* Daisy UI Notification */}
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
