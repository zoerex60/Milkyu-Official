import { useMotionValue, useSpring, motion } from "motion/react";
import { useState, useRef, useEffect, useId } from "react";

interface BobaCupProps {
  flavor: "matcha" | "strawberry" | "chocolate";
  title: string;
  description: string;
}

const MILK_Y = 218;

const flavorColors = {
  matcha: {
    drinkTop: "#4a7c4e",
    drinkMid: "#6aaa6e",
    drinkSwirl: "#a8d5a2",
    milkBase: "#e8f0e0",
    accent: "#5a9c5a",
    iceGlow: "rgba(168,213,162,0.35)",
  },
  strawberry: {
    drinkTop: "#e8606e",
    drinkMid: "#f0899a",
    drinkSwirl: "#f9c0c8",
    milkBase: "#fef0f2",
    accent: "#e8607a",
    iceGlow: "rgba(249,192,200,0.35)",
  },
  chocolate: {
    drinkTop: "#3b1f0e",
    drinkMid: "#6b3a1f",
    drinkSwirl: "#a0673a",
    milkBase: "#f0e6d8",
    accent: "#8b5a3c",
    iceGlow: "rgba(160,103,58,0.25)",
  },
};

// 1 baris penuh rapat di atas susu, geser kiri-kanan bergantian
const ICE_LAYOUT = [
  { x: 62,  w: 34, h: 33, delay: 0,   slideDir:  1 },
  { x: 97,  w: 38, h: 35, delay: 0.4, slideDir: -1 },
  { x: 136, w: 34, h: 33, delay: 0.8, slideDir:  1 },
  { x: 171, w: 30, h: 31, delay: 0.2, slideDir: -1 },
];

function cupLeftAt(y: number) {
  return 58 + (90 - 58) * (y - 130) / (358 - 130);
}
function cupRightAt(y: number) {
  return 202 + (170 - 202) * (y - 130) / (358 - 130);
}

