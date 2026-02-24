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
    if (delta < 4) return 'from-green-200 to-emerald-300';      // Safe
    if (delta < 7) return 'from-amber-200 to-yellow-300';       // Caution
    return 'from-red-200 to-rose-300';                          // Danger
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

const DIRECTIONS = [
    "N","NNE","NE","ENE",
    "E","ESE","SE","SSE",
    "S","SSW","SW","WSW",
    "W","WNW","NW","NNW"
];

function toDirection(code) {
    const i = DIRECTIONS.indexOf(code);
    return i === -1 ? code : DIRECTIONS[(i + 8) % 16];
}

// Individual forecast column
function ForecastColumn({ data }) {
    const maxHeight = 120;
    const barHeight = Math.max(Math.min(data.windSpeed * 10, maxHeight - 25), 35);
    const barColor = getBarColor(data.windSpeed, data.gust);
    const windDeg = Number(data.degree);
    const rotation = (windDeg + 180 + 360) % 360;

    return (
        <div className="flex-shrink-0 relative border-r border-gray-200 pr-3 last:border-r-0">
            <div className="w-16 flex flex-col items-center">
                <div className="relative flex items-end justify-center mb-1" style={{ height: `${maxHeight}px` }}>
                    <div
                        className="absolute text-3xl font-bold text-gray-800"  // Changed from text-2xl to text-3xl
                        style={{
                            bottom: `${barHeight + 2}px`,
                            transform: `rotate(${rotation}deg)`
                        }}
                    >
                        ↑
                    </div>
                   
                    {/* Bar with Wind Speed Inside */}
                    <div
                        className={`w-16 bg-gradient-to-t ${barColor} rounded-t-lg transition-all shadow-md relative flex items-center justify-center px-1`}
                        style={{ height: `${barHeight}px` }}
                    >
                        {/* Wind Speed with mph Inside Bar */}
                        <div className="text-xs font-bold text-gray-900 text-center leading-tight">
                            {data.windSpeed} mph
                        </div>
                    </div>
                </div>

                {/* Gust Value BELOW BAR */}
                <div className="mt-2 flex flex-col items-center">
                    <div className="text-xs font-semibold text-gray-700">Gust</div>
                    <div className="text-sm font-bold text-gray-900">{data.gust}</div>
                </div>

                <div className="w-full border-t border-gray-300 my-2"></div>

                {/* Wind Direction Info */}
                <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-gray-800">{toDirection(data.direction)}</div>
                    <div className="text-xs text-gray-500">From {data.degree}°</div>
                </div>

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
            <div className="mb-4 text-center bg-gradient-to-r from-blue-100 to-sky-100 text-blue-900 py-3 px-5 rounded-xl shadow-md border border-blue-200">
                <div className="text-base font-bold">{date}</div>
            </div>

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
                        <div className="w-4 h-4 bg-gradient-to-t from-green-200 to-emerald-300 rounded"></div>
                        <span className="text-gray-700">Safe (&lt;4 mph)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-t from-amber-200 to-yellow-300 rounded"></div>
                        <span className="text-gray-700">Caution (4-7 mph)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-t from-red-200 to-rose-300 rounded"></div>
                        <span className="text-gray-700">Danger (&gt;7 mph)</span>
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
                Arrow shows wind direction • Numbers in MPH • Bar color shows gust severity
            </div>
        </div>
    );
}