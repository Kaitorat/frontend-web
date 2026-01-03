export type PomodoroType = 'work' | 'shortBreak' | 'longBreak'

export interface PomodoroSession {
  id: string
  user: string
  startTime: string
  endTime?: string
  duration: number // en minutos
  type: PomodoroType
  completed: boolean
  created: string
  updated: string
}

export interface PomodoroSessionCreate {
  startTime: string
  duration: number
  type: PomodoroType
  completed?: boolean
}

export interface TimerState {
  id: string
  user: string
  startTime: string | null // ISO timestamp cuando se inició el timer
  initialTimeRemaining: number // segundos restantes cuando se inició
  mode: PomodoroType
  isRunning: boolean
  sessionsCompleted: number
  workDuration: number // configuración: duración del pomodoro en segundos
  shortBreakDuration: number // configuración: duración del break corto en segundos
  longBreakDuration: number // configuración: duración del break largo en segundos
  created: string
  updated: string
}

export interface TimerStateCreate {
  startTime: string | null
  initialTimeRemaining: number
  mode: PomodoroType
  isRunning: boolean
  sessionsCompleted?: number
  workDuration?: number
  shortBreakDuration?: number
  longBreakDuration?: number
}
