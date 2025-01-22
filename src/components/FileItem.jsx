/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import React from 'react';
import {
    FaFilePdf,
    FaFileWord,
    FaFileExcel,
    FaFilePowerpoint,
    FaFileImage,
    FaFileAudio,
    FaFileVideo,
    FaArchive,
    FaFileAlt,
    FaFileCode,
    FaFileDownload,
    FaTrashAlt
} from 'react-icons/fa'; // FontAwesome icons
import { AiOutlineLink } from 'react-icons/ai';
import Notification from './Notification';

const fileIconMap = {
   'pdf': { icon: FaFilePdf, color: 'text-red-600' },
    'xlsx': { icon: FaFileExcel, color: 'text-green-600' },
    'xls': { icon: FaFileExcel, color: 'text-green-600' },
    'jpg': { icon: FaFileImage, color: 'text-yellow-600' },
    'jpeg': { icon: FaFileImage, color: 'text-yellow-600' },
    'png': { icon: FaFileImage, color: 'text-yellow-600' },
    'gif': { icon: FaFileImage, color: 'text-yellow-600' },
    'bmp': { icon: FaFileImage, color: 'text-yellow-600' },
    'tiff': { icon: FaFileImage, color: 'text-yellow-600' },
    'doc': { icon: FaFileWord, color: 'text-blue-600' },
    'docx': { icon: FaFileWord, color: 'text-blue-600' },
    'ppt': { icon: FaFilePowerpoint, color: 'text-orange-600' },
    'pptx': { icon: FaFilePowerpoint, color: 'text-orange-600' },
    'zip': { icon: FaArchive, color: 'text-gray-600' },
    'rar': { icon: FaArchive, color: 'text-gray-600' },
    '7z': { icon: FaArchive, color: 'text-gray-600' },
    'tar': { icon: FaArchive, color: 'text-gray-600' },
    'gz': { icon: FaArchive, color: 'text-gray-600' },
    'mp3': { icon: FaFileAudio, color: 'text-purple-600' },
    'wav': { icon: FaFileAudio, color: 'text-purple-600' },
    'ogg': { icon: FaFileAudio, color: 'text-purple-600' },
    'mp4': { icon: FaFileVideo, color: 'text-teal-600' },
    'avi': { icon: FaFileVideo, color: 'text-teal-600' },
    'mkv': { icon: FaFileVideo, color: 'text-teal-600' },
    'mov': { icon: FaFileVideo, color: 'text-teal-600' },
    'webm': { icon: FaFileVideo, color: 'text-teal-600' },
    'html': { icon: FaFileCode, color: 'text-orange-500' },
    'css': { icon: FaFileCode, color: 'text-blue-500' },
    'js': { icon: FaFileCode, color: 'text-yellow-500' },
    'py': { icon: FaFileCode, color: 'text-blue-400' },
    'java': { icon: FaFileCode, color: 'text-red-600' },
    'rb': { icon: FaFileCode, color: 'text-red-600' },
    'php': { icon: FaFileCode, color: 'text-purple-600' },
    'ai': { icon: FaFileAlt, color: 'text-red-500' },
    'psd': { icon: FaFileAlt, color: 'text-blue-500' },
    'c': { icon: FaFileCode, color: 'text-green-600' },
    'cpp': { icon: FaFileCode, color: 'text-blue-600' },
    'cs': { icon: FaFileCode, color: 'text-blue-500' },
    'go': { icon: FaFileCode, color: 'text-blue-300' },
    'rs': { icon: FaFileCode, color: 'text-red-600' },
    'swift': { icon: FaFileCode, color: 'text-orange-500' }
};

const defaultIcon = { icon: FaFileAlt, color: 'text-gray-500' };

const getFileIcon = (fileName) => {
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    return fileIconMap[ext] || defaultIcon;
};

const FileItem = ({ file, onDownload, onDelete, isDownloading, isDeleting }) => {
    const { icon: Icon, color } = getFileIcon(file.fileName);
    const [notification, setNotification] = useState({ type: '', message: '' });

    // Function to handle link copying
    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(file.fileURL)
            .then(() => {
                showNotification('success', 'Link copied to clipboard!');
            })
            .catch(() => {
                showNotification('error', 'Failed to copy link.');
            });
    };

    // Function to show notification
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), 3000); // Clear after 3 seconds
    };

    // Handling notifications for download and delete actions
    const handleDownload = () => {
        showNotification('success', `${file.fileName} is downloading...`);
        onDownload(file.fileURL, file.id);
    };

    const handleDelete = () => {
        showNotification('success', `${file.fileName} is being deleted.`);
        onDelete(file.id);
    };

    return (
        <li className="flex flex-col sm:flex-row justify-between items-center p-4 bg-base-100 rounded-lg shadow-lg mb-4">
            {/* Notification alert */}
            {notification.message && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification({ type: '', message: '' })}
                />
            )}
            {/* File details */}
            <div className="w-full sm:w-2/3 flex items-center mb-4 sm:mb-0">
                <Icon className={`h-6 w-6 ${color} mr-3`} />
                <div className="flex flex-col">
                    <span className="font-semibold text-sm sm:text-base truncate">{file.fileName}</span>
                    <span className="text-gray-500 text-xs sm:text-sm">{file.uploadDate}</span>
                </div>
            </div>
            {/* Action buttons */}
            <div className="w-full sm:w-1/4 flex justify-end space-x-2">
                <button
                    onClick={copyLinkToClipboard}
                    title="Copy link"
                    className="btn btn-sm btn-info flex items-center justify-center"
                >
                    <AiOutlineLink />
                </button>
                <button
                    onClick={handleDownload}
                    className={`btn btn-sm btn-success flex items-center justify-center ${isDownloading ? 'btn-disabled' : ''}`}
                    disabled={isDownloading}
                    title="Download"
                >
                    <FaFileDownload className="mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download'}
                </button>
                <button
                    onClick={handleDelete}
                    className={`btn btn-sm btn-error flex items-center justify-center ${isDeleting ? 'btn-disabled' : ''}`}
                    disabled={isDeleting}
                    title="Delete"
                >
                    <FaTrashAlt className="mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </li>
    );
};

export default FileItem;
