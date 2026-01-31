import DateDisplay from './DateDisplay';
import WeatherWidget from './WeatherWidget';

type HeaderProps = {
  color: string;
};

function Header({ color }: HeaderProps) {
  return (
    <header className="header">
      <DateDisplay color={color} />
      <WeatherWidget />
    </header>
  );
}

export default Header;
