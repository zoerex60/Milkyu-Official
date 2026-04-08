import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FAFAFA]"
    >
      {/* Playful Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          }} 
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-pink-200/50 mix-blend-multiply filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -30, 0]
          }} 
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-emerald-200/40 mix-blend-multiply filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            x: [0, 20, 0]
          }} 
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-amber-100/50 mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="mb-8 relative"
        >
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute -inset-10 border-2 border-dashed border-pink-300 rounded-full opacity-50"
          />
          
          <div className="bg-white p-6 rounded-full shadow-2xl shadow-pink-100">
            <ImageWithFallback 
              src="/Milkyulogo.png"
              alt="Milkyu Big Logo" 
              className="w-45 h-45 md:w-60 md:h-60 object-contain"
            />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-black text-amber-950 mb-4 tracking-tight"
        >
          Manisnya pas,<br className="md:hidden" />
          <span className="text-pink-500 relative inline-block">
             Segarnya dapet
            <svg className="absolute w-full h-4 -bottom-1 left-0 text-pink-300 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q 50 20 100 10" fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-amber-800/80 mb-10 max-w-lg font-medium"
        >
          Nikmati perpaduan susu yang segar di tenggorokan dengan sedikit saus kental. Karena yang enak nggak harus berlebihan.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-amber-950 text-white font-bold rounded-full text-xl shadow-xl shadow-amber-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
          >
            Segera Hadir
            <motion.span 
              animate={{ x: [0, 5, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🚀
            </motion.span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}