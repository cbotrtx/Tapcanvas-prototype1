# TapCanvas - Acoustic Touch Interface

Turn any surface into a touch interface. TapCanvas is a desktop application that simulates acoustic touch sensing on physical surfaces (desks, tables, glass, wood, etc.) using piezo sensor input.

## Features

| Module | Description |
|--------|-------------|
| **Virtual QWERTY Keyboard** | Acoustic tap-to-type with live text buffer and telemetry |
| **Acoustic Piano Synthesizer** | Web Audio poly-synth with octave/volume control |
| **Flappy Surface Arcade** | Desk-tap flappy bird game |
| **Neon Whiteboard** | Drawing canvas with color, size, and PNG export |
| **Smart Desk Controls** | 4-zone IoT automation (lamp, volume, coffee, focus timer) |
| **4-Channel Oscilloscope** | TDOA waveform monitor with gesture classification |

Plus: navigation drawer, 4-point calibration wizard, TDOA event inspector with CSV export, and an auto demo stream.

## Tech Stack

- **Electron** — Cross-platform desktop shell
- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Web Audio API** — Sound synthesis
- **electron-builder** — App packaging

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/tapcanvas-acoustic-interface.git
cd tapcanvas-acoustic-interface

# Install dependencies
npm install
```

### Run in Development Mode

```bash
# Web browser (Vite dev server)
npm run dev

# Electron desktop app
npm run electron-dev
```

The web version opens at `http://localhost:5173`. The Electron version opens a native desktop window.

## Usage

1. Launch the app
2. Use the **sidebar** to switch between modules (Keyboard, Piano, Game, Drawing, Controls, Sensors)
3. Use the **left/right arrow buttons** or **carousel dots** to rotate through modules
4. Click **Calibration Wizard** in the sidebar to run 4-point surface calibration
5. Open **TDOA Event Inspector** to view and export acoustic touch logs

## Project Structure

```
tapcanvas-npm-app/
├── .github/workflows/release.yml   # CI/CD for cross-platform releases
├── .gitignore                       # Excludes node_modules, dist, release
├── index.html
├── package.json                     # Scripts & electron-builder config
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── electron/
│   ├── main.js                      # Electron main process
│   └── preload.js                   # Secure preload script
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx                      # Main layout & navigation
    ├── utils/audioEngine.js         # Web Audio synthesizer
    └── components/
        ├── KeyboardModule.jsx
        ├── PianoModule.jsx
        ├── GameModule.jsx
        ├── DrawingModule.jsx
        ├── SmartControlsModule.jsx
        ├── SensorMonitorModule.jsx
        ├── CalibrationModal.jsx
        └── LogModal.jsx
```

## Building for Distribution

### Local Builds

```bash
# Linux (AppImage)
npm run build:linux

# Windows (NSIS installer) — requires Wine on Linux, or run on Windows
npm run build:win

# macOS (DMG) — requires macOS host
npm run build:mac

# All platforms
npm run build:all
```

Artifacts are output to the `release/` directory.

### GitHub Releases (Automated)

Pushing a tag starting with `v` (e.g., `v1.0.0`) triggers the GitHub Actions workflow, which builds for Linux, Windows, and macOS and creates a GitHub Release with all three artifacts attached.

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Downloading for End Users

Go to the **Releases** section of this repository and download the file matching your OS:

| OS | File |
|----|------|
| Linux | `TapCanvas-linux-x64.AppImage` |
| Windows | `TapCanvas-win-x64.exe` |
| macOS | `TapCanvas-mac-x64.dmg` |

### Linux (AppImage)

```bash
chmod +x TapCanvas-linux-x64.AppImage
./TapCanvas-linux-x64.AppImage
```

### Windows

Run the `.exe` installer and follow the setup wizard.

### macOS

Open the `.dmg`, drag TapCanvas to your Applications folder.

## License

MIT
