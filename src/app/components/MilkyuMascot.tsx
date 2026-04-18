import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const MOBILE  = { w: 85,  h: 110, right: 16, bottom: 16 };
const DESKTOP = { w: 130, h: 170, right: 24, bottom: 24 };

const BUBBLE_BG     = "rgba(245,245,245,1)";
const BUBBLE_BORDER = "1px solid rgba(0,0,0,0.07)";
const BUBBLE_SHADOW = "0 4px 16px rgba(0,0,0,0.10)";

export function MilkyuMascot() {
  const [open, setOpen] = useState(false);
  const [waving, setWaving] = useState(false);
  const [pupilX, setPupilX] = useState(0);
  const [pupilY, setPupilY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width * 0.5);
      const dy = e.clientY - (rect.top + rect.height * 0.25);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxPupil = 3.5;
      const factor = Math.min(dist / 120, 1);
      setPupilX(dist > 0 ? (dx / dist) * maxPupil * factor : 0);
      setPupilY(dist > 0 ? (dy / dist) * maxPupil * factor : 0);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isMobile]);

  useEffect(() => {
    setWaving(true);
    const t = setTimeout(() => setWaving(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    setOpen((v) => !v);
    setWaving(true);
    setTimeout(() => setWaving(false), 1000);
  };

  const size = isMobile ? MOBILE : DESKTOP;
  const bubbleRight  = size.right;
  const bubbleBottom = size.bottom + size.h + 12;
  const bubbleWidth = open ? (isMobile ? 170 : 200) : "max-content";

  return (
    <>
      <style>{`
        @keyframes milkyu-bounce {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes milkyu-wave {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(28deg); }
          35%  { transform: rotate(-18deg); }
          55%  { transform: rotate(22deg); }
          75%  { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes milkyu-tail {
          0%, 100% { transform: rotate(-14deg); }
          50%       { transform: rotate(14deg); }
        }
        @keyframes hint-pulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(0,0,0,0.10); }
          50%       { box-shadow: 0 4px 22px rgba(0,0,0,0.18); }
        }
        .milkyu-bounce   { animation: milkyu-bounce 2.4s ease-in-out infinite; }
        .milkyu-arm-wave {
          transform-origin: 104px 105px;
          animation: ${waving ? "milkyu-wave 0.95s ease-in-out" : "none"};
        }
        .milkyu-tail     { transform-origin: 90px 118px; animation: milkyu-tail 2s ease-in-out infinite; }
        .hint-pulse      { animation: hint-pulse 2.2s ease-in-out infinite; }
      `}</style>

      {/* ── BUBBLE — 1 elemen, konten langsung swap tanpa animasi exit/enter ── */}
      <div
        style={{
          position: "fixed",
          right: bubbleRight,
          bottom: bubbleBottom,
          zIndex: 9999,
          pointerEvents: open ? "auto" : "none",
          width: bubbleWidth,
        }}
      >
        <div
          className={open ? undefined : "hint-pulse"}
          style={{
            background: BUBBLE_BG,
            borderRadius: 16,
            boxShadow: BUBBLE_SHADOW,
            border: BUBBLE_BORDER,
            padding: isMobile ? "10px 13px" : "12px 16px",
            position: "relative",
          }}
        >
          {/* Panah bawah menunjuk ke maskot */}
          <div style={{
            position: "absolute",
            bottom: -10,
            right: 28,
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: `10px solid ${BUBBLE_BG}`,
            filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.06))",
          }} />

          {!open ? (
            /* Hint */
            <span style={{
              fontSize: isMobile ? "0.7rem" : "0.75rem",
              fontWeight: 700,
              color: "#555",
              whiteSpace: "nowrap",
            }}>
              Kyumii: "klik aku" 👆
            </span>
          ) : (
            /* Chat */
            <>
              <p style={{
                fontSize: isMobile ? "0.74rem" : "0.8rem",
                color: "#888",
                marginBottom: 9,
                fontWeight: 500,
                lineHeight: 1.45,
              }}>
                Kyumii: "Klik untuk pesan ya kak! Terimakasih🥰"
              </p>
              <a
                href="https://wa.me/6282246972263"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#25D366",
                  color: "#fff",
                  padding: isMobile ? "7px 10px" : "9px 13px",
                  borderRadius: 10,
                  fontSize: isMobile ? "0.76rem" : "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  marginBottom: 7,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Chat WhatsApp
              </a>
              <button
                onClick={handleClick}
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.05)",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px",
                  fontSize: "0.75rem",
                  color: "#999",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Tutup ✕
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── MASCOT ── */}
      <div
        ref={mascotRef}
        onClick={handleClick}
        style={{
          position: "fixed",
          right: size.right,
          bottom: size.bottom,
          zIndex: 9998,
          cursor: "pointer",
          pointerEvents: "auto",
          userSelect: "none",
          width: size.w,
          height: size.h,
          transition: "width 0.3s ease, height 0.3s ease",
        }}
      >
        <div className="milkyu-bounce" style={{ width: "100%", height: "100%" }}>
          <svg width="100%" height="100%" viewBox="0 0 130 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="65" cy="165" rx="30" ry="5" fill="rgba(0,0,0,0.09)" />
            <g className="milkyu-tail">
              <path d="M90 118 Q108 124 110 138 Q112 150 103 156" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <ellipse cx="102" cy="158" rx="7" ry="5.5" fill="#1a1a1a" />
            </g>
            <ellipse cx="65" cy="122" rx="40" ry="42" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2.5" />
            <ellipse cx="78" cy="108" rx="14" ry="11" fill="#1a1a1a" opacity="0.82" />
            <ellipse cx="42" cy="130" rx="8" ry="6" fill="#1a1a1a" opacity="0.72" />
            <ellipse cx="80" cy="138" rx="6" ry="5" fill="#1a1a1a" opacity="0.55" />
            <g>
              <line x1="54" y1="100" x2="48" y2="86" stroke="#3a2e2a" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="52" y1="97" x2="49" y2="89" stroke="#3a2e2a" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="76" y1="100" x2="82" y2="86" stroke="#3a2e2a" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="78" y1="97" x2="81" y2="89" stroke="#3a2e2a" strokeWidth="0.8" strokeDasharray="2 2" />
              <rect x="50" y="86" width="30" height="23" rx="7" fill="#f0e8c8" stroke="#3a2e2a" strokeWidth="1.8" />
              <rect x="54" y="88" width="23" height="23" rx="6" fill="none" stroke="#3a2e2a" strokeWidth="0.8" strokeDasharray="2 2" />
              <rect x="40" y="106" width="50" height="46" rx="12" fill="#f0e8c8" stroke="#3a2e2a" strokeWidth="2" />
              <rect x="43" y="109" width="44" height="40" rx="9" fill="none" stroke="#3a2e2a" strokeWidth="0.9" strokeDasharray="3 3" />
              <rect x="46" y="128" width="38" height="20" rx="6" fill="#f0e8c8" stroke="#3a2e2a" strokeWidth="1.5" />
              <text x="65" y="124" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2f2f2f" fontFamily="Georgia, serif">Milk</text>
              <text x="65" y="139" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2f2f2f" fontFamily="Georgia, serif">Yu</text>
              <rect x="46" y="130" width="6" height="12" rx="2" fill="none" stroke="#3a2e2a" strokeWidth="1" />
              <rect x="78" y="130" width="6" height="12" rx="2" fill="none" stroke="#3a2e2a" strokeWidth="1" />
            </g>
            <rect x="43" y="157" width="17" height="12" rx="8" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
            <rect x="70" y="157" width="17" height="12" rx="8" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
            <rect x="43" y="165" width="17" height="5" rx="3.5" fill="#1a1a1a" />
            <rect x="70" y="165" width="17" height="5" rx="3.5" fill="#1a1a1a" />
            <ellipse cx="25" cy="118" rx="10" ry="15" transform="rotate(15 25 118)" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
            <ellipse cx="22" cy="131" rx="7" ry="4.5" fill="#1a1a1a" />
            <g className="milkyu-arm-wave">
              <ellipse cx="104" cy="105" rx="10" ry="15" transform="rotate(-38 104 105)" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
              <ellipse cx="98" cy="85" rx="7" ry="4.5" fill="#1a1a1a" transform="rotate(-38 111 93)" />
            </g>
            <rect x="52" y="74" width="26" height="20" rx="10" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2.2" />
            <ellipse cx="65" cy="48" rx="36" ry="34" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2.5" />
            <ellipse cx="52" cy="34" rx="13" ry="10" fill="#1a1a1a" opacity="0.8" />
            <path d="M46 17 L47 -8 L50 16 Z" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
            <path d="M84 17 L83 -8 L80 16 Z" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
            <ellipse cx="18" cy="37" rx="13" ry="8" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
            <ellipse cx="18" cy="37" rx="9" ry="4" fill="#ffb3c6" opacity="0.65" />
            <ellipse cx="112" cy="37" rx="13" ry="8" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
            <ellipse cx="112" cy="37" rx="9" ry="4" fill="#ffb3c6" opacity="0.65" />
            <ellipse cx="65" cy="60" rx="20" ry="14" fill="#ffd6c8" stroke="#1a1a1a" strokeWidth="1.8" />
            <ellipse cx="57" cy="61" rx="4" ry="3.2" fill="#1a1a1a" opacity="0.42" />
            <ellipse cx="73" cy="61" rx="4" ry="3.2" fill="#1a1a1a" opacity="0.42" />
            <path d="M55 68 Q65 77 75 68" stroke="#c9897a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <ellipse cx="48" cy="43" rx="8.5" ry="9.5" fill="#1a1a1a" />
            <ellipse cx="82" cy="43" rx="8.5" ry="9.5" fill="#1a1a1a" />
            <circle cx={48 + pupilX} cy={43 + pupilY} r="3.8" fill="#fff" />
            <circle cx={82 + pupilX} cy={43 + pupilY} r="3.8" fill="#fff" />
            <circle cx={48 + pupilX + 1.2} cy={43 + pupilY - 1.2} r="1.2" fill="rgba(255,255,255,0.8)" />
            <circle cx={82 + pupilX + 1.2} cy={43 + pupilY - 1.2} r="1.2" fill="rgba(255,255,255,0.8)" />
            <line x1="42" y1="36" x2="39" y2="30" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="46" y1="34" x2="44" y2="28" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="88" y1="36" x2="91" y2="30" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="84" y1="34" x2="86" y2="28" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
            <ellipse cx="36" cy="53" rx="9" ry="5" fill="#ffb3c6" opacity="0.42" />
            <ellipse cx="94" cy="53" rx="9" ry="5" fill="#ffb3c6" opacity="0.42" />
            {/* ── Pita / Ribbon bow ── */}
            <g transform="translate(15, 15)">
              {/* Left loop */}
              <path d="M65 6 C60 -4 47 -2 49 8 C50 15 62 12 65 6Z" fill="#ff85b3" stroke="#1a1a1a" strokeWidth="1.6" strokeLinejoin="round" />
              {/* Right loop */}
              <path d="M65 6 C70 -4 83 -2 81 8 C80 15 68 12 65 6Z" fill="#ff85b3" stroke="#1a1a1a" strokeWidth="1.6" strokeLinejoin="round" />
              {/* Inner highlight left */}
              <path d="M65 6 C61 0 52 0 53 7 C53.5 10 63 10 65 6Z" fill="#ffb3d4" opacity="0.55" />
              {/* Inner highlight right */}
              <path d="M65 6 C69 0 78 0 77 7 C76.5 10 67 10 65 6Z" fill="#ffb3d4" opacity="0.55" />
              {/* Center knot */}
              <ellipse cx="65" cy="7" rx="5" ry="4.5" fill="#e8507a" stroke="#1a1a1a" strokeWidth="1.6" />
              <ellipse cx="63.5" cy="5.5" rx="1.8" ry="1.2" fill="rgba(255,255,255,0.4)" />
            </g>
          </svg>

          {!open && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.4 }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "#1a1a1a",
                borderRadius: "50%",
                width: isMobile ? 18 : 22,
                height: isMobile ? 18 : 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "10px" : "12px",
                fontWeight: 700,
                color: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.20)",
              }}
            >
              !
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
