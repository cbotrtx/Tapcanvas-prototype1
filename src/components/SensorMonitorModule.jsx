import { useState, useEffect, useRef, useCallback } from 'react'
import { audioEngine } from '../utils/audioEngine'

const CH_COLORS = ['#34d399', '#2dd4bf', '#38bdf8', '#facc15']

export default function SensorMonitorModule() {
  const [frozen, setFrozen] = useState(false)
  const [phase, setPhase] = useState(0)
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const chData = [
    { id: 'ch1', label: 'CH1 (Top-Left)', color: 'text-emerald-400', delay: '0.00 μs', amp: '480 mV' },
    { id: 'ch2', label: 'CH2 (Top-Right)', color: 'text-teal-400', delay: '+42.1 μs', amp: '390 mV' },
    { id: 'ch3', label: 'CH3 (Btm-Left)', color: 'text-sky-400', delay: '+85.4 μs', amp: '210 mV' },
    { id: 'ch4', label: 'CH4 (Btm-Right)', color: 'text-yellow-400', delay: '+118.0 μs', amp: '160 mV' },
  ]

  const drawOscilloscope = useCallback(() => {
    if (frozen || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    setPhase((p) => p + 0.08)

    ctx.fillStyle = 'rgba(2, 11, 8, 0.35)'
    ctx.fillRect(0, 0, 800, 260)

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)'
    ctx.lineWidth = 1
    for (let x = 0; x < 800; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 260)
      ctx.stroke()
    }
    for (let y = 0; y < 260; y += 32) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(800, y)
      ctx.stroke()
    }

    for (let ch = 0; ch < 4; ch++) {
      ctx.strokeStyle = CH_COLORS[ch]
      ctx.lineWidth = 1.8
      ctx.beginPath()

      const channelCenterY = 40 + ch * 55
      const phaseOffset = ch * 0.45

      for (let x = 0; x < 800; x += 4) {
        const envelope = Math.sin((x * 0.008) + phase * 0.5)
        const wave = Math.sin(x * 0.05 - phase + phaseOffset) * 22 * envelope
        const noise = (Math.random() - 0.5) * 2.5
        const y = channelCenterY + wave + noise

        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    animRef.current = requestAnimationFrame(drawOscilloscope)
  }, [frozen, phase])

  useEffect(() => {
    drawOscilloscope()
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [drawOscilloscope])

  const toggleFreeze = useCallback(() => {
    setFrozen((p) => {
      const next = !p
      if (next) drawOscilloscope()
      return next
    })
  }, [])

  return (
    <div className="w-full flex-col items-center module-view" id="moduleSensorMonitor">
      <div className="w-full glass-card rounded-3xl p-6 md:p-8 border border-emerald-500/25 shadow-2xl flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center">
              <span>Piezoelectric TDOA Waveform Monitor</span>
              <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-xs text-slate-400">Real-time acoustic propagation analysis across 4 piezo contacts</p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">Trigger:</span>
            <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded text-emerald-300">Edge &gt; 120mV</span>
            <button
              className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40"
              id="freezeWaveformBtn"
              onClick={toggleFreeze}
            >
              {frozen ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>

        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-emerald-900/70 bg-[#020b08] shadow-inner mb-4">
          <canvas ref={canvasRef} className="w-full h-full block" height="260" id="scopeCanvas" width="800" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          {chData.map((ch) => (
            <div key={ch.id} className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/60">
              <div className={`font-bold mb-1 ${ch.color}`}>{ch.label}</div>
              <div className="text-slate-400">Delay: <span className="text-slate-200" id={`${ch.id}Delay`}>{ch.delay}</span></div>
              <div className="text-slate-400">Amp: <span className="text-slate-200" id={`${ch.id}Amp`}>{ch.amp}</span></div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-950 flex flex-wrap justify-between items-center text-xs font-mono text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <span>Classified Acoustic Pattern:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40" id="detectedGestureTag">
              Sharp Key Tap
            </span>
          </div>
          <div>
            <span>Hyperbolic Localization RMSE: <span className="text-teal-300">1.84 mm</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
