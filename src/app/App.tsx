import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { BobaCup } from "./components/BobaCup";
import { MilkyuMascot } from "./components/MilkyuMascot";

const FLAVORS = [
  {
    flavor: "matcha" as const,
    title: "Matcha Bliss",
    description: "Perpaduan susu creamy dan saus sticky milk rasa matcha yang lembut.",
    accent: "#5a9c5a",
  },
  {
    flavor: "strawberry" as const,
    title: "Strawberry Dream",
    description: "Susu creamy yang menyatu dalam tekstur saus sticky milk strawberry yang lembut.",
    accent: "#e8607a",
  },
  {
    flavor: "chocolate" as const,
    title: "Chocolate Indulgence",
    description: "saus sticky milk Cokelat yang lembut dicampur dengan susu creamy",
    accent: "#8b5a3c",
  },
];

function FlavorCarousel() {
  const [active, setActive] = useState(1); // mulai dari tengah (strawberry)
  const [dir, setDir] = useState(0); // 1 = kanan, -1 = kiri

  const go = (next: number) => {
    setDir(next > active ? 1 : -1);
    setActive(next);
  };

  const prev = () => go(active === 0 ? FLAVORS.length - 1 : active - 1);
  const next = () => go(active === FLAVORS.length - 1 ? 0 : active + 1);

  const f = FLAVORS[active];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 280 : -280, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -280 : 280, opacity: 0 }),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>

      {/* Cup area dengan tombol kiri-kanan */}
      <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Tombol kiri */}
        <button
          onClick={prev}
          style={{
            position: "absolute", left: 0, zIndex: 10,
            width: 44, height: 44, borderRadius: "50%",
            background: "#fff", border: "1.5px solid rgba(0,0,0,0.08)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: "1.3rem", color: "#555",
            lineHeight: 1,
          }}
        >
          ‹
        </button>

        {/* Cup animasi slide */}
        <div style={{ width: 200, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: "easeInOut" }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <BobaCup
                flavor={f.flavor}
                title={f.title}
                description={f.description}
                hideText={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tombol kanan */}
        <button
          onClick={next}
          style={{
            position: "absolute", right: 0, zIndex: 10,
            width: 44, height: 44, borderRadius: "50%",
            background: "#fff", border: "1.5px solid rgba(0,0,0,0.08)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: "1.3rem", color: "#555",
            lineHeight: 1,
          }}
        >
          ›
        </button>
      </div>

      {/* Nama & deskripsi */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active + "-text"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className="text-center"
          style={{ maxWidth: 260, padding: "0 0.5rem" }}
        >
          <h3 style={{ color: f.accent, fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.35rem" }}>
            {f.title}
          </h3>
          <p style={{ color: "#777", fontSize: "0.83rem", lineHeight: 1.6 }}>
            {f.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 8 }}>
        {FLAVORS.map((fl, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background: i === active ? fl.accent : "rgba(0,0,0,0.14)",
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

export default function App() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen" style={{ background: "#f7f4ef", position: "relative", overflow: "hidden" }}>

      {/* ── FLOATING BUBBLES + RESPONSIVE ── */}
      <style>{`
        @keyframes floatUp1 { 0% { transform: translateY(100vh) scale(0.8); opacity: 0; } 10% { opacity: 0.45; } 90% { opacity: 0.45; } 100% { transform: translateY(-120px) scale(1.1); opacity: 0; } }
        @keyframes floatUp2 { 0% { transform: translateY(100vh) scale(1); opacity: 0; } 10% { opacity: 0.35; } 90% { opacity: 0.35; } 100% { transform: translateY(-120px) scale(0.9); opacity: 0; } }
        @keyframes floatUp3 { 0% { transform: translateY(100vh) scale(0.9); opacity: 0; } 10% { opacity: 0.4; } 90% { opacity: 0.4; } 100% { transform: translateY(-120px) scale(1); opacity: 0; } }
        .bubble { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; overflow: hidden; }
        .bubble::before { content: ''; position: absolute; top: 18%; left: 20%; width: 35%; height: 30%; border-radius: 50%; background: rgba(255,255,255,0.55); filter: blur(1px); transform: rotate(-30deg); }
        .bubble::after  { content: ''; position: absolute; top: 10%; left: 55%; width: 18%; height: 14%; border-radius: 50%; background: rgba(255,255,255,0.35); filter: blur(0.5px); }
        .b1  { width:18px;  height:18px;  left:5%;   background:#ffb3c6; animation: floatUp1 9s  2s   infinite ease-in; }
        .b2  { width:26px;  height:26px;  left:12%;  background:#a8d5a8; animation: floatUp2 12s 0s   infinite ease-in; }
        .b3  { width:14px;  height:14px;  left:20%;  background:#c9a584; animation: floatUp3 8s  4s   infinite ease-in; }
        .b4  { width:30px;  height:30px;  left:30%;  background:#ffb3c6; animation: floatUp1 14s 1s   infinite ease-in; }
        .b5  { width:20px;  height:20px;  left:40%;  background:#a8d5a8; animation: floatUp2 10s 6s   infinite ease-in; }
        .b6  { width:16px;  height:16px;  left:50%;  background:#ff85a8; animation: floatUp3 11s 3s   infinite ease-in; }
        .b7  { width:24px;  height:24px;  left:60%;  background:#7cb67c; animation: floatUp1 13s 0.5s infinite ease-in; }
        .b8  { width:12px;  height:12px;  left:70%;  background:#c9a584; animation: floatUp2 7s  5s   infinite ease-in; }
        .b9  { width:28px;  height:28px;  left:80%;  background:#ffb3c6; animation: floatUp3 15s 2s   infinite ease-in; }
        .b10 { width:18px;  height:18px;  left:88%;  background:#a8d5a8; animation: floatUp1 9s  7s   infinite ease-in; }
        .b11 { width:22px;  height:22px;  left:25%;  background:#ff85a8; animation: floatUp2 11s 8s   infinite ease-in; }
        .b12 { width:15px;  height:15px;  left:55%;  background:#7cb67c; animation: floatUp3 10s 1.5s infinite ease-in; }
        .b13 { width:20px;  height:20px;  left:75%;  background:#c9a584; animation: floatUp1 12s 3.5s infinite ease-in; }
        .b14 { width:25px;  height:25px;  left:92%;  background:#ffb3c6; animation: floatUp2 14s 4.5s infinite ease-in; }
        .b15 { width:13px;  height:13px;  left:45%;  background:#a8d5a8; animation: floatUp3 8s  9s   infinite ease-in; }

        .hero-logo-wrap  { width: 120px; height: 120px; }
        .hero-logo-img   { width: 80px; height: 80px; }
        .flavors-desktop { display: none; }
        .flavors-mobile  { display: block; }
        .info-grid       { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 360px; margin: 0 auto 2rem; }
        .nav-mobile      { display: flex; }
        .nav-desktop     { display: none; }

        @media (min-width: 768px) {
          .hero-logo-wrap  { width: 160px; height: 160px; }
          .hero-logo-img   { width: 110px; height: 110px; }
          .flavors-desktop { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; }
          .flavors-mobile  { display: none; }
          .info-grid       { grid-template-columns: repeat(2, 1fr); max-width: 480px; margin: 0 auto 2.5rem; }
          .nav-mobile      { display: none !important; }
          .nav-desktop     { display: flex !important; }
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
            <a href="#flavors" style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Varian Rasa</a>
            <a href="#about"   style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Tentang</a>
            <a href="#contact" style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Kontak</a>
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
        <div className="max-w-4xl mx-auto text-center w-full" style={{ position: "relative", zIndex: 2, paddingTop: "4rem", marginTop: "-5vh" }}>
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

          {/* Desktop: grid 3 kolom */}
          <div className="flavors-desktop items-start">
            {FLAVORS.map(({ flavor, title, description }, i) => (
              <motion.div key={flavor} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: i * 0.15 }} viewport={{ once: true }} className="flex justify-center">
                <BobaCup flavor={flavor} title={title} description={description} />
              </motion.div>
            ))}
          </div>

          {/* Mobile: carousel geser kiri-kanan */}
          <div className="flavors-mobile">
            <FlavorCarousel />
          </div>
        </div>
      </section>

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
                { icon: "📍", label: "Lokasi", value: "Bandung, ID" },
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

      {/* ── MASCOT ── */}
      <MilkyuMascot />
    </div>
  );
}
