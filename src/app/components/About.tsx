import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Droplets } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
      {/* Soft background decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-bl-[100px] -z-0"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-700 font-bold mb-6">
            <Heart size={16} className="fill-pink-400 text-pink-400" />
            <span>Cerita Kami</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-amber-950 mb-8 tracking-tight">
            Apa itu <span className="text-pink-500">Stickymilk</span>?
          </h2>
          
          <p className="text-xl md:text-2xl text-amber-900/70 leading-relaxed font-medium bg-amber-50/50 p-8 md:p-12 rounded-[3rem] shadow-sm border border-amber-100/50">
            Kami percaya bahwa susu bukan sekadar minuman; ini adalah sebuah pengalaman. 
            Lahir dari dapur kecil dengan mimpi besar, Stickymilk meracik minuman yang menyenangkan, 
            bernostalgia, dan sangat lezat. <strong className="text-amber-950">Milkyu</strong> adalah kreasi terbaru kami—perpaduan sempurna antara kelezatan krim dan nuansa Gen-Z, 
            dirancang untuk membuatmu tersenyum di setiap tegukan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Droplets, title: "Krim Lembut", desc: "Kaya, lezat, dan manis yang pas.", color: "bg-blue-50 text-blue-500" },
            { icon: Sparkles, title: "Rasa Seru", desc: "Sangat inovatif dan bikin nostalgia.", color: "bg-pink-50 text-pink-500" },
            { icon: Heart, title: "Dibuat dgn Cinta", desc: "Diracik untuk membuat harimu lebih baik.", color: "bg-emerald-50 text-emerald-500" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-amber-950 mb-2">{feature.title}</h3>
              <p className="text-amber-900/60 font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
