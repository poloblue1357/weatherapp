import { Heart, Wind, Droplets, Sunrise, Sunset, MapPin, AlertCircle, Navigation, Cloud, Thermometer } from 'lucide-react';
import MoonInfo from './MoonInfo';
import { useApp } from '../hooks/useApp';

// ── Apple dark tokens ──────────────────────────────────────────
const T = {
    card:      { background: "#1C1C1E" },
    elevated:  { background: "#2C2C2E" },
    border:    "#38383A",
    textPrim:  { color: "#FFFFFF" },
    textSec:   { color: "rgba(235,235,245,0.8)" },
    textThird: { color: "rgba(235,235,245,0.75)" },
    blue:      { background: "rgba(10,132,255,0.15)",  border: "1px solid rgba(10,132,255,0.25)" },
    yellow:    { background: "rgba(255,214,10,0.15)",  border: "1px solid rgba(255,214,10,0.25)" },
    orange:    { background: "rgba(255,159,10,0.15)",  border: "1px solid rgba(255,159,10,0.25)" },
    purple:    { background: "rgba(191,90,242,0.15)",  border: "1px solid rgba(191,90,242,0.25)" },
    gray:      { background: "rgba(235,235,245,0.08)", border: "1px solid rgba(235,235,245,0.12)" },
    teal:      { background: "rgba(90,200,250,0.15)",  border: "1px solid rgba(90,200,250,0.25)" },
    mint:      { background: "rgba(99,230,185,0.15)",  border: "1px solid rgba(99,230,185,0.25)" },
    blueText:  { color: "#64D2FF" },
    yellowText:{ color: "#FFD60A" },
    tealText:  { color: "#5AC8FA" },
    mintText:  { color: "#63E6B9" },
};

// ── Weather-based header gradients (mapped by OWM condition code) ──
function getHeaderGradient(id) {
    if (!id) return "linear-gradient(to bottom right, #1C3A6E, #2255A4, #1a6aad)";
    if (id >= 200 && id < 300) return "linear-gradient(to bottom right, #1a1a2e, #2d2d44, #4a4a6a)"; // Thunderstorm
    if (id >= 300 && id < 400) return "linear-gradient(to bottom right, #1e3a5f, #1e40af, #3B82F6)"; // Drizzle
    if (id >= 500 && id < 600) return "linear-gradient(to bottom right, #1e3a5f, #1e40af, #3B82F6)"; // Rain
    if (id >= 600 && id < 700) return "linear-gradient(to bottom right, #1e3a5f, #2d5a8e, #94a3b8)"; // Snow
    if (id >= 700 && id < 800) return "linear-gradient(to bottom right, #374151, #4B5563, #6B7280)"; // Atmosphere
    if (id === 800)             return "linear-gradient(to bottom right, #0369A1, #0EA5E9, #38BDF8)"; // Clear
    if (id > 800)               return "linear-gradient(to bottom right, #1d4ed8, #0284C7, #7DD3FC)"; // Clouds
    return "linear-gradient(to bottom right, #1C3A6E, #2255A4, #1a6aad)";                            // Fallback
}

// Snow needs a dark overlay behind text for readability
function isSnow(id) {
    return id >= 600 && id < 700;
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

function displayGust(windGusts, windSpeed) {
    if (!windGusts || windGusts === "N/A") return "N/A";
    if (Number(windGusts) <= Number(windSpeed)) return "Light and Variable";
    return `${windGusts} mph`;
}

function getWindConditions(windSpeed) {
    const s = parseFloat(windSpeed);
    if (isNaN(s)) return { bg: "linear-gradient(to right, #3A3A3C, #6C6C70)", text: "WIND DATA UNAVAILABLE" };
    if (s <= 13)  return { bg: "linear-gradient(to right, #1a7a3a, #30D158)", text: "GOOD CONDITIONS FOR JUMPING" };
    if (s === 14) return { bg: "linear-gradient(to right, #b35a00, #FF9F0A)", text: "PROCEED WITH CAUTION" };
    return          { bg: "linear-gradient(to right, #991F16, #FF453A)", text: "EVALUATE CONDITIONS ON SITE" };
}

function DetailCard({ icon, label, value, tint, textColor }) {
    return (
        <div style={{ ...tint, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                {icon}
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, ...T.textSec }}>{label}</span>
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, margin: 0, ...textColor }}>{value}</p>
        </div>
    );
}

