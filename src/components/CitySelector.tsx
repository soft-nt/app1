import { useState, useMemo } from 'react'
import type { City } from '../types/city'
import { CITIES } from '../data/cities'

interface CitySelectorProps {
  selectedCity: City
  onSelectCity: (city: City) => void
}

function CitySelector({ selectedCity, onSelectCity }: CitySelectorProps) {
  const [filter, setFilter] = useState('')

  // Memoize filtered cities to avoid recalculating on every render
  const filteredCities = useMemo(() => {
    const lowerFilter = filter.toLowerCase()
    return CITIES.filter(city =>
      city.name.toLowerCase().includes(lowerFilter) ||
      city.country.toLowerCase().includes(lowerFilter)
    )
  }, [filter])

  return (
    <div className="city-selector">
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search cities..."
        className="city-search"
      />
      <ul className="city-list">
        {filteredCities.map(city => (
          <li
            key={city.id}
            onClick={() => onSelectCity(city)}
            className={`city-item ${city.id === selectedCity.id ? 'selected' : ''}`}
          >
            <span className="city-name">{city.name}, {city.country}</span>
            {city.id === selectedCity.id && <span className="city-check">✓</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CitySelector
