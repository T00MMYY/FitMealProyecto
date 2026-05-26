import React, { Suspense, useState, useLayoutEffect, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const CONFIG_CALIBRACION = {
  masculino: {
    brazoX: 0.22,
    hombroY: 0.43,
    pechoY: 0.37,
    cinturaY: 0.05,
    rodillaY: -0.42,
  },
  femenino: {
    brazoX: 0.17,
    hombroY: 0.47,
    pechoY: 0.36,
    cinturaY: 0.09,
    rodillaY: -0.45,
  },
};

function Model({ url, onSelect, genero }) {
  const { scene } = useGLTF(url);
  const limites = CONFIG_CALIBRACION[genero];

  useLayoutEffect(() => {
    if (scene) {
      scene.traverse((obj) => {
        if (obj.isMesh && obj.material) {
          const applyMaterial = (mat) => {
            if (mat.color) mat.color.set("#E8BEAC");
            mat.roughness = 0.6;
            mat.vertexColors = false;
            mat.needsUpdate = true;
          };
          if (Array.isArray(obj.material)) obj.material.forEach(applyMaterial);
          else applyMaterial(obj.material);
        }
      });
    }
  }, [scene, url]);

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        e.stopPropagation();
        const { x, y, z } = e.point;
        const absX = Math.abs(x);
        let nombreParte = "CUERPO_GENERAL";
        const esFrontal = z > -0.05;

        if (absX > limites.brazoX) {
          if (y > limites.hombroY) {
            nombreParte = "HOMBROS";
          } else if (y > 0.28) {
            nombreParte = esFrontal ? "BICEPS" : "TRICEPS";
          } else {
            nombreParte = "ANTEBRAZO";
          }
        } else {
          if (esFrontal) {
            if (y > limites.pechoY) nombreParte = "PECHO";
            else if (y > limites.cinturaY) nombreParte = "ABDOMEN";
            else if (y > limites.rodillaY) nombreParte = "CUADRICEPS";
            else nombreParte = "GEMELOS";
          } else {
            if (y > 0.18) nombreParte = "ESPALDA";
            else if (y > 0.1) nombreParte = "LUMBARES";
            else if (y > -0.1) nombreParte = "GLUTEOS";
            else if (y > limites.rodillaY) nombreParte = "FEMORAL";
            else nombreParte = "GEMELOS";
          }
        }

        console.log(`Parte del cuerpo: ${nombreParte} (Y: ${y.toFixed(2)})`);
        onSelect(nombreParte);
      }}
    />
  );
}

