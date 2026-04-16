import { motion, AnimatePresence } from "motion/react";
import { useId, useState } from "react";

interface CookieProps {
  title: string;
  description: string;
  variant?: "original" | "red-velvet";
}

// Chip positions (shared for both variants, colors differ)
const CHIPS = [
  { cx: 128, cy: 88,  rx: 8.5, ry: 5.5, a: 5   },
  { cx: 90,  cy: 101, rx: 7.5, ry: 4.5, a: -12 },
  { cx: 170, cy: 97,  rx: 9,   ry: 5.5, a: 15  },
  { cx: 108, cy: 123, rx: 9,   ry: 5.5, a: -5  },
  { cx: 160, cy: 131, rx: 8.5, ry: 5,   a: 8   },
  { cx: 70,  cy: 139, rx: 8,   ry: 5,   a: -20 },
  { cx: 190, cy: 144, rx: 8,   ry: 5,   a: 22  },
  { cx: 132, cy: 154, rx: 9,   ry: 6,   a: 0   },
  { cx: 60,  cy: 170, rx: 7,   ry: 4.5, a: -25 },
  { cx: 202, cy: 174, rx: 7.5, ry: 4.5, a: 30  },
  { cx: 84,  cy: 187, rx: 9,   ry: 5.5, a: -15 },
  { cx: 132, cy: 182, rx: 9,   ry: 5.5, a: 0   },
  { cx: 178, cy: 187, rx: 8.5, ry: 5.5, a: 14  },
  { cx: 96,  cy: 214, rx: 8.5, ry: 5,   a: -10 },
  { cx: 164, cy: 213, rx: 8.5, ry: 5,   a: 10  },
  { cx: 130, cy: 230, rx: 9,   ry: 5.5, a: 0   },
  { cx: 76,  cy: 226, rx: 7.5, ry: 4.5, a: -14 },
  { cx: 184, cy: 227, rx: 7.5, ry: 4.5, a: 12  },
];

const CRUMBS = [
  { cx: 24,  cy: 124, r: 3.5, delay: 0    },
  { cx: 12,  cy: 160, r: 2.5, delay: 0.6  },
  { cx: 38,  cy: 198, r: 3,   delay: 1.2  },
  { cx: 232, cy: 130, r: 3,   delay: 0.3  },
  { cx: 244, cy: 166, r: 2.5, delay: 0.9  },
  { cx: 234, cy: 202, r: 3.5, delay: 1.5  },
  { cx: 68,  cy: 258, r: 2.5, delay: 0.5  },
  { cx: 130, cy: 268, r: 3,   delay: 1.1  },
  { cx: 192, cy: 260, r: 2.5, delay: 0.8  },
];

// Organic cookie blob — smooth Q-bezier through 12 slightly varied-radius points
const COOKIE_PATH =
  "M 107,69 Q 130,63 152,72 Q 174,80 193,95 Q 211,109 215,132 Q 219,155 215,179 Q 211,202 193,217 Q 174,231 152,239 Q 130,246 109,238 Q 87,230 68,216 Q 49,202 45,179 Q 40,155 47,133 Q 54,111 69,93 Q 83,74 107,69 Z";

