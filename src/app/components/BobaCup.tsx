const FLAVOR_IMAGES: Record<string, string> = {
  chocolate: "images/choco.png",
  matcha:    "images/matcha.png",
  strawberry:"images/strawberry.png",
};

interface BobaCupProps {
  flavor: "choco" | "matcha" | "strawberry";
  title: string;
  description: string;
}

export function BobaCup({ flavor, title, description }: BobaCupProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <img
        src={FLAVOR_IMAGES[flavor]}
        alt={title}
        style={{ width: "100%", maxWidth: "clamp(160px, 55vw, 240px)", aspectRatio: "260/420", objectFit: "contain" }}
      />
      <div className="hidden md:block" style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "0.5rem" }}>{title}</h3>
        <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.5 }}>{description}</p>
      </div>
    </div>
  );
}