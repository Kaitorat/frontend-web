import { useState } from 'react'
import { motion } from 'framer-motion'
import { WebBackground } from '../layout/WebBackground'
import { Sidebar } from '../layout/Sidebar'
import { Timer } from '../features/Timer'
import { Stats } from '../features/Stats'
import { MissionLog } from '../features/MissionLog'
import { fadeInUp } from '../../lib/animations'

const MOCK_MISSIONS = [
  { id: '1', title: 'Refactor Navigation Stack', active: true },
  { id: '2', title: 'Design System Update', active: false },
  { id: '3', title: 'Client Meeting Prep', active: false },
  { id: '4', title: 'Weekly Review', active: false },
  { id: '5', title: 'Update Documentation', active: false },
]

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Heist')
  const [isRunning, setIsRunning] = useState(false)
  const [timerMode, setTimerMode] = useState<'POMODORO' | 'SHORT BREAK' | 'LONG BREAK'>('POMODORO')
  const [time, setTime] = useState('25:00')

  const handleToggle = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime('25:00')
  }

  const handleSkip = () => {
    setIsRunning(false)
    // Lógica para cambiar al siguiente modo
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

      {/* CONTENIDO PRINCIPAL (Grid Layout) */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex-1 p-8 z-10 overflow-y-auto flex gap-8"
      >
        <Timer 
          isRunning={isRunning}
          onToggle={handleToggle}
          onReset={handleReset}
          onSkip={handleSkip}
          time={time}
          mode={timerMode}
          onModeChange={setTimerMode}
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
