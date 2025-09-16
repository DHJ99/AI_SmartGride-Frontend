import React, { useState, useEffect } from 'react';
import { Zap, Battery, Sun, Wind, Fuel, TrendingUp, Settings, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChartComponent, BarChartComponent, PieChartComponent } from '../components/ui/Chart';

interface EnergySource {
  id: string;
  name: string;
  type: 'solar' | 'wind' | 'nuclear' | 'gas' | 'hydro' | 'coal';
  capacity: number;
  currentOutput: number;
  efficiency: number;
  cost: number;
  emissions: number;
  status: 'online' | 'offline' | 'maintenance';
}

interface EnergyStorage {
  id: string;
  name: string;
  capacity: number;
  currentCharge: number;
  chargingRate: number;
  dischargingRate: number;
  efficiency: number;
  status: 'charging' | 'discharging' | 'idle';
}

interface DemandResponse {
  id: string;
  program: string;
  participants: number;
  potentialReduction: number;
  currentReduction: number;
  incentiveRate: number;
  status: 'active' | 'inactive' | 'scheduled';
}

export const EnergyManagement: React.FC = () => {
  const [energySources, setEnergySources] = useState<EnergySource[]>([
    {
      id: 'solar-1',
      name: 'Solar Farm Alpha',
      type: 'solar',
      capacity: 800,
      currentOutput: 650,
      efficiency: 22.5,
      cost: 0.08,
      emissions: 0,
      status: 'online',
    },
    {
      id: 'wind-1',
      name: 'Wind Farm Beta',
      type: 'wind',
      capacity: 600,
      currentOutput: 420,
      efficiency: 35.2,
      cost: 0.06,
      emissions: 0,
      status: 'online',
    },
    {
      id: 'nuclear-1',
      name: 'Nuclear Plant Gamma',
      type: 'nuclear',
      capacity: 1200,
      currentOutput: 1150,
      efficiency: 33.0,
      cost: 0.12,
      emissions: 0.02,
      status: 'online',
    },
    {
      id: 'gas-1',
      name: 'Gas Plant Delta',
      type: 'gas',
      capacity: 900,
      currentOutput: 720,
      efficiency: 58.5,
      cost: 0.15,
      emissions: 0.35,
      status: 'online',
    },
  ]);

  const [energyStorage, setEnergyStorage] = useState<EnergyStorage[]>([
    {
      id: 'battery-1',
      name: 'Grid Battery Bank A',
      capacity: 400,
      currentCharge: 320,
      chargingRate: 50,
      dischargingRate: 0,
      efficiency: 95.2,
      status: 'charging',
    },
    {
      id: 'battery-2',
      name: 'Grid Battery Bank B',
      capacity: 300,
      currentCharge: 180,
      chargingRate: 0,
      dischargingRate: 30,
      efficiency: 94.8,
      status: 'discharging',
    },
  ]);

  const [demandResponse, setDemandResponse] = useState<DemandResponse[]>([
    {
      id: 'dr-1',
      program: 'Peak Shaving Program',
      participants: 1250,
      potentialReduction: 150,
      currentReduction: 85,
      incentiveRate: 0.25,
      status: 'active',
    },
    {
      id: 'dr-2',
      program: 'Time-of-Use Optimization',
      participants: 2800,
      potentialReduction: 200,
      currentReduction: 0,
      incentiveRate: 0.15,
      status: 'scheduled',
    },
  ]);

  const [optimizationMode, setOptimizationMode] = useState<'cost' | 'emissions' | 'reliability'>('cost');

  useEffect(() => {
    const interval = setInterval(() => {
      // Update energy sources
      setEnergySources(prev => prev.map(source => ({
        ...source,
        currentOutput: Math.max(0, Math.min(source.capacity, 
          source.currentOutput + (Math.random() - 0.5) * 50
        )),
        efficiency: Math.max(0, source.efficiency + (Math.random() - 0.5) * 2),
      })));

      // Update storage
      setEnergyStorage(prev => prev.map(storage => {
        let newCharge = storage.currentCharge;
        if (storage.status === 'charging') {
          newCharge = Math.min(storage.capacity, storage.currentCharge + storage.chargingRate * 0.1);
        } else if (storage.status === 'discharging') {
          newCharge = Math.max(0, storage.currentCharge - storage.dischargingRate * 0.1);
        }
        
        return {
          ...storage,
          currentCharge: newCharge,
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'solar':
        return Sun;
      case 'wind':
        return Wind;
      case 'nuclear':
        return Zap;
      case 'gas':
        return Fuel;
      default:
        return Zap;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'solar':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'wind':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'nuclear':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'gas':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const totalGeneration = energySources.reduce((sum, source) => sum + source.currentOutput, 0);
  const totalCapacity = energySources.reduce((sum, source) => sum + source.capacity, 0);
  const renewableOutput = energySources
    .filter(s => ['solar', 'wind', 'hydro'].includes(s.type))
    .reduce((sum, source) => sum + source.currentOutput, 0);
  const renewablePercentage = (renewableOutput / totalGeneration) * 100;

  const energyMixData = energySources.map(source => ({
    name: source.name,
    value: source.currentOutput,
    type: source.type,
  }));

  const storageData = energyStorage.map(storage => ({
    name: storage.name,
    charge: (storage.currentCharge / storage.capacity) * 100,
    capacity: storage.capacity,
    status: storage.status,
  }));

  const demandResponseData = demandResponse.map(dr => ({
    name: dr.program,
    potential: dr.potentialReduction,
    current: dr.currentReduction,
    participants: dr.participants,
  }));

  const pieColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Zap size={32} className="text-white" />
                <h1 className="text-3xl font-bold">Energy Management Center</h1>
              </div>
              <p className="text-yellow-100 text-lg">
                Comprehensive energy portfolio management, renewable integration, and demand optimization.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">{totalGeneration.toFixed(0)} MW</div>
              <div className="text-yellow-200">Total Generation</div>
              <div className="text-sm text-yellow-300 mt-1">
                {((totalGeneration / totalCapacity) * 100).toFixed(1)}% of capacity
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {renewablePercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Renewable Share</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: 50%
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {energyStorage.reduce((sum, s) => sum + s.currentCharge, 0).toFixed(0)} MWh
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Stored Energy</div>
            <div className="text-xs text-gray-500 mt-1">
              {energyStorage.reduce((sum, s) => sum + s.capacity, 0)} MWh capacity
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              ${(energySources.reduce((sum, s) => sum + (s.currentOutput * s.cost), 0) / 1000).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cost per Hour</div>
            <div className="text-xs text-gray-500 mt-1">
              $/MWh average
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {energySources.reduce((sum, s) => sum + (s.currentOutput * s.emissions), 0).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">CO₂ Emissions</div>
            <div className="text-xs text-gray-500 mt-1">
              kg/MWh
            </div>
          </div>
        </Card>
      </div>

      {/* Energy Mix and Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap size={20} className="text-blue-600" />
              <span>Current Energy Mix</span>
            </CardTitle>
          </CardHeader>
          <PieChartComponent
            data={energyMixData}
            dataKey="value"
            nameKey="name"
            colors={pieColors}
            height={300}
          />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {energySources.map((source, index) => {
              const Icon = getSourceIcon(source.type);
              return (
                <div key={source.id} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  />
                  <Icon size={16} />
                  <span className="text-gray-700 dark:text-gray-300">
                    {source.name}: {source.currentOutput.toFixed(0)} MW
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Battery size={20} className="text-green-600" />
              <span>Energy Storage Status</span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {energyStorage.map((storage) => (
              <div key={storage.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {storage.name}
                  </h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    storage.status === 'charging' ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' :
                    storage.status === 'discharging' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400' :
                    'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {storage.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Charge Level</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {storage.currentCharge.toFixed(0)} / {storage.capacity} MWh
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      storage.status === 'charging' ? 'bg-green-500' :
                      storage.status === 'discharging' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${(storage.currentCharge / storage.capacity) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Efficiency: {storage.efficiency.toFixed(1)}%</span>
                  <span>
                    {storage.status === 'charging' ? `+${storage.chargingRate}` : 
                     storage.status === 'discharging' ? `-${storage.dischargingRate}` : '0'} MW
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Energy Sources Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Settings size={20} className="text-purple-600" />
              <span>Energy Sources Control</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Optimization Mode:</span>
              <select
                value={optimizationMode}
                onChange={(e) => setOptimizationMode(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="cost">Cost Optimization</option>
                <option value="emissions">Emissions Reduction</option>
                <option value="reliability">Reliability Focus</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2">Source</th>
                <th className="text-right py-3 px-2">Output</th>
                <th className="text-right py-3 px-2">Capacity</th>
                <th className="text-right py-3 px-2">Efficiency</th>
                <th className="text-right py-3 px-2">Cost</th>
                <th className="text-right py-3 px-2">Emissions</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {energySources.map((source) => {
                const Icon = getSourceIcon(source.type);
                const utilizationPercentage = (source.currentOutput / source.capacity) * 100;
                
                return (
                  <tr key={source.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getSourceColor(source.type)}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {source.name}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {source.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-white">
                      {source.currentOutput.toFixed(0)} MW
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">
                      {source.capacity} MW
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">
                      {source.efficiency.toFixed(1)}%
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">
                      ${source.cost.toFixed(3)}/kWh
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">
                      {source.emissions.toFixed(2)} kg/MWh
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        source.status === 'online' ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' :
                        source.status === 'maintenance' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {source.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex space-x-1 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={source.status !== 'online'}
                        >
                          Control
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Demand Response Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target size={20} className="text-indigo-600" />
            <span>Demand Response Programs</span>
          </CardTitle>
        </CardHeader>

        <div className="space-y-4">
          {demandResponse.map((program) => (
            <div key={program.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {program.program}
                </h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  program.status === 'active' ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' :
                  program.status === 'scheduled' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400' :
                  'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {program.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {program.participants.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Participants</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {program.currentReduction.toFixed(0)} MW
                  </div>
                  <div className="text-xs text-gray-500">Current Reduction</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {program.potentialReduction.toFixed(0)} MW
                  </div>
                  <div className="text-xs text-gray-500">Potential</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    ${program.incentiveRate.toFixed(2)}/kWh
                  </div>
                  <div className="text-xs text-gray-500">Incentive Rate</div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Utilization</span>
                  <span>{((program.currentReduction / program.potentialReduction) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(program.currentReduction / program.potentialReduction) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Energy Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generation vs Demand</CardTitle>
          </CardHeader>
          <BarChartComponent
            data={[
              { time: '00:00', generation: totalGeneration * 0.8, demand: totalGeneration * 0.75 },
              { time: '06:00', generation: totalGeneration * 0.9, demand: totalGeneration * 0.85 },
              { time: '12:00', generation: totalGeneration, demand: totalGeneration * 0.95 },
              { time: '18:00', generation: totalGeneration * 0.95, demand: totalGeneration * 0.9 },
              { time: '24:00', generation: totalGeneration * 0.85, demand: totalGeneration * 0.8 },
            ]}
            bars={[
              { dataKey: 'generation', fill: '#3b82f6', name: 'Generation (MW)' },
              { dataKey: 'demand', fill: '#10b981', name: 'Demand (MW)' },
            ]}
            xAxisKey="time"
            height={250}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Charge Levels</CardTitle>
          </CardHeader>
          <BarChartComponent
            data={storageData}
            bars={[{ dataKey: 'charge', fill: '#8b5cf6', name: 'Charge Level (%)' }]}
            xAxisKey="name"
            height={250}
          />
        </Card>
      </div>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-green-600" />
            <span>Optimization Recommendations</span>
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              Increase Solar Output
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Optimal solar conditions detected. Increase solar farm output by 15% to reduce gas plant usage.
            </p>
            <div className="text-xs text-green-600 dark:text-green-400">
              Potential savings: $2,400/hour
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Optimize Storage Charging
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Charge batteries during low-cost periods and discharge during peak demand.
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Potential savings: $1,800/hour
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
              Activate Demand Response
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              Peak demand approaching. Activate demand response programs to reduce load by 120 MW.
            </p>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              Potential reduction: 120 MW
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};