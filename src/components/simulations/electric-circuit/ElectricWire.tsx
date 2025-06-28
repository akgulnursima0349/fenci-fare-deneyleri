
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ElectricWireProps {
  start: [number, number, number]; 
  end: [number, number, number]; 
  isActive: boolean;
}

const ElectricWire: React.FC<ElectricWireProps> = ({ start, end, isActive }) => {
  const wireRef = useRef<THREE.Mesh>(null);
  
  const distance = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + 
    Math.pow(end[1] - start[1], 2) + 
    Math.pow(end[2] - start[2], 2)
  );

  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  ];

  // Calculate rotation to align cylinder with wire direction
  const direction = new THREE.Vector3(
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2]
  ).normalize();

  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);

  useFrame(({ clock }) => {
    if (wireRef.current && isActive) {
      const material = wireRef.current.material as THREE.MeshStandardMaterial;
      if (material && material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.3 + Math.sin(clock.elapsedTime * 10) * 0.2;
      }
    }
  });

  return (
    <mesh 
      ref={wireRef} 
      position={midpoint}
      quaternion={quaternion}
    >
      <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
      <meshStandardMaterial 
        color={isActive ? '#ffaa00' : '#444444'}
        emissive={isActive ? '#ff6600' : '#000000'}
        emissiveIntensity={isActive ? 0.3 : 0}
      />
    </mesh>
  );
};

export default ElectricWire;
