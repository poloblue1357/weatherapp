
import { Heart, Wind, Droplets, Gauge, Eye, Sunrise, Sunset, MapPin, Plus, AlertCircle, Navigation } from 'lucide-react';
import React, { useEffect, useRef } from 'react'

const DetailCard = ({ icon, label, value, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200',
        purple: 'bg-purple-50 border-purple-200',
        green: 'bg-green-50 border-green-200',
        gray: 'bg-gray-50 border-gray-200'
    };

    return (
        <div className={`${colorClasses[color]} p-4 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

export default function WeatherCard({ weatherInfo, isFavorite, onToggleFavorite }) {
    const getWindConditions = (windSpeed) => {
        const speed = parseFloat(windSpeed);
        if (isNaN(speed)) {
            return { color: 'from-gray-500 to-gray-600', text: 'WIND DATA UNAVAILABLE' };
        }

        if (speed <= 4) {
            return { color: 'from-green-500 to-emerald-600', text: 'GOOD CONDITIONS FOR JUMPING' };
        } else if (speed === 5) {
            return { color: 'from-amber-500 to-orange-600', text: 'PROCEED WITH CAUTION' };
        } else {
            return { color: 'from-red-500 to-rose-600', text: 'EVALUATE CONDITIONS ON SITE' };
        }
    };

    const windConditions = getWindConditions(weatherInfo?.windSpeed);

    return (
        <div className="space-y-4">
            {/* Wind Condition Alert Banner */}
            <div className={`bg-gradient-to-r ${windConditions.color} text-white p-5 rounded-2xl shadow-xl flex items-center justify-between`}>
                <div>
                    <div className="text-xs font-semibold opacity-90 mb-1 uppercase tracking-wide">Status</div>
                    <div className="text-base font-bold leading-tight">{windConditions.text}</div>
                </div>
                <AlertCircle className="w-8 h-8 opacity-80 shrink-0 ml-2" />
            </div>

            {/* Main Weather Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 text-white p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

                    <div className="relative flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-5 h-5" />
                                <h2 className="text-2xl font-bold">{weatherInfo.city}</h2>
                            </div>
                            <p className="text-blue-100 text-base mb-4 capitalize">{weatherInfo.condition}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold">{weatherInfo.temp}</span>
                                <span className="text-xl font-semibold">°F</span>
                            </div>
                        </div>
                        <button
                            onClick={onToggleFavorite}
                            className="p-3 hover:bg-white/20 rounded-full transition-all"
                        >
                            <Heart
                                className={`w-7 h-7 ${isFavorite ? 'fill-rose-600' : ''}`}
                                strokeWidth={2}
                            />
                        </button>
                    </div>
                </div>

                {/* Wind Compass */}
                <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Wind Analysis</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="relative w-28 h-28 mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full"></div>
                                <div className="absolute inset-2 bg-white rounded-full shadow-inner"></div>
                                {weatherInfo.windDirectionDegrees && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                                        style={{ transform: `rotate(${Number(weatherInfo.windDirectionDegrees) - 42}deg)` }}
                                    >
                                        <Navigation className="w-12 h-12 text-blue-600" fill="currentColor" />
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center mt-16">
                                        <div className="text-xs font-bold text-gray-500 capitalize">{weatherInfo.windDirectionCode || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="bg-blue-50 p-3 rounded-xl">
                                <div className="text-xs text-gray-600 font-medium mb-1">Speed</div>
                                <div className="text-xl font-bold text-blue-900">
                                    {weatherInfo.windSpeed} <span className="text-sm font-normal">mph</span>
                                </div>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-xl">
                                <div className="text-xs text-gray-600 font-medium mb-1">Gusts</div>
                                <div className="text-xl font-bold text-amber-900">
                                    {weatherInfo.windGusts !== "N/A"
                                        ? <>{weatherInfo.windGusts} <span className="text-sm font-normal">mph</span></>
                                        : <span className="text-sm">None</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-center text-sm text-gray-600 font-medium">
                        {weatherInfo.windType}
                    </div>
                </div>

                {/* Weather Details */}
                <div className="p-6 grid grid-cols-2 gap-4">
                    <DetailCard
                        icon={<Droplets className="w-5 h-5 text-blue-600" />}
                        label="Humidity"
                        value={`${weatherInfo.humidity}%`}
                        color="blue"
                    />
                    <DetailCard
                        icon={<Gauge className="w-5 h-5 text-purple-600" />}
                        label="Pressure"
                        value={`${weatherInfo.pressure} inHg`}
                        color="purple"
                    />
                    <DetailCard
                        icon={<Eye className="w-5 h-5 text-green-600" />}
                        label="Visibility"
                        value={`${weatherInfo.visibility} mi`}
                        color="green"
                    />
                    <DetailCard
                        icon={<Wind className="w-5 h-5 text-gray-600" />}
                        label="Direction"
                        value={weatherInfo.windDirectionCode}
                        color="gray"
                    />
                </div>

                {/* Sun Times */}
                <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                        <Sunrise className="w-6 h-6 text-orange-600 mb-2" />
                        <div className="text-xs font-medium text-gray-600">Sunrise</div>
                        <div className="text-base font-semibold text-orange-900">{weatherInfo.sunrise}</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                        <Sunset className="w-6 h-6 text-indigo-600 mb-2" />
                        <div className="text-xs font-medium text-gray-600">Sunset</div>
                        <div className="text-base font-semibold text-indigo-900">{weatherInfo.sunset}</div>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="px-6 pb-4 text-center text-xs text-gray-500">
                    Updated {weatherInfo.lastUpdate}
                </div>

                {/* Add/Remove Favorites Button */}
                <div className="p-6 pt-0">
                    <button
                        onClick={onToggleFavorite}
                        className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                            isFavorite
                                ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
                                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white'
                        }`}
                    >
                        {isFavorite ? (
                            <>
                                <Heart className="w-5 h-5 fill-white" />
                                Remove from Favorites
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                Add to Favorites
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}