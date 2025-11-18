import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Eye,
  Map,
  Download,
  Flame,
  AlertTriangle,
  Users
} from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';

export const ControlPanel: React.FC = () => {
  const {
    isRunning,
    isPaused,
    speed,
    visualizationMode,
    showTrajectories,
    showHeatmap,
    engine,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSpeed,
    setVisualizationMode,
    toggleTrajectories,
    toggleHeatmap
  } = useSimulationStore();

  const handleExport = () => {
    if (!engine) return;

    const data = engine.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = engine?.getStats();

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between max-w-full">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={isRunning ? pauseSimulation : startSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            title={isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
          >
            {isRunning && !isPaused ? (
              <>
                <Pause size={18} />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span className="hidden sm:inline">Start</span>
              </>
            )}
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-2 ml-4">
            <Gauge size={18} className="text-gray-400" />
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
              <option value={10}>10x</option>
            </select>
          </div>
        </div>

        {/* Visualization Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-gray-400" />
            <select
              value={visualizationMode}
              onChange={(e) => setVisualizationMode(e.target.value as any)}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="agents">Agents</option>
              <option value="density">Density</option>
              <option value="velocity">Velocity</option>
              <option value="stress">Stress</option>
            </select>
          </div>

          <button
            onClick={toggleTrajectories}
            className={`p-2 rounded-lg transition-colors ${
              showTrajectories
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Toggle Trajectories"
          >
            <Map size={18} />
          </button>

          <button
            onClick={toggleHeatmap}
            className={`p-2 rounded-lg transition-colors ${
              showHeatmap
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Toggle Heatmap"
          >
            <Flame size={18} />
          </button>

          <button
            onClick={handleExport}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Export Data"
          >
            <Download size={18} />
          </button>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary-400" />
              <span className="text-gray-300">
                {stats.totalAgents - stats.exitedAgents}/{stats.totalAgents}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-400" />
              <span className="text-gray-300">
                Stress: {(stats.averageStress * 100).toFixed(0)}%
              </span>
            </div>

            <div className="text-gray-300">
              Time: {stats.time.toFixed(1)}s
            </div>

            {stats.evacuationTime && (
              <div className="text-green-400 font-semibold">
                ✓ Evacuated in {stats.evacuationTime.toFixed(1)}s
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
