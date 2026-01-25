"use client";
import { useState } from "react";

export default function Medidor() {
  const [valor, setValor] = useState(2);

  const colores = ["#ef4444", "#f97316", "#facc15", "#38bdf8", "#84cc16"];
  const emojis = ["😡", "☹️", "😐", "🙂", "😄"];

  return (
    <div style={{ marginBottom: 24 }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8
      }}>
        {emojis.map((e, i) => (
          <div
            key={i}
            style={{
              fontSize: 28,
              opacity: valor === i ? 1 : 0.4,
              transform: valor === i ? "scale(1.15)" : "scale(1)",
              transition: "0.3s"
            }}
          >
            {e}
          </div>
        ))}
      </div>

      <input
        type="range"
        min="0"
        max="4"
        value={valor}
        onChange={(e) => setValor(Number(e.target.value))}
        style={{
          width: "100%",
          height: 10,
          borderRadius: 20,
          background: `linear-gradient(to right,
            ${colores[0]} 0%,
            ${colores[1]} 25%,
            ${colores[2]} 50%,
            ${colores[3]} 75%,
            ${colores[4]} 100%)`
        }}
      />
    </div>
  );
}
