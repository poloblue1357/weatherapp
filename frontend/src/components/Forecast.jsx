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
import { Navigation } from 'lucide-react';

// Group forecast by date
function groupByDate( forecastInfo ) {
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

// Individual forecast column
function ForecastColumn( {data} ) {
    const maxHeight = 120;
    // Calculate heights but cap them so numbers don't go off screen
    const windHeight = Math.min(data.windSpeed * 10, maxHeight - 25); // Leave 25px for number
    const gustHeight = Math.min(data.gust * 10, maxHeight - 25);

    const bgColor = getHourBackgroundColor(data.windSpeed);

    return (
        <div className={`flex-shrink-0 relative border-r border-gray-200 pr-3 last:border-r-0 ${bgColor} rounded-xl p-3 -mx-1`}>
        <div className="flex gap-2">
            {/* Wind Bar */}
            <div className="w-14 flex flex-col items-center">
            {/* Wind Bar Container */}
            <div className="relative flex items-end justify-center" style={{ height: `${maxHeight}px` }}>
                {/* Wind Speed Number - 7.5px ABOVE BAR */}
                <div
                className="absolute text-sm font-bold text-blue-900"
                style={{ bottom: `${windHeight + 7.5}px` }}
                >
                {data.windSpeed}
                </div>
            
                {/* Wind Bar with gradient and shadow */}
                <div
                className="w-14 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all shadow-md"
                style={{ height: `${windHeight}px` }}
                />
            </div>

            {/* Wind Direction - BELOW BAR - ARROW */}
            <div className="mt-2 flex flex-col items-center">
                <div
                className="text-black text-xl font-bold leading-none mb-1"
                style={{ transform: `rotate(${data.degree - 42}deg)` }}
                >
                ↑
                </div>
                <div className="text-xs font-bold text-gray-800">{data.direction}</div>
                <div className="text-xs text-gray-500">{data.degree}°</div>
            </div>
            </div>

            {/* Gust Bar */}
            <div className="w-14 flex flex-col items-center">
            {/* Gust Bar Container */}
            <div className="relative flex items-end justify-center" style={{ height: `${maxHeight}px` }}>
                {/* Gust Number - 7.5px ABOVE BAR */}
                <div
                className="absolute text-sm font-bold text-purple-900"
                style={{ bottom: `${gustHeight + 7.5}px` }}
                >
                {data.gust}
                </div>
            
                {/* Gust Bar with gradient and shadow */}
                <div
                className="w-14 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all shadow-md"
                style={{ height: `${gustHeight}px` }}
                />
            </div>

            {/* Precipitation info below */}
            <div className="mt-2 flex flex-col items-center">
                <div className="text-xs font-semibold text-gray-700 mb-1">Precip</div>
                <div className="text-xs text-blue-600 font-bold">
                {data.precipitation > 0 ? `${data.precipitation}"` : '0"'}
                </div>
                <div className="text-xs text-blue-600 font-bold">
                {data.precipitation > 0 ? `${(data.precipitation * 100).toFixed(0)}%` : '0%'}
                </div>
            </div>
            </div>
        </div>

        {/* Additional Info Below */}
        <div className="mt-3 text-center space-y-1">
            <div className="text-s font-bold text-black-600">{data.time}</div>
            <div className="text-xs text-gray-700 capitalize flex items-center justify-center gap-1">
            <span>{getWeatherIcon(data.condition)}</span>
            <span>{data.condition}</span>
            </div>
            <div className="text-sm font-bold text-gray-800">{data.temp}°F</div>
        </div>
        </div>
    );
}

// Get weather icon based on condition
function getWeatherIcon(condition) {
    const lower = condition.toLowerCase();
    if (lower.includes('clear')) return '☀️';
    if (lower.includes('cloud') || lower.includes('overcast')) return '☁️';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('partly')) return '⛅';
    if (lower.includes('thunder') || lower.includes('storm')) return '⛈️';
    return '🌤️'; // default partly cloudy
}

// Get background color based on wind speed for individual hour
function getHourBackgroundColor(windSpeed) {
    if (windSpeed <= 4) return 'bg-green-100';
    if (windSpeed === 5) return 'bg-amber-100';
    return 'bg-red-100';
}

// Day group component
function DayGroup({ date, items }) {
    return (
        <div className="relative inline-flex flex-col border-r-2 border-gray-300 pr-6 mr-6 last:border-r-0 last:mr-0">
        {/* Day Header */}
        <div className="mb-4 text-center bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500 text-white py-3 px-5 rounded-xl shadow-lg">
            <div className="text-base font-bold">{date}</div>
        </div>

        {/* Forecast Columns */}
        <div className="flex gap-3">
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
    const groupedData = groupByDate(forecastInfo);

    return (
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden mb-5">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500 text-white p-5">
            <h2 className="text-xl font-bold text-center">5-Day Wind Forecast</h2>
            <div className="flex justify-center gap-6 mt-3 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded"></div>
                <span>Good (≤4 mph)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-400 rounded"></div>
                <span>Caution (5 mph)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>Evaluate (&gt;5 mph)</span>
            </div>
            </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="font-semibold text-gray-700">Wind Speed (mph)</span>
            </div>
            <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="font-semibold text-gray-700">Gusts (mph)</span>
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
                • Arrow shows wind direction <br /> • Scroll horizontally for more information
            </div>
        </div>
    );
}


