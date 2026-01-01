import { List, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { TaskItem } from '../ui/TaskItem'
import { slideInFromRight, P5_TRANSITION } from '../../lib/animations'

interface Mission {
  id: string
  title: string
  active: boolean
}

interface MissionLogProps {
  missions: Mission[]
  onAddMission?: () => void
  onViewAll?: () => void
}

export const MissionLog = ({ missions, onAddMission, onViewAll }: MissionLogProps) => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={slideInFromRight}
      className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 p-6 flex flex-col"
    >
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-xl font-black italic text-white flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <List className="text-[#D91A1A]" />
          </motion.div>
          MISSION LOG
        </h2>
        <motion.button 
          onClick={onAddMission}
          aria-label="Add new mission"
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={P5_TRANSITION}
          className="text-zinc-500 hover:text-[#D91A1A]">
          <Plus />
        </motion.button>
      </motion.div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-2">
        {missions.map((mission, index) => (
          <TaskItem 
            key={mission.id} 
            title={mission.title} 
            active={mission.active}
            index={index}
          />
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 pt-4 border-t border-white/5 text-center"
      >
        <motion.button 
          onClick={onViewAll}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={P5_TRANSITION}
          className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest">
          View All Missions
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
