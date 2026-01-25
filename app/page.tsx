"use client";
import { useState, useEffect } from "react";
import { frases } from "./frases";

/* =========================
   CONFIGURACIÓN
========================= */

const secciones = [
  { icon: "👻", titulo: "Miedos" },
  { icon: "🍎", titulo: "Alimentación" },
  { icon: "💰", titulo: "Ahorro" },
  { icon: "🧾", titulo: "Gasto H." },
  { icon: "📚", titulo: "Aprendizaje" },
  { icon: "❤️", titulo: "Mis valores" },
  { icon: "🎭", titulo: "Doble ánimo" },
  { icon: "✝️", titulo: "Nivel de fe" },
  { icon: "⚡", titulo: "Pensamientos" },
  { icon: "🎯", titulo: "Motivación" }
];

const opciones = [
  { label: "Bajo", icon: "👎🏻" },
  { label: "Ok", icon: "👌🏻" },
  { label: "Super", icon: "👍🏻" }
];

const ejercicios = ["Pecho", "Espalda", "Pierna", "Bíceps", "Tríceps", "Brazos"];
const plannerDias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function iconoPorValor(v) {
  if (v === "Bajo") return "👎🏻";
  if (v === "Ok") return "👌🏻";
  if (v === "Super") return "👍🏻";
  return "";
}

/* =========================
   APP
========================= */

