import * as SunCalc from 'suncalc';

function MoonInfo({ weatherInfo, lat, lon }) {
    
    let dt = weatherInfo?.dt
    const localTime = new Date(dt * 1000)
    console.log(SunCalc.getMoonIllumination(localTime))
    console.log(SunCalc.getMoonPosition(localTime, lat, lon))
    return (
        <div>
            
        </div>
    )
}

export default MoonInfo