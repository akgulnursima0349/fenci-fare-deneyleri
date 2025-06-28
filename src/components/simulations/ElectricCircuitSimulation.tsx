import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as THREE from 'three';

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

  return (
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
  );
};

const ElectricWire: React.FC<{ 
  start: [number, number, number]; 
  end: [number, number, number]; 
  isActive: boolean;
}> = ({ start, end, isActive }) => {
  const wireRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(null);
  
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

  useFrame(({ clock }) => {
    if (wireRef.current && isActive) {
      const material = wireRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(clock.elapsedTime * 10) * 0.2;
    }
  });

  return (
    <mesh ref={wireRef} position={midpoint}>
      <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
      <meshStandardMaterial 
        color={isActive ? '#ffaa00' : '#444444'}
        emissive={isActive ? '#ff6600' : '#000000'}
      />
    </mesh>
  );
};

interface ElectricCircuitSimulationProps {
  onStepComplete: (step: number) => void;
  currentStep: number;
}

const ElectricCircuitSimulation: React.FC<ElectricCircuitSimulationProps> = ({ onStepComplete, currentStep }) => {
  const [connections, setConnections] = useState<string[]>([]);
  const [circuitComplete, setCircuitComplete] = useState(false);
  const [observations, setObservations] = useState<string[]>([]);

  const components = [
    { id: 'battery', position: [-2, 0, 0] as [number, number, number], type: 'battery' as const },
    { id: 'wire1', position: [0, 1, 0] as [number, number, number], type: 'wire' as const },
    { id: 'wire2', position: [0, -1, 0] as [number, number, number], type: 'wire' as const },
    { id: 'bulb', position: [2, 0, 0] as [number, number, number], type: 'bulb' as const }
  ];

  const handleComponentClick = (componentId: string) => {
    if (connections.includes(componentId)) return;
    
    const newConnections = [...connections, componentId];
    setConnections(newConnections);
    
    let observation = '';
    switch (componentId) {
      case 'battery':
        observation = 'Pil devreye bağlandı. Elektrik kaynağı hazır!';
        break;
      case 'wire1':
      case 'wire2':
        observation = 'Tel bağlandı. Elektrik akımının yolu oluşuyor.';
        break;
      case 'bulb':
        observation = 'Ampul devreye bağlandı.';
        break;
    }
    
    setObservations(prev => [...prev, observation]);
    
    // Check if circuit is complete
    if (newConnections.length === 4) {
      setCircuitComplete(true);
      setObservations(prev => [...prev, '🎉 Devre tamamlandı! Ampul yanıyor!']);
      onStepComplete(4);
    } else {
      onStepComplete(newConnections.length);
    }
  };

  const resetCircuit = () => {
    setConnections([]);
    setCircuitComplete(false);
    setObservations([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 3D Simulation */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Elektrik Devresi Simülasyonu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <Canvas camera={{ position: [4, 3, 4], fov: 60 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[5, 5, 5]} intensity={1} />
              <directionalLight position={[0, 10, 0]} intensity={0.5} />
              
              {/* Circuit Components */}
              {components.map(component => (
                <group key={component.id}>
                  <CircuitComponent
                    position={component.position}
                    type={component.type}
                    isConnected={connections.includes(component.id)}
                    onClick={() => handleComponentClick(component.id)}
                  />
                  <Text 
                    position={[component.position[0], component.position[1] - 0.8, component.position[2]]} 
                    fontSize={0.2} 
                    color="white"
                  >
                    {component.type === 'battery' ? 'Pil' : 
                     component.type === 'bulb' ? 'Ampul' : 'Tel'}
                  </Text>
                </group>
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
              
              <OrbitControls enableZoom={true} enablePan={false} />
            </Canvas>
          </div>
        </CardContent>
      </Card>

      {/* Controls and Observations */}
      <div className="space-y-6">
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Deney Adımları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-blue-200 text-sm">
                Elektrik devresini tamamlamak için bileşenlere sırayla tıklayın:
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => handleComponentClick('battery')}
                  disabled={connections.includes('battery')}
                  className={`${connections.includes('battery') ? 'bg-green-500' : 'bg-red-500'} hover:opacity-80`}
                >
                  {connections.includes('battery') ? '✓ Pil Bağlandı' : '1. Pili Bağla'}
                </Button>
                
                <Button 
                  onClick={() => handleComponentClick('wire1')}
                  disabled={connections.includes('wire1') || !connections.includes('battery')}
                  className={`${connections.includes('wire1') ? 'bg-green-500' : 'bg-yellow-600'} hover:opacity-80`}
                >
                  {connections.includes('wire1') ? '✓ Tel 1 Bağlandı' : '2. Tel 1 Bağla'}
                </Button>
                
                <Button 
                  onClick={() => handleComponentClick('bulb')}
                  disabled={connections.includes('bulb') || connections.length < 2}
                  className={`${connections.includes('bulb') ? 'bg-green-500' : 'bg-blue-500'} hover:opacity-80`}
                >
                  {connections.includes('bulb') ? '✓ Ampul Bağlandı' : '3. Ampulü Bağla'}
                </Button>
                
                <Button 
                  onClick={() => handleComponentClick('wire2')}
                  disabled={connections.includes('wire2') || connections.length < 3}
                  className={`${connections.includes('wire2') ? 'bg-green-500' : 'bg-yellow-600'} hover:opacity-80`}
                >
                  {connections.includes('wire2') ? '✓ Tel 2 Bağlandı' : '4. Tel 2 Bağla'}
                </Button>
              </div>
              
              <Button 
                onClick={resetCircuit}
                variant="outline"
                className="w-full mt-4"
              >
                Devreyi Sıfırla
              </Button>
            </div>
          </CardContent>
        </Card>

        {observations.length > 0 && (
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Gözlemler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {observations.map((observation, index) => (
                  <div 
                    key={index} 
                    className={`rounded-lg p-3 border ${
                      observation.includes('🎉') 
                        ? 'bg-green-500/20 border-green-500/30' 
                        : 'bg-blue-500/20 border-blue-500/30'
                    }`}
                  >
                    <p className={`text-sm ${
                      observation.includes('🎉') ? 'text-green-300' : 'text-blue-300'
                    }`}>
                      {observation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ElectricCircuitSimulation;
