/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';

const Files = () => {
    const [files, setFiles] = useState([]);
    const [fileContents, setFileContents] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDeletingId, setIsDeletingId] = useState(null);
    const [downloadingFileId, setDownloadingFileId] = useState(null);

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
        setFileContents(acceptedFiles);
        setFileNames(acceptedFiles.map(file => file.name));
    };

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
            setFileContents([]);
            setFileNames([]);
            fetchFiles();
        } catch (error) {
            setLoading(false);
            console.error('Error during file upload:', error);
        }
    };

    const handleDownloadFile = (fileURL, id) => {
        setDownloadingFileId(id);
        try {
            // Create a link element
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = fileURL.split('/').pop(); // Use the filename from URL

            // Append the link, click it to trigger download, and clean up
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
            console.error('Error deleting file:', error);
        } finally {
            setIsDeletingId(null);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        multiple: true,
    });

    return (
        <section id="files" className="p-6 bg-gray-100 min-h-screen">
            <h3 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Manage Files</h3>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex-1">
                <h4 className="text-xl font-bold mb-4">Upload Files</h4>
                <div className="flex flex-col items-center">
                    <div {...getRootProps({ className: 'border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer w-full max-w-lg' })}>
                        <input {...getInputProps()} />
                        <p className="text-center text-gray-500">Drag & drop files here, or click to select files</p>
                        {fileNames.length > 0 && (
                            <div className="mt-2">
                                <span className="font-semibold">Selected Files:</span>
                                <ul>
                                    {fileNames.map((name, index) => (
                                        <li key={index} className="text-gray-600">{name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleUpload}
                        className={`bg-blue-500 text-white px-6 py-3 rounded mt-4 ${loading ? 'bg-blue-400' : ''} flex items-center justify-center`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8z" />
                                </svg>
                                <span>Uploading...</span>
                            </span>
                        ) : (
                            'Upload'
                        )}
                    </button>
                </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h4 className="text-xl font-bold mb-4">Uploaded Files</h4>
                <ul>
                    {files.map((file) => (
                        <li key={file.id} className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <div className="w-full md:w-1/2 flex flex-row items-center mb-4 md:mb-0">
                                <FontAwesomeIcon icon={faFileAlt} className="h-6 w-6 text-blue-500 mr-3" />
                                <div className="flex flex-col">
                                    <span className="truncate font-semibold">{file.fileName}</span>
                                    <span className="text-gray-500 text-sm">{file.uploadDate}</span>
                                </div>
                            </div>
                            <div className="w-full md:w-auto flex flex-row space-x-2">
                                <button
                                    onClick={() => handleDownloadFile(file.fileURL, file.id)}
                                    className={`bg-green-500 text-white px-4 py-2 rounded flex items-center ${downloadingFileId === file.id ? 'bg-green-400' : ''}`}
                                    disabled={downloadingFileId === file.id}
                                    title="Download"
                                >
                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                    {downloadingFileId === file.id ? 'Downloading...' : 'Download'}
                                </button>
                                <button
                                    onClick={() => handleDeleteFile(file.id)}
                                    className={`bg-red-500 text-white px-4 py-2 rounded flex items-center ${isDeletingId === file.id ? 'bg-red-400' : ''}`}
                                    disabled={isDeletingId === file.id}
                                    title="Delete"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
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
