import { useState } from 'react'
import Header from './components/Header'
import Button from './components/Button'
import { CITIES, DEFAULT_CITY } from './data/cities'
import { loadCity, saveCity } from './utils/storage'
import type { City } from './types/city'
import './App.css'

function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  const toHex = (n: number) => n.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function App() {
  const [color, setColor] = useState('#000000');

  // Initialize city from localStorage or default
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    const savedCityId = loadCity();
    if (savedCityId) {
      const found = CITIES.find(c => c.id === savedCityId);
      if (found) return found;
    }
    return DEFAULT_CITY;
  });

  const handleColorChange = () => {
    setColor(generateRandomColor());
  };

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    saveCity(city.id);
  };

  return (
    <>
      <Header color={color} city={selectedCity} onCityChange={handleCityChange} />
      <Button onClick={handleColorChange} />
    </>
  )
}

export default App
