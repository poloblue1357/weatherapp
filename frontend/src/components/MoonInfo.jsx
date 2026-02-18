import * as SunCalc from 'suncalc';

function MoonInfo({ weatherInfo, lat, lon }) {
   
    let dt = weatherInfo?.dt
    const localTime = new Date(dt * 1000)

    let illum = SunCalc.getMoonIllumination(localTime)
    let percent = Math.round(illum.fraction * 100)

    let times = SunCalc.getMoonTimes(localTime, lat, lon)

    const formatTime = (time) => {
        if (!time) return 'N/A'
        const date = new Date(time)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Function to get moon emoji and phase name based on illumination percentage
    const getMoonPhase = (percent) => {
        if (percent >= 0 && percent <= 6) return { emoji: '🌑', name: 'New Moon' };
        if (percent >= 7 && percent <= 37) return { emoji: '🌒', name: 'Waxing Crescent' };
        if (percent >= 38 && percent <= 62) return { emoji: '🌓', name: 'First Quarter' };
        if (percent >= 63 && percent <= 93) return { emoji: '🌔', name: 'Waxing Gibbous' };
        if (percent >= 94 && percent <= 100) return { emoji: '🌕', name: 'Full Moon' };
       
        // For waning phases, check the phase value from SunCalc
        // phase goes from 0 (new) to 1 (full) back to 0
        if (illum.phase > 0.5) {
            if (percent >= 63 && percent <= 93) return { emoji: '🌖', name: 'Waning Gibbous' };
            if (percent >= 38 && percent <= 62) return { emoji: '🌗', name: 'Last Quarter' };
            if (percent >= 7 && percent <= 37) return { emoji: '🌘', name: 'Waning Crescent' };
        }
       
        return { emoji: '🌑', name: 'New Moon' };
    }

    const moonPhase = getMoonPhase(percent);

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between">
                {/* Left: Moon Phase Emoji */}
                <div className="flex flex-col items-center">
                    <div className="text-6xl mb-1">{moonPhase.emoji}</div>
                    <div className="text-xs font-medium text-gray-600">{moonPhase.name}</div>
                </div>

                {/* Middle: Illumination */}
                <div className="flex-1 px-4 text-center">
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Illumination</div>
                    <div className="text-3xl font-bold text-indigo-900">{percent}%</div>
                </div>

                {/* Right: Rise/Set Times */}
                <div className="flex flex-col gap-2">
                    <div className="text-right">
                        <div className="text-xs font-medium text-gray-600">Moonrise</div>
                        <div className="text-sm font-semibold text-indigo-900">{formatTime(times.rise)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-medium text-gray-600">Moonset</div>
                        <div className="text-sm font-semibold text-indigo-900">{formatTime(times.set)}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoonInfo