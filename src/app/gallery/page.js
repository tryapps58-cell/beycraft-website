'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BeybladeTopView } from '@/components/viewer/BeybladeTopView'
import { motion, AnimatePresence } from 'framer-motion'

export default function GalleryPage() {
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchBuilds() {
      try {
        const { data, error } = await supabase
          .from('saved_builds')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (!error && data) setBuilds(data)
      } catch (err) {
        console.error("Vault retrieval failed:", err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBuilds()
  }, [])

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-[1440px] mx-auto w-full">
        <header className="mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-orbitron text-5xl md:text-7xl text-white font-black tracking-tighter"
          >
            THE <span className="text-primary-container">VAULT</span>
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-primary-container/60 font-mono mt-2 uppercase tracking-[0.4em] text-xs md:text-sm"
          >
            Global Registry // Community Loadouts
          </motion.p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 border border-primary-container/10 bg-surface-dim/30 clip-path-polygon">
            <div className="w-16 h-16 border-4 border-primary-container/20 border-t-primary-container rounded-full animate-spin mb-6" />
            <p className="text-primary-container font-mono animate-pulse tracking-widest uppercase">Accessing secure archives...</p>
          </div>
        ) : builds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 border border-primary-container/10 bg-surface-dim/30 clip-path-polygon">
            <p className="text-surface-variant font-mono tracking-widest uppercase">No constructs archived in the registry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {builds.map((build, index) => (
                <motion.div
                  key={build.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group relative flex flex-col bg-surface border border-surface-bright hover:border-primary-container/50 transition-all clip-path-polygon overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-surface-bright bg-surface-dim/50 flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-orbitron font-bold uppercase tracking-wider text-sm truncate max-w-[150px]">
                        {build.build_name}
                      </h3>
                      <p className="text-[9px] text-surface-variant font-mono uppercase mt-1">
                        ID: {build.id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
                  </div>

                  {/* Visualizer Area */}
                  <div className="aspect-square w-full p-6 relative bg-gradient-to-b from-transparent to-primary-container/5">
                     <BeybladeTopView parts={build.parts_snapshot} />
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-surface-dim/80 backdrop-blur-sm border-t border-surface-bright mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-primary-container font-mono uppercase tracking-widest">Architect</span>
                        <span className="text-[10px] text-white/60 font-mono truncate max-w-[120px]">
                          {build.user_email || 'Anonymous'}
                        </span>
                      </div>
                      <button className="px-3 py-1.5 border border-primary-container/30 text-[10px] text-primary-container font-mono uppercase hover:bg-primary-container hover:text-background transition-all tracking-widest">
                        Deploy
                      </button>
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary-container/20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary-container/20 pointer-events-none" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
