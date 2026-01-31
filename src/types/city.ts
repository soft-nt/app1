// City configuration types
// Used for city selection and weather API coordinate lookups

/**
 * City with geographic coordinates
 *
 * Used for:
 * - City selector dropdown options
 * - Weather API requests (latitude/longitude)
 * - Location display and map visualization
 */
export interface City {
  /** Unique identifier (lowercase kebab-case, e.g., "new-york") */
  id: string
  /** Display name (e.g., "New York") */
  name: string
  /** Country name (e.g., "United States") */
  country: string
  /** Geographic latitude in decimal degrees */
  latitude: number
  /** Geographic longitude in decimal degrees */
  longitude: number
}
