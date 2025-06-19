/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from 'react';
import { Tooltip, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { FaFileAlt, FaDatabase, FaStickyNote, FaDownload, FaChartPie, FaChartBar } from 'react-icons/fa';

const Statistics = () => {
    const [data, setData] = useState({
        totalFiles: 0,
        storageUsed: 0,
        downloads: 0,
    });
    const [fileFormats, setFileFormats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch statistics
                const statsResponse = await fetch('https://cloud-file-storage-backend.vercel.app/api/statistics');
                if (!statsResponse.ok) throw new Error('Failed to fetch statistics');
                const statsResult = await statsResponse.json();
                setData(statsResult);


                // Fetch file formats
                const formatsResponse = await fetch('https://cloud-file-storage-backend.vercel.app/api/file-formats');
                if (!formatsResponse.ok) throw new Error('Failed to fetch file formats');
                const formatsResult = await formatsResponse.json();
                setFileFormats(formatsResult.formats || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const pieData = useMemo(() => {
        return fileFormats.map(([format, count]) => ({ name: format, value: count }));
    }, [fileFormats]);

    const COLORS = ['#4C51BF', '#38B2AC', '#ED8936', '#E53E3E', '#805AD5', '#319795', '#D69E2E'];

    const formatStorage = (gb) => {
        if (gb >= 1000) return `${(gb / 1000).toFixed(1)} TB`;
        if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
        return `${gb.toFixed(1)} GB`;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-50 z-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-700 mb-2">Data Loading Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                        onClick={() => window.location.reload()}
                    >
                        Reload Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Cloud Storage Dashboard</h1>
                    <p className="text-gray-600 mt-2">Monitor your storage usage and file statistics</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.02]">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FaFileAlt className="text-blue-600 text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 font-medium">Total Files</h3>
                                <p className="text-3xl font-bold text-gray-800">{data.totalFiles}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">All stored files</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.02]">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <FaDatabase className="text-purple-600 text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 font-medium">Storage Used</h3>
                                <p className="text-3xl font-bold text-gray-800">{formatStorage(data.storageUsed)}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-purple-600 h-2 rounded-full" 
                                    style={{ width: `${Math.min(data.storageUsed / 512 * 1000, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">512 MB available</p>
                        </div>
                    </div>

                    {/* <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.02]">
                        <div className="flex items-center">
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <FaStickyNote className="text-amber-600 text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 font-medium">Notes</h3>
                                <p className="text-3xl font-bold text-gray-800">{notes.length}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">Stored notes</p>
                        </div>
                    </div> */}

                    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.02]">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FaDownload className="text-green-600 text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-gray-500 font-medium">Downloads</h3>
                                <p className="text-3xl font-bold text-gray-800">{data.downloads}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">Total file downloads</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Fixed Pie Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaChartPie className="mr-2 text-blue-500" />
                                File Type Distribution
                            </h2>
                            <div className="text-sm text-gray-500">By file count</div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            {pieData.length > 0 ? (
                                <div className="w-full h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={3}
                                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => [`${value} files`, 'Count']}
                                                contentStyle={{ 
                                                    borderRadius: '8px', 
                                                    border: '1px solid #e5e7eb',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Legend 
                                                layout="horizontal"
                                                verticalAlign="bottom"
                                                align="center"
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                formatter={(value, entry, index) => (
                                                    <span className="text-gray-600 text-sm">{value}</span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <p className="text-gray-500">No file format data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Bar Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaChartBar className="mr-2 text-green-500" />
                                File Format Details
                            </h2>
                            <div className="text-sm text-gray-500">Top file formats</div>
                        </div>
                        
                        {pieData.length > 0 ? (
                            <div className="w-full h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={pieData} 
                                        margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
                                    >
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [`${value} files`, 'Count']}
                                            contentStyle={{ 
                                                borderRadius: '8px', 
                                                border: '1px solid #e5e7eb',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Bar 
                                            dataKey="value" 
                                            name="File Count" 
                                            radius={[4, 4, 0, 0]}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-gray-500">No file format data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recent Notes</h2>
                        <span className="text-sm text-gray-500">{notes.length} total notes</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notes.slice(0, 6).map((note, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                        <FaStickyNote className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800 truncate">{note.title || `Note ${index + 1}`}</h3>
                                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                            {note.content || 'No content available'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-gray-500">
                                    Created: Today
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Statistics;