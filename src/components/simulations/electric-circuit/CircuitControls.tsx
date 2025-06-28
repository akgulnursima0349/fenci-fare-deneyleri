
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  return (
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
              onClick={() => onComponentClick('battery')}
              disabled={connections.includes('battery')}
              className={`${connections.includes('battery') ? 'bg-green-500' : 'bg-red-500'} hover:opacity-80`}
            >
              {connections.includes('battery') ? '✓ Pil Bağlandı' : '1. Pili Bağla'}
            </Button>
            
            <Button 
              onClick={() => onComponentClick('wire1')}
              disabled={connections.includes('wire1') || !connections.includes('battery')}
              className={`${connections.includes('wire1') ? 'bg-green-500' : 'bg-yellow-600'} hover:opacity-80`}
            >
              {connections.includes('wire1') ? '✓ Tel 1 Bağlandı' : '2. Tel 1 Bağla'}
            </Button>
            
            <Button 
              onClick={() => onComponentClick('bulb')}
              disabled={connections.includes('bulb') || connections.length < 2}
              className={`${connections.includes('bulb') ? 'bg-green-500' : 'bg-blue-500'} hover:opacity-80`}
            >
              {connections.includes('bulb') ? '✓ Ampul Bağlandı' : '3. Ampulü Bağla'}
            </Button>
            
            <Button 
              onClick={() => onComponentClick('wire2')}
              disabled={connections.includes('wire2') || connections.length < 3}
              className={`${connections.includes('wire2') ? 'bg-green-500' : 'bg-yellow-600'} hover:opacity-80`}
            >
              {connections.includes('wire2') ? '✓ Tel 2 Bağlandı' : '4. Tel 2 Bağla'}
            </Button>
          </div>
          
          <Button 
            onClick={onReset}
            variant="outline"
            className="w-full mt-4"
          >
            Devreyi Sıfırla
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CircuitControls;
