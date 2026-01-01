import { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { P5_TRANSITION } from '../../lib/animations'

interface SidebarItemProps {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  active: boolean
  onClick: () => void
}

export const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <motion.button 
    onClick={onClick}
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.95 }}
    className={`group flex items-center gap-4 w-full p-4 transition-all border-r-4 ${
      active 
        ? 'bg-[#D91A1A]/10 border-[#D91A1A] text-white' 
        : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <motion.div
      animate={active ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Icon size={24} className={`transition-transform group-hover:scale-110 ${active ? 'text-[#D91A1A]' : ''}`} />
    </motion.div>
    <span className={`font-bold uppercase tracking-widest text-sm ${active ? 'text-white' : ''}`}>
      {label}
    </span>
  </motion.button>
)
