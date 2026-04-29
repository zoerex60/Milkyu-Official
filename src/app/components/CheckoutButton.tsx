"use client";

// CheckoutButton.tsx
// Komponen tombol Checkout yang:
//   1. Fire-and-forget POST langsung ke Discord Webhook (no API route)
//   2. Redirect user ke WhatsApp dengan teks pesanan ter-encode

import { useState } from "react";

// ─── Konfigurasi ──────────────────────────────────────────────────────────────

/** Nomor WhatsApp toko (format internasional, tanpa +) */
const WHATSAPP_NUMBER = "6289518833985";

/**
 * Discord Webhook URL — paste langsung di sini.
 * Worst-case: hapus webhook lama & buat baru di Channel Settings → Integrations.
 */
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1498947049058603070/5kqgYzF3JvlIrp8xB0TpWrLD4AEDq88Tnto4InTAi2YUzRX2A23RlxLCZYFG7ENxlTbn";

// ─── Tipe Data ────────────────────────────────────────────────────────────────

export interface OrderItem {
  name: string;     // Nama produk, e.g. "Boba Matcha"
  quantity: number; // Jumlah
  price: number;    // Harga satuan (IDR)
}

export interface OrderPayload {
  buyerName: string;  // Nama pembeli
  items: OrderItem[];
  note?: string;      // Catatan opsional dari pembeli
}

// ─── Helper: Format Rupiah ────────────────────────────────────────────────────

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── Helper: Buat Discord Embed ───────────────────────────────────────────────

function buildDiscordEmbed(payload: OrderPayload, total: number) {
  const timestamp = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemLines = payload.items
    .map((item) => {
      const subtotal = item.price * item.quantity;
      return `> **${item.name}** × ${item.quantity}\n> ↳ ${formatRupiah(item.price)} × ${item.quantity} = **${formatRupiah(subtotal)}**`;
    })
    .join("\n\n");

  return {
    embeds: [
      {
        title: "🛍️ Pesanan Baru Masuk!",
        color: 0x25d366, // Hijau WhatsApp
        fields: [
          {
            name: "👤 Nama Pembeli",
            value: payload.buyerName,
            inline: true,
          },
          {
            name: "🕐 Waktu",
            value: timestamp,
            inline: true,
          },
          {
            name: "📦 Detail Pesanan",
            value: itemLines || "_Tidak ada item_",
            inline: false,
          },
          {
            name: "💰 Total Harga",
            value: `**${formatRupiah(total)}**`,
            inline: false,
          },
          ...(payload.note
            ? [{ name: "📝 Catatan", value: payload.note, inline: false }]
            : []),
        ],
        footer: { text: "MilkyuShop · Pesanan via Website" },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

// ─── Helper: Buat Teks WhatsApp ───────────────────────────────────────────────

function buildWhatsAppText(payload: OrderPayload, total: number): string {
  const itemLines = payload.items
    .map(
      (item) =>
        `• ${item.name} × ${item.quantity} = ${formatRupiah(item.price * item.quantity)}`
    )
    .join("\n");

  return [
    "Halo Milkyu! Saya ingin memesan:",
    "",
    `👤 Nama  : ${payload.buyerName}`,
    "",
    "📦 Detail Pesanan:",
    itemLines,
    "",
    `💰 Total : ${formatRupiah(total)}`,
    ...(payload.note ? ["", `📝 Catatan: ${payload.note}`] : []),
    "",
    "Mohon konfirmasi pesanan saya ya, terima kasih! 🙏",
  ].join("\n");
}

// ─── Helper: Buka WhatsApp ────────────────────────────────────────────────────

function redirectToWhatsApp(payload: OrderPayload, total: number): void {
  const encoded = encodeURIComponent(buildWhatsAppText(payload, total));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
}

// ─── Props & Komponen Utama ───────────────────────────────────────────────────

interface CheckoutButtonProps {
  order: OrderPayload;
  disabled?: boolean;
  onSuccess?: (total: number) => void;
}

export function CheckoutButton({ order, disabled = false, onSuccess }: CheckoutButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckout = async () => {
    if (!order.buyerName.trim() || order.items.length === 0) {
      setStatus("error");
      setErrorMsg("Nama dan item pesanan wajib diisi.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

    // Fire-and-forget — kalau Discord gagal, user tetap lanjut ke WA
    fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildDiscordEmbed(order, total)),
    }).catch(() => {
      // Abaikan error jaringan — notifikasi Discord bersifat opsional
    });

    setStatus("success");
    onSuccess?.(total);
    redirectToWhatsApp(order, total);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  const isLoading = status === "loading";
  const isDisabled = disabled || isLoading;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
      <button
        onClick={handleCheckout}
        disabled={isDisabled}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
          padding: "0.85rem 1.5rem",
          background: isDisabled ? "#ccc" : "#25D366",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: isDisabled ? "not-allowed" : "pointer",
          transition: "background 0.2s, transform 0.15s, opacity 0.2s",
          opacity: isDisabled ? 0.6 : 1,
          boxShadow: isDisabled ? "none" : "0 4px 14px rgba(37,211,102,0.35)",
        }}
        onMouseEnter={(e) => { if (!isDisabled) e.currentTarget.style.background = "#1ebe5d"; }}
        onMouseLeave={(e) => { if (!isDisabled) e.currentTarget.style.background = "#25D366"; }}
        onMouseDown={(e)  => { if (!isDisabled) e.currentTarget.style.transform = "scale(0.97)"; }}
        onMouseUp={(e)    => { if (!isDisabled) e.currentTarget.style.transform = "scale(1)"; }}
      >
        {/* Ikon WhatsApp */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {isLoading ? (
          <><Spinner />Memproses pesanan…</>
        ) : status === "success" ? (
          "✅ Pesanan Terkirim!"
        ) : (
          "Pesan via WhatsApp"
        )}
      </button>

      {status === "error" && errorMsg && (
        <p style={{ fontSize: "0.8rem", color: "#e53e3e", textAlign: "center", margin: 0 }}>
          ⚠️ {errorMsg}
        </p>
      )}

      {status === "idle" && (
        <p style={{ fontSize: "0.75rem", color: "#aaa", textAlign: "center", margin: 0 }}>
          Notifikasi otomatis dikirim ke admin 🔔
        </p>
      )}
    </div>
  );
}

// ─── Sub-komponen: Spinner ────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
