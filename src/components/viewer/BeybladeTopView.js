'use client'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export function BeybladeTopView({ parts }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const sorted = Object.values(parts)
      .filter(Boolean)
      .sort((a, b) => (a.layer_order || 0) - (b.layer_order || 0))

    const CATEGORY_DEFAULTS = {
      face_bolt: { scale: 0.35, x: 0, y: 0 },
      attack_ring: { scale: 1.0, x: 0, y: 0 },
      weight_disk: { scale: 0.95, x: 0, y: 0 },
      blade_base: { scale: 0.95, x: 0, y: 0 },
      spin_gear: { scale: 0.5, x: 0, y: 0 },
      emblem: { scale: 0.2, x: 0, y: 0 },
    }

    const loadAndDraw = async () => {
      for (const part of sorted) {
        await new Promise((resolve) => {
          const imgUrl = part.top_image_path || part.top_image_url
          if (!imgUrl) {
            resolve()
            return
          }
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = imgUrl
          img.onload = () => {
            const defaults = CATEGORY_DEFAULTS[part.part_type] || { scale: 1, x: 0, y: 0 }
            const scale = part.scale || defaults.scale
            const sw = img.width * scale
            const sh = img.height * scale

            // Apply both DB offsets and category default offsets
            const offX = (part.top_offset_x || 0) + (defaults.x || 0)
            const offY = (part.top_offset_y || 0) + (defaults.y || 0)

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
      <p className="text-sm font-semibold tracking-widest text-primary-container mb-4 uppercase font-orbitron">Top View</p>
      <div className="w-full max-w-[400px] aspect-square rounded-full bg-surface-variant/20 border border-primary-container/20 flex items-center justify-center overflow-hidden backdrop-blur-sm relative shadow-[0_0_30px_rgba(0,242,255,0.05)] group">
        {/* Radar-like scanning line */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-t border-primary-container/10 rounded-full z-20 pointer-events-none"
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#e1fdff 1px, transparent 1px), linear-gradient(90deg, #e1fdff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-full h-full relative z-10 p-4"
        >
          <canvas ref={canvasRef} width={512} height={512} className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,242,255,0.3)]" />
        </motion.div>
      </div>
    </div>
  )
}
