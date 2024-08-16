
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Files = () => {
    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [fileContents, setFileContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDeletingId, setIsDeletingId] = useState(null);
    const [downloadingFileId, setDownloadingFileId] = useState(null);
    useEffect(() => {
        fetchFiles();
    }, []);


    if (loading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center">
                <svg className="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
            </div>
        );
    }

    // Fetch files from the server
    const fetchFiles = async () => {
        try {
            const response = await axios.get('https://cloud-file-storage-backend.vercel.app/api/files');
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };


    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFileContents(selectedFiles);
        setFileNames(selectedFiles.map(file => file.name));
    };

    // Upload files
    const handleUpload = async () => {
        if (fileContents.length === 0 || fileNames.length === 0) {
            alert('Please select files and enter file names.');
            return;
        }

        setLoading(true);
        setProgress(0);

        const formData = new FormData();

        fileContents.forEach((fileContent) => {
            formData.append('files', fileContent);
        });
        formData.append('fileNames', JSON.stringify(fileNames));

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

            setLoading(false);
            setFileContents([]); // Clear selected files
            setFileNames([]); // Clear file names
            fetchFiles(); // Refresh the file list after upload
        } catch (error) {
            setLoading(false);
            console.error('Error during file upload:', error);
        }
    };

    // Handle file download
    const handleDownloadFile = async (fileURL, id) => {
        setDownloadingFileId(id);
        try {
            const response = await axios.get(fileURL, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileURL.split('/').pop());
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        } finally {
            setDownloadingFileId(null);
        }
    };

    // Handle file deletion
    const handleDeleteFile = async (id) => {
        setIsDeletingId(id);
        try {
            await axios.delete(`https://cloud-file-storage-backend.vercel.app/api/files/${id}`);
            fetchFiles(); // Refresh the file list after deletion
        } catch (error) {
            console.error('Error deleting file:', error);
        } finally {
            setIsDeletingId(null);
        }
    };

    return (
        <section id="files" className="p-6 bg-gray-100 min-h-screen">
            <h3 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Manage Files</h3>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex-1">
                <h4 className="text-xl font-bold mb-4">Upload Files</h4>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-4 w-full"
                    multiple
                />
                <button
                    onClick={handleUpload}
                    className={`w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'bg-blue-400' : ''}`}
                    disabled={loading}
                >
                    {loading ? `Uploading... ${progress}%` : 'Upload'}
                </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h4 className="text-xl font-bold mb-4">Uploaded Files</h4>
                <ul>
                    {files.map((file) => (
                        <li key={file.id} className="flex flex-col md:flex-row justify-between items-center mb-4 w-full">
                            <div className="w-full md:w-1/2 flex flex-row justify-between items-center mb-4 md:mb-0">
                                <span className="truncate">{file.fileName}</span>
                                <span className="text-gray-500 text-sm ml-2 md:ml-0">{file.uploadDate}</span>
                            </div>
                            <div className="w-full md:w-auto flex flex-row justify-end items-center">
                                <button
                                    onClick={() => handleDownloadFile(file.fileURL, file.id)}
                                    className={`bg-green-500 text-white px-4 py-2 rounded mr-2 w-full md:w-auto ${downloadingFileId === file.id ? 'bg-green-400' : ''}`}
                                    disabled={downloadingFileId === file.id}
                                >
                                    {downloadingFileId === file.id ? 'Downloading...' : 'Download'}
                                </button>
                                <button
                                    onClick={() => handleDeleteFile(file.id)}
                                    className={`bg-red-500 text-white px-4 py-2 rounded w-full md:w-auto ${isDeletingId === file.id ? 'bg-red-400' : ''}`}
                                    disabled={isDeletingId === file.id}
                                >
                                    {isDeletingId === file.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Files;
