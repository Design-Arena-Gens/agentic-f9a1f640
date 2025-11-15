"use client"

import { useEffect, useMemo, useState } from 'react'
import { load, save } from './storage'

type Entry = {
  id: string
  date: string // YYYY-MM-DD
  sleepHours: number
  steps: number
  mood: 1|2|3|4|5
  energy: 1|2|3|4|5
}

const KEY = 'healthlog.v1'

export function HealthLog(){
  const [entries, setEntries] = useState<Entry[]>([])
  const [today, setToday] = useState<string>(new Date().toISOString().slice(0,10))
  const [sleep, setSleep] = useState<number>(7)
  const [steps, setSteps] = useState<number>(6000)
  const [mood, setMood] = useState<Entry['mood']>(3)
  const [energy, setEnergy] = useState<Entry['energy']>(3)

  useEffect(()=>{ setEntries(load<Entry[]>(KEY, [])) }, [])
  useEffect(()=>{ save(KEY, entries) }, [entries])

  function upsert(){
    setEntries(prev => {
      const others = prev.filter(e=>e.date!==today)
      return [{ id: crypto.randomUUID(), date: today, sleepHours: sleep, steps, mood, energy }, ...others].sort((a,b)=> b.date.localeCompare(a.date))
    })
  }

  const last7 = useMemo(()=> entries.slice(0,7).reverse(), [entries])
  const avg = useMemo(()=>{
    if (!entries.length) return { sleep: 0, steps: 0, mood: 0, energy: 0 }
    const n = Math.min(7, entries.length)
    const s = entries.slice(0,n)
    const sum = s.reduce((acc, e)=> ({
      sleep: acc.sleep + e.sleepHours,
      steps: acc.steps + e.steps,
      mood: acc.mood + e.mood,
      energy: acc.energy + e.energy
    }), { sleep:0, steps:0, mood:0, energy:0 })
    return { sleep: +(sum.sleep/n).toFixed(1), steps: Math.round(sum.steps/n), mood: Math.round(sum.mood/n), energy: Math.round(sum.energy/n) }
  }, [entries])

  return (
    <section id="health" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Health Log</h2>
        <div className="badge">7d avg: {avg.sleep}h ? {avg.steps} steps ? mood {avg.mood}/5 ? energy {avg.energy}/5</div>
      </div>

      <div className="card grid grid-cols-2 md:grid-cols-6 gap-2">
        <input className="input md:col-span-2" type="date" value={today} onChange={e=>setToday(e.target.value)} />
        <input className="input" type="number" min={0} max={24} step={0.5} value={sleep} onChange={e=> setSleep(Number(e.target.value))} placeholder="Sleep hours" />
        <input className="input" type="number" min={0} step={100} value={steps} onChange={e=> setSteps(Number(e.target.value))} placeholder="Steps" />
        <select className="input" value={mood} onChange={e=> setMood(Number(e.target.value) as any)}>
          {[1,2,3,4,5].map(v=> <option key={v} value={v}>Mood {v}</option>)}
        </select>
        <select className="input" value={energy} onChange={e=> setEnergy(Number(e.target.value) as any)}>
          {[1,2,3,4,5].map(v=> <option key={v} value={v}>Energy {v}</option>)}
        </select>
        <button className="btn md:col-span-6" onClick={upsert}>Save Today</button>
      </div>

      <div className="card">
        <div className="text-sm mb-2">Last 7 entries</div>
        <div className="grid grid-cols-7 gap-2 items-end h-40">
          {last7.map((e, idx)=> (
            <div key={e.id} className="flex flex-col items-center gap-1">
              <div title={`Sleep ${e.sleepHours}h`} className="w-8 bg-blue-500/70 rounded" style={{ height: `${(e.sleepHours/10)*100}%` }} />
              <div title={`Steps ${e.steps}`} className="w-8 bg-emerald-500/70 rounded" style={{ height: `${Math.min(100, (e.steps/12000)*100)}%` }} />
              <div className="text-[10px] text-white/60">{new Date(e.date).toLocaleDateString(undefined, { month:'numeric', day:'numeric'})}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-white/70">Bars show sleep (blue) and steps (green).</div>
      </div>
    </section>
  )
}
