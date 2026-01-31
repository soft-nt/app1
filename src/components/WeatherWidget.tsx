import { useState, useEffect } from 'react';
import {
  WiDaySunny,
  WiCloud,
  WiCloudy,
  WiRain,
  WiShowers,
  WiSnow,
  WiSnowflakeCold,
  WiThunderstorm,
  WiFog
} from 'react-icons/wi';
import type { WeatherData } from '../types/weather';
import { GENEVA_COORDS, WMO_WEATHER_CODES } from '../types/weather';

function getWeatherIcon(code: number) {
  const iconSize = 24;

  if (code === 0) {
    return <WiDaySunny size={iconSize} />;
  }
  if (code >= 1 && code <= 3) {
    return code === 1 ? <WiCloud size={iconSize} /> : <WiCloudy size={iconSize} />;
  }
  if (code === 45 || code === 48) {
    return <WiFog size={iconSize} />;
  }
  if (code >= 51 && code <= 55) {
    return <WiShowers size={iconSize} />;
  }
  if (code >= 61 && code <= 67) {
    return <WiRain size={iconSize} />;
  }
  if (code >= 71 && code <= 77) {
    return code <= 73 ? <WiSnow size={iconSize} /> : <WiSnowflakeCold size={iconSize} />;
  }
  if (code >= 80 && code <= 82) {
    return <WiShowers size={iconSize} />;
  }
  if (code >= 85 && code <= 86) {
    return <WiSnow size={iconSize} />;
  }
  if (code >= 95 && code <= 99) {
    return <WiThunderstorm size={iconSize} />;
  }

  // Default fallback
  return <WiCloud size={iconSize} />;
}

function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${GENEVA_COORDS.latitude}&longitude=${GENEVA_COORDS.longitude}&current=temperature_2m,weather_code`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: WeatherData = await response.json();

        if (!ignore) {
          setWeatherData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err : new Error('Failed to fetch weather'));
          setIsLoading(false);
        }
      }
    }

    fetchWeather();

    return () => { ignore = true; };
  }, []);

  if (isLoading) {
    return <div className="weather-loading">Loading...</div>;
  }

  if (error) {
    return <div className="weather-error">Weather unavailable</div>;
  }

  if (!weatherData) {
    return null;
  }

  return (
    <div className="weather-widget">
      <span className="weather-location">Geneva</span>
      <span className="weather-icon">{getWeatherIcon(weatherData.current.weather_code)}</span>
      <span className="weather-temp">{Math.round(weatherData.current.temperature_2m)}°C</span>
      <span className="weather-condition">{WMO_WEATHER_CODES[weatherData.current.weather_code]}</span>
    </div>
  );
}

export default WeatherWidget;
