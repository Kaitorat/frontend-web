import { motion, AnimatePresence } from 'framer-motion'
import { P5_TRANSITION, P5_AGGRESSIVE_TRANSITION } from '../../lib/animations'

interface TaskItemProps {
  title: string
  active: boolean
  index?: number
}

export const TaskItem = ({ title, active, index = 0 }: TaskItemProps) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: active ? 1 : 0.6, x: 0 }}
    transition={{ ...P5_TRANSITION, delay: index * 0.05 }}
    whileHover={{ x: 4, scale: active ? 1.02 : 1.01 }}
    whileTap={{ scale: 0.98 }}
    className={`p-4 border-l-4 mb-2 flex items-center justify-between cursor-pointer transition-all ${
      active 
        ? 'bg-[#27272A] border-[#FACC15] shadow-lg' 
        : 'bg-[#18181B] border-transparent hover:bg-[#202023]'
    }`}
  >
    <div className="flex items-center gap-3">
      <motion.div 
        animate={active ? { scale: [1, 1.5, 1] } : { scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`w-2 h-2 rounded-full ${active ? 'bg-[#FACC15]' : 'bg-zinc-600'}`} 
      />
      <span className={`font-bold ${active ? 'text-white' : 'text-zinc-400'}`}>{title}</span>
    </div>
    <AnimatePresence>
      {active && (
        <motion.span
          initial={{ opacity: 0, scale: 0, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0, x: -10 }}
          transition={P5_AGGRESSIVE_TRANSITION}
          className="text-[10px] font-bold bg-[#FACC15] text-black px-2 py-0.5 rounded"
        >
          ACTIVE
        </motion.span>
      )}
    </AnimatePresence>
  </motion.div>
)
