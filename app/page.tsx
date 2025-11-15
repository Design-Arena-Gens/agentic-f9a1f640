import { TaskPlanner } from './components/TaskPlanner'
import { HabitTracker } from './components/HabitTracker'
import { HealthLog } from './components/HealthLog'
import { AIChat } from './components/AIChat'

export default function Page(){
  return (
    <div className="space-y-10">
      <section className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Focus Score</h2>
          <p className="text-white/80 text-sm">Use planner, habits, and health to maximize your daily focus. Aim for 3 high-impact tasks, 1 recovery habit, and enough sleep.</p>
          <ul className="mt-3 text-sm list-disc list-inside text-white/70">
            <li>Start with one 60?90m deep-work block</li>
            <li>Schedule breaks every 50m</li>
            <li>Walk 5?10k steps; hydrate</li>
          </ul>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Today</h2>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-lg bg-white/10 p-3">
              <div className="text-white/60">Energy</div>
              <div className="text-2xl font-semibold">?</div>
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <div className="text-white/60">Sleep</div>
              <div className="text-2xl font-semibold">7?8h</div>
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <div className="text-white/60">Movement</div>
              <div className="text-2xl font-semibold">6?10k</div>
            </div>
          </div>
        </div>
      </section>

      <TaskPlanner />
      <HabitTracker />
      <HealthLog />
      <AIChat />
    </div>
  )
}
