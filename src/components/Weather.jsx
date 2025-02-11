/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

const WeatherDetailCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex flex-col items-center justify-center flex-1 border border-gray-200">
    <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-gray-800">{title}</h2>
    <p className="text-lg sm:text-2xl font-semibold text-blue-600">{value}</p>
  </div>
);

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Get the user's current location
    const getCurrentLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };

    const fetchWeatherData = async () => {
      try {
        // Get current location
        const position = await getCurrentLocation();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Fetch weather data from your backend
        const response = await fetch(`https://cloud-file-storage-backend.vercel.app/api/weather?latitude=${latitude}&longitude=${longitude}`);
        const data = await response.json();
        setWeatherData(data);

      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  if (!weatherData) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const {
    current: {
      temp_c,
      condition: { text: conditionText, icon },
      wind_mph,
      pressure_mb,
      precip_mm,
      humidity,
      feelslike_c,
      dewpoint_c,
      vis_km,
      uv,
      gust_mph,
    },
    location: {
      name,
      country,
      lat,
      lon,
    }
  } = weatherData;

  return (
    <div className="p-6 md:p-12 flex flex-col gap-6 max-w-screen-lg mx-auto">
      <div className="bg-blue-600 rounded-lg shadow-lg p-6 flex flex-col items-center sm:flex-row sm:items-start">
        <div className="flex items-center mb-4 sm:mb-0 sm:mr-6">
          <img src={`https:${icon}`} alt={conditionText} className="w-20 h-20 sm:w-24 sm:h-24" />
        </div>
        <div className="text-center sm:text-left ">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">{name}, {country}</h1>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{temp_c}°C</p>
          <p className="text-md sm:text-lg text-white">{conditionText}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <WeatherDetailCard title="Feels Like" value={`${feelslike_c}°C`} />
        <WeatherDetailCard title="Dew Point" value={`${dewpoint_c}°C`} />
        <WeatherDetailCard title="Wind Speed" value={`${wind_mph} mph`} />
        <WeatherDetailCard title="Humidity" value={`${humidity}%`} />
        <WeatherDetailCard title="Pressure" value={`${pressure_mb} mb`} />
        <WeatherDetailCard title="Precipitation" value={`${precip_mm} mm`} />
        <WeatherDetailCard title="Visibility" value={`${vis_km} km`} />
        <WeatherDetailCard title="UV Index" value={uv} />
        <WeatherDetailCard title="Gust Speed" value={`${gust_mph} mph`} />
      </div>
    </div>
  );
};

export default WeatherDashboard;
