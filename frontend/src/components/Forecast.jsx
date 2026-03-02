import React from 'react';
import { MoveUp } from 'lucide-react';

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

// Get cap color based on gust delta
function getCapColor(delta) {
    if (delta < 4) return '#30D158';
    if (delta < 7) return '#FF9F0A';
    return '#FF453A';
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

// ── Apple dark palette ──────────────────────────────────────────
const T = {
    card:      { background: '#1C1C1E' },
    elevated:  { background: '#2C2C2E' },
    border:    '#38383A',
    header:    { background: 'linear-gradient(to right, #1C1C1E, #2C2C2E, #3A3A3C)' },
    dayBadge:  { background: '#2C2C2E', border: '1px solid rgba(10,132,255,0.4)', color: 'white' },
    textPrim:  { color: '#FFFFFF' },
    textSec:   { color: 'rgba(235,235,245,0.85)' },
    textThird: { color: 'rgba(235,235,245,1)' },
};

const COL = 72;
const MAX_BAR = 100;

const Divider = () => (
    <div style={{ width: '100%', borderTop: `1px solid ${T.border}`, margin: '10px 0' }} />
);

// Individual forecast column
function ForecastColumn({ data, isLast }) {
    const delta = data.gust && data.gust > data.windSpeed ? parseFloat((data.gust - data.windSpeed).toFixed(1)) : null;
    const capColor = delta ? getCapColor(delta) : null;
    const windH = Math.min(Math.max(data.windSpeed * 5, 40), 80);
    const capH = delta ? Math.min(Math.max(delta * 4, 6), MAX_BAR - windH - 20) : 0;
    const rotation = (Number(data.degree) + 180 + 360) % 360;

    return (
        <div style={{ flexShrink: 0, width: COL, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: 8, borderRight: isLast ? 'none' : `1px solid ${T.border}` }}>

            {/* Direction pill */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,132,255,0.1)', border: '1px solid rgba(10,132,255,0.25)', borderRadius: 10, padding: '6px 0', marginBottom: 6 }}>
                <div style={{ transform: `rotate(${rotation}deg)`, display: 'flex' }}>
                    <MoveUp style={{ width: 24, height: 24, color: '#0A84FF' }} />
                </div>
                <div style={{ fontSize: 14, color: 'rgba(235,235,245,0.5)', marginTop: 2 }}>{data.degree}°</div>
            </div>

            {/* Stacked bar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: MAX_BAR + 40 }}>
                {delta && (
                    <>
                        <div style={{ fontSize: 16, color: capColor, fontWeight: 'bold', marginBottom: 2 }}>+{delta}</div>
                        <div style={{ width: 48, height: capH, background: capColor, borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
                    </>
                )}
                <div style={{ width: 48, height: windH, background: 'linear-gradient(to top, #0A84FF, #0055AA)', borderRadius: delta ? '0' : '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{data.windSpeed}</span>
                </div>
            </div>

            <Divider />
            <div style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>{data.time}</div>
            <Divider />
            <div style={{ fontSize: 16 }}>{getWeatherIcon(data.condition)}</div>
            <Divider />
            <div style={{ fontSize: 12, color: 'rgba(235,235,245,0.6)' }}>{data.temp}°F</div>
        </div>
    );
}

// Day group component
function DayGroup({ date, items }) {
    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', borderRight: `2px solid ${T.border}`, paddingRight: 16, marginRight: 16 }}>
            <div style={{ ...T.dayBadge, padding: '6px 14px', borderRadius: 12, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
                {date}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                {items.map((item, idx) => (
                    <ForecastColumn key={idx} data={item} isLast={idx === items.length - 1} />
                ))}
            </div>
        </div>
    );
}

// Main Forecast Component
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

            {/* Gust color legend */}
            <div style={{ ...T.elevated, borderBottom: `1px solid ${T.border}`, padding: '10px 24px' }}>
                <div style={{ fontSize: 14, color: 'rgba(235,235,245,0.4)', textAlign: 'center', marginBottom: 6 }}>Wind Gusts</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                    {[
                        { color: '#30D158', label: 'Calm (<4 mph)' },
                        { color: '#FF9F0A', label: 'Caution (4–7 mph)' },
                        { color: '#FF453A', label: 'Danger (>7 mph)' },
                    ].map(({ color, label }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
                            <span style={{ fontSize: 15, color: 'rgba(235,235,245,0.6)' }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend + scrollable content */}
            <div style={{ display: 'flex' }}>

                {/* Sticky legend */}
                <div style={{ flexShrink: 0, width: 52, background: '#2C2C2E', borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', paddingRight: 6, paddingTop: 8, paddingLeft: 6 }}>
                    <div style={{ height: 42 }} />
                    <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 16, color: 'rgba(235,235,245,0.5)' }}>Dir</span>
                    </div>
                    <div style={{ height: MAX_BAR + 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 14, marginBottom: 4 }}>
                                <span style={{ color: '#30D158' }}>G</span>
                                <span style={{ color: '#FF9F0A' }}>u</span>
                                <span style={{ color: '#FF453A' }}>sts</span>
                            </div>
                            <div style={{ fontSize: 15, color: '#0A84FF' }}>Wind</div>
                        </div>
                    </div>
                    <div style={{ borderTop: `1px solid ${T.border}`, margin: '10px 0' }} />
                    <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 14, color: 'rgba(235,235,245,0.5)' }}>Time</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${T.border}`, margin: '10px 0' }} />
                    <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 14, color: 'rgba(235,235,245,0.5)' }}>Sky</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${T.border}`, margin: '10px 0' }} />
                    <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 14, color: 'rgba(235,235,245,0.5)' }}>Temp</span>
                    </div>
                </div>

                {/* Scrollable day groups */}
                <div style={{ overflowX: 'auto', padding: '8px 12px' }}>
                    <div style={{ display: 'inline-flex' }}>
                        {groupedData.map((group, idx) => (
                            <DayGroup key={idx} date={group.date} items={group.items} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}