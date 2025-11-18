import { create } from 'zustand';
import { SimulationEngine } from '../engine/SimulationEngine';
import { scenarios } from '../scenarios/presets';
import { SimulationConfig, VisualizationMode, Scenario, Environment } from '../types/simulation';

interface SimulationState {
  engine: SimulationEngine | null;
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  currentScenario: Scenario | null;
  visualizationMode: VisualizationMode;
  showTrajectories: boolean;
  showHeatmap: boolean;
  darkMode: boolean;
  editMode: boolean;

  // Actions
  initializeSimulation: (scenarioId: string) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setSpeed: (speed: number) => void;
  setVisualizationMode: (mode: VisualizationMode) => void;
  toggleTrajectories: () => void;
  toggleHeatmap: () => void;
  toggleDarkMode: () => void;
  toggleEditMode: () => void;
  updateEnvironment: (environment: Environment) => void;
}

const defaultConfig: SimulationConfig = {
  timeStep: 0.1,
  maxAgents: 1000,
  panicThreshold: 0.7,
  socialForceStrength: 2000,
  repulsionForceStrength: 2000,
  targetForceStrength: 1,
  wallRepulsionStrength: 2000,
  visualizationMode: 'agents'
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  engine: null,
  isRunning: false,
  isPaused: false,
  speed: 1,
  currentScenario: null,
  visualizationMode: 'agents',
  showTrajectories: false,
  showHeatmap: false,
  darkMode: true,
  editMode: false,

  initializeSimulation: (scenarioId: string) => {
    const scenario = scenarios[scenarioId];
    if (!scenario) return;

    const engine = new SimulationEngine(scenario.environment, defaultConfig);
    engine.spawnAgents(scenario.initialAgents);

    // Add scenario events
    scenario.events.forEach(event => {
      engine.addEvent(event);
    });

    set({
      engine,
      currentScenario: scenario,
      isRunning: false,
      isPaused: false
    });
  },

  startSimulation: () => {
    set({ isRunning: true, isPaused: false });
  },

  pauseSimulation: () => {
    const { isPaused } = get();
    set({ isPaused: !isPaused });
  },

  resetSimulation: () => {
    const { currentScenario } = get();
    if (currentScenario) {
      get().initializeSimulation(currentScenario.id);
    }
  },

  setSpeed: (speed: number) => {
    set({ speed });
  },

  setVisualizationMode: (mode: VisualizationMode) => {
    set({ visualizationMode: mode });
  },

  toggleTrajectories: () => {
    set(state => ({ showTrajectories: !state.showTrajectories }));
  },

  toggleHeatmap: () => {
    set(state => ({ showHeatmap: !state.showHeatmap }));
  },

  toggleDarkMode: () => {
    set(state => {
      const newDarkMode = !state.darkMode;
      // Update document class
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: newDarkMode };
    });
  },

  toggleEditMode: () => {
    set(state => ({ editMode: !state.editMode }));
  },

  updateEnvironment: (environment: Environment) => {
    const { engine } = get();
    if (engine) {
      engine.updateEnvironment(environment);
    }
  }
}));
