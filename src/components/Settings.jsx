/* eslint-disable no-unused-vars */
import React from 'react';

const getSystemInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const screenResolution = `${window.screen.width} x ${window.screen.height}`;
    const language = navigator.language;

    // Additional system information
    const connection = navigator.connection ? navigator.connection.effectiveType : 'Unavailable';
    const hardwareConcurrency = navigator.hardwareConcurrency || 'Unavailable';
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
        userAgent,
        platform,
        screenResolution,
        language,
        connection,
        hardwareConcurrency,
        timeZone,
    };
};

const Settings = () => {
    const systemInfo = getSystemInfo();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
                    Device Information
                </h1>
                <p className="text-lg text-gray-600 mb-12 text-center">
                    Below is the detailed system information of your device.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Operating System</h2>
                        <p className="text-gray-600">{systemInfo.platform}</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Browser</h2>
                        <p className="text-gray-600">{systemInfo.userAgent}</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Screen Resolution</h2>
                        <p className="text-gray-600">{systemInfo.screenResolution}</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Language</h2>
                        <p className="text-gray-600">{systemInfo.language}</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Network Connection</h2>
                        <p className="text-gray-600">{systemInfo.connection}</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">CPU Cores</h2>
                        <p className="text-gray-600">{systemInfo.hardwareConcurrency}</p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Time Zone</h2>
                        <p className="text-gray-600">{systemInfo.timeZone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
