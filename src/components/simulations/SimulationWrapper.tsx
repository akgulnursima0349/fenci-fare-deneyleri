
import React from 'react';
import SolubilitySimulation from './SolubilitySimulation';
import ElectricCircuitSimulation from './ElectricCircuitSimulation';

interface SimulationWrapperProps {
  experimentId: number;
  onStepComplete: (step: number) => void;
  currentStep: number;
}

const SimulationWrapper: React.FC<SimulationWrapperProps> = ({ 
  experimentId, 
  onStepComplete, 
  currentStep 
}) => {
  const renderSimulation = () => {
    switch (experimentId) {
      case 1: // Suda Çözünürlük
        return (
          <SolubilitySimulation 
            onStepComplete={onStepComplete}
            currentStep={currentStep}
          />
        );
      case 6: // Elektrik Devresi
        return (
          <ElectricCircuitSimulation 
            onStepComplete={onStepComplete}
            currentStep={currentStep}
          />
        );
      default:
        return (
          <div className="text-center py-8">
            <p className="text-white text-lg">Bu deney için simülasyon henüz hazırlanmadı.</p>
            <p className="text-blue-300 text-sm mt-2">Yakında daha fazla simülasyon eklenecek!</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderSimulation()}
    </div>
  );
};

export default SimulationWrapper;
