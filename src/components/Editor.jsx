/* eslint-disable no-unused-vars */
import React from 'react';
import MonacoEditor from '@monaco-editor/react';

const CodeEditor = () => {
    const handleEditorChange = (value) => {
        console.log('Code changed:', value);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">C++ Code Editor</h2>
                <MonacoEditor
                    height="500px"
                    language="cpp"
                    theme="vs-dark"
                    defaultValue="// Write your C++ code here"
                    onChange={handleEditorChange}
                    className="rounded-lg"
                />
                <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                    Run Code
                </button>
            </div>
        </div>
    );
};

export default CodeEditor;
