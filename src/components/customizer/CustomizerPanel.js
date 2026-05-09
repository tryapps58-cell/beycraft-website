'use client'
import { useState, useEffect } from 'react'
import { useCustomizerStore } from '@/store/useCustomizerStore'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = [
  { id: 'spin_gear', name: 'Spin Gear' },
  { id: 'weight_disk', name: 'Weight Disk' },
  { id: 'attack_ring', name: 'Attack Ring' },
  { id: 'face_bolt', name: 'Face Bolt' },
  { id: 'community', name: 'Community' },
]

export function CustomizerPanel({ parts = {} }) {
  const [communityBuilds, setCommunityBuilds] = useState([])
  const { selectedParts, selectPart, loadBuild } = useCustomizerStore()
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (!error && data?.user) setUser(data?.user)
      } catch (err) {
        console.warn("Forge auth check failed:", err.message)
      }
    }
    checkUser()
  }, [])

  useEffect(() => {
    if (activeCategory === 'community') {
      const fetchCommunity = async () => {
        try {
          const { data, error } = await supabase.from('saved_builds')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)
          if (!error && data) setCommunityBuilds(data)
        } catch (err) {
          console.warn("Community feed unreachable:", err.message)
        }
      }
      fetchCommunity()
    }
  }, [activeCategory])

  const currentCategoryParts = parts[activeCategory] || []

  const handleSave = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    
    const hasParts = Object.values(selectedParts).some(part => part !== null)
    if (!hasParts) {
      alert('Select at least one part to save a construct.')
      return
    }

    const buildName = prompt("Designate a name for this construct:")
    if (!buildName) return // Cancelled

    setIsSaving(true)
    const { error } = await supabase.from('saved_builds').insert({
      user_id: user.id,
      build_name: buildName,
      parts_snapshot: selectedParts,
      is_public: true,
      user_email: user.email // Added for the gallery
    })
    setIsSaving(false)

    if (error) {
      alert('Error saving construct: ' + error.message)
    } else {
      alert('Construct synchronized with the Vault.')
      if (activeCategory === 'community') {
        // Refresh community list
        const { data } = await supabase.from('saved_builds').select('*').order('created_at', { ascending: false }).limit(10)
        if (data) setCommunityBuilds(data)
      }
    }
  }

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex flex-col h-full min-h-[600px] bg-surface-dim border border-surface-bright/50 relative overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-surface-bright bg-surface">
        <h2 className="font-orbitron font-bold text-xl text-primary-container tracking-wider">ARSENAL</h2>
        <p className="text-xs text-surface-variant font-mono uppercase tracking-widest">Select your components</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap border-b border-surface-bright p-2 gap-2 bg-surface/50">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-grow whitespace-nowrap px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all clip-path-polygon relative overflow-hidden ${
              activeCategory === cat.id 
                ? 'bg-primary-container text-background shadow-[0_0_10px_rgba(0,242,255,0.2)]' 
                : 'bg-surface hover:bg-surface-bright text-surface-variant'
            }`}
          >
            {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Parts Grid */}
      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 auto-rows-max"
          >
            {activeCategory === 'community' ? (
              communityBuilds.map((build, index) => (
                <motion.button
                  key={build.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => loadBuild(build.parts_snapshot)}
                  className="flex flex-col items-center p-2 border border-surface-bright bg-surface hover:border-secondary-container transition-all"
                >
                   <div className="w-full aspect-square bg-surface-dim mb-2 flex items-center justify-center p-1 relative overflow-hidden group">
                     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#e5e2e1 1px, transparent 1px), linear-gradient(90deg, #e5e2e1 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                     <div className="w-full h-full scale-[0.6]">
                        {/* Recursive viewer for small preview */}
                        <div className="text-[6px] text-center text-surface-variant font-mono uppercase">Preview</div>
                     </div>
                   </div>
                   <p className="text-[8px] font-bold uppercase tracking-widest text-foreground truncate w-full">{build.build_name}</p>
                   <p className="text-[6px] text-surface-variant font-mono uppercase truncate w-full">{build.user_email || 'Anonymous'}</p>
                </motion.button>
              ))
            ) : (
              <>
                {currentCategoryParts.map((part, index) => {
                  const isSelected = selectedParts[activeCategory]?.id === part.id
                  return (
                    <motion.button
                      key={part.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5, borderColor: 'var(--color-primary-container)' }}
                      onClick={() => selectPart(activeCategory, part)}
                      className={`flex flex-col items-center p-2 border transition-all ${
                        isSelected 
                          ? 'border-primary-container bg-primary-container/10 shadow-[0_0_15px_rgba(0,242,255,0.15)]' 
                          : 'border-surface-bright bg-surface'
                      }`}
                    >
                      <div className="w-full aspect-square bg-surface-dim mb-2 flex items-center justify-center p-2 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#e5e2e1 1px, transparent 1px), linear-gradient(90deg, #e5e2e1 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                        {part.top_image_path ? (
                          <motion.img 
                            layoutId={`part-${part.id}`}
                            src={part.top_image_path} 
                            alt={part.name} 
                            className="w-full h-full object-contain relative z-10" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full border border-surface-variant/50 relative z-10"></div>
                        )}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-center w-full truncate text-foreground">{part.name}</p>
                      {isSelected && (
                        <motion.div 
                          layoutId="selectionBar"
                          className="mt-1 w-full h-[2px] bg-primary-container shadow-[0_0_5px_rgba(0,242,255,0.5)]" 
                        />
                      )}
                    </motion.button>
                  )
                })}

                {/* None / Deselect Option (Now at the end) */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: currentCategoryParts.length * 0.05 }}
                  whileHover={{ y: -5, borderColor: 'var(--color-primary-container)' }}
                  onClick={() => selectPart(activeCategory, null)}
                  className={`flex flex-col items-center p-2 border transition-all ${
                    selectedParts[activeCategory] === null 
                      ? 'border-primary-container bg-primary-container/10 shadow-[0_0_15px_rgba(0,242,255,0.15)]' 
                      : 'border-surface-bright bg-surface'
                  }`}
                >
                  <div className="w-full aspect-square bg-surface-dim mb-2 flex items-center justify-center p-2 relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#e5e2e1 1px, transparent 1px), linear-gradient(90deg, #e5e2e1 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                    <div className="w-10 h-10 border-2 border-dashed border-surface-variant/50 rounded-full flex items-center justify-center group-hover:border-primary-container/50 transition-colors">
                      <span className="text-xl text-surface-variant/50 group-hover:text-primary-container/50">×</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-center w-full truncate text-foreground">None</p>
                  {selectedParts[activeCategory] === null && (
                    <motion.div 
                      layoutId="selectionBar"
                      className="mt-1 w-full h-[2px] bg-primary-container shadow-[0_0_5px_rgba(0,242,255,0.5)]" 
                    />
                  )}
                </motion.button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-surface-bright bg-surface relative z-10">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-4 bg-secondary-container hover:bg-secondary text-background font-bold text-lg uppercase tracking-widest clip-path-polygon transition-all hover:shadow-[0_0_20px_rgba(206,93,255,0.4)] disabled:opacity-50"
        >
          {isSaving ? 'Synchronizing...' : (user ? 'Save Construct' : 'Login to Save')}
        </motion.button>
      </div>
    </motion.div>
  )
}
