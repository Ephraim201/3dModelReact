import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ModeloGLB } from "./components/ModeloGLB.jsx";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useState } from "react";

function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(
      12.565256130754642,
      1000.04265104793365,
      237.6363087045126
    );
    camera.rotation.set(
      -0.1648484902572105,
      -0.053330490134809484,
      -200.008867524664175265
    );
    camera.updateMatrixWorld();
  }, [camera]);

  return null;
}

function App() {
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const animations = [
    { name: "idl", label: "Reposo", code: "STANDBY" },
    { name: "figth", label: "Combate", code: "ENGAGE" },
    { name: "injured", label: "Herido", code: "WOUNDED" },
    { name: "sad", label: "Triste", code: "MORALE DOWN" },
    { name: "patada", label: "Patada", code: "KICK" },
    { name: "dance", label: "Baile", code: "VICTORY" },
    { name: "pointing", label: "Señalar", code: "TARGET" },
    { name: "salute", label: "Saludo", code: "SALUTE" },
  ];

  return (
    <>
      {/* Añade esto en tu index.html */}
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap"
        rel="stylesheet"
      />

      {/* Estilos globales Helldivers */}
      <style>
        {`
          html, body, #root {
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
            font-family: 'Orbitron', sans-serif;
          }
          * {
            box-sizing: border-box;
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}
      </style>

      {/* Contenedor principal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        {/* Video de fondo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            filter: "brightness(0.7) contrast(1.2)",
          }}
        >
          <source src="fondoH.mp4" type="video/mp4" />
        </video>

        {/* Canvas 3D */}
        <Canvas
          style={{ position: "absolute", zIndex: 1 }}
          gl={{ alpha: true, antialias: true }}
          shadows
        >
          <CameraSetup />
          <ambientLight intensity={1.5} color="#ffffff" />
          <directionalLight
            position={[15, 25, 20]}
            intensity={3}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <ModeloGLB
            url="/modelos/helldiver5.glb"
            animationToPlay={currentAnimation}
          />
          <OrbitControls
            makeDefault
            target={[0, 2, 0]}
            minDistance={30}
            maxDistance={500}
          />
          <Environment preset="city" background={false} ground={false} />
        </Canvas>

        {/* Panel de control estilo Helldivers 2 */}
        <div
          style={{
            position: "fixed",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "12px",
            zIndex: 100,
            padding: "20px",
            backgroundColor: "rgba(40, 40, 40, 0.9)",
            borderRadius: "8px",
            border: "2px solid #555",
            boxShadow: "0 0 30px rgba(255, 204, 0, 0.2)",
            backdropFilter: "blur(10px)",
            fontFamily: '"Orbitron", sans-serif',
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "90%",
          }}
        >
          {animations.map((anim) => (
            <button
              key={anim.name}
              onClick={() =>
                setCurrentAnimation(
                  currentAnimation === anim.name ? null : anim.name
                )
              }
              style={{
                padding: "14px 20px",
                background:
                  currentAnimation === anim.name
                    ? "linear-gradient(145deg, #ffcc00, #cc9900)" // Amarillo cuando está activo
                    : "linear-gradient(145deg, #3a3a3a, #2a2a2a)", // Gris cuando está inactivo
                color: currentAnimation === anim.name ? "#000" : "#ffcc00", // Negro cuando está activo, amarillo cuando está inactivo
                border:
                  currentAnimation === anim.name
                    ? "1px solid #ffcc00"
                    : "1px solid #555",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textShadow:
                  currentAnimation === anim.name
                    ? "none"
                    : "0 0 8px rgba(255, 204, 0, 0.5)",
                boxShadow:
                  currentAnimation === anim.name
                    ? "0 0 20px rgba(255, 204, 0, 0.7), inset 0 0 10px rgba(0, 0, 0, 0.3)"
                    : "0 4px 8px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 204, 0, 0.1)",
                transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                minWidth: "120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Efecto de borde superior - ahora amarillo */}
              {currentAnimation === anim.name && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, #ffcc00, #ff9900)",
                    boxShadow: "0 0 10px #ffcc00",
                  }}
                ></div>
              )}

              <span style={{ fontSize: "18px" }}>{anim.label}</span>
              <span
                style={{
                  fontSize: "10px",
                  color: currentAnimation === anim.name ? "#000" : "#ffcc00",
                  fontWeight: 400,
                }}
              >
                {anim.code}
              </span>

              {/* Efecto de escaneo */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)",
                  animation: "scanline 3s linear infinite",
                  pointerEvents: "none",
                }}
              ></div>
            </button>
          ))}
        </div>

        {/* Indicador de estado estilo Helldivers */}
        <div
          style={{
            position: "fixed",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#ffcc00", // Texto amarillo
            backgroundColor: "rgba(40, 40, 40, 0.9)",
            padding: "14px 30px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            boxShadow: "0 0 25px rgba(255, 204, 0, 0.2)",
            zIndex: 100,
            border: "2px solid #555",
            fontFamily: '"Orbitron", sans-serif',
            textShadow: "0 0 10px rgba(255, 204, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: currentAnimation ? "#ffcc00" : "#555", // Amarillo cuando hay animación, gris cuando no
              boxShadow: `0 0 10px ${currentAnimation ? "#ffcc00" : "#555"}`,
              animation: "pulse 1.5s infinite",
            }}
          ></div>
          {currentAnimation
            ? `TÁCTICA ACTIVA: ${
                animations.find((a) => a.name === currentAnimation)?.code
              }`
            : "ESTADO: STANDBY"}
        </div>
      </div>
    </>
  );
}

export default App;
