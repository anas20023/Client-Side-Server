/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadSection from './UploadSection';
import FileList from './FileList';

const Files = () => {
    const [files, setFiles] = useState([]);
    const [fileContents, setFileContents] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [loading, setLoading] = useState(false);
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
            console.error('Error deleting file:', error);
        } finally {
            setIsDeletingId(null);
        }
    };

    return (
        <section id="files" className="p-6 bg-gray-100 min-h-screen">
            <h3 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Manage Files</h3>
            <UploadSection
                fileNames={fileNames}
                handleDrop={handleDrop}
                handleUpload={handleUpload}
                loading={loading}
            />
            <FileList
                files={files}
                isDeletingId={isDeletingId}
                downloadingFileId={downloadingFileId}
                handleDownloadFile={handleDownloadFile}
                handleDeleteFile={handleDeleteFile}
            />
        </section>
    );
};

export default Files;
