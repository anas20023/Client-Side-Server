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
        <div className="bg-gray-900 shadow-xl rounded-lg p-6 mb-6 border border-gray-700">
            <h4 className="text-2xl font-bold text-gray-100 mb-4 text-center">Upload Files</h4>
            <div className="flex flex-col items-center">
                <div
                    {...getRootProps({
                        className: 'border-2 border-dashed border-gray-600 rounded-lg cursor-pointer w-full max-w-6xl h-32 flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition duration-300',
                    })}
                >
                    <input {...getInputProps()} />
                    <p className="text-gray-400 text-lg">Drag & drop files here, or click to select files</p>
                </div>
                {fileNames.length > 0 && (
                    <div className="mt-4 w-full text-center">
                        <span className="font-semibold text-gray-300">Selected Files:</span>
                        <ul className="list-disc pl-5 text-gray-400 mt-2">
                            {fileNames.map((name, index) => (
                                <li key={index} className="truncate">{name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <button
                    onClick={handleUpload}
                    className={`btn btn-primary mt-6 w-full max-w-xs text-lg ${loading ? 'btn-disabled' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="loading loading-spinner"></span>
                            Uploading... {uploadProgress}%
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
