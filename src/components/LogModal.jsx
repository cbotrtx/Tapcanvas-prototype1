import { useState, useCallback } from 'react'

const INITIAL_LOGS = [
  { time: '10:14:22', target: 'Key A', coords: '342, 184', latency: '4.2 ms', confidence: '98.4%' },
  { time: '10:14:19', target: 'Key S', coords: '210, 201', latency: '5.1 ms', confidence: '97.8%' },
  { time: '10:14:15', target: 'Enter', coords: '580, 230', latency: '3.8 ms', confidence: '99.1%' },
  { time: '10:14:11', target: 'Key D', coords: '285, 201', latency: '4.9 ms', confidence: '98.2%' },
  { time: '10:14:08', target: 'Key F', coords: '362, 201', latency: '5.5 ms', confidence: '96.9%' },
]

export default function LogModal({ open, onClose }) {
  const [logs, setLogs] = useState(INITIAL_LOGS)

  if (!open) return null

  const clearLog = useCallback(() => {
    setLogs([])
  }, [])

  const exportCsv = useCallback(() => {
    const headers = 'Time,Target,Coords (X,Y),Latency,Confidence\n'
    const rows = logs.map((l) => `${l.time},${l.target},${l.coords},${l.latency},${l.confidence}`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tapcanvas-acoustic-events.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [logs])

  return (
    <dialog
      className="bg-transparent backdrop:bg-black/75 backdrop:backdrop-blur-sm p-4 w-full max-w-3xl rounded-3xl"
      data-purpose="tdoa-log-modal"
      id="logModal"
    >
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl relative text-slate-200">
        <div className="flex justify-between items-center pb-4 border-b border-emerald-900/60">
          <div>
            <h3 className="text-lg font-bold text-white">Acoustic Touch Event Stream</h3>
            <p className="text-xs text-slate-400">Captured time-difference of arrival log records</p>
          </div>
          <button
            className="w-8 h-8 rounded-lg hover:bg-emerald-900/40 text-slate-400 hover:text-white flex items-center justify-center font-bold"
            id="closeLogModalBtn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="my-4 max-h-72 overflow-y-auto rounded-xl border border-emerald-900/60 bg-black/50">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#051814] text-emerald-400 sticky top-0 border-b border-emerald-900/60">
              <tr>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Target</th>
                <th className="p-2.5">Coords (X, Y)</th>
                <th className="p-2.5">Latency</th>
                <th className="p-2.5">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 text-slate-300" id="eventLogTableBody">
              {logs.map((log, i) => (
                <tr key={i}>
                  <td className="p-2.5 text-slate-400">{log.time}</td>
                  <td className="p-2.5 font-bold text-emerald-300">{log.target}</td>
                  <td className="p-2.5 text-slate-300">{log.coords}</td>
                  <td className="p-2.5 text-teal-400">{log.latency}</td>
                  <td className="p-2.5 text-emerald-400">{log.confidence}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-2.5 text-slate-500 text-center">No events recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            className="px-3 py-1.5 rounded-xl bg-black/40 text-slate-400 hover:text-white text-xs border border-emerald-950"
            id="clearLogBtn"
            onClick={clearLog}
          >
            Clear Buffer
          </button>
          <button
            className="px-4 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-medium border border-emerald-500/40"
            id="exportCsvBtn"
            onClick={exportCsv}
          >
            Export CSV
          </button>
        </div>
      </div>
    </dialog>
  )
}
