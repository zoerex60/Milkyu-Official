import { motion, useMotionValue, useSpring } from "motion/react";
import { useState, useRef, useEffect } from "react";

// Hook deteksi mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

interface BobaCupProps {
  flavor: "matcha" | "strawberry" | "chocolate";
  title: string;
  description: string;
}

export function BobaCup({ flavor, title, description }: BobaCupProps) {
  const isMobile = useIsMobile();
  const cupW = isMobile ? 160 : 260;
  const cupH = isMobile ? 249 : 405;

  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 25 });

  const flavorColors = {
    matcha: {
      drinkTop: "#4a7c4e",
      drinkMid: "#6aaa6e",
      drinkSwirl: "#a8d5a2",
      milkBase: "#e8f0e0",
      accent: "#5a9c5a",
    },
    strawberry: {
      drinkTop: "#c0392b",
      drinkMid: "#e05a6a",
      drinkSwirl: "#f4a0a8",
      milkBase: "#fce8ea",
      accent: "#ff5689",
    },
    chocolate: {
      drinkTop: "#3b1f0e",
      drinkMid: "#6b3a1f",
      drinkSwirl: "#a0673a",
      milkBase: "#f0e6d8",
      accent: "#8b5a3c",
    },
  };

  const c = flavorColors[flavor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPressed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rotateY.set(((x - rect.width / 2) / (rect.width / 2)) * 15);
      rotateX.set(((rect.height / 2 - y) / (rect.height / 2)) * 15);
    }
  };

  const handleMouseLeave = () => {
    if (!isPressed) { rotateX.set(0); rotateY.set(0); }
  };

  const handlePressStart = () => {
    pressTimerRef.current = setTimeout(() => {
      setIsPressed(true);
      scale.set(1.8);
      rotateX.set(0);
      rotateY.set(0);
    }, 500);
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    setIsPressed(false);
    scale.set(1);
  };

  useEffect(() => {
    return () => { if (pressTimerRef.current) clearTimeout(pressTimerRef.current); };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        className="relative cursor-pointer select-none"
        style={{ perspective: "1000px", width: `${cupW}px`, height: `${cupH}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            scale: springScale,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 260 405"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: "translateZ(50px)" }}
          >
            <defs>
              {/* Cup body clip */}
              <clipPath id={`cupClip-${flavor}`}>
                <path d="M 58 157 L 90 385 Q 90 395 105 395 L 155 395 Q 170 395 170 385 L 202 157 Z" />
              </clipPath>
              <filter id={`shadow-${flavor}`}>
                <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
                <feOffset dx="2" dy="8" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.2" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter={`url(#shadow-${flavor})`}>

              {/* ── DOME LID ── */}
              {/* Dome body — transparan kebiruan seperti plastik boba */}
              <path
                d="M 54 157 Q 54 95 130 95 Q 206 95 206 157 Z"
                fill="rgba(235,245,255,0.08)"
                stroke="rgba(170,205,228,0.5)"
                strokeWidth="1"
              />
              {/* Dome inner highlight kiri — efek kaca melengkung */}
              <path
                d="M 72 152 Q 70 118 105 100"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Dome inner highlight kanan kecil */}
              <path
                d="M 168 142 Q 178 118 168 100"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Snap ring / locking ring — tonjolan melingkar biar tutup ngeklik */}
              {/* Ring body — sedikit lebih lebar dari cup, menonjol keluar */}
              <ellipse cx="130" cy="160" rx="82" ry="8" fill="rgba(195,218,240,0.95)" stroke="rgba(145,185,215,0.8)" strokeWidth="1.2" />
              {/* Ring bawah — tepi bawah yang menggigit bibir cup */}
              <ellipse cx="130" cy="165" rx="80" ry="5" fill="rgba(175,205,228,0.85)" stroke="rgba(140,180,210,0.6)" strokeWidth="1" />
              {/* Highlight atas ring — efek plastik mengkilap */}
              <ellipse cx="130" cy="157" rx="80" ry="5" fill="rgba(255,255,255,0.45)" stroke="none" />
              {/* Shadow dalam ring — kedalaman snap */}
              <ellipse cx="130" cy="162" rx="74" ry="3.5" fill="rgba(130,170,200,0.2)" stroke="none" />

              {/* ── CUP BODY – drink fill ── */}
              <g clipPath={`url(#cupClip-${flavor})`}>
                <rect x="55" y="157" width="150" height="90" fill={c.drinkTop} />
                {/* Animated swirl layer 1 */}
                <path d="M 58 202 Q 100 184 140 208 Q 172 226 205 198" stroke={c.drinkSwirl} strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.55">
                  <animateTransform attributeName="transform" type="translate" values="0,0; -15,8; 0,0" dur="3s" repeatCount="indefinite" />
                </path>
                {/* Animated swirl layer 2 */}
                <path d="M 58 222 Q 96 240 138 222 Q 170 206 205 228" stroke={c.drinkMid} strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.45">
                  <animateTransform attributeName="transform" type="translate" values="0,0; 12,-6; 0,0" dur="4s" repeatCount="indefinite" />
                </path>
                {/* Ice cubes */}
                <rect x="70" y="164" width="28" height="22" rx="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                <rect x="106" y="158" width="26" height="24" rx="5" fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <rect x="142" y="162" width="28" height="22" rx="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                <rect x="84" y="190" width="22" height="20" rx="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                <rect x="150" y="190" width="24" height="20" rx="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                {/* Milk base */}
                <rect x="55" y="245" width="150" height="160" fill={c.milkBase} />
                {/* Animated milk swirl */}
                <path d="M 60 247 Q 100 258 138 244 Q 168 233 208 250" stroke="rgba(255,255,255,0.75)" strokeWidth="12" strokeLinecap="round" fill="none">
                  <animateTransform attributeName="transform" type="translate" values="0,0; -10,4; 0,0" dur="5s" repeatCount="indefinite" />
                </path>
              </g>

              {/* Cup glass overlay */}
              <path
                d="M 58 157 L 90 385 Q 90 395 105 395 L 155 395 Q 170 395 170 385 L 202 157 Z"
                fill="rgba(230,244,255,0.10)"
                stroke="rgba(175,210,235,0.45)"
                strokeWidth="1.5"
              />
              {/* Left highlight */}
              <path d="M 62 164 L 92 378" stroke="rgba(255,255,255,0.42)" strokeWidth="6" strokeLinecap="round" />
              {/* Right faint highlight */}
              <path d="M 198 164 L 168 378" stroke="rgba(255,255,255,0.14)" strokeWidth="3" strokeLinecap="round" />

              {/* ── WHITE BOTTOM BASE ── */}
              <path
                d="M 92 358 L 90 385 Q 90 395 105 395 L 155 395 Q 170 395 170 385 L 168 358 Z"
                fill="rgba(245,244,240,0.97)"
                stroke="rgba(200,198,192,0.35)"
                strokeWidth="1"
              />
              <line x1="92" y1="358" x2="168" y2="358" stroke="rgba(185,182,175,0.3)" strokeWidth="1" />

              {/* ── LOGO ── */}
              <foreignObject x="88" y="268" width="84" height="80">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                  <img
                    src="/milkyu-logo.png"
                    alt="Milkyu"
                    style={{
                      width: "72px",
                      height: "72px",
                      objectFit: "contain",
                      opacity: isHovered || isPressed ? 1 : 0.88,
                      transition: "opacity 0.2s",
                    }}
                  />
                </div>
              </foreignObject>

              {/* ── STRAW — menembus kubah dari atas ── */}
              <rect x="129" y="50" width="9" height="180" rx="4.5" fill="rgba(0,0,0,0.18)" transform="rotate(7, 133, 130)" />
              <rect x="127" y="48" width="9" height="180" rx="4.5" fill="#111111" transform="rotate(7, 131, 129)" />
              <rect x="128.5" y="50" width="2.5" height="162" rx="1.25" fill="rgba(255,255,255,0.18)" transform="rotate(7, 129.5, 121)" />

              {/* ── TOP RIM (cup-to-dome junction) ── */}
              <ellipse cx="130" cy="157" rx="74" ry="8" fill="rgba(205,225,240,0.45)" stroke="rgba(165,195,218,0.5)" strokeWidth="1" />

            </g>
          </svg>
        </motion.div>


      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xs"
      >
        <h3 className="mb-2" style={{ color: c.accent, fontSize: "1.5rem", fontWeight: 600 }}>
          {title}
        </h3>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>{description}</p>
      </motion.div>
    </div>
  );
}
