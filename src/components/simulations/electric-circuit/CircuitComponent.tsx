
import React, { useState } from 'react';
import { Text } from '@react-three/drei';

interface CircuitComponentProps {
  position: [number, number, number];
  type: 'battery' | 'wire' | 'bulb';
  isConnected: boolean;
  onClick: () => void;
}

const CircuitComponent: React.FC<CircuitComponentProps> = ({ position, type, isConnected, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const getColor = () => {
    switch (type) {
      case 'battery':
        return isConnected ? '#ff4444' : '#666666';
      case 'wire':
        return isConnected ? '#ffaa00' : '#444444';
      case 'bulb':
        return isConnected ? '#ffff00' : '#888888';
      default:
        return '#ffffff';
    }
  };

  const getGeometry = () => {
    switch (type) {
      case 'battery':
        return [0.8, 0.4, 0.2] as [number, number, number];
      case 'wire':
        return [0.05, 0.05, 2, 8] as [number, number, number, number];
      case 'bulb':
        return [0.3, 0.2, 0.5, 8] as [number, number, number, number];
      default:
        return [0.2, 0.2, 0.2] as [number, number, number];
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'battery':
        return 'Pil';
      case 'bulb':
        return 'Ampul';
      case 'wire':
        return 'Tel';
      default:
        return '';
    }
  };

  const renderGeometry = () => {
    const args = getGeometry();
    switch (type) {
      case 'battery':
        return <boxGeometry args={args as [number, number, number]} />;
      case 'wire':
        return <cylinderGeometry args={args as [number, number, number, number]} />;
      case 'bulb':
        return <cylinderGeometry args={args as [number, number, number, number]} />;
      default:
        return <boxGeometry args={args as [number, number, number]} />;
    }
  };

  return (
    <group>
      <mesh
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        {renderGeometry()}
        <meshStandardMaterial 
          color={getColor()} 
          emissive={type === 'bulb' && isConnected ? '#ffff00' : '#000000'}
          emissiveIntensity={type === 'bulb' && isConnected ? 0.5 : 0}
        />
      </mesh>
      <Text 
        position={[position[0], position[1] - 0.8, position[2]]} 
        fontSize={0.2} 
        color="white"
      >
        {getLabel()}
      </Text>
    </group>
  );
};

export default CircuitComponent;
