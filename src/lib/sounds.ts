// Utilidad para reproducir sonidos del timer

// Variable para cachear el audio
let timerCompleteAudio: HTMLAudioElement | null = null

/**
 * Carga el audio si no está cargado
 * Formato recomendado: MP3 (máxima compatibilidad en navegadores modernos)
 */
function getTimerCompleteAudio(): HTMLAudioElement {
  if (!timerCompleteAudio) {
    // Ruta al archivo de audio en la carpeta public
    // Formato recomendado: MP3 para máxima compatibilidad
    timerCompleteAudio = new Audio('/timer-complete.mp3')
    timerCompleteAudio.volume = 0.7 // Volumen al 70%
    
    // Pre-cargar el audio
    timerCompleteAudio.load()
  }
  return timerCompleteAudio
}

/**
 * Reproduce un sonido de finalización usando un archivo de audio personalizado
 * Si el archivo no existe, usa un fallback con Web Audio API
 */
export function playTimerCompleteSound() {
  try {
    const audio = getTimerCompleteAudio()
    
    // Reiniciar el audio si ya estaba reproduciéndose
    audio.currentTime = 0
    
    // Reproducir el sonido
    audio.play().catch((error) => {
      console.warn('Error playing audio file, using fallback sound:', error)
      // Fallback a sonido generado si el archivo no existe o hay error
      playFallbackSound()
    })
  } catch (error) {
    console.error('Error playing timer complete sound:', error)
    // Fallback a sonido generado
    playFallbackSound()
  }
}

/**
 * Fallback: Reproduce un sonido de finalización usando Web Audio API
 * Se usa si el archivo de audio personalizado no está disponible
 */
function playFallbackSound() {
  try {
    // Crear contexto de audio
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const audioContext = new AudioContextClass()
    
    // Crear oscilador para el tono
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    // Conectar los nodos
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Configurar el tono (frecuencia en Hz)
    oscillator.frequency.value = 800 // Tono medio-alto
    oscillator.type = 'sine' // Onda sinusoidal suave
    
    // Configurar volumen (envelope)
    const now = audioContext.currentTime
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01) // Fade in rápido
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3) // Fade out
    
    // Reproducir dos beeps
    oscillator.start(now)
    oscillator.stop(now + 0.3)
    
    // Segundo beep después de un pequeño delay
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator()
      const gainNode2 = audioContext.createGain()
      
      oscillator2.connect(gainNode2)
      gainNode2.connect(audioContext.destination)
      
      oscillator2.frequency.value = 800
      oscillator2.type = 'sine'
      
      const now2 = audioContext.currentTime
      gainNode2.gain.setValueAtTime(0, now2)
      gainNode2.gain.linearRampToValueAtTime(0.3, now2 + 0.01)
      gainNode2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.3)
      
      oscillator2.start(now2)
      oscillator2.stop(now2 + 0.3)
    }, 350)
  } catch (error) {
    console.error('Error playing fallback sound:', error)
  }
}
