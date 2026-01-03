import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '../stores/pomodoroStore'

export function usePomodoroTimer() {
  const { isRunning, tick } = usePomodoroStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick()
      }, 1000) // Tick cada segundo
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, tick])

  return null
}
