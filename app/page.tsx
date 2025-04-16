import { Clock } from "@/components/clock"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="z-10 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
          <ModeToggle />
        </div>

        <div className="grid gap-8">
          <Clock />
          <PomodoroTimer />
        </div>
      </div>
    </main>
  )
}
