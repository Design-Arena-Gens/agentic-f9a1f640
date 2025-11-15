"use client"

import { useEffect, useRef, useState } from 'react'

export type ChatMessage = { role: 'user' | 'assistant', content: string }

export function AIChat(){
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: 'Hi! I can help plan your day and keep you healthy. Tell me your top 1-3 priorities and how you\'re feeling today.'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send(){
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { role:'user', content: text } as ChatMessage]
    setMessages(next)
    setInput('')
    setLoading(true)
    try{
      const res = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: next.slice(-10) }) })
      const data = await res.json()
      setMessages(m => [...m, { role:'assistant', content: data.reply }])
    }catch{
      setMessages(m => [...m, { role:'assistant', content: 'I ran into a problem. Try again in a moment.' }])
    }finally{ setLoading(false) }
  }

  return (
    <section id="ai" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI Coach</h2>
        <div className="badge">Private ? On-demand</div>
      </div>
      <div className="card h-80 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] ${m.role==='user' ? 'ml-auto bg-primary/20' : 'bg-white/10'} rounded-lg px-3 py-2`}>{m.content}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Ask for a plan, ideas, or feedback..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} />
        <button className="btn" onClick={send} disabled={loading}>{loading ? 'Thinking...' : 'Send'}</button>
      </div>
    </section>
  )
}
