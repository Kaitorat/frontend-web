import { create } from 'zustand'
import { pb } from '../lib/pocketbase'
import type { PomodoroType, TimerState } from '../types/pomodoro'
import { playTimerCompleteSound } from '../lib/sounds'

interface PomodoroState {
  // Estado del timer (calculado)
  timeRemaining: number // en segundos (calculado en tiempo real)
  isRunning: boolean
  mode: PomodoroType
  
  // Configuración
  workDuration: number // 25 minutos = 1500 segundos
  shortBreakDuration: number // 5 minutos = 300 segundos
  longBreakDuration: number // 15 minutos = 900 segundos
  sessionsCompleted: number
  
  // Estado en PocketBase
  timerStateId: string | null
  startTime: Date | null // timestamp cuando se inició
  initialTimeRemaining: number // tiempo inicial cuando se empezó
  
  // Acciones
  initialize: () => Promise<void>
  start: () => Promise<void>
  pause: () => Promise<void>
  reset: () => Promise<void>
  skip: () => Promise<void>
  tick: () => void // solo calcula, no guarda
  changeMode: (mode: PomodoroType) => Promise<void>
  calculateTimeRemaining: () => number
  updateDurations: (work: number, shortBreak: number, longBreak: number) => Promise<void>
}

// Variable para la suscripción
let unsubscribeTimerState: (() => void) | null = null

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  timeRemaining: 25 * 60,
  isRunning: false,
  mode: 'work',
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsCompleted: 0,
  timerStateId: null,
  startTime: null,
  initialTimeRemaining: 25 * 60,

  // Calcular tiempo restante basado en timestamps
  calculateTimeRemaining: () => {
    const state = get()
    if (!state.isRunning || !state.startTime) {
      return state.timeRemaining
    }

    const start = state.startTime.getTime()
    const now = Date.now()
    const elapsed = Math.floor((now - start) / 1000)
    const remaining = Math.max(0, state.initialTimeRemaining - elapsed)

    return remaining
  },

  // Inicializar: recuperar estado del servidor
  initialize: async () => {
    try {
      const userId = pb.authStore.model?.id
      if (!userId) return

      // Limpiar suscripción anterior si existe
      if (unsubscribeTimerState) {
        unsubscribeTimerState()
        unsubscribeTimerState = null
      }

      // Cargar preferencias del usuario (duraciones)
      let workDuration = 25 * 60
      let shortBreakDuration = 5 * 60
      let longBreakDuration = 15 * 60

      try {
        const user = await pb.collection('users').getOne(userId)
        if (user.workDuration) workDuration = user.workDuration
        if (user.shortBreakDuration) shortBreakDuration = user.shortBreakDuration
        if (user.longBreakDuration) longBreakDuration = user.longBreakDuration
      } catch {
        console.log('No user preferences found, using defaults')
      }

      // Buscar o crear el estado del timer para este usuario
      const records = await pb.collection('timer_states').getList(1, 1, {
        filter: `user = "${userId}"`,
      })

      let timerState: TimerState

      if (records.items.length > 0) {
        timerState = records.items[0] as unknown as TimerState
      } else {
        // Crear estado inicial con duraciones del usuario
        const newState = await pb.collection('timer_states').create({
          user: userId,
          startTime: null,
          initialTimeRemaining: workDuration,
          mode: 'work',
          isRunning: false,
          sessionsCompleted: 0,
        })
        timerState = newState as unknown as TimerState
      }

      // Calcular tiempo restante basado en el estado guardado
      let calculatedTime = timerState.initialTimeRemaining
      let isRunning = timerState.isRunning
      
      if (timerState.isRunning && timerState.startTime) {
        const start = new Date(timerState.startTime).getTime()
        const now = Date.now()
        const elapsed = Math.floor((now - start) / 1000)
        calculatedTime = Math.max(0, timerState.initialTimeRemaining - elapsed)
        
        // Si el tiempo terminó, marcar como pausado
        if (calculatedTime <= 0) {
          calculatedTime = 0
          isRunning = false
          // Actualizar en servidor
          await pb.collection('timer_states').update(timerState.id, {
            isRunning: false,
            startTime: null,
            initialTimeRemaining: 0,
          })
        }
      }

      set({
        timerStateId: timerState.id,
        isRunning,
        mode: timerState.mode,
        sessionsCompleted: timerState.sessionsCompleted || 0,
        startTime: timerState.startTime ? new Date(timerState.startTime) : null,
        initialTimeRemaining: isRunning && timerState.startTime ? timerState.initialTimeRemaining : calculatedTime,
        timeRemaining: calculatedTime,
        workDuration,
        shortBreakDuration,
        longBreakDuration,
      })

      // Suscribirse a cambios en tiempo real
      const unsubscribe = await pb.collection('timer_states').subscribe(timerState.id, (e) => {
        const state = get()
        if (e.action === 'update' && e.record) {
          const record = e.record as unknown as TimerState
          
          // Solo actualizar si el cambio viene de otra pestaña (evitar loops)
          if (state.timerStateId === record.id) {
            // Verificar si el estado local está corriendo pero el remoto dice que no
            // Esto puede pasar si la suscripción se desconectó y reconectó
            // En ese caso, confiar en el estado local si está corriendo
            const localIsRunning = state.isRunning
            const remoteIsRunning = record.isRunning
            
            // Si local está corriendo pero remoto dice que no, y tenemos startTime local,
            // mantener el estado local corriendo (probablemente la suscripción se desconectó)
            if (localIsRunning && !remoteIsRunning && state.startTime) {
              // Recalcular desde el tiempo local
              const calculated = state.calculateTimeRemaining()
              // Solo actualizar otros campos, mantener isRunning local
              set({
                mode: record.mode,
                sessionsCompleted: record.sessionsCompleted || 0,
                initialTimeRemaining: record.initialTimeRemaining,
                timeRemaining: calculated,
                // NO actualizar isRunning ni startTime si local está corriendo
              })
              return
            }
            
            let calculatedTime = record.initialTimeRemaining
            let isRunning = record.isRunning
            
            if (record.isRunning && record.startTime) {
              const start = new Date(record.startTime).getTime()
              const now = Date.now()
              const elapsed = Math.floor((now - start) / 1000)
              calculatedTime = Math.max(0, record.initialTimeRemaining - elapsed)
              
              if (calculatedTime <= 0) {
                calculatedTime = 0
                isRunning = false
              }
            }

            set({
              isRunning,
              mode: record.mode,
              sessionsCompleted: record.sessionsCompleted || 0,
              startTime: record.startTime ? new Date(record.startTime) : null,
              initialTimeRemaining: record.initialTimeRemaining,
              timeRemaining: calculatedTime,
            })
          }
        }
      })
      unsubscribeTimerState = unsubscribe
    } catch (error) {
      console.error('Error initializing timer:', error)
    }
  },

  start: async () => {
    const state = get()
    if (state.isRunning || state.timeRemaining <= 0 || !state.timerStateId) return

    const now = new Date()

    try {
      await pb.collection('timer_states').update(state.timerStateId, {
        startTime: now.toISOString(),
        initialTimeRemaining: state.timeRemaining,
        isRunning: true,
      })

      set({
        isRunning: true,
        startTime: now,
        initialTimeRemaining: state.timeRemaining,
      })
    } catch (error) {
      console.error('Error starting timer:', error)
    }
  },

  pause: async () => {
    const state = get()
    if (!state.isRunning || !state.timerStateId) return

    const remaining = get().calculateTimeRemaining()

    try {
      await pb.collection('timer_states').update(state.timerStateId, {
        isRunning: false,
        startTime: null,
        initialTimeRemaining: remaining,
      })

      set({
        isRunning: false,
        startTime: null,
        initialTimeRemaining: remaining,
        timeRemaining: remaining,
      })
    } catch (error) {
      console.error('Error pausing timer:', error)
    }
  },

  reset: async () => {
    const state = get()
    if (!state.timerStateId) return

    const defaultTime = state.mode === 'work' 
      ? state.workDuration 
      : state.mode === 'shortBreak' 
        ? state.shortBreakDuration 
        : state.longBreakDuration

    try {
      await pb.collection('timer_states').update(state.timerStateId, {
        startTime: null,
        initialTimeRemaining: defaultTime,
        isRunning: false,
      })

      set({
        timeRemaining: defaultTime,
        isRunning: false,
        startTime: null,
        initialTimeRemaining: defaultTime,
      })
    } catch (error) {
      console.error('Error resetting timer:', error)
    }
  },

  skip: async () => {
    const state = get()
    if (!state.timerStateId) return

    const nextMode: PomodoroType = 
      state.mode === 'work' 
        ? state.sessionsCompleted % 4 === 3 ? 'longBreak' : 'shortBreak'
        : 'work'

    const nextDuration = nextMode === 'work'
      ? state.workDuration
      : nextMode === 'shortBreak'
        ? state.shortBreakDuration
        : state.longBreakDuration

    const newSessionsCompleted = state.mode === 'work' ? state.sessionsCompleted + 1 : state.sessionsCompleted

    try {
      await pb.collection('timer_states').update(state.timerStateId, {
        mode: nextMode,
        startTime: null,
        initialTimeRemaining: nextDuration,
        isRunning: false,
        sessionsCompleted: newSessionsCompleted,
      })

      set({
        mode: nextMode,
        timeRemaining: nextDuration,
        isRunning: false,
        startTime: null,
        initialTimeRemaining: nextDuration,
        sessionsCompleted: newSessionsCompleted,
      })
    } catch (error) {
      console.error('Error skipping timer:', error)
    }
  },

  tick: () => {
    const state = get()
    const calculated = get().calculateTimeRemaining()
    
    set({ timeRemaining: calculated })

    // Si el tiempo terminó, pausar automáticamente y reproducir sonido
    if (calculated <= 0 && state.isRunning) {
      // Reproducir sonido de finalización
      playTimerCompleteSound()
      
      get().pause()
      // Auto-avanzar después de un delay
      setTimeout(() => {
        get().skip()
      }, 3000)
    }
  },

  changeMode: async (mode: PomodoroType) => {
    const state = get()
    if (state.isRunning || !state.timerStateId) return

    const duration = mode === 'work'
      ? state.workDuration
      : mode === 'shortBreak'
        ? state.shortBreakDuration
        : state.longBreakDuration

    try {
      await pb.collection('timer_states').update(state.timerStateId, {
        mode,
        initialTimeRemaining: duration,
      })

      set({
        mode,
        timeRemaining: duration,
        initialTimeRemaining: duration,
      })
    } catch (error) {
      console.error('Error changing mode:', error)
    }
  },

  updateDurations: async (work: number, shortBreak: number, longBreak: number) => {
    const userId = pb.authStore.model?.id
    if (!userId) return

    // Validar que las duraciones sean positivas
    if (work <= 0 || shortBreak <= 0 || longBreak <= 0) {
      console.error('Durations must be positive')
      return
    }

    try {
      // Guardar en el perfil del usuario
      await pb.collection('users').update(userId, {
        workDuration: work,
        shortBreakDuration: shortBreak,
        longBreakDuration: longBreak,
      })

      // Obtener el estado actual después de guardar
      const state = get()
      
      // Calcular la duración del modo actual con los nuevos valores
      const currentDuration = state.mode === 'work'
        ? work
        : state.mode === 'shortBreak'
          ? shortBreak
          : longBreak

      // Actualizar todo en una sola operación para que el tiempo se actualice inmediatamente
      if (!state.isRunning) {
        set({
          workDuration: work,
          shortBreakDuration: shortBreak,
          longBreakDuration: longBreak,
          timeRemaining: currentDuration,
          initialTimeRemaining: currentDuration,
        })
        
        // Si hay un timerStateId, también actualizar en PocketBase para sincronización
        if (state.timerStateId) {
          await pb.collection('timer_states').update(state.timerStateId, {
            initialTimeRemaining: currentDuration,
          })
        }
      } else {
        // Si está corriendo, solo actualizar las duraciones (el tiempo se calcula dinámicamente)
        set({
          workDuration: work,
          shortBreakDuration: shortBreak,
          longBreakDuration: longBreak,
        })
      }
    } catch (error) {
      console.error('Error updating durations:', error)
    }
  },
}))
