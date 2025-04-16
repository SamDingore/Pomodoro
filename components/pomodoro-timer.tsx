"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTimerSession } from "@/hooks/use-timer-session"

type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

export function PomodoroTimer() {
  const router = useRouter()
  const { toast } = useToast()
  const { timerSettings, saveSession } = useTimerSession()

  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [timeLeft, setTimeLeft] = useState(timerSettings.pomodoro * 60)
  const [isActive, setIsActive] = useState(false)
  const [sessions, setSessions] = useState(0)

  // Reset timer when mode changes
  useEffect(() => {
    const duration = timerSettings[mode] * 60
    setTimeLeft(duration)
    setIsActive(false)
  }, [mode, timerSettings])

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)

      // Play notification sound
      const audio = new Audio("/notification.mp3")
      audio.play().catch((err) => console.error("Error playing sound:", err))

      // Show notification
      toast({
        title: `${mode === "pomodoro" ? "Work session" : "Break"} completed!`,
        description: "Time to take a break!",
      })

      // Handle session completion
      if (mode === "pomodoro") {
        const newSessions = sessions + 1
        setSessions(newSessions)
        saveSession({
          timestamp: new Date().toISOString(),
          duration: timerSettings.pomodoro,
          mode: "pomodoro",
        })

        // After 4 pomodoro sessions, take a long break
        if (newSessions % 4 === 0) {
          setMode("longBreak")
        } else {
          setMode("shortBreak")
        }
      } else {
        setMode("pomodoro")
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, mode, sessions, timerSettings, toast, saveSession])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setTimeLeft(timerSettings[mode] * 60)
    setIsActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateProgress = () => {
    const totalSeconds = timerSettings[mode] * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Focus Timer</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs
          defaultValue="pomodoro"
          value={mode}
          onValueChange={(value) => setMode(value as TimerMode)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak">Long Break</TabsTrigger>
          </TabsList>

          <TabsContent value="pomodoro" className="mt-6">
            <div className="flex flex-col items-center">
              <div className="text-7xl font-bold mb-6">{formatTime(timeLeft)}</div>
              <Progress value={calculateProgress()} className="w-full h-2" />
            </div>
          </TabsContent>

          <TabsContent value="shortBreak" className="mt-6">
            <div className="flex flex-col items-center">
              <div className="text-7xl font-bold mb-6">{formatTime(timeLeft)}</div>
              <Progress value={calculateProgress()} className="w-full h-2" />
            </div>
          </TabsContent>

          <TabsContent value="longBreak" className="mt-6">
            <div className="flex flex-col items-center">
              <div className="text-7xl font-bold mb-6">{formatTime(timeLeft)}</div>
              <Progress value={calculateProgress()} className="w-full h-2" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 pt-2">
        <Button variant="outline" size="icon" onClick={resetTimer}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          onClick={toggleTimer}
          className={cn("w-32", isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")}
        >
          {isActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Start
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
