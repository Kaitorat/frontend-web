import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WebBackground } from '../layout/WebBackground'
import { Sidebar } from '../layout/Sidebar'
import { Timer } from '../features/Timer'
import { Stats } from '../features/Stats'
import { MissionLog } from '../features/MissionLog'
import { fadeInUp } from '../../lib/animations'
import { usePomodoroStore } from '../../stores/pomodoroStore'
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer'
import { useAuth } from '../../hooks/useAuth'
import { formatTime } from '../../lib/utils'
import type { PomodoroType } from '../../types/pomodoro'

const MOCK_MISSIONS = [
  { id: '1', title: 'Refactor Navigation Stack', active: true },
  { id: '2', title: 'Design System Update', active: false },
  { id: '3', title: 'Client Meeting Prep', active: false },
  { id: '4', title: 'Weekly Review', active: false },
  { id: '5', title: 'Update Documentation', active: false },
]

// Función para convertir el modo del store al formato del componente
const mapModeToDisplay = (mode: PomodoroType): 'POMODORO' | 'SHORT BREAK' | 'LONG BREAK' => {
  switch (mode) {
    case 'work':
      return 'POMODORO'
    case 'shortBreak':
      return 'SHORT BREAK'
    case 'longBreak':
      return 'LONG BREAK'
  }
}

// Función para convertir el modo del componente al formato del store
const mapDisplayToMode = (mode: 'POMODORO' | 'SHORT BREAK' | 'LONG BREAK'): PomodoroType => {
  switch (mode) {
    case 'POMODORO':
      return 'work'
    case 'SHORT BREAK':
      return 'shortBreak'
    case 'LONG BREAK':
      return 'longBreak'
  }
}

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Heist')
  const [isInitialized, setIsInitialized] = useState(false)

  // Autenticación automática
  const { isLoading, isAuth } = useAuth()

  // Store de Zustand
  const {
    timeRemaining,
    isRunning,
    mode,
    start,
    pause,
    reset,
    skip,
    changeMode,
    initialize,
  } = usePomodoroStore()

  // Inicializar timer después de autenticarse
  useEffect(() => {
    if (!isLoading && isAuth && !isInitialized) {
      initialize().then(() => {
        setIsInitialized(true)
      })
    }
  }, [isLoading, isAuth, isInitialized, initialize])

  // Hook del timer loop (solo si está inicializado)
  usePomodoroTimer()

  // Key para forzar remount del Timer cuando la pestaña vuelve (fix para Firefox/Zen)
  const [timerKey, setTimerKey] = useState(0)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        console.log('[Dashboard] Tab visible, forcing Timer remount...')
        // Cambiar la key fuerza a React a desmontar y volver a montar el Timer
        setTimerKey(k => k + 1)
      }
    }

    const handleFocus = () => {
      console.log('[Dashboard] Window focused, forcing Timer remount...')
      setTimerKey(k => k + 1)
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Mostrar loader mientras se autentica o inicializa
  if (isLoading || !isInitialized) {
    return (
      <div className="flex w-full h-screen bg-[#101010] items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  // Mostrar error si no se pudo autenticar (opcional, para desarrollo puede continuar)
  if (!isAuth) {
    console.warn('No se pudo autenticar, pero la app continuará funcionando (modo offline)')
  }

  const handleToggle = async () => {
    if (isRunning) {
      pause()
    } else {
      await start()
    }
  }

  const handleReset = async () => {
    await reset()
  }

  const handleSkip = async () => {
    await skip()
  }

  const handleModeChange = (newMode: 'POMODORO' | 'SHORT BREAK' | 'LONG BREAK') => {
    changeMode(mapDisplayToMode(newMode))
  }

  const handleAddMission = () => {
    console.log('Add mission')
  }

  const handleViewAll = () => {
    console.log('View all missions')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex w-full h-screen bg-[#101010] overflow-hidden font-sans text-white"
    >
      <WebBackground />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* CONTENIDO PRINCIPAL */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex-1 p-8 z-10 overflow-y-auto flex gap-8"
      >
        <Timer
          key={timerKey}
          isRunning={isRunning}
          onToggle={handleToggle}
          onReset={handleReset}
          onSkip={handleSkip}
          time={formatTime(isRunning ? usePomodoroStore.getState().calculateTimeRemaining() : timeRemaining)}
          mode={mapModeToDisplay(mode)}
          onModeChange={handleModeChange}
        />

        {/* COLUMNA DERECHA: Info Contextual (Tasks & Stats) */}
        <div className="flex-1 flex flex-col gap-6 max-w-[400px]">
          <Stats streak={12} hours={4.5} />
          <MissionLog
            missions={MOCK_MISSIONS}
            onAddMission={handleAddMission}
            onViewAll={handleViewAll}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
