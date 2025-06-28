
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CircuitComponent from './CircuitComponent';
import ElectricWire from './ElectricWire';

interface CircuitSceneProps {
  connections: string[];
  circuitComplete: boolean;
  onComponentClick: (componentId: string) => void;
}

const CircuitScene: React.FC<CircuitSceneProps> = ({ 
  connections, 
  circuitComplete, 
  onComponentClick 
}) => {
  const components = [
    { id: 'battery', position: [-2, 0, 0] as [number, number, number], type: 'battery' as const },
    { id: 'wire1', position: [0, 1, 0] as [number, number, number], type: 'wire' as const },
    { id: 'wire2', position: [0, -1, 0] as [number, number, number], type: 'wire' as const },
    { id: 'bulb', position: [2, 0, 0] as [number, number, number], type: 'bulb' as const }
  ];

  return (
    <div className="h-96 w-full">
      <Canvas 
        camera={{ position: [4, 3, 4], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[0, 10, 0]} intensity={0.5} />
          
          {/* Circuit Components */}
          {components.map(component => (
            <CircuitComponent
              key={component.id}
              position={component.position}
              type={component.type}
              isConnected={connections.includes(component.id)}
              onClick={() => onComponentClick(component.id)}
            />
          ))}
          
          {/* Wires connecting components */}
          {circuitComplete && (
            <>
              <ElectricWire 
                start={[-2, 0, 0]} 
                end={[0, 1, 0]} 
                isActive={true}
              />
              <ElectricWire 
                start={[0, 1, 0]} 
                end={[2, 0, 0]} 
                isActive={true}
              />
              <ElectricWire 
                start={[2, 0, 0]} 
                end={[0, -1, 0]} 
                isActive={true}
              />
              <ElectricWire 
                start={[0, -1, 0]} 
                end={[-2, 0, 0]} 
                isActive={true}
              />
            </>
          )}
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CircuitScene;
