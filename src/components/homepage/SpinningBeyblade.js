'use client'
import { motion } from 'framer-motion'

export function SpinningBeyblade() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      className="w-full h-full border-4 border-dashed border-primary-container/30 rounded-full flex items-center justify-center p-4 relative"
    >
      {/* Outer spinning ring */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 border-2 border-secondary-container/50 rounded-full scale-[1.05]"
      ></motion.div>
      
      {/* Inner placeholder representing the Beyblade */}
      <div className="w-[80%] h-[80%] rounded-full bg-gradient-to-br from-primary-container/40 to-secondary-container/40 backdrop-blur-sm border border-primary flex items-center justify-center shadow-[inset_0_0_50px_rgba(0,242,255,0.5)]">
        <div className="w-[30%] h-[30%] rounded-full bg-background border-2 border-primary-container flex items-center justify-center">
          <div className="w-[50%] h-[50%] bg-secondary-container rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}
