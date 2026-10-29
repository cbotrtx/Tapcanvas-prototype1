import { useState, useEffect, useCallback } from 'react'
import { audioEngine } from '../utils/audioEngine'

const KEYS = [
  { row: 1, keys: [
    { label: 'Esc', key: 'Escape', span: 1 },
    { label: '1', key: '1', shift: '!', span: 1 },
    { label: '2', key: '2', shift: '@', span: 1 },
    { label: '3', key: '3', shift: '#', span: 1 },
    { label: '4', key: '4', shift: '$', span: 1 },
    { label: '5', key: '5', shift: '%', span: 1 },
    { label: '6', key: '6', shift: '^', span: 1 },
    { label: '7', key: '7', shift: '&', span: 1 },
    { label: '8', key: '8', shift: '*', span: 1 },
    { label: '9', key: '9', shift: '(', span: 1 },
    { label: '0', key: '0', shift: ')', span: 1 },
    { label: '-', key: '-', shift: '_', span: 1 },
    { label: '=', key: '=', shift: '+', span: 1 },
    { label: 'Backspace', key: 'Backspace', span: 1.5, wide: true },
  ]},
  { row: 2, keys: [
    { label: 'Tab', key: 'Tab', span: 1.25 },
    { label: 'Q', key: 'q', span: 1 },
    { label: 'W', key: 'w', span: 1 },
    { label: 'E', key: 'e', span: 1 },
    { label: 'R', key: 'r', span: 1 },
    { label: 'T', key: 't', span: 1 },
    { label: 'Y', key: 'y', span: 1 },
    { label: 'U', key: 'u', span: 1 },
    { label: 'I', key: 'i', span: 1 },
    { label: 'O', key: 'o', span: 1 },
    { label: 'P', key: 'p', span: 1 },
    { label: '[', key: '[', shift: '{', span: 1 },
    { label: ']', key: ']', shift: '}', span: 1 },
    { label: '\\', key: '\\', shift: '|', span: 1 },
  ]},
  { row: 3, keys: [
    { label: 'Caps', key: 'CapsLock', span: 1.5 },
    { label: 'A', key: 'a', span: 1 },
    { label: 'S', key: 's', span: 1 },
    { label: 'D', key: 'd', span: 1 },
    { label: 'F', key: 'f', span: 1 },
    { label: 'G', key: 'g', span: 1 },
    { label: 'H', key: 'h', span: 1 },
    { label: 'J', key: 'j', span: 1 },
    { label: 'K', key: 'k', span: 1 },
    { label: 'L', key: 'l', span: 1 },
    { label: ';', key: ';', shift: ':', span: 1 },
    { label: "'", key: "'", shift: '"', span: 1 },
    { label: 'Enter', key: 'Enter', span: 2, enter: true },
  ]},
  { row: 4, keys: [
    { label: 'Shift', key: 'Shift', span: 2 },
    { label: 'Z', key: 'z', span: 1 },
    { label: 'X', key: 'x', span: 1 },
    { label: 'C', key: 'c', span: 1 },
    { label: 'V', key: 'v', span: 1 },
    { label: 'B', key: 'b', span: 1 },
    { label: 'N', key: 'n', span: 1 },
    { label: 'M', key: 'm', span: 1 },
    { label: ',', key: ',', shift: '<', span: 1 },
    { label: '.', key: '.', shift: '>', span: 1 },
    { label: '/', key: '/', shift: '?', span: 1 },
    { label: 'Shift', key: 'Shift', span: 2 },
  ]},
  { row: 5, keys: [
    { label: 'Ctrl', key: 'Control', span: 1.25 },
    { label: 'Alt', key: 'Alt', span: 1.25 },
    { label: 'Acoustic Spacebar', key: ' ', span: 6, spacebar: true },
    { label: 'Alt', key: 'Alt', span: 1.25 },
    { label: '', key: 'ContextMenu', icon: true, span: 1 },
    { label: 'Ctrl', key: 'Control', span: 1.25 },
  ]},
]

