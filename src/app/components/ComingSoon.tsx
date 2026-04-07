import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ComingSoon() {
  return (
    <section id="coming-soon" className="py-32 px-6 md:px-12 bg-[#FAFAFA] relative overflow-hidden flex flex-col items-center justify-center min-h-[70vh]">
      {/* Playful Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          }} 
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-pink-200/50 mix-blend-multiply filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -30, 0]
          }} 
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[10%] left-[10%] w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full bg-amber-100/50 mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="mb-8 relative"
        >
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-pink-100/50 rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
            <ImageWithFallback 
              src="/Milkyulogo.png" 
              alt="Milkyu Logo" 
              className="w-32 h-32 md:w-48 md:h-48 object-contain"
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-black text-amber-950 mb-6 tracking-tighter"
        >
          SEGERA <span className="text-pink-500">HADIR</span>
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-amber-800/80 font-medium max-w-2xl"
        >
          Kami sedang menyiapkan sesuatu yang sangat lezat untukmu. Tetap ikuti perkembangannya!
        </motion.p>
      </div>
    </section>
  );
}
