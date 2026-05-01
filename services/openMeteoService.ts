/**
 * Minimal Open-Meteo client for fetching 5-day forecasts.
 * Returns an array of simple forecast entries (date, temp, humidity, precipitation).
 */
export interface ForecastEntry {
  date: string; // ISO date (yyyy-mm-dd)
  temp: number; // daily max temperature (°C)
  humidity: number; // daily mean relative humidity (%)
  precipitation: number; // daily precipitation sum (mm)
}

export const getFiveDayForecast = async (latitude: number, longitude: number): Promise<ForecastEntry[]> => {
  const base = 'https://api.open-meteo.com/v1/forecast';
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    // request daily summaries and hourly humidity for aggregation
    daily: 'temperature_2m_max,precipitation_sum',
    hourly: 'relativehumidity_2m',
    timezone: 'auto',
    forecast_days: '5'
  });

  const url = `${base}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo request failed: ${res.status}`);
  const data = await res.json();

  const daily = data.daily || {};
  const hourly = data.hourly || {};
  const result: ForecastEntry[] = [];

  const times: string[] = daily.time || [];
  const temps: number[] = daily.temperature_2m_max || [];
  const precs: number[] = daily.precipitation_sum || [];

  // hourly arrays
  const hourlyTimes: string[] = hourly.time || [];
  const hourlyHum: number[] = hourly.relativehumidity_2m || [];

  // build per-day humidity average by grouping hourly values by date
  const humidityByDate: Record<string, { sum: number; count: number }> = {};
  for (let i = 0; i < hourlyTimes.length; i++) {
    const t = hourlyTimes[i];
    const date = t.split('T')[0];
    const h = Number(hourlyHum[i]) || 0;
    if (!humidityByDate[date]) humidityByDate[date] = { sum: 0, count: 0 };
    humidityByDate[date].sum += h;
    humidityByDate[date].count += 1;
  }

  for (let i = 0; i < times.length; i++) {
    const date = times[i];
    const temp = Number(temps[i] ?? 0);
    const precip = Number(precs[i] ?? 0);
    const humBucket = humidityByDate[date];
    const humidity = humBucket && humBucket.count > 0 ? Math.round(humBucket.sum / humBucket.count) : 0;

    result.push({ date, temp, humidity, precipitation: precip });
  }

  return result;
};

/**
 * Reverse geocode latitude/longitude to a human-friendly place name using Open-Meteo's geocoding API.
 * Returns a short label like "Town, Region" or null if not found.
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<string | null> => {
  const base = 'https://geocoding-api.open-meteo.com/v1/reverse';
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    count: '1'
  });

  const url = `${base}?${params.toString()}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const results = data.results || [];
    if (results.length === 0) return null;
    const r = results[0];
    // prefer city/village/town, then name
    const parts: string[] = [];
    if (r.name) parts.push(r.name);
    if (r.admin1) parts.push(r.admin1);
    else if (r.admin2) parts.push(r.admin2);
    if (r.country) parts.push(r.country);
    return parts.join(', ');
  } catch (err) {
    console.error('reverseGeocode error', err);
    return null;
  }
};
