/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

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

const InfoCard = ({ title, value, icon }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="flex items-start space-x-4">
      <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-500 mb-1">{title}</h2>
        <p className="text-xl font-semibold text-gray-800 break-words">{value}</p>
      </div>
    </div>
  </div>
);

const Settings = () => {
  const systemInfo = getSystemInfo();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(systemInfo, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 md:p-10 max-w-6xl mx-auto border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Device Information
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Detailed system information about your current device and browser environment
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? 'Copied!' : 'Copy All'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InfoCard 
            title="Operating System" 
            value={systemInfo.platform} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            } 
          />
          
          <InfoCard 
            title="Browser" 
            value={systemInfo.userAgent.split('/')[0].split('(')[0]} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            } 
          />
          
          <InfoCard 
            title="Screen Resolution" 
            value={systemInfo.screenResolution} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            } 
          />
          
          <InfoCard 
            title="Language" 
            value={systemInfo.language} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            } 
          />
          
          <InfoCard 
            title="Network Connection" 
            value={systemInfo.connection} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            } 
          />
          
          <InfoCard 
            title="CPU Cores" 
            value={systemInfo.hardwareConcurrency} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            } 
          />
          
          <InfoCard 
            title="Time Zone" 
            value={systemInfo.timeZone} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } 
          />
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Raw System Data</h3>
          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto text-gray-600 border border-gray-200">
            {JSON.stringify(systemInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Settings;