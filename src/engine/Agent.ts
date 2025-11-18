import { Agent as IAgent, AgentType, AgentState, Vector2D, Wall, Obstacle, Exit } from '../types/simulation';
import { Vec2 } from '../utils/vector';

export class Agent implements IAgent {
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
  stressLevel: number;
  patience: number;
  health: number;
  trajectory: Vector2D[];

  private desiredSpeed: number;
  private relaxationTime: number;
  private perceptionRadius: number;

  constructor(id: string, position: Vector2D, type: AgentType = 'adult') {
    this.id = id;
    this.position = position;
    this.velocity = Vec2.zero();
    this.target = null;
    this.path = [];
    this.type = type;
    this.state = 'idle';
    this.stressLevel = 0;
    this.patience = 0.5 + Math.random() * 0.5;
    this.health = 100;
    this.trajectory = [Vec2.clone(position)];

    // Type-specific properties
    switch (type) {
      case 'child':
        this.radius = 0.2;
        this.mass = 30;
        this.maxSpeed = 1.2;
        this.desiredSpeed = 1.0;
        this.color = '#fbbf24';
        break;
      case 'elderly':
        this.radius = 0.25;
        this.mass = 65;
        this.maxSpeed = 0.8;
        this.desiredSpeed = 0.6;
        this.color = '#a78bfa';
        break;
      case 'disabled':
        this.radius = 0.3;
        this.mass = 70;
        this.maxSpeed = 0.5;
        this.desiredSpeed = 0.4;
        this.color = '#fb923c';
        break;
      default: // adult
        this.radius = 0.25;
        this.mass = 70;
        this.maxSpeed = 1.6;
        this.desiredSpeed = 1.3;
        this.color = '#3b82f6';
    }

    this.relaxationTime = 0.5;
    this.perceptionRadius = 5;
  }

  setTarget(target: Vector2D): void {
    this.target = target;
    this.state = 'moving';
  }

  setPath(path: Vector2D[]): void {
    this.path = path;
    if (path.length > 0) {
      this.target = path[0];
      this.state = 'moving';
    }
  }

  calculateForce(
    agents: Agent[],
    walls: Wall[],
    obstacles: Obstacle[],
    exits: Exit[],
    dt: number
  ): Vector2D {
    let totalForce = Vec2.zero();

    // Target force (desire to reach destination)
    const targetForce = this.calculateTargetForce();
    totalForce = Vec2.add(totalForce, targetForce);

    // Social force (repulsion from other agents)
    const socialForce = this.calculateSocialForce(agents);
    totalForce = Vec2.add(totalForce, socialForce);

    // Wall repulsion force
    const wallForce = this.calculateWallForce(walls);
    totalForce = Vec2.add(totalForce, wallForce);

    // Obstacle repulsion force
    const obstacleForce = this.calculateObstacleForce(obstacles);
    totalForce = Vec2.add(totalForce, obstacleForce);

    // Panic behavior modifications
    if (this.state === 'panic') {
      totalForce = Vec2.multiply(totalForce, 1.5); // Stronger forces
      this.maxSpeed = this.desiredSpeed * 1.4; // Faster movement
    }

    return totalForce;
  }

  private calculateTargetForce(): Vector2D {
    if (!this.target) return Vec2.zero();

    const direction = Vec2.subtract(this.target, this.position);
    const distance = Vec2.magnitude(direction);

    if (distance < 0.5) {
      // Reached waypoint, move to next
      if (this.path.length > 1) {
        this.path.shift();
        this.target = this.path[0];
      } else {
        this.target = null;
        this.state = 'idle';
        return Vec2.zero();
      }
    }

    const desiredVelocity = Vec2.multiply(
      Vec2.normalize(direction),
      this.desiredSpeed * (this.state === 'panic' ? 1.3 : 1)
    );

    const force = Vec2.divide(
      Vec2.subtract(desiredVelocity, this.velocity),
      this.relaxationTime
    );

    return Vec2.multiply(force, this.mass);
  }

  private calculateSocialForce(agents: Agent[]): Vector2D {
    let totalForce = Vec2.zero();

    for (const other of agents) {
      if (other.id === this.id) continue;

      const diff = Vec2.subtract(this.position, other.position);
      const distance = Vec2.magnitude(diff);
      const minDist = this.radius + other.radius;

      if (distance < this.perceptionRadius) {
        // Social force parameters
        const A = 2000; // Strength
        const B = 0.08; // Range

        const forceMagnitude = A * Math.exp((minDist - distance) / B);
        const direction = distance > 0 ? Vec2.normalize(diff) : Vec2.randomUnit();

        let force = Vec2.multiply(direction, forceMagnitude);

        // Physical contact
        if (distance < minDist) {
          const overlap = minDist - distance;
          const bodyForce = 120000 * overlap;
          force = Vec2.add(force, Vec2.multiply(direction, bodyForce));

          // Friction force
          const tangent = Vec2.perpendicular(direction);
          const relativeVelocity = Vec2.subtract(this.velocity, other.velocity);
          const tangentSpeed = Vec2.dot(relativeVelocity, tangent);
          const frictionForce = Vec2.multiply(tangent, -240000 * overlap * tangentSpeed);
          force = Vec2.add(force, frictionForce);

          // Increase stress from physical contact
          this.stressLevel = Math.min(1, this.stressLevel + 0.001);
        }

        totalForce = Vec2.add(totalForce, force);
      }
    }

    return totalForce;
  }

