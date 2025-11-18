import { Vector2D, Wall, Obstacle } from '../types/simulation';
import { Vec2 } from './vector';

interface Node {
  position: Vector2D;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // Total cost
  parent: Node | null;
}

export class Pathfinding {
  private gridSize: number;
  private width: number;
  private height: number;
  private obstacles: Set<string>;

  constructor(width: number, height: number, gridSize: number = 20) {
    this.width = width;
    this.height = height;
    this.gridSize = gridSize;
    this.obstacles = new Set();
  }

  updateObstacles(walls: Wall[], obstacles: Obstacle[]): void {
    this.obstacles.clear();

    // Mark walls as obstacles
    walls.forEach(wall => {
      if (wall.type === 'wall') {
        this.markLineAsObstacle(wall.start, wall.end);
      }
    });

    // Mark obstacles
    obstacles.forEach(obstacle => {
      this.markAreaAsObstacle(obstacle.position, obstacle.radius);
    });
  }

  private markLineAsObstacle(start: Vector2D, end: Vector2D): void {
    const dist = Vec2.distance(start, end);
    const steps = Math.ceil(dist / (this.gridSize / 2));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point = Vec2.lerp(start, end, t);
      const key = this.getGridKey(point);
      this.obstacles.add(key);
    }
  }

  private markAreaAsObstacle(center: Vector2D, radius: number): void {
    const gridRadius = Math.ceil(radius / this.gridSize);
    const cx = Math.floor(center.x / this.gridSize);
    const cy = Math.floor(center.y / this.gridSize);

    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      for (let dy = -gridRadius; dy <= gridRadius; dy++) {
        const x = (cx + dx) * this.gridSize;
        const y = (cy + dy) * this.gridSize;
        if (Vec2.distance(center, { x, y }) <= radius) {
          this.obstacles.add(this.getGridKey({ x, y }));
        }
      }
    }
  }

  private getGridKey(pos: Vector2D): string {
    const x = Math.floor(pos.x / this.gridSize);
    const y = Math.floor(pos.y / this.gridSize);
    return `${x},${y}`;
  }

  private getGridPos(pos: Vector2D): Vector2D {
    return {
      x: Math.floor(pos.x / this.gridSize) * this.gridSize + this.gridSize / 2,
      y: Math.floor(pos.y / this.gridSize) * this.gridSize + this.gridSize / 2
    };
  }

  findPath(start: Vector2D, goal: Vector2D): Vector2D[] {
    const startNode: Node = {
      position: this.getGridPos(start),
      g: 0,
      h: Vec2.distance(start, goal),
      f: 0,
      parent: null
    };
    startNode.f = startNode.g + startNode.h;

    const openSet: Node[] = [startNode];
    const closedSet = new Set<string>();
    const gScores = new Map<string, number>();
    gScores.set(this.getGridKey(startNode.position), 0);

    while (openSet.length > 0) {
      // Get node with lowest f score
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      const currentKey = this.getGridKey(current.position);

      // Check if we reached the goal
      if (Vec2.distance(current.position, goal) < this.gridSize) {
        return this.reconstructPath(current);
      }

      closedSet.add(currentKey);

      // Check neighbors
      const neighbors = this.getNeighbors(current.position);

      for (const neighborPos of neighbors) {
        const neighborKey = this.getGridKey(neighborPos);

        if (closedSet.has(neighborKey) || this.obstacles.has(neighborKey)) {
          continue;
        }

        const tentativeG = current.g + Vec2.distance(current.position, neighborPos);

        const existingG = gScores.get(neighborKey);
        if (existingG !== undefined && tentativeG >= existingG) {
          continue;
        }

        const neighbor: Node = {
          position: neighborPos,
          g: tentativeG,
          h: Vec2.distance(neighborPos, goal),
          f: 0,
          parent: current
        };
        neighbor.f = neighbor.g + neighbor.h;

        gScores.set(neighborKey, tentativeG);

        const existingIndex = openSet.findIndex(n =>
          this.getGridKey(n.position) === neighborKey
        );

        if (existingIndex === -1) {
          openSet.push(neighbor);
        } else if (tentativeG < openSet[existingIndex].g) {
          openSet[existingIndex] = neighbor;
        }
      }
    }

    // No path found, return direct line
    return [goal];
  }

  private getNeighbors(pos: Vector2D): Vector2D[] {
    const neighbors: Vector2D[] = [];
    const offsets = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
      { x: 1, y: 1 }, { x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 }
    ];

    for (const offset of offsets) {
      const neighbor = {
        x: pos.x + offset.x * this.gridSize,
        y: pos.y + offset.y * this.gridSize
      };

      if (neighbor.x >= 0 && neighbor.x < this.width &&
          neighbor.y >= 0 && neighbor.y < this.height) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  private reconstructPath(node: Node): Vector2D[] {
    const path: Vector2D[] = [];
    let current: Node | null = node;

    while (current !== null) {
      path.unshift(current.position);
      current = current.parent;
    }

    // Simplify path by removing unnecessary waypoints
    return this.smoothPath(path);
  }

  private smoothPath(path: Vector2D[]): Vector2D[] {
    if (path.length <= 2) return path;

    const smoothed: Vector2D[] = [path[0]];
    let current = 0;

    while (current < path.length - 1) {
      let farthest = current + 1;

      for (let i = current + 2; i < path.length; i++) {
        if (this.hasLineOfSight(path[current], path[i])) {
          farthest = i;
        } else {
          break;
        }
      }

      smoothed.push(path[farthest]);
      current = farthest;
    }

    return smoothed;
  }

  private hasLineOfSight(start: Vector2D, end: Vector2D): boolean {
    const dist = Vec2.distance(start, end);
    const steps = Math.ceil(dist / (this.gridSize / 4));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point = Vec2.lerp(start, end, t);
      if (this.obstacles.has(this.getGridKey(point))) {
        return false;
      }
    }

    return true;
  }
}
