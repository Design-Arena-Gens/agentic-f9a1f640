"use client"

import { useEffect, useMemo, useState } from 'react'
import { load, save } from './storage'

export type Habit = {
  id: string
  name: string
  targetPerWeek: number
  history: string[] // ISO dates when completed
}

const KEY = 'habits.v1'

export function HabitTracker(){
  const [habits, setHabits] = useState<Habit[]>([])
  const [name, setName] = useState('')
  const [target, setTarget] = useState(5)

  useEffect(()=>{ setHabits(load<Habit[]>(KEY, [])) }, [])
  useEffect(()=>{ save(KEY, habits) }, [habits])

  function addHabit(){
    const trimmed = name.trim()
    if (!trimmed) return
    setHabits(prev => [...prev, { id: crypto.randomUUID(), name: trimmed, targetPerWeek: Math.max(1, Math.min(14, target)), history: [] }])
    setName('')
  }

  function toggleToday(id: string){
    const today = new Date().toISOString().slice(0,10)
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const has = h.history.includes(today)
      return { ...h, history: has ? h.history.filter(d => d!==today) : [...h.history, today] }
    }))
  }

  function weeklyCount(history: string[]): number {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay()) // week start
    return history.filter(d => new Date(d) >= start).length
  }

  const adherence = useMemo(()=>{
    const items = habits.map(h => ({ name: h.name, pct: Math.min(100, Math.round(100 * weeklyCount(h.history) / h.targetPerWeek)) }))
    const avg = items.length ? Math.round(items.reduce((s,i)=>s+i.pct,0)/items.length) : 0
    return { items, avg }
  }, [habits])

  return (
    <section id="habits" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Habits</h2>
        <div className="badge">Avg adherence {adherence.avg}%</div>
      </div>
      <div className="card grid grid-cols-1 md:grid-cols-3 gap-2">
        <input className="input" placeholder="New habit (e.g., Read 20m)" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=> e.key==='Enter' && addHabit()} />
        <input className="input" type="number" min={1} max={14} value={target} onChange={e=> setTarget(Number(e.target.value))} placeholder="Target/week" />
        <button className="btn" onClick={addHabit}>Add Habit</button>
      </div>
      <ul className="grid gap-2">
        {habits.map(h => (
          <li key={h.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{h.name}</div>
              <div className="text-xs text-white/60">Target {h.targetPerWeek}/week ? This week {weeklyCount(h.history)}</div>
            </div>
            <button className="btn" onClick={()=>toggleToday(h.id)}>
              {h.history.includes(new Date().toISOString().slice(0,10)) ? 'Undo Today' : 'Done Today'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
