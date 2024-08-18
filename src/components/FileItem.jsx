/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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
    FaFileCsv,
    FaFileUpload,
    FaEdit, // Use FaEdit as an alternative if FaFileEdit is unavailable
    FaFileDownload,
    FaTrashAlt
} from 'react-icons/fa'; // FontAwesome icons

// Mapping of file extensions to FontAwesome icons and colors
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

// Default icon and color for unknown file formats
const defaultIcon = { icon: FaFileAlt, color: 'text-gray-500' };

// Function to get icon and color based on file extension
const getFileIcon = (fileName) => {
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    return fileIconMap[ext] || defaultIcon;
};

const FileItem = ({ file, onDownload, onDelete, isDownloading, isDeleting }) => {
    const { icon: Icon, color } = getFileIcon(file.fileName);

    return (
        <li className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm mb-4">
            <div className="w-full sm:w-2/3 flex items-center mb-4 sm:mb-0">
                <Icon className={`h-6 w-6 ${color} mr-3`} />
                <div className="flex flex-col">
                    <span className="font-semibold text-sm sm:text-base overflow-hidden">{file.fileName}</span>
                    <span className="text-gray-500 text-xs sm:text-sm">{file.uploadDate}</span>
                </div>
            </div>
            <div className="w-full sm:w-1/3 flex justify-end space-x-2">
                <button
                    onClick={() => onDownload(file.fileURL, file.id)}
                    className={`bg-green-500 text-white px-3 py-2 rounded flex items-center justify-center ${isDownloading ? 'bg-green-400' : ''}`}
                    disabled={isDownloading}
                    title="Download"
                >
                    <FaFileDownload className="mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download'}
                </button>
                <button
                    onClick={() => onDelete(file.id)}
                    className={`bg-red-500 text-white px-3 py-2 rounded flex items-center justify-center ${isDeleting ? 'bg-red-400' : ''}`}
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
