import { Scenario, Environment } from '../types/simulation';

export const scenarios: Record<string, Scenario> = {
  evacuation_building: {
    id: 'evacuation_building',
    name: 'Office Building Evacuation',
    description: 'Simulate evacuation of a multi-room office building during a fire alarm',
    type: 'evacuation',
    initialAgents: 150,
    duration: 300,
    events: [
      {
        time: 5,
        type: 'fire',
        position: { x: 300, y: 200 },
        radius: 150,
        severity: 0.8
      }
    ],
    environment: {
      width: 1200,
      height: 800,
      walls: [
        // Outer walls
        { id: 'w1', start: { x: 50, y: 50 }, end: { x: 1150, y: 50 }, type: 'wall' },
        { id: 'w2', start: { x: 1150, y: 50 }, end: { x: 1150, y: 750 }, type: 'wall' },
        { id: 'w3', start: { x: 1150, y: 750 }, end: { x: 50, y: 750 }, type: 'wall' },
        { id: 'w4', start: { x: 50, y: 750 }, end: { x: 50, y: 50 }, type: 'wall' },

        // Interior walls - horizontal
        { id: 'w5', start: { x: 50, y: 300 }, end: { x: 350, y: 300 }, type: 'wall' },
        { id: 'w6', start: { x: 450, y: 300 }, end: { x: 750, y: 300 }, type: 'wall' },
        { id: 'w7', start: { x: 850, y: 300 }, end: { x: 1150, y: 300 }, type: 'wall' },

        { id: 'w8', start: { x: 50, y: 500 }, end: { x: 350, y: 500 }, type: 'wall' },
        { id: 'w9', start: { x: 450, y: 500 }, end: { x: 750, y: 500 }, type: 'wall' },
        { id: 'w10', start: { x: 850, y: 500 }, end: { x: 1150, y: 500 }, type: 'wall' },

        // Interior walls - vertical
        { id: 'w11', start: { x: 400, y: 50 }, end: { x: 400, y: 250 }, type: 'wall' },
        { id: 'w12', start: { x: 400, y: 350 }, end: { x: 400, y: 450 }, type: 'wall' },
        { id: 'w13', start: { x: 400, y: 550 }, end: { x: 400, y: 750 }, type: 'wall' },

        { id: 'w14', start: { x: 800, y: 50 }, end: { x: 800, y: 250 }, type: 'wall' },
        { id: 'w15', start: { x: 800, y: 350 }, end: { x: 800, y: 450 }, type: 'wall' },
        { id: 'w16', start: { x: 800, y: 550 }, end: { x: 800, y: 750 }, type: 'wall' },
      ],
      obstacles: [
        { id: 'o1', position: { x: 150, y: 150 }, radius: 30, type: 'circular' },
        { id: 'o2', position: { x: 250, y: 400 }, radius: 25, type: 'circular' },
        { id: 'o3', position: { x: 550, y: 150 }, radius: 30, type: 'circular' },
        { id: 'o4', position: { x: 950, y: 400 }, radius: 25, type: 'circular' },
      ],
      exits: [
        { id: 'exit1', position: { x: 50, y: 400 }, width: 80, angle: Math.PI, capacity: 100, flowRate: 2 },
        { id: 'exit2', position: { x: 1150, y: 400 }, width: 80, angle: 0, capacity: 100, flowRate: 2 },
        { id: 'exit3', position: { x: 600, y: 750 }, width: 100, angle: Math.PI / 2, capacity: 150, flowRate: 2.5 },
      ],
      spawnZones: [
        { id: 'sz1', position: { x: 70, y: 70 }, width: 250, height: 200, agentCount: 40, agentTypes: ['adult', 'elderly'] },
        { id: 'sz2', position: { x: 420, y: 70 }, width: 300, height: 200, agentCount: 45, agentTypes: ['adult'] },
        { id: 'sz3', position: { x: 820, y: 70 }, width: 300, height: 200, agentCount: 35, agentTypes: ['adult', 'child'] },
        { id: 'sz4', position: { x: 70, y: 320 }, width: 250, height: 150, agentCount: 30, agentTypes: ['adult', 'disabled'] },
      ]
    }
  },

  festival_crowd: {
    id: 'festival_crowd',
    name: 'Music Festival',
    description: 'Large crowd at outdoor music festival with stage and multiple entry/exit points',
    type: 'festival',
    initialAgents: 300,
    duration: 600,
    events: [],
    environment: {
      width: 1400,
      height: 900,
      walls: [
        // Outer perimeter
        { id: 'w1', start: { x: 50, y: 50 }, end: { x: 1350, y: 50 }, type: 'wall' },
        { id: 'w2', start: { x: 1350, y: 50 }, end: { x: 1350, y: 850 }, type: 'wall' },
        { id: 'w3', start: { x: 1350, y: 850 }, end: { x: 50, y: 850 }, type: 'wall' },
        { id: 'w4', start: { x: 50, y: 850 }, end: { x: 50, y: 50 }, type: 'wall' },

        // Stage barriers
        { id: 'w5', start: { x: 500, y: 100 }, end: { x: 900, y: 100 }, type: 'wall' },
        { id: 'w6', start: { x: 500, y: 100 }, end: { x: 500, y: 250 }, type: 'wall' },
        { id: 'w7', start: { x: 900, y: 100 }, end: { x: 900, y: 250 }, type: 'wall' },

        // Crowd barriers
        { id: 'w8', start: { x: 300, y: 350 }, end: { x: 600, y: 350 }, type: 'wall' },
        { id: 'w9', start: { x: 800, y: 350 }, end: { x: 1100, y: 350 }, type: 'wall' },
      ],
      obstacles: [
        // Stage equipment
        { id: 'o1', position: { x: 700, y: 150 }, radius: 40, type: 'circular' },
        // Food stalls
        { id: 'o2', position: { x: 150, y: 500 }, radius: 35, type: 'circular' },
        { id: 'o3', position: { x: 150, y: 650 }, radius: 35, type: 'circular' },
        { id: 'o4', position: { x: 1250, y: 500 }, radius: 35, type: 'circular' },
        { id: 'o5', position: { x: 1250, y: 650 }, radius: 35, type: 'circular' },
      ],
      exits: [
        { id: 'exit1', position: { x: 50, y: 450 }, width: 120, angle: Math.PI, capacity: 200, flowRate: 3 },
        { id: 'exit2', position: { x: 1350, y: 450 }, width: 120, angle: 0, capacity: 200, flowRate: 3 },
        { id: 'exit3', position: { x: 700, y: 850 }, width: 150, angle: Math.PI / 2, capacity: 250, flowRate: 3.5 },
      ],
      spawnZones: [
        { id: 'sz1', position: { x: 100, y: 300 }, width: 1200, height: 500, agentCount: 300, agentTypes: ['adult', 'child', 'elderly'] },
      ]
    }
  },

  panic_scenario: {
    id: 'panic_scenario',
    name: 'Stampede Scenario',
    description: 'Panic-induced stampede in a crowded corridor with limited exits',
    type: 'panic',
    initialAgents: 200,
    duration: 180,
    events: [
      {
        time: 10,
        type: 'panic_trigger',
        position: { x: 300, y: 400 },
        radius: 200,
        severity: 1.0
      }
    ],
    environment: {
      width: 1000,
      height: 600,
      walls: [
        // Main corridor
        { id: 'w1', start: { x: 100, y: 200 }, end: { x: 900, y: 200 }, type: 'wall' },
        { id: 'w2', start: { x: 100, y: 400 }, end: { x: 900, y: 400 }, type: 'wall' },

        // Side walls
        { id: 'w3', start: { x: 100, y: 200 }, end: { x: 100, y: 400 }, type: 'wall' },
        { id: 'w4', start: { x: 900, y: 200 }, end: { x: 900, y: 250 }, type: 'wall' },
        { id: 'w5', start: { x: 900, y: 350 }, end: { x: 900, y: 400 }, type: 'wall' },

        // Bottleneck walls
        { id: 'w6', start: { x: 500, y: 200 }, end: { x: 500, y: 270 }, type: 'wall' },
        { id: 'w7', start: { x: 500, y: 330 }, end: { x: 500, y: 400 }, type: 'wall' },
      ],
      obstacles: [
        { id: 'o1', position: { x: 250, y: 300 }, radius: 20, type: 'circular' },
        { id: 'o2', position: { x: 750, y: 300 }, radius: 20, type: 'circular' },
      ],
      exits: [
        { id: 'exit1', position: { x: 900, y: 300 }, width: 80, angle: 0, capacity: 100, flowRate: 1.5 },
      ],
      spawnZones: [
        { id: 'sz1', position: { x: 120, y: 220 }, width: 350, height: 160, agentCount: 200, agentTypes: ['adult', 'child', 'elderly'] },
      ]
    }
  },

  stadium_evacuation: {
    id: 'stadium_evacuation',
    name: 'Stadium Emergency Exit',
    description: 'Emergency evacuation of stadium seating area with multiple exit routes',
    type: 'evacuation',
    initialAgents: 250,
    duration: 400,
    events: [
      {
        time: 3,
        type: 'announcement',
        position: { x: 600, y: 400 },
        radius: 1000,
      },
      {
        time: 20,
        type: 'panic_trigger',
        position: { x: 600, y: 300 },
        radius: 150,
        severity: 0.6
      }
    ],
    environment: {
      width: 1200,
      height: 800,
      walls: [
        // Outer walls
        { id: 'w1', start: { x: 100, y: 100 }, end: { x: 1100, y: 100 }, type: 'wall' },
        { id: 'w2', start: { x: 1100, y: 100 }, end: { x: 1100, y: 700 }, type: 'wall' },
        { id: 'w3', start: { x: 1100, y: 700 }, end: { x: 100, y: 700 }, type: 'wall' },
        { id: 'w4', start: { x: 100, y: 700 }, end: { x: 100, y: 100 }, type: 'wall' },

        // Seating dividers
        { id: 'w5', start: { x: 300, y: 100 }, end: { x: 300, y: 350 }, type: 'wall' },
        { id: 'w6', start: { x: 600, y: 100 }, end: { x: 600, y: 350 }, type: 'wall' },
        { id: 'w7', start: { x: 900, y: 100 }, end: { x: 900, y: 350 }, type: 'wall' },

        { id: 'w8', start: { x: 300, y: 450 }, end: { x: 300, y: 700 }, type: 'wall' },
        { id: 'w9', start: { x: 600, y: 450 }, end: { x: 600, y: 700 }, type: 'wall' },
        { id: 'w10', start: { x: 900, y: 450 }, end: { x: 900, y: 700 }, type: 'wall' },
      ],
      obstacles: [],
      exits: [
        { id: 'exit1', position: { x: 100, y: 400 }, width: 100, angle: Math.PI, capacity: 150, flowRate: 2.5 },
        { id: 'exit2', position: { x: 1100, y: 400 }, width: 100, angle: 0, capacity: 150, flowRate: 2.5 },
        { id: 'exit3', position: { x: 400, y: 100 }, width: 80, angle: -Math.PI/2, capacity: 100, flowRate: 2 },
        { id: 'exit4', position: { x: 800, y: 100 }, width: 80, angle: -Math.PI/2, capacity: 100, flowRate: 2 },
        { id: 'exit5', position: { x: 400, y: 700 }, width: 80, angle: Math.PI/2, capacity: 100, flowRate: 2 },
        { id: 'exit6', position: { x: 800, y: 700 }, width: 80, angle: Math.PI/2, capacity: 100, flowRate: 2 },
      ],
      spawnZones: [
        { id: 'sz1', position: { x: 120, y: 120 }, width: 160, height: 210, agentCount: 50, agentTypes: ['adult', 'child'] },
        { id: 'sz2', position: { x: 320, y: 120 }, width: 260, height: 210, agentCount: 60, agentTypes: ['adult'] },
        { id: 'sz3', position: { x: 620, y: 120 }, width: 260, height: 210, agentCount: 55, agentTypes: ['adult', 'elderly'] },
        { id: 'sz4', position: { x: 920, y: 120 }, width: 160, height: 210, agentCount: 45, agentTypes: ['adult'] },
        { id: 'sz5', position: { x: 120, y: 470 }, width: 960, height: 210, agentCount: 40, agentTypes: ['adult', 'child', 'disabled'] },
      ]
    }
  },

  shopping_mall: {
    id: 'shopping_mall',
    name: 'Shopping Mall',
    description: 'Normal shopping mall scenario with multiple stores and corridors',
    type: 'custom',
    initialAgents: 180,
    duration: 500,
    events: [],
    environment: {
      width: 1300,
      height: 700,
      walls: [
        // Outer perimeter
        { id: 'w1', start: { x: 50, y: 50 }, end: { x: 1250, y: 50 }, type: 'wall' },
        { id: 'w2', start: { x: 1250, y: 50 }, end: { x: 1250, y: 650 }, type: 'wall' },
        { id: 'w3', start: { x: 1250, y: 650 }, end: { x: 50, y: 650 }, type: 'wall' },
        { id: 'w4', start: { x: 50, y: 650 }, end: { x: 50, y: 50 }, type: 'wall' },

        // Store divisions - Top row
        { id: 'w5', start: { x: 50, y: 250 }, end: { x: 300, y: 250 }, type: 'wall' },
        { id: 'w6', start: { x: 400, y: 250 }, end: { x: 600, y: 250 }, type: 'wall' },
        { id: 'w7', start: { x: 700, y: 250 }, end: { x: 900, y: 250 }, type: 'wall' },
        { id: 'w8', start: { x: 1000, y: 250 }, end: { x: 1250, y: 250 }, type: 'wall' },

        // Store divisions - Bottom row
        { id: 'w9', start: { x: 50, y: 450 }, end: { x: 300, y: 450 }, type: 'wall' },
        { id: 'w10', start: { x: 400, y: 450 }, end: { x: 600, y: 450 }, type: 'wall' },
        { id: 'w11', start: { x: 700, y: 450 }, end: { x: 900, y: 450 }, type: 'wall' },
        { id: 'w12', start: { x: 1000, y: 450 }, end: { x: 1250, y: 450 }, type: 'wall' },

        // Vertical separators
        { id: 'w13', start: { x: 350, y: 50 }, end: { x: 350, y: 200 }, type: 'wall' },
        { id: 'w14', start: { x: 650, y: 50 }, end: { x: 650, y: 200 }, type: 'wall' },
        { id: 'w15', start: { x: 950, y: 50 }, end: { x: 950, y: 200 }, type: 'wall' },

        { id: 'w16', start: { x: 350, y: 500 }, end: { x: 350, y: 650 }, type: 'wall' },
        { id: 'w17', start: { x: 650, y: 500 }, end: { x: 650, y: 650 }, type: 'wall' },
        { id: 'w18', start: { x: 950, y: 500 }, end: { x: 950, y: 650 }, type: 'wall' },
      ],
      obstacles: [
        // Kiosks in main corridor
        { id: 'o1', position: { x: 250, y: 350 }, radius: 25, type: 'circular' },
        { id: 'o2', position: { x: 650, y: 350 }, radius: 25, type: 'circular' },
        { id: 'o3', position: { x: 1050, y: 350 }, radius: 25, type: 'circular' },
      ],
      exits: [
        { id: 'exit1', position: { x: 50, y: 350 }, width: 100, angle: Math.PI, capacity: 150, flowRate: 2.5 },
        { id: 'exit2', position: { x: 1250, y: 350 }, width: 100, angle: 0, capacity: 150, flowRate: 2.5 },
        { id: 'exit3', position: { x: 650, y: 50 }, width: 120, angle: -Math.PI/2, capacity: 180, flowRate: 3 },
      ],
      spawnZones: [
        { id: 'sz1', position: { x: 70, y: 270 }, width: 1160, height: 160, agentCount: 180, agentTypes: ['adult', 'child', 'elderly'] },
      ]
    }
  }
};
