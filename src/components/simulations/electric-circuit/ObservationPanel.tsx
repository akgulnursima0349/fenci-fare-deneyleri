
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ObservationPanelProps {
  observations: string[];
}

const ObservationPanel: React.FC<ObservationPanelProps> = ({ observations }) => {
  if (observations.length === 0) return null;

  return (
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
  );
};

export default ObservationPanel;
