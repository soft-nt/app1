import type { City } from '../types/city'

/**
 * Preset cities with hardcoded coordinates
 *
 * Covers global timezones from UTC-8 to UTC+10.
 * Coordinates sourced from geographic databases, accurate to 4 decimal places.
 * Sorted alphabetically by name for easy scanning.
 */
export const CITIES: City[] = [
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041 },
  { id: 'beijing', name: 'Beijing', country: 'China', latitude: 39.9042, longitude: 116.4074 },
  { id: 'berlin', name: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816 },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { id: 'chicago', name: 'Chicago', country: 'United States', latitude: 41.8781, longitude: -87.6298 },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
  { id: 'geneva', name: 'Geneva', country: 'Switzerland', latitude: 46.2044, longitude: 6.1432 },
  { id: 'hong-kong', name: 'Hong Kong', country: 'China', latitude: 22.3193, longitude: 114.1694 },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', latitude: -26.2041, longitude: 28.0473 },
  { id: 'london', name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', latitude: 34.0522, longitude: -118.2437 },
  { id: 'madrid', name: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038 },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631 },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', latitude: 19.4326, longitude: -99.1332 },
  { id: 'mumbai', name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
  { id: 'new-york', name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
  { id: 'paris', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { id: 'rome', name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', latitude: -23.5505, longitude: -46.6333 },
  { id: 'shanghai', name: 'Shanghai', country: 'China', latitude: 31.2304, longitude: 121.4737 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { id: 'toronto', name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 }
]

/**
 * Default city shown on first load (Geneva)
 */
export const DEFAULT_CITY: City = CITIES.find(city => city.id === 'geneva')!
