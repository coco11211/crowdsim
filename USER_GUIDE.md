# Crowd Dynamics Simulator - User Guide

## Welcome!

Thank you for using the Crowd Dynamics Simulator. This guide will help you get started with simulating crowd behaviors for evacuation planning, event management, and safety analysis.

## Installation

### Windows 11 Installation

1. **Download the Installer**
   - Download `Crowd-Dynamics-Simulator-Setup.exe` from the releases
   - Or build from source using `npm run electron:build:win`

2. **Run the Installer**
   - Double-click the installer
   - Follow the installation wizard
   - Launch the application from your Start menu or desktop shortcut

### Running from Source

If you prefer to run from source code:

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Or run in web browser
npm run dev
```

## Getting Started

### First Launch

When you first launch the application:
1. You'll see the main interface with a sidebar on the left
2. The "Office Building Evacuation" scenario is loaded by default
3. The simulation canvas is in the center
4. Control buttons are at the top

### Understanding the Interface

#### Left Sidebar
- **Scenarios Section**: Browse and load different simulation scenarios
- **Statistics Panel**: Real-time simulation metrics
- **Legend**: Agent types and state colors

#### Top Control Bar
- **Playback Controls**: Start, pause, reset buttons
- **Speed Control**: Adjust simulation speed (0.25x to 10x)
- **Visualization Mode**: Choose how to view the simulation
- **Display Options**: Toggle trajectories and heatmaps
- **Export**: Download simulation data

#### Main Canvas
- Displays the simulation environment
- Shows agents, walls, obstacles, and exits
- Real-time visualization with smooth animations

## Running Your First Simulation

### Step 1: Choose a Scenario

1. Look at the left sidebar under "Scenarios"
2. Click on any scenario to expand its details
3. Read the description to understand what it simulates
4. Click "Load Scenario" to initialize it

### Step 2: Understand the Scenario

Each scenario shows:
- **Name**: Scenario title
- **Type**: evacuation, festival, panic, or custom
- **Description**: What the scenario simulates
- **Agents**: Number of people in the simulation
- **Duration**: Expected simulation time
- **Events**: Number of triggered events (fires, announcements, etc.)

### Step 3: Start the Simulation

1. Click the **"Start"** button in the top control bar
2. Watch as agents navigate toward exits
3. Observe their behaviors and interactions
4. Monitor statistics in real-time

### Step 4: Experiment with Controls

Try these controls:
- **Pause**: Stop and resume at any time
- **Speed**: Speed up to see results faster (try 5x or 10x)
- **Reset**: Restart the scenario from the beginning

## Understanding Visualizations

### Agent Colors (Default View)

- **Blue** (#3b82f6): Adult agents
- **Yellow** (#fbbf24): Children
- **Purple** (#a78bfa): Elderly
- **Orange** (#fb923c): Disabled/mobility-impaired

### Agent States

- **Normal**: Agents moving calmly toward exits
- **Panic** (red outline): High stress, faster movement
- **Stuck**: Agent unable to move (very slow)
- **Exited**: Successfully evacuated (no longer visible)

### Visualization Modes

#### 1. Agents Mode (Default)
Shows individual agents with their type-based colors.

**Best for**: Understanding individual behaviors and agent types

#### 2. Density Mode
Heatmap showing crowd density.
- Blue: Low density
- Green: Medium density
- Yellow/Orange: High density
- Red: Very high density (potential danger)

**Best for**: Identifying crowded areas and bottlenecks

#### 3. Velocity Mode
Heatmap showing movement speed.
- Blue: Slow/stopped
- Green: Normal speed
- Yellow/Red: Fast movement

**Best for**: Finding where people are slowing down or stuck

#### 4. Stress Mode
Shows agent stress levels.
- Green: Calm
- Yellow: Moderate stress
- Red: High stress/panic

**Best for**: Identifying areas causing distress

### Additional Visualizations

#### Trajectories
Toggle to see the historical paths agents have taken.
- Useful for understanding flow patterns
- Shows where agents have traveled
- Helps identify efficient vs. inefficient routes

#### Heatmap Overlay
Enable to see a heatmap overlay on the simulation.
- Works with any visualization mode
- Provides additional density information
- Color-coded from blue (low) to red (high)

## Scenarios Explained

### 1. Office Building Evacuation

**Purpose**: Test evacuation efficiency in a multi-room office
**Agents**: 150 (adults, elderly, disabled)
**Key Features**:
- Multiple rooms and corridors
- 3 exit points
- Fire event at 5 seconds
- Measures total evacuation time

**What to Watch For**:
- Bottlenecks at doorways
- Stress levels rising during evacuation
- Efficiency of different exit routes
- Impact of fire on crowd behavior

**Typical Results**:
- Evacuation time: 120-180 seconds
- Peak stress: 60-80%
- Bottlenecks: 2-4 locations

### 2. Music Festival

**Purpose**: Simulate normal crowd flow at large events
**Agents**: 300 (all types)
**Key Features**:
- Large open area with stage
- Multiple entry/exit points
- No emergency events
- Tests normal crowd dynamics

**What to Watch For**:
- Natural crowd distribution
- Flow toward exits
- Areas of congestion near stage
- Stress remains relatively low

**Typical Results**:
- Low stress levels (20-30%)
- Smooth, gradual evacuation
- Few bottlenecks

### 3. Stampede Scenario

**Purpose**: Study panic behavior in confined spaces
**Agents**: 200 (mixed)
**Key Features**:
- Narrow corridor with bottleneck
- Panic trigger at 10 seconds
- Single narrow exit
- High-stress environment

**What to Watch For**:
- Rapid panic spread
- Severe bottleneck formation
- Pushing and crowding
- Slow evacuation despite panic

**Safety Insights**:
- Shows danger of limited exits
- Demonstrates panic propagation
- Highlights need for crowd control

**Typical Results**:
- Very high stress (80-100%)
- Significant bottlenecks
- Longer evacuation despite panic

### 4. Stadium Emergency Exit

**Purpose**: Test organized evacuation from stadium seating
**Agents**: 250 (all types)
**Key Features**:
- Seating sections with dividers
- 6 exit routes
- Emergency announcement system
- Organized evacuation

**What to Watch For**:
- Section-by-section evacuation
- Multiple exit usage
- Moderate stress levels
- Efficient crowd dispersal

**Typical Results**:
- Moderate stress (40-60%)
- Good exit distribution
- Reasonable evacuation time

### 5. Shopping Mall

**Purpose**: Normal shopping behavior and evacuation
**Agents**: 180 (all types)
**Key Features**:
- Multiple corridors and stores
- 3 major exits
- No triggered events
- Everyday crowd dynamics

**What to Watch For**:
- Natural movement patterns
- Gradual exit seeking
- Low stress environment
- Realistic walking speeds

## Understanding Statistics

### Real-Time Metrics

#### Simulation Time
- Current simulation time in seconds
- Useful for measuring evacuation duration

#### Total Agents
- Initial number of people in simulation
- Remains constant throughout

#### Active Agents
- Currently moving/not exited
- Decreases as people exit
- Blue color in sidebar

#### Exited Agents
- Successfully evacuated
- Increases over time
- Green color indicates success

#### Average Speed
- Mean velocity of all agents (m/s)
- Typical: 1.0-1.5 m/s
- Lower in crowded areas
- Higher during panic

#### Average Stress
- Mean stress level (0-100%)
- Green (0-40%): Normal
- Yellow (40-70%): Elevated
- Red (70-100%): Panic

#### Max Density
- Highest agent count in any grid cell
- Indicates crowding severity
- Higher values = more crowding

#### Bottlenecks
- Number of high-density, low-velocity areas
- Shown as red circles on canvas
- Indicates problem areas
- Zero is ideal

#### Evacuation Time
- Total time for all agents to exit
- Only shown when complete
- Green color indicates success
- Use to compare scenarios

## Advanced Usage

### Exporting Simulation Data

1. Run a simulation to completion (or to desired point)
2. Click the **Download** button in the top bar
3. A JSON file will be downloaded with:
   - All agent trajectories
   - Statistical summaries
   - Event timeline
   - Environment configuration

### Using Exported Data

The exported JSON contains:
```json
{
  "stats": { /* All statistics */ },
  "agents": [ /* Agent data */ ],
  "time": 123.4,
  "environment": { /* Scenario setup */ }
}
```

Use this data for:
- Analysis in external tools
- Creating reports
- Comparing scenarios
- Academic research
- Safety planning

### Speed Control Tips

- **0.25x - 0.5x**: Detailed observation, study individual behaviors
- **1x**: Real-time simulation
- **2x**: Faster results while still observable
- **5x**: Quick testing
- **10x**: Rapid completion for statistics

### Dark Mode

Click the sun/moon icon in the sidebar header to toggle between light and dark themes.

## Tips for Best Results

### Analyzing Evacuations

1. **Run Multiple Times**: Results vary due to randomization
2. **Try Different Speeds**: Fast for overview, slow for details
3. **Use Different Views**: Each mode reveals different insights
4. **Watch Bottlenecks**: Red circles show problem areas
5. **Check Stress Levels**: High stress indicates issues
6. **Note Evacuation Time**: Compare across scenarios

### Identifying Problems

**Bottlenecks**:
- Appear as red circles
- High density + low velocity
- Common at doorways and corners
- Suggest need for wider exits

**High Stress**:
- Yellow/red agents in stress mode
- Average stress >70%
- Indicates poor evacuation experience
- May lead to panic

**Slow Evacuation**:
- Agents stuck or barely moving
- Very low average speed
- Suggests design problems
- Check exit capacity

### Optimization Ideas

If you see problems:
- **Add more exits** (edit scenarios)
- **Widen doorways**
- **Remove obstacles** near exits
- **Improve pathways**
- **Better exit distribution**

## Troubleshooting

### Performance Issues

**Simulation is slow or laggy**:
- Disable trajectories
- Turn off heatmap overlay
- Reduce window size
- Close other applications

**Agents moving erratically**:
- This is normal during high stress
- Panic causes unpredictable movement
- Reset and try again

### Visual Issues

**Can't see agents**:
- Zoom in/out (resize window)
- Check visualization mode
- Reset the simulation

**Colors seem wrong**:
- Check visualization mode
- Verify agent types in legend
- Try different modes

### Simulation Issues

**Nothing happens when I click Start**:
- Ensure a scenario is loaded
- Try resetting
- Reload the application

**All agents exited immediately**:
- Scenario might be too easy
- Try a more complex scenario
- Check that environment has walls

## Best Practices

### For Event Planning

1. Start with Festival scenario
2. Adjust agent count to match expected attendance
3. Test with 1.5x expected crowd
4. Check stress levels remain low
5. Ensure multiple exit routes

### For Emergency Planning

1. Use Evacuation scenarios
2. Add panic triggers
3. Test with reduced exit capacity
4. Aim for <180s evacuation time
5. Keep stress levels <70%

### For Research

1. Run each scenario 5-10 times
2. Record evacuation times
3. Export data for each run
4. Calculate averages and variations
5. Compare different configurations

## Keyboard Shortcuts

- **Space**: Start/Pause
- **R**: Reset
- **T**: Toggle trajectories
- **H**: Toggle heatmap
- **D**: Toggle dark mode
- **1**: Load scenario 1
- **2**: Load scenario 2
- **3**: Load scenario 3
- **4**: Load scenario 4
- **5**: Load scenario 5

## Getting Help

If you need assistance:
1. Review this user guide
2. Check the README.md file
3. Review scenario descriptions
4. Try different scenarios to understand behaviors
5. Experiment with visualization modes

## Next Steps

Now that you understand the basics:
1. Try all five scenarios
2. Experiment with different visualization modes
3. Compare evacuation times
4. Identify bottlenecks
5. Export and analyze data
6. Consider creating custom scenarios

---

Enjoy exploring crowd dynamics! Your simulations can help make events safer and evacuations more efficient.

**Questions or feedback?** Please refer to the main README.md file.
