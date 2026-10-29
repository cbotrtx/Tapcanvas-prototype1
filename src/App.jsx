import { useState, useEffect, useCallback, useRef } from 'react'
import { audioEngine } from './utils/audioEngine'
import KeyboardModule from './components/KeyboardModule'
import PianoModule from './components/PianoModule'
import GameModule from './components/GameModule'
import DrawingModule from './components/DrawingModule'
import SmartControlsModule from './components/SmartControlsModule'
import SensorMonitorModule from './components/SensorMonitorModule'
import CalibrationModal from './components/CalibrationModal'
import LogModal from './components/LogModal'

const MODULES = [
  { id: 'keyboard', name: 'Virtual Keyboard', leftPreview: 'Piano', rightPreview: 'Game', component: KeyboardModule },
  { id: 'piano', name: 'Acoustic Piano', leftPreview: 'Keyboard', rightPreview: 'Game', component: PianoModule },
  { id: 'game', name: 'Flappy Arcade', leftPreview: 'Piano', rightPreview: 'Drawing', component: GameModule },
  { id: 'drawing', name: 'Neon Whiteboard', leftPreview: 'Game', rightPreview: 'Controls', component: DrawingModule },
  { id: 'smart-controls', name: 'Smart Desk Controls', leftPreview: 'Drawing', rightPreview: 'Sensors', component: SmartControlsModule },
  { id: 'sensor-monitor', name: '4-Ch Oscilloscope', leftPreview: 'Controls', rightPreview: 'Keyboard', component: SensorMonitorModule },
]

