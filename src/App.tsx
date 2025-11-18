import React, { useEffect } from 'react';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlPanel } from './components/ControlPanel';
import { Sidebar } from './components/Sidebar';
import { useSimulationStore } from './store/simulationStore';

function App() {
  const { initializeSimulation, darkMode } = useSimulationStore();

  useEffect(() => {
    // Initialize with first scenario on mount
    initializeSimulation('evacuation_building');

    // Set dark mode on mount
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Top Control Bar */}
      <ControlPanel />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <SimulationCanvas />
        </div>
      </div>
    </div>
  );
}

export default App;
