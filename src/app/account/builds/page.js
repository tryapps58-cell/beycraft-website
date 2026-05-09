'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AccountBuildsPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-8 lg:p-16 bg-background relative overflow-hidden">
      {/* Background HUD elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary-container rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary-container/30 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
      </div>

      <motion.div 
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="relative z-10"
      >
        <h1 className="font-orbitron text-5xl lg:text-7xl text-white font-bold tracking-tighter">
          MY <span className="text-primary-container">ARSENAL</span>
        </h1>
        <p className="text-surface-variant font-mono mt-4 uppercase tracking-[0.4em] text-xs opacity-60">Personal Construct Registry</p>
      </motion.div>
      
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-1 flex flex-col items-center justify-center border border-surface-bright/50 mt-12 bg-surface-dim/30 backdrop-blur-sm clip-path-polygon p-12 text-center"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-24 h-24 border-2 border-primary-container rounded-full mb-8 flex items-center justify-center"
        >
          <div className="w-12 h-12 border border-primary-container rotate-45 animate-pulse" />
        </motion.div>
        
        <h2 className="font-orbitron font-bold text-2xl text-white mb-4 uppercase tracking-widest">Storage Decryption in Progress</h2>
        <p className="text-surface-variant font-mono max-w-md mx-auto leading-relaxed text-sm">
          The Vault is currently synchronizing with your local terminal. Once your constructs are verified, they will appear here as holographic projections.
        </p>
        
        <Link 
          href="/customize"
          className="mt-12 px-10 py-4 bg-primary-container text-background font-bold uppercase tracking-[0.2em] text-sm hover:bg-white transition-all clip-path-polygon hover:shadow-[0_0_30px_rgba(0,242,255,0.4)]"
        >
          Forge New Construct
        </Link>
      </motion.div>

      {/* Side Status Bar */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="flex flex-col gap-2 font-mono text-[10px] text-primary-container opacity-40">
          <p>STATUS: SYNCING</p>
          <p>UPLINK: ACTIVE</p>
          <p>VAULT_ID: BK-7729</p>
        </div>
      </div>
    </div>
  )
}
