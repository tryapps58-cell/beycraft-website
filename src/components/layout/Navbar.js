'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (!error && data?.user) {
          setUser(data.user)
        }
      } catch (err) {
        console.warn("Vault connection interrupted. Operating in offline mode.", err.message)
      }
    }
    checkUser()
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-primary-container/20 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center space-x-2">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full"
          />
          <span className="font-orbitron font-black text-2xl tracking-tighter text-white">
            BEY<span className="text-primary-container">CRAFT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-10 text-sm font-mono tracking-[0.2em] uppercase text-white/80">
          {[
            { name: 'Forge', path: '/customize' },
            { name: 'Vault', path: '/gallery' },
            { name: 'Arsenal', path: '/account/builds' },
          ].map((item) => (
            <Link key={item.path} href={item.path} className="relative group">
              <span className={`group-hover:text-primary-container transition-colors ${pathname === item.path ? 'text-primary-container' : ''}`}>
                {item.name}
              </span>
              {pathname === item.path && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary-container shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                />
              )}
              <motion.div 
                className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-container group-hover:w-full transition-all duration-300"
              />
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono uppercase text-primary-container tracking-widest">Active Operator</span>
                <span className="text-[10px] font-mono text-white/70 truncate max-w-[120px]">{user.email}</span>
              </div>
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
                className="text-[10px] font-mono uppercase tracking-widest text-secondary-container hover:text-white transition-colors"
              >
                [Terminate]
              </button>
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-xs font-mono uppercase tracking-[0.2em] text-white hover:text-primary-container transition-colors hidden sm:block"
              >
                Access
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/signup" 
                  className="px-8 py-3 bg-primary-container text-background font-black text-xs uppercase tracking-[0.2em] clip-path-polygon hover:bg-white transition-all hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                >
                  Initialize
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Decorative scanline on bottom border */}
      <motion.div 
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="h-[1px] w-1/3 bg-gradient-to-r from-transparent via-primary-container to-transparent absolute bottom-0"
      />
    </motion.nav>
  )
}
