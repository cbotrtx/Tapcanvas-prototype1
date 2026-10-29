import { useState, useRef, useCallback, useEffect } from 'react'
import { audioEngine } from '../utils/audioEngine'

export default function GameModule() {
  const [gameRunning, setGameRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const birdY = useRef(160)
  const birdVel = useRef(0)
  const pipes = useRef([])
  const frameCount = useRef(0)

  const gravity = 0.32
  const jumpPower = -5.8

  const resetGame = useCallback(() => {
    birdY.current = 160
    birdVel.current = 0
    pipes.current = []
    frameCount.current = 0
    setScore(0)
  }, [])

  const flapBird = useCallback(() => {
    if (!gameRunning) return
    birdVel.current = jumpPower
    audioEngine.playTapChirp(840, 0.05)
  }, [gameRunning])

  const endGame = useCallback(() => {
    setGameRunning(false)
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    audioEngine.playTapChirp(220, 0.2)
    if (score > highScore) setHighScore(score)
  }, [gameRunning, score, highScore])

  const gameLoop = useCallback(() => {
    if (!gameRunning || !canvasRef.current) return
    frameCount.current++

    birdVel.current += gravity
    birdY.current += birdVel.current

    const ctx = canvasRef.current.getContext('2d')
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 320)
    bgGrad.addColorStop(0, '#041510')
    bgGrad.addColorStop(1, '#092921')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 600, 320)

    if (frameCount.current % 110 === 0) {
      const gap = 90
      const topHeight = Math.floor(Math.random() * (160 - 40)) + 40
      pipes.current.push({
        x: 600,
        top: topHeight,
        bottom: 320 - topHeight - gap,
        passed: false,
      })
    }

    for (let i = pipes.current.length - 1; i >= 0; i--) {
      const p = pipes.current[i]
      p.x -= 2.2

      ctx.fillStyle = '#059669'
      ctx.fillRect(p.x, 0, 46, p.top)
      ctx.fillRect(p.x, 320 - p.bottom, 46, p.bottom)

      ctx.fillStyle = '#10b981'
      ctx.fillRect(p.x - 3, p.top - 12, 52, 12)
      ctx.fillRect(p.x - 3, 320 - p.bottom, 52, 12)

      if (!p.passed && p.x < 100) {
        p.passed = true
        setScore((s) => {
          const ns = s + 1
          if (ns > highScore) setHighScore(ns)
          audioEngine.playTapChirp(1100, 0.04)
          return ns
        })
      }

      if (
        100 + 16 > p.x && 100 - 16 < p.x + 46 &&
        (birdY.current - 14 < p.top || birdY.current + 14 > 320 - p.bottom)
      ) {
        endGame()
        return
      }

      if (p.x + 50 < 0) {
        pipes.current.splice(i, 1)
      }
    }

    if (birdY.current > 306 || birdY.current < 10) {
      endGame()
      return
    }

    ctx.save()
    ctx.translate(100, birdY.current)
    ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdVel.current * 0.08)))

    ctx.fillStyle = '#facc15'
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#78350f'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(-4, 2, 7, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(6, -4, 4.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(7.5, -4, 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#f97316'
    ctx.beginPath()
    ctx.moveTo(10, 0)
    ctx.lineTo(18, 2)
    ctx.lineTo(10, 6)
    ctx.closePath()
    ctx.fill()

    ctx.restore()

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameRunning, highScore, endGame])

  useEffect(() => {
    if (gameRunning) {
      animationRef.current = requestAnimationFrame(gameLoop)
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [gameRunning, gameLoop])

  const startGame = useCallback(() => {
    resetGame()
    setGameRunning(true)
    const overlay = document.getElementById('gameOverlayScreen')
    if (overlay) overlay.classList.add('hidden')
  }, [resetGame])

  const handleCanvasTap = useCallback((e) => {
    const overlay = document.getElementById('rippleOverlay')
    if (overlay) {
      const ripple = document.createElement('div')
      ripple.className = 'acoustic-ripple'
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`
      overlay.appendChild(ripple)
      setTimeout(() => ripple.remove(), 650)
    }
    flapBird()
  }, [flapBird])

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && gameRunning) {
      e.preventDefault()
      flapBird()
    }
  }, [gameRunning, flapBird])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="w-full flex-col items-center module-view" id="moduleGame">
      <div className="w-full glass-card rounded-3xl p-6 md:p-7 border border-emerald-500/25 shadow-2xl flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center">
              <span>Acoustic Surface Arcade: Flappy Tap</span>
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Tap Physical Desk To Jump</span>
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm text-slate-300">Score: <span className="text-emerald-400 font-bold text-base" id="gameScoreVal">{score}</span></span>
            <span className="font-mono text-sm text-slate-400">Best: <span className="text-teal-300" id="gameHighScoreVal">{highScore}</span></span>
            <button
              className="px-3 py-1 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 rounded-lg text-xs font-medium border border-emerald-500/30"
              id="resetGameBtn"
              onClick={startGame}
            >
              Restart
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-2xl h-80 rounded-2xl overflow-hidden border border-emerald-900/60 bg-[#061814] shadow-2xl flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-pointer"
            height="320"
            id="flappyCanvas"
            width="600"
            onPointerDown={handleCanvasTap}
          />
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 ${gameRunning ? 'hidden' : ''}`}
            id="gameOverlayScreen"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl mb-3 shadow-glow-sm">
              ⚡
            </div>
            <h4 className="text-xl font-bold text-white mb-1">Desk Vibration Trigger</h4>
            <p className="text-xs text-slate-300 max-w-md mb-4">
              Tap on your physical surface (or click anywhere on canvas) to send an impulse acoustic wave and flap the pixel bird!
            </p>
            <button
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-glow-md transition active:scale-95"
              id="startGameBtn"
              onClick={startGame}
            >
              Start Arcade
            </button>
          </div>
        </div>

        <div className="w-full flex justify-between items-center mt-3 text-xs font-mono text-slate-400">
          <span>Threshold Piezo Impulse: <span className="text-emerald-400">&gt; 350 mV</span></span>
          <span>Acoustic Tap Sensitivity: <span className="text-emerald-300">Adaptive GCC-PHAT</span></span>
        </div>
      </div>
    </div>
  )
}
