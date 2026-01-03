import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Clock } from 'lucide-react'
import { fadeInUp, P5_TRANSITION } from '../../lib/animations'
import { usePomodoroStore } from '../../stores/pomodoroStore'

export const Settings = () => {
  const { workDuration, shortBreakDuration, longBreakDuration, updateDurations, isRunning } = usePomodoroStore()
  
  const [workMinutes, setWorkMinutes] = useState(Math.floor(workDuration / 60))
  const [shortBreakMinutes, setShortBreakMinutes] = useState(Math.floor(shortBreakDuration / 60))
  const [longBreakMinutes, setLongBreakMinutes] = useState(Math.floor(longBreakDuration / 60))
  const [isSaving, setIsSaving] = useState(false)

  // Sincronizar estados locales cuando cambien las duraciones del store
  useEffect(() => {
    setWorkMinutes(Math.floor(workDuration / 60))
    setShortBreakMinutes(Math.floor(shortBreakDuration / 60))
    setLongBreakMinutes(Math.floor(longBreakDuration / 60))
  }, [workDuration, shortBreakDuration, longBreakDuration])

  const handleSave = async () => {
    if (isRunning) {
      alert('No puedes cambiar la configuración mientras el timer está corriendo')
      return
    }

    setIsSaving(true)
    try {
      await updateDurations(
        workMinutes * 60,
        shortBreakMinutes * 60,
        longBreakMinutes * 60
      )
      // Feedback visual
      setTimeout(() => setIsSaving(false), 500)
    } catch (error) {
      console.error('Error saving settings:', error)
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="flex-1 flex flex-col gap-8 p-8 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={P5_TRANSITION}
        >
          <Clock className="text-[#D91A1A]" size={32} />
        </motion.div>
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">
            VAULT
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Configuración del Timer</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Work Duration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...P5_TRANSITION, delay: 0.1 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <label className="block text-white font-bold mb-4 text-lg">
            POMODORO (Trabajo)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="60"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
              disabled={isRunning}
              className="flex-1 bg-[#101010] border-2 border-zinc-700 rounded-lg px-4 py-3 text-white text-2xl font-bold focus:border-[#D91A1A] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-zinc-400 font-bold text-xl">minutos</span>
          </div>
        </motion.div>

        {/* Short Break Duration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...P5_TRANSITION, delay: 0.2 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <label className="block text-white font-bold mb-4 text-lg">
            SHORT BREAK (Descanso Corto)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="30"
              value={shortBreakMinutes}
              onChange={(e) => setShortBreakMinutes(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
              disabled={isRunning}
              className="flex-1 bg-[#101010] border-2 border-zinc-700 rounded-lg px-4 py-3 text-white text-2xl font-bold focus:border-[#D91A1A] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-zinc-400 font-bold text-xl">minutos</span>
          </div>
        </motion.div>

        {/* Long Break Duration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...P5_TRANSITION, delay: 0.3 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <label className="block text-white font-bold mb-4 text-lg">
            LONG BREAK (Descanso Largo)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="60"
              value={longBreakMinutes}
              onChange={(e) => setLongBreakMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
              disabled={isRunning}
              className="flex-1 bg-[#101010] border-2 border-zinc-700 rounded-lg px-4 py-3 text-white text-2xl font-bold focus:border-[#D91A1A] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-zinc-400 font-bold text-xl">minutos</span>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={isRunning || isSaving}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-[#D91A1A] hover:bg-[#B81515] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black text-lg py-4 rounded-lg flex items-center justify-center gap-3 transition-all"
        >
          <Save size={20} />
          {isSaving ? 'Guardando...' : 'GUARDAR CONFIGURACIÓN'}
        </motion.button>

        {isRunning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-yellow-400 text-sm text-center"
          >
            ⚠️ Detén el timer para cambiar la configuración
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
