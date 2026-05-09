'use client'
import { BeybladeTopView } from './BeybladeTopView'
import { BeybladesSideView } from './BeybladesSideView'
import { useCustomizerStore } from '@/store/useCustomizerStore'
import { motion } from 'framer-motion'

export function SplitViewerPanel() {
  const selectedParts = useCustomizerStore((state) => state.selectedParts)

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center p-4 lg:p-10 bg-surface border border-surface-bright/50 rounded-none relative overflow-hidden"
    >
      {/* Decorative scanline background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00f2ff 2px, #00f2ff 4px)' }}></div>
      
      {/* Animated holographic light beam */}
      <motion.div 
        animate={{ x: [-500, 1000] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-32 bg-gradient-to-r from-transparent via-primary-container/10 to-transparent -skew-x-12 pointer-events-none"
      />
 
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex flex-col justify-center w-full max-w-[600px]"
      >
        <BeybladeTopView parts={selectedParts} />
      </motion.div>

      {/* Decorative HUD corners */}
      {[
        "top-0 left-0 border-t-2 border-l-2",
        "top-0 right-0 border-t-2 border-r-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2"
      ].map((pos, i) => (
        <motion.div 
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          className={`absolute ${pos} w-10 h-10 border-primary-container z-20 pointer-events-none`}
        />
      ))}
    </motion.div>
  )
}
