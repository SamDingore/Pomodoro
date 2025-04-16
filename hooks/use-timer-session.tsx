"use client"

import { useEffect, useState } from "react"

// Update the TimerSettings type to include wake up and bed time
export type TimerSettings = {
  pomodoro: number
  shortBreak: number
  longBreak: number
  wakeUpTime: string
  bedTime: string
}

export type TimerSession = {
  timestamp: string
  duration: number
  mode: string
}

// Update the DEFAULT_SETTINGS to include default wake up and bed time
const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  wakeUpTime: "07:00",
  bedTime: "23:00",
}

export function useTimerSession() {
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(DEFAULT_SETTINGS)
  const [sessions, setSessions] = useState<TimerSession[]>([])

  // Load settings and sessions from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem("timerSettings")
    const storedSessions = localStorage.getItem("timerSessions")

    if (storedSettings) {
      try {
        setTimerSettings(JSON.parse(storedSettings))
      } catch (e) {
        console.error("Error parsing stored settings:", e)
      }
    }

    if (storedSessions) {
      try {
        setSessions(JSON.parse(storedSessions))
      } catch (e) {
        console.error("Error parsing stored sessions:", e)
      }
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings: TimerSettings) => {
    setTimerSettings(newSettings)
    localStorage.setItem("timerSettings", JSON.stringify(newSettings))
  }

  // Save a completed session
  const saveSession = (session: TimerSession) => {
    const updatedSessions = [...sessions, session]
    setSessions(updatedSessions)
    localStorage.setItem("timerSessions", JSON.stringify(updatedSessions))
  }

  // Clear all sessions
  const clearSessions = () => {
    setSessions([])
    localStorage.removeItem("timerSessions")
  }

  return {
    timerSettings,
    saveSettings,
    sessions,
    saveSession,
    clearSessions,
  }
}