export default function Home() {
  const [frase, setFrase] = useState("");
  const [vista, setVista] = useState("principal");
  const [abierta, setAbierta] = useState(null);
  const [valores, setValores] = useState({});
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const [gym, setGym] = useState({});
  const [historial, setHistorial] = useState([]);
  const [historialGym, setHistorialGym] = useState([]);
  const [detalleGym, setDetalleGym] = useState(null);
  const [resumenSemanal, setResumenSemanal] = useState({});

  const hoy = new Date();
  const fechaKey = hoy.toDateString();
  const fechaISO = hoy.toISOString().slice(0, 10);
  const fechaTexto = `${hoy.toLocaleDateString("es-ES", { weekday: "long" })} ${hoy.getDate()} / ${hoy.getFullYear()}`;

  useEffect(() => {
    const f = localStorage.getItem("frase_" + fechaKey);
    if (f) setFrase(f);
    else {
      const r = frases[Math.floor(Math.random() * frases.length)];
      localStorage.setItem("frase_" + fechaKey, r);
      setFrase(r);
    }

    cargarHistorial();
    cargarGymHistorial();
    calcularResumenSemanal();
  }, []);

  function cargarHistorial() {
    const dias = Object.keys(localStorage)
      .filter(k => k.startsWith("registro_"))
      .sort(
  (a, b) =>
    new Date(b.replace("registro_", "")).getTime() -
    new Date(a.replace("registro_", "")).getTime()
)

      .map(k => ({
        fecha: k.replace("registro_", ""),
        datos: JSON.parse(localStorage.getItem(k))
      }));

    setHistorial(dias);
  }

  function cargarGymHistorial() {
    const dias = Object.keys(localStorage)
      .filter(k => k.startsWith("gym_"))
      .sort()
      .reverse()
      .map(k => ({
        fecha: k.replace("gym_", ""),
        datos: JSON.parse(localStorage.getItem(k))
      }));

    setHistorialGym(dias);
  }

  function calcularResumenSemanal() {
    let resumen = {};
    ejercicios.forEach(e => (resumen[e] = 0));

    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1);
    inicioSemana.setHours(0, 0, 0, 0);

    Object.keys(localStorage)
      .filter(k => k.startsWith("gym_"))
      .forEach(k => {
        const fecha = new Date(k.replace("gym_", ""));
        if (fecha >= inicioSemana && fecha <= hoy) {
          const datos = JSON.parse(localStorage.getItem(k));
          plannerDias.forEach(dia => {
            ejercicios.forEach(e => {
              if (datos[dia]?.[e]) resumen[e]++;
            });
          });
        }
      });

    setResumenSemanal(resumen);
  }

  function guardarDatos() {
    localStorage.setItem("registro_" + fechaKey, JSON.stringify(valores));
    cargarHistorial();
    alert("Datos guardados");
    setMostrarResumen(false);
  }

  function toggleEjercicio(dia, ejercicio) {
    setGym(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [ejercicio]: !prev[dia]?.[ejercicio]
      }
    }));
  }

  function guardarGym() {
    localStorage.setItem("gym_" + fechaISO, JSON.stringify(gym));
    cargarGymHistorial();
    calcularResumenSemanal();
    alert("Gym guardado");
  }

  /* =========================
     VISTA PRINCIPAL
  ========================= */

  if (vista === "principal") {
    return (
      <main style={app}>
        <Barra texto={fechaTexto} />

        <div style={{ padding: 20 }}>
          <p style={fraseStyle}>“{frase}”</p>

          <div style={grid}>
            {secciones.map(s => (
              <Tarjeta
                key={s.titulo}
                {...s}
                valor={valores[s.titulo]}
                onClick={() => setAbierta(s.titulo)}
              />
            ))}
          </div>

          <button style={btn} onClick={() => setMostrarResumen(true)}>
            Generar resumen
          </button>

          <button style={btn} onClick={() => setVista("analisis")}>
            Análisis
          </button>

          <button style={btn} onClick={() => setVista("gym")}>
            Rutinas gym
          </button>
        </div>

        {abierta && (
          <Modal onClose={() => setAbierta(null)}>
            <h2>{abierta}</h2>
            <div style={{ display: "flex", gap: 10 }}>
              {opciones.map(o => (
                <button
                  key={o.label}
                  onClick={() => setValores({ ...valores, [abierta]: o.label })}
                  style={{
                    ...btn,
                    background: valores[abierta] === o.label ? "#ddd6fe" : "white"
                  }}
                >
                  <div style={{ fontSize: 36 }}>{o.icon}</div>
                  {o.label}
                </button>
              ))}
            </div>
          </Modal>
        )}

        {mostrarResumen && (
          <Modal onClose={() => setMostrarResumen(false)}>
            <strong>{fechaTexto}</strong>
            {secciones.map(s => (
              <div key={s.titulo} style={fila}>
                {s.icon} {s.titulo}
                <span>{iconoPorValor(valores[s.titulo])}</span>
              </div>
            ))}
            <button style={btnGuardar} onClick={guardarDatos}>
              Guardar datos
            </button>
          </Modal>
        )}
      </main>
    );
  }

  /* =========================
     ANÁLISIS
  ========================= */

  if (vista === "analisis") {
    return (
      <main style={app}>
        <Barra texto="Historial" />

        <div style={{ padding: 20 }}>
          <strong>Registro emocional</strong>

          {historial.map(d => (
            <div key={d.fecha} style={fila}>
              {d.fecha}
            </div>
          ))}

          <br />
          <strong>Gym (por día)</strong>

          {historialGym.map(d => (
            <div
              key={d.fecha}
              style={fila}
              onClick={() => setDetalleGym(d)}
            >
              {d.fecha}
            </div>
          ))}

          <br />
          <strong>Resumen semanal (gym)</strong>

          {ejercicios.map(e => (
            <div key={e} style={fila}>
              {e}
              <span>{resumenSemanal[e] || 0} días</span>
            </div>
          ))}

          <button style={btn} onClick={() => setVista("principal")}>
            Regresar
          </button>
        </div>

        {detalleGym && (
          <Modal onClose={() => setDetalleGym(null)}>
            <strong>{detalleGym.fecha}</strong>
            {plannerDias.map(dia => (
              <div key={dia}>
                <b>{dia}</b>
                {ejercicios
                  .filter(e => detalleGym.datos[dia]?.[e])
                  .map(e => (
                    <div key={e}>✔ {e}</div>
                  ))}
              </div>
            ))}
          </Modal>
        )}
      </main>
    );
  }

  /* =========================
     GYM
  ========================= */

  if (vista === "gym") {
    return (
      <main style={app}>
        <Barra texto="Rutinas Gym" />

        <div style={{ padding: 20 }}>
          <div style={plannerGrid}>
            {plannerDias.map(dia => (
              <div key={dia} style={plannerBoxGrande}>
                <div style={plannerHeaderGrande}>{dia}</div>

                <div style={ejerciciosGrid}>
                  {ejercicios.map(e => {
                    const activo = gym[dia]?.[e];
                    return (
                      <button
                        key={e}
                        onClick={() => toggleEjercicio(dia, e)}
                        style={{
                          ...ejercicioBtn,
                          background: activo ? "#bbf7d0" : "white"
                        }}
                      >
                        {e}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button style={btnGuardar} onClick={guardarGym}>
            Guardar entrenamiento
          </button>

          <button style={btn} onClick={() => setVista("principal")}>
            Regresar
          </button>
        </div>
      </main>
    );
  }

  return null;
}

/* =========================
   COMPONENTES / ESTILOS
========================= */

function Barra({ texto }) {
  return (
    <div style={{
      background: "#ddd6fe",
      padding: 12,
      textAlign: "center",
      fontWeight: 800
    }}>
      {texto}
    </div>
  );
}

function Tarjeta({ icon, titulo, valor, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: valor ? "#ddd6fe" : "white",
        padding: 14,
        borderRadius: 16,
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <div>{icon} {titulo}</div>
      {valor && <div style={{ fontSize: 28 }}>{iconoPorValor(valor)}</div>}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={modalBg}>
      <div onClick={e => e.stopPropagation()} style={modal}>
        {children}
      </div>
    </div>
  );
}

/* =========================
   ESTILOS
========================= */

const app = {
  maxWidth: 420,
  margin: "auto",
  minHeight: "100vh",
  background: "#f5f3ff",
  fontFamily: "Inter",
  color: "#1f2937"
};

const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const fraseStyle = { textAlign: "center", fontStyle: "italic", marginBottom: 20 };
const fila = { display: "flex", justifyContent: "space-between", padding: 10 };

const btn = {
  width: "100%",
  padding: 14,
  borderRadius: 16,
  background: "white",
  border: "2px solid #c7d2fe",
  marginTop: 12,
  fontWeight: 700
};

const btnGuardar = { ...btn, background: "#bbf7d0" };

const modalBg = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "white",
  borderRadius: 24,
  padding: 24,
  width: "90%",
  maxWidth: 360
};

/* =========================
   GYM ESTILOS
========================= */

const plannerGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14
};

const plannerBoxGrande = {
  background: "white",
  borderRadius: 16,
  padding: 12,
  border: "2px solid #c7d2fe"
};

const plannerHeaderGrande = {
  fontWeight: 800,
  marginBottom: 8,
  textAlign: "center"
};

const ejerciciosGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 6
};

const ejercicioBtn = {
  padding: 8,
  borderRadius: 12,
  border: "1px solid #c7d2fe",
  fontWeight: 600,
  fontSize: 14
};
