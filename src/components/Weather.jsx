/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Label,
} from 'recharts';
import CountUp from 'react-countup';

const temperatureData = [
  { name: 'Jan', temp: 5 },
  { name: 'Feb', temp: 7 },
  { name: 'Mar', temp: 10 },
  { name: 'Apr', temp: 15 },
  { name: 'May', temp: 20 },
  { name: 'Jun', temp: 25 },
  { name: 'Jul', temp: 30 },
];

const weatherPieData = [
  { name: 'Sunny', value: 60 },
  { name: 'Rainy', value: 25 },
  { name: 'Cloudy', value: 10 },
  { name: 'Snowy', value: 5 },
];

const weatherColors = ['#FFD700', '#00BFFF', '#D3D3D3', '#FFFAFA'];

const weatherActivities = [
  { id: 1, activity: 'Severe thunderstorm warning issued', time: '2 hours ago' },
  { id: 2, activity: 'Heat advisory for the area', time: '4 hours ago' },
  { id: 3, activity: 'Rain expected tomorrow', time: '1 day ago' },
];

const StatsCard = ({ title, value, duration }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center flex-1">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <CountUp
      end={value}
      duration={duration}
      className="text-3xl font-semibold text-blue-500"
    />
  </div>
);

const WeatherActivityFeed = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
    <h2 className="text-xl font-bold mb-4">Recent Weather Alerts</h2>
    <ul>
      {activities.length > 0 ? (
        activities.map((item) => (
          <li key={item.id} className="flex justify-between mb-2 text-gray-700">
            <span>{item.activity}</span>
            <span className="text-sm text-gray-500">{item.time}</span>
          </li>
        ))
      ) : (
        <li className="text-gray-500">No recent alerts</li>
      )}
    </ul>
  </div>
);

const WeatherDashboard = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Statistics Counter */}
        <StatsCard title="Current Temperature" value={27} duration={2} />
        {/* Recent Weather Alerts Feed */}
        <WeatherActivityFeed activities={weatherActivities} />
      </div>

      {/* Temperature Line Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Temperature Trends</h2>
          <span className="text-sm text-gray-500">Jan - Jul 2024</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name">
              <Label value="Month" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value="Temperature (°C)" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: 'none' }} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#ff7300"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weather Pie Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Weather Conditions Breakdown</h2>
          <span className="text-sm text-gray-500">As of Aug 2024</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={weatherPieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {weatherPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={weatherColors[index % weatherColors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} %`} />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherDashboard;
