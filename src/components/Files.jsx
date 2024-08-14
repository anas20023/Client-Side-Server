/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

const Files = ({ fetchFiles, handleUpload, handleDownload, handleDelete, loading, progress, files }) => {
    const [fileNames, setFileNames] = useState([]);
    const [fileContents, setFileContents] = useState([]);
    const [isDeletingId, setIsDeletingId] = useState(null); // State for tracking the file being deleted
    const [downloadingFileId, setDownloadingFileId] = useState(null); // State for tracking the file being downloaded

    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFileContents(selectedFiles);
        setFileNames(selectedFiles.map(file => file.name));
    };

    // Upload files and then refresh the file list
    const uploadFiles = async () => {
        if (fileContents.length === 0 || fileNames.length === 0) {
            alert('Please select files and enter file names.');
            return;
        }

        await handleUpload(fileContents, fileNames);
        await fetchFiles(); // Fetch updated list after upload
    };

    // Handle file deletion and then refresh the file list
    const handleDeleteFile = async (id) => {
        setIsDeletingId(id); // Set deleting state for the specific file
        await handleDelete(id);
        setIsDeletingId(null); // Reset after deletion
        await fetchFiles(); // Fetch updated list after deletion
    };

    // Handle file download
    const handleDownloadFile = async (fileURL, id) => {
        setDownloadingFileId(id); // Set the downloading state for the specific file
        await handleDownload(fileURL);
        setDownloadingFileId(null); // Reset after download
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
                    onClick={uploadFiles}
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
