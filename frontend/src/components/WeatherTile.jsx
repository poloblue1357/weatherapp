import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useApp } from "../hooks/useApp";
import WeatherCard from "./WeatherCard";
import Forecast from "./Forecast";

// ── Apple dark palette ─────────────────────────────────────────
const T = {
    tile:        { background: "#1C1C1E", border: "2px solid #38383A" },
    elevated:    { background: "#2C2C2E" },
    border:      "#38383A",
    textPrim:    { color: "#FFFFFF" },
    textSec:     { color: "rgba(235,235,245,0.6)" },
    arrow:       { color: "rgba(235,235,245,0.85)" },
    tabActive:   { background: "linear-gradient(to right, #6E3FBF, #9B59D4)", color: "#FFFFFF" },
    tabInactive: { background: "transparent", color: "rgba(235,235,245,0.55)" },
};

function RemoveButton({ onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? "rgba(255,69,58,0.22)" : "rgba(255,69,58,0.12)",
                border: "none",
                color: "#FF453A",
                borderRadius: 8,
                padding: "8px 10px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            <Trash2 size={20} />
        </button>
    );
}

function WeatherTile({ id, weatherInfo, forecastInfo, expandedId, setExpandedId }) {
    const [activeTab, setActiveTab] = useState('current');
    const { removeFavorite } = useApp();

    const handleRemove = (e) => {
        e.stopPropagation();
        removeFavorite(id);
    };

    const isExpanded = expandedId === id;

    return (
        <div style={{ marginBottom: 4 }}>
            {/* Collapsed tile row */}
            <div
                style={{ ...T.tile, borderRadius: 10, height: 56, display: "flex", alignItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                onClick={() => setExpandedId(isExpanded ? null : String(id))}
            >
                <div style={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden" }}>
                    <Plus
                        size={20}
                        style={{ flexShrink: 0, marginLeft: 10, transition: "transform 0.2s", transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)", ...T.arrow }}
                    />
                    <span style={{ margin: "0 6px 0 8px", fontWeight: 600, fontSize: 14, width: 96, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...T.textPrim }}>
                        {weatherInfo.city}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 17, marginRight: 8, flexShrink: 0, ...T.textPrim }}>
                        {Math.round(weatherInfo.temp)}°
                    </span>
                    <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, ...T.textSec, textTransform: "capitalize" }}>
                        {weatherInfo.condition}
                    </span>
                </div>
                <div onClick={handleRemove} style={{ marginRight: 8, marginLeft: 6 }}>
                    <RemoveButton onClick={handleRemove} />
                </div>
            </div>

            {/* Expanded panel */}
            <div
                style={{
                    transition: "opacity 0.3s, max-height 0.5s ease-in-out",
                    opacity: isExpanded ? 1 : 0,
                    maxHeight: isExpanded ? 1000 : 0,
                    overflow: "hidden",
                    marginBottom: isExpanded ? 16 : 0,
                }}
            >
                {isExpanded && weatherInfo && forecastInfo && (
                    <div style={{ paddingTop: 4 }}>
                        {/* Tab bar */}
                        <div style={{ ...T.elevated, borderRadius: 12, padding: 4, display: "flex", gap: 4, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                            {["current", "forecast"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        flex: 1, padding: "10px 0", borderRadius: 9, border: "none",
                                        fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                                        ...(activeTab === tab ? T.tabActive : T.tabInactive),
                                    }}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        {activeTab === 'current' ? (
                            <WeatherCard
                                weatherInfo={weatherInfo}
                                isFavorite={true}
                                onToggleFavorite={handleRemove}
                            />
                        ) : (
                            <Forecast forecastInfo={forecastInfo} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherTile;