import { useState, useEffect, useRef } from "react";

// ─── Sound & Music files ─────────────────────────────────────────────
// Letakkan file di folder /public/sounds/ :
//   /public/sounds/bgmusic.mp3  → background music (loop)
//   /public/sounds/segar.mp3   → milestone 10 milkyu
//   /public/sounds/krek.mp3    → milestone 10 cookies
//   /public/sounds/bomb.mp3    → kena bomb (opsional, fallback ke krek)
// ─────────────────────────────────────────────────────────────────────

const GAME_H       = typeof window !== "undefined" && window.innerWidth < 480 ? Math.min(360, window.innerHeight - 180) : 520;
const CATCHER_W    = 82;
const CATCHER_H    = 107;
const ITEM_W       = 46;
const ITEM_H       = 46;
const BASE_SPEED      = 2.4;
const CATCHER_SPD_BASE = 7;   // kecepatan awal sapi
const CATCHER_SPD_MAX  = 14;  // batas atas kecepatan sapi
const SPAWN_BASE   = 1400; // ms
const TOTAL_LIVES  = 5;
const BOMB_CHANCE  = 0.12; // 12% chance setiap spawn

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: "milkyu" | "cookie" | "bomb";
  speed: number;
  spin: number;
}

interface PopEffect {
  id: number;
  x: number;
  y: number;
  type: "milkyu" | "cookie" | "bomb";
}

// ─────────────────────────────────────────────────────────────────────
//  Audio pool helper — hindari suara tabrakan/overlap
// ─────────────────────────────────────────────────────────────────────
function createPool(src: string, size = 4): HTMLAudioElement[] {
  return Array.from({ length: size }, () => {
    const a = new Audio(src);
    a.volume = 0.7;
    return a;
  });
}

