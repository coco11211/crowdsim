import React, { useRef, useEffect, useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { Agent } from '../engine/Agent';
import { Wall, Exit, Obstacle, Vector2D } from '../types/simulation';

export const SimulationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    engine,
    isRunning,
    isPaused,
    speed,
    visualizationMode,
    showTrajectories,
    showHeatmap
  } = useSimulationStore();

  const [fps, setFps] = useState(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const fpsCounterRef = useRef({ frames: 0, lastTime: 0 });

  useEffect(() => {
    if (!canvasRef.current || !engine) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const render = (currentTime: number) => {
      if (!ctx || !engine) return;

      // Calculate delta time
      const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = currentTime;

      // Update FPS counter
      fpsCounterRef.current.frames++;
      if (currentTime - fpsCounterRef.current.lastTime >= 1000) {
        setFps(fpsCounterRef.current.frames);
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = currentTime;
      }

      // Update simulation
      if (isRunning && !isPaused && deltaTime > 0) {
        const timeStep = 0.016 * speed; // 60 FPS target
        engine.update(timeStep);
      }

      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate scale to fit environment
      const env = engine['environment'];
      const scaleX = (canvas.width - 40) / env.width;
      const scaleY = (canvas.height - 40) / env.height;
      const scale = Math.min(scaleX, scaleY);
      const offsetX = (canvas.width - env.width * scale) / 2;
      const offsetY = (canvas.height - env.height * scale) / 2;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // Render heatmap if enabled
      if (showHeatmap) {
        renderHeatmap(ctx, engine, visualizationMode);
      }

      // Render environment
      renderWalls(ctx, env.walls);
      renderObstacles(ctx, env.obstacles);
      renderExits(ctx, env.exits);

      // Render agents
      const agents = engine.getAgents();
      if (showTrajectories) {
        renderTrajectories(ctx, agents);
      }
      renderAgents(ctx, agents, visualizationMode);

      // Render bottlenecks
      const stats = engine.getStats();
      renderBottlenecks(ctx, stats.bottlenecks);

      ctx.restore();

      // Render UI overlay
      renderOverlay(ctx, canvas, stats, fps);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [engine, isRunning, isPaused, speed, visualizationMode, showTrajectories, showHeatmap]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-gray-900"
    />
  );
};

function renderWalls(ctx: CanvasRenderingContext2D, walls: Wall[]): void {
  walls.forEach(wall => {
    ctx.strokeStyle = wall.type === 'wall' ? '#4b5563' : '#10b981';
    ctx.lineWidth = wall.type === 'wall' ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(wall.start.x, wall.start.y);
    ctx.lineTo(wall.end.x, wall.end.y);
    ctx.stroke();
  });
}

function renderObstacles(ctx: CanvasRenderingContext2D, obstacles: Obstacle[]): void {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(obstacle.position.x, obstacle.position.y, obstacle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

function renderExits(ctx: CanvasRenderingContext2D, exits: Exit[]): void {
  exits.forEach(exit => {
    ctx.fillStyle = '#10b98180';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;

    // Draw exit rectangle
    const halfWidth = exit.width / 2;
    ctx.save();
    ctx.translate(exit.position.x, exit.position.y);
    ctx.rotate(exit.angle);
    ctx.fillRect(-halfWidth, -10, exit.width, 20);
    ctx.strokeRect(-halfWidth, -10, exit.width, 20);

    // Draw arrow
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(15, -8);
    ctx.lineTo(15, 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  });
}

function renderAgents(
  ctx: CanvasRenderingContext2D,
  agents: Agent[],
  mode: string
): void {
  agents.forEach(agent => {
    if (agent.state === 'exited') return;

    let color = agent.color;

    // Color based on visualization mode
    switch (mode) {
      case 'stress':
        color = getStressColor(agent.stressLevel);
        break;
      case 'velocity':
        const speed = Math.sqrt(agent.velocity.x ** 2 + agent.velocity.y ** 2);
        color = getVelocityColor(speed, agent.maxSpeed);
        break;
      case 'density':
        // Will be handled by heatmap
        break;
    }

    // Draw agent
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(agent.position.x, agent.position.y, agent.radius * 40, 0, Math.PI * 2);
    ctx.fill();

    // Draw direction indicator
    if (agent.velocity.x !== 0 || agent.velocity.y !== 0) {
      const angle = Math.atan2(agent.velocity.y, agent.velocity.x);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.1;
      ctx.beginPath();
      ctx.moveTo(agent.position.x, agent.position.y);
      ctx.lineTo(
        agent.position.x + Math.cos(angle) * agent.radius * 60,
        agent.position.y + Math.sin(angle) * agent.radius * 60
      );
      ctx.stroke();
    }

    // Highlight panic state
    if (agent.state === 'panic') {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 0.15;
      ctx.beginPath();
      ctx.arc(agent.position.x, agent.position.y, agent.radius * 45, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function renderTrajectories(ctx: CanvasRenderingContext2D, agents: Agent[]): void {
  agents.forEach(agent => {
    if (agent.trajectory.length < 2) return;

    ctx.strokeStyle = agent.color + '40';
    ctx.lineWidth = 0.1;
    ctx.beginPath();
    ctx.moveTo(agent.trajectory[0].x, agent.trajectory[0].y);

    for (let i = 1; i < agent.trajectory.length; i++) {
      ctx.lineTo(agent.trajectory[i].x, agent.trajectory[i].y);
    }

    ctx.stroke();
  });
}

function renderBottlenecks(ctx: CanvasRenderingContext2D, bottlenecks: Vector2D[]): void {
  bottlenecks.forEach(pos => {
    ctx.fillStyle = '#ef444440';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}

function renderHeatmap(
  ctx: CanvasRenderingContext2D,
  engine: any,
  mode: string
): void {
  const heatmapType = mode === 'agents' ? 'density' : mode;
  const heatmap = engine.getHeatmap(heatmapType);
  if (!heatmap) return;

  const maxValue = Math.max(...heatmap.data.flat(), 1);

  for (let y = 0; y < heatmap.height; y++) {
    for (let x = 0; x < heatmap.width; x++) {
      const value = heatmap.data[y][x];
      if (value > 0) {
        const normalized = value / maxValue;
        const color = getHeatmapColor(normalized);
        ctx.fillStyle = color;
        ctx.fillRect(
          x * heatmap.cellSize,
          y * heatmap.cellSize,
          heatmap.cellSize,
          heatmap.cellSize
        );
      }
    }
  }
}

function renderOverlay(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  stats: any,
  fps: number
): void {
  ctx.fillStyle = '#00000080';
  ctx.fillRect(10, 10, 200, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = '14px monospace';
  ctx.fillText(`FPS: ${fps}`, 20, 30);
  ctx.fillText(`Time: ${stats.time.toFixed(1)}s`, 20, 50);
  ctx.fillText(`Agents: ${stats.totalAgents - stats.exitedAgents}/${stats.totalAgents}`, 20, 70);
}

function getStressColor(stress: number): string {
  if (stress < 0.3) return '#10b981';
  if (stress < 0.6) return '#f59e0b';
  return '#ef4444';
}

function getVelocityColor(speed: number, maxSpeed: number): string {
  const normalized = speed / maxSpeed;
  if (normalized < 0.3) return '#3b82f6';
  if (normalized < 0.7) return '#10b981';
  return '#f59e0b';
}

function getHeatmapColor(value: number): string {
  // Blue -> Green -> Yellow -> Red
  if (value < 0.25) {
    const t = value / 0.25;
    return `rgba(59, 130, 246, ${t * 0.6})`;
  } else if (value < 0.5) {
    const t = (value - 0.25) / 0.25;
    return `rgba(16, 185, 129, ${0.3 + t * 0.4})`;
  } else if (value < 0.75) {
    const t = (value - 0.5) / 0.25;
    return `rgba(245, 158, 11, ${0.4 + t * 0.3})`;
  } else {
    const t = (value - 0.75) / 0.25;
    return `rgba(239, 68, 68, ${0.5 + t * 0.5})`;
  }
}
