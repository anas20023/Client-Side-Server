/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { useDropzone } from 'react-dropzone';

const UploadSection = ({ fileNames, handleDrop, handleUpload, loading, uploadProgress }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        multiple: true,
    });

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h4 className="text-xl font-bold mb-4">Upload Files</h4>
            <div className="flex flex-col items-center">
                <div {...getRootProps({ className: 'border-2 border-dashed border-gray-300 p-4 rounded-lg cursor-pointer w-full max-w-lg' })}>
                    <input {...getInputProps()} />
                    <p className="text-center text-gray-500">Drag & drop files here, or click to select files</p>
                    {fileNames.length > 0 && (
                        <div className="mt-2">
                            <span className="font-semibold">Selected Files:</span>
                            <ul className="list-disc pl-5 text-gray-600">
                                {fileNames.map((name, index) => (
                                    <li key={index} className="truncate">{name}</li>
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
                            <span>{`Uploading... ${uploadProgress}%`}</span>
                        </span>
                    ) : (
                        'Upload'
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadSection;
