
import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as THREE from 'three';

interface MaterialProps {
  position: [number, number, number];
  material: 'sugar' | 'salt' | 'sand' | 'oil';
  onDrop: (material: string) => void;
  isDragging: boolean;
}

const Material: React.FC<MaterialProps> = ({ position, material, onDrop, isDragging }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const colors = {
    sugar: '#ffffff',
    salt: '#f0f0f0',
    sand: '#d4a574',
    oil: '#ffeb3b'
  };

  const handleClick = () => {
    onDrop(material);
  };

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[0.3, 0.3, 0.3]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <meshStandardMaterial color={colors[material]} />
    </Box>
  );
};

interface ParticleProps {
  position: [number, number, number];
  material: string;
  dissolving: boolean;
}

const Particle: React.FC<ParticleProps> = ({ position, material, dissolving }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);

  useFrame(() => {
    if (dissolving && meshRef.current) {
      setScale(prev => Math.max(0, prev - 0.02));
      meshRef.current.position.y -= 0.01;
    }
  });

  if (scale <= 0) return null;

  return (
    <Sphere ref={meshRef} position={position} args={[0.02]} scale={scale}>
      <meshStandardMaterial 
        color={material === 'sugar' ? '#ffffff' : material === 'salt' ? '#f0f0f0' : '#d4a574'}
        transparent
        opacity={dissolving ? 0.5 : 1}
      />
    </Sphere>
  );
};

const Beaker: React.FC<{ hasWater: boolean; waterLevel: number }> = ({ hasWater, waterLevel }) => {
  return (
    <group>
      {/* Beaker walls */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 2, 32, 1, true]} />
        <meshPhysicalMaterial 
          color="#e0e0e0" 
          transparent 
          opacity={0.3}
          transmission={0.9}
          thickness={0.1}
        />
      </mesh>
      
      {/* Water */}
      {hasWater && (
        <mesh position={[0, -1 + waterLevel, 0]}>
          <cylinderGeometry args={[0.75, 0.75, waterLevel * 2, 32]} />
          <meshPhysicalMaterial 
            color="#4fc3f7" 
            transparent 
            opacity={0.6}
            transmission={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

interface SolubilitySimulationProps {
  onStepComplete: (step: number) => void;
  currentStep: number;
}

const SolubilitySimulation: React.FC<SolubilitySimulationProps> = ({ onStepComplete, currentStep }) => {
  const [hasWater, setHasWater] = useState(false);
  const [waterLevel, setWaterLevel] = useState(0);
  const [addedMaterials, setAddedMaterials] = useState<string[]>([]);
  const [particles, setParticles] = useState<Array<{ id: number; material: string; position: [number, number, number]; dissolving: boolean }>>([]);
  const [observations, setObservations] = useState<string[]>([]);

  const addWater = () => {
    setHasWater(true);
    setWaterLevel(0.8);
    onStepComplete(1);
  };

  const addMaterial = (material: string) => {
    if (!hasWater) return;
    
    setAddedMaterials(prev => [...prev, material]);
    
    // Create particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      material,
      position: [
        (Math.random() - 0.5) * 1.5,
        0.5 + Math.random() * 0.5,
        (Math.random() - 0.5) * 1.5
      ] as [number, number, number],
      dissolving: material === 'sugar' || material === 'salt'
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Add observation
    let observation = '';
    if (material === 'sugar' || material === 'salt') {
      observation = `${material === 'sugar' ? 'Şeker' : 'Tuz'} suda çözündü ve kayboldu!`;
    } else if (material === 'sand') {
      observation = 'Kum suda çözünmedi ve dibe çöktü.';
    } else if (material === 'oil') {
      observation = 'Yağ suda çözünmedi ve üstte kaldı.';
    }
    
    setObservations(prev => [...prev, observation]);
    onStepComplete(currentStep + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 3D Simulation */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Suda Çözünürlük Simülasyonu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <Canvas camera={{ position: [3, 2, 3], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              
              {/* Beaker */}
              <Beaker hasWater={hasWater} waterLevel={waterLevel} />
              
              {/* Materials to drag */}
              <Material 
                position={[-3, 0, 0]} 
                material="sugar" 
                onDrop={addMaterial}
                isDragging={false}
              />
              <Text position={[-3, -0.8, 0]} fontSize={0.2} color="white">
                Şeker
              </Text>
              
              <Material 
                position={[-3, 1, 0]} 
                material="salt" 
                onDrop={addMaterial}
                isDragging={false}
              />
              <Text position={[-3, 0.2, 0]} fontSize={0.2} color="white">
                Tuz
              </Text>
              
              <Material 
                position={[3, 0, 0]} 
                material="sand" 
                onDrop={addMaterial}
                isDragging={false}
              />
              <Text position={[3, -0.8, 0]} fontSize={0.2} color="white">
                Kum
              </Text>
              
              <Material 
                position={[3, 1, 0]} 
                material="oil" 
                onDrop={addMaterial}
                isDragging={false}
              />
              <Text position={[3, 0.2, 0]} fontSize={0.2} color="white">
                Yağ
              </Text>
              
              {/* Particles */}
              {particles.map(particle => (
                <Particle
                  key={particle.id}
                  position={particle.position}
                  material={particle.material}
                  dissolving={particle.dissolving}
                />
              ))}
              
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
            <div className="space-y-2">
              <p className="text-blue-200 text-sm">1. Önce beherin içine su ekleyin:</p>
              <Button 
                onClick={addWater}
                disabled={hasWater}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                {hasWater ? "Su Eklendi ✓" : "Suyu Ekle"}
              </Button>
            </div>
            
            {hasWater && (
              <div className="space-y-2">
                <p className="text-blue-200 text-sm">2. Malzemeleri beherin içine eklemek için üzerlerine tıklayın:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => addMaterial('sugar')}
                    className="bg-white hover:bg-gray-200 text-black"
                    size="sm"
                  >
                    Şeker Ekle
                  </Button>
                  <Button 
                    onClick={() => addMaterial('salt')}
                    className="bg-gray-200 hover:bg-gray-300 text-black"
                    size="sm"
                  >
                    Tuz Ekle
                  </Button>
                  <Button 
                    onClick={() => addMaterial('sand')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    size="sm"
                  >
                    Kum Ekle
                  </Button>
                  <Button 
                    onClick={() => addMaterial('oil')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    size="sm"
                  >
                    Yağ Ekle
                  </Button>
                </div>
              </div>
            )}
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
                  <div key={index} className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                    <p className="text-green-300 text-sm">{observation}</p>
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

export default SolubilitySimulation;
