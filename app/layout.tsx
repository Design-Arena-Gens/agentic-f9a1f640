import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Agentic Health & Productivity',
  description: 'A focused dashboard for goals, habits, and wellbeing with AI assist.'
}

export default function RootLayout({ children }: { children: ReactNode }){
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-white/10">
          <div className="container flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
              <h1 className="text-lg font-semibold">Agentic Health & Productivity</h1>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <a className="hover:underline" href="/">Dashboard</a>
              <a className="hover:underline" href="#planner">Planner</a>
              <a className="hover:underline" href="#habits">Habits</a>
              <a className="hover:underline" href="#health">Health</a>
              <a className="hover:underline" href="#ai">AI</a>
            </nav>
          </div>
        </header>
        <main className="container py-8 space-y-8">{children}</main>
        <footer className="border-t border-white/10">
          <div className="container py-6 text-xs text-white/60">
            Built for you. Privacy-first, data in your browser.
          </div>
        </footer>
      </body>
    </html>
  )
}
