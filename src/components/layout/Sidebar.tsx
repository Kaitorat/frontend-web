import { Clock, LayoutDashboard, BarChart2, Settings, Zap, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { SidebarItem } from '../ui/SidebarItem'
import { slideInVariant, staggerContainer, staggerItem } from '../../lib/animations'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const navItems = [
    { icon: Clock, label: 'Heist Mode', tab: 'Heist' },
    { icon: LayoutDashboard, label: 'Hideout', tab: 'Hideout' },
    { icon: BarChart2, label: 'Cognition', tab: 'Stats' },
    { icon: Settings, label: 'Vault', tab: 'Config' },
  ]

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={slideInVariant}
      className="w-64 h-full bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col z-20 relative"
    >
      {/* Logo Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-8 pb-12"
      >
        <div className="text-[#D91A1A] font-black text-2xl italic tracking-tighter flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Zap fill="currentColor" />
          </motion.div>
          KAITORAT
        </div>
        <div className="text-zinc-500 text-[10px] font-mono mt-1 tracking-[0.2em]">PHANTOM OS v1.0</div>
      </motion.div>

      {/* Navigation Items */}
      <motion.nav 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col gap-2"
      >
        {navItems.map((item, index) => (
          <motion.div key={item.tab} variants={staggerItem}>
            <SidebarItem 
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.tab} 
              onClick={() => onTabChange(item.tab)} 
            />
          </motion.div>
        ))}
      </motion.nav>

      {/* User Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="p-6 border-t border-white/10"
      >
        <button className="flex items-center gap-3 text-zinc-400 hover:text-white w-full transition-colors">
          <div className="w-8 h-8 bg-[#D91A1A] rounded flex items-center justify-center font-bold text-black">J</div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">Joker</span>
            <span className="text-[10px] uppercase">Log Out</span>
          </div>
          <LogOut size={16} className="ml-auto" />
        </button>
      </motion.div>
    </motion.div>
  )
}
