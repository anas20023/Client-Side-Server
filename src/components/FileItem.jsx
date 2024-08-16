/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const FileItem = ({ file, onDownload, onDelete, isDownloading, isDeleting }) => {
    return (
        <li className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm mb-4">
            <div className="w-full sm:w-2/3 flex items-center mb-4 sm:mb-0">
                <FontAwesomeIcon icon={faFileAlt} className="h-6 w-6 text-blue-500 mr-3" />
                <div className="flex flex-col">
                    <span className="truncate font-semibold text-sm sm:text-base">{file.fileName}</span>
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
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download'}
                </button>
                <button
                    onClick={() => onDelete(file.id)}
                    className={`bg-red-500 text-white px-3 py-2 rounded flex items-center justify-center ${isDeleting ? 'bg-red-400' : ''}`}
                    disabled={isDeleting}
                    title="Delete"
                >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </li>
    );
};

export default FileItem;
