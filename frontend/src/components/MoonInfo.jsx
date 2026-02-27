import * as SunCalc from 'suncalc';

// ── Apple dark tokens ──────────────────────────────────────────
const T = {
    wrap:   { background: "rgba(88,86,214,0.12)", border: "1px solid rgba(88,86,214,0.28)", borderRadius: 12, padding: 12 },
    label:  { color: "rgba(235,235,245,0.8)", fontSize: 15, fontWeight: 500 },
    value:  { color: "#7D7AFF" },
    times:  { color: "#7D7AFF" },
};

function MoonInfo({ weatherInfo, lat, lon }) {
    const dt = weatherInfo?.dt;
    const localTime = new Date(dt * 1000);
    const illum = SunCalc.getMoonIllumination(localTime);
    const percent = Math.round(illum.fraction * 100);
    const times = SunCalc.getMoonTimes(localTime, lat, lon);

    const formatTime = (time) => {
        if (!time) return 'N/A';
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getMoonPhase = (percent) => {
        if (percent >= 0  && percent <= 6)   return { emoji: '🌑', name: 'New Moon' };
        if (percent >= 7  && percent <= 37)  return { emoji: '🌒', name: 'Waxing Crescent' };
        if (percent >= 38 && percent <= 62)  return { emoji: '🌓', name: 'First Quarter' };
        if (percent >= 63 && percent <= 93)  return { emoji: '🌔', name: 'Waxing Gibbous' };
        if (percent >= 94 && percent <= 100) return { emoji: '🌕', name: 'Full Moon' };
        if (illum.phase > 0.5) {
            if (percent >= 63 && percent <= 93) return { emoji: '🌖', name: 'Waning Gibbous' };
            if (percent >= 38 && percent <= 62) return { emoji: '🌗', name: 'Last Quarter' };
            if (percent >= 7  && percent <= 37) return { emoji: '🌘', name: 'Waning Crescent' };
        }
        return { emoji: '🌑', name: 'New Moon' };
    };

    const moonPhase = getMoonPhase(percent);

    return (
        <div style={T.wrap}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Moon emoji + phase name */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 52, marginBottom: 4 }}>{moonPhase.emoji}</div>
                    <div style={{ ...T.label }}>{moonPhase.name}</div>
                </div>

                {/* Illumination */}
                <div style={{ flex: 1, textAlign: "center", padding: "0 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, color: "rgba(235,235,245,0.8)" }}>
                        Illumination
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, ...T.value }}>{percent}%</div>
                </div>

                {/* Rise / Set */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ ...T.label }}>Moonrise</div>
                        <div style={{ fontSize: 15, fontWeight: 600, ...T.times }}>{formatTime(times.rise)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ ...T.label }}>Moonset</div>
                        <div style={{ fontSize: 15, fontWeight: 600, ...T.times }}>{formatTime(times.set)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MoonInfo;