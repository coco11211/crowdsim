# Crowd Dynamics Simulator

A professional, feature-rich crowd dynamics simulation application for Windows 11. Simulate evacuations, festivals, panic scenarios, and more with realistic agent-based modeling, advanced pathfinding, and beautiful visualizations.

![Crowd Dynamics Simulator](public/icon.svg)

## Features

### Core Simulation Engine
- **Advanced Physics**: Social force model for realistic crowd behavior
- **Intelligent Pathfinding**: A* algorithm with obstacle avoidance
- **Agent-Based Modeling**: Individual agent behaviors and interactions
- **Collision Detection**: Realistic physical contact and friction
- **Stress Simulation**: Dynamic stress levels affecting agent behavior
- **Panic Modeling**: Realistic panic propagation and crowd dynamics

### Agent Types
- **Adults**: Standard movement speed and behavior
- **Children**: Smaller size, faster but less controlled movement
- **Elderly**: Slower movement, higher patience
- **Disabled**: Limited mobility, requires special consideration

### Simulation Scenarios

#### 1. Office Building Evacuation
- Multi-room office layout
- Fire emergency scenario
- Multiple exit points
- 150 agents
- Measures evacuation efficiency

#### 2. Music Festival
- Large outdoor venue
- Stage and crowd barriers
- Multiple entry/exit points
- 300 agents
- Normal crowd flow simulation

#### 3. Stampede Scenario
- Narrow corridor with bottleneck
- Panic trigger event
- Limited exits
- 200 agents
- High-stress evacuation

#### 4. Stadium Emergency Exit
- Stadium seating arrangement
- Multiple exit routes
- Emergency announcement system
- 250 agents
- Organized evacuation

#### 5. Shopping Mall
- Complex multi-corridor layout
- Store divisions and kiosks
- Normal shopping behavior
- 180 agents
- Everyday crowd dynamics

### Visualization Modes

1. **Agents Mode**: Standard agent visualization with type-based colors
2. **Density Heatmap**: Real-time crowd density visualization
3. **Velocity Heatmap**: Movement speed visualization
4. **Stress Heatmap**: Agent stress level visualization
5. **Trajectories**: Historical path tracking

### Analytics & Statistics

- **Real-time Metrics**:
  - Total and active agent count
  - Average movement speed
  - Average stress level
  - Maximum crowd density
  - Bottleneck detection
  - Evacuation time tracking

- **Data Export**: JSON export of simulation data including:
  - Agent trajectories
  - Statistical summaries
  - Event timeline
  - Environment configuration

### User Interface

- **Professional Design**: Modern, clean Figma-level UI/UX
- **Dark Mode**: Eye-friendly dark theme
- **Responsive Layout**: Adapts to window size
- **Intuitive Controls**: Easy-to-use playback controls
- **Real-time Updates**: 60 FPS rendering
- **Interactive Canvas**: Smooth animations and transitions

## Installation & Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Windows 11 (or Windows 10 with compatibility)

### Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Run in Development Mode**
```bash
npm run dev
```

3. **Build for Production**
```bash
npm run build
```

4. **Run as Desktop App (Development)**
```bash
npm run electron:dev
```

5. **Build Windows Desktop App**
```bash
npm run electron:build:win
```

The Windows installer will be created in the `dist-electron` folder.

## Usage Guide

### Getting Started

1. **Launch the Application**
   - Double-click the installed desktop app, or
   - Run `npm run electron:dev` for development

2. **Select a Scenario**
   - Browse scenarios in the left sidebar
   - Click on a scenario to see details
   - Click "Load Scenario" to initialize

3. **Run the Simulation**
   - Click the "Start" button to begin
   - Use "Pause" to temporarily stop
   - Use "Reset" to restart the scenario

### Controls

#### Playback Controls
- **Start/Pause**: Begin or pause the simulation
- **Reset**: Restart the current scenario
- **Speed**: Adjust simulation speed (0.25x to 10x)

#### Visualization Controls
- **Mode Selector**: Choose visualization mode
  - Agents: Standard view
  - Density: Crowd density heatmap
  - Velocity: Movement speed heatmap
  - Stress: Agent stress levels
- **Trajectories**: Toggle path history display
- **Heatmap**: Toggle heatmap overlay
- **Export**: Download simulation data as JSON

### Keyboard Shortcuts

- `Space`: Start/Pause simulation
- `R`: Reset simulation
- `T`: Toggle trajectories
- `H`: Toggle heatmap
- `D`: Toggle dark mode
- `1-5`: Quick load scenarios

