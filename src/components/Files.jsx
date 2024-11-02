/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

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

    const MAX_FILE_SIZE = 200 * 1024 * 1024;

    const handleDrop = (acceptedFiles) => {
        const filteredFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
        if (filteredFiles.length !== acceptedFiles.length) {
            alert("Some files exceed the size limit and won't be uploaded.");
        }
        setFileContents(filteredFiles);
        setFileNames(filteredFiles.map(file => file.name));
    };

    const handleUpload = async () => {
        if (fileContents.length === 0 || fileNames.length === 0) {
            alert('Please select files to upload.');
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
            await axios.post(
                'https://cloud-file-storage-backend-2pr4.onrender.com/api/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total > 0) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted);
                        }
                    }
                }
            );

            setNotification({ type: 'success', message: 'Files uploaded successfully!' });
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
            await axios.delete(`https://cloud-file-storage-backend-2pr4.onrender.com/api/files/${id}`);
            fetchFiles();
        } catch (error) {
            console.error('Error deleting file:', error);
            setNotification({ type: 'error', message: 'Failed to delete file. Please try again.' });
        } finally {
            setIsDeletingId(null);
            setNotification({ type: 'success', message: 'File deleted successfully!' });
        }
    };

    const filteredAndSortedFiles = files
        .filter(file => file.name && file.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortOrder === 'asc' ? new Date(a.uploadDate) - new Date(b.uploadDate) : new Date(b.uploadDate) - new Date(a.uploadDate));

    return (
        <section id="files" className="p-6 bg-gray-100 min-h-screen">
            <h3 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Manage Files</h3>

            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search files..."
                    className="border p-2 rounded w-full max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="border p-2 rounded ml-4"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="asc">Sort by Date (Oldest)</option>
                    <option value="desc">Sort by Date (Newest)</option>
                </select>
            </div>

            <UploadSection
                fileNames={fileNames}
                handleDrop={handleDrop}
                handleUpload={handleUpload}
                loading={loading}
                uploadProgress={uploadProgress}
            />

            <FileList
                files={filteredAndSortedFiles}
                onDownload={handleDownloadFile}
                onDelete={handleDeleteFile}
                downloadingFileId={downloadingFileId}
                deletingFileId={isDeletingId}
            />

            <Notification
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification({ type: '', message: '' })}
            />
        </section>
    );
};

export default Files;
