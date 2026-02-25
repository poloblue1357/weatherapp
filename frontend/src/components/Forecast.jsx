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

// Get bar gradient based on gust delta
function getBarGradient(windSpeed, gust) {
    const delta = gust - windSpeed;
    if (delta < 4) return 'linear-gradient(to top, #30D158, #25A244)';
    if (delta < 7) return 'linear-gradient(to top, #FF9F0A, #CC7A00)';
    return 'linear-gradient(to top, #FF453A, #CC2A1F)';
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

// ── Apple dark palette ──────────────────────────────────────────
const T = {
    card:      { background: '#1C1C1E' },
    elevated:  { background: '#2C2C2E' },
    border:    '#38383A',
    header:    { background: 'linear-gradient(to right, #1C1C1E, #2C2C2E, #3A3A3C)' },
    dayBadge:  { background: '#2C2C2E', border: '1px solid rgba(10,132,255,0.4)', color: 'white' },
    textPrim:  { color: '#FFFFFF' },
    textSec:   { color: 'rgba(235,235,245,0.6)' },
    textThird: { color: 'rgba(235,235,245,0.35)' },
    arrow:     { color: '#0A84FF' },
};

// Individual forecast column
function ForecastColumn({ data }) {
    const maxHeight = 120;
    const barHeight = Math.max(Math.min(data.windSpeed * 10, maxHeight - 25), 35);
    const rotation = (Number(data.degree) + 180 + 360) % 360;

    return (
        <div style={{ flexShrink: 0, borderRight: `1px solid ${T.border}`, paddingRight: 12 }}
             className="last:border-r-0">
            <div style={{ width: 64, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Bar + arrow */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: maxHeight, marginBottom: 4 }}>
                    <div style={{ position: 'absolute', bottom: barHeight + 4, fontSize: 22, fontWeight: 'bold', transform: `rotate(${rotation}deg)`, ...T.arrow }}>
                        ↑
                    </div>
                    <div style={{ width: 64, height: barHeight, background: getBarGradient(data.windSpeed, data.gust), borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 'bold', color: 'white' }}>{data.windSpeed} mph</span>
                    </div>
                </div>

                {/* Gust */}
                <div style={{ marginTop: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, ...T.textSec }}>Gust</div>
                    <div style={{ fontSize: 13, fontWeight: 'bold', ...T.textPrim }}>{data.gust}</div>
                </div>

                <div style={{ width: '100%', borderTop: `1px solid ${T.border}`, margin: '8px 0' }} />

                {/* Direction */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 'bold', ...T.textPrim }}>{toDirection(data.direction)}</div>
                    <div style={{ fontSize: 11, ...T.textThird }}>From {data.degree}°</div>
                </div>

                <div style={{ width: '100%', borderTop: `1px solid ${T.border}`, margin: '8px 0' }} />
            </div>

            {/* Time / condition / temp */}
            <div style={{ textAlign: 'center', width: 64 }}>
                <div style={{ fontSize: 13, fontWeight: 'bold', ...T.textPrim }}>{data.time}</div>
                <div style={{ fontSize: 11, ...T.textSec, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <span>{getWeatherIcon(data.condition)}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 48 }}>{data.condition}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, ...T.textPrim }}>{data.temp}°F</div>
            </div>
        </div>
    );
}

// Day group component
function DayGroup({ date, items }) {
    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', borderRight: `2px solid ${T.border}`, paddingRight: 24, marginRight: 24 }}
             className="last:border-r-0 last:mr-0">
            <div style={{ marginBottom: 16, textAlign: 'center', ...T.dayBadge, padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 'bold' }}>
                {date}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                {items.map((item, idx) => (
                    <ForecastColumn key={idx} data={item} />
                ))}
            </div>
        </div>
    );
}

// Main Timeline Component
export default function Forecast({ forecastInfo }) {
    if (!forecastInfo || forecastInfo.length === 0) return null;

    const groupedData = groupByDate(forecastInfo);

    return (
        <div style={{ ...T.card, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', marginBottom: 16 }}>
            {/* Header */}
            <div style={{ ...T.header, padding: 20 }}>
                <h2 style={{ color: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold', margin: 0 }}>
                    5-Day Wind Forecast
                </h2>
            </div>

            {/* Legend */}
            <div style={{ ...T.elevated, borderBottom: `1px solid ${T.border}`, padding: '12px 24px' }}>
                <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 'bold', marginBottom: 8, ...T.textSec }}>
                    Bar Color = Gust Severity
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
                    {[
                        { bg: 'linear-gradient(to top, #30D158, #25A244)', label: 'Safe (<4 mph)' },
                        { bg: 'linear-gradient(to top, #FF9F0A, #CC7A00)',  label: 'Caution (4–7 mph)' },
                        { bg: 'linear-gradient(to top, #FF453A, #CC2A1F)',  label: 'Danger (>7 mph)' },
                    ].map(({ bg, label }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 14, height: 14, background: bg, borderRadius: 4 }} />
                            <span style={{ fontSize: 11, ...T.textSec }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scrollable Timeline */}
            <div style={{ overflowX: 'auto', padding: 24 }}>
                <div style={{ display: 'inline-flex' }}>
                    {groupedData.map((group, idx) => (
                        <DayGroup key={idx} date={group.date} items={group.items} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div style={{ ...T.elevated, borderTop: `1px solid ${T.border}`, padding: '12px 24px', textAlign: 'center', fontSize: 11, ...T.textThird }}>
                Arrow shows wind direction • Numbers in MPH • Bar color shows gust severity
            </div>
        </div>
    );
}