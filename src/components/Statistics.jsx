import { useEffect, useState, useMemo } from 'react';
import { Tooltip, PieChart, Pie, Cell } from 'recharts';

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
                const statsResponse = await fetch('https://cloud-file-storage-backend.vercel.app/api/statistics');
                if (!statsResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const statsResult = await statsResponse.json();
                setData(statsResult);

                const formatsResponse = await fetch('https://cloud-file-storage-backend.vercel.app/api/file-formats');
                if (!formatsResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const formatsResult = await formatsResponse.json();
                setFileFormats(formatsResult.formats);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const pieData = useMemo(() => {
        return fileFormats.map(([format, count]) => ({ name: format, value: count }));
    }, [fileFormats]);

    const COLORS = ['#0466c8', '#09bc8a', '#d00000', '#ff5722', '#3f51b5'];

    if (loading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-80 backdrop-blur-sm">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
            </div>
        );
    }

    if (error) return <p className="text-red-600 text-center mt-4">Error: {error}</p>;

    return (
        <section id="statistics" className="p-6 sm:p-8 lg:p-12 bg-white text-gray-900 rounded-xl shadow-xl">
            <h3 className="text-3xl sm:text-4xl font-semibold mb-8 text-center">Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 flex flex-col items-center">
                    <h4 className="text-xl font-bold mb-4">Total Files</h4>
                    <p className="text-5xl font-bold text-blue-700">{data.totalFiles}</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 flex flex-col items-center">
                    <h4 className="text-xl font-bold mb-4">Storage Used</h4>
                    <p className="text-5xl font-bold text-green-700">{data.storageUsed} GB</p>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:space-x-12 space-y-12 lg:space-y-0 mt-12">
                <div className="w-full lg:w-1/2 p-4">
                    <h4 className="text-2xl font-bold mb-6 text-center lg:text-left">File Types in Storage</h4>
                    <PieChart width={320} height={320} className="mx-auto lg:mx-0">
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={140}
                            fill="#8884d8"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
                <div className="w-full lg:w-1/2 p-4">
                    <h4 className="text-2xl font-bold mb-6 text-center lg:text-left">Legend</h4>
                    <ul className="list-disc pl-6">
                        {pieData.map((entry, index) => (
                            <li key={`legend-${index}`} className="flex items-center mb-4">
                                <div
                                    className="w-6 h-6 sm:w-7 sm:h-7 mr-4 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className='text-lg font-medium'>{entry.name} ({entry.value})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Statistics;
