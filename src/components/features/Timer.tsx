import { useState } from 'react'
import { Play, Pause, RotateCcw, FastForward, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp, P5_TRANSITION, P5_AGGRESSIVE_TRANSITION } from '../../lib/animations'
import { TimerSettingsModal } from './TimerSettingsModal'

interface TimerProps {
  isRunning: boolean
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
  time: string
  mode: 'POMODORO' | 'SHORT BREAK' | 'LONG BREAK'
  onModeChange: (mode: 'POMODORO' | 'SHORT BREAK' | 'LONG BREAK') => void
}

export const Timer = ({ 
  isRunning, 
  onToggle, 
  onReset, 
  onSkip, 
  time, 
  mode,
  onModeChange 
}: TimerProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const modes: Array<'POMODORO' | 'SHORT BREAK' | 'LONG BREAK'> = ['POMODORO', 'SHORT BREAK', 'LONG BREAK']

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="flex-2 flex flex-col justify-center items-center min-w-[500px]"
    >
      {/* Header Flotante del Modo */}
      <motion.div 
        variants={fadeInUp}
        className="flex items-center gap-4 mb-12"
      >
        {modes.map((m, index) => (
          <motion.button 
            key={m} 
            aria-label={m}
            onClick={() => onModeChange(m)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...P5_TRANSITION, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 font-black italic tracking-widest border-2 transition-all ${
              m === mode
                ? 'bg-[#D91A1A] border-[#D91A1A] text-white -skew-x-12 shadow-[0_0_20px_rgba(217,26,26,0.4)]' 
                : 'border-zinc-700 text-zinc-500 hover:border-white hover:text-white -skew-x-12'
            }`}>
            <span className="block skew-x-12">{m}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* El Timer Gigante */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...P5_TRANSITION, delay: 0.3 }}
        className="relative mb-12 group"
      >
        {/* Anillos Decorativos Animados */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-40px] border border-white/5 rounded-full" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px] border border-[#D91A1A]/20 rounded-full border-dashed" 
        />
        
        {/* Círculo Principal */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          animate={isRunning ? {
            boxShadow: [
              "0 0 60px rgba(217, 26, 26, 0.2)",
              "0 0 80px rgba(217, 26, 26, 0.4)",
              "0 0 60px rgba(217, 26, 26, 0.2)",
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-96 h-96 rounded-full bg-[#101010] border-8 border-[#D91A1A] flex flex-col items-center justify-center shadow-[0_0_60px_rgba(217,26,26,0.2)] relative z-10"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={time}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={P5_AGGRESSIVE_TRANSITION}
              className="text-[8rem] font-bold text-white leading-none tracking-tighter tabular-nums drop-shadow-2xl"
            >
              {time}
            </motion.span>
          </AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center gap-2 bg-[#D91A1A]/10 px-4 py-1 rounded-full border border-[#D91A1A]/50"
          >
            <motion.div 
              animate={isRunning ? { scale: [1, 1.5, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 bg-[#D91A1A] rounded-full" 
            />
            <AnimatePresence mode="wait">
              <motion.span
                key={isRunning ? 'active' : 'idle'}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={P5_AGGRESSIVE_TRANSITION}
                className="text-[#D91A1A] font-bold text-xs tracking-[0.2em] uppercase"
              >
                {isRunning ? 'System Active' : 'System Idle'}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Controles Principales */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-6 items-center"
      >
        <motion.button 
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#FACC15] transition-all shadow-xl"
        >
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="pause"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={P5_AGGRESSIVE_TRANSITION}
              >
                <Pause size={32} fill="currentColor" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={P5_AGGRESSIVE_TRANSITION}
              >
                <Play size={32} fill="currentColor" className="ml-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        <motion.button 
          onClick={onReset}
          aria-label="Reset timer"
          whileHover={{ scale: 1.1, rotate: -180 }}
          whileTap={{ scale: 0.9 }}
          transition={P5_TRANSITION}
          className="w-14 h-14 bg-[#18181B] border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
          <RotateCcw size={20} />
        </motion.button>

        <motion.button 
          onClick={onSkip}
          aria-label="Skip session"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={P5_TRANSITION}
          className="w-14 h-14 bg-[#18181B] border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
          <FastForward size={20} />
        </motion.button>

        <motion.button 
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={P5_TRANSITION}
          className="w-14 h-14 bg-[#18181B] border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-[#D91A1A] hover:border-[#D91A1A] transition-all">
          <Settings size={20} />
        </motion.button>
      </motion.div>

      <TimerSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </motion.div>
  )
}