const VIEW_TO_INDEX = {
  keyboard: 0,
  piano: 1,
  game: 2,
  drawing: 3,
  'smart-controls': 4,
  'sensor-monitor': 5,
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [calibOpen, setCalibOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [demoActive, setDemoActive] = useState(true)
  const [streamLabel, setStreamLabel] = useState('Sim Feed: ON')
  const [hardwareStatus, setHardwareStatus] = useState('ESP32 (Simulated)')
  const [latency, setLatency] = useState('4.2 ms')

  const demoIntervalRef = useRef(null)

  const renderActiveModule = useCallback((index) => {
    setCurrentIndex((index + MODULES.length) % MODULES.length)
  }, [])

  const leftIndex = (currentIndex - 1 + MODULES.length) % MODULES.length
  const rightIndex = (currentIndex + 1) % MODULES.length
  const activeModule = MODULES[currentIndex]
  const leftLabel = MODULES[leftIndex].name.replace('Virtual ', '').replace('Acoustic ', '')
  const rightLabel = MODULES[rightIndex].name.replace('Virtual ', '').replace('Acoustic ', '')

  // Auto demo stream
  useEffect(() => {
    if (demoActive) {
      demoIntervalRef.current = setInterval(() => {
        const surface = document.getElementById('keyboardTapSurface')
        if (!surface) return
        const rect = surface.getBoundingClientRect()
        const randomX = Math.round(rect.left + 50 + Math.random() * (rect.width - 100))
        const randomY = Math.round(rect.top + 30 + Math.random() * (rect.height - 60))
        spawnRipple(randomX, randomY)
        audioEngine.playTapChirp(700 + Math.random() * 200, 0.02)
      }, 3400)
    } else {
      clearInterval(demoIntervalRef.current)
    }
    return () => clearInterval(demoIntervalRef.current)
  }, [demoActive])

  useEffect(() => {
    audioEngine.init()
  }, [])

  const spawnRipple = (x, y) => {
    const overlay = document.getElementById('rippleOverlay')
    if (!overlay) return
    const ripple = document.createElement('div')
    ripple.className = 'acoustic-ripple'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    overlay.appendChild(ripple)
    setTimeout(() => ripple.remove(), 650)
  }

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  const switchViewFromDrawer = (view) => {
    const idx = VIEW_TO_INDEX[view]
    if (idx !== undefined) {
      setCurrentIndex(idx)
      closeDrawer()
    }
  }

  return (
    <div className="flex flex-col min-h-screen relative selection:bg-emerald-500/30 selection:text-white">
      {/* Acoustic Ripple Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" id="rippleOverlay" />

      {/* Header */}
      <header className="w-full pt-6 px-6 lg:px-12 flex items-center justify-between z-30 relative">
        <div className="flex items-center space-x-4">
          <button
            aria-label="Toggle Navigation Drawer"
            className="w-11 h-11 rounded-xl glass-pill flex flex-col items-center justify-center space-y-1.5 hover:border-emerald-400/50 hover:shadow-glow-sm transition group"
            onClick={openDrawer}
            title="Open System Drawer"
          >
            <span className="w-5 h-0.5 bg-slate-300 rounded-full group-hover:bg-teal-300 transition"></span>
            <span className="w-5 h-0.5 bg-slate-300 rounded-full group-hover:bg-teal-300 transition"></span>
            <span className="w-5 h-0.5 bg-slate-300 rounded-full group-hover:bg-teal-300 transition"></span>
          </button>
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-full bg-[#051a14]/60 border border-emerald-900/60">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-medium">ACOUSTIC LINK:</span>
            <span className="text-slate-300">{hardwareStatus}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400" id="latencyIndicator">{latency}</span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center cursor-pointer select-none" id="brandHeader" title="TapCanvas Interface" onClick={openDrawer}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight flex items-center">
            <span className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">Tap</span>
            <span className="text-emerald-400 drop-shadow-[0_0_24px_rgba(52,211,153,0.7)] ml-0.5">Canvas</span>
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[0.28em] text-slate-400 uppercase font-semibold mt-1 opacity-90">
            Turn Any Surface Into A Touch Interface
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium glass-pill hover:bg-emerald-950/40 text-emerald-300 border-emerald-500/30 transition shadow-sm"
            onClick={() => {
              setDemoActive(!demoActive)
              setStreamLabel(demoActive ? 'Sim Feed: OFF' : 'Sim Feed: ON')
            }}
            id="toggleDemoStream"
            title="Toggle automatic simulated surface taps"
          >
            <span className={`w-2 h-2 rounded-full bg-teal-400 ${demoActive ? 'animate-ping' : ''}`}></span>
            <span id="streamStateLabel">{streamLabel}</span>
          </button>

          <div className="relative">
            <button
              aria-haspopup="true"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl glass-pill hover:border-emerald-400/50 hover:shadow-glow-sm transition text-xs sm:text-sm font-medium text-slate-200"
              id="calibrationMenuBtn"
            >
              <svg className="w-4 h-4 text-emerald-400 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span id="currentProfileName">Calibration Profile</span>
              <svg className="w-3.5 h-3.5 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Drawer */}
      <aside
        aria-label="App Modules Navigation"
        className={`fixed inset-y-0 left-0 w-80 glass-card bg-[#04120e]/95 z-50 transition-transform duration-300 ease-in-out border-r border-emerald-500/30 p-6 flex flex-col justify-between ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        id="sideDrawer"
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-emerald-900/60">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-glow-sm"></div>
              <span className="font-bold tracking-wide text-lg text-white">TapCanvas Engine</span>
            </div>
            <button
              className="w-8 h-8 rounded-lg hover:bg-emerald-900/40 text-slate-400 hover:text-white flex items-center justify-center"
              onClick={closeDrawer}
            >
              ✕
            </button>
          </div>
          <nav className="mt-6 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-1">Modules &amp; Surfaces</div>
            {MODULES.map((m) => (
              <button
                key={m.id}
                className={`drawer-nav-item w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition font-medium text-sm ${currentIndex === MODULES.findIndex((x) => x.id === m.id) ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-900/30 text-slate-300'}`}
                onClick={() => switchViewFromDrawer(m.id)}
              >
                <span className="text-base">{m.id === 'keyboard' ? '⌨️' : m.id === 'piano' ? '🎹' : m.id === 'game' ? '🎮' : m.id === 'drawing' ? '🎨' : m.id === 'smart-controls' ? '💡' : '📡'}</span>
                <span>{m.name}</span>
              </button>
            ))}
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pt-4 pb-1">Hardware &amp; Diagnostics</div>
            <button
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl hover:bg-emerald-900/30 text-slate-300 text-sm transition"
              onClick={() => { closeDrawer(); setCalibOpen(true) }}
              id="openCalibDrawerBtn"
            >
              <span className="text-base">🎯</span>
              <span>Calibration Wizard</span>
            </button>
            <button
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl hover:bg-emerald-900/30 text-slate-300 text-sm transition"
              onClick={() => { closeDrawer(); setLogOpen(true) }}
              id="openLogDrawerBtn"
            >
              <span className="text-base">📋</span>
              <span>TDOA Event Inspector</span>
            </button>
          </nav>
        </div>
        <div className="border-t border-emerald-900/50 pt-4 text-xs font-mono text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>TDOA Resolution:</span>
            <span className="text-emerald-400">192 kHz (ADC)</span>
          </div>
          <div className="flex justify-between">
            <span>Coordinate Engine:</span>
            <span className="text-emerald-400">GCC-PHAT</span>
          </div>
          <div className="flex justify-between">
            <span>Active Surface:</span>
            <span className="text-white">650 × 380 mm</span>
          </div>
        </div>
      </aside>

      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 ${drawerOpen ? '' : 'hidden'}`} id="drawerBackdrop" onClick={closeDrawer} />

      {/* Main Stage */}
      <main className="flex-1 flex flex-col justify-center items-center px-2 sm:px-6 md:px-10 py-6 relative">
        <div className="w-full max-w-[1580px] flex items-center justify-center relative stage-container">
          {/* Left Preview Card */}
          <div className="hidden xl:flex flex-col items-center cursor-pointer select-none card-left-perspective group w-64 mr-2" onClick={() => { audioEngine.playTapChirp(440, 0.03); renderActiveModule(currentIndex - 1) }} id="cardLeftPreview" title={`Switch to ${leftLabel} Module`}>
            <div className="w-60 h-80 glass-card rounded-3xl p-4 overflow-hidden relative border-emerald-500/20 group-hover:border-emerald-400/50 shadow-2xl flex flex-col justify-end bg-gradient-to-b from-[#061814]/90 to-[#020b08]/95">
              <div className="absolute inset-x-2 top-2 bottom-12 rounded-2xl bg-black/70 p-3 overflow-hidden flex items-end justify-center border border-emerald-950">
                <div className="flex h-3/4 w-full relative justify-center">
                  <div className="w-5 h-full bg-slate-100 rounded-b border border-slate-300"></div>
                  <div className="w-5 h-full bg-slate-100 rounded-b border border-slate-300 -ml-1"></div>
                  <div className="w-5 h-full bg-slate-100 rounded-b border border-slate-300 -ml-1"></div>
                  <div className="w-5 h-full bg-slate-100 rounded-b border border-slate-300 -ml-1"></div>
                  <div className="w-5 h-full bg-slate-100 rounded-b border border-slate-300 -ml-1"></div>
                  <div className="w-5 h-full bg-slate-100 rounded-b border border-slate-300 -ml-1"></div>
                  <div className="absolute top-0 left-3 w-3 h-16 bg-slate-900 rounded-b border border-black z-10"></div>
                  <div className="absolute top-0 left-7 w-3 h-16 bg-slate-900 rounded-b border border-black z-10"></div>
                  <div className="absolute top-0 left-16 w-3 h-16 bg-slate-900 rounded-b border border-black z-10"></div>
                  <div className="absolute top-0 left-20 w-3 h-16 bg-slate-900 rounded-b border border-black z-10"></div>
                </div>
              </div>
              <span className="text-sm font-semibold tracking-wider text-slate-300 group-hover:text-emerald-300 text-center uppercase transition" id="labelCardLeft">{leftLabel}</span>
            </div>
          </div>

          <button
            aria-label="Previous Module"
            className="z-20 w-12 h-12 md:w-14 md:h-14 rounded-full glass-card hover:bg-emerald-900/40 hover:border-emerald-400/60 hover:shadow-glow-md flex items-center justify-center text-slate-200 transition active:scale-95 mx-1 md:mx-3 flex-shrink-0"
            id="prevModuleBtn"
            onClick={() => { audioEngine.playTapChirp(440, 0.03); renderActiveModule(currentIndex - 1) }}
          >
            <svg className="w-6 h-6 transform -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
            </svg>
          </button>

          {/* Center Hero Stage */}
          <div className="flex-1 max-w-4xl min-h-[460px] flex items-center justify-center transition-all duration-300 z-10" id="heroModuleContainer">
            <ModuleView key={currentIndex} index={currentIndex} />
          </div>

          <button
            aria-label="Next Module"
            className="z-20 w-12 h-12 md:w-14 md:h-14 rounded-full glass-card hover:bg-emerald-900/40 hover:border-emerald-400/60 hover:shadow-glow-md flex items-center justify-center text-slate-200 transition active:scale-95 mx-1 md:mx-3 flex-shrink-0"
            id="nextModuleBtn"
            onClick={() => { audioEngine.playTapChirp(520, 0.03); renderActiveModule(currentIndex + 1) }}
          >
            <svg className="w-6 h-6 transform translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
            </svg>
          </button>

          {/* Right Preview Card */}
          <div className="hidden xl:flex flex-col items-center cursor-pointer select-none card-right-perspective group w-64 ml-2" onClick={() => { audioEngine.playTapChirp(520, 0.03); renderActiveModule(currentIndex + 1) }} id="cardRightPreview" title={`Switch to ${rightLabel} Module`}>
            <div className="w-60 h-80 glass-card rounded-3xl p-4 overflow-hidden relative border-emerald-500/20 group-hover:border-emerald-400/50 shadow-2xl flex flex-col justify-end bg-gradient-to-b from-[#061814]/90 to-[#020b08]/95">
              <div className="absolute inset-x-2 top-2 bottom-12 rounded-2xl bg-[#09221a] overflow-hidden flex items-center justify-center border border-emerald-950 relative">
                <div className="absolute right-3 top-0 w-8 h-20 bg-emerald-600 border-2 border-emerald-900 rounded-b">
                  <div className="w-10 -ml-1 h-3 bg-emerald-500 border border-emerald-900 rounded-b"></div>
                </div>
                <div className="absolute right-3 bottom-0 w-8 h-28 bg-emerald-600 border-2 border-emerald-900 rounded-t">
                  <div className="w-10 -ml-1 h-3 bg-emerald-500 border border-emerald-900 rounded-t"></div>
                </div>
                <div className="w-7 h-6 bg-yellow-400 rounded-full border-2 border-amber-900 flex items-center justify-center relative shadow-md">
                  <div className="w-2 h-2 rounded-full bg-white absolute top-1 right-1 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-black"></div>
                  </div>
                  <div className="w-2.5 h-1.5 bg-orange-500 absolute -right-1 bottom-1 rounded-r"></div>
                </div>
              </div>
              <span className="text-sm font-semibold tracking-wider text-slate-300 group-hover:text-emerald-300 text-center uppercase transition" id="labelCardRight">{rightLabel}</span>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center space-x-2.5 mt-6 z-20">
          {MODULES.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-emerald-400' : 'bg-emerald-900/80 hover:bg-emerald-500'}`}
              onClick={() => renderActiveModule(idx)}
              data-goto-index={idx}
            />
          ))}
        </div>
      </main>

      {/* Modals */}
      <CalibrationModal open={calibOpen} onClose={() => setCalibOpen(false)} />
      <LogModal open={logOpen} onClose={() => setLogOpen(false)} />

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-xs font-mono text-emerald-500/60 flex flex-col sm:flex-row items-center justify-between border-t border-emerald-950/40 z-20">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>TapCanvas Acoustic Core v2.4</span>
          <span className="text-emerald-800">|</span>
          <span>4x Contact Piezo Triggers</span>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-4 text-slate-500">
          <span>Speed: 3300 m/s</span>
          <span>TDOA: Active</span>
          <span className="text-emerald-400 font-semibold">Ready for Desk Taps</span>
        </div>
      </footer>
    </div>
  )
}

function ModuleView({ index }) {
  const Module = MODULES[index].component
  return <Module />
}