export default function WeatherCard({
    weatherInfo,
    lat,
    lon,
    isFavorite,
    onToggleFavorite
}) {
    const { currentWeather, currentLocation } = useApp();

    const weather = weatherInfo || currentWeather;
    const latitude = lat || currentLocation.lat;
    const longitude = lon || currentLocation.lon;

    if (!weather) return null;

    const windConditions = getWindConditions(weather.windSpeed);
    const rotation = (Number(weather.windDirectionDegrees) + 180 - 45 + 360) % 360;
    const headerGradient = getHeaderGradient(weather.id);
    const snowOverlay = isSnow(weather.id);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Alert banner */}
            <div style={{ background: windConditions.bg, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1, color: "white", marginBottom: 4 }}>Status</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{windConditions.text}</div>
                </div>
                <AlertCircle style={{ width: 28, height: 28, opacity: 0.85, color: "white", flexShrink: 0, marginLeft: 8 }} />
            </div>

            {/* Main card */}
            <div style={{ ...T.card, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", border: "1.5px solid rgba(255,255,255,0.1)" }}>

                {/* Header */}
                <div style={{ background: headerGradient, padding: 24, position: "relative", overflow: "hidden" }}>
                    {/* Snow text overlay for readability */}
                    {snowOverlay && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
                    )}
                    <div style={{ position: "absolute", top: 0, right: 0, width: 160, height: 160, background: "rgba(255,255,255,0.06)", borderRadius: "50%", transform: "translate(50%,-50%)" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, width: 128, height: 128, background: "rgba(255,255,255,0.06)", borderRadius: "50%", transform: "translate(-40%,40%)" }} />
                    <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <MapPin style={{ width: 18, height: 18, color: "rgba(235,235,245,0.8)" }} />
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: "white", margin: 0 }}>{weather.city}</h2>
                            </div>
                            <p style={{ fontSize: 16, fontWeight: 500, color: "rgba(235,235,245,0.85)", margin: "0 0 12px", textTransform: "capitalize" }}>{weather.condition}</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                                <span style={{ fontSize: 52, fontWeight: 700, color: "white", lineHeight: 1 }}>{weather.temp}</span>
                                <span style={{ fontSize: 20, fontWeight: 600, color: "rgba(235,235,245,0.8)" }}>°F</span>
                            </div>
                            <div style={{ fontSize: 13, ...T.textThird }}>Updated {weather.lastUpdate}</div>
                        </div>
                        <button
                            onClick={onToggleFavorite}
                            style={{ padding: 10, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.1)", cursor: "pointer" }}
                        >
                            <Heart style={{ width: 26, height: 26, color: isFavorite ? "#FF453A" : "white", fill: isFavorite ? "#FF453A" : "none" }} />
                        </button>
                    </div>
                </div>

                {/* Wind compass */}
                <div style={{ padding: 24, borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, ...T.textSec, marginBottom: 16 }}>Wind Analysis</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

                        {/* Compass — equal half */}
                        <div style={{ flex: 1, flexShrink: 0 }}>
                            <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto" }}>
                                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, #2a5a8c, #1a3a5c)", borderRadius: "50%" }} />
                                <div style={{ position: "absolute", inset: 10, background: "#2C2C2E", borderRadius: "50%", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)" }} />
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                                    <div style={{ position: "absolute", width: 1, height: "100%", background: "rgba(235,235,245,0.2)" }} />
                                    <div style={{ position: "absolute", height: 1, width: "100%", background: "rgba(235,235,245,0.2)" }} />
                                    {[["N","top",4],["S","bottom",4],["E","right",4],["W","left",4]].map(([d,side,o]) => (
                                        <span key={d} style={{ position: "absolute", [side]: o, fontSize: 12, fontWeight: 700, color: "rgba(235,235,245,0.85)",
                                            ...(side==="top"||side==="bottom" ? {left:"50%",transform:"translateX(-50%)"} : {top:"50%",transform:"translateY(-50%)"}) }}>
                                            {d}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${rotation}deg)`, transition: "transform 0.5s" }}>
                                    <Navigation style={{ width: 64, height: 64, color: "#0A84FF", fill: "#0A84FF" }} />
                                </div>
                            </div>
                            <div style={{ marginTop: 8, textAlign: "center", fontSize: 11, ...T.textSec }}>From {weather.windDirectionDegrees}°</div>
                        </div>

                        {/* Speed + gusts — equal half */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ ...T.blue, borderRadius: 12, padding: 12 }}>
                                <div style={{ fontSize: 11, ...T.textSec, marginBottom: 4 }}>Speed</div>
                                <div style={{ fontSize: 20, fontWeight: 700, ...T.blueText }}>{weather.windSpeed} <span style={{ fontSize: 13, fontWeight: 400 }}>mph</span></div>
                            </div>
                            <div style={{ ...T.yellow, borderRadius: 12, padding: 12 }}>
                                <div style={{ fontSize: 11, ...T.textSec, marginBottom: 4 }}>Gusts</div>
                                <div style={{ fontSize: 20, fontWeight: 700, ...T.yellowText }}>{displayGust(weather.windGusts, weather.windSpeed)}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 12, textAlign: "center", fontSize: 13, ...T.textSec, fontWeight: 500 }}>{weather.windType}</div>
                </div>

                {/* Detail cards — 2x2 grid */}
                <div style={{ padding: 24, paddingBottom: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <DetailCard
                        icon={<Droplets style={{ width: 18, height: 18, color: "#0A84FF" }} />}
                        label="Humidity" value={`${weather.humidity}%`}
                        tint={T.blue} textColor={T.blueText}
                    />
                    <DetailCard
                        icon={<Wind style={{ width: 18, height: 18, color: "rgba(235,235,245,0.7)" }} />}
                        label="Direction" value={toDirection(weather.windDirectionCode)}
                        tint={T.gray} textColor={T.textPrim}
                    />
                    <DetailCard
                        icon={<Cloud style={{ width: 18, height: 18, color: "#5AC8FA" }} />}
                        label="Cloud Cover" value={`${weather.cloudCover}%`}
                        tint={T.teal} textColor={T.tealText}
                    />
                    <DetailCard
                        icon={<Thermometer style={{ width: 18, height: 18, color: "#63E6B9" }} />}
                        label="Feels Like" value={`${weather.feelsLike}°F`}
                        tint={T.mint} textColor={T.mintText}
                    />
                </div>

                {/* Moon info */}
                <div style={{ padding: "24px 24px 0" }}>
                    <MoonInfo weatherInfo={weather} lat={latitude} lon={longitude} />
                </div>

                {/* Sunrise / Sunset */}
                <div style={{ padding: 24, paddingBottom: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ ...T.orange, borderRadius: 12, padding: 16 }}>
                        <Sunrise style={{ width: 22, height: 22, color: "#FF9F0A", marginBottom: 8 }} />
                        <div style={{ fontSize: 11, fontWeight: 500, ...T.textSec }}>Sunrise</div>
                        <div style={{ fontSize: 15, fontWeight: 600, ...T.textPrim }}>{weather.sunrise}</div>
                    </div>
                    <div style={{ ...T.purple, borderRadius: 12, padding: 16 }}>
                        <Sunset style={{ width: 22, height: 22, color: "#BF5AF2", marginBottom: 8 }} />
                        <div style={{ fontSize: 11, fontWeight: 500, ...T.textSec }}>Sunset</div>
                        <div style={{ fontSize: 15, fontWeight: 600, ...T.textPrim }}>{weather.sunset}</div>
                    </div>
                </div>

                {/* Favorite button */}
                <div style={{ padding: "0 24px 24px" }}>
                    <button
                        onClick={onToggleFavorite}
                        style={{
                            width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                            fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            background: isFavorite
                                ? "linear-gradient(to right, #7B241C, #C0392B)"
                                : "linear-gradient(to right, #0055AA, #0A84FF)",
                            color: "white",
                        }}
                    >
                        <Heart style={{ width: 18, height: 18, fill: "white", color: "white" }} />
                        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </button>
                </div>

            </div>
        </div>
    );
}