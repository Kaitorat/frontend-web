import { useEffect, useRef, useCallback } from 'react'
import { usePomodoroStore } from '../stores/pomodoroStore'

export function usePomodoroTimer() {
  const isRunning = usePomodoroStore((state) => state.isRunning)
  const tick = usePomodoroStore((state) => state.tick)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
  const lastTickTimeRef = useRef<number>(Date.now())

  // Función para forzar recálculo del tiempo - siempre recalcula desde el tiempo real
  const forceRecalculation = useCallback(() => {
    const store = usePomodoroStore.getState()
    if (store.isRunning && store.startTime) {
      const calculated = store.calculateTimeRemaining()
      // Siempre actualizar si está corriendo, sin importar la diferencia
      // Esto asegura que el tiempo siempre esté sincronizado
      if (calculated !== store.timeRemaining) {
        usePomodoroStore.setState({ timeRemaining: calculated })
      }
      
      // Si el tiempo terminó, activar el tick para que pause y skip
      if (calculated <= 0) {
        tick()
      }
    }
  }, [tick])

  // Función de tick mejorada que siempre recalcula desde el tiempo real
  const safeTick = useCallback(() => {
    const store = usePomodoroStore.getState()
    const now = Date.now()
    lastTickTimeRef.current = now
    
    // Verificar que realmente está corriendo
    if (!store.isRunning || !store.startTime) {
      return
    }
    
    // Recalcular siempre desde el tiempo real
    const calculated = store.calculateTimeRemaining()
    
    // Actualizar el estado
    usePomodoroStore.setState({ timeRemaining: calculated })
    
    // Si el tiempo terminó, el tick original manejará el pause y skip
    if (calculated <= 0) {
      tick()
    }
  }, [tick])

  useEffect(() => {
    if (isRunning) {
      // Limpiar intervalos anteriores si existen
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }

      // Intervalo principal: siempre recalcula desde el tiempo real
      intervalRef.current = setInterval(() => {
        safeTick()
      }, 1000)

      // Heartbeat más agresivo: verificar cada 2 segundos
      // Esto detecta si el intervalo principal se pausó o si hay desincronización
      heartbeatRef.current = setInterval(() => {
        const store = usePomodoroStore.getState()
        const now = Date.now()
        
        // Verificar si el último tick fue hace más de 3 segundos (el intervalo se pausó)
        const timeSinceLastTick = now - lastTickTimeRef.current
        
        if (store.isRunning && store.startTime) {
          // Si pasó mucho tiempo desde el último tick, forzar recálculo
          if (timeSinceLastTick > 3000) {
            console.warn('[Timer] Interval paused detected, forcing recalculation')
            lastTickTimeRef.current = now
            forceRecalculation()
          } else {
            // Verificar sincronización normal
            const calculated = store.calculateTimeRemaining()
            const currentDisplayed = store.timeRemaining
            
            // Si hay diferencia, corregir
            if (Math.abs(calculated - currentDisplayed) > 2) {
              console.warn('[Timer] Desync detected, correcting:', {
                calculated,
                displayed: currentDisplayed,
                diff: Math.abs(calculated - currentDisplayed)
              })
              usePomodoroStore.setState({ timeRemaining: calculated })
            }
            
            // Verificar si el tiempo terminó
            if (calculated <= 0) {
              safeTick()
            }
          }
        }
      }, 2000) // Verificar cada 2 segundos
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
        intervalRef.current = null
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
        heartbeatRef.current = null
      }
    }
  }, [isRunning, safeTick, forceRecalculation])

  // Page Visibility API: detectar cuando la pestaña vuelve a estar activa
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // La pestaña volvió a estar visible
        const store = usePomodoroStore.getState()
        if (store.isRunning) {
          // Actualizar el tiempo de referencia
          lastTickTimeRef.current = Date.now()
          // Forzar recálculo inmediato
          forceRecalculation()
        }
      }
    }

    // Focus event: cuando la ventana recibe foco
    const handleFocus = () => {
      const store = usePomodoroStore.getState()
      if (store.isRunning) {
        lastTickTimeRef.current = Date.now()
        forceRecalculation()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [forceRecalculation])

  return null
}
