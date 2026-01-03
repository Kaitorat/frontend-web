// Hack del audio silencioso: reproduce un audio silencioso para evitar que
// los navegadores (especialmente Firefox) pausen la pestaña cuando está en segundo plano
// Los navegadores nunca pausan pestañas que están reproduciendo audio

let silentAudioContext: AudioContext | null = null
let silentAudioSource: AudioBufferSourceNode | null = null
let silentAudioBuffer: AudioBuffer | null = null
let isPlaying = false

/**
 * Crea un buffer de audio silencioso (frecuencia 0, duración 1 segundo)
 */
function createSilentAudioBuffer(context: AudioContext): AudioBuffer {
  // Crear un buffer de 1 segundo a 44.1kHz (sample rate estándar)
  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
  // El buffer ya está lleno de ceros por defecto (silencioso)
  return buffer
}

/**
 * Inicia la reproducción del audio silencioso en bucle
 * Esto previene que el navegador pause la pestaña
 */
export function startSilentAudio() {
  if (isPlaying) return

  try {
    // Crear contexto de audio si no existe
    if (!silentAudioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      silentAudioContext = new AudioContextClass()
    }

    // Crear buffer silencioso si no existe
    if (!silentAudioBuffer) {
      silentAudioBuffer = createSilentAudioBuffer(silentAudioContext)
    }

    // Crear fuente de audio
    silentAudioSource = silentAudioContext.createBufferSource()
    silentAudioSource.buffer = silentAudioBuffer
    silentAudioSource.loop = true // Reproducir en bucle

    // Conectar a destino (altavoces)
    silentAudioSource.connect(silentAudioContext.destination)

    // Iniciar reproducción
    silentAudioSource.start(0)
    isPlaying = true

    console.log('[SilentAudio] Audio silencioso iniciado para prevenir pausa de pestaña')
  } catch (error) {
    console.warn('[SilentAudio] Error iniciando audio silencioso:', error)
  }
}

/**
 * Detiene la reproducción del audio silencioso
 */
export function stopSilentAudio() {
  if (!isPlaying) return

  try {
    if (silentAudioSource) {
      silentAudioSource.stop()
      silentAudioSource.disconnect()
      silentAudioSource = null
    }
    isPlaying = false
    console.log('[SilentAudio] Audio silencioso detenido')
  } catch (error) {
    console.warn('[SilentAudio] Error deteniendo audio silencioso:', error)
  }
}

/**
 * Limpia todos los recursos de audio
 */
export function cleanupSilentAudio() {
  stopSilentAudio()
  
  if (silentAudioContext) {
    silentAudioContext.close().catch(() => {
      // Ignorar errores al cerrar
    })
    silentAudioContext = null
  }
  
  silentAudioBuffer = null
}
