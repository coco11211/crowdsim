export interface Vector2D {
  x: number;
  y: number;
}

export interface Agent {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  target: Vector2D | null;
  path: Vector2D[];
  radius: number;
  maxSpeed: number;
  mass: number;
  color: string;
  state: AgentState;
  type: AgentType;
  stressLevel: number; // 0-1
  patience: number; // 0-1
  health: number; // 0-100
  trajectory: Vector2D[]; // Historical path
}

export type AgentState = 'idle' | 'moving' | 'panic' | 'stuck' | 'exited' | 'injured';

export type AgentType = 'adult' | 'child' | 'elderly' | 'disabled';

export interface Wall {
  id: string;
  start: Vector2D;
  end: Vector2D;
  type: 'wall' | 'door' | 'exit';
  width?: number;
  capacity?: number; // For doors/exits
}

export interface Obstacle {
  id: string;
  position: Vector2D;
  radius: number;
  type: 'circular' | 'rectangular';
  width?: number;
  height?: number;
}

export interface Exit {
  id: string;
  position: Vector2D;
  width: number;
  angle: number;
  capacity: number;
  flowRate: number;
}

export interface Environment {
  width: number;
  height: number;
  walls: Wall[];
  obstacles: Obstacle[];
  exits: Exit[];
  spawnZones: SpawnZone[];
}

export interface SpawnZone {
  id: string;
  position: Vector2D;
  width: number;
  height: number;
  agentCount: number;
  agentTypes: AgentType[];
}

export interface SimulationConfig {
  timeStep: number;
  maxAgents: number;
  panicThreshold: number;
  socialForceStrength: number;
  repulsionForceStrength: number;
  targetForceStrength: number;
  wallRepulsionStrength: number;
  visualizationMode: VisualizationMode;
}

export type VisualizationMode = 'agents' | 'density' | 'velocity' | 'stress' | 'trajectories';

export interface SimulationStats {
  time: number;
  totalAgents: number;
  exitedAgents: number;
  averageSpeed: number;
  averageStress: number;
  maxDensity: number;
  bottlenecks: Vector2D[];
  evacuationTime: number | null;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: ScenarioType;
  environment: Environment;
  initialAgents: number;
  duration: number;
  events: SimulationEvent[];
}

export type ScenarioType = 'evacuation' | 'festival' | 'panic' | 'custom';

export interface SimulationEvent {
  time: number;
  type: 'fire' | 'explosion' | 'announcement' | 'blockage' | 'panic_trigger';
  position?: Vector2D;
  radius?: number;
  severity?: number;
}

export interface Heatmap {
  width: number;
  height: number;
  cellSize: number;
  data: number[][];
  type: 'density' | 'velocity' | 'stress';
}
