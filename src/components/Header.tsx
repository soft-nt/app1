import { useState } from 'react';
import DateDisplay from './DateDisplay';
import WeatherWidget from './WeatherWidget';
import SettingsModal from './SettingsModal';
import CitySelector from './CitySelector';
import CityMap from './CityMap';
import type { City } from '../types/city';

type HeaderProps = {
  color: string;
  city: City;
  onCityChange: (city: City) => void;
};

function Header({ color, city, onCityChange }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="header">
      <DateDisplay color={color} />
      <WeatherWidget city={city} />
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="settings-btn"
        aria-label="Open settings"
      >
        ⚙️
      </button>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <h2 className="modal-header">Settings</h2>
        <h3>Select City</h3>
        <CitySelector selectedCity={city} onSelectCity={onCityChange} />
        <CityMap city={city} />
      </SettingsModal>
    </header>
  );
}

export default Header;
