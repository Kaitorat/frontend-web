// Web Worker para el timer - corre en un hilo separado
// No sufre del throttling de pestañas inactivas

declare const self: DedicatedWorkerGlobalScope

let intervalId: number | null = null

// Mensajes del thread principal
self.onmessage = (e: MessageEvent) => {
  const { type } = e.data

  switch (type) {
    case 'START':
      // Iniciar el timer - enviar tick cada segundo
      if (intervalId !== null) {
        clearInterval(intervalId)
      }

      intervalId = self.setInterval(() => {
        // Enviar mensaje "tick" al thread principal cada segundo
        self.postMessage({ type: 'TICK' })
      }, 1000)

      // Enviar confirmación
      self.postMessage({ type: 'STARTED' })
      break

    case 'STOP':
      // Detener el timer
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
      self.postMessage({ type: 'STOPPED' })
      break

    case 'PING':
      // Responder a pings para verificar que el worker está vivo
      self.postMessage({ type: 'PONG' })
      break

    default:
      console.warn('[Timer Worker] Unknown message type:', type)
  }
}
