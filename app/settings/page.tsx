"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Trash2, Sun, Moon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTimerSession, type TimerSettings } from "@/hooks/use-timer-session"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { timerSettings, saveSettings, sessions, clearSessions } = useTimerSession()

  const [settings, setSettings] = useState<TimerSettings>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    wakeUpTime: "07:00",
    bedTime: "23:00",
  })

  useEffect(() => {
    setSettings(timerSettings)
  }, [timerSettings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "wakeUpTime" || name === "bedTime") {
      setSettings({
        ...settings,
        [name]: value,
      })
      return
    }

    const numValue = Number.parseInt(value)

    if (isNaN(numValue) || numValue < 1) {
      return
    }

    setSettings({
      ...settings,
      [name]: numValue,
    })
  }

  const handleSave = () => {
    saveSettings(settings)
    toast({
      title: "Settings saved",
      description: "Your timer settings have been updated.",
    })
  }

  const handleClearSessions = () => {
    clearSessions()
    toast({
      title: "Sessions cleared",
      description: "All your session history has been cleared.",
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="z-10 w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Timer Settings</CardTitle>
            <CardDescription>Customize your timer durations (in minutes)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pomodoro">Pomodoro</Label>
              <Input
                id="pomodoro"
                name="pomodoro"
                type="number"
                min="1"
                value={settings.pomodoro}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortBreak">Short Break</Label>
              <Input
                id="shortBreak"
                name="shortBreak"
                type="number"
                min="1"
                value={settings.shortBreak}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longBreak">Long Break</Label>
              <Input
                id="longBreak"
                name="longBreak"
                type="number"
                min="1"
                value={settings.longBreak}
                onChange={handleChange}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <CardDescription>Day Progress Settings</CardDescription>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="wakeUpTime" className="flex items-center">
                    <Sun className="h-4 w-4 mr-2" />
                    Wake Up Time
                  </Label>
                  <Input
                    id="wakeUpTime"
                    name="wakeUpTime"
                    type="time"
                    value={settings.wakeUpTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedTime" className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    Bed Time
                  </Label>
                  <Input id="bedTime" name="bedTime" type="time" value={settings.bedTime} onChange={handleChange} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your session history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearSessions}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardFooter>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Session History</CardTitle>
            <CardDescription>You have completed {sessions.length} sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {sessions.length > 0 ? (
                sessions.map((session, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <div className="font-medium">
                        {session.mode} - {session.duration} min
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(session.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No sessions recorded yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
