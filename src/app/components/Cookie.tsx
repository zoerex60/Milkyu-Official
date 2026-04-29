import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface CookieProps {
  title: string;
  description: string;
  variant?: "cheese" | "whitechoc";
}

export function Cookie({ title, description, variant = "cheese" }: CookieProps) {
  const imgSrc = variant === "whitechoc" ? "images/whitechoc.png" : "images/cheese.png";

  return (
    <div
      className="flex flex-col items-center gap-6"
      style={{ width: "100%", maxWidth: "260px", margin: "0 auto" }}
    >
      <img
        src={imgSrc}
        alt={title}
        style={{ width: "100%", height: "auto", display: "block" }}
      />
      <div className="text-center w-full">
        <h3
          className="mb-1"
          style={{
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
      </div>
    </div>
  );
}

const COOKIE_VARIANTS = [
  {
    variant: "cheese" as const,
    title: "Red Velvet Cream Cheese",
    description: "Cookie red velvet yang lembut dengan isian cream cheese berkualitas.",
  },
  {
    variant: "whitechoc" as const,
    title: "Red Velvet White Chocolate",
    description: "Cookie red velvet yang lembut dengan isian white chocolate yang menonjol di sisi cookies.",
  },
];

export function CookieCarousel() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(0);

  const go = (next: number) => {
    setDir(next > active ? 1 : -1);
    setActive(next);
  };

  const prev = () => go(active === 0 ? COOKIE_VARIANTS.length - 1 : active - 1);
  const next = () => go(active === COOKIE_VARIANTS.length - 1 ? 0 : active + 1);

  const c = COOKIE_VARIANTS[active];

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
        <div style={{ overflow: "hidden", width: "100%", maxWidth: "240px", display: "flex", justifyContent: "center" }}>
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
              <Cookie variant={c.variant} title={c.title} description={c.description} />
            </motion.div>
          </AnimatePresence>
        </div>
        <button onClick={next} style={{ ...navBtn, right: 0 }}>›</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: "0.5rem" }}>
        {COOKIE_VARIANTS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === active ? 24 : 8, height: 8,
              borderRadius: 999,
              background: i === active ? "#8b1515" : "rgba(0,0,0,0.14)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
