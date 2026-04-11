import { motion, useScroll, useTransform } from "motion/react";
import { useState, useEffect } from "react";
import { BobaCup } from "./components/BobaCup";
import { MilkyuMascot } from "./components/MilkyuMascot";

export default function App() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#f7f4ef", position: "relative", overflow: "hidden" }}>

      {/* ── GLOBAL AURORA (all sections) ── */}
      <style>{`
        @keyframes aurora1 {
          0%   { transform: translate(0%, 0%) scale(1); }
          33%  { transform: translate(8%, -12%) scale(1.15); }
          66%  { transform: translate(-6%, 8%) scale(0.95); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes aurora2 {
          0%   { transform: translate(0%, 0%) scale(1); }
          33%  { transform: translate(-10%, 6%) scale(1.1); }
          66%  { transform: translate(8%, -10%) scale(1.05); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes aurora3 {
          0%   { transform: translate(0%, 0%) scale(1); }
          50%  { transform: translate(5%, 10%) scale(1.2); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
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
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Aurora blobs */}
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "65vw", height: "65vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,213,168,0.22) 0%, transparent 65%)", animation: "aurora1 14s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "20%", right: "-15%", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,179,198,0.2) 0%, transparent 65%)", animation: "aurora2 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "15%", width: "55vw", height: "55vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,165,132,0.16) 0%, transparent 65%)", animation: "aurora3 22s ease-in-out infinite" }} />
        {/* Floating bubbles */}
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/milkyu-logo.png" alt="Milkyu Logo" style={{ width: 40, height: 40, objectFit: "contain" }} />
            <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
              Milkyu
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8" style={{ fontSize: "0.9rem", color: "#666", fontWeight: 500 }}>
            <a href="#flavors" style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Varian rasa</a>
            <a href="#about" style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Tentang</a>
            <a href="#contact" style={{ textDecoration: "none", color: "#666" }} className="hover:opacity-60 transition-opacity">Kontak</a>
           
          </nav>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      >
        <div className="max-w-4xl mx-auto text-center" style={{ position: "relative", zIndex: 2 }}>
          {/* Logo with rotating arc decoration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ position: "relative", width: isMobile ? 110 : 160, height: isMobile ? 110 : 160, margin: "0 auto 2rem" }}
          >
            <motion.svg
              width={isMobile ? 110 : 160} height={isMobile ? 110 : 160} viewBox="0 0 160 160"
              style={{ position: "absolute", top: 0, left: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="80" cy="80" r="72" fill="none" stroke="#8b5a3c" strokeWidth="1.5"
                strokeDasharray="40 20 10 20" strokeLinecap="round" opacity="0.35" />
            </motion.svg>
            <motion.svg
              width={isMobile ? 110 : 160} height={isMobile ? 110 : 160} viewBox="0 0 160 160"
              style={{ position: "absolute", top: 0, left: 0 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="80" cy="80" r="60" fill="none" stroke="#a8d5a8" strokeWidth="1.5"
                strokeDasharray="25 35" strokeLinecap="round" opacity="0.4" />
            </motion.svg>
            <img
              src="/milkyu-logo.png"
              alt="Milkyu Logo"
              style={{
                width: isMobile ? 76 : 110, height: isMobile ? 76 : 110, objectFit: "contain",
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: "inline-block",
              background: "rgba(139,90,60,0.08)",
              color: "#8b5a3c",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "6px 16px",
              borderRadius: "999px",
              marginBottom: "1.25rem",
            }}
          >
            Sticky Milk Favoritmu
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              color: "#1a1a1a",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              letterSpacing: "-0.03em",
            }}
          >
            Manisnya Pas,
            <br />
            <span style={{ color: "#8b5a3c" }}>Mood Langsung Naik</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontSize: "1.1rem",
              color: "#888",
              marginBottom: "2.5rem",
              maxWidth: "520px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            Nikmati koleksi sticky milk andalan kami — perpaduan rasa autentik dengan sentuhan modern.
          </motion.p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "#1a1a1a",
              color: "#fff",
              padding: "0.85rem 2.2rem",
              borderRadius: "999px",
              fontSize: "0.95rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Jelajahi Rasa
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{ position: "absolute", bottom: "-3rem", left: "50%", transform: "translateX(-50%)" }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: "#bbb", fontSize: "0.85rem" }}
            >
              ↓ Scroll
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── FLAVORS ── */}
      <section id="flavors" className={isMobile ? "py-16 px-4" : "py-32 px-6"} style={{ background: "rgba(255,255,255,0.5)", position: "relative", zIndex: 1 }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={isMobile ? "text-center mb-10" : "text-center mb-20"}
          >
            <p style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#bbb", marginBottom: "0.75rem" }}>
              Menu
            </p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
              Varian rasa Milkyu
            </h2>
            <p style={{ fontSize: "1rem", color: "#888", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
              Tiga varian sticky milk andalan kami. klik - klik untuk melihat tampilannya secara interaktif.
            </p>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: isMobile ? "2rem" : "4rem", position: "relative", zIndex: 2 }}
          >
            {[
              { flavor: "matcha" as const, title: "Matcha Bliss", desc: "Perpaduan susu creamy dan saus sticky milk rasa matcha yang lembut.", delay: 0.1 },
              { flavor: "strawberry" as const, title: "Strawberry Dream", desc: "Susu creamy yang menyatu dalam tekstur saus sticky milk strawberry yang lembut.", delay: 0.3 },
              { flavor: "chocolate" as const, title: "Chocolate Indulgence", desc: "saus sticky milk Cokelat yang dicampur dengan susu creamy", delay: 0.5 },
            ].map(({ flavor, title, desc, delay }) => (
              <motion.div
                key={flavor}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay }}
                viewport={{ once: true }}
              >
                <BobaCup flavor={flavor} title={title} description={desc} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className={isMobile ? "py-16 px-4" : "py-32 px-6"} style={{ background: "rgba(247,244,239,0.5)", position: "relative", zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#bbb", marginBottom: "0.75rem" }}>
                Tentang
              </p>
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#1a1a1a", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
                Dibuat dengan Sepenuh Hati
              </h2>
              <p style={{ fontSize: "1rem", color: "#777", lineHeight: 1.8, marginBottom: "1rem" }}>
                Di Milkyu, setiap gelas dibuat untuk jadi lebih dari sekadar minuman. Semua sticky milk kami diracik fresh setiap hari dengan bahan berkualitas.
              </p>
              <p style={{ fontSize: "1rem", color: "#777", lineHeight: 1.8 }}>
                Mulai dari matcha, strawberry, sampai cokelat pilihan — semuanya kami pilih dengan standar yang sama: kualitas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: "🌱", title: "Bahan Pilihan", sub: "Dibuat dengan bahan terbaik" },
                { icon: "✨", title: "Kualitas Terjaga", sub: "Dipilih dengan standar terbaik" },
                { icon: "🤝", title: "Diracik Langsung", sub: "Dibuat fresh setiap hari" },
                { icon: "💝", title: "Konsisten Rasa", sub: "Setiap gelas tetap sama enaknya" },
              ].map(({ icon, title, sub }) => (
                <motion.div
                  key={title}
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "16px",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{icon}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.25rem" }}>{title}</div>
                  <div style={{ fontSize: "0.85rem", color: "#999" }}>{sub}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <motion.section
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className={isMobile ? "py-16 px-4" : "py-32 px-6"}
        style={{ background: "#1a1a1a" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="/milkyu-logo.png"
              alt="Milkyu Logo"
              style={{ width: 80, height: 80, objectFit: "contain", margin: "0 auto 1.5rem", filter: "brightness(0) invert(1)", opacity: 0.9 }}
            />
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#ffffff", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
              Pesan sekarang juga...!
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "2.5rem" }}>
              Rasakan sticky milk berkualitas — klik maskot Milkyu di layar untuk langsung chat!
            </p>

            {/* Info cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto justify-center" style={{ marginBottom: "1.5rem" }}>
              {[
                { icon: "⏰", label: "Jam Buka", value: "08.00 – 21.00" },
                { icon: "📍", label: "Lokasi", value: "Daan mogot" },
              ].map(({ icon, label, value }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.1)" }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "1.25rem 1rem",
                    transition: "background 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>{icon}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{label}</div>
                  <div style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 600 }}>{value}</div>
                </motion.div>
              ))}
            </div>

            {/* ── TOMBOL INSTAGRAM ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}
            >
              <motion.a
                href="https://www.instagram.com/milkyu.official"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0.75rem 1.8rem",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  boxShadow: "0 4px 20px rgba(220,39,67,0.35)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                Instagram
              </motion.a>
            </motion.div>

            {/* Subtle mascot hint */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              style={{ marginTop: "1rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.3)" }}
            >
              💬 Follow instagram kami untuk mendapatkan promo menarik
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 text-center" style={{ background: "#111111" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/milkyu-logo.png" alt="Milkyu Logo" style={{ width: 28, height: 28, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Milkyu</span>
          </div>
          {/* Social links di footer */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
            <a
              href="https://wa.me/6282246972263"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "rgba(255,255,255,0.45)", textDecoration: "none",
                fontSize: "0.8rem", fontWeight: 500, transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#25D366")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <a
              href="https://www.instagram.com/milkyu.official"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "rgba(255,255,255,0.45)", textDecoration: "none",
                fontSize: "0.8rem", fontWeight: 500, transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e6683c")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              Instagram
            </a>
          </div>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>© 2026 Milkyu Official.</p>
        </div>
      </footer>

      {/* ── MASCOT ── */}
      <MilkyuMascot />
    </div>
  );
}
