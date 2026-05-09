'use client'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export function BeybladesSideView({ parts }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sorted = Object.values(parts)
      .filter(Boolean)
      .sort((a, b) => (a.layer_order || 0) - (b.layer_order || 0))

    const SIDE_CATEGORY_DEFAULTS = {
      face_bolt:   { scale: 0.3, x: 0, y: -45 },
      attack_ring: { scale: 1.0, x: 0, y: -15 },
      weight_disk: { scale: 0.9, x: 0, y: 15 },
      blade_base:  { scale: 1.0, x: 0, y: 45 },
      spin_gear:   { scale: 0.6, x: 0, y: 0 },
      emblem:      { scale: 0.2, x: 0, y: -55 },
    }

    const loadAndDraw = async () => {
      for (const part of sorted) {
        await new Promise((resolve) => {
          const imgUrl = part.side_image_path || part.side_image_url
          if (!imgUrl) {
            resolve()
            return
          }
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = imgUrl
          img.onload = () => {
            const defaults = SIDE_CATEGORY_DEFAULTS[part.part_type] || { scale: 1, x: 0, y: 0 }
            const scale = part.scale || defaults.scale
            const sw = img.width * scale
            const sh = img.height * scale
            
            // Apply both DB offsets and category default offsets
            const offX = (part.side_offset_x || 0) + (defaults.x || 0)
            const offY = (part.side_offset_y || 0) + (defaults.y || 0)
            
            const x = canvas.width / 2 + offX - sw / 2
            const y = canvas.height / 2 + offY - sh / 2
            
            ctx.drawImage(img, x, y, sw, sh)
            resolve()
          }
          img.onerror = resolve
        })
      }
    }
    loadAndDraw()
  }, [parts])

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-sm font-semibold tracking-widest text-primary-container mb-4 uppercase font-orbitron">Side View</p>
      <div className="w-full max-w-[400px] aspect-square rounded-none bg-surface-variant/20 border border-primary-container/20 flex items-center justify-center overflow-hidden backdrop-blur-sm relative shadow-[0_0_30px_rgba(0,242,255,0.05)] group">
        {/* Animated elevation lines */}
        <div className="absolute inset-x-0 top-1/4 border-t border-primary-container/5 z-20 pointer-events-none"></div>
        <div className="absolute inset-x-0 top-2/4 border-t border-primary-container/10 z-20 pointer-events-none"></div>
        <div className="absolute inset-x-0 top-3/4 border-t border-primary-container/5 z-20 pointer-events-none"></div>
        
        {/* Vertical measurement line */}
        <motion.div 
          animate={{ x: [-100, 500] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-[1px] bg-primary-container/20 z-20 pointer-events-none"
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#e1fdff 1px, transparent 1px), linear-gradient(90deg, #e1fdff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full relative z-10 p-4"
        >
          <canvas ref={canvasRef} width={512} height={512} className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,242,255,0.3)]" />
        </motion.div>
      </div>
    </div>
  )
}