## Technical Architecture

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Desktop**: Electron
- **Icons**: Lucide React

### Core Components

#### Simulation Engine (`src/engine/SimulationEngine.ts`)
- Manages simulation state and updates
- Coordinates agent behaviors
- Handles events and scenarios
- Generates analytics and heatmaps

#### Agent System (`src/engine/Agent.ts`)
- Individual agent AI and physics
- Social force calculations
- Pathfinding integration
- State management (idle, moving, panic, etc.)

#### Pathfinding (`src/utils/pathfinding.ts`)
- A* algorithm implementation
- Dynamic obstacle avoidance
- Path smoothing
- Grid-based navigation

#### Vector Math (`src/utils/vector.ts`)
- 2D vector operations
- Physics calculations
- Geometric utilities

### Performance Optimizations

- **Spatial Partitioning**: Efficient neighbor queries
- **Simplified Pathfinding**: Grid-based with path smoothing
- **Selective Updates**: Only update active agents
- **Canvas Rendering**: Hardware-accelerated graphics
- **Trajectory Sampling**: Reduced memory footprint

## Customization

### Creating Custom Scenarios

Edit `src/scenarios/presets.ts` to add new scenarios:

```typescript
{
  id: 'custom_scenario',
  name: 'My Custom Scenario',
  description: 'Description here',
  type: 'custom',
  initialAgents: 100,
  duration: 300,
  events: [
    {
      time: 10,
      type: 'panic_trigger',
      position: { x: 500, y: 400 },
      radius: 150
    }
  ],
  environment: {
    width: 1200,
    height: 800,
    walls: [...],
    obstacles: [...],
    exits: [...],
    spawnZones: [...]
  }
}
```

### Adjusting Physics Parameters

Modify `src/engine/Agent.ts` to adjust:
- Social force strength
- Repulsion parameters
- Agent speeds and masses
- Stress thresholds
- Panic behaviors

### Styling Customization

Edit `tailwind.config.js` to customize:
- Color schemes
- Dark mode settings
- Spacing and sizing
- Animations

## Troubleshooting

### Common Issues

**Simulation runs slowly**
- Reduce agent count in scenarios
- Lower simulation speed
- Disable trajectories and heatmaps

**Electron app won't start**
- Ensure all dependencies are installed: `npm install`
- Try clearing node_modules: `rm -rf node_modules && npm install`

**Build fails**
- Check Node.js version (18+ required)
- Verify all dependencies: `npm install`
- Clear build cache: `rm -rf dist dist-electron`

## Project Structure

```
crowdsim/
├── src/
│   ├── components/          # React UI components
│   │   ├── SimulationCanvas.tsx
│   │   ├── ControlPanel.tsx
│   │   └── Sidebar.tsx
│   ├── engine/              # Simulation engine
│   │   ├── SimulationEngine.ts
│   │   └── Agent.ts
│   ├── scenarios/           # Scenario presets
│   │   └── presets.ts
│   ├── store/               # State management
│   │   └── simulationStore.ts
│   ├── types/               # TypeScript types
│   │   └── simulation.ts
│   ├── utils/               # Utilities
│   │   ├── vector.ts
│   │   └── pathfinding.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── electron/                # Electron main process
│   └── main.js
├── public/                  # Static assets
├── package.json
├── vite.config.ts
└── README.md
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building
```bash
# Web build
npm run build

# Desktop build
npm run electron:build:win
```

## Contributing

This is a standalone application. For modifications:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Credits

### Technologies Used
- React & TypeScript
- Electron
- Tailwind CSS
- Zustand
- Vite
- Lucide Icons

### Simulation Models
Based on research in:
- Social Force Model (Helbing et al.)
- Agent-Based Crowd Simulation
- Pedestrian Dynamics
- Emergency Evacuation Studies

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

## Roadmap

Future enhancements:
- [ ] Custom environment editor with drag-and-drop
- [ ] Multi-floor buildings
- [ ] Fire/smoke spreading simulation
- [ ] Advanced AI behaviors
- [ ] Machine learning integration
- [ ] VR visualization
- [ ] Real-time collaboration
- [ ] Video export
- [ ] Performance profiling tools

---

**Version**: 1.0.0
**Last Updated**: 2024
**Tested on**: Windows 11

Enjoy simulating crowd dynamics! 🚶‍♂️🚶‍♀️👨‍👩‍👧‍👦
