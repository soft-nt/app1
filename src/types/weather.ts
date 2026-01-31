// Open-Meteo Weather API response types
// Source: https://open-meteo.com/en/docs
// No API key required, CORS-enabled, free for production use

// Current weather data from Open-Meteo
export interface CurrentWeather {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  weather_code: number
  wind_speed_10m: number
}

export interface CurrentWeatherUnits {
  time: string
  temperature_2m: string
  relative_humidity_2m: string
  weather_code: string
  wind_speed_10m: string
}

export interface WeatherData {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: CurrentWeatherUnits
  current: CurrentWeather
}

// WMO Weather interpretation codes (WW)
// Source: https://open-meteo.com/en/docs
export const WMO_WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
}

// Geneva coordinates (hardcoded for this app)
export const GENEVA_COORDS = {
  latitude: 46.2044,
  longitude: 6.1432
}
