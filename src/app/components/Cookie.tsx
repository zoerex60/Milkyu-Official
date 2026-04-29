interface CookieProps {
  title: string;
  description: string;
  variant?: "original" | "red-velvet";
}

export function Cookie({ title, description }: CookieProps) {
  return (
    <div
      className="flex flex-col items-center gap-6"
      style={{ width: "100%", maxWidth: "260px", margin: "0 auto" }}
    >
      <img
        src="images/cookies.png"
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

export function CookieCarousel() {
  return (
    <Cookie
      variant="red-velvet"
      title="Red Velvet Cream Cheese"
      description="Cookie red velvet yang lembut dengan isian cream cheese berkualitas."
    />
  );
}
