import { motion, useMotionValue, useSpring } from "motion/react";
import { useState, useRef, useEffect } from "react";

interface BobaCupProps {
  flavor: "matcha" | "strawberry" | "chocolate";
  title: string;
  description: string;
}

export function BobaCup({ flavor, title, description }: BobaCupProps) {
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
        style={{ perspective: "1000px", width: "260px", height: "400px" }}
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
            width="260"
            height="400"
            viewBox="0 0 260 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: "translateZ(50px)" }}
          >
            <defs>
              {/* Cup: wide at top (x: 58-202), narrow at bottom (x: 90-170) */}
              <clipPath id={`cupClip-${flavor}`}>
                <path d="M 58 117 L 90 345 Q 90 355 105 355 L 155 355 Q 170 355 170 345 L 202 117 Z" />
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

              {/* ── FLAT LID ── */}
              {/* Flat lid surface */}
              <rect x="54" y="104" width="152" height="14" rx="4" fill="rgba(210,228,240,0.9)" stroke="rgba(170,200,220,0.6)" strokeWidth="1" />
              {/* Lid highlight */}
              <rect x="58" y="106" width="90" height="4" rx="2" fill="rgba(255,255,255,0.45)" />
              {/* Lid top ellipse (lip) */}
              <ellipse cx="130" cy="104" rx="76" ry="6" fill="rgba(200,220,235,0.85)" stroke="rgba(165,195,218,0.55)" strokeWidth="1" />

              {/* ── CUP BODY – drink fill ── */}
              <g clipPath={`url(#cupClip-${flavor})`}>
                <rect x="55" y="117" width="150" height="90" fill={c.drinkTop} />
                {/* Animated swirl layer 1 */}
                <path d="M 58 162 Q 100 144 140 168 Q 172 186 205 158" stroke={c.drinkSwirl} strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.55">
                  <animateTransform attributeName="transform" type="translate" values="0,0; -15,8; 0,0" dur="3s" repeatCount="indefinite" />
                </path>
                {/* Animated swirl layer 2 */}
                <path d="M 58 182 Q 96 200 138 182 Q 170 166 205 188" stroke={c.drinkMid} strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.45">
                  <animateTransform attributeName="transform" type="translate" values="0,0; 12,-6; 0,0" dur="4s" repeatCount="indefinite" />
                </path>
                {/* Ice cubes */}
                <rect x="70" y="124" width="28" height="22" rx="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                <rect x="106" y="118" width="26" height="24" rx="5" fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <rect x="142" y="122" width="28" height="22" rx="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                <rect x="84" y="150" width="22" height="20" rx="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                <rect x="150" y="150" width="24" height="20" rx="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                {/* Milk base */}
                <rect x="55" y="205" width="150" height="160" fill={c.milkBase} />
                {/* Animated milk swirl */}
                <path d="M 60 207 Q 100 218 138 204 Q 168 193 208 210" stroke="rgba(255,255,255,0.75)" strokeWidth="12" strokeLinecap="round" fill="none">
                  <animateTransform attributeName="transform" type="translate" values="0,0; -10,4; 0,0" dur="5s" repeatCount="indefinite" />
                </path>
              </g>

              {/* Cup glass overlay */}
              <path
                d="M 58 117 L 90 345 Q 90 355 105 355 L 155 355 Q 170 355 170 345 L 202 117 Z"
                fill="rgba(230,244,255,0.10)"
                stroke="rgba(175,210,235,0.45)"
                strokeWidth="1.5"
              />
              {/* Left highlight */}
              <path d="M 62 124 L 92 338" stroke="rgba(255,255,255,0.42)" strokeWidth="6" strokeLinecap="round" />
              {/* Right faint highlight */}
              <path d="M 198 124 L 168 338" stroke="rgba(255,255,255,0.14)" strokeWidth="3" strokeLinecap="round" />

              {/* ── WHITE BOTTOM BASE ── */}
              <path
                d="M 92 318 L 90 345 Q 90 355 105 355 L 155 355 Q 170 355 170 345 L 168 318 Z"
                fill="rgba(245,244,240,0.97)"
                stroke="rgba(200,198,192,0.35)"
                strokeWidth="1"
              />
              <line x1="92" y1="318" x2="168" y2="318" stroke="rgba(185,182,175,0.3)" strokeWidth="1" />

              {/* ── LOGO ── */}
              <foreignObject x="88" y="228" width="84" height="80">
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

              {/* ── STRAW ── */}
              <rect x="129" y="40" width="9" height="175" rx="4.5" fill="rgba(0,0,0,0.18)" transform="rotate(7, 133, 120)" />
              <rect x="127" y="38" width="9" height="175" rx="4.5" fill="#111111" transform="rotate(7, 131, 119)" />
              <rect x="128.5" y="40" width="2.5" height="155" rx="1.25" fill="rgba(255,255,255,0.18)" transform="rotate(7, 129.5, 111)" />

              {/* ── TOP RIM ── */}
              <ellipse cx="130" cy="117" rx="74" ry="8" fill="rgba(205,225,240,0.45)" stroke="rgba(165,195,218,0.5)" strokeWidth="1" />

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
