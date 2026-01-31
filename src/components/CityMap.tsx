import type { City } from '../types/city'

interface CityMapProps {
  city: City
}

function CityMap({ city }: CityMapProps) {
  const { latitude: lat, longitude: lng, name } = city

  // Create bounding box for map view (±1 degree around city)
  const bbox = `${lng - 1},${lat - 1},${lng + 1},${lat + 1}`

  // OpenStreetMap embed URL with marker at city coordinates
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="city-map">
      <iframe
        src={mapUrl}
        width="100%"
        height="200"
        style={{ border: 'none' }}
        title={`Map of ${name}`}
        loading="lazy"
      />
    </div>
  )
}

export default CityMap
