'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/customize')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dynamic Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Moving Grid */}
        <motion.div 
          style={{ 
            x: mousePos.x, 
            y: mousePos.y,
            backgroundImage: 'linear-gradient(rgba(0, 242, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
          className="absolute inset-[-100px] opacity-20 pointer-events-none"
        />
        
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-[150px] pointer-events-none"
        />
      </div>

      {/* Floating HUD Elements - Only on Client */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
              animate={{ 
                opacity: [0, 0.2, 0],
                y: ["0%", "-20%"]
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity, 
                delay: i * 2 
              }}
              className="absolute font-mono text-[10px] text-primary-container"
            >
              {`>> DATA_STREAM_${i}: ${Math.random().toString(16).substring(2, 10)}`}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div 
        initial={{ y: 30, opacity: 0, rotateX: 10 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-md p-10 border border-primary-container/30 bg-surface/40 backdrop-blur-2xl clip-path-polygon relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        {/* Tactical Accents */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary-container/40 -m-[2px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary-container/40 -m-[2px] pointer-events-none" />
        
        {/* Animated Corner Brackets */}
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-4 left-4 w-4 h-4 border-t border-l border-primary-container"
        />

        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4 p-3 border border-primary-container/20 rounded-full"
          >
            <div className="w-12 h-12 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
          </motion.div>
          <h2 className="font-orbitron font-bold text-4xl text-white tracking-tighter uppercase">
            Access <span className="text-primary-container drop-shadow-[0_0_10px_#00f2ff]">Vault</span>
          </h2>
          <p className="text-surface-variant font-mono text-[9px] uppercase tracking-[0.4em] mt-3 opacity-50">Secure Biometric Uplink Required</p>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-4 border border-red-500/30 bg-red-500/5 text-red-500 font-mono text-[11px] flex items-start gap-3"
            >
              <span className="shrink-0">[!]</span>
              <span>UPLINK ERROR: {error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="space-y-2 group">
            <div className="flex justify-between items-center px-1">
              <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-surface-variant group-focus-within:text-primary-container transition-colors">Credential ID</label>
              <div className="h-[1px] flex-1 mx-4 bg-surface-bright/20 group-focus-within:bg-primary-container/30 transition-all" />
            </div>
            <input 
              type="email" 
              placeholder="OPERATOR@BEYCRAFT.COM" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 bg-black/40 border border-surface-bright/50 text-white focus:outline-none focus:border-primary-container font-mono text-sm transition-all focus:bg-primary-container/5 placeholder:text-surface-variant/30" 
            />
          </div>

          <div className="space-y-2 group">
            <div className="flex justify-between items-center px-1">
              <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-surface-variant group-focus-within:text-primary-container transition-colors">Security Key</label>
              <div className="h-[1px] flex-1 mx-4 bg-surface-bright/20 group-focus-within:bg-primary-container/30 transition-all" />
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 bg-black/40 border border-surface-bright/50 text-white focus:outline-none focus:border-primary-container font-mono text-sm transition-all focus:bg-primary-container/5 placeholder:text-surface-variant/30" 
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 242, 255, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="mt-6 p-5 bg-primary-container text-background font-bold tracking-[0.3em] uppercase hover:bg-white transition-all clip-path-polygon disabled:opacity-50 text-xs relative group overflow-hidden"
          >
            <span className="relative z-10">{loading ? 'Processing...' : 'Authorize Uplink'}</span>
            <motion.div 
              className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
            />
          </motion.button>
        </form>

        <div className="mt-10 pt-8 border-t border-surface-bright/30 text-center">
          <p className="text-[10px] text-surface-variant font-mono uppercase tracking-widest">
            Identity missing? <Link href="/signup" className="text-primary-container hover:text-white transition-all underline underline-offset-8 decoration-primary-container/30">Initiate Registration</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
