import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { getWeatherRiskAssessment } from '../services/geminiService';
import { getFiveDayForecast } from '@/services/openMeteoService';
import { useTranslation } from '@/hooks/useTranslation';

// SVG Icons for weather
const SunnyIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const CloudyIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const RainyIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21v-2m7 2v-2m-4-2v2" /></svg>;


// No sample forecast shown by default. User must click "Use my location" to fetch real-time data.

const WeatherDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [riskAssessment, setRiskAssessment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string | null>(() => {
    // Try to load last known location from localStorage
    const saved = localStorage.getItem('lastKnownLocation');
    return saved ? JSON.parse(saved) : null;
  });

  // Run AI risk assessment whenever we have forecast data
  useEffect(() => {
    if (!forecast || forecast.length === 0) return;

    const fetchAssessment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const assessment = await getWeatherRiskAssessment(forecast);
        setRiskAssessment(assessment);
      } catch (err) {
        console.error("Failed to fetch risk assessment:", err);
        setError("Could not load AI-powered risk assessment. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [forecast]);

  // Map Open-Meteo forecast entries to WeatherData (icons and day labels)
  const mapForecastToWeatherData = (entries: { date: string; temp: number; humidity: number; precipitation: number }[]) : WeatherData[] => {
    const todayStr = new Date().toISOString().split('T')[0];
    return entries.map((e, idx) => {
      const date = new Date(e.date + 'T00:00:00');
      let dayLabel = '';
      if (e.date === todayStr) dayLabel = 'Today';
      else if (new Date(todayStr).getTime() + 24*60*60*1000 === date.getTime()) dayLabel = 'Tomorrow';
      else dayLabel = date.toLocaleDateString(undefined, { weekday: 'short' });

      // choose icon based on precipitation
      const precip = e.precipitation;
      let Icon = SunnyIcon;
      if (precip > 8) Icon = RainyIcon;
      else if (precip > 2) Icon = CloudyIcon;

      // convert precipitation mm to a heuristic chance percent
      let precipPercent = 5;
      if (precip >= 10) precipPercent = 80;
      else if (precip >= 5) precipPercent = 60;
      else if (precip > 0) precipPercent = 30;

      return {
        day: dayLabel,
        temp: Math.round(e.temp),
        humidity: Math.round(e.humidity),
        precipitation: precipPercent,
        icon: Icon,
      } as WeatherData;
    });
  };

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsFetchingLocation(true);
    setError(null);

    try {
      // Wrap getCurrentPosition in a promise for better error handling
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              reject(new Error('Location permission denied. Please enable location access in your browser settings.'));
            } else if (error.code === error.TIMEOUT) {
              reject(new Error('Location request timed out. Please try again.'));
            } else {
              reject(new Error('Could not get your location. Please try again.'));
            }
          },
          { 
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      // fetch place name (reverse geocode) and forecast in parallel
      const [entries, place] = await Promise.all([
        getFiveDayForecast(lat, lon),
        // lazy-load reverse geocode to avoid circular imports; import function dynamically
        (async () => {
          try {
            const mod = await import('@/services/openMeteoService');
            const locationName = await mod.reverseGeocode(lat, lon);
            if (!locationName) {
              throw new Error('Could not determine location name from coordinates');
            }
            return locationName;
          } catch (e) {
            console.warn('reverseGeocode failed', e);
            // Return coordinates as fallback location name
            return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
          }
        })(),
      ]);

        const mapped = mapForecastToWeatherData(entries);
        setForecast(mapped);
        if (place) {
          setLocationName(place);
          // Save location to localStorage
          localStorage.setItem('lastKnownLocation', JSON.stringify(place));
        }
      } catch (err: any) {
        console.error('Location or forecast error:', err);
        setError(err.message || 'Could not fetch weather data for your location.');
        // Clear any stale data
        setForecast([]);
        setLocationName(null);
        localStorage.removeItem('lastKnownLocation');
      } finally {
        setIsFetchingLocation(false);
      }
  };

  const renderRiskAssessment = () => {
    if (isLoading) {
      return (
          <div className="flex items-center justify-center h-full">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-yellow-700">Generating AI Risk Assessment...</span>
              </div>
          </div>
      );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-600 text-center">{error}</p>
            </div>
        );
    }

    return (
        <>
            <h3 className="text-xl font-bold text-yellow-800 mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                AI-Powered Risk Assessment
            </h3>
            <p className="text-yellow-700 whitespace-pre-wrap">{riskAssessment}</p>
        </>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-green-dark">{t('weather.title')}</h2>
        {locationName ? (
          <div className="text-center mt-2">
            <h3 className="text-xl font-semibold text-brand-green">{locationName}</h3>
            <p className="text-sm text-gray-600 mt-1">Real-time weather forecast</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mt-2">
            Click "Get weather forecast" to fetch real-time weather for your location
          </p>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-4 mb-6">
        <button 
          onClick={handleUseMyLocation} 
          disabled={isFetchingLocation} 
          className="px-4 py-2 bg-brand-green-dark text-white rounded-lg hover:bg-brand-green-darker focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isFetchingLocation ? (
            <>
              <span>Detecting location</span>
              <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            'Get weather forecast'
          )}
        </button>
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="text-red-700 hover:text-red-800 text-xs mt-1 underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {isFetchingLocation ? (
          Array(5).fill(null).map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-gray-100 animate-pulse h-40">
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-4"></div>
              <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
          ))
        ) : forecast.map((data, index) => (
          <WeatherCard key={index} data={data} isToday={index === 0} />
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg min-h-[160px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-yellow-800">{locationName ?? 'Location not detected'}</h3>
                <p className="text-sm text-yellow-600">{locationName ? 'Current location' : 'Click "Get weather forecast" to detect'}</p>
              </div>
            </div>
          </div>
          {renderRiskAssessment()}
      </div>
    </div>
  );
};

interface WeatherCardProps {
    data: WeatherData;
    isToday: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, isToday }) => {
    const { day, temp, humidity, precipitation, icon: Icon } = data;
    return (
        <div className={`p-4 rounded-lg text-center transition-transform transform hover:scale-105 ${isToday ? 'bg-brand-green text-white shadow-lg' : 'bg-green-100 text-gray-800'}`}>
            <p className={`font-bold text-lg ${isToday ? 'text-white' : 'text-brand-green-dark'}`}>{day}</p>
            <Icon className={`w-12 h-12 mx-auto my-2 ${isToday ? 'text-yellow-300' : 'text-brand-green'}`} />
            <p className="text-2xl font-bold">{temp}°C</p>
            <div className="text-xs mt-2 opacity-90">
                <p>💧 {humidity}%</p>
                <p>🌧️ {precipitation}%</p>
            </div>
        </div>
    );
};

export default WeatherDashboard;