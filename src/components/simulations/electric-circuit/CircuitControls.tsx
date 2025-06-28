
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Zap } from 'lucide-react';

interface CircuitControlsProps {
  connections: string[];
  onComponentClick: (componentId: string) => void;
  onReset: () => void;
}

const CircuitControls: React.FC<CircuitControlsProps> = ({ 
  connections, 
  onComponentClick, 
  onReset 
}) => {
  const components = [
    { id: 'battery', name: 'Pil' },
    { id: 'wire1', name: 'Tel 1' },
    { id: 'wire2', name: 'Tel 2' },
    { id: 'bulb', name: 'Ampul' }
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-400" />
          Devre Kontrolleri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {components.map(component => (
            <Button
              key={component.id}
              onClick={() => onComponentClick(component.id)}
              disabled={connections.includes(component.id)}
              className={`${
                connections.includes(component.id)
                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              } border`}
              variant="outline"
            >
              {component.name}
              {connections.includes(component.id) && (
                <Badge className="ml-2 bg-green-500/30 text-green-300">
                  Bağlı
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        <Button
          onClick={onReset}
          className="w-full bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
          variant="outline"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Devre Sıfırla
        </Button>
        
        <div className="text-center text-sm text-blue-300">
          {connections.length}/4 bileşen bağlandı
        </div>
      </CardContent>
    </Card>
  );
};

export default CircuitControls;
