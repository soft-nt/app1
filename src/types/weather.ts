// OpenWeatherMap Current Weather API response types
// Source: https://openweathermap.org/current

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface MainWeatherData {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
}

export interface Wind {
  speed: number
  deg: number
  gust?: number  // Optional - only present when gusty
}

export interface Clouds {
  all: number
}

export interface Sys {
  type?: number
  id?: number
  country: string
  sunrise: number
  sunset: number
}

export interface Coord {
  lon: number
  lat: number
}

export interface WeatherData {
  coord: Coord
  weather: WeatherCondition[]
  base: string
  main: MainWeatherData
  visibility: number
  wind: Wind
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}
