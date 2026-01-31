// localStorage wrapper with error handling for city selection persistence

/**
 * Storage key for selected city ID
 */
const STORAGE_KEY = 'selectedCityId'

/**
 * Save selected city ID to localStorage
 *
 * Handles errors gracefully:
 * - QuotaExceededError: Storage quota reached
 * - SecurityError: Private browsing or storage disabled
 *
 * @param cityId - City ID to persist
 * @returns true if saved successfully, false on error
 */
export function saveCity(cityId: string): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, cityId)
    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded - unable to save city selection')
      } else if (error.name === 'SecurityError') {
        console.warn('localStorage unavailable (private browsing or disabled)')
      } else {
        console.warn('Failed to save city selection:', error.message)
      }
    }
    return false
  }
}

/**
 * Load selected city ID from localStorage
 *
 * Handles errors gracefully:
 * - SecurityError: Private browsing or storage disabled
 * - Returns null if no city saved or error occurs
 *
 * @returns Saved city ID or null if none saved/error
 */
export function loadCity(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    if (error instanceof Error && error.name === 'SecurityError') {
      console.warn('localStorage unavailable (private browsing or disabled)')
    } else {
      console.warn('Failed to load city selection:', error)
    }
    return null
  }
}
