import { Agent } from './Agent';
import { Pathfinding } from '../utils/pathfinding';
import { Vec2 } from '../utils/vector';
import {
  Environment,
  SimulationConfig,
  SimulationStats,
  Vector2D,
  AgentType,
  Heatmap,
  SimulationEvent
} from '../types/simulation';

export class SimulationEngine {
  private agents: Agent[] = [];
  private environment: Environment;
  private config: SimulationConfig;
  private pathfinding: Pathfinding;
  private time: number = 0;
  private stats: SimulationStats;
  private heatmaps: Map<string, Heatmap> = new Map();
  private events: SimulationEvent[] = [];

  constructor(environment: Environment, config: SimulationConfig) {
    this.environment = environment;
    this.config = config;
    this.pathfinding = new Pathfinding(environment.width, environment.height);
    this.pathfinding.updateObstacles(environment.walls, environment.obstacles);

    this.stats = {
      time: 0,
      totalAgents: 0,
      exitedAgents: 0,
      averageSpeed: 0,
      averageStress: 0,
      maxDensity: 0,
      bottlenecks: [],
      evacuationTime: null
    };

    this.initializeHeatmaps();
  }

  private initializeHeatmaps(): void {
    const cellSize = 20;
    const width = Math.ceil(this.environment.width / cellSize);
    const height = Math.ceil(this.environment.height / cellSize);

    ['density', 'velocity', 'stress'].forEach(type => {
      this.heatmaps.set(type, {
        width,
        height,
        cellSize,
        data: Array(height).fill(0).map(() => Array(width).fill(0)),
        type: type as 'density' | 'velocity' | 'stress'
      });
    });
  }

  spawnAgents(count: number, types?: AgentType[]): void {
    const spawnZones = this.environment.spawnZones;

    for (let i = 0; i < count; i++) {
      // Select spawn zone
      const zone = spawnZones[Math.floor(Math.random() * spawnZones.length)] || {
        position: { x: 50, y: 50 },
        width: this.environment.width - 100,
        height: this.environment.height - 100,
        agentCount: count,
        agentTypes: ['adult']
      };

      // Random position within zone
      const position = {
        x: zone.position.x + Math.random() * zone.width,
        y: zone.position.y + Math.random() * zone.height
      };

      // Select agent type
      const availableTypes = types || zone.agentTypes || ['adult'];
      const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];

      const agent = new Agent(`agent-${i}`, position, type);

      // Assign random exit as target
      if (this.environment.exits.length > 0) {
        const exit = this.environment.exits[
          Math.floor(Math.random() * this.environment.exits.length)
        ];
        const path = this.pathfinding.findPath(position, exit.position);
        agent.setPath(path);
      }

      this.agents.push(agent);
    }

