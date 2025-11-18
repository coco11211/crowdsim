# Quick Start Guide

Get up and running with Crowd Dynamics Simulator in 5 minutes!

## Installation

### Option 1: Use Pre-built Windows App (Recommended)

1. Download `Crowd-Dynamics-Simulator-Setup.exe`
2. Run the installer
3. Launch from Start Menu or Desktop
4. Done! ✅

### Option 2: Run from Source

```bash
# Install dependencies
npm install

# Run the app
npm run electron:dev
```

## First Steps

### 1. Launch the App
- Open Crowd Dynamics Simulator from your Start Menu

### 2. Explore the Interface
- **Left Sidebar**: Scenario selection and statistics
- **Top Bar**: Playback and visualization controls
- **Center**: Simulation canvas

### 3. Run Your First Simulation

1. Click on "Office Building Evacuation" in the sidebar (should be already loaded)
2. Click the **"Start"** button at the top
3. Watch as 150 people evacuate the building!

### 4. Try Different Scenarios

Click on any scenario in the sidebar:
- **Office Building Evacuation** - Emergency exit simulation
- **Music Festival** - Large crowd at outdoor event
- **Stampede Scenario** - Panic in confined space
- **Stadium Emergency Exit** - Organized evacuation
- **Shopping Mall** - Normal crowd behavior

### 5. Experiment with Controls

**Speed Control**
- Try different speeds: 0.5x (slow motion) to 10x (fast forward)

**Visualization Modes**
- **Agents**: See individual people
- **Density**: Heat map of crowding
- **Velocity**: Movement speed visualization
- **Stress**: Panic and stress levels

**Display Options**
- Click the **Map** icon to see agent paths
- Click the **Flame** icon to show heat map overlay

### 6. Understand What You See

**Agent Colors**
- Blue = Adults
- Yellow = Children
- Purple = Elderly
- Orange = Disabled

**Agent States**
- Moving normally = Calm
- Red outline = Panic!
- Slow/stopped = Stuck in crowd

**Statistics (Left Sidebar)**
- Watch active agents decrease as they exit
- Monitor stress levels (green = good, red = bad)
- Check for bottlenecks (problem areas)

## Common Tasks

### Compare Evacuation Times

1. Load a scenario
2. Click Start
3. Wait for "Evacuated in X.Xs" to appear
4. Click Reset
5. Run again to compare

### Find Bottlenecks

1. Start a simulation
2. Switch to "Density" mode
3. Look for red areas (high density)
4. Red circles show bottlenecks

### Export Data

1. Run a simulation
2. Click the Download icon
3. Get JSON file with all data

## Tips for Success

✅ **DO**:
- Try all 5 scenarios to understand different situations
- Experiment with visualization modes
- Use 5x or 10x speed for quick results
- Watch the statistics panel

❌ **DON'T**:
- Run too many agents if performance is slow
- Ignore bottleneck warnings (red circles)
- Forget to reset before trying again

## Need Help?

- Full documentation: See `README.md`
- Detailed guide: See `USER_GUIDE.md`
- Troubleshooting: Check README.md troubleshooting section

## What's Next?

After mastering the basics:
1. Study the statistics for each scenario
2. Export simulation data
3. Try different visualization modes
4. Learn about the simulation physics in README.md

---

**Ready to simulate?** Click that Start button! 🚀
