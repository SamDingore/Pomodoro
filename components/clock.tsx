"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTimerSession } from "@/hooks/use-timer-session"
import { Sun, Moon } from "lucide-react"

export function Clock() {
  const [time, setTime] = useState(new Date())
  const { timerSettings } = useTimerSession()

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  const formattedHours = hours.toString().padStart(2, "0")
  const formattedMinutes = minutes.toString().padStart(2, "0")
  const formattedSeconds = seconds.toString().padStart(2, "0")

  // Parse wake up and bed time
  const parseTimeString = (timeString: string): { hours: number; minutes: number } => {
    const [hoursStr, minutesStr] = timeString.split(":")
    return {
      hours: Number.parseInt(hoursStr, 10),
      minutes: Number.parseInt(minutesStr, 10),
    }
  }

  const wakeUp = parseTimeString(timerSettings.wakeUpTime || "07:00")
  const bedTime = parseTimeString(timerSettings.bedTime || "23:00")

  // Convert times to minutes since midnight for easier comparison
  const currentTimeInMinutes = hours * 60 + minutes
  const wakeUpTimeInMinutes = wakeUp.hours * 60 + wakeUp.minutes
  const bedTimeInMinutes = bedTime.hours * 60 + bedTime.minutes

  // Calculate active day duration in minutes
  let activeDayDuration = bedTimeInMinutes - wakeUpTimeInMinutes
  if (activeDayDuration <= 0) {
    // Handle case where bed time is on the next day
    activeDayDuration += 24 * 60
  }

  // Calculate progress percentage
  let dayProgressPercentage = 0
  let dayStatus = ""

  const isOvernight = bedTimeInMinutes <= wakeUpTimeInMinutes

  let isInActiveDay = false
  let minutesSinceWakeUp = 0

  if (isOvernight) {
    // Active day spans midnight
    if (
      currentTimeInMinutes >= wakeUpTimeInMinutes ||
      currentTimeInMinutes < bedTimeInMinutes
    ) {
      isInActiveDay = true
      if (currentTimeInMinutes >= wakeUpTimeInMinutes) {
        minutesSinceWakeUp = currentTimeInMinutes - wakeUpTimeInMinutes
      } else {
        minutesSinceWakeUp = (24 * 60 - wakeUpTimeInMinutes) + currentTimeInMinutes
      }
    }
  } else {
    // Active day within same day
    if (
      currentTimeInMinutes >= wakeUpTimeInMinutes &&
      currentTimeInMinutes < bedTimeInMinutes
    ) {
      isInActiveDay = true
      minutesSinceWakeUp = currentTimeInMinutes - wakeUpTimeInMinutes
    }
  }

  if (isInActiveDay) {
    dayProgressPercentage = (minutesSinceWakeUp / activeDayDuration) * 100
    dayStatus = "Active day in progress"
  } else if (
    (!isOvernight && currentTimeInMinutes >= bedTimeInMinutes) ||
    (isOvernight && currentTimeInMinutes >= bedTimeInMinutes && currentTimeInMinutes < wakeUpTimeInMinutes)
  ) {
    dayProgressPercentage = 100
    dayStatus = "After bed time"
  } else {
    dayProgressPercentage = 0
    dayStatus = "Before wake up time"
  }


  // Format times for display
  const formatTimeForDisplay = (hours: number, minutes: number): string => {
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  const wakeUpTimeDisplay = formatTimeForDisplay(wakeUp.hours, wakeUp.minutes)
  const bedTimeDisplay = formatTimeForDisplay(bedTime.hours, bedTime.minutes)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold font-mono tracking-widest">
            {formattedHours}:{formattedMinutes}:{formattedSeconds}
          </div>
          <div className="text-sm text-muted-foreground mt-2 mb-4">
            {time.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="w-full mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span className="flex items-center">
                <Sun className="h-3 w-3 mr-1" /> {wakeUpTimeDisplay}
              </span>
              <span className="flex items-center">
                <Moon className="h-3 w-3 mr-1" /> {bedTimeDisplay}
              </span>
            </div>
            <Progress value={dayProgressPercentage} className="w-full h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{dayStatus}</span>
              <span>{dayProgressPercentage.toFixed(1)}% of active day completed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
