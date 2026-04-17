import { useState, useId, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { BobaCup } from "./components/BobaCup";
import { Cookie, CookieCarousel } from "./components/Cookie";
import { MilkyuMascot } from "./components/MilkyuMascot";

const FLAVORS = [
  {
    flavor: "matcha" as const,
    title: "Matcha Bliss",
    description: "Susu creamy yang menyatu dalam tekstur saus sticky milk matcha yang lembut.",
    accent: "#5a9c5a",
  },
  {
    flavor: "strawberry" as const,
    title: "Strawberry Dream",
    description: "Susu creamy yang menyatu dalam tekstur saus sticky milk stroberi yang lembut.",
    accent: "#e8607a",
  },
  {
    flavor: "chocolate" as const,
    title: "Chocolate Indulgence",
    description: "Susu creamy yang menyatu dalam tekstur saus sticky milk coklat yang lembut.",
    accent: "#8b5a3c",
  },
];

function FlavorCarousel() {
  const [active, setActive] = useState(1);
  const [dir, setDir] = useState(0);

  const go = (next: number) => {
    setDir(next > active ? 1 : -1);
    setActive(next);
  };

  const prev = () => go(active === 0 ? FLAVORS.length - 1 : active - 1);
  const next = () => go(active === FLAVORS.length - 1 ? 0 : active + 1);

  const f = FLAVORS[active];

  const variants = {
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
      <div style={{ position: "relative", width: "100%", maxWidth: "340px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button onClick={prev} style={{ ...navBtn, left: 0 }}>‹</button>
        <div style={{ overflow: "hidden", width: "100%", maxWidth: "240px", aspectRatio: "260/420", display: "flex", justifyContent: "center" }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: "easeInOut" }}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <BobaCup flavor={f.flavor} title={f.title} description={f.description} />
            </motion.div>
          </AnimatePresence>
        </div>
        <button onClick={next} style={{ ...navBtn, right: 0 }}>›</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: "0.5rem" }}>
        {FLAVORS.map((fl, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === active ? 24 : 8, height: 8,
              borderRadius: 999,
              background: i === active ? fl.accent : "rgba(0,0,0,0.14)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
      <div className="md:hidden" style={{ textAlign: "center", marginTop: "1.5rem", padding: "0 1rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "0.5rem" }}>{f.title}</h3>
        <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.5 }}>{f.description}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Build Your Milkyu
// ─────────────────────────────────────────────

const BUILD_SAUCES = [
  { id: "chocolate",  label: "Chocolate Indulgence", fill: "#5c2a0c", accent: "#8b5a3c" },
  { id: "matcha",     label: "Matcha Bliss",         fill: "#4a7c4e", accent: "#5a9c5a" },
  { id: "strawberry", label: "Strawberry Dream",     fill: "#e8606e", accent: "#e8607a" },
];

const BUILD_COOKIES = [
  { id: "original",   label: "Original",   bodyColor: "#D08830", chipColor: "#1C0800" },
  { id: "red-velvet", label: "Red Velvet", bodyColor: "#D83030", chipColor: "#F2E5C8" },
];

interface BuildCupPreviewProps {
  step: number;
  sauce: string | null;
  cookie: string | null;
  bymUid: string;
  logoAdded?: boolean;
}

function BuildCupPreview({ step, sauce, cookie, bymUid, logoAdded = false }: BuildCupPreviewProps) {
  const sd = BUILD_SAUCES.find(s => s.id === sauce);
  const cd = BUILD_COOKIES.find(c => c.id === cookie);

  const showIce  = step >= 1;
  const showMilk = step >= 2;
  const showSauce = step >= 3 && sd;
  const showCookie = step >= 4 && cd;

  const MINI_COOKIES = [
    { cx: 95,  cy: 148, delay: "0s",    dur: "1.85s" },
    { cx: 130, cy: 143, delay: "0.65s", dur: "2.1s"  },
    { cx: 163, cy: 149, delay: "1.2s",  dur: "1.7s"  },
  ];

  // Ice cubes inside the cup
  const ICE_CUBES = [
    { x: 68,  y: 195, w: 32, h: 28 },
    { x: 102, y: 190, w: 36, h: 30 },
    { x: 140, y: 196, w: 32, h: 27 },
    { x: 172, y: 193, w: 26, h: 28 },
  ];

  return (
    <svg width="100%" height="100%" viewBox="0 0 260 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`bymClip-${bymUid}`}>
          <path d="M 58 130 L 90 318 Q 90 328 105 328 L 155 328 Q 170 328 170 318 L 202 130 Z" />
        </clipPath>
        <radialGradient id={`iceGrad-${bymUid}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="60%" stopColor="rgba(220,240,255,0.65)" />
          <stop offset="100%" stopColor="rgba(180,220,245,0.40)" />
        </radialGradient>
        <filter id={`iceGlow-${bymUid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Dome lid */}
      <path d="M 54 117 Q 54 76 130 74 Q 206 76 206 117 L 206 128 L 54 128 Z" fill="rgba(210,228,240,0.92)" stroke="rgba(170,200,220,0.65)" strokeWidth="1" />
      <path d="M 62 115 Q 64 88 110 82" stroke="rgba(255,255,255,0.5)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="54" y="118" width="152" height="10" rx="3" fill="rgba(190,215,232,0.88)" />
      <rect x="58" y="119" width="80" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />

      <g clipPath={`url(#bymClip-${bymUid})`}>
        {/* Empty cup base — always show glass body */}
        <rect x="55" y="130" width="150" height="200" fill={showMilk ? "#f8f3ee" : "rgba(210,235,250,0.18)"} />

        {/* Milk sheen */}
        {showMilk && (
          <path d="M 62 218 Q 100 230 138 216 Q 168 205 205 222" stroke="rgba(255,255,255,0.65)" strokeWidth="8" strokeLinecap="round" fill="none" />
        )}

        {/* Ice cubes — appear at step 1 */}
        {showIce && ICE_CUBES.map((ice, i) => (
          <g key={i} className="bym-ice-cube" style={{ animationDelay: `${i * 0.15}s` }}>
            <rect x={ice.x - 3} y={ice.y - 3} width={ice.w + 6} height={ice.h + 6} rx="9"
              fill="rgba(168,213,245,0.25)" filter={`url(#iceGlow-${bymUid})`} />
            <rect x={ice.x} y={ice.y} width={ice.w} height={ice.h} rx="7"
              fill={`url(#iceGrad-${bymUid})`} stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" />
            <rect x={ice.x + 4} y={ice.y + 5} width={Math.max(ice.w - 14, 6)} height={3} rx="1.5"
              fill="rgba(255,255,255,0.82)" />
            <line x1={ice.x + ice.w - 6} y1={ice.y + 5} x2={ice.x + ice.w - 6} y2={ice.y + ice.h - 6}
              stroke="rgba(255,255,255,0.30)" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}

        {/* Sauce drip layer — step 3 */}
        {showSauce && sd && (
          <g key={sauce} className="bym-sauce-group">
            <path
              d="M 55,130 L 205,130 L 205,182 Q 194,170 181,185 Q 168,200 154,183 Q 140,166 128,183 Q 115,200 101,184 Q 87,168 73,185 Q 62,197 55,185 Z"
              fill={sd.fill}
            />
            <ellipse cx="94"  cy="193" rx="7.5" ry="13" fill={sd.fill} />
            <ellipse cx="130" cy="190" rx="5.5" ry="10" fill={sd.fill} />
            <ellipse cx="164" cy="192" rx="6.5" ry="12" fill={sd.fill} />
            <path d="M 68,140 Q 100,132 132,140 Q 160,147 192,138" stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Falling cookies — step 4 */}
        {showCookie && cd && MINI_COOKIES.map((fc, i) => (
          <g
            key={`${cookie}-${i}`}
            className="bym-cookie-fall"
            style={{
              animationDuration: fc.dur,
              animationDelay: fc.delay,
              transformOrigin: `${fc.cx}px ${fc.cy}px`,
            }}
          >
            <ellipse cx={fc.cx} cy={fc.cy} rx="13" ry="9" fill={cd.bodyColor} />
            <ellipse cx={fc.cx - 3} cy={fc.cy - 1} rx="3.5" ry="2.2" fill={cd.chipColor} />
            <ellipse cx={fc.cx + 4} cy={fc.cy + 2} rx="3"   ry="2"   fill={cd.chipColor} />
            <ellipse cx={fc.cx - 3} cy={fc.cy - 2} rx="2.8" ry="1.5" fill="rgba(255,255,255,0.38)" />
          </g>
        ))}
      </g>

      {/* Cup glass overlay */}
      <path d="M 58 130 L 90 318 Q 90 328 105 328 L 155 328 Q 170 328 170 318 L 202 130 Z" fill="rgba(230,244,255,0.10)" stroke="rgba(175,210,235,0.45)" strokeWidth="1.5" />
      <path d="M 62 137 L 92 311" stroke="rgba(255,255,255,0.42)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 198 137 L 168 311" stroke="rgba(255,255,255,0.14)" strokeWidth="3" strokeLinecap="round" />

      {/* White bottom base */}
      <path d="M 92 291 L 90 318 Q 90 328 105 328 L 155 328 Q 170 328 170 318 L 168 291 Z" fill="rgba(245,244,240,0.97)" stroke="rgba(200,198,192,0.35)" strokeWidth="1" />

      {/* Logo — appears when logoAdded */}
      {logoAdded && (
        <foreignObject x="88" y="210" width="84" height="70">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
            <img
              src="/milkyu-logo.png"
              alt="Milkyu"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{ width: "72px", height: "72px", objectFit: "contain", opacity: 0.88, pointerEvents: "none", userSelect: "none" }}
            />
          </div>
        </foreignObject>
      )}

      {/* Straw */}
      <rect x="129" y="30" width="9" height="175" rx="4.5" fill="rgba(0,0,0,0.18)" transform="rotate(7, 133, 110)" />
      <rect x="127" y="28" width="9" height="175" rx="4.5" fill="#111111" transform="rotate(7, 131, 109)" />
      <rect x="128.5" y="30" width="2.5" height="155" rx="1.25" fill="rgba(255,255,255,0.18)" transform="rotate(7, 129.5, 101)" />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  Build Your Milkyu — Drag & Drop
// ─────────────────────────────────────────────

function BuildYourMilkyu({ onComplete, onReset }: { onComplete?: (sauce: string | null, logoAdded: boolean) => void; onReset?: () => void }) {
  const rawId = useId();
  const bymUid = rawId.replace(/:/g, "bym");

  // cupAdded tracks whether the glass has been placed
  const [cupAdded, setCupAdded] = useState(false);
  const [logoAdded, setLogoAdded] = useState(false);
  // step: 0=no ice, 1=ice added, 2=milk added, 3=sauce picked
  const [step, setStep]   = useState(0);
  const [sauce, setSauce] = useState<string | null>(null);
  const [isDragOverCup, setIsDragOverCup] = useState(false);

  const selectedSauce = BUILD_SAUCES.find(s => s.id === sauce);

  const handleIngredient = (itemId: string) => {
    if (itemId === "cup" && !cupAdded) {
      setCupAdded(true);
    } else if (itemId === "logo" && cupAdded && !logoAdded) {
      setLogoAdded(true);
    } else if (itemId === "ice" && cupAdded && step === 0) {
      setStep(1);
    } else if (itemId === "milk" && step === 1) {
      setStep(2);
    } else if (itemId.endsWith("-sauce") && step >= 2) {
      const sauceId = itemId.replace("-sauce", "");
      setSauce(sauceId);
      if (step === 2) setStep(3);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("ingredient");
    if (itemId) handleIngredient(itemId);
    setIsDragOverCup(false);
  };

  const isComplete = step >= 3 && !!sauce;

  useEffect(() => {
    if (isComplete && onComplete) onComplete(sauce, logoAdded);
  }, [isComplete, sauce, logoAdded]); // eslint-disable-line

  const handleReset = () => {
    setCupAdded(false);
    setLogoAdded(false);
    setStep(0);
    setSauce(null);
    onReset?.();
  };

  // Tray items
  const TRAY = [
    { id: "cup",               label: "Tambah Gelas",  emoji: "🥤", unlocked: !cupAdded,                    done: cupAdded },
    { id: "logo",              label: "Tambah Logo",   emoji: "🏷️", unlocked: cupAdded && !logoAdded,        done: logoAdded },
    { id: "ice",               label: "Es Batu",       emoji: "🧊", unlocked: cupAdded && step === 0,        done: step >= 1 },
    { id: "milk",              label: "Susu Plain",    emoji: "🥛", unlocked: step === 1,                    done: step >= 2 },
    { id: "chocolate-sauce",   label: "Saus Coklat",   emoji: "🍫", unlocked: step >= 2,                     done: sauce === "chocolate" },
    { id: "matcha-sauce",      label: "Saus Matcha",   emoji: "🍵", unlocked: step >= 2,                     done: sauce === "matcha" },
    { id: "strawberry-sauce",  label: "Saus Stroberi", emoji: "🍓", unlocked: step >= 2,                     done: sauce === "strawberry" },
  ];

  // Progress step definitions
  const PROGRESS = [
    { label: "🥤 Tambah Gelas",             done: cupAdded },
    { label: "🏷️ Tambah Logo",              done: logoAdded },
    { label: "🧊 Masukkan Es Batu",          done: step >= 1 },
    { label: "🥛 Tuangkan Susu",             done: step >= 2 },
    { label: "🍫 Masukkan Saus Sticky Milk", done: !!sauce },
  ];

  const stepNumBase: React.CSSProperties = {
    width: 28, height: 28, borderRadius: "50%",
    color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
    transition: "background 0.3s ease",
  };

  return (
    <section
      id="build"
      className="px-5"
      style={{ paddingTop: "4rem", paddingBottom: "5rem", background: "#f0ebe4", position: "relative", zIndex: 2 }}
    >
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
          style={{ marginBottom: "2.5rem" }}
        >
          <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", color: "#8b5a3c", textTransform: "uppercase", marginBottom: "0.6rem" }}>
            Kreasi Favoritmu
          </p>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
            Build Your Milkyu
          </h2>
          <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: "#888", maxWidth: "440px", margin: "0.75rem auto 0", lineHeight: 1.7 }}>
            Seret bahan ke dalam gelas satu per satu — dan lihat minumanmu terbentuk langsung!
          </p>
          <p style={{ fontSize: "0.78rem", color: "#aaa", marginTop: "0.4rem" }}>
            🖱️ Drag &amp; drop atau 👆 Ketuk bahan untuk mengisi gelas
          </p>
        </motion.div>

        {/* ── Ingredient Tray ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            display: "flex", flexWrap: "wrap", gap: "0.65rem",
            justifyContent: "center", marginBottom: "2.5rem",
            padding: "1.25rem 1rem",
            background: "rgba(255,255,255,0.55)",
            borderRadius: 18,
            border: "1.5px solid rgba(139,90,60,0.12)",
          }}
        >
          {TRAY.map(item => (
            <motion.div
              key={item.id}
              draggable={item.unlocked || undefined}
              onDragStart={item.unlocked ? (e) => {
                e.dataTransfer.setData("ingredient", item.id);
                e.dataTransfer.effectAllowed = "move";
              } : undefined}
              onClick={() => { if (item.unlocked) handleIngredient(item.id); }}
              whileHover={item.unlocked ? { scale: 1.1, y: -5 } : {}}
              whileTap={item.unlocked ? { scale: 0.93 } : {}}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem",
                padding: "0.7rem 0.9rem",
                background: item.done
                  ? "rgba(90,156,90,0.12)"
                  : item.unlocked
                    ? "#fff"
                    : "rgba(255,255,255,0.35)",
                borderRadius: 14,
                border: `2px solid ${
                  item.done
                    ? "rgba(90,156,90,0.5)"
                    : item.unlocked
                      ? "#8b5a3c"
                      : "rgba(0,0,0,0.07)"
                }`,
                cursor: item.unlocked ? "grab" : item.done ? "default" : "not-allowed",
                opacity: item.done ? 0.7 : item.unlocked ? 1 : 0.35,
                minWidth: 72,
                boxShadow: item.unlocked ? "0 4px 16px rgba(139,90,60,0.15)" : "none",
                transition: "all 0.25s ease",
                userSelect: "none",
              }}
            >
              <span style={{ fontSize: "2rem", lineHeight: 1 }}>{item.emoji}</span>
              <span style={{
                fontSize: "0.68rem", fontWeight: 700, textAlign: "center",
                color: item.done ? "#5a9c5a" : item.unlocked ? "#4a2c0c" : "#bbb",
                lineHeight: 1.2,
              }}>
                {item.done ? "✓ Added" : item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main area: Cup + Progress ── */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center", gap: "3rem" }}>

          {/* Cup drop zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            onDragOver={(e) => { e.preventDefault(); setIsDragOverCup(true); }}
            onDragLeave={() => setIsDragOverCup(false)}
            onDrop={handleDrop}
            style={{
              width: "100%", maxWidth: "190px", flexShrink: 0,
              borderRadius: 20,
              border: isDragOverCup ? "2.5px dashed #8b5a3c" : "2.5px dashed transparent",
              background: isDragOverCup ? "rgba(139,90,60,0.07)" : "transparent",
              transition: "all 0.2s ease",
              padding: 6,
              position: "relative",
            }}
          >
            <AnimatePresence mode="wait">
              {!cupAdded ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    aspectRatio: "190/320",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "0.85rem",
                    background: isDragOverCup ? "rgba(139,90,60,0.08)" : "rgba(255,255,255,0.45)",
                    borderRadius: 16,
                    border: "2px dashed rgba(139,90,60,0.25)",
                    transition: "background 0.2s",
                  }}
                >
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: "3.2rem", lineHeight: 1 }}
                  >
                    🥤
                  </motion.span>
                  <p style={{ fontSize: "0.78rem", color: "#8b5a3c", fontWeight: 700, textAlign: "center", padding: "0 1rem", margin: 0 }}>
                    Seret gelas<br />ke sini
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="cup"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <BuildCupPreview step={step} sauce={sauce} cookie={null} bymUid={bymUid} logoAdded={logoAdded} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag-over overlay label */}
            <AnimatePresence>
              {isDragOverCup && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute", bottom: -28, left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "0.75rem", color: "#8b5a3c", fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Lepaskan di sini! 👆
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Progress steps panel */}
          <div style={{ flex: 1, minWidth: "260px", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>

            {PROGRESS.map((ps, i) => {
              const prevDone = i === 0 || PROGRESS[i - 1].done;
              const isActive = !ps.done && prevDone;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: "0.9rem 1.25rem",
                    border: ps.done
                      ? "2px solid rgba(90,156,90,0.5)"
                      : isActive
                        ? "2px solid #8b5a3c"
                        : "2px solid rgba(0,0,0,0.07)",
                    opacity: (!ps.done && !isActive) ? 0.4 : 1,
                    transition: "all 0.3s ease",
                    display: "flex", alignItems: "center", gap: "0.85rem",
                  }}
                >
                  <div style={{
                    ...stepNumBase,
                    background: ps.done ? "#5a9c5a" : isActive ? "#8b5a3c" : "rgba(0,0,0,0.15)",
                  }}>
                    {ps.done ? "✓" : i + 1}
                  </div>
                  <div>
                    <span style={{
                      fontSize: "0.95rem", fontWeight: 700,
                      color: ps.done ? "#5a9c5a" : isActive ? "#1a1a1a" : "#999",
                    }}>
                      {ps.label}
                    </span>
                    {isActive && (
                      <p style={{ fontSize: "0.72rem", color: "#aaa", margin: "2px 0 0", fontWeight: 500 }}>
                        Seret bahan yang menyala ke gelas ☝️
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Summary card */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    background: "#fff", borderRadius: 16,
                    padding: "1rem 1.25rem",
                    border: "1.5px solid rgba(139,90,60,0.18)",
                    boxShadow: "0 4px 18px rgba(139,90,60,0.08)",
                  }}
                >
                  <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#5a9c5a", margin: "0 0 0.4rem" }}>
                    Kreasi kamu siap! 🎉
                  </p>
                  <p style={{ fontSize: "0.92rem", color: "#333", fontWeight: 500, lineHeight: 1.65, margin: "0 0 0.85rem" }}>
                    Plain Milk + Es Batu{selectedSauce && ` + ${selectedSauce.label}`}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReset}
                    style={{
                      padding: "0.5rem 1.2rem", borderRadius: 999,
                      background: "rgba(0,0,0,0.06)", border: "none",
                      fontSize: "0.8rem", color: "#888", cursor: "pointer", fontWeight: 500,
                    }}
                  >
                    ↩ Ulangi
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  Build Your Cookie — Cookie Builder
// ─────────────────────────────────────────────

const BYC_BASES = [
  { id: "original",   label: "Brown Sugar Butter", bodyColor: "#D08830", chipColor: "#1C0800", accent: "#7A4800" },
  { id: "red-velvet", label: "Red Velvet",          bodyColor: "#D83030", chipColor: "#F2E5C8", accent: "#8B1515" },
];

const BYC_DRIZZLES = [
  { id: "chocolate", label: "Chocolate Drizzle", color: "#3b1f0e" },
  { id: "strawberry", label: "Strawberry Drizzle", color: "#e8606e" },
  { id: "matcha",    label: "Matcha Drizzle",     color: "#4a7c4e" },
];

const BYC_EXTRAS: { id: string; label: string }[] = [];

// Cookie path
const COOKIE_PATH_BYC = "M 107,69 Q 130,63 152,72 Q 174,80 193,95 Q 211,109 215,132 Q 219,155 215,179 Q 211,202 193,217 Q 174,231 152,239 Q 130,246 109,238 Q 87,230 68,216 Q 49,202 45,179 Q 40,155 47,133 Q 54,111 69,93 Q 83,74 107,69 Z";

const CHIPS_BYC = [
  { cx: 128, cy: 88,  rx: 8.5, ry: 5.5, a: 5   },
  { cx: 90,  cy: 101, rx: 7.5, ry: 4.5, a: -12 },
  { cx: 170, cy: 97,  rx: 9,   ry: 5.5, a: 15  },
  { cx: 108, cy: 123, rx: 9,   ry: 5.5, a: -5  },
  { cx: 160, cy: 131, rx: 8.5, ry: 5,   a: 8   },
  { cx: 70,  cy: 139, rx: 8,   ry: 5,   a: -20 },
  { cx: 190, cy: 144, rx: 8,   ry: 5,   a: 22  },
  { cx: 132, cy: 154, rx: 9,   ry: 6,   a: 0   },
  { cx: 84,  cy: 187, rx: 9,   ry: 5.5, a: -15 },
  { cx: 132, cy: 182, rx: 9,   ry: 5.5, a: 0   },
  { cx: 178, cy: 187, rx: 8.5, ry: 5.5, a: 14  },
  { cx: 130, cy: 230, rx: 9,   ry: 5.5, a: 0   },
];

interface CookiePreviewProps {
  base: string | null;
  drizzle: string | null;
  extras: string[];
  uid: string;
  showChips?: boolean;
}

function CookiePreview({ base, drizzle, extras, uid, showChips = true }: CookiePreviewProps) {
  const bd = BYC_BASES.find(b => b.id === base);

  if (!bd) {
    // Show empty plate / placeholder
    return (
      <svg width="100%" height="100%" viewBox="0 0 260 290" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="130" cy="155" r="76" fill="rgba(0,0,0,0.08)" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeDasharray="6 5" />
        <text x="130" y="148" textAnchor="middle" fontSize="28" opacity="0.55">🍪</text>
        <text x="130" y="172" textAnchor="middle" fontSize="11" fill="rgba(0,0,0,0.55)" fontWeight="600">Seret base cookie ke sini</text>
      </svg>
    );
  }

  const isOriginal = base === "original";
  const c = isOriginal
    ? { g0: "#F2C26A", g1: "#D08830", g2: "#9A5A18", g3: "#5A300A", spec: "rgba(255,215,130,0.55)", edge: "rgba(55,22,0,0.38)", crackRgb: "85,38,0", chipBody: "#1C0800", chipRim: "#3A1A00", chipGloss: "rgba(255,215,150,0.22)", shadowFlood: "rgba(80,35,0,0.25)" }
    : { g0: "#D83030", g1: "#8C0F0F", g2: "#510505", g3: "#250202", spec: "rgba(230,80,80,0.48)", edge: "rgba(50,0,0,0.42)", crackRgb: "65,5,5", chipBody: "#F2E5C8", chipRim: "#FFF5E0", chipGloss: "rgba(255,255,235,0.60)", shadowFlood: "rgba(80,0,0,0.30)" };

  const drizzleColor = BYC_DRIZZLES.find(d => d.id === drizzle)?.color;

  return (
    <svg width="100%" height="100%" viewBox="0 0 260 290" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`byc-base-${uid}`} cx="33%" cy="26%" r="74%">
          <stop offset="0%"   stopColor={c.g0} />
          <stop offset="28%"  stopColor={c.g1} />
          <stop offset="68%"  stopColor={c.g2} />
          <stop offset="100%" stopColor={c.g3} />
        </radialGradient>
        <radialGradient id={`byc-spec-${uid}`} cx="30%" cy="23%" r="42%">
          <stop offset="0%"   stopColor={c.spec} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={`byc-vig-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="60%"  stopColor="transparent" />
          <stop offset="100%" stopColor={c.edge} />
        </radialGradient>
        <filter id={`byc-shadow-${uid}`} x="-28%" y="-28%" width="156%" height="156%">
          <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor={c.shadowFlood} />
        </filter>
        <filter id={`byc-chipBlur-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <clipPath id={`byc-clip-${uid}`}>
          <path d={COOKIE_PATH_BYC} />
        </clipPath>
      </defs>

      {/* Cookie body */}
      <path d={COOKIE_PATH_BYC} fill={`url(#byc-base-${uid})`} filter={`url(#byc-shadow-${uid})`} />
      <path d={COOKIE_PATH_BYC} fill={`url(#byc-spec-${uid})`} />

      {/* Surface cracks */}
      <g clipPath={`url(#byc-clip-${uid})`}>
        <path d="M 58,88 Q 95,72 132,82 T 202,78"             stroke={`rgba(${c.crackRgb},0.16)`} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 42,138 Q 88,122 132,136 T 222,132"          stroke={`rgba(${c.crackRgb},0.20)`} strokeWidth="2"   fill="none" strokeLinecap="round" />
        <path d="M 44,183 Q 90,167 136,177 T 216,172"          stroke={`rgba(${c.crackRgb},0.20)`} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 68,231 Q 106,217 142,227 T 192,222"         stroke={`rgba(${c.crackRgb},0.12)`} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>

      {/* Chips — conditional */}
      {showChips && (
        <g clipPath={`url(#byc-clip-${uid})`}>
          {CHIPS_BYC.map((chip, i) => (
            <g key={i} transform={`rotate(${chip.a},${chip.cx},${chip.cy})`}>
              <ellipse cx={chip.cx + 2} cy={chip.cy + 2.5} rx={chip.rx * 0.92} ry={chip.ry * 0.88} fill="rgba(0,0,0,0.28)" filter={`url(#byc-chipBlur-${uid})`} />
              <ellipse cx={chip.cx} cy={chip.cy} rx={chip.rx} ry={chip.ry} fill={c.chipBody} />
              <ellipse cx={chip.cx - chip.rx * 0.28} cy={chip.cy - chip.ry * 0.28} rx={chip.rx * 0.58} ry={chip.ry * 0.52} fill={c.chipRim} opacity="0.40" />
              <ellipse cx={chip.cx - chip.rx * 0.30} cy={chip.cy - chip.ry * 0.34} rx={chip.rx * 0.30} ry={chip.ry * 0.26} fill={c.chipGloss} />
            </g>
          ))}
        </g>
      )}

      {/* Drizzle — wavy lines on top */}
      {drizzleColor && (
        <g clipPath={`url(#byc-clip-${uid})`} className="byc-drizzle-in">
          <path d="M 55,108 Q 90,98 130,112 Q 170,126 210,108"  stroke={drizzleColor} strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.88" />
          <path d="M 48,148 Q 88,136 130,150 Q 172,164 215,148" stroke={drizzleColor} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.80" />
          <path d="M 48,188 Q 88,176 132,190 Q 176,204 212,188" stroke={drizzleColor} strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.88" />
          <path d="M 56,228 Q 92,217 130,229 Q 166,240 206,224" stroke={drizzleColor} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.72" />
        </g>
      )}

      {/* Edge vignette */}
      <path d={COOKIE_PATH_BYC} fill={`url(#byc-vig-${uid})`} />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  Build Your Cookie — Drag & Drop
// ─────────────────────────────────────────────

function BuildYourCookie({ onComplete, onReset }: { onComplete?: (base: string | null, drizzle: string | null, chipsAdded: boolean) => void; onReset?: () => void }) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "byc");

  const [base,       setBase]       = useState<string | null>(null);
  const [chipsAdded, setChipsAdded] = useState(false);
  const [drizzle,    setDrizzle]    = useState<string | null>(null);
  const [isDragOverCookie, setIsDragOverCookie] = useState(false);

  const bd     = BYC_BASES.find(b => b.id === base);
  const accent = bd?.accent ?? "#8b5a3c";

  const handleIngredient = (itemId: string) => {
    if (BYC_BASES.some(b => b.id === itemId)) {
      setBase(itemId);
      // reset chips/drizzle when base changes
      if (itemId !== base) {
        setChipsAdded(false);
        setDrizzle(null);
      }
    } else if (itemId === "chips" && !!base) {
      setChipsAdded(true);
    } else if (BYC_DRIZZLES.some(d => d.id === itemId) && !!base) {
      setDrizzle(prev => prev === itemId ? null : itemId);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("ingredient");
    if (itemId) handleIngredient(itemId);
    setIsDragOverCookie(false);
  };

  const handleReset = () => {
    setBase(null);
    setChipsAdded(false);
    setDrizzle(null);
    onReset?.();
  };

  // Tray sections
  type TrayItem = { id: string; label: string; swatch: string; unlocked: boolean; done: boolean };
  const traySections: { section: string; items: TrayItem[] }[] = [
    {
      section: "🍪 Base Cookie",
      items: BYC_BASES.map(b => ({
        id: b.id,
        label: b.label,
        swatch: b.bodyColor,
        unlocked: true,
        done: base === b.id,
      })),
    },
    {
      section: "◉ Chips",
      items: [{
        id: "chips",
        label: bd ? `${bd.label} Chips` : "Chocolate Chips",
        swatch: bd?.chipColor ?? "#1C0800",
        unlocked: !!base && !chipsAdded,
        done: chipsAdded,
      }],
    },
    {
      section: "〰️ Drizzle",
      items: BYC_DRIZZLES.map(d => ({
        id: d.id,
        label: d.label,
        swatch: d.color,
        unlocked: !!base,
        done: drizzle === d.id,
      })),
    },
  ];

  const PROGRESS = [
    { label: "🍪 Pilih Base Cookie",  done: !!base },
    { label: "◉ Taruh Chips",         done: chipsAdded },
    { label: "〰️ Tambah Drizzle",     done: !!drizzle },
  ];

  const bycComplete = !!base;

  useEffect(() => {
    if (bycComplete && onComplete) onComplete(base, drizzle, chipsAdded);
  }, [bycComplete, base, drizzle, chipsAdded]); // eslint-disable-line

  const stepNumBase: React.CSSProperties = {
    width: 26, height: 26, borderRadius: "50%",
    color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
    transition: "background 0.3s ease",
  };

  return (
    <section
      id="build-cookie"
      className="px-5"
      style={{ paddingTop: "4rem", paddingBottom: "5rem", background: "#fff8f2", position: "relative", zIndex: 2 }}
    >
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
          style={{ marginBottom: "2.5rem" }}
        >
          <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", color: "#8b1515", textTransform: "uppercase", marginBottom: "0.6rem" }}>
            Kreasi Cookie Kamu
          </p>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
            Build Your Cookie
          </h2>
          <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: "#888", maxWidth: "440px", margin: "0.75rem auto 0", lineHeight: 1.7 }}>
            Seret base, chips, dan drizzle ke cookie kamu — custom sampai puas!
          </p>
          <p style={{ fontSize: "0.78rem", color: "#aaa", marginTop: "0.4rem" }}>
            🖱️ Drag &amp; drop atau 👆 Ketuk bahan ke cookie kamu
          </p>
        </motion.div>

        {/* ── Ingredient Tray (3 sections) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            display: "flex", flexWrap: "wrap", gap: "1.25rem",
            justifyContent: "center", marginBottom: "2.5rem",
            padding: "1.25rem 1rem",
            background: "rgba(255,255,255,0.65)",
            borderRadius: 18,
            border: "1.5px solid rgba(139,21,21,0.1)",
          }}
        >
          {traySections.map(sec => (
            <div key={sec.section}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem", marginLeft: "0.15rem" }}>
                {sec.section}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {sec.items.map(item => (
                  <motion.div
                    key={item.id}
                    draggable={item.unlocked || undefined}
                    onDragStart={item.unlocked ? (e) => {
                      e.dataTransfer.setData("ingredient", item.id);
                      e.dataTransfer.effectAllowed = "move";
                    } : undefined}
                    onClick={() => { if (item.unlocked) handleIngredient(item.id); }}
                    whileHover={item.unlocked ? { scale: 1.1, y: -4 } : {}}
                    whileTap={item.unlocked ? { scale: 0.93 } : {}}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem",
                      padding: "0.65rem 0.85rem",
                      background: item.done
                        ? "rgba(90,156,90,0.12)"
                        : item.unlocked
                          ? "#fff"
                          : "rgba(255,255,255,0.35)",
                      borderRadius: 13,
                      border: `2px solid ${
                        item.done
                          ? "rgba(90,156,90,0.5)"
                          : item.unlocked
                            ? accent
                            : "rgba(0,0,0,0.07)"
                      }`,
                      cursor: item.unlocked ? "grab" : item.done ? "default" : "not-allowed",
                      opacity: item.done ? 0.7 : item.unlocked ? 1 : 0.35,
                      minWidth: 80,
                      boxShadow: item.unlocked ? `0 4px 14px ${accent}22` : "none",
                      transition: "all 0.25s ease",
                      userSelect: "none",
                    }}
                  >
                    {/* Color swatch */}
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: item.swatch,
                      border: "2.5px solid rgba(255,255,255,0.7)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 700, textAlign: "center",
                      color: item.done ? "#5a9c5a" : item.unlocked ? "#2a2a2a" : "#ccc",
                      lineHeight: 1.25, maxWidth: 76,
                    }}>
                      {item.done ? "✓ Added" : item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Main area: Cookie + Progress ── */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center", gap: "3rem" }}>

          {/* Cookie drop zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            onDragOver={(e) => { e.preventDefault(); setIsDragOverCookie(true); }}
            onDragLeave={() => setIsDragOverCookie(false)}
            onDrop={handleDrop}
            style={{
              width: "100%", maxWidth: "220px", flexShrink: 0,
              borderRadius: 20,
              border: isDragOverCookie ? `2.5px dashed ${accent}` : "2.5px dashed transparent",
              background: isDragOverCookie ? `${accent}0e` : "transparent",
              transition: "all 0.2s ease",
              padding: 6,
              position: "relative",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${base}-${chipsAdded}-${drizzle}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3 }}
              >
                <CookiePreview base={base} drizzle={drizzle} extras={[]} uid={uid} showChips={chipsAdded} />
              </motion.div>
            </AnimatePresence>

            {/* Drag-over label */}
            <AnimatePresence>
              {isDragOverCookie && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute", bottom: -28, left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "0.75rem", color: accent, fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Lepaskan di sini! 👆
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Progress steps */}
          <div style={{ flex: 1, minWidth: "260px", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>

            {PROGRESS.map((ps, i) => {
              const prevDone = i === 0 || PROGRESS[i - 1].done;
              const isActive = !ps.done && prevDone;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    background: "#fff", borderRadius: 14, padding: "0.9rem 1.25rem",
                    border: ps.done
                      ? "2px solid rgba(90,156,90,0.5)"
                      : isActive
                        ? `2px solid ${accent}`
                        : "2px solid rgba(0,0,0,0.07)",
                    opacity: (!ps.done && !isActive) ? 0.4 : 1,
                    transition: "all 0.3s ease",
                    display: "flex", alignItems: "center", gap: "0.85rem",
                  }}
                >
                  <div style={{
                    ...stepNumBase,
                    background: ps.done ? "#5a9c5a" : isActive ? accent : "rgba(0,0,0,0.15)",
                  }}>
                    {ps.done ? "✓" : i + 1}
                  </div>
                  <div>
                    <span style={{
                      fontSize: "0.95rem", fontWeight: 700,
                      color: ps.done ? "#5a9c5a" : isActive ? "#1a1a1a" : "#999",
                    }}>
                      {ps.label}
                    </span>
                    {isActive && (
                      <p style={{ fontSize: "0.72rem", color: "#aaa", margin: "2px 0 0", fontWeight: 500 }}>
                        Seret bahan yang menyala ke cookie ☝️
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Summary */}
            <AnimatePresence>
              {base && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    background: "#fff", borderRadius: 16,
                    padding: "1rem 1.25rem",
                    border: `1.5px solid ${accent}33`,
                    boxShadow: `0 4px 18px ${accent}14`,
                  }}
                >
                  <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#5a9c5a", margin: "0 0 0.4rem" }}>
                    Cookie kamu 🍪
                  </p>
                  <p style={{ fontSize: "0.92rem", color: "#333", fontWeight: 500, lineHeight: 1.65, margin: "0 0 0.85rem" }}>
                    {BYC_BASES.find(b => b.id === base)?.label}
                    {chipsAdded && " + Chips"}
                    {drizzle && ` + ${BYC_DRIZZLES.find(d => d.id === drizzle)?.label}`}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReset}
                    style={{
                      padding: "0.5rem 1.2rem", borderRadius: 999,
                      background: "rgba(0,0,0,0.06)", border: "none",
                      fontSize: "0.8rem", color: "#888", cursor: "pointer", fontWeight: 500,
                    }}
                  >
                    ↩ Ulangi
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
//  App
// ─────────────────────────────────────────────

export default function App() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale   = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [bymResult, setBymResult] = useState<{ sauce: string | null; logoAdded: boolean } | null>(null);
  const [bycResult, setBycResult] = useState<{ base: string | null; drizzle: string | null; chipsAdded: boolean } | null>(null);
  const [buildResetKey, setBuildResetKey] = useState(0);

  const handleResetAll = () => {
    setBymResult(null);
    setBycResult(null);
    setBuildResetKey(k => k + 1);
  };

  useEffect(() => {
    const block = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#f7f4ef", position: "relative", overflow: "hidden" }}>

      <style>{`
        /* ── Image Protection ── */
        img {
          -webkit-user-drag: none;
          user-drag: none;
          -webkit-user-select: none;
          user-select: none;
          pointer-events: none;
        }
        a img, button img { pointer-events: auto; }

        @keyframes floatUp1 { 0% { transform: translateY(100vh) scale(0.8); opacity: 0; } 10% { opacity: 0.45; } 90% { opacity: 0.45; } 100% { transform: translateY(-120px) scale(1.1); opacity: 0; } }
        @keyframes floatUp2 { 0% { transform: translateY(100vh) scale(1);   opacity: 0; } 10% { opacity: 0.35; } 90% { opacity: 0.35; } 100% { transform: translateY(-120px) scale(0.9); opacity: 0; } }
        @keyframes floatUp3 { 0% { transform: translateY(100vh) scale(0.9); opacity: 0; } 10% { opacity: 0.4;  } 90% { opacity: 0.4;  } 100% { transform: translateY(-120px) scale(1);   opacity: 0; } }
        .bubble { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; overflow: hidden; }
        .bubble::before { content: ''; position: absolute; top: 18%; left: 20%; width: 35%; height: 30%; border-radius: 50%; background: rgba(255,255,255,0.55); filter: blur(1px); transform: rotate(-30deg); }
        .bubble::after  { content: ''; position: absolute; top: 10%; left: 55%; width: 18%; height: 14%; border-radius: 50%; background: rgba(255,255,255,0.35); filter: blur(0.5px); }
        .b1  { width:18px; height:18px; left:5%;  background:#ffb3c6; animation: floatUp1 9s  2s   infinite ease-in; }
        .b2  { width:26px; height:26px; left:12%; background:#a8d5a8; animation: floatUp2 12s 0s   infinite ease-in; }
        .b3  { width:14px; height:14px; left:20%; background:#c9a584; animation: floatUp3 8s  4s   infinite ease-in; }
        .b4  { width:30px; height:30px; left:30%; background:#ffb3c6; animation: floatUp1 14s 1s   infinite ease-in; }
        .b5  { width:20px; height:20px; left:40%; background:#a8d5a8; animation: floatUp2 10s 6s   infinite ease-in; }
        .b6  { width:16px; height:16px; left:50%; background:#ff85a8; animation: floatUp3 11s 3s   infinite ease-in; }
        .b7  { width:24px; height:24px; left:60%; background:#7cb67c; animation: floatUp1 13s 0.5s infinite ease-in; }
        .b8  { width:12px; height:12px; left:70%; background:#c9a584; animation: floatUp2 7s  5s   infinite ease-in; }
        .b9  { width:28px; height:28px; left:80%; background:#ffb3c6; animation: floatUp3 15s 2s   infinite ease-in; }
        .b10 { width:18px; height:18px; left:88%; background:#a8d5a8; animation: floatUp1 9s  7s   infinite ease-in; }
        .b11 { width:22px; height:22px; left:25%; background:#ff85a8; animation: floatUp2 11s 8s   infinite ease-in; }
        .b12 { width:15px; height:15px; left:55%; background:#7cb67c; animation: floatUp3 10s 1.5s infinite ease-in; }
        .b13 { width:20px; height:20px; left:75%; background:#c9a584; animation: floatUp1 12s 3.5s infinite ease-in; }
        .b14 { width:25px; height:25px; left:92%; background:#ffb3c6; animation: floatUp2 14s 4.5s infinite ease-in; }
        .b15 { width:13px; height:13px; left:45%; background:#a8d5a8; animation: floatUp3 8s  9s   infinite ease-in; }

        .hero-logo-wrap  { width: 120px; height: 120px; }
        .hero-logo-img   { width: 80px;  height: 80px;  }
        .flavors-desktop { display: none; }
        .flavors-mobile  { display: block; }
        .cookies-desktop { display: none; }
        .cookies-mobile  { display: block; }
        .info-grid       { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 360px; margin: 0 auto 2rem; }
        .nav-mobile      { display: flex; }
        .nav-desktop     { display: none; }

        @media (min-width: 768px) {
          .hero-logo-wrap  { width: 160px; height: 160px; }
          .hero-logo-img   { width: 110px; height: 110px; }
          .flavors-desktop { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; }
          .flavors-mobile  { display: none; }
          .cookies-desktop { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; }
          .cookies-mobile  { display: none; }
          .info-grid       { grid-template-columns: repeat(2, 1fr); max-width: 480px; margin: 0 auto 2.5rem; }
          .nav-mobile      { display: none !important; }
          .nav-desktop     { display: flex !important; }
        }

        /* ── Build Your Milkyu animations ── */
        @keyframes sauceDripIn {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        @keyframes cookieFall {
          0%   { opacity: 0;   transform: translateY(0px)   rotate(0deg);   }
          12%  { opacity: 1;   }
          85%  { opacity: 0.9; }
          100% { opacity: 0;   transform: translateY(158px) rotate(300deg); }
        }
        @keyframes iceDrop {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes milkPour {
          from { opacity: 0; transform: scaleY(0); transform-origin: top; }
          to   { opacity: 1; transform: scaleY(1); }
        }
        .bym-sauce-group {
          animation: sauceDripIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform-box: fill-box;
          transform-origin: top center;
        }
        .bym-cookie-fall {
          animation-name: cookieFall;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in;
          transform-box: fill-box;
          transform-origin: center center;
        }
        .bym-ice-cube {
          animation: iceDrop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-box: fill-box;
        }

        /* Build Your Cookie drizzle animation */
        @keyframes drizzleIn {
          from { opacity: 0; stroke-dashoffset: 200; }
          to   { opacity: 1; stroke-dashoffset: 0; }
        }
        .byc-drizzle-in path {
          stroke-dasharray: 200;
          animation: drizzleIn 0.5s ease-out forwards;
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div className="bubble b1" /><div className="bubble b2" /><div className="bubble b3" />
        <div className="bubble b4" /><div className="bubble b5" /><div className="bubble b6" />
        <div className="bubble b7" /><div className="bubble b8" /><div className="bubble b9" />
        <div className="bubble b10" /><div className="bubble b11" /><div className="bubble b12" />
        <div className="bubble b13" /><div className="bubble b14" /><div className="bubble b15" />
      </div>

      {/* ── HEADER ── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "rgba(247, 244, 239, 0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between" style={{ padding: "0.75rem 1.25rem" }}>
          <div className="flex items-center gap-3">
            <img src="/milkyu-logo.png" alt="Milkyu Logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em" }}>Milkyu</span>
          </div>
          <nav className="nav-desktop items-center gap-8" style={{ fontSize: "0.9rem", color: "#666", fontWeight: 500 }}>
            <a href="#flavors"      style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Varian Rasa</a>
            <a href="#cookie"       style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Cemilan</a>
            <a href="#build"        style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Build Milkyu</a>
            <a href="#build-cookie" style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Build Cookie</a>
            <a href="#about"        style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Tentang</a>
            <a href="#contact"      style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Kontak</a>
          </nav>
          <nav className="nav-mobile items-center gap-4">
            <a href="#flavors" style={{ textDecoration: "none", color: "#666", fontSize: "0.8rem", fontWeight: 600 }}>Menu</a>
            <a href="#contact" style={{ textDecoration: "none", color: "#666", fontSize: "0.8rem", fontWeight: 600 }}>Kontak</a>
          </nav>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-5"
      >
        <div className="max-w-4xl mx-auto text-center w-full" style={{ position: "relative", zIndex: 2, paddingTop: "5rem" }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hero-logo-wrap"
            style={{ position: "relative", margin: "0 auto 1.75rem" }}
          >
            <motion.svg width="100%" height="100%" viewBox="0 0 160 160" style={{ position: "absolute", top: 0, left: 0 }} animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
              <circle cx="80" cy="80" r="72" fill="none" stroke="#8b5a3c" strokeWidth="1.5" strokeDasharray="40 20 10 20" strokeLinecap="round" opacity="0.35" />
            </motion.svg>
            <motion.svg width="100%" height="100%" viewBox="0 0 160 160" style={{ position: "absolute", top: 0, left: 0 }} animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#a8d5a8" strokeWidth="1.5" strokeDasharray="25 35" strokeLinecap="round" opacity="0.4" />
            </motion.svg>
            <img src="/milkyu-logo.png" alt="Milkyu Logo" className="hero-logo-img" style={{ objectFit: "contain", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ display: "inline-block", background: "rgba(139,90,60,0.08)", color: "#8b5a3c", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: "999px", marginBottom: "1rem" }}>
            Sticky Milk Favoritmu
          </motion.div>

          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.1, marginBottom: "1.25rem", letterSpacing: "-0.03em" }}>
            Manisnya Pas,<br />
            <span style={{ color: "#8b5a3c" }}>Mood Langsung Naik</span>
          </motion.h1>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", color: "#888", maxWidth: "480px", margin: "0 auto 2rem", lineHeight: 1.7, padding: "0 0.5rem" }}>
            Nikmati koleksi sticky milk andalan kami — perpaduan rasa autentik dengan sentuhan modern.
          </motion.p>

          <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ background: "#1a1a1a", color: "#fff", padding: "0.8rem 2rem", borderRadius: "999px", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: "pointer" }} onClick={() => document.getElementById("flavors")?.scrollIntoView({ behavior: "smooth" })}>
            Lihat Menu →
          </motion.button>
        </div>
      </motion.section>

      {/* ── FLAVORS ── */}
      <section id="flavors" className="px-5" style={{ paddingTop: "4rem", paddingBottom: "5rem", position: "relative", zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center" style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", color: "#8b5a3c", textTransform: "uppercase", marginBottom: "0.6rem" }}>Pilihan Rasa</p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.02em" }}>Tiga Varian Favorit</h2>
          </motion.div>

          <div className="flavors-desktop items-start">
            {FLAVORS.map(({ flavor, title, description }, i) => (
              <motion.div key={flavor} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: i * 0.15 }} viewport={{ once: true }} className="flex justify-center w-full">
                <BobaCup flavor={flavor} title={title} description={description} />
              </motion.div>
            ))}
          </div>

          <div className="flavors-mobile">
            <FlavorCarousel />
          </div>
        </div>
      </section>

      {/* ── COOKIE ── */}
      <section id="cookie" className="px-5" style={{ paddingTop: "4rem", paddingBottom: "5rem", background: "#fff8f2", position: "relative", zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
            style={{ marginBottom: "2.5rem" }}
          >
            <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", color: "#8b1515", textTransform: "uppercase", marginBottom: "0.6rem" }}>Cemilan Spesial</p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.02em" }}>Cookies Andalan Kami</h2>
            <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: "#888", maxWidth: "460px", margin: "0.75rem auto 0", lineHeight: 1.7 }}>
              Padukan sticky milk favoritmu dengan soft cookies kami — lembut di luar, creamy di dalam.
            </p>
          </motion.div>

          <div className="cookies-desktop">
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.92 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 }} viewport={{ once: true }} style={{ width: "100%", maxWidth: "240px" }}>
              <Cookie variant="original" title="Brown Sugar Butter" description="Cookie brown sugar yang buttery dengan aroma karamel hangat yang menggoda." />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.92 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.75, ease: "easeOut" }} viewport={{ once: true }} style={{ width: "100%", maxWidth: "240px" }}>
              <Cookie title="Red Velvet Cream Cheese" description="Cookie red velvet yang lembut dengan isian cream cheese berkualitas." />
            </motion.div>
          </div>

          <div className="cookies-mobile">
            <CookieCarousel />
          </div>
        </div>
      </section>

      {/* ── BUILD YOUR MILKYU ── */}
      <BuildYourMilkyu key={`bym-${buildResetKey}`} onComplete={(sauce, logoAdded) => {
        setBymResult({ sauce, logoAdded });
      }} onReset={handleResetAll} />

      {/* ── BUILD YOUR COOKIE ── */}
      <BuildYourCookie key={`byc-${buildResetKey}`} onComplete={(base, drizzle, chipsAdded) => {
        setBycResult({ base, drizzle, chipsAdded });
      }} onReset={handleResetAll} />

      {/* ── HASIL KREASI ── */}
      <AnimatePresence>
        {(bymResult || bycResult) && (
          <motion.section
            id="hasil-kreasi"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="px-5"
            style={{ paddingTop: "4rem", paddingBottom: "5rem", background: "#f7f4ef", position: "relative", zIndex: 2 }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center" style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", color: "#8b5a3c", textTransform: "uppercase", marginBottom: "0.6rem" }}>Kreasi Kamu</p>
                <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.02em" }}>Hasil Build Kamu 🎉</h2>
                <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: "#888", maxWidth: "420px", margin: "0.75rem auto 0", lineHeight: 1.7 }}>
                  Ini kreasi spesialmu — setiap pilihan mencerminkan selera unikmu!
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "3rem", alignItems: "flex-start" }}>

                {/* Milkyu result */}
                {bymResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", maxWidth: "220px", width: "100%" }}
                  >
                    <div style={{ background: "rgba(139,90,60,0.06)", borderRadius: 20, padding: "1.25rem", border: "1.5px solid rgba(139,90,60,0.15)", width: "100%" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8b5a3c", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem", textAlign: "center" }}>🥤 Milkyu Kamu</p>
                      <BobaCup
                        flavor={(bymResult.sauce ?? "matcha") as "matcha" | "strawberry" | "chocolate"}
                        title={BUILD_SAUCES.find(s => s.id === bymResult.sauce)?.label ?? "Milkyu"}
                        description={`Plain Milk + Es Batu + ${BUILD_SAUCES.find(s => s.id === bymResult.sauce)?.label ?? ""}`}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Cookie result */}
                {bycResult && bycResult.base && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", maxWidth: "220px", width: "100%" }}
                  >
                    <div style={{ background: "rgba(139,21,21,0.05)", borderRadius: 20, padding: "1.25rem", border: "1.5px solid rgba(139,21,21,0.12)", width: "100%" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8b1515", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem", textAlign: "center" }}>🍪 Cookie Kamu</p>
                      <Cookie
                        variant={bycResult.base as "original" | "red-velvet"}
                        title={BYC_BASES.find(b => b.id === bycResult!.base)?.label ?? "Cookie"}
                        description={[
                          BYC_BASES.find(b => b.id === bycResult!.base)?.label,
                          bycResult.chipsAdded ? "Chips" : null,
                          BYC_DRIZZLES.find(d => d.id === bycResult!.drizzle)?.label,
                        ].filter(Boolean).join(" + ")}
                      />
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ textAlign: "center", marginTop: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
              >
                <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: "#555", fontWeight: 600, maxWidth: "360px", lineHeight: 1.6 }}>
                  📋 Tunjukkan pesananmu ini ke bartender kami!
                </p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { handleResetAll(); }}
                  style={{
                    padding: "0.6rem 1.6rem", borderRadius: "999px",
                    background: "rgba(0,0,0,0.07)", border: "none",
                    fontSize: "0.85rem", color: "#666", cursor: "pointer", fontWeight: 600,
                  }}
                >
                  ↩ Reset Kreasi
                </motion.button>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── ABOUT ── */}
      <section id="about" className="px-5" style={{ paddingTop: "4rem", paddingBottom: "5rem", background: "#fff", position: "relative", zIndex: 2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", color: "#8b5a3c", textTransform: "uppercase", marginBottom: "0.6rem" }}>Tentang Kami</p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              Dibuat dengan Hati,<br />Untuk Setiap Momen
            </h2>
            <p style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "#777", lineHeight: 1.8, maxWidth: "580px", margin: "0 auto", padding: "0 0.5rem" }}>
              Milkyu lahir dari obsesi sederhana: menciptakan minuman susu yang bukan sekadar minuman.
              Setiap tegukan dirancang untuk membawa kebahagiaan kecil di tengah hari yang panjang.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="px-5" style={{ paddingTop: "4rem", paddingBottom: "5rem", background: "#1a1a1a", position: "relative", zIndex: 2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", color: "#c9a584", textTransform: "uppercase", marginBottom: "0.6rem" }}>Temukan Kami</p>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>Yuk, Mampir!</h2>
            <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: "rgba(255,255,255,0.5)", marginBottom: "2.5rem", padding: "0 0.5rem" }}>
              Follow Instagram kami untuk info menu terbaru & promo spesial
            </p>
            <div className="info-grid">
              {[
                { icon: "🕐", label: "Jam Buka", value: "08.00 – 22.00" },
                { icon: "📍", label: "Lokasi",   value: "Daan mogot"  },
              ].map(({ icon, label, value }) => (
                <motion.div key={label} whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.1)" }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.1rem 0.75rem", transition: "background 0.2s", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>{icon}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{label}</div>
                  <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600 }}>{value}</div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} viewport={{ once: true }} style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
              <motion.a href="https://www.instagram.com/milkyu.official" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0.75rem 1.8rem", borderRadius: "999px", background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", color: "#fff", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", letterSpacing: "0.01em", boxShadow: "0 4px 20px rgba(220,39,67,0.35)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                @milkyu.official
              </motion.a>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
              💬 Follow instagram kami untuk mendapatkan promo menarik
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-5 text-center" style={{ background: "#111111" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/milkyu-logo.png" alt="Milkyu Logo" style={{ width: 26, height: 26, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
            <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Milkyu</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <a href="https://www.instagram.com/milkyu.official" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#e6683c")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              Instagram
            </a>
          </div>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>© 2026 Milkyu Official.</p>
        </div>
      </footer>

      <MilkyuMascot />
    </div>
  );
}