export default function KeyboardModule() {
  const [textBuffer, setTextBuffer] = useState('')
  const [coord, setCoord] = useState('X: 342, Y: 184')
  const [confidence, setConfidence] = useState('98.4%')
  const [activeKey, setActiveKey] = useState(null)

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

  const recordEvent = useCallback((keyLabel, x, y) => {
    const randConf = (97.5 + Math.random() * 2.4).toFixed(1)
    setCoord(`X: ${x}, Y: ${y}`)
    setConfidence(`${randConf}%`)
  }, [])

  const handleKeyTrigger = useCallback((keyVal, element = null) => {
    audioEngine.playTapChirp(600 + Math.random() * 120, 0.035)

    setTextBuffer((prev) => {
      let next = prev
      if (keyVal === 'Backspace') next = prev.slice(0, -1)
      else if (keyVal === 'Enter') next += ' \n'
      else if (keyVal === 'Tab') next += '   '
      else if (keyVal === 'Escape') next = ''
      else if (keyVal.length === 1) next += keyVal
      return next
    })

    if (element) {
      setActiveKey(keyVal)
      setTimeout(() => setActiveKey(null), 120)
    }
  }, [])

  const handleKeyClick = useCallback((e, keyVal) => {
    const keyEl = e.currentTarget
    const rect = keyEl.getBoundingClientRect()
    const normX = Math.round(rect.left + rect.width / 2)
    const normY = Math.round(rect.top + rect.height / 2)
    spawnRipple(e.clientX, e.clientY)
    handleKeyTrigger(keyVal, keyEl)
    recordEvent(keyVal, normX, normY)
  }, [spawnRipple, handleKeyTrigger, recordEvent])

  const handleKeyDown = useCallback((e) => {
    const keyMap = {
      ' ': ' ',
      Escape: 'Escape',
      Backspace: 'Backspace',
      Enter: 'Enter',
      Tab: 'Tab',
    }
    const keyVal = keyMap[e.key] || e.key
    const matchedBtn = document.querySelector(`.keycap[data-key="${keyVal}"]`)
    if (matchedBtn) {
      const rect = matchedBtn.getBoundingClientRect()
      spawnRipple(rect.left + rect.width / 2, rect.top + rect.height / 2)
      handleKeyTrigger(e.key, matchedBtn)
      recordEvent(e.key, Math.round(rect.left), Math.round(rect.top))
    }
  }, [spawnRipple, handleKeyTrigger, recordEvent])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const clearBuffer = () => {
    setTextBuffer('')
  }

  return (
    <div className="w-full flex flex-col items-center module-view" id="moduleKeyboard">
      <div className="w-full glass-card rounded-3xl p-4 sm:p-6 md:p-7 border border-emerald-500/25 shadow-2xl relative overflow-hidden">
        <div className="relative w-full cursor-crosshair" id="keyboardTapSurface">
          <div className="absolute -top-1 -left-1 flex items-center space-x-1 pointer-events-none opacity-60">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[9px] font-mono text-emerald-400">S1(0,0)</span>
          </div>
          <div className="absolute -top-1 -right-1 flex items-center space-x-1 pointer-events-none opacity-60">
            <span className="text-[9px] font-mono text-emerald-400">S2(W,0)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="absolute -bottom-1 -left-1 flex items-center space-x-1 pointer-events-none opacity-60">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[9px] font-mono text-emerald-400">S3(0,H)</span>
          </div>
          <div className="absolute -bottom-1 -right-1 flex items-center space-x-1 pointer-events-none opacity-60">
            <span className="text-[9px] font-mono text-emerald-400">S4(W,H)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>

          <div className="grid gap-1.5 sm:gap-2 text-[11px] sm:text-xs select-none font-sans font-medium pt-3 pb-1">
            {KEYS.map((row, rIdx) => (
              <div key={rIdx} className="flex space-x-1 sm:space-x-1.5 w-full">
                {row.keys.map((key, kIdx) => {
                  const isEnter = activeKey === key.key && key.enter
                  const isActive = activeKey === key.key && !key.enter
                  const baseCls = key.enter ? 'keycap keycap-enter' : 'keycap'
                  const activeCls = key.enter ? (isEnter ? 'active-key' : '') : (isActive ? 'active-key' : '')
                  const wCls = key.wide ? 'w-16 sm:w-24' : key.spacebar ? 'flex-1' : `w-${Math.round(key.span * 11)} sm:w-${Math.round(key.span * 14)}`
                  return (
                    <button
                      key={kIdx}
                      className={`${baseCls} ${activeCls} ${wCls} h-11 sm:h-12 rounded-xl flex items-center justify-center ${key.enter ? 'font-semibold' : key.spacebar ? 'text-slate-500 text-xs' : 'font-normal'}`}
                      data-key={key.key}
                      onPointerDown={(e) => handleKeyClick(e, key.key)}
                    >
                      {key.icon ? (
                        <svg className="w-4 h-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      ) : key.shift ? (
                        <>
                          <span className="text-[10px] opacity-75">{key.shift}</span>
                          <span>{key.label}</span>
                        </>
                      ) : (
                        key.label
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 w-full sm:w-2/3">
            <span className="text-emerald-400 font-mono text-[11px] whitespace-nowrap">SURFACE BUFFER:</span>
            <div className="flex-1 bg-black/40 rounded-xl px-3 py-1.5 font-mono text-slate-200 truncate border border-emerald-950/70">
              {textBuffer || 'Tap physical desk or click keys...'}
            </div>
            <button
              className="px-2 py-1 bg-emerald-950/50 hover:bg-emerald-900/60 rounded-lg text-slate-400 hover:text-white transition"
              id="clearBufferBtn"
              onClick={clearBuffer}
            >
              Clear
            </button>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
            <span>EST: <span className="text-teal-300" id="telemetryCoord">{coord}</span></span>
            <span>CONF: <span className="text-emerald-400" id="telemetryConfidence">{confidence}</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
