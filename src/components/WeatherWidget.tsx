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
import { WMO_WEATHER_CODES } from '../types/weather';

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
  return (
    <div className="weather-widget">
      <span className="weather-location">Geneva</span>
    </div>
  );
}

export default WeatherWidget;
