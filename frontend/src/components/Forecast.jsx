


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

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

function Forecast() {
    const canvasRef = useRef(null)
    const chartRef = useRef(null)

    useEffect(() => {
        if (!canvasRef.current) return

        // destroy previous chart (important)
        if (chartRef.current) {
            chartRef.current.destroy()
        }

        chartRef.current = new Chart(canvasRef.current, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
            {
                label: 'Wind Gusts',
                data: [1, 3, 5, 7, 9, 2, 4],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
        })
    })

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow mt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
                Wind Gusts Forecast
            </h2>

            <div className="h-64">
                <canvas ref={canvasRef} />
            </div>
        </div>
    )
}

export default Forecast


