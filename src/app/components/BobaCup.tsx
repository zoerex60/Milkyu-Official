import { motion, useMotionValue, useSpring } from "motion/react";
import { useState, useRef, useEffect } from "react";

interface BobaCupProps {
  flavor: "matcha" | "strawberry" | "chocolate";
  title: string;
  description: string;
  hideText?: boolean;
}

export function BobaCup({ flavor, title, description, hideText = false }: BobaCupProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 25 });

  const flavorColors = {
    matcha: {
      drinkTop: "#4a7c4e", drinkMid: "#6aaa6e", drinkSwirl: "#a8d5a2",
      milkBase: "#e8f0e0", accent: "#5a9c5a",
    },
    strawberry: {
      drinkTop: "#e8606e", drinkMid: "#f0899a", drinkSwirl: "#f9c0c8",
      milkBase: "#fef0f2", accent: "#e8607a",
    },
    chocolate: {
      drinkTop: "#3b1f0e", drinkMid: "#6b3a1f", drinkSwirl: "#a0673a",
      milkBase: "#f0e6d8", accent: "#8b5a3c",
    },
  };

  const c = flavorColors[flavor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPressed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rotateY.set(((x - rect.width / 2) / (rect.width / 2)) * 12);
      rotateX.set(((rect.height / 2 - y) / (rect.height / 2)) * 12);
    }
  };

  const handleMouseLeave = () => {
    if (!isPressed) { rotateX.set(0); rotateY.set(0); }
  };

  const handlePressStart = () => {
    pressTimerRef.current = setTimeout(() => {
      setIsPressed(true);
      scale.set(1.5);
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

  const cupW = isMobile ? 160 : 260;
  const cupH = isMobile ? 260 : 420;

  return (
    <div className="flex flex-col items-center" style={{ gap: hideText ? 0 : "1.5rem" }}>
      <motion.div
        className="relative cursor-pointer select-none"
        style={{ width: cupW, height: cupH }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <motion.div
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            scale: springScale,
            // FIXED: HAPUS transformStyle:"preserve-3d" — ini yang bikin
            // elemen bisa keluar secara Z dan terpotong di mobile
            width: "100%",
            height: "100%",
          }}
        >
          <svg
            width={cupW}
            height={cupH}
            viewBox="0 0 260 420"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
            // FIXED: HAPUS style transform translateZ(50px) dari SVG
            // translateZ di dalam preserve-3d context = keluar dari viewport = TERPOTONG
          >
            <defs>
              <clipPath id={`cupClip-${flavor}`}>
                <path d="M 58 130 L 90 358 Q 90 368 105 368 L 155 368 Q 170 368 170 358 L 202 130 Z" />
              </clipPath>
              {/* FIXED: filter shadow punya x/y/width/height agar shadow tidak clip */}
              <filter id={`shadow-${flavor}`} x="-5%" y="-2%" width="115%" height="115%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                <feOffset dx="1" dy="5" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.15" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter={`url(#shadow-${flavor})`}>

              {/* DOME LID */}
              <path
                d="M 54 117 Q 54 76 130 74 Q 206 76 206 117 L 206 128 L 54 128 Z"
                fill="rgba(210,228,240,0.92)"
                stroke="rgba(170,200,220,0.65)"
                strokeWidth="1"
                fillOpacity="0.1"
              />
              <path d="M 62 115 Q 64 88 110 82" stroke="rgba(255,255,255,0.5)" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 100 76 Q 130 74 160 76" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" fill="none" />
              <rect x="54" y="118" width="152" height="10" rx="3" fill="rgba(190,215,232,0.88)" stroke="rgba(160,195,218,0.5)" strokeWidth="1" />
              <rect x="58" y="119" width="80" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />

              {/* CUP BODY */}
              <g clipPath={`url(#cupClip-${flavor})`}>
                <rect x="55" y="130" width="150" height="90" fill={c.drinkTop} />
                <path d="M 58 175 Q 100 157 140 181 Q 172 199 205 171" stroke={c.drinkSwirl} strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.55">
                  <animateTransform attributeName="transform" type="translate" values="0,0; -15,8; 0,0" dur="3s" repeatCount="indefinite" />
                </path>
                <path d="M 58 195 Q 96 213 138 195 Q 170 179 205 201" stroke={c.drinkMid} strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.45">
                  <animateTransform attributeName="transform" type="translate" values="0,0; 12,-6; 0,0" dur="4s" repeatCount="indefinite" />
                </path>
                <rect x="70" y="137" width="28" height="22" rx="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                <rect x="106" y="131" width="26" height="24" rx="5" fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <rect x="142" y="135" width="28" height="22" rx="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                <rect x="84" y="163" width="22" height="20" rx="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                <rect x="150" y="163" width="24" height="20" rx="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                <rect x="55" y="218" width="150" height="160" fill={c.milkBase} />
                <path d="M 60 220 Q 100 231 138 217 Q 168 206 208 223" stroke="rgba(255,255,255,0.75)" strokeWidth="12" strokeLinecap="round" fill="none">
                  <animateTransform attributeName="transform" type="translate" values="0,0; -10,4; 0,0" dur="5s" repeatCount="indefinite" />
                </path>
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

              {/* WHITE BOTTOM BASE */}
              <path
                d="M 92 331 L 90 358 Q 90 368 105 368 L 155 368 Q 170 368 170 358 L 168 331 Z"
                fill="rgba(245,244,240,0.97)"
                stroke="rgba(200,198,192,0.35)"
                strokeWidth="1"
              />
              <line x1="92" y1="331" x2="168" y2="331" stroke="rgba(185,182,175,0.3)" strokeWidth="1" />

              {/* LOGO */}
              <foreignObject x="88" y="241" width="84" height="80">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                  <img
                    src="/milkyu-logo.png"
                    alt="Milkyu"
                    style={{
                      width: "72px", height: "72px", objectFit: "contain",
                      opacity: isHovered || isPressed ? 1 : 0.88,
                      transition: "opacity 0.2s",
                    }}
                  />
                </div>
              </foreignObject>

              {/* STRAW */}
              <rect x="129" y="30" width="9" height="175" rx="4.5" fill="rgba(0,0,0,0.18)" transform="rotate(7, 133, 110)" />
              <rect x="127" y="28" width="9" height="175" rx="4.5" fill="#111111" transform="rotate(7, 131, 109)" />
              <rect x="128.5" y="30" width="2.5" height="155" rx="1.25" fill="rgba(255,255,255,0.18)" transform="rotate(7, 129.5, 101)" />

            </g>
          </svg>
        </motion.div>
      </motion.div>

      {!hideText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ maxWidth: isMobile ? "180px" : "280px" }}
        >
          <h3 className="mb-1" style={{ color: c.accent, fontSize: isMobile ? "1.1rem" : "1.5rem", fontWeight: 600 }}>
            {title}
          </h3>
          <p style={{ color: "#666", fontSize: isMobile ? "0.8rem" : "0.95rem", lineHeight: 1.5 }}>{description}</p>
        </motion.div>
      )}
    </div>
  );
}
