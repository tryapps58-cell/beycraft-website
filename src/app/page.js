'use client'

import Link from 'next/link'
import { HeroSection } from '@/components/homepage/HeroSection'
import { motion } from 'framer-motion'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <div className="bg-background">
      <HeroSection />

      {/* Marquee Tagline */}
      <div className="w-full bg-primary-container text-background py-3 overflow-hidden border-y border-primary relative z-20">
        <div className="whitespace-nowrap flex font-orbitron font-bold text-xl uppercase tracking-widest">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex"
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="flex shrink-0">
                <span className="mx-4">DRAG. DROP. SPIN.</span>
                <span className="mx-4 text-background/30">///</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* How it Works / System Diagnostics */}
      <section className="w-full py-32 px-6 lg:px-24 bg-surface-dim relative border-b border-surface-bright/50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary-container/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary-container/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-orbitron font-bold text-4xl md:text-6xl text-foreground mb-4">
              SYSTEM <span className="text-primary-container drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]">DIAGNOSTICS</span>
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary-container to-transparent mx-auto"></div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full"
          >
            {/* Card 01 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -15, scale: 1.02 }}
              className="flex flex-col items-center text-center p-10 border border-surface-bright bg-surface/50 backdrop-blur-sm clip-path-polygon relative overflow-hidden group hover:border-primary-container transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 -m-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="text-5xl font-orbitron font-bold text-surface-variant mb-6 opacity-30 group-hover:opacity-100 group-hover:text-primary-container transition-all">01</div>
              <h3 className="font-bold text-2xl uppercase tracking-[0.2em] text-primary mb-4">Select Parts</h3>
              <p className="text-surface-variant leading-relaxed">Access the high-fidelity parts vault. Browse through advanced attack rings, gravity-defying weight disks, and high-traction bases.</p>
              
              {/* Animated line on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary-container group-hover:w-full transition-all duration-500"></div>
            </motion.div>
            
            {/* Card 02 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -15, scale: 1.02 }}
              className="flex flex-col items-center text-center p-10 border border-surface-bright bg-surface/50 backdrop-blur-sm clip-path-polygon relative overflow-hidden group hover:border-secondary-container transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/5 -m-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="text-5xl font-orbitron font-bold text-surface-variant mb-6 opacity-30 group-hover:opacity-100 group-hover:text-secondary-container transition-all">02</div>
              <h3 className="font-bold text-2xl uppercase tracking-[0.2em] text-secondary mb-4">Analyze View</h3>
              <p className="text-surface-variant leading-relaxed">Simulate aerodynamic performance via real-time 2D projection. Inspect every millimeter using the holographic top and side profile viewers.</p>
              
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-secondary-container group-hover:w-full transition-all duration-500"></div>
            </motion.div>
            
            {/* Card 03 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -15, scale: 1.02 }}
              className="flex flex-col items-center text-center p-10 border border-surface-bright bg-surface/50 backdrop-blur-sm clip-path-polygon relative overflow-hidden group hover:border-primary-container transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 -m-10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="text-5xl font-orbitron font-bold text-surface-variant mb-6 opacity-30 group-hover:opacity-100 group-hover:text-primary-container transition-all">03</div>
              <h3 className="font-bold text-2xl uppercase tracking-[0.2em] text-primary mb-4">Save to Vault</h3>
              <p className="text-surface-variant leading-relaxed">Register your custom construct in the global operative registry. Synchronize your loadout and showcase your engineering prowess.</p>
              
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary-container group-hover:w-full transition-all duration-500"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
