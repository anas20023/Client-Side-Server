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
    const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress
    const [isDeletingId, setIsDeletingId] = useState(null);
    const [downloadingFileId, setDownloadingFileId] = useState(null);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [s, setS] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (e) => {
        setSortOrder(e.target.value);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

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

    const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

    const handleDrop = (acceptedFiles) => {
        const filteredFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
        setS(acceptedFiles[0].size);
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
            if (s < 10000000) {
                await axios.post(
                    'https://cloud-file-storage-backend.vercel.app/api/upload',
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
            } else {
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
            }
            setNotification({ message: 'File uploaded successfully', type: 'success' });
            setTimeout(() => {
                setNotification({ message: '', type: '' });
            }, 2000);
            setFileContents([]);
            setFileNames([]);
            fetchFiles();
        } catch (error) {
            setTimeout(() => {
                setNotification({ type: 'error', message: 'Failed to upload files. Please try again.' });
            }, 2000);
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
            setTimeout(() => {
                setNotification({ type: '', message: '' });
            }, 2000);
        } finally {
            setIsDeletingId(null);
            setNotification({ type: 'success', message: 'File deleted successfully!' });
            setTimeout(() => {
                setNotification({ type: '', message: '' });
            }, 2000);
        }
    };

    const filteredAndSortedFiles = files
        .filter((file) => {
            // Only filter if there's a search query, otherwise return all files
            return !searchQuery || (file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase()));
        })
        .sort((a, b) => {
            const nameA = a.name || ""; // Default to empty string if name is undefined
            const nameB = b.name || ""; // Default to empty string if name is undefined
            if (sortOrder === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });


    return (
        <section id="files" className="p-6 bg-gray-100 min-h-screen">
            <h3 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Manage Files</h3>
            <UploadSection
                fileNames={fileNames}
                handleDrop={handleDrop}
                handleUpload={handleUpload}
                loading={loading}
                uploadProgress={uploadProgress}
            />
            {/* Search Input Box and Sort Dropdown */}
            <div className="flex flex-row justify-between items-center my-8 gap-1 lg:gap-2">
                <input
                    type="search"
                    className="w-9/12 p-2 pl-8 text-sm text-gray-700 placeholder-gray
                border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <select
                    className="w-1/4 p-2 text-sm text-gray-700 placeholder-gray
                border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    value={sortOrder}
                    onChange={handleSort}
                >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>
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