  private calculateWallForce(walls: Wall[]): Vector2D {
    let totalForce = Vec2.zero();

    for (const wall of walls) {
      if (wall.type !== 'wall') continue;

      const { point, distance } = this.closestPointOnSegment(
        this.position,
        wall.start,
        wall.end
      );

      if (distance < this.perceptionRadius) {
        const A = 2000;
        const B = 0.08;

        const forceMagnitude = A * Math.exp((this.radius - distance) / B);
        const direction = Vec2.normalize(Vec2.subtract(this.position, point));

        let force = Vec2.multiply(direction, forceMagnitude);

        // Physical contact with wall
        if (distance < this.radius) {
          const overlap = this.radius - distance;
          const bodyForce = 120000 * overlap;
          force = Vec2.add(force, Vec2.multiply(direction, bodyForce));
        }

        totalForce = Vec2.add(totalForce, force);
      }
    }

    return totalForce;
  }

  private calculateObstacleForce(obstacles: Obstacle[]): Vector2D {
    let totalForce = Vec2.zero();

    for (const obstacle of obstacles) {
      const diff = Vec2.subtract(this.position, obstacle.position);
      const distance = Vec2.magnitude(diff);
      const minDist = this.radius + obstacle.radius;

      if (distance < this.perceptionRadius) {
        const A = 2000;
        const B = 0.08;

        const forceMagnitude = A * Math.exp((minDist - distance) / B);
        const direction = distance > 0 ? Vec2.normalize(diff) : Vec2.randomUnit();

        let force = Vec2.multiply(direction, forceMagnitude);

        if (distance < minDist) {
          const overlap = minDist - distance;
          const bodyForce = 120000 * overlap;
          force = Vec2.add(force, Vec2.multiply(direction, bodyForce));
        }

        totalForce = Vec2.add(totalForce, force);
      }
    }

    return totalForce;
  }

  private closestPointOnSegment(
    point: Vector2D,
    lineStart: Vector2D,
    lineEnd: Vector2D
  ): { point: Vector2D; distance: number } {
    const line = Vec2.subtract(lineEnd, lineStart);
    const lineLength = Vec2.magnitude(line);

    if (lineLength === 0) {
      return {
        point: lineStart,
        distance: Vec2.distance(point, lineStart)
      };
    }

    const toPoint = Vec2.subtract(point, lineStart);
    const t = Math.max(0, Math.min(1, Vec2.dot(toPoint, line) / (lineLength * lineLength)));

    const closestPoint = Vec2.add(lineStart, Vec2.multiply(line, t));
    const distance = Vec2.distance(point, closestPoint);

    return { point: closestPoint, distance };
  }

  update(
    dt: number,
    agents: Agent[],
    walls: Wall[],
    obstacles: Obstacle[],
    exits: Exit[]
  ): void {
    if (this.state === 'exited' || this.state === 'injured') return;

    // Calculate forces
    const force = this.calculateForce(agents, walls, obstacles, exits, dt);

    // Update velocity
    const acceleration = Vec2.divide(force, this.mass);
    this.velocity = Vec2.add(this.velocity, Vec2.multiply(acceleration, dt));

    // Limit velocity
    const speed = Vec2.magnitude(this.velocity);
    if (speed > this.maxSpeed) {
      this.velocity = Vec2.multiply(Vec2.normalize(this.velocity), this.maxSpeed);
    }

    // Update position
    this.position = Vec2.add(this.position, Vec2.multiply(this.velocity, dt));

    // Update trajectory (sample every 10 frames for performance)
    if (Math.random() < 0.1) {
      this.trajectory.push(Vec2.clone(this.position));
      if (this.trajectory.length > 100) {
        this.trajectory.shift();
      }
    }

    // Update stress based on density and velocity
    const nearbyAgents = agents.filter(a =>
      a.id !== this.id && Vec2.distance(a.position, this.position) < 2
    ).length;

    const densityStress = Math.min(1, nearbyAgents / 10);
    const velocityStress = speed < this.desiredSpeed * 0.3 ? 0.3 : 0;

    this.stressLevel = Math.max(0, Math.min(1,
      this.stressLevel * 0.99 + (densityStress + velocityStress) * 0.01
    ));

    // Trigger panic if stress is too high
    if (this.stressLevel > 0.7 && Math.random() < 0.01) {
      this.state = 'panic';
    }

    // Recover from panic
    if (this.state === 'panic' && this.stressLevel < 0.4) {
      this.state = 'moving';
    }

    // Check if stuck
    if (speed < 0.1 && this.target !== null) {
      if (this.state !== 'stuck') {
        this.state = 'stuck';
      }
    } else if (this.state === 'stuck' && speed > 0.2) {
      this.state = 'moving';
    }
  }

  checkExit(exits: Exit[]): boolean {
    for (const exit of exits) {
      const distance = Vec2.distance(this.position, exit.position);
      if (distance < exit.width / 2) {
        this.state = 'exited';
        return true;
      }
    }
    return false;
  }
}