function playFromPool(pool: HTMLAudioElement[]) {
  // Cari instance yang sudah selesai/idle
  const free = pool.find(a => a.paused || a.ended);
  const audio = free ?? pool[0]; // fallback ke index 0 jika semua aktif
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// ─────────────────────────────────────────────────────────────────────
//  Male mascot SVG
// ─────────────────────────────────────────────────────────────────────
function MaleMascotSVG({ dir = 0, flash = false }: { dir: number; flash?: boolean }) {
  const px = Math.round(dir * 3.5);
  return (
    <svg
      width={CATCHER_W}
      height={CATCHER_H}
      viewBox="0 0 130 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: flash ? "drop-shadow(0 0 8px red)" : undefined, transition: "filter 0.1s" }}
    >
      <ellipse cx="65" cy="165" rx="30" ry="5" fill="rgba(0,0,0,0.09)" />
      {/* Tail */}
      <path d="M90 118 Q108 124 110 138 Q112 150 103 156" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="102" cy="158" rx="7" ry="5.5" fill="#1a1a1a" />
      {/* Body */}
      <ellipse cx="65" cy="122" rx="40" ry="42" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="78" cy="108" rx="14" ry="11" fill="#1a1a1a" opacity="0.82" />
      <ellipse cx="42" cy="130" rx="8" ry="6" fill="#1a1a1a" opacity="0.72" />
      <ellipse cx="80" cy="138" rx="6" ry="5" fill="#1a1a1a" opacity="0.55" />
      {/* Milk bottle */}
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
      {/* Feet */}
      <rect x="43" y="157" width="17" height="12" rx="8" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="70" y="157" width="17" height="12" rx="8" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="43" y="165" width="17" height="5" rx="3.5" fill="#1a1a1a" />
      <rect x="70" y="165" width="17" height="5" rx="3.5" fill="#1a1a1a" />
      {/* Arms */}
      <ellipse cx="25" cy="118" rx="10" ry="15" transform="rotate(15 25 118)" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="22" cy="131" rx="7" ry="4.5" fill="#1a1a1a" />
      <ellipse cx="104" cy="105" rx="10" ry="15" transform="rotate(-38 104 105)" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="98" cy="85" rx="7" ry="4.5" fill="#1a1a1a" transform="rotate(-38 111 93)" />
      {/* Neck */}
      <rect x="52" y="74" width="26" height="20" rx="10" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2.2" />
      {/* Head */}
      <ellipse cx="65" cy="48" rx="36" ry="34" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="52" cy="34" rx="13" ry="10" fill="#1a1a1a" opacity="0.8" />
      {/* Ears */}
      <path d="M46 17 L47 -8 L50 16 Z" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M84 17 L83 -8 L80 16 Z" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="18" cy="37" rx="13" ry="8" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="112" cy="37" rx="13" ry="8" fill="#f9f5ec" stroke="#1a1a1a" strokeWidth="2" />
      {/* Snout */}
      <ellipse cx="65" cy="60" rx="20" ry="14" fill="#ffd6c8" stroke="#1a1a1a" strokeWidth="1.8" />
      <ellipse cx="57" cy="61" rx="4" ry="3.2" fill="#1a1a1a" opacity="0.42" />
      <ellipse cx="73" cy="61" rx="4" ry="3.2" fill="#1a1a1a" opacity="0.42" />
      <path d="M55 68 Q65 77 75 68" stroke="#c9897a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <ellipse cx="48" cy="43" rx="8.5" ry="9.5" fill="#1a1a1a" />
      <ellipse cx="82" cy="43" rx="8.5" ry="9.5" fill="#1a1a1a" />
      <circle cx={48 + px} cy="43" r="3.8" fill="#fff" />
      <circle cx={82 + px} cy="43" r="3.8" fill="#fff" />
      <circle cx={48 + px + 1.2} cy="41.8" r="1.2" fill="rgba(255,255,255,0.8)" />
      <circle cx={82 + px + 1.2} cy="41.8" r="1.2" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  Falling items
// ─────────────────────────────────────────────────────────────────────
function FallingMilkyuSVG() {
  return (
    <img
      src="/milkyu-logo.png"
      alt="Milkyu"
      style={{ width: ITEM_W, height: ITEM_H, objectFit: "contain", display: "block" }}
    />
  );
}

function FallingCookieSVG() {
  return (
    <svg width={ITEM_W - 4} height={ITEM_H - 4} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#c8a46e" stroke="#8B5E3C" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="15.5" fill="#d4b483" />
      <path d="M18 8 Q20 13 19 18" stroke="#a07840" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M26 12 Q24 17 26 22" stroke="#a07840" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.6" />
      <ellipse cx="13" cy="15" rx="3.2" ry="2.5" fill="#5c3a1e" />
      <ellipse cx="24" cy="12" rx="2.6" ry="2.1" fill="#5c3a1e" />
      <ellipse cx="15" cy="25" rx="2.6" ry="2.1" fill="#5c3a1e" />
      <ellipse cx="26" cy="24" rx="3.2" ry="2.5" fill="#5c3a1e" />
      <ellipse cx="20" cy="18" rx="2.2" ry="1.8" fill="#5c3a1e" />
      <ellipse cx="11" cy="26" rx="2" ry="1.6" fill="#5c3a1e" />
      <ellipse cx="12" cy="10" rx="4" ry="2" fill="white" opacity="0.18" transform="rotate(-20 12 10)" />
    </svg>
  );
}

function FallingBombSVG() {
  return (
    <svg width={ITEM_W} height={ITEM_H} viewBox="0 0 46 46" fill="none">
      {/* Shadow */}
      <ellipse cx="23" cy="43" rx="10" ry="3" fill="rgba(0,0,0,0.18)" />
      {/* Body */}
      <circle cx="23" cy="28" r="16" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
      {/* Shine */}
      <ellipse cx="17" cy="22" rx="4" ry="2.5" fill="white" opacity="0.18" transform="rotate(-30 17 22)" />
      {/* Stem */}
      <rect x="20" y="10" width="6" height="7" rx="2" fill="#555" />
      {/* Fuse */}
      <path d="M23 10 Q30 4 36 8" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Fuse spark */}
      <circle cx="36.5" cy="7.5" r="2.5" fill="#fde68a" />
      <circle cx="36.5" cy="7.5" r="1.2" fill="#fff" />
      {/* Warning stripe */}
      <text x="23" y="33" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ef4444" fontFamily="Georgia, serif">!</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  Background clouds (static SVG)
// ─────────────────────────────────────────────────────────────────────
function SkyBG({ w }: { w: number }) {
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      viewBox="0 0 600 520"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8d8f8" />
          <stop offset="60%" stopColor="#daeeff" />
          <stop offset="100%" stopColor="#edf8e4" />
        </linearGradient>
      </defs>
      <rect width="600" height="520" fill="url(#sky)" />
      <g opacity="0.88">
        <ellipse cx="80"  cy="65" rx="58" ry="24" fill="white" />
        <ellipse cx="112" cy="52" rx="38" ry="22" fill="white" />
        <ellipse cx="50"  cy="60" rx="28" ry="16" fill="white" />
      </g>
      <g opacity="0.75">
        <ellipse cx="360" cy="95" rx="68" ry="26" fill="white" />
        <ellipse cx="400" cy="80" rx="44" ry="22" fill="white" />
        <ellipse cx="330" cy="90" rx="30" ry="16" fill="white" />
      </g>
      <g opacity="0.6">
        <ellipse cx="510" cy="45" rx="52" ry="20" fill="white" />
        <ellipse cx="545" cy="34" rx="34" ry="17" fill="white" />
      </g>
      <g opacity="0.5">
        <ellipse cx="220" cy="140" rx="44" ry="18" fill="white" />
        <ellipse cx="250" cy="128" rx="28" ry="14" fill="white" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  Main Game Component
// ─────────────────────────────────────────────────────────────────────
export function CatchGame() {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Game state (React state → for rendering) ──
  const [gameW, setGameW]             = useState(0);
  const [catcherX, setCatcherX]       = useState(0);
  const [moveDir, setMoveDir]         = useState(0);
  const [items, setItems]             = useState<FallingItem[]>([]);
  const [effects, setEffects]         = useState<PopEffect[]>([]);
  const [milkyuCount, setMilkyuCount] = useState(0);
  const [cookieCount, setCookieCount] = useState(0);
  const [score, setScore]             = useState(0);
  const [lives, setLives]             = useState(TOTAL_LIVES);
  const [started, setStarted]         = useState(false);
  const [gameOver, setGameOver]       = useState(false);
  const [milestone, setMilestone]     = useState<string | null>(null);
  const [flashRed, setFlashRed]       = useState(false); // screen flash kena bomb
  const [catcherFlash, setCatcherFlash] = useState(false);

  // ── Refs (used inside rAF loop — no stale closure) ──
  const gameWRef      = useRef(0);
  const catcherXRef   = useRef(0);
  const moveDirRef    = useRef(0);
  const itemsRef      = useRef<FallingItem[]>([]);
  const milkyuRef     = useRef(0);
  const cookieRef     = useRef(0);
  const scoreRef      = useRef(0);
  const livesRef      = useRef(TOTAL_LIVES);
  const startedRef    = useRef(false);
  const gameOverRef   = useRef(false);
  const keysRef       = useRef(new Set<string>());
  const frameRef      = useRef(0);
  const lastSpawnRef  = useRef(0);
  const nextIdRef     = useRef(0);
  const effectsRef    = useRef<PopEffect[]>([]);

  // ── Audio ──
  // Pools: 4 instance per sound → tidak tabrakan ketika catch banyak sekaligus
  const segarPool = useRef<HTMLAudioElement[]>([]);
  const krekPool  = useRef<HTMLAudioElement[]>([]);
  const bombPool  = useRef<HTMLAudioElement[]>([]);
  const bgMusic   = useRef<HTMLAudioElement | null>(null);
  // Flag: hanya 1 suara milestone per frame/batch
  const mileSoundCooldown = useRef(false);

  useEffect(() => {
    segarPool.current = createPool("/sounds/segar.mp3", 4);
    krekPool.current  = createPool("/sounds/krek.mp3",  4);
    // bomb.mp3 opsional — fallback ke krek kalau tidak ada
    bombPool.current  = createPool("/sounds/bomb.mp3",  4);

    // Background music — dual-guard loop (loop=true + ended handler backup)
    const bg = new Audio("/sounds/bgmusic.mp3");
    bg.loop   = true;
    bg.volume = 0.35;
    // Backup: beberapa browser mobile ada micro-gap di loop=true
    const onEnded = () => {
      bg.currentTime = 0;
      if (startedRef.current && !gameOverRef.current) {
        bg.play().catch(() => {});
      }
    };
    bg.addEventListener("ended", onEnded);
    bgMusic.current = bg;

    // Resume musik kalau tab kembali aktif (browser pause audio saat tab hidden)
    const onVisible = () => {
      if (startedRef.current && !gameOverRef.current && bg.paused) {
        bg.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      bg.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisible);
      bg.pause();
    };
  }, []);

  // ── Measure container ──
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      gameWRef.current = w;
      setGameW(w);
      if (!startedRef.current) {
        catcherXRef.current = w / 2 - CATCHER_W / 2;
        setCatcherX(catcherXRef.current);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ── Keyboard ──
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowLeft","ArrowRight","a","d","A","D"].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup",   up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup",   up);
    };
  }, []);

  // ── Reset & start ──
  const startGame = () => {
    itemsRef.current    = [];
    milkyuRef.current   = 0;
    cookieRef.current   = 0;
    scoreRef.current    = 0;
    livesRef.current    = TOTAL_LIVES;
    gameOverRef.current = false;
    startedRef.current  = true;
    lastSpawnRef.current = 0;
    nextIdRef.current   = 0;
    effectsRef.current  = [];
    mileSoundCooldown.current = false;

    const cx = gameWRef.current / 2 - CATCHER_W / 2;
    catcherXRef.current = cx;

    setItems([]);
    setEffects([]);
    setMilkyuCount(0);
    setCookieCount(0);
    setScore(0);
    setLives(TOTAL_LIVES);
    setCatcherX(cx);
    setMoveDir(0);
    setStarted(true);
    setGameOver(false);
    setMilestone(null);
    setFlashRed(false);
    setCatcherFlash(false);

    // Mulai background music
    if (bgMusic.current) {
      bgMusic.current.currentTime = 0;
      bgMusic.current.play().catch(() => {});
    }
  };

  // ── Main rAF loop ──
  useEffect(() => {
    const CATCH_Y = GAME_H - CATCHER_H - 18;

    const loop = (time: number) => {
      frameRef.current = requestAnimationFrame(loop);
      if (!startedRef.current || gameOverRef.current) return;

      // ── Move catcher + SCREEN WRAP ──
      const goLeft  = keysRef.current.has("ArrowLeft")  || keysRef.current.has("a") || keysRef.current.has("A");
      const goRight = keysRef.current.has("ArrowRight") || keysRef.current.has("d") || keysRef.current.has("D");
      let nx = catcherXRef.current;

      // Sapi makin cepet seiring score naik (tiap +100 score, +0.6 speed, max CATCHER_SPD_MAX)
      const diffMult      = Math.floor(scoreRef.current / 60);
      const catcherSpeed  = Math.min(CATCHER_SPD_MAX, CATCHER_SPD_BASE + Math.floor(scoreRef.current / 100) * 0.6);

      if (goLeft)  nx -= catcherSpeed;
      if (goRight) nx += catcherSpeed;

      // Wrap: keluar kanan → muncul kiri, keluar kiri → muncul kanan
      if (nx > gameWRef.current)   nx = -CATCHER_W;
      if (nx < -CATCHER_W)         nx =  gameWRef.current;

      const dir = goLeft ? -1 : goRight ? 1 : 0;
      if (nx !== catcherXRef.current || dir !== moveDirRef.current) {
        catcherXRef.current = nx;
        moveDirRef.current  = dir;
        setCatcherX(nx);
        setMoveDir(dir);
      }

      // ── Spawn ──
      const spawnDelay = Math.max(500, SPAWN_BASE - diffMult * 80);
      if (time - lastSpawnRef.current > spawnDelay) {
        lastSpawnRef.current = time;

        // Tentukan tipe: 12% bomb, sisanya milkyu/cookie
        let type: FallingItem["type"];
        const r = Math.random();
        if (r < BOMB_CHANCE) {
          type = "bomb";
        } else {
          type = (r - BOMB_CHANCE) / (1 - BOMB_CHANCE) < 0.55 ? "milkyu" : "cookie";
        }

        const speed = BASE_SPEED + diffMult * 0.3 + Math.random() * 1.4;
        const x     = Math.random() * Math.max(0, gameWRef.current - ITEM_W);
        itemsRef.current = [
          ...itemsRef.current,
          { id: nextIdRef.current++, x, y: -ITEM_H, type, speed, spin: Math.random() * 360 },
        ];
      }

      // ── Update items ──
      const cx       = catcherXRef.current;
      const catcherCX = cx + CATCHER_W / 2;
      const newItems: FallingItem[] = [];
      const caught:   FallingItem[] = [];
      let   missed = 0;

      for (const item of itemsRef.current) {
        const ny  = item.y + item.speed;
        const icx = item.x + ITEM_W / 2;

        if (
          ny + ITEM_H >= CATCH_Y - 4 &&
          ny <= CATCH_Y + CATCHER_H * 0.35 &&
          Math.abs(icx - catcherCX) < CATCHER_W * 0.62
        ) {
          caught.push({ ...item, y: ny });
          continue;
        }

        // Bomb yang miss → tidak kena penalti (hanya hilang)
        if (ny > GAME_H + ITEM_H) {
          if (item.type !== "bomb") missed++;
          continue;
        }

        newItems.push({ ...item, y: ny, spin: item.spin + item.speed * 2.2 });
      }
      itemsRef.current = newItems;
      setItems([...newItems]);

      // ── Handle caught ──
      if (caught.length > 0) {
        let nm = milkyuRef.current;
        let nc = cookieRef.current;
        let ns = scoreRef.current;
        const newEffects: PopEffect[] = [];

        // Flag: hanya 1 milestone sound per batch caught
        let triggeredMilkyu = false;
        let triggeredCookie  = false;
        let hitBomb = false;

        for (const item of caught) {
          newEffects.push({
            id: item.id * 100 + (Date.now() % 1000),
            x: item.x,
            y: CATCH_Y - 16,
            type: item.type,
          });

          if (item.type === "bomb") {
            // Kena bomb → kurangi nyawa
            hitBomb = true;
          } else if (item.type === "milkyu") {
            ns += 10;
            nm++;
            if (nm % 10 === 0) triggeredMilkyu = true;
          } else {
            ns += 15;
            nc++;
            if (nc % 10 === 0) triggeredCookie = true;
          }
        }

        // ── Play sounds — satu per batch (anti-tabrakan) ──
        if (hitBomb) {
          playFromPool(bombPool.current);
        }
        if (triggeredMilkyu && !mileSoundCooldown.current) {
          mileSoundCooldown.current = true;
          playFromPool(segarPool.current);
          setMilestone("🌟 Seger banget! +10 Milkyu!");
          setTimeout(() => {
            setMilestone(null);
            mileSoundCooldown.current = false;
          }, 2000);
        } else if (triggeredCookie && !mileSoundCooldown.current) {
          mileSoundCooldown.current = true;
          playFromPool(krekPool.current);
          setMilestone("🍪 Krek krek! +10 Cookies!");
          setTimeout(() => {
            setMilestone(null);
            mileSoundCooldown.current = false;
          }, 2000);
        }

        // ── Bomb effect: flash screen + mascot ──
        if (hitBomb) {
          livesRef.current = Math.max(0, livesRef.current - 1);
          setLives(livesRef.current);
          setFlashRed(true);
          setCatcherFlash(true);
          setTimeout(() => {
            setFlashRed(false);
            setCatcherFlash(false);
          }, 400);

          if (livesRef.current <= 0) {
            gameOverRef.current = true;
            startedRef.current  = false;
            setGameOver(true);
            setStarted(false);
            bgMusic.current?.pause();
          }
        }

        milkyuRef.current = nm;
        cookieRef.current = nc;
        scoreRef.current  = ns;
        setMilkyuCount(nm);
        setCookieCount(nc);
        setScore(ns);

        effectsRef.current = [...effectsRef.current, ...newEffects];
        setEffects([...effectsRef.current]);
        const ids = newEffects.map(e => e.id);
        setTimeout(() => {
          effectsRef.current = effectsRef.current.filter(e => !ids.includes(e.id));
          setEffects([...effectsRef.current]);
        }, 750);
      }

      // ── Handle missed (non-bomb) ──
      if (missed > 0) {
        livesRef.current = Math.max(0, livesRef.current - missed);
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          gameOverRef.current = true;
          startedRef.current  = false;
          setGameOver(true);
          setStarted(false);
          bgMusic.current?.pause();
        }
      }
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // ── Touch drag ──
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    touchStartX.current = e.touches[0].clientX;
    let nx = catcherXRef.current + dx;
    // Wrap untuk touch juga
    if (nx > gameWRef.current)  nx = -CATCHER_W;
    if (nx < -CATCHER_W)        nx =  gameWRef.current;
    catcherXRef.current = nx;
    setCatcherX(nx);
    setMoveDir(dx < 0 ? -1 : dx > 0 ? 1 : 0);
  };

  const CATCH_Y = GAME_H - CATCHER_H - 18;

  return (
    <div style={{ fontFamily: "'Georgia', serif", maxWidth: 700, margin: "0 auto" }}>

      {/* ── HUD ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 18px",
        background: "#f9f5ec",
        border: "2.5px solid #1a1a1a",
        borderRadius: "14px 14px 0 0",
        flexWrap: "wrap",
        gap: 6,
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: 800 }}>🥛 {milkyuCount}</span>
          <span style={{ fontSize: "0.88rem", fontWeight: 800 }}>🍪 {cookieCount}</span>
          <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#ef4444" }}>💣 jangan di tangkep!</span>
        </div>
        <span style={{ fontSize: "1rem", fontWeight: 900, color: "#1a1a1a", letterSpacing: 1 }}>
          {score.toString().padStart(5, "0")}
        </span>
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: TOTAL_LIVES }).map((_, i) => (
            <span key={i} style={{ fontSize: "1rem", opacity: i < lives ? 1 : 0.15, transition: "opacity 0.3s" }}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* ── Game Area ── */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: GAME_H,
          overflow: "hidden",
          border: "2.5px solid #1a1a1a",
          borderTop: "none",
          cursor: "none",
          touchAction: "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Red flash overlay — kena bomb */}
        {flashRed && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(239,68,68,0.35)",
            zIndex: 15,
            pointerEvents: "none",
            animation: "flashOverlay 0.4s ease-out forwards",
          }} />
        )}

        {/* Sky */}
        <SkyBG w={gameW} />

        {/* Ground */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 22,
          background: "#7cb342",
          borderTop: "2.5px solid #558B2F",
          zIndex: 1,
        }} />

        {/* Falling items */}
        {items.map(item => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              transform: `rotate(${item.spin}deg)`,
              transformOrigin: "center",
              zIndex: 2,
            }}
          >
            {item.type === "milkyu" ? <FallingMilkyuSVG /> :
             item.type === "cookie" ? <FallingCookieSVG /> :
             <FallingBombSVG />}
          </div>
        ))}

        {/* Pop effects */}
        {effects.map(ef => (
          <div
            key={ef.id}
            style={{
              position: "absolute",
              left: ef.x + ITEM_W / 2 - 14,
              top: ef.y,
              fontSize: ef.type === "bomb" ? "2.2rem" : "1.6rem",
              pointerEvents: "none",
              zIndex: 5,
              animation: "catchPop 0.75s ease-out forwards",
            }}
          >
            {ef.type === "milkyu" ? "✨" : ef.type === "cookie" ? "💥" : "💣"}
          </div>
        ))}

        {/* Milestone banner */}
        {milestone && (
          <div style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a1a1a",
            color: "#f9f5ec",
            padding: "8px 20px",
            borderRadius: 40,
            fontWeight: 800,
            fontSize: "0.9rem",
            zIndex: 10,
            whiteSpace: "nowrap",
            animation: "mileSlidein 0.4s ease",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
          }}>
            {milestone}
          </div>
        )}

        {/* Male mascot catcher */}
        <div
          style={{
            position: "absolute",
            left: catcherX,
            top: CATCH_Y,
            width: CATCHER_W,
            height: CATCHER_H,
            zIndex: 3,
          }}
        >
          <MaleMascotSVG dir={moveDir} flash={catcherFlash} />
        </div>

        {/* ── Start overlay ── */}
        {!started && !gameOver && (
          <div style={overlayStyle}>
            <div style={cardStyle}>
              <div style={{ fontSize: "2.6rem", marginBottom: 6 }}>🐮</div>
              <h1 style={{ margin: "0 0 6px", fontWeight: 900, fontSize: "1rem", fontFamily: "Georgia, serif" }}>
                Gabut nunggu bartender kami?
              </h1>
              <h2 style={{ margin: "0 0 6px", fontWeight: 900, fontSize: "1.5rem", fontFamily: "Georgia, serif" }}>
                Catch the Milkyu!
              </h2>
              <p style={{ margin: "0 0 5px", color: "#555", fontSize: "0.84rem", lineHeight: 1.5 }}>
                Bantu Kyumoo menangkap 🥛 milkyu &amp; 🍪 cookies yang jatuh!
              </p>
              <p style={{ margin: "0 0 18px", color: "#888", fontSize: "0.78rem" }}>
                ← → / A D / geser layar &nbsp;|&nbsp; wrap ke sisi lain!
              </p>
              <button onClick={startGame} style={startBtnStyle}>Mulai! 🎮</button>
            </div>
          </div>
        )}

        {/* ── Game Over overlay ── */}
        {gameOver && (
          <div style={overlayStyle}>
            <div style={cardStyle}>
              <div style={{ fontSize: "2.8rem", marginBottom: 4 }}>😿</div>
              <h2 style={{ margin: "0 0 8px", fontWeight: 900, fontSize: "1.6rem", fontFamily: "Georgia, serif" }}>
                Game Over!
              </h2>
              <p style={{ margin: "0 0 4px", color: "#333", fontSize: "1rem", fontWeight: 700 }}>
                Score: {score}
              </p>
              <p style={{ margin: "0 0 18px", color: "#777", fontSize: "0.82rem" }}>
                🥛 {milkyuCount} milkyu &nbsp;|&nbsp; 🍪 {cookieCount} cookies
              </p>
              <button onClick={startGame} style={startBtnStyle}>Main Lagi 🎮</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Touch buttons ── */}
      <div style={{
        display: "flex",
        gap: 14,
        justifyContent: "center",
        padding: "12px 0",
        background: "#f9f5ec",
        border: "2.5px solid #1a1a1a",
        borderTop: "none",
        borderRadius: "0 0 14px 14px",
      }}>
        <button
          onPointerDown={() => keysRef.current.add("ArrowLeft")}
          onPointerUp={()   => keysRef.current.delete("ArrowLeft")}
          onPointerLeave={() => keysRef.current.delete("ArrowLeft")}
          style={ctrlBtnStyle}
        >
          ◀ Kiri
        </button>
        <button
          onPointerDown={() => keysRef.current.add("ArrowRight")}
          onPointerUp={()   => keysRef.current.delete("ArrowRight")}
          onPointerLeave={() => keysRef.current.delete("ArrowRight")}
          style={ctrlBtnStyle}
        >
          Kanan ▶
        </button>
      </div>

      <style>{`
        @keyframes catchPop {
          0%   { transform: scale(1)   translateY(0);     opacity: 1; }
          100% { transform: scale(2.2) translateY(-36px); opacity: 0; }
        }
        @keyframes mileSlidein {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes flashOverlay {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
//  Shared styles
// ─────────────────────────────────────────────────────────────────────
const overlayStyle: React.CSSProperties = {
  position: "absolute", inset: 0,
  background: "rgba(0,0,0,0.48)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 20,
};

const cardStyle: React.CSSProperties = {
  background: "#f9f5ec",
  border: "3px solid #1a1a1a",
  borderRadius: 20,
  padding: "28px 36px",
  textAlign: "center",
  maxWidth: 300,
};

const startBtnStyle: React.CSSProperties = {
  background: "#1a1a1a",
  color: "#f9f5ec",
  border: "none",
  borderRadius: 12,
  padding: "11px 28px",
  fontSize: "1rem",
  fontWeight: 800,
  cursor: "pointer",
  fontFamily: "Georgia, serif",
  letterSpacing: 0.5,
};

const ctrlBtnStyle: React.CSSProperties = {
  background: "#1a1a1a",
  color: "#f9f5ec",
  border: "none",
  borderRadius: 12,
  padding: "13px 30px",
  fontSize: "0.95rem",
  fontWeight: 800,
  cursor: "pointer",
  touchAction: "none",
  userSelect: "none",
  fontFamily: "Georgia, serif",
};
