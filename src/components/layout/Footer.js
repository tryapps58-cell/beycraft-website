'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="w-full border-t border-primary-container/10 bg-background pt-20 pb-10 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00f2ff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
        <div className="max-w-xs">
          <Link href="/" className="font-orbitron font-black text-3xl tracking-tighter text-white">
            BEY<span className="text-primary-container">CRAFT</span>
          </Link>
          <p className="text-surface-variant font-mono text-[10px] mt-6 uppercase tracking-[0.3em] leading-relaxed opacity-60">
            Forge Your Legend. The ultimate tactical beyblade customization platform for high-performance bladers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-20">
          <div className="space-y-4">
            <h4 className="font-orbitron text-[10px] font-bold text-white tracking-[0.2em] uppercase">Operations</h4>
            <div className="flex flex-col space-y-2 text-[10px] font-mono text-surface-variant uppercase tracking-widest">
              <Link href="/customize" className="hover:text-primary-container transition-colors">Forge</Link>
              <Link href="/gallery" className="hover:text-primary-container transition-colors">Vault</Link>
              <Link href="/account/builds" className="hover:text-primary-container transition-colors">Arsenal</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-orbitron text-[10px] font-bold text-white tracking-[0.2em] uppercase">Protocol</h4>
            <div className="flex flex-col space-y-2 text-[10px] font-mono text-surface-variant uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-primary-container transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primary-container transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-20 pt-8 border-t border-surface-bright/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary-container rounded-full animate-pulse" />
          <p className="text-[9px] font-mono text-surface-variant uppercase tracking-[0.2em]">System Status: All Core Systems Operational</p>
        </div>
        <p className="text-[9px] font-mono text-surface-variant/40 uppercase tracking-widest">
          © 2026 BEYCRAFT TERMINAL. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  )
}
