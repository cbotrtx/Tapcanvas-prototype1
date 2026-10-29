import { useState, useEffect, useCallback } from 'react'
import { audioEngine } from '../utils/audioEngine'

const NOTES = [
  { name: 'C', label: 'C' },
  { name: 'D', label: 'D' },
  { name: 'E', label: 'E' },
  { name: 'F', label: 'F' },
  { name: 'G', label: 'G' },
  { name: 'A', label: 'A' },
  { name: 'B', label: 'B' },
  { name: 'C2', label: 'C5' },
  { name: 'D2', label: 'D5' },
  { name: 'E2', label: 'E5' },
  { name: 'F2', label: 'F5' },
  { name: 'G2', label: 'G5' },
]

const BLACK_NOTES = [
  { name: 'C#', label: 'C#', left: '8' },
  { name: 'D#', label: 'D#', left: '20' },
  { name: 'F#', label: 'F#', left: '43' },
  { name: 'G#', label: 'G#', left: '55' },
  { name: 'A#', label: 'A#', left: '67' },
  { name: 'C#2', label: 'C#5', left: '91' },
  { name: 'D#2', label: 'D#5', left: '103' },
  { name: 'F#2', label: 'F#5', left: '127' },
]

export default function PianoModule() {
  const [octave, setOctave] = useState(4)
  const [volume, setVolume] = useState(0.5)
  const [lastNote, setLastNote] = useState('None')

  useEffect(() => {
    audioEngine.init()
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

  const playNote = useCallback((e, note) => {
    e.stopPropagation()
    const mult = Math.pow(2, octave - 4)
    audioEngine.playPianoNote(note, mult)
    spawnRipple(e.clientX, e.clientY)
    setLastNote(`${note} (Oct ${octave})`)
  }, [octave, spawnRipple])

  return (
    <div className="w-full flex-col items-center module-view" id="modulePiano">
      <div className="w-full glass-card rounded-3xl p-6 md:p-8 border border-emerald-500/25 shadow-2xl flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center">
              <span>Acoustic Wave Piano</span>
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">WebAudio PolySynth</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Vibration localized frequency trigger (Octaves 3 - 5)</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Octave:</span>
              <button
                className="px-2 py-1 rounded bg-[#0b2820] text-slate-200 border border-emerald-900"
                id="octaveDownBtn"
                onClick={() => setOctave((p) => (p > 2 ? p - 1 : 2))}
              >
                -
              </button>
              <span className="text-emerald-400 font-bold" id="octaveValue">{octave}</span>
              <button
                className="px-2 py-1 rounded bg-[#0b2820] text-slate-200 border border-emerald-900"
                id="octaveUpBtn"
                onClick={() => setOctave((p) => (p < 6 ? p + 1 : 6))}
              >
                +
              </button>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Vol:</span>
              <input
                className="w-20 accent-emerald-400"
                id="synthVolumeSlider"
                max="1"
                min="0"
                step="0.05"
                type="range"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="relative w-full h-64 select-none flex justify-center bg-black/60 p-3 rounded-2xl border border-emerald-900/60 shadow-inner overflow-x-auto" id="pianoTouchCanvas">
          <div className="flex h-full relative" id="pianoKeysContainer">
            {NOTES.map((note) => (
              <button
                key={note.name}
                className="piano-white-key w-12 md:w-14 h-full rounded-b-xl flex flex-col justify-end items-center pb-3 text-slate-700 font-bold text-xs -ml-1"
                data-note={note.name}
                onPointerDown={(e) => playNote(e, note.name)}
              >
                {note.label}
              </button>
            ))}
            {BLACK_NOTES.map((note) => (
              <button
                key={note.name}
                className={`piano-black-key absolute top-0 left-${note.left} md:left-${parseInt(note.left) + 1} w-7 md:w-8 h-36 rounded-b-lg text-slate-200 text-[10px] pb-2 font-mono flex items-end justify-center z-10`}
                data-note={note.name}
                onPointerDown={(e) => playNote(e, note.name)}
              >
                {note.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-xs font-mono text-slate-400 flex items-center justify-between w-full">
          <span>Touch desk at corresponding spots or press keys A-K / W,E,T,Y,U on computer</span>
          <span className="text-teal-300" id="pianoLastNoteText">Last Triggered: {lastNote}</span>
        </div>
      </div>
    </div>
  )
}
