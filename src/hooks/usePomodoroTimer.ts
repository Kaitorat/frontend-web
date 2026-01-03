import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '../stores/pomodoroStore'

export function usePomodoroTimer() {
  const { isRunning, tick, calculateTimeRemaining, timeRemaining } = usePomodoroStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
  const lastKnownTimeRef = useRef<number>(0)

  // Función para forzar recálculo del tiempo
  const forceRecalculation = () => {
    const store = usePomodoroStore.getState()
    if (store.isRunning) {
      const calculated = store.calculateTimeRemaining()
      // Si hay una diferencia significativa (>2 segundos), forzar actualización
      if (Math.abs(calculated - store.timeRemaining) > 2) {
        usePomodoroStore.setState({ timeRemaining: calculated })
      }
      lastKnownTimeRef.current = calculated
    }
  }

  useEffect(() => {
    if (isRunning) {
      // Intervalo principal para actualizar la UI cada segundo
      intervalRef.current = setInterval(() => {
        tick()
        lastKnownTimeRef.current = calculateTimeRemaining()
      }, 1000)

      // Heartbeat: verificar sincronización cada 5 segundos
      // Esto detecta si el intervalo principal se pausó
      heartbeatRef.current = setInterval(() => {
        const store = usePomodoroStore.getState()
        if (store.isRunning) {
          const calculated = store.calculateTimeRemaining()
          const currentDisplayed = store.timeRemaining
          
          // Si hay una diferencia significativa, forzar recálculo
          // Esto puede pasar si el navegador pausó el intervalo principal
          if (Math.abs(calculated - currentDisplayed) > 3) {
            usePomodoroStore.setState({ timeRemaining: calculated })
          }
          
          // Verificar si el tiempo terminó (por si el tick no se ejecutó)
          if (calculated <= 0 && store.isRunning) {
            tick() // Esto activará el pause y skip automático
          }
        }
      }, 5000) // Verificar cada 5 segundos
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
        heartbeatRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }
    }
  }, [isRunning, tick, calculateTimeRemaining])

  // Page Visibility API: detectar cuando la pestaña vuelve a estar activa
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isRunning) {
        // La pestaña volvió a estar visible y el timer está corriendo
        // Forzar recálculo inmediato
        forceRecalculation()
        
        // También verificar si el tiempo terminó mientras estaba inactivo
        const store = usePomodoroStore.getState()
        if (store.isRunning) {
          const calculated = store.calculateTimeRemaining()
          if (calculated <= 0) {
            tick() // Esto activará el pause y skip automático
          }
        }
      }
    }

    // Focus event: cuando la ventana recibe foco
    const handleFocus = () => {
      if (isRunning) {
        forceRecalculation()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isRunning, tick])

  return null
}
