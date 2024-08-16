/* eslint-disable no-unused-vars */
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
                const cachedTotalFiles = localStorage.getItem('totalFiles');
                const statsResponse = await fetch('https://cloud-file-storage-backend.vercel.app/api/statistics');
                if (!statsResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const statsResult = await statsResponse.json();

                // Fetch only if totalFiles or other data points have changed
                if (
                    cachedTotalFiles === null ||
                    Number(cachedTotalFiles) !== statsResult.totalFiles ||
                    statsResult.storageUsed !== data.storageUsed ||
                    statsResult.downloads !== data.downloads
                ) {
                    setData(statsResult);
                    localStorage.setItem('totalFiles', statsResult.totalFiles); // Cache the new value

                    const formatsResponse = await fetch('https://cloud-file-storage-backend.vercel.app/api/file-formats');
                    if (!formatsResponse.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const formatsResult = await formatsResponse.json();
                    // console.log(formatsResult);
                    setFileFormats(formatsResult.formats);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [data]); // Depend on data to refetch when it changes

    // Memoize pie chart data for file formats
    const pieData = useMemo(() => {
        return fileFormats.map(([format, count]) => ({ name: format, value: count }));
    }, [fileFormats]);

    const COLORS = ['#0466c8', '#09bc8a', '#d00000', '#ff5722', '#3f51b5'];

    if (loading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center">
                <svg className="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
            </div>
        );
    }
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };

    if (error) return <p>Error: {error}</p>;

    return (
        <section id="statistics" className="mb-8 p-4">
            <h3 className="text-xl font-semibold mb-4">Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded shadow">
                    <h4 className="text-lg font-bold mb-2">Total Files</h4>
                    <p className="text-3xl">{data.totalFiles}</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h4 className="text-lg font-bold mb-2">Storage Used</h4>
                    <p className="text-3xl">{data.storageUsed} GB</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row mt-8">
                <div className="w-full md:w-1/2 p-4">
                    <h4 className="text-lg font-bold mb-2">File Types in Storage</h4>
                    <PieChart width={300} height={300} className="mx-auto">
                       <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
                <div className="w-full md:w-1/2 p-4">
                    <h4 className="text-lg font-bold mb-2">Legend</h4>
                    <ul className="list-disc pl-5">
                        {pieData.map((entry, index) => (
                            <li key={`legend-${index}`} className="flex items-center mb-2">
                                <div
                                    className="w-4 h-4 mr-2"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className='text-sm'>{entry.name} ({entry.value})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Statistics;
