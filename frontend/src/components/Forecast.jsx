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


import React from 'react';

// Group forecast by date
function groupByDate(forecastInfo) {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    forecastInfo.forEach(item => {
        if (item.date !== currentDate) {
        if (currentGroup.length > 0) {
            groups.push({ date: currentDate, items: currentGroup });
        }
        currentDate = item.date;
        currentGroup = [item];
        } else {
        currentGroup.push(item);
        }
    });

    if (currentGroup.length > 0) {
        groups.push({ date: currentDate, items: currentGroup });
    }

    return groups;
}

// Get bar color based on gust delta
function getBarColor(windSpeed, gust) {
    const delta = gust - windSpeed;
    
    // if (delta < 4) return 'from-blue-600 to-blue-400';      // Calm - minimal gusting
    if (delta < 4) return 'from-green-500 to-emerald-600'
    if (delta < 7) return 'from-orange-600 to-orange-400';  // Moderate - noticeable gusts
    return 'from-red-600 to-red-400';                        // Significant - dangerous gusts
}

// Get weather icon
function getWeatherIcon(condition) {
    const lower = condition.toLowerCase();
    if (lower.includes('clear')) return '☀️';
    if (lower.includes('cloud') || lower.includes('overcast')) return '☁️';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('partly')) return '⛅';
    if (lower.includes('thunder') || lower.includes('storm')) return '⛈️';
    return '🌤️';
}

// Individual forecast column
function ForecastColumn({ data }) {
    const maxHeight = 120;
    // Minimum bar height of 35px so arrow is always visible
    const barHeight = Math.max(Math.min(data.windSpeed * 10, maxHeight - 25), 35);
    const barColor = getBarColor(data.windSpeed, data.gust);

    return (
        <div className="flex-shrink-0 relative border-r border-gray-200 pr-3 last:border-r-0">
        <div className="w-16 flex flex-col items-center">
            {/* Wind Speed Number - ABOVE BAR */}
            <div className="relative flex items-end justify-center mb-1" style={{ height: `${maxHeight}px` }}>
            <div
                className="absolute text-sm font-bold text-gray-900"
                style={{ bottom: `${barHeight + 7.5}px` }}
            >
                {data.windSpeed}
            </div>
            
            {/* Single Bar with Color Based on Gust Delta */}
            <div
                className={`w-16 bg-gradient-to-t ${barColor} rounded-t-lg transition-all shadow-md relative flex items-center justify-center`}
                style={{ height: `${barHeight}px` }}
            >
                {/* Wind Arrow Inside Bar */}
                <div
                className="text-white text-2xl font-bold"
                style={{ transform: `rotate(${data.degree - 42}deg)` }}
                >
                ↑
                </div>
            </div>
            </div>

            {/* Gust Value BELOW BAR - First */}
            <div className="mt-2 flex flex-col items-center">
            <div className="text-xs font-semibold text-gray-700">Gust</div>
            <div className="text-sm font-bold text-gray-900">{data.gust}</div>
            </div>

            {/* Divider Line */}
            <div className="w-full border-t border-gray-300 my-2"></div>

            {/* Wind Direction Info BELOW Gust - Second */}
            <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-gray-800">{data.direction}</div>
            <div className="text-xs text-gray-500">{data.degree}°</div>
            </div>

            {/* Divider Line */}
            <div className="w-full border-t border-gray-300 my-2"></div>
        </div>

        {/* Additional Info Below */}
        <div className="mt-3 text-center space-y-1 w-16">
            <div className="text-sm font-bold text-gray-800">{data.time}</div>
            <div className="text-xs text-gray-700 capitalize flex items-center justify-center gap-1">
            <span>{getWeatherIcon(data.condition)}</span>
            <span className="truncate">{data.condition}</span>
            </div>
            <div className="text-sm font-medium text-gray-900">{data.temp}°F</div>
        </div>
        </div>
    );
}

// Day group component
function DayGroup({ date, items }) {
    return (
        <div className="relative inline-flex flex-col border-r-2 border-gray-300 pr-6 mr-6 last:border-r-0 last:mr-0">
        {/* Day Header */}
        {/* <div className="mb-4 text-center bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500 text-white py-3 px-5 rounded-xl shadow-lg"> */}
        <div className="mb-4 text-center bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 py-3 px-5 rounded-xl shadow-md">
            <div className="text-base font-bold">{date}</div>
        </div>

        {/* Forecast Columns */}
        <div className="flex gap-2">
            {items.map((item, idx) => (
            <ForecastColumn
                key={idx}
                data={item}
            />
            ))}
        </div>
        </div>
    );
}

// Main Timeline Component
export default function Forecast({ forecastInfo }) {
  // Safety check - return null if no data
    if (!forecastInfo || forecastInfo.length === 0) {
        return null;
    }

    const groupedData = groupByDate(forecastInfo);

    return (
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden mb-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500 text-white p-5">
            <h2 className="text-xl font-bold text-center">5-Day Wind Forecast</h2>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="text-center text-sm font-bold text-gray-700 mb-2">Bar Color = Gust Severity</div>
            <div className="flex justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
                {/* <div className="w-4 h-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded"></div> */}
                <div className="w-4 h-4 bg-gradient-to-t from-green-500 to-emerald-600 rounded"></div>
                <span className="text-gray-700">Minimal (&lt;4 mph)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-t from-orange-600 to-orange-400 rounded"></div>
                <span className="text-gray-700">Moderate (4-7 mph)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-t from-red-600 to-red-400 rounded"></div>
                <span className="text-gray-700">Significant (&gt;7 mph)</span>
            </div>
            </div>
        </div>

        {/* Scrollable Timeline */}
        <div className="overflow-x-auto p-6 pb-8">
            <div className="inline-flex">
            {groupedData.map((group, idx) => (
                <DayGroup
                key={idx}
                date={group.date}
                items={group.items}
                />
            ))}
            </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-center text-xs text-gray-600">
            Arrow shows wind direction • Numbers in MPH • <br /> Bar color shows gust severity
        </div>
        </div>
    );
}


