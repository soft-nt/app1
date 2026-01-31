import { useState } from 'react'
import Header from './components/Header'
import Button from './components/Button'
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

  const handleColorChange = () => {
    setColor(generateRandomColor());
  };

  return (
    <>
      <Header color={color} />
      <Button onClick={handleColorChange} />
    </>
  )
}

export default App
