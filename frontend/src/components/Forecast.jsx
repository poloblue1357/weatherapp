
// zip code
// api.openweathermap.org/data/2.5/forecast?zip={zip code},{country code}&appid={API key}



// Wishlist / Stretch Features

// Tiered users

// --Free → 3-hour forecast

// --Premium → One Call 3.0, more details

// --Invite-only or manual approval system

// Backend improvements

// --Per-location caching (MongoDB)

// --Rate-limit non-account users

// --Separate backend files for free vs premium API

// Frontend / UX

// --Hourly / 3-hour wind + temperature charts

// --Toggle free vs premium data for logged-in users

// --Maintenance mode for updates

// Security / Deployment

// --All API keys in backend .env

// --Rotate keys if exposed

// --Rate-limiting + caching to save API calls

// Optional / Fun

// --Email notifications via backend

// --Save favorite cities

// --Dashboard for multiple cities

// --Push notifications for alerts

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

function Forecast({ weatherInfo }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !weatherInfo || !weatherInfo.data || !weatherInfo.labels) return;

        const chartInstance = new Chart(chartRef.current, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'], //weatherInfo.map(item => item.time), // array of labels
            datasets: [{
                label: 'Wind Gusts',
                data: [1, 3, 5, 7, 9, 2, 4], // weatherInfo.map(item => item.windGust), // array of numbers
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
        });

        return () => {
        chartInstance.destroy(); // clean up on unmount/update
        };
    });

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md mt-8">
            <h2 className="text-center text-xl font-semibold mb-4">Wind Gusts Forecast</h2>
            <div className="relative">
                <canvas ref={chartRef} className="w-full h-64 md:h-80"></canvas>
            </div>
        </div>
    );
}

export default Forecast;

