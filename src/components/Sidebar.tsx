import React, { useState } from 'react';
import {
  Building2,
  Music,
  AlertCircle,
  Users,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { scenarios } from '../scenarios/presets';

const scenarioIcons: Record<string, any> = {
  evacuation_building: Building2,
  festival_crowd: Music,
  panic_scenario: AlertCircle,
  stadium_evacuation: Users,
  shopping_mall: ShoppingBag
};

export const Sidebar: React.FC = () => {
  const { currentScenario, initializeSimulation, darkMode, toggleDarkMode, engine } =
    useSimulationStore();
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const stats = engine?.getStats();

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-white">Crowd Dynamics</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-400" />}
          </button>
        </div>
        <p className="text-sm text-gray-400">
          Professional crowd simulation toolkit
        </p>
      </div>

      {/* Scenarios */}
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">
          Scenarios
        </h2>

        <div className="space-y-2">
          {Object.values(scenarios).map((scenario) => {
            const Icon = scenarioIcons[scenario.id] || Building2;
            const isActive = currentScenario?.id === scenario.id;
            const isExpanded = expandedScenario === scenario.id;

            return (
              <div key={scenario.id} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => {
                    if (isExpanded) {
                      setExpandedScenario(null);
                    } else {
                      setExpandedScenario(scenario.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <div className="text-left">
                      <div className="font-medium">{scenario.name}</div>
                      <div className={`text-xs ${isActive ? 'text-primary-100' : 'text-gray-400'}`}>
                        {scenario.type}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isExpanded && (
                  <div className="bg-gray-750 p-3 border-t border-gray-600">
                    <p className="text-sm text-gray-300 mb-3">
                      {scenario.description}
                    </p>
                    <div className="space-y-1 text-xs text-gray-400 mb-3">
                      <div>Agents: {scenario.initialAgents}</div>
                      <div>Duration: {scenario.duration}s</div>
                      <div>Events: {scenario.events.length}</div>
                    </div>
                    {!isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          initializeSimulation(scenario.id);
                        }}
                        className="w-full px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        Load Scenario
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="p-4 border-t border-gray-700">
          <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">
            Statistics
          </h2>

          <div className="space-y-3">
            <StatItem
              label="Simulation Time"
              value={`${stats.time.toFixed(1)}s`}
            />
            <StatItem
              label="Total Agents"
              value={stats.totalAgents.toString()}
            />
            <StatItem
              label="Active Agents"
              value={(stats.totalAgents - stats.exitedAgents).toString()}
              valueColor="text-blue-400"
            />
            <StatItem
              label="Exited Agents"
              value={stats.exitedAgents.toString()}
              valueColor="text-green-400"
            />
            <StatItem
              label="Average Speed"
              value={`${stats.averageSpeed.toFixed(2)} m/s`}
            />
            <StatItem
              label="Average Stress"
              value={`${(stats.averageStress * 100).toFixed(0)}%`}
              valueColor={
                stats.averageStress > 0.7
                  ? 'text-red-400'
                  : stats.averageStress > 0.4
                  ? 'text-yellow-400'
                  : 'text-green-400'
              }
            />
            <StatItem
              label="Max Density"
              value={stats.maxDensity.toString()}
            />
            <StatItem
              label="Bottlenecks"
              value={stats.bottlenecks.length.toString()}
              valueColor={stats.bottlenecks.length > 0 ? 'text-red-400' : 'text-green-400'}
            />
            {stats.evacuationTime && (
              <StatItem
                label="Evacuation Time"
                value={`${stats.evacuationTime.toFixed(1)}s`}
                valueColor="text-green-400"
              />
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="p-4 border-t border-gray-700">
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">
          Agent Types
        </h2>

        <div className="space-y-2 text-sm">
          <LegendItem color="#3b82f6" label="Adult" />
          <LegendItem color="#fbbf24" label="Child" />
          <LegendItem color="#a78bfa" label="Elderly" />
          <LegendItem color="#fb923c" label="Disabled" />
        </div>

        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3 mt-4">
          Agent States
        </h2>

        <div className="space-y-2 text-sm">
          <LegendItem color="#10b981" label="Normal/Moving" />
          <LegendItem color="#f59e0b" label="Stressed" />
          <LegendItem color="#ef4444" label="Panic" />
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{
  label: string;
  value: string;
  valueColor?: string;
}> = ({ label, value, valueColor = 'text-white' }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-400">{label}</span>
    <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
  </div>
);

const LegendItem: React.FC<{ color: string; label: string }> = ({
  color,
  label
}) => (
  <div className="flex items-center gap-2">
    <div
      className="w-4 h-4 rounded-full"
      style={{ backgroundColor: color }}
    />
    <span className="text-gray-300">{label}</span>
  </div>
);
