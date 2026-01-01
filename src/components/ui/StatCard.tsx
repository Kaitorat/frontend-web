import { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, P5_TRANSITION } from '../../lib/animations'

interface StatCardProps {
  label: string
  value: string
  icon: ComponentType<{ size?: number; className?: string }>
  color?: string
  index?: number
}

export const StatCard = ({ label, value, icon: Icon, color = 'text-white', index = 0 }: StatCardProps) => (
  <motion.div 
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    transition={{ ...P5_TRANSITION, delay: index * 0.1 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="bg-[#18181B] border border-white/10 p-6 relative overflow-hidden group hover:border-[#D91A1A] transition-colors"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{label}</span>
      <motion.div
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={P5_TRANSITION}
      >
        <Icon size={20} className="text-zinc-600 group-hover:text-[#D91A1A] transition-colors" />
      </motion.div>
    </div>
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className={`text-4xl font-black italic ${color}`}
    >
      {value}
    </motion.div>
    {/* Decoración hover */}
    <motion.div 
      className="absolute bottom-0 right-0 w-16 h-16 bg-[#D91A1A] opacity-0 group-hover:opacity-10 transform translate-y-1/2 translate-x-1/2 rounded-full"
      whileHover={{ scale: 1.5 }}
      transition={P5_TRANSITION}
    />
  </motion.div>
)
