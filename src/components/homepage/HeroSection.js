'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useScroll, useSpring, motion, useMotionValueEvent, useTransform } from 'framer-motion'
import Link from 'next/link'

export function HeroSection() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const lastDrawnFrame = useRef(-1)

  const frameCount = 40
  
  const framePaths = useMemo(() => {
    return Array.from({ length: frameCount }, (_, i) => {
      const frameIndex = (i + 1).toString().padStart(3, '0')
      return `/frames/ezgif-frame-${frameIndex}.jpg`
    })
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Use a slightly faster spring for immediate response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 40,
    restDelta: 0.0001
  })

  const drawFrame = (progress) => {
    const canvas = canvasRef.current
    const activeImages = imagesRef.current
    
    if (!canvas || activeImages.length < 5) return // Need at least some images
    
    const ctx = canvas.getContext('2d')
    const frameIndex = Math.max(0, Math.min(
      frameCount - 1,
      Math.floor(progress * (frameCount - 1))
    ))
    
    // Find closest frame
    let img = activeImages[frameIndex]
    if (!img) {
      for (let i = frameIndex - 1; i >= 0; i--) {
        if (activeImages[i]) {
          img = activeImages[i]
          break
        }
      }
    }
    
    if (!img) return
    if (frameIndex === lastDrawnFrame.current) return
    lastDrawnFrame.current = frameIndex

    // Handle canvas sizing and clearing
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const hRatio = canvas.width / img.width
    const vRatio = canvas.height / img.height
    const ratio = Math.max(hRatio, vRatio)
    const centerShift_x = (canvas.width - img.width * ratio) / 2
    const centerShift_y = (canvas.height - img.height * ratio) / 2
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(
      img, 
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    )
  }

  // Preloading
  useEffect(() => {
    let loadedCount = 0
    let isMounted = true

    const preloadImages = () => {
      framePaths.forEach((path, index) => {
        const img = new Image()
        img.src = path
        img.onload = () => {
          if (!isMounted) return
          loadedCount++
          imagesRef.current[index] = img
          setLoadingProgress(Math.round((loadedCount / frameCount) * 100))
          
          // Draw first frame as soon as we have it
          if (index === 0) {
            requestAnimationFrame(() => drawFrame(0))
          }
          
          if (loadedCount === frameCount) {
            setIsLoaded(true)
            requestAnimationFrame(() => drawFrame(smoothProgress.get()))
          }
        }
        img.onerror = () => {
          if (!isMounted) return
          loadedCount++
          if (loadedCount === frameCount) {
            setIsLoaded(true)
          }
        }
      })
    }

    preloadImages()
    return () => { isMounted = false }
  }, [framePaths])

  // Scroll update
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    drawFrame(latest)
  })

  // Resize update
  useEffect(() => {
    const handleResize = () => {
      lastDrawnFrame.current = -1
      drawFrame(smoothProgress.get())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animation Transforms
  const mainContentOpacity = useTransform(smoothProgress, [0, 0.05, 0.2, 0.8, 0.9], [0, 1, 1, 1, 0])
  const mainContentY = useTransform(smoothProgress, [0, 0.1], [20, 0])
  
  const ctaOpacity = useTransform(smoothProgress, [0.88, 0.98], [0, 1])
  const ctaScale = useTransform(smoothProgress, [0.88, 0.98], [0.95, 1])
  
  const indicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0])

  return (
    <section ref={containerRef} className="relative w-full bg-[#050505]" style={{ height: '600vh' }}>
      {/* Sticky Canvas Section */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black z-10">
        {!isLoaded && (
          <div className="absolute z-50 flex flex-col items-center">
            <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-primary-container shadow-[0_0_20px_#00f2ff]"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="mt-8 font-mono text-[10px] tracking-[0.6em] text-primary-container animate-pulse uppercase">
              BEYCRAFT SYSTEMS: {loadingProgress}%
            </p>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover block"
        />

        {/* Tactical HUD */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-primary-container/20"></div>
          <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-primary-container/20"></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-primary-container/20"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-primary-container/20"></div>
        </div>

        {/* Dynamic Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-6 text-center pointer-events-none">
          <motion.div style={{ opacity: mainContentOpacity, y: mainContentY }}>
            <h1 className="font-orbitron font-bold text-6xl md:text-[10rem] tracking-tighter text-white drop-shadow-[0_0_50px_rgba(0,242,255,0.4)]">
              BEYCRAFT
            </h1>
            <p className="mt-8 font-mono text-sm md:text-2xl tracking-[0.8em] text-primary-container uppercase font-bold drop-shadow-[0_0_15px_#00f2ff]">
              Unleash the Spin
            </p>
          </motion.div>

          <motion.div 
            style={{ opacity: ctaOpacity, scale: ctaScale }}
            className="mt-20 pointer-events-auto"
          >
            <Link href="/customize" className="px-16 py-7 bg-primary-container text-background font-bold text-2xl uppercase tracking-[0.4em] clip-path-polygon hover:bg-white transition-all hover:shadow-[0_0_80px_rgba(0,242,255,0.8)]">
              Initialize Forge
            </Link>
          </motion.div>
        </div>

        {/* Scroll CTA */}
        <motion.div 
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none"
        >
          <p className="text-[10px] font-mono tracking-[0.5em] text-primary-container/30 uppercase mb-4">Scroll to Assemble</p>
          <div className="w-[1px] h-20 bg-gradient-to-b from-primary-container/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
