# Build Instructions for Windows 11

Complete instructions for building and running the Crowd Dynamics Simulator on Windows 11.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - Verify installation: Open PowerShell and run `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (optional, if cloning from repository)
   - Download from: https://git-scm.com/

### System Requirements

- **Operating System**: Windows 11 (or Windows 10)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB for dependencies and build
- **Display**: 1920x1080 or higher recommended

## Installation Steps

### Method 1: From Source Code

If you have the source code:

1. **Open PowerShell or Command Prompt**
   - Press `Win + X` and select "Windows PowerShell" or "Terminal"

2. **Navigate to the project directory**
   ```powershell
   cd path\to\crowdsim
   ```

3. **Install dependencies**
   ```powershell
   npm install
   ```

   This will take a few minutes to download all required packages.

4. **Verify installation**
   ```powershell
   npm list
   ```

   You should see a tree of installed packages without errors.

### Method 2: Clone from Repository

If using Git:

```powershell
# Clone the repository
git clone https://github.com/yourusername/crowdsim.git
cd crowdsim

# Install dependencies
npm install
```

## Running the Application

### Option 1: Run in Web Browser (Development)

Fastest way to test the application:

```powershell
npm run dev
```

- This starts a development server
- Open your browser to `http://localhost:5173`
- Hot-reload enabled (changes update automatically)
- Best for development and testing

### Option 2: Run as Desktop App (Development)

Run as a native Windows application with live reload:

```powershell
npm run electron:dev
```

- Opens in a desktop window
- More realistic experience
- Still has hot-reload for development
- Requires two processes (Vite server + Electron)

**Note**: If you get errors about port 5173 already in use, stop any other instances or change the port in `vite.config.ts`.

## Building for Production

### Build Web Version

Create optimized web build:

```powershell
npm run build
```

Output will be in the `dist` folder. You can serve this with any web server.

### Build Windows Desktop App

Create a Windows installer:

```powershell
npm run electron:build:win
```

This will:
1. Build the React app for production
2. Package it with Electron
3. Create a Windows installer

**Build artifacts**:
- Location: `dist-electron` folder
- Installer: `Crowd-Dynamics-Simulator-Setup-1.0.0.exe`
- Unpacked app: `dist-electron/win-unpacked`

**Build time**: 3-5 minutes depending on your system

### Installation from Built App

After building:

1. Navigate to `dist-electron` folder
2. Double-click the `.exe` installer
3. Follow installation wizard
4. Launch from Start Menu or Desktop

## Troubleshooting

### Common Issues and Solutions

#### Issue: `npm install` fails

**Solution 1**: Clear npm cache
```powershell
npm cache clean --force
npm install
```

**Solution 2**: Delete node_modules and retry
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

**Solution 3**: Use legacy peer deps (already configured in .npmrc)
```powershell
npm install --legacy-peer-deps
```

#### Issue: "Port 5173 already in use"

**Solution**: Kill existing process
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

Or change port in `vite.config.ts`:
```typescript
server: {
  port: 5174  // Change to different port
}
```

#### Issue: Electron window is blank

**Solutions**:
- Clear browser cache: `Ctrl + Shift + Delete` in Electron window
- Check console for errors: `Ctrl + Shift + I`
- Ensure Vite dev server is running
- Try rebuilding: `npm run build`

#### Issue: Build fails with "ENOENT" errors

**Solution**: Ensure all dependencies are installed
```powershell
npm install
npm run build
```

#### Issue: TypeScript errors during build

**Solution**: Check TypeScript configuration
```powershell
npx tsc --noEmit
```

Fix any errors shown, then rebuild.

#### Issue: Slow performance

**Solutions**:
- Close other applications
- Reduce agent count in scenarios (edit `src/scenarios/presets.ts`)
- Disable trajectories and heatmaps during simulation
- Use production build instead of dev mode

#### Issue: "Module not found" errors

**Solution**: Reinstall dependencies
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## Development Workflow

### Recommended Development Process

1. **Start development server**
   ```powershell
   npm run dev
   ```

