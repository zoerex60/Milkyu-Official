import React from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-amber-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-white rounded-full p-2 mb-8"
        >
          <ImageWithFallback src="/Milkyulogo.png" alt="Logo" className="w-full h-full object-contain" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
        >
          Kami Akan <br />
          <span className="text-pink-400 inline-block rotate-[-2deg]">Segera Hadir.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-amber-200/80 font-medium mb-12 max-w-xl"
        >
          Jadilah yang pertama tahu saat Milkyu kami rilis. Jangan sampai ketinggalan!
        </motion.p>

        <motion.a 
          href="https://instagram.com/milkyu.official"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 px-8 py-4 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-pink-500/20 mb-16 group"
        >
          <Instagram size={24} className="group-hover:rotate-12 transition-transform" />
          <span>Ikuti @milkyu.official di Instagram</span>
        </motion.a>

      </div>
      
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-amber-200/40 text-sm font-medium">© {new Date().getFullYear()} Milkyu official</p>
      </div>
    </section>
  );
}
