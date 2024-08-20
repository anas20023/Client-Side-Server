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

    const MAX_FILE_SIZE = 200 * 1024 * 1024; // 500MB

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
            const response = await axios.post(
                'https://cloud-file-storage-backend.onrender.com/api/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        //console.log(`${percentCompleted} Uploaded `)
                    }
                }
            );

            console.log('Response:', response.data);
            setFileContents([]);
            setFileNames([]);
            fetchFiles();
        } catch (error) {
            console.error('Error during file upload:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleDownloadFile = (fileURL, id) => {
        setDownloadingFileId(id);
        try {
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = fileURL; // URL of the file to download
            link.download = fileURL.split('/').pop(); // Use the file name as download name
            document.body.appendChild(link); // Append to body to make it clickable
            link.click(); // Trigger the download
            document.body.removeChild(link); // Remove the link from the document
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
                onDownload={handleDownloadFile}
                onDelete={handleDeleteFile}
                downloadingFileId={downloadingFileId}
                deletingFileId={isDeletingId}
            />
        </section>
    );
};

export default Files;
