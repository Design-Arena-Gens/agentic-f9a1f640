"use client"

import { useEffect, useMemo, useState } from 'react'
import { load, save } from './storage'

export type Task = {
  id: string
  title: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
  estimateMins: number
}

const KEY = 'tasks.v1'

export function TaskPlanner(){
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<'low'|'medium'|'high'>('medium')
  const [estimate, setEstimate] = useState<number>(30)

  useEffect(() => {
    setTasks(load<Task[]>(KEY, []))
  }, [])

  useEffect(() => { save(KEY, tasks) }, [tasks])

  function addTask(){
    const trimmed = title.trim()
    if (!trimmed) return
    setTasks(prev => [{ id: crypto.randomUUID(), title: trimmed, done: false, priority, estimateMins: Math.max(5, Math.min(240, estimate)) }, ...prev])
    setTitle('')
  }

  function toggle(id: string){ setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)) }
  function remove(id: string){ setTasks(prev => prev.filter(t => t.id !== id)) }

  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t => t.done).length
    const remainingMins = tasks.filter(t => !t.done).reduce((s,t) => s + t.estimateMins, 0)
    return { total, done, remainingMins }
  }, [tasks])

  return (
    <section id="planner" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daily Planner</h2>
        <div className="badge">{stats.done}/{stats.total} done ? ~{stats.remainingMins}m left</div>
      </div>
      <div className="card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input className="input md:col-span-3" placeholder="Add a task..." value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=> e.key==='Enter' && addTask()} />
          <select className="input" value={priority} onChange={e=> setPriority(e.target.value as any)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input className="input" type="number" min={5} max={240} step={5} value={estimate} onChange={e=> setEstimate(Number(e.target.value))} placeholder="Estimate (mins)" />
        </div>
        <button className="btn" onClick={addTask}>Add Task</button>
      </div>

      <ul className="grid gap-2">
        {tasks.map(task => (
          <li key={task.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={task.done} onChange={()=>toggle(task.id)} className="h-5 w-5" />
              <div>
                <div className={`font-medium ${task.done ? 'line-through opacity-60' : ''}`}>{task.title}</div>
                <div className="text-xs text-white/60">{task.estimateMins}m ? <span className={`capitalize ${task.priority==='high'?'text-red-300':task.priority==='medium'?'text-yellow-200':'text-white/60'}`}>{task.priority}</span></div>
              </div>
            </div>
            <button onClick={()=>remove(task.id)} className="text-white/60 hover:text-white text-sm">Remove</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
