
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CircuitScene from './electric-circuit/CircuitScene';
import CircuitControls from './electric-circuit/CircuitControls';
import ObservationPanel from './electric-circuit/ObservationPanel';

interface ElectricCircuitSimulationProps {
  onStepComplete: (step: number) => void;
  currentStep: number;
}

const ElectricCircuitSimulation: React.FC<ElectricCircuitSimulationProps> = ({ 
  onStepComplete, 
  currentStep 
}) => {
  const [connections, setConnections] = useState<string[]>([]);
  const [circuitComplete, setCircuitComplete] = useState(false);
  const [observations, setObservations] = useState<string[]>([]);

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
          <CircuitScene 
            connections={connections}
            circuitComplete={circuitComplete}
            onComponentClick={handleComponentClick}
          />
        </CardContent>
      </Card>

      {/* Controls and Observations */}
      <div className="space-y-6">
        <CircuitControls 
          connections={connections}
          onComponentClick={handleComponentClick}
          onReset={resetCircuit}
        />
        
        <ObservationPanel observations={observations} />
      </div>
    </div>
  );
};

export default ElectricCircuitSimulation;
