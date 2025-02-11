import { useEffect, useState, useMemo } from 'react';
import { Tooltip, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Statistics = () => {
    const [data, setData] = useState({
        totalFiles: 0,
        storageUsed: 0,
        downloads: 0,
    });
    const [fileFormats, setFileFormats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noteno, setNotes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsResponse = await fetch('https://cloud-file-storage-backend.vercel.app/api/statistics');
                if (!statsResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const statsResult = await statsResponse.json();
                setData(statsResult);

                const noteresponse = await fetch('https://cloud-file-storage-backend.vercel.app/api/notes');
                if (!noteresponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const notesResult = await noteresponse.json();
                setNotes(notesResult);

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

    const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];

    if (loading) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) return <p className="text-error text-center mt-4">Error: {error}</p>;

    return (
        <section id="statistics" className="p-6 bg-base-100 text-base-content">
            <div className="text-3xl py-3 font-semibold text-center">Dashboard</div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 mb-12">
                <div className="card bg-primary text-primary-content shadow-xl p-8">
                    <h4 className="text-xl font-bold mb-4">Total Files</h4>
                    <p className="text-4xl font-bold">{data.totalFiles}</p>
                </div>
                <div className="card bg-secondary text-secondary-content shadow-xl p-8">
                    <h4 className="text-xl font-bold mb-4">Storage Used</h4>
                    <p className="text-4xl font-bold">{data.storageUsed} GB</p>
                </div>
                <div className="card bg-accent text-accent-content shadow-xl p-8">
                    <h4 className="text-xl font-bold mb-4">Total Notes</h4>
                    <p className="text-4xl font-bold">{noteno.length} Items</p>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center lg:flex-row lg:space-x-12 mt-8">
                <div className="card w-full bg-base-200 shadow-xl p-6">
                    <h4 className="text-2xl font-bold mb-4">File Types in Storage</h4>
                    <PieChart width={280} height={280} className="mx-auto">
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
                <div className="card w-full bg-base-200 shadow-xl p-6 mt-10">
                    <h4 className="text-2xl font-bold mb-4">File Format Distribution</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={pieData}>
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#2196F3" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};

export default Statistics;