2. **Make changes to code**
   - Edit files in `src/` folder
   - Changes auto-reload in browser
   - Check console for errors

3. **Test in browser**
   - View at `http://localhost:5173`
   - Use browser DevTools for debugging

4. **Test as desktop app**
   ```powershell
   npm run electron:dev
   ```

5. **Build for production**
   ```powershell
   npm run electron:build:win
   ```

### File Structure Reference

```
crowdsim/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── engine/            # Simulation engine
│   ├── scenarios/         # Scenario definitions
│   ├── store/             # State management
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── electron/              # Electron main process
├── public/                # Static assets
├── dist/                  # Web build output
└── dist-electron/         # Desktop build output
```

## Advanced Configuration

### Customizing the Build

#### Change App Name

Edit `package.json`:
```json
{
  "name": "your-app-name",
  "build": {
    "productName": "Your App Name"
  }
}
```

#### Change App Icon

1. Create PNG icon (256x256 or larger)
2. Save as `public/icon.png`
3. Update `package.json`:
```json
{
  "build": {
    "win": {
      "icon": "public/icon.png"
    }
  }
}
```

#### Optimize Build Size

Edit `vite.config.ts`:
```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true  // Remove console.logs
    }
  }
}
```

### Environment Variables

Create `.env` file in root:
```
VITE_APP_TITLE=Crowd Simulator
VITE_MAX_AGENTS=1000
```

Access in code:
```typescript
const title = import.meta.env.VITE_APP_TITLE;
```

## Testing

### Manual Testing Checklist

Before building for distribution:

- [ ] All scenarios load correctly
- [ ] Simulation starts without errors
- [ ] Playback controls work (start, pause, reset)
- [ ] Speed controls function properly
- [ ] All visualization modes display correctly
- [ ] Trajectories toggle works
- [ ] Heatmap toggle works
- [ ] Export data downloads JSON file
- [ ] Statistics update in real-time
- [ ] Dark mode toggle works
- [ ] Application scales properly with window resize
- [ ] No console errors during normal operation

### Performance Testing

Run each scenario and verify:
- FPS stays above 30
- No memory leaks (check Task Manager)
- CPU usage is reasonable (<50%)
- Application responsive during simulation

## Deployment

### Creating a Release

1. **Update version number**
   Edit `package.json`:
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. **Build the application**
   ```powershell
   npm run electron:build:win
   ```

3. **Test the installer**
   - Install on clean Windows 11 system
   - Verify all features work
   - Test uninstallation

4. **Distribute**
   - Upload installer to file sharing
   - Or publish to GitHub releases
   - Or distribute via your own channels

### Portable Version

To create a portable version (no installer):

1. Build the app: `npm run electron:build:win`
2. Use the contents of `dist-electron/win-unpacked`
3. Zip the folder
4. Users can run the `.exe` directly from extracted folder

## Getting Help

### Resources

- **Documentation**: See README.md
- **User Guide**: See USER_GUIDE.md
- **Quick Start**: See QUICKSTART.md

### Debugging

Enable developer tools in Electron:

Edit `electron/main.js` and add:
```javascript
win.webContents.openDevTools();
```

This opens Chrome DevTools for debugging.

### Logging

Check application logs:
- Browser console: `F12` or `Ctrl + Shift + I`
- Electron: Same as above in Electron window
- Build logs: Check terminal output during build

## Updating Dependencies

Keep dependencies up to date:

```powershell
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

## Performance Optimization

### For Better Performance

1. **Reduce initial agents**
   - Edit scenario files
   - Lower agent counts

2. **Optimize rendering**
   - Disable trajectories for large crowds
   - Turn off heatmap when not needed

3. **Use production build**
   - Production builds are faster
   - `npm run build` then `npm run electron:build:win`

## Security Notes

- No sensitive data is collected
- All processing happens locally
- No network requests (offline capable)
- Safe for enterprise environments

## License

MIT License - see LICENSE file

---

**Need more help?** Check the other documentation files or review the source code comments.

**Ready to build?** Run `npm install` then `npm run electron:build:win`!
