import { useState } from 'react'

const MATERIALS = [
  { value: '3300', label: 'Oak / Hardwood (3,300 m/s)' },
  { value: '5100', label: 'Tempered Plate Glass (5,100 m/s)' },
  { value: '2100', label: 'MDF / Composite (2,100 m/s)' },
  { value: '2700', label: 'Polymethyl Acrylic (2,700 m/s)' },
  { value: '1200', label: 'Foam Core / Soft Board (1,200 m/s)' },
]

export default function CalibrationModal({ open, onClose }) {
  const [cornerStep, setCornerStep] = useState(1)

  const corners = [
    { id: 'cornerBox1', label: 'C1: Ready', active: cornerStep === 1 },
    { id: 'cornerBox2', label: 'C2: Pending', active: cornerStep === 2 },
    { id: 'cornerBox3', label: 'C3: Pending', active: cornerStep === 3 },
    { id: 'cornerBox4', label: 'C4: Pending', active: cornerStep === 4 },
  ]

  if (!open) return null

  return (
    <dialog
      className="bg-transparent backdrop:bg-black/75 backdrop:backdrop-blur-sm p-4 w-full max-w-2xl rounded-3xl"
      data-purpose="calibration-modal"
      id="calibrationModal"
    >
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl relative text-slate-200">
        <div className="flex justify-between items-center pb-4 border-b border-emerald-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">🎯</div>
            <div>
              <h3 className="text-lg font-bold text-white">4-Sensor Acoustic Calibration</h3>
              <p className="text-xs text-slate-400">Calibrate sound speed c &amp; time-difference parameters</p>
            </div>
          </div>
          <button
            className="w-8 h-8 rounded-lg hover:bg-emerald-900/40 text-slate-400 hover:text-white flex items-center justify-center font-bold"
            id="closeCalibrationModalBtn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 text-xs font-mono">
          <div>
            <label className="block text-slate-300 mb-1">Surface Substrate Material</label>
            <select className="w-full bg-[#051814] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-200 focus:border-emerald-400 focus:ring-0" id="calibMaterialSelect">
              {MATERIALS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Substrate Thickness (mm)</label>
            <input className="w-full bg-[#051814] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-200 focus:border-emerald-400 focus:ring-0" id="calibThickness" type="number" value="25" />
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Active Width (mm)</label>
            <input className="w-full bg-[#051814] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-200 focus:border-emerald-400 focus:ring-0" id="calibWidth" type="number" value="650" />
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Active Height (mm)</label>
            <input className="w-full bg-[#051814] border border-emerald-900/80 rounded-xl px-3 py-2 text-slate-200 focus:border-emerald-400 focus:ring-0" id="calibHeight" type="number" value="380" />
          </div>
        </div>

        <div className="bg-black/50 p-4 rounded-2xl border border-emerald-900/60 mb-5">
          <div className="text-xs font-mono text-emerald-400 mb-2 flex justify-between">
            <span>Guided Corner Verification:</span>
            <span id="calibCornerStepText">Tap Corner {cornerStep}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
            {corners.map((c) => (
              <div
                key={c.id}
                id={c.id}
                className={`p-2 rounded-lg text-center text-[10px] font-mono border ${c.active ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-black/40 text-slate-500 border-emerald-950'}`}
              >
                {c.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            className="px-4 py-2 rounded-xl bg-black/40 text-slate-400 hover:text-white text-xs border border-emerald-950"
            id="resetCalibBtn"
            onClick={() => setCornerStep(1)}
          >
            Reset To Default
          </button>
          <div className="space-x-2">
            <button
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-sm transition"
              id="saveCalibBtn"
              onClick={onClose}
            >
              Save Profile &amp; Apply
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
