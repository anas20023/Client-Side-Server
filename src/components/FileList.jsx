/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// FileList.jsx
import React from 'react';
import FileItem from './FileItem';

const FileList = ({ files, onDownload, onDelete, downloadingFileId, deletingFileId }) => {
    return (
        <ul className="w-full">
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
    );
};

export default FileList;