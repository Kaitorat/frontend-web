import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { Slider } from '../ui/slider'
import { usePomodoroStore } from '../../stores/pomodoroStore'
import { P5_TRANSITION } from '../../lib/animations'

interface TimerSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TimerSettingsModal = ({ open, onOpenChange }: TimerSettingsModalProps) => {
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
      setIsSaving(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving settings:', error)
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#101010] border-[#D91A1A]/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-black italic text-white">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={P5_TRANSITION}
            >
              <Clock className="text-[#D91A1A]" size={24} />
            </motion.div>
            CONFIGURACIÓN DEL TIMER
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Ajusta la duración de cada tipo de sesión
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Work Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white font-bold text-sm">
                POMODORO (Trabajo)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={workMinutes}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(60, parseInt(e.target.value) || 1))
                    setWorkMinutes(val)
                  }}
                  disabled={isRunning}
                  className="w-16 bg-[#18181B] border border-zinc-700 rounded px-2 py-1 text-white text-sm font-bold text-center focus:border-[#D91A1A] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-zinc-400 text-sm font-bold">min</span>
              </div>
            </div>
            <Slider
              value={[workMinutes]}
              onValueChange={(value) => setWorkMinutes(value[0])}
              min={1}
              max={60}
              step={1}
              disabled={isRunning}
              className="w-full"
            />
          </div>

          {/* Short Break Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white font-bold text-sm">
                SHORT BREAK (Descanso Corto)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakMinutes}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(30, parseInt(e.target.value) || 1))
                    setShortBreakMinutes(val)
                  }}
                  disabled={isRunning}
                  className="w-16 bg-[#18181B] border border-zinc-700 rounded px-2 py-1 text-white text-sm font-bold text-center focus:border-[#D91A1A] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-zinc-400 text-sm font-bold">min</span>
              </div>
            </div>
            <Slider
              value={[shortBreakMinutes]}
              onValueChange={(value) => setShortBreakMinutes(value[0])}
              min={1}
              max={30}
              step={1}
              disabled={isRunning}
              className="w-full"
            />
          </div>

          {/* Long Break Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-white font-bold text-sm">
                LONG BREAK (Descanso Largo)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakMinutes}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(60, parseInt(e.target.value) || 1))
                    setLongBreakMinutes(val)
                  }}
                  disabled={isRunning}
                  className="w-16 bg-[#18181B] border border-zinc-700 rounded px-2 py-1 text-white text-sm font-bold text-center focus:border-[#D91A1A] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-zinc-400 text-sm font-bold">min</span>
              </div>
            </div>
            <Slider
              value={[longBreakMinutes]}
              onValueChange={(value) => setLongBreakMinutes(value[0])}
              min={1}
              max={60}
              step={1}
              disabled={isRunning}
              className="w-full"
            />
          </div>

          {isRunning && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-yellow-400 text-xs text-center py-2 bg-yellow-400/10 rounded border border-yellow-400/20"
            >
              ⚠️ Detén el timer para cambiar la configuración
            </motion.p>
          )}
        </div>

        <DialogFooter>
          <motion.button
            onClick={handleSave}
            disabled={isRunning || isSaving}
            whileHover={{ scale: isRunning || isSaving ? 1 : 1.05 }}
            whileTap={{ scale: isRunning || isSaving ? 1 : 0.95 }}
            className="w-full bg-[#D91A1A] hover:bg-[#B81515] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <Save size={16} />
            {isSaving ? 'Guardando...' : 'GUARDAR CONFIGURACIÓN'}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
