'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
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

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/login?message=Registration successful. Please verify your email.')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dynamic Background Layer */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ 
            x: mousePos.x, 
            y: mousePos.y,
            backgroundImage: 'linear-gradient(rgba(206, 93, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(206, 93, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
          className="absolute inset-[-100px] opacity-20 pointer-events-none"
        />
        
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-[150px] pointer-events-none"
        />
      </div>

      {/* Floating HUD Elements - Only on Client */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
              animate={{ 
                opacity: [0, 0.15, 0],
                y: ["0%", "-20%"]
              }}
              transition={{ 
                duration: 7 + Math.random() * 5, 
                repeat: Infinity, 
                delay: i * 1.5 
              }}
              className="absolute font-mono text-[9px] text-secondary-container"
            >
              {`>> REG_UPLINK_${i}: ${Math.random().toString(36).substring(7)}`}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div 
        initial={{ y: 30, opacity: 0, rotateY: -10 }}
        animate={{ y: 0, opacity: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-md p-10 border border-secondary-container/30 bg-surface/40 backdrop-blur-2xl clip-path-polygon relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-secondary-container/40 -m-[2px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-secondary-container/40 -m-[2px] pointer-events-none" />
        
        <div className="mb-10 text-center">
          <h2 className="font-orbitron font-bold text-4xl text-white tracking-tighter uppercase">
            New <span className="text-secondary-container drop-shadow-[0_0_10px_#ce5dff]">Operator</span>
          </h2>
          <p className="text-surface-variant font-mono text-[9px] uppercase tracking-[0.4em] mt-3 opacity-50">Registering into Beycraft Vault</p>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-4 border border-red-500/30 bg-red-500/5 text-red-500 font-mono text-[11px] flex items-start gap-3"
            >
              <span className="shrink-0">[!]</span>
              <span>SYSTEM ERROR: {error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div className="space-y-2 group">
            <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-surface-variant group-focus-within:text-secondary-container transition-colors px-1">Operator Alias</label>
            <input 
              type="text" 
              placeholder="GINGKA HAGANE" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-4 bg-black/40 border border-surface-bright/50 text-white focus:outline-none focus:border-secondary-container font-mono text-sm transition-all focus:bg-secondary-container/5 placeholder:text-surface-variant/30" 
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-surface-variant group-focus-within:text-secondary-container transition-colors px-1">Comm Link (Email)</label>
            <input 
              type="email" 
              placeholder="OPERATOR@BEYCRAFT.COM" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 bg-black/40 border border-surface-bright/50 text-white focus:outline-none focus:border-secondary-container font-mono text-sm transition-all focus:bg-secondary-container/5 placeholder:text-surface-variant/30" 
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-surface-variant group-focus-within:text-secondary-container transition-colors px-1">Security Key</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 bg-black/40 border border-surface-bright/50 text-white focus:outline-none focus:border-secondary-container font-mono text-sm transition-all focus:bg-secondary-container/5 placeholder:text-surface-variant/30" 
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(206, 93, 255, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="mt-6 p-5 bg-secondary-container text-background font-bold tracking-[0.3em] uppercase hover:bg-white transition-all clip-path-polygon disabled:opacity-50 text-xs relative group overflow-hidden"
          >
            <span className="relative z-10">{loading ? 'Initializing...' : 'Confirm Registration'}</span>
            <motion.div 
              className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
            />
          </motion.button>
        </form>

        <div className="mt-10 pt-8 border-t border-surface-bright/30 text-center">
          <p className="text-[10px] text-surface-variant font-mono uppercase tracking-widest">
            Already registered? <Link href="/login" className="text-secondary-container hover:text-white transition-all underline underline-offset-8 decoration-secondary-container/30">Access Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
