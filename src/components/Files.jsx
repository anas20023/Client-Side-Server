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
        // set the size of the file to the state setS for all file size
        setS(acceptedFiles[0].size);
        if (filteredFiles.length !== acceptedFiles.length) {
            //alert("Some files exceed the size limit and won't be uploaded.");
            setNotification({ type: 'error', message: "Some files exceed the size limit and won't be uploaded." }); // Error message
        }
        setFileContents(filteredFiles);
        setFileNames(filteredFiles.map(file => file.name));
    };

    const handleUpload = async () => {
        if (fileContents.length === 0 || fileNames.length === 0) {
            // alert('Please select files to upload.');
            setNotification({ type: 'error', message: 'Please select files to upload.' }); // Error message
            return;
        }

        setLoading(true);
        setUploadProgress(0); // Ensure progress starts at 0

        const formData = new FormData();
        fileContents.forEach((fileContent) => {
            formData.append('files', fileContent);
        });
        formData.append('fileNames', JSON.stringify(fileNames));

        try {
            // console.log("file size is ",s); if file size is smalller then 10 MB then it will be uploaded with vercel backend
            if (s < 10000000) {
                await axios.post(
                    'https://cloud-file-storage-backend.vercel.app/api/upload',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        onUploadProgress: (progressEvent) => {
                            // Check if total is not zero to avoid division by zero
                            if (progressEvent.total > 0) {
                                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                setUploadProgress(percentCompleted); // Update progress percentage
                            }
                        }
                    }
                );
            }
            else {
                await axios.post(
                    'https://cloud-file-storage-backend-2pr4.onrender.com/api/upload',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        onUploadProgress: (progressEvent) => {
                            // Check if total is not zero to avoid division by zero
                            if (progressEvent.total > 0) {
                                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                setUploadProgress(percentCompleted); // Update progress percentage
                            }
                        }
                    }
                );
            }
            // Notification will show for 2 seconds
            setNotification({ message: 'File uploaded successfully', type: 'success' });
            setTimeout(() => {
                setNotification({ message: '', type: '' });
            }, 2000);
            setFileContents([]);
            setFileNames([]);
            fetchFiles(); // Refresh file list after upload
        } catch (error) {
            // console.error('Error during file upload:', error);
            setTimeout(() => {
                setNotification({ type: 'error', message: 'Failed to upload files. Please try again.' }); // Error message
            }, 2000);
        } finally {
            setLoading(false);
            setUploadProgress(0); // Reset progress after upload
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
            fetchFiles(); // Refresh file list after deletion
        } catch (error) {
            //console.error('Error deleting file:', error);
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

    return (
        <section id="files" className="p-6 bg-gray-100 min-h-screen">
            <h3 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Manage Files</h3>
            <UploadSection
                fileNames={fileNames}
                handleDrop={handleDrop}
                handleUpload={handleUpload}
                loading={loading}
                uploadProgress={uploadProgress} // Pass uploadProgress to UploadSection
            />
            <FileList
                files={files}
                onDownload={handleDownloadFile}
                onDelete={handleDeleteFile}
                downloadingFileId={downloadingFileId}
                deletingFileId={isDeletingId}
            />
            <Notification
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification({ type: '', message: '' })} // Close notification
            />
        </section>
    );

};

export default Files;