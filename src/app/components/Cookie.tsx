import { useMotionValue, useSpring, motion } from "motion/react";
import { useId } from "react";

interface CookieProps {
  title: string;
  description: string;
}

const CHIPS = [
  // Area Atas & Tengah (Tambahan untuk memenuhi cookie)
  { cx: 130, cy: 85,  rx: 7.5, ry: 5.5, a: 5   },
  { cx: 95,  cy: 98,  rx: 6.5, ry: 4.5, a: -12 },
  { cx: 165, cy: 95,  rx: 8,   ry: 5,   a: 15  },
  { cx: 115, cy: 120, rx: 8,   ry: 5.5, a: -5  },
  { cx: 155, cy: 128, rx: 7.5, ry: 5,   a: 8   },
  { cx: 75,  cy: 135, rx: 7,   ry: 5,   a: -20 },
  { cx: 185, cy: 140, rx: 7,   ry: 5,   a: 22  },
  { cx: 135, cy: 150, rx: 8,   ry: 6,   a: 0   },
  { cx: 65,  cy: 165, rx: 6,   ry: 4.5, a: -25 },
  { cx: 198, cy: 170, rx: 6.5, ry: 4,   a: 30  },

  // Area Bawah (Kode asli bawaan)
  { cx: 88,  cy: 182, rx: 8,   ry: 5.5, a: -15 },
  { cx: 132, cy: 178, rx: 8,   ry: 5.5, a: 0   },
  { cx: 174, cy: 182, rx: 7.5, ry: 5,   a: 14  },
  { cx: 100, cy: 210, rx: 7.5, ry: 5,   a: -10 },
  { cx: 162, cy: 208, rx: 7.5, ry: 5,   a: 10  },
  { cx: 132, cy: 226, rx: 8,   ry: 5.5, a: 0   },
  { cx: 80,  cy: 222, rx: 6.5, ry: 4.5, a: -14 },
  { cx: 184, cy: 222, rx: 6.5, ry: 4.5, a: 12  },
  { cx: 110, cy: 238, rx: 6,   ry: 4,   a: -8  },
  { cx: 155, cy: 237, rx: 6,   ry: 4,   a: 8   },
];

const CRUMBS = [
  { cx: 26,  cy: 122, r: 3,   delay: 0    },
  { cx: 14,  cy: 156, r: 2,   delay: 0.6  },
  { cx: 36,  cy: 194, r: 2.5, delay: 1.2  },
  { cx: 228, cy: 128, r: 2.5, delay: 0.3  },
  { cx: 240, cy: 164, r: 2,   delay: 0.9  },
  { cx: 230, cy: 200, r: 3,   delay: 1.5  },
  { cx: 70,  cy: 254, r: 2,   delay: 0.5  },
  { cx: 130, cy: 264, r: 2.5, delay: 1.1  },
  { cx: 190, cy: 257, r: 2,   delay: 0.8  },
];

