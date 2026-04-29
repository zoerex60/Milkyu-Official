// app/api/checkout/route.ts
// Next.js App Router API Route — letakkan di: app/api/checkout/route.ts
// Tambahkan DISCORD_WEBHOOK_URL di Vercel → Settings → Environment Variables

import { NextRequest, NextResponse } from "next/server";

// ─── Tipe Data ────────────────────────────────────────────────────────────────

export interface OrderItem {
  name: string;       // Nama produk, e.g. "Boba Matcha"
  quantity: number;   // Jumlah
  price: number;      // Harga satuan (IDR)
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
            ? [
                {
                  name: "📝 Catatan",
                  value: payload.note,
                  inline: false,
                },
              ]
            : []),
        ],
        footer: {
          text: "MilkyuShop · Pesanan via Website",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Ambil webhook URL dari env — jangan pernah hardcode
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[Checkout API] DISCORD_WEBHOOK_URL tidak ditemukan di environment.");
    return NextResponse.json(
      { success: false, message: "Server configuration error." },
      { status: 500 }
    );
  }

  // 2. Parse body request
  let payload: OrderPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Request body tidak valid." },
      { status: 400 }
    );
  }

  // 3. Validasi field wajib
  if (!payload.buyerName?.trim() || !Array.isArray(payload.items) || payload.items.length === 0) {
    return NextResponse.json(
      { success: false, message: "Data pesanan tidak lengkap (buyerName & items wajib diisi)." },
      { status: 422 }
    );
  }

  // 4. Hitung total
  const total = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 5. Kirim ke Discord Webhook
  const discordRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildDiscordEmbed(payload, total)),
  });

  if (!discordRes.ok) {
    const errText = await discordRes.text();
    console.error("[Checkout API] Discord webhook gagal:", errText);
    return NextResponse.json(
      { success: false, message: "Gagal mengirim notifikasi. Coba lagi." },
      { status: 502 }
    );
  }

  // 6. Kembalikan total agar frontend bisa langsung pakai untuk WA link
  return NextResponse.json({ success: true, total }, { status: 200 });
}