export function Cookie({ title, description, variant = "red-velvet" }: CookieProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");
  const isOriginal = variant === "original";

  const c = isOriginal
    ? {
        g0: "#F2C26A", g1: "#D08830", g2: "#9A5A18", g3: "#5A300A",
        spec: "rgba(255,215,130,0.55)",
        edge: "rgba(55,22,0,0.38)",
        crackRgb: "85,38,0",
        chipBody: "#1C0800",
        chipRim:  "#3A1A00",
        chipGloss: "rgba(255,215,150,0.22)",
        crumb: "#C47820",
        shadowFlood: "rgba(80,35,0,0.25)",
        titleColor: "#7A4800",
      }
    : {
        g0: "#D83030", g1: "#8C0F0F", g2: "#510505", g3: "#250202",
        spec: "rgba(230,80,80,0.48)",
        edge: "rgba(50,0,0,0.42)",
        crackRgb: "65,5,5",
        chipBody: "#F2E5C8",
        chipRim:  "#FFF5E0",
        chipGloss: "rgba(255,255,235,0.60)",
        crumb: "#B01010",
        shadowFlood: "rgba(80,0,0,0.30)",
        titleColor: "#8B1515",
      };

  return (
    <div
      className="flex flex-col items-center gap-6"
      style={{ width: "100%", maxWidth: "260px", margin: "0 auto" }}
    >
      
      <motion.div
        className="relative cursor-pointer select-none w-full"
        style={{ perspective: "1000px", aspectRatio: "260/210", overflow: "visible" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 260 290"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cookie-breathe"
          style={{ overflow: "visible", transformOrigin: "50% 52%" }}
        >
          <defs>
            {/* Base gradient — light source top-left */}
            <radialGradient id={`base-${uid}`} cx="33%" cy="26%" r="74%">
              <stop offset="0%"   stopColor={c.g0} />
              <stop offset="28%"  stopColor={c.g1} />
              <stop offset="68%"  stopColor={c.g2} />
              <stop offset="100%" stopColor={c.g3} />
            </radialGradient>

            {/* Specular dome highlight */}
            <radialGradient id={`spec-${uid}`} cx="30%" cy="23%" r="42%">
              <stop offset="0%"   stopColor={c.spec} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Edge vignette */}
            <radialGradient id={`vig-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="60%"  stopColor="transparent" />
              <stop offset="100%" stopColor={c.edge} />
            </radialGradient>

            {/* Drop shadow */}
            <filter id={`shadow-${uid}`} x="-28%" y="-28%" width="156%" height="156%">
              <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor={c.shadowFlood} />
            </filter>

            {/* Chip soft-shadow blur */}
            <filter id={`chipBlur-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2" />
            </filter>

            {/* Clip to organic blob */}
            <clipPath id={`clip-${uid}`}>
              <path d={COOKIE_PATH} />
            </clipPath>
          </defs>


          {/* Cookie body */}
          <path d={COOKIE_PATH} fill={`url(#base-${uid})`} filter={`url(#shadow-${uid})`} />

          {/* Specular dome */}
          <path d={COOKIE_PATH} fill={`url(#spec-${uid})`} />

          {/* Surface cracks — clipped */}
          <g clipPath={`url(#clip-${uid})`}>
            <path d="M 58,88 Q 95,72 132,82 T 202,78"              stroke={`rgba(${c.crackRgb},0.16)`} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 48,112 Q 82,97 114,107 T 174,102 T 222,116"  stroke={`rgba(${c.crackRgb},0.13)`} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M 42,138 Q 88,122 132,136 T 222,132"           stroke={`rgba(${c.crackRgb},0.20)`} strokeWidth="2"   fill="none" strokeLinecap="round" />
            <path d="M 63,158 Q 100,143 136,152 T 197,148"          stroke={`rgba(${c.crackRgb},0.14)`} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 44,183 Q 90,167 136,177 T 216,172"           stroke={`rgba(${c.crackRgb},0.20)`} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 54,207 Q 96,192 136,202 T 206,197"           stroke={`rgba(${c.crackRgb},0.14)`} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M 68,231 Q 106,217 142,227 T 192,222"          stroke={`rgba(${c.crackRgb},0.12)`} strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 78,118 Q 89,113 100,120"                     stroke={`rgba(${c.crackRgb},0.09)`} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 158,162 Q 174,157 184,165"                   stroke={`rgba(${c.crackRgb},0.09)`} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 118,212 Q 133,207 149,214"                   stroke={`rgba(${c.crackRgb},0.09)`} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

          {/* Chips — 3D: shadow + body + rim glow + double specular — clipped */}
          <g clipPath={`url(#clip-${uid})`}>
            {CHIPS.map((chip, i) => (
              <g key={i} transform={`rotate(${chip.a},${chip.cx},${chip.cy})`}>
                {/* Cast shadow */}
                <ellipse
                  cx={chip.cx + 2}   cy={chip.cy + 2.5}
                  rx={chip.rx * 0.92} ry={chip.ry * 0.88}
                  fill="rgba(0,0,0,0.28)"
                  filter={`url(#chipBlur-${uid})`}
                />
                {/* Chip body */}
                <ellipse cx={chip.cx} cy={chip.cy} rx={chip.rx} ry={chip.ry} fill={c.chipBody} />
                {/* Rim highlight */}
                <ellipse
                  cx={chip.cx - chip.rx * 0.28} cy={chip.cy - chip.ry * 0.28}
                  rx={chip.rx * 0.58}            ry={chip.ry * 0.52}
                  fill={c.chipRim} opacity="0.40"
                />
                {/* Primary specular gloss */}
                <ellipse
                  cx={chip.cx - chip.rx * 0.30} cy={chip.cy - chip.ry * 0.34}
                  rx={chip.rx * 0.30}            ry={chip.ry * 0.26}
                  fill={c.chipGloss}
                />
                {/* Tiny secondary specular point */}
                <ellipse
                  cx={chip.cx - chip.rx * 0.08} cy={chip.cy - chip.ry * 0.54}
                  rx={chip.rx * 0.10}            ry={chip.ry * 0.10}
                  fill="rgba(255,255,255,0.38)"
                />
              </g>
            ))}
          </g>

          {/* Edge vignette on top for depth */}
          <path d={COOKIE_PATH} fill={`url(#vig-${uid})`} />
        </svg>
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
            color: c.titleColor,
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

// ─────────────────────────────────────────────
//  CookieCarousel — mobile swipe carousel
// ─────────────────────────────────────────────

const COOKIE_CAROUSEL_DATA = [
  {
    variant: "original" as const,
    title: "Brown Sugar Butter",
    description: "Cookie brown sugar yang buttery dengan aroma karamel hangat yang menggoda.",
  },
  {
    variant: "red-velvet" as const,
    title: "Red Velvet Cream Cheese",
    description: "Cookie red velvet yang lembut dengan isian cream cheese berkualitas.",
  },
];

const COOKIE_CAROUSEL_ACCENTS = ["#7A4800", "#8B1515"];

export function CookieCarousel() {
  const [active, setActive] = useState(0);
  const [dir, setDir]       = useState(0);

  const go   = (next: number) => { setDir(next > active ? 1 : -1); setActive(next); };
  const prev = () => go(active === 0 ? COOKIE_CAROUSEL_DATA.length - 1 : active - 1);
  const next = () => go(active === COOKIE_CAROUSEL_DATA.length - 1 ? 0 : active + 1);

  const curr = COOKIE_CAROUSEL_DATA[active];

  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ?  280 : -280, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -280 :  280, opacity: 0 }),
  };

  const navBtn: React.CSSProperties = {
    position: "absolute", zIndex: 10,
    width: 44, height: 44, borderRadius: "50%",
    background: "#fff", border: "1.5px solid rgba(0,0,0,0.08)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: "1.3rem", color: "#555", lineHeight: 1,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>

      {/* Cup area with nav buttons */}
      <div style={{ position: "relative", width: "100%", maxWidth: "340px", display: "flex", alignItems: "center", justifyContent: "center" }}>

        <button onClick={prev} style={{ ...navBtn, left: 0 }}>‹</button>

        <div style={{ overflow: "hidden", width: "100%", maxWidth: "220px", display: "flex", justifyContent: "center" }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: "easeInOut" }}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Cookie variant={curr.variant} title={curr.title} description={curr.description} />
            </motion.div>
          </AnimatePresence>
        </div>

        <button onClick={next} style={{ ...navBtn, right: 0 }}>›</button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 8, marginTop: "0.5rem" }}>
        {COOKIE_CAROUSEL_DATA.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background: i === active ? COOKIE_CAROUSEL_ACCENTS[i] : "rgba(0,0,0,0.14)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
