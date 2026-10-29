import { useState } from 'react'
import { audioEngine } from '../utils/audioEngine'

export default function SmartControlsModule() {
  const [lightState, setLightState] = useState(false)

  const toggleLight = () => {
    setLightState((p) => {
      audioEngine.playTapChirp(p ? 440 : 880, 0.04)
      return !p
    })
  }

  const zones = [
    {
      id: 'zoneLight',
      icon: '💡',
      region: 'Region A',
      title: 'Desk Backlight',
      desc: 'Double knock to toggle ambient glow',
      status: lightState ? 'ACTIVE' : 'OFF',
      dotClass: lightState ? 'bg-emerald-400 shadow-glow-sm' : 'bg-slate-600',
      onClick: toggleLight,
    },
    {
      id: 'zoneVolume',
      icon: '🔊',
      region: 'Region B',
      title: 'Volume Slider',
      desc: 'Swipe right/left to adjust system gain',
      status: '68%',
      dotClass: 'bg-slate-600',
      onClick: () => audioEngine.playTapChirp(620, 0.04),
    },
    {
      id: 'zoneMug',
      icon: '☕',
      region: 'Region C',
      title: 'Coffee Coaster',
      desc: 'Detects cup placement acoustic signature',
      status: 'Detected',
      statusClass: 'text-emerald-400 font-semibold',
      dotClass: 'bg-slate-600',
      onClick: () => audioEngine.playTapChirp(620, 0.04),
    },
    {
      id: 'zoneFocus',
      icon: '⏱️',
      region: 'Region D',
      title: 'Pomodoro Lock',
      desc: 'Triple tap to start 25m focus sprint',
      status: '25:00',
      statusClass: 'text-teal-300 font-bold',
      dotClass: 'bg-slate-600',
      onClick: () => audioEngine.playTapChirp(620, 0.04),
    },
  ]

  return (
    <div className="w-full flex-col items-center module-view" id="moduleSmartControls">
      <div className="w-full glass-card rounded-3xl p-6 md:p-8 border border-emerald-500/25 shadow-2xl flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Smart Surface Zone Automation</h3>
            <p className="text-xs text-slate-400">Assign physical desk boundaries to IoT macros and media controls</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">4 Active Bound Regions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              id={zone.id}
              className="p-4 rounded-2xl bg-black/40 border border-emerald-900/60 hover:border-emerald-400/50 transition cursor-pointer flex flex-col justify-between h-44"
              onClick={zone.onClick}
            >
              <div className="flex justify-between items-start">
                <span className="text-2xl">{zone.icon}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">{zone.region}</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{zone.title}</h4>
                <p className="text-[11px] text-slate-400">{zone.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-emerald-950/80">
                {zone.id === 'zoneVolume' ? (
                  <>
                    <div className="w-full bg-emerald-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-full w-2/3"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>Mute</span>
                      <span className="text-emerald-300">{zone.status}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className={`text-xs font-mono text-slate-400 status-label`}>Status: {zone.id === 'zoneLight' ? (lightState ? 'ACTIVE' : 'OFF') : zone.status}</span>
                    <div className={`w-3 h-3 rounded-full indicator-dot ${zone.dotClass}`}></div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 rounded-xl bg-[#03110d] border border-emerald-900/50 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-slate-400">
          <span>Dynamic Boundary Editor: Click any zone above to simulate physical placement</span>
          <button
            className="mt-2 sm:mt-0 px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
            id="addSmartZoneBtn"
          >
            + New Desk Zone
          </button>
        </div>
      </div>
    </div>
  )
}