export function Cookie({ title, description }: CookieProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 280, damping: 28 });
  const springRotateY = useSpring(rotateY, { stiffness: 280, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 18);
    rotateX.set(((rect.height / 2 - (e.clientY - rect.top)) / (rect.height / 2)) * 12);
  };
  const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0); };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const t = e.touches[0];
    rotateY.set(((t.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 18);
    rotateX.set(((rect.height / 2 - (t.clientY - rect.top)) / (rect.height / 2)) * 12);
  };
  const handleTouchEnd = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <div
      className="flex flex-col items-center gap-6"
      style={{ width: "100%", maxWidth: "260px", margin: "0 auto" }}
    >
      <style>{`
        @keyframes crumb-float {
          0%, 100% { transform: translateY(0px) scale(1);    opacity: 0.50; }
          50%       { transform: translateY(-5px) scale(1.15); opacity: 0.80; }
        }
        @keyframes cookie-breathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.006); }
        }
        .crumb-float    { animation: crumb-float    4s    ease-in-out infinite; }
        .cookie-breathe { animation: cookie-breathe 6s    ease-in-out infinite; }
      `}</style>

      <motion.div
        className="relative cursor-pointer select-none w-full"
        style={{ perspective: "1000px", aspectRatio: "260 / 290" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        whileHover={{ scale: 1.03 }}
      >
        <motion.div
          style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
          className="relative w-full h-full"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 260 290"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cookie-breathe"
          >
            <defs>
              {/* Cookie body — warm golden-brown */}
              <radialGradient id={`cookieGrad-${uid}`} cx="40%" cy="33%" r="68%">
                <stop offset="0%"   stopColor="#C11B17" />
                <stop offset="36%"  stopColor="#800517" />
                <stop offset="70%"  stopColor="#4E0707" />
                <stop offset="100%" stopColor="#2B0303" />
              </radialGradient>

              {/* Edge vignette for depth */}
              <radialGradient id={`edgeVig-${uid}`} cx="50%" cy="50%" r="50%">
                <stop offset="68%"  stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(48,18,0,0.30)" />
              </radialGradient>

              {/* Cookie drop shadow */}
              <filter id={`cookieShadow-${uid}`} x="-22%" y="-22%" width="144%" height="144%">
                <feDropShadow dx="0" dy="14" stdDeviation="17" floodColor="rgba(65,25,0,0.22)" />
              </filter>

              {/* Clip to cookie circle */}
              <clipPath id={`cookieClip-${uid}`}>
                <circle cx="130" cy="152" r="91" />
              </clipPath>
            </defs>

            {/* ── Floating crumb particles ── */}
            {CRUMBS.map((c, i) => (
              <circle
                key={i}
                cx={c.cx} cy={c.cy} r={c.r}
                fill="#800517"
                className="crumb-float"
                style={{ animationDelay: `${c.delay}s` }}
              />
            ))}

            {/* ── Ground shadow ellipse ── */}
            <ellipse cx="132" cy="264" rx="84" ry="9" fill="rgba(0,0,0,0.10)" />

            {/* ── Cookie body ── */}
            <circle
              cx="130" cy="152" r="91"
              fill={`url(#cookieGrad-${uid})`}
              filter={`url(#cookieShadow-${uid})`}
            />
            {/* Edge vignette ring */}
            <circle cx="130" cy="152" r="91" fill={`url(#edgeVig-${uid})`} />

            {/* ── Surface texture cracks (Lebih padat & menutupi seluruh permukaan) ── */}
            <g clipPath={`url(#cookieClip-${uid})`}>
            {/* Area Atas */}
            <path d="M 60,85 Q 95,70 130,80 T 200,75" stroke="rgba(72,28,0,0.15)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 50,110 Q 80,95 110,105 T 170,100 T 220,115" stroke="rgba(72,28,0,0.12)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  
            {/* Area Tengah Atas */}
            <path d="M 40,135 Q 85,120 130,135 T 220,130" stroke="rgba(72,28,0,0.18)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 65,155 Q 100,140 135,150 T 195,145" stroke="rgba(72,28,0,0.14)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Area Tengah Bawah (Garis yang lebih panjang) */}
            <path d="M 45,180 Q 90,165 135,175 T 215,170" stroke="rgba(72,28,0,0.18)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 55,205 Q 95,190 135,200 T 205,195" stroke="rgba(72,28,0,0.14)" strokeWidth="1.6" fill="none" strokeLinecap="round" />

            {/* Area Bawah */}
            <path d="M 70,230 Q 105,215 140,225 T 190,220" stroke="rgba(72,28,0,0.12)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 90,250 Q 120,235 150,245" stroke="rgba(72,28,0,0.10)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            
            {/* Garis-garis aksen pendek agar lebih natural */}
            <path d="M 80,120 Q 90,115 100,122" stroke="rgba(72,28,0,0.08)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 160,160 Q 175,155 185,165" stroke="rgba(72,28,0,0.08)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 120,210 Q 135,205 150,212" stroke="rgba(72,28,0,0.08)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

            {/* ── Chocolate chips ── */}
            {CHIPS.map((chip, i) => (
              <g key={i} transform={`rotate(${chip.a},${chip.cx},${chip.cy})`}>
                {/* Chip body */}
                <ellipse cx={chip.cx} cy={chip.cy} rx={chip.rx} ry={chip.ry} fill="#1C0500" />
                {/* Gloss highlight */}
                <ellipse
                  cx={chip.cx - chip.rx * 0.25}
                  cy={chip.cy - chip.ry * 0.28}
                  rx={chip.rx * 0.34}
                  ry={chip.ry * 0.26}
                  fill="rgba(255,255,255,0.18)"
                />
              </g>
            ))}

            
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center w-full"
      >
        <h3
          className="mb-1"
          style={{
            color: "#7A4800",
            fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
            fontWeight: 700,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "#888",
            fontSize: "clamp(0.8rem, 3vw, 0.95rem)",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </motion.div>
    </div>
  );
}