    this.stats.totalAgents = this.agents.length;
  }

  addAgent(agent: Agent): void {
    this.agents.push(agent);
    this.stats.totalAgents = this.agents.length;
  }

  removeAgent(id: string): void {
    this.agents = this.agents.filter(a => a.id !== id);
  }

  getAgents(): Agent[] {
    return this.agents;
  }

  getStats(): SimulationStats {
    return { ...this.stats };
  }

  getHeatmap(type: 'density' | 'velocity' | 'stress'): Heatmap | undefined {
    return this.heatmaps.get(type);
  }

  addEvent(event: SimulationEvent): void {
    this.events.push(event);
    this.events.sort((a, b) => a.time - b.time);
  }

  update(dt: number): void {
    this.time += dt;
    this.stats.time = this.time;

    // Process events
    this.processEvents();

    // Update all agents
    const activeAgents = this.agents.filter(a => a.state !== 'exited');

    activeAgents.forEach(agent => {
      agent.update(
        dt,
        activeAgents,
        this.environment.walls,
        this.environment.obstacles,
        this.environment.exits
      );

      // Check if agent reached exit
      if (agent.checkExit(this.environment.exits)) {
        this.stats.exitedAgents++;
      }
    });

    // Update statistics
    this.updateStats(activeAgents);

    // Update heatmaps
    this.updateHeatmaps(activeAgents);

    // Check if evacuation complete
    if (activeAgents.length === 0 && this.stats.evacuationTime === null) {
      this.stats.evacuationTime = this.time;
    }
  }

  private processEvents(): void {
    while (this.events.length > 0 && this.events[0].time <= this.time) {
      const event = this.events.shift()!;
      this.handleEvent(event);
    }
  }

  private handleEvent(event: SimulationEvent): void {
    switch (event.type) {
      case 'panic_trigger':
        this.triggerPanic(event.position, event.radius || 100);
        break;
      case 'fire':
        this.triggerPanic(event.position, event.radius || 150);
        // Could add fire spreading logic
        break;
      case 'blockage':
        if (event.position) {
          this.addBlockage(event.position);
        }
        break;
      case 'explosion':
        this.triggerPanic(event.position, event.radius || 200);
        this.injureNearbyAgents(event.position, event.radius || 50, event.severity || 0.5);
        break;
    }
  }

  private triggerPanic(center: Vector2D | undefined, radius: number): void {
    if (!center) return;

    this.agents.forEach(agent => {
      const distance = Vec2.distance(agent.position, center);
      if (distance < radius) {
        agent.state = 'panic';
        agent.stressLevel = Math.min(1, agent.stressLevel + 0.5);
      }
    });
  }

  private addBlockage(position: Vector2D): void {
    // Add obstacle at position
    this.environment.obstacles.push({
      id: `blockage-${Date.now()}`,
      position,
      radius: 20,
      type: 'circular'
    });

    // Update pathfinding
    this.pathfinding.updateObstacles(this.environment.walls, this.environment.obstacles);

    // Recalculate paths for all agents
    this.agents.forEach(agent => {
      if (agent.target && this.environment.exits.length > 0) {
        const exit = this.environment.exits[
          Math.floor(Math.random() * this.environment.exits.length)
        ];
        const path = this.pathfinding.findPath(agent.position, exit.position);
        agent.setPath(path);
      }
    });
  }

  private injureNearbyAgents(center: Vector2D | undefined, radius: number, severity: number): void {
    if (!center) return;

    this.agents.forEach(agent => {
      const distance = Vec2.distance(agent.position, center);
      if (distance < radius) {
        const damage = severity * (1 - distance / radius) * 100;
        agent.health -= damage;
        if (agent.health <= 0) {
          agent.state = 'injured';
          agent.health = 0;
        }
      }
    });
  }

  private updateStats(activeAgents: Agent[]): void {
    if (activeAgents.length === 0) {
      this.stats.averageSpeed = 0;
      this.stats.averageStress = 0;
      return;
    }

    let totalSpeed = 0;
    let totalStress = 0;

    activeAgents.forEach(agent => {
      totalSpeed += Vec2.magnitude(agent.velocity);
      totalStress += agent.stressLevel;
    });

    this.stats.averageSpeed = totalSpeed / activeAgents.length;
    this.stats.averageStress = totalStress / activeAgents.length;

    // Find bottlenecks (areas with high density and low velocity)
    this.stats.bottlenecks = this.findBottlenecks(activeAgents);
  }

  private findBottlenecks(agents: Agent[]): Vector2D[] {
    const bottlenecks: Vector2D[] = [];
    const gridSize = 50;
    const densityThreshold = 5;
    const velocityThreshold = 0.3;

    // Create grid
    const grid = new Map<string, { agents: Agent[]; avgVelocity: number }>();

    agents.forEach(agent => {
      const key = `${Math.floor(agent.position.x / gridSize)},${Math.floor(agent.position.y / gridSize)}`;
      if (!grid.has(key)) {
        grid.set(key, { agents: [], avgVelocity: 0 });
      }
      grid.get(key)!.agents.push(agent);
    });

    // Find high density, low velocity areas
    grid.forEach((cell, key) => {
      if (cell.agents.length >= densityThreshold) {
        const avgVel = cell.agents.reduce((sum, a) => sum + Vec2.magnitude(a.velocity), 0) / cell.agents.length;
        cell.avgVelocity = avgVel;

        if (avgVel < velocityThreshold) {
          const [x, y] = key.split(',').map(Number);
          bottlenecks.push({ x: x * gridSize, y: y * gridSize });
        }
      }
    });

    return bottlenecks;
  }

  private updateHeatmaps(agents: Agent[]): void {
    // Clear heatmaps
    this.heatmaps.forEach(heatmap => {
      heatmap.data = heatmap.data.map(row => row.map(() => 0));
    });

    const densityMap = this.heatmaps.get('density')!;
    const velocityMap = this.heatmaps.get('velocity')!;
    const stressMap = this.heatmaps.get('stress')!;

    agents.forEach(agent => {
      const gridX = Math.floor(agent.position.x / densityMap.cellSize);
      const gridY = Math.floor(agent.position.y / densityMap.cellSize);

      if (gridX >= 0 && gridX < densityMap.width && gridY >= 0 && gridY < densityMap.height) {
        // Density
        densityMap.data[gridY][gridX]++;

        // Velocity
        const speed = Vec2.magnitude(agent.velocity);
        velocityMap.data[gridY][gridX] = Math.max(
          velocityMap.data[gridY][gridX],
          speed
        );

        // Stress
        stressMap.data[gridY][gridX] = Math.max(
          stressMap.data[gridY][gridX],
          agent.stressLevel
        );
      }
    });

    // Update max density stat
    this.stats.maxDensity = Math.max(
      ...densityMap.data.flat()
    );
  }

  reset(): void {
    this.agents = [];
    this.time = 0;
    this.events = [];
    this.stats = {
      time: 0,
      totalAgents: 0,
      exitedAgents: 0,
      averageSpeed: 0,
      averageStress: 0,
      maxDensity: 0,
      bottlenecks: [],
      evacuationTime: null
    };
    this.initializeHeatmaps();
  }

  updateEnvironment(environment: Environment): void {
    this.environment = environment;
    this.pathfinding = new Pathfinding(environment.width, environment.height);
    this.pathfinding.updateObstacles(environment.walls, environment.obstacles);
  }

  exportData(): any {
    return {
      stats: this.stats,
      agents: this.agents.map(a => ({
        id: a.id,
        type: a.type,
        state: a.state,
        trajectory: a.trajectory,
        stressLevel: a.stressLevel,
        health: a.health
      })),
      time: this.time,
      environment: this.environment
    };
  }
}
