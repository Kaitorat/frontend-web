import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '../stores/pomodoroStore'
import { stopSilentAudio, cleanupSilentAudio } from '../lib/silentAudio'

export function usePomodoroTimer() {
  const { isRunning, tick } = usePomodoroStore()
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    // Crear el worker si no existe
    // Usar new URL para compatibilidad con builds de producción
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/timer.worker.ts', import.meta.url),
        { type: 'module' }
      )

      // Escuchar mensajes del worker
      workerRef.current.onmessage = (e: MessageEvent) => {
        const { type } = e.data

        switch (type) {
          case 'TICK':
            // El worker envió un tick - ejecutar la función tick del store
            tick()
            break

          case 'STARTED':
            console.log('[Timer Worker] Timer started')
            break

          case 'STOPPED':
            console.log('[Timer Worker] Timer stopped')
            break

          case 'PONG':
            // Worker está vivo
            break

          default:
            console.warn('[Timer Worker] Unknown message type:', type)
        }
      }

      // Manejar errores del worker
      workerRef.current.onerror = (error) => {
        console.error('[Timer Worker] Error:', error)
      }
    }

    // Controlar el worker basado en isRunning
    if (isRunning) {
      // Iniciar el timer en el worker
      workerRef.current.postMessage({ type: 'START' })
      // Nota: startSilentAudio se llama desde start() en el store para cumplir con la política de autoplay
    } else {
      // Detener el timer en el worker
      workerRef.current.postMessage({ type: 'STOP' })
      // Detener audio silencioso
      stopSilentAudio()
    }

    // Cleanup: terminar el worker cuando el componente se desmonte
    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'STOP' })
        workerRef.current.terminate()
        workerRef.current = null
      }
      // Limpiar audio silencioso
      cleanupSilentAudio()
    }
  }, [isRunning, tick])

  // Hook para sincronizar cuando la pestaña vuelve a estar visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning) {
        console.log('[Timer] Tab active, syncing time...')
        tick()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isRunning, tick])

  return null
}
