
import React, { useState } from 'react';
import { Text, Box, Cylinder } from '@react-three/drei';

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
        return <Box args={[0.8, 0.4, 0.2]} />;
      case 'wire':
        return <Cylinder args={[0.05, 0.05, 2, 8]} />;
      case 'bulb':
        return <Cylinder args={[0.3, 0.2, 0.5, 8]} />;
      default:
        return <Box args={[0.2, 0.2, 0.2]} />;
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

  return (
    <group>
      <mesh
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        {getGeometry()}
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
