import { motion } from 'framer-motion'

export const WebBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#101010]">
    {/* 1. Malla de Puntos (Halftone) */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}
    />

    {/* 2. La "Grieta" Roja Gigante (Lateral derecho) */}
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 0.9 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 right-0 w-[50vw] h-full bg-[#D91A1A]" 
      style={{ 
        clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)'
      }} 
    />

    {/* 3. Forma Negra de Contraste (Cubre parte del rojo para textos) */}
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 right-0 w-[45vw] h-full bg-black/80 backdrop-blur-md" 
      style={{ 
        clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)'
      }} 
    />

    {/* 4. Texto Gigante Decorativo */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.05, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      className="absolute bottom-10 left-10 select-none pointer-events-none"
    >
      <motion.span 
        className="text-[15vw] font-black italic tracking-tighter text-white leading-none"
        animate={{ 
          opacity: [0.03, 0.05, 0.03],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        PHANTOM
      </motion.span>
    </motion.div>
  </div>
)
