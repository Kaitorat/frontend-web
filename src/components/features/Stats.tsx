import { Zap, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatCard } from '../ui/StatCard'
import { staggerContainer } from '../../lib/animations'

interface StatsProps {
  streak?: number
  hours?: number
}

export const Stats = ({ streak = 12, hours = 4.5 }: StatsProps) => {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4"
    >
      <StatCard label="Streak" value={streak.toString()} icon={Zap} color="text-[#FACC15]" index={0} />
      <StatCard label="Hours" value={hours.toString()} icon={Clock} index={1} />
    </motion.div>
  )
}