export function BobaCup({ flavor, title, description }: BobaCupProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");

  const c = flavorColors[flavor];

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 280, damping: 28 });
  const springRotateY = useSpring(rotateY, { stiffness: 280, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 22;
    const rx = ((rect.height / 2 - y) / (rect.height / 2)) * 14;
    rotateY.set(ry);
    rotateX.set(rx);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const t = e.touches[0];
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 22;
    const rx = ((rect.height / 2 - y) / (rect.height / 2)) * 14;
    rotateY.set(ry);
    rotateX.set(rx);
  };

  const handleTouchEnd = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      className="flex flex-col items-center gap-6"
      style={{ width: "100%", maxWidth: "260px", margin: "0 auto" }}
    >
      <style>{`
        @keyframes swirl1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,8px)} }
        @keyframes swirl2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12px,-6px)} }
        @keyframes swirl3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-10px,4px)} }
        .sw1 { animation: swirl1 3s ease-in-out infinite; }
        .sw2 { animation: swirl2 4s ease-in-out infinite; }
        .sw3 { animation: swirl3 5s ease-in-out infinite; }

        @keyframes ice-shimmer {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.85; }
        }
        @keyframes ice-slide-r {
          0%, 100% { transform: translateX(0px); }
          50%       { transform: translateX(3px); }
        }
        @keyframes ice-slide-l {
          0%, 100% { transform: translateX(0px); }
          50%       { transform: translateX(-3px); }
        }
        .ice-shimmer  { animation: ice-shimmer 2.8s ease-in-out infinite; }
        .ice-slide-r  { animation: ice-slide-r 3.5s ease-in-out infinite; }
        .ice-slide-l  { animation: ice-slide-l 3.5s ease-in-out infinite; }
      `}</style>

      <motion.div
        className="relative cursor-pointer select-none w-full"
        style={{ perspective: "1000px", aspectRatio: "220 / 350" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        whileHover={{ scale: 1.03 }}
      >
        <motion.div
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 260 420"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: "translateZ(40px)" }}
          >
            <defs>
              <clipPath id={`cupClip-${uid}`}>
                <path d="M 58 130 L 90 358 Q 90 368 105 368 L 155 368 Q 170 368 170 358 L 202 130 Z" />
              </clipPath>
              <filter id={`iceGlow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <radialGradient id={`iceGrad-${uid}`} cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="60%" stopColor="rgba(220,240,255,0.65)" />
                <stop offset="100%" stopColor="rgba(180,220,245,0.40)" />
              </radialGradient>
            </defs>

            {/* Dome lid */}
            <path
              d="M 54 117 Q 54 76 130 74 Q 206 76 206 117 L 206 128 L 54 128 Z"
              fill="rgba(210,228,240,0.92)"
              stroke="rgba(170,200,220,0.65)"
              strokeWidth="1"
            />
            <path
              d="M 62 115 Q 64 88 110 82"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="54" y="118" width="152" height="10" rx="3" fill="rgba(190,215,232,0.88)" />
            <rect x="58" y="119" width="80" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />

            <g clipPath={`url(#cupClip-${uid})`}>
              {/* Drink top layer */}
              <rect x="55" y="130" width="150" height="90" fill={c.drinkTop} />

              {/* Swirl animations */}
              <path
                className="sw1"
                d="M 58 175 Q 100 157 140 181 Q 172 199 205 171"
                stroke={c.drinkSwirl}
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <path
                className="sw2"
                d="M 58 195 Q 96 213 138 195 Q 170 179 205 201"
                stroke={c.drinkMid}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />

              {/* ── ICE CUBES — 1 baris penuh, geser kiri-kanan ── */}
              {ICE_LAYOUT.map((ice, i) => {
                const iy = MILK_Y - ice.h;
                const midY = iy + ice.h / 2;
                const lw = cupLeftAt(midY) + 2;
                const rw = cupRightAt(midY) - 2;
                const cx = Math.max(lw, Math.min(ice.x, rw - ice.w));
                const slideClass = ice.slideDir > 0 ? "ice-slide-r" : "ice-slide-l";
                return (
                  <g key={i} className={slideClass} style={{ animationDelay: `${ice.delay}s` }}>
                    <rect x={cx - 3} y={iy - 3} width={ice.w + 6} height={ice.h + 6} rx="9"
                      fill={c.iceGlow} filter={`url(#iceGlow-${uid})`} />
                    <rect x={cx} y={iy} width={ice.w} height={ice.h} rx="8"
                      fill={`url(#iceGrad-${uid})`} stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" />
                    <rect x={cx + 5} y={iy + 5} width={Math.max(ice.w - 16, 6)} height={4} rx="2"
                      fill="rgba(255,255,255,0.82)" className="ice-shimmer"
                      style={{ animationDelay: `${ice.delay + 0.5}s` }} />
                    <line x1={cx + ice.w - 7} y1={iy + 6} x2={cx + ice.w - 7} y2={iy + ice.h - 7}
                      stroke="rgba(255,255,255,0.32)" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                );
              })}

              {/* Milk base */}
              <rect x="55" y={MILK_Y} width="150" height="160" fill={c.milkBase} />
              <path
                className="sw3"
                d="M 60 220 Q 100 231 138 217 Q 168 206 208 223"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Cup glass overlay */}
            <path
              d="M 58 130 L 90 358 Q 90 368 105 368 L 155 368 Q 170 368 170 358 L 202 130 Z"
              fill="rgba(230,244,255,0.10)"
              stroke="rgba(175,210,235,0.45)"
              strokeWidth="1.5"
            />
            <path d="M 62 137 L 92 351" stroke="rgba(255,255,255,0.42)" strokeWidth="6" strokeLinecap="round" />
            <path d="M 198 137 L 168 351" stroke="rgba(255,255,255,0.14)" strokeWidth="3" strokeLinecap="round" />

            {/* White bottom base */}
            <path
              d="M 92 331 L 90 358 Q 90 368 105 368 L 155 368 Q 170 368 170 358 L 168 331 Z"
              fill="rgba(245,244,240,0.97)"
              stroke="rgba(200,198,192,0.35)"
              strokeWidth="1"
            />
            <line x1="92" y1="331" x2="168" y2="331" stroke="rgba(185,182,175,0.3)" strokeWidth="1" />

            {/* Logo */}
            <foreignObject x="88" y="241" width="84" height="80">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  src="/milkyu-logo.png"
                  alt="Milkyu"
                  style={{ width: "72px", height: "72px", objectFit: "contain", opacity: 0.88 }}
                />
              </div>
            </foreignObject>

            {/* Straw */}
            <rect x="129" y="30" width="9" height="175" rx="4.5" fill="rgba(0,0,0,0.18)" transform="rotate(7, 133, 110)" />
            <rect x="127" y="28" width="9" height="175" rx="4.5" fill="#111111" transform="rotate(7, 131, 109)" />
            <rect x="128.5" y="30" width="2.5" height="155" rx="1.25" fill="rgba(255,255,255,0.18)" transform="rotate(7, 129.5, 101)" />
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
          style={{ color: c.accent, fontSize: "clamp(1.1rem, 4vw, 1.5rem)", fontWeight: 600 }}
        >
          {title}
        </h3>
        <p style={{ color: "#666", fontSize: "clamp(0.8rem, 3vw, 0.95rem)", lineHeight: 1.5 }}>
          {description}
        </p>
      </motion.div>
    </div>
  );
}
