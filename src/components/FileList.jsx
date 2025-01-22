/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import FileItem from './FileItem';

const FileList = ({ files, onDownload, onDelete, downloadingFileId, deletingFileId }) => {
    return (
        <div className="w-full">
            {files.length > 0 ? (
                <ul className="space-y-4">
                    {files.map((file) => (
                        <FileItem
                            key={file.id}
                            file={file}
                            onDownload={onDownload}
                            onDelete={onDelete}
                            isDownloading={downloadingFileId === file.id}
                            isDeleting={deletingFileId === file.id}
                        />
                    ))}
                </ul>
            ) : (
                <div className="alert alert-info shadow-lg bg-gray-800 text-gray-200 border-gray-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 text-blue-400"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M9 20h.01M3 16h.01M21 16h.01M12 12h.01M12 8h.01M12 4h.01M12 16h.01M4 12h.01M20 12h.01M12 8h.01M12 4h.01"
                        />
                    </svg>
                    <span>No files available. Upload some files to get started!</span>
                </div>
            )}
        </div>
    );
};

export default FileList;
