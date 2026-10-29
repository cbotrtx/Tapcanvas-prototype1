import { useState, useRef, useCallback } from 'react'
import { audioEngine } from '../utils/audioEngine'

export default function DrawingModule() {
  const [color, setColor] = useState('#34d399')
  const [size, setSize] = useState(4)
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)

  const colors = [
    { hex: '#34d399', label: 'Emerald' },
    { hex: '#2dd4bf', label: 'Teal' },
    { hex: '#38bdf8', label: 'Sky' },
    { hex: '#f43f5e', label: 'Rose' },
    { hex: '#facc15', label: 'Amber' },
  ]

  const startDraw = useCallback((e) => {
    isDrawing.current = true
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.moveTo(x, y)
  }, [])

  const drawMove = useCallback((e) => {
    if (!isDrawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = color
    ctx.shadowBlur = 12

    ctx.lineTo(x, y)
    ctx.stroke()
  }, [color, size])

  const stopDraw = useCallback(() => {
    isDrawing.current = false
  }, [])

  const clearDrawing = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }, [])

  const saveDrawing = useCallback(() => {
    const link = document.createElement('a')
    link.download = 'tapcanvas-acoustic-sketch.png'
    link.href = canvasRef.current?.toDataURL() || ''
    link.click()
  }, [])

  const spawnRipple = useCallback((x, y) => {
    const overlay = document.getElementById('rippleOverlay')
    if (!overlay) return
    const ripple = document.createElement('div')
    ripple.className = 'acoustic-ripple'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    overlay.appendChild(ripple)
    setTimeout(() => ripple.remove(), 650)
  }, [])

  return (
    <div className="w-full flex-col items-center module-view" id="moduleDrawing">
      <div className="w-full glass-card rounded-3xl p-6 md:p-7 border border-emerald-500/25 shadow-2xl flex flex-col items-center">
        <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Neon Acoustic Whiteboard</h3>
            <p className="text-xs text-slate-400">Trace your finger across the calibrated desk surface</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 p-1 bg-black/40 rounded-xl border border-emerald-900/60">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  className={`draw-color-btn w-6 h-6 rounded-lg ${color === c.hex ? 'ring-2 ring-white/80' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColor(c.hex)}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono px-2 py-1 bg-black/40 rounded-xl border border-emerald-900/60">
              <span className="text-slate-400">Size:</span>
              <input
                className="w-16 accent-emerald-400"
                id="drawSizeSlider"
                max="24"
                min="2"
                type="range"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
              />
            </div>
            <button
              className="px-3 py-1.5 rounded-xl bg-emerald-950 text-slate-300 hover:text-white hover:bg-emerald-900 text-xs border border-emerald-900/80"
              id="clearDrawingBtn"
              onClick={clearDrawing}
            >
              Clear
            </button>
            <button
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-medium border border-emerald-500/30"
              id="saveDrawingBtn"
              onClick={saveDrawing}
            >
              Export PNG
            </button>
          </div>
        </div>

        <div
          className="relative w-full h-80 rounded-2xl overflow-hidden border border-emerald-900/60 bg-[#020b08] shadow-inner cursor-crosshair"
          onPointerDown={(e) => { startDraw(e); spawnRipple(e.clientX, e.clientY) }}
          onPointerMove={drawMove}
          onPointerUp={stopDraw}
        >
          <canvas ref={canvasRef} className="w-full h-full block" height="340" id="paintCanvas" width="800" />
        </div>

        <div className="w-full flex justify-between items-center mt-3 text-xs font-mono text-slate-400">
          <span>Continuous Acoustic Localization: <span className="text-emerald-400">Time-Frequency Tracking</span></span>
          <span className="text-teal-300" id="drawCoordsText">X: -, Y: -</span>
        </div>
      </div>
    </div>
  )
}