function PanelEjercicios({ seleccionado, cargando, ejercicios, onClose, mobile }) {
  return (
    <div className={mobile ? "p-6 pb-10" : "p-8 w-full"}>
      <button
        onClick={onClose}
        className="text-white/30 hover:text-primary text-[10px] font-black mb-8 uppercase tracking-[0.2em]"
      >
        ← Volver
      </button>

      <div className="mb-10">
        <h2 className={`font-black italic uppercase leading-none tracking-tighter ${mobile ? "text-4xl" : "text-6xl"}`}>
          {seleccionado}
        </h2>
        <div className="h-1 w-40 bg-primary mt-4 mb-2"></div>
      </div>

      <div className="grid gap-6 pb-6">
        {cargando ? (
          <p className="animate-pulse text-primary font-black">CARGANDO...</p>
        ) : ejercicios.length > 0 ? (
          ejercicios.map((ex) => (
            <Link to={`/ejercicios/${ex.id}`} key={ex.id} className="group block bg-[#141414] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-500">
              <div className="h-44 bg-zinc-900 relative overflow-hidden">
                <img
                  src={ex.imagen || `https://via.placeholder.com/500x300?text=${ex.titulo}`}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-0 transition-opacity duration-700"
                  alt={ex.titulo}
                />
                <img
                  src={ex.imagen ? ex.imagen.replace('/0.jpg', '/1.jpg') : ''}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-90 transition-opacity duration-700"
                  alt={ex.titulo}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded-full text-[9px] font-black uppercase italic z-10">
                  {ex.dificultad}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-black italic uppercase text-lg group-hover:text-primary transition-colors">
                  {ex.titulo}
                </h3>
                <p className="text-white/20 text-[10px] mt-1 font-bold uppercase tracking-widest">
                  Ver detalles técnicos →
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-white/20 italic">No hay ejercicios para este músculo todavía.</p>
        )}
      </div>
    </div>
  );
}

export default function Workouts() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [genero, setGenero] = useState("masculino");
  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [verFavoritos, setVerFavoritos] = useState(false);

  const rutaModelo = genero === "masculino" ? "/glbs/hombre3D.glb" : "/glbs/mujer3D.glb";

  const handleSelect = (parte) => {
    if (parte === seleccionado && !verFavoritos) return;
    setVerFavoritos(false);
    setCargando(true);
    setSeleccionado(parte);
  };

  const handleShowFavorites = () => {
    setSeleccionado("TUS FAVORITOS");
    setVerFavoritos(true);
    setCargando(true);
    api.get("/api/favorites-exercises")
      .then((res) => setEjercicios(res.data))
      .catch((err) => {
        console.error("Error en el fetch de favoritos:", err);
        setEjercicios([]);
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    if (seleccionado && !verFavoritos && seleccionado !== "TUS FAVORITOS") {
      api.get(`/api/exercises/${seleccionado}`)
        .then((res) => setEjercicios(res.data))
        .catch((err) => {
          console.error("Error en el fetch:", err);
          setEjercicios([]);
        })
        .finally(() => setCargando(false));
    }
  }, [seleccionado, verFavoritos]);

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-[#0a0a0a] text-white font-sans overflow-hidden relative" style={{ marginTop: '80px' }}>
      <div className="absolute top-6 left-6 z-50 flex gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-xl">
        <button
          onClick={() => {
            setGenero("masculino");
            setCargando(false);
            setEjercicios([]);
            setSeleccionado(null);
            setVerFavoritos(false);
          }}
          className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            genero === "masculino" && !verFavoritos
              ? "bg-primary text-black shadow-lg shadow-primary/20"
              : "text-white/40 hover:text-white"
          }`}
        >
          MALE
        </button>

        <button
          onClick={() => {
            setGenero("femenino");
            setCargando(false);
            setEjercicios([]);
            setSeleccionado(null);
            setVerFavoritos(false);
          }}
          className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            genero === "femenino" && !verFavoritos
              ? "bg-primary text-black shadow-lg shadow-primary/20"
              : "text-white/40 hover:text-white"
          }`}
        >
          FEMALE
        </button>

        <div className="w-px h-6 bg-white/20 mx-1 self-center"></div>

        <button
          onClick={handleShowFavorites}
          className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            verFavoritos
              ? "bg-primary text-black shadow-lg shadow-primary/20"
              : "text-white/40 hover:text-white"
          }`}
        >
          <svg className={`w-3 h-3 ${verFavoritos ? "fill-black" : "fill-none"} stroke-current`} viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          FAVORITOS
        </button>
      </div>

      <main className="flex flex-1 overflow-hidden relative w-full h-full bg-[#0a0a0a]">
        {/* CANVAS — en móvil ocupa todo, en desktop se encoge */}
        <div className={`relative transition-all duration-700 h-full bg-[#0a0a0a] w-full ${seleccionado ? "md:w-1/2" : "md:w-full"}`}>
          <Canvas dpr={[1, 2]} camera={{ fov: 15 }} style={{ background: '#0a0a0a' }} onCreated={({ gl }) => { gl.setClearColor('#0a0a0a', 1); }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.1} adjustCamera={true} shadows={false}>
                <Model key={rutaModelo} url={rutaModelo} onSelect={handleSelect} genero={genero} />
              </Stage>
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} makeDefault minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableDamping={true} dampingFactor={0.05} />
          </Canvas>
        </div>

        {/* PANEL DESKTOP — lateral derecho */}
        <div className={`hidden md:block bg-[#0d0d0d] border-l border-white/5 transition-all duration-700 overflow-y-auto overflow-x-hidden shadow-2xl ${seleccionado ? "md:w-1/2" : "md:w-0"}`}>
          {seleccionado && <PanelEjercicios seleccionado={seleccionado} cargando={cargando} ejercicios={ejercicios} onClose={() => { setCargando(false); setEjercicios([]); setSeleccionado(null); setVerFavoritos(false); }} />}
        </div>

        {/* PANEL MÓVIL — bottom sheet */}
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0d] border-t border-white/10 rounded-t-3xl shadow-2xl transition-transform duration-500 ${seleccionado ? "translate-y-0" : "translate-y-full"}`}
          style={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>
          {seleccionado && <PanelEjercicios seleccionado={seleccionado} cargando={cargando} ejercicios={ejercicios} onClose={() => { setCargando(false); setEjercicios([]); setSeleccionado(null); setVerFavoritos(false); }} mobile />}
        </div>

        {/* Overlay oscuro móvil */}
        {seleccionado && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40"
            onClick={() => { setCargando(false); setEjercicios([]); setSeleccionado(null); setVerFavoritos(false); }}
          />
        )}
      </main>
    </div>
  );
}
