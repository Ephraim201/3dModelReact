import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ModeloGLB } from './components/ModeloGLB.jsx';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useState } from 'react';

function CameraSetup() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(12.565256130754642, 1000.04265104793365, 237.6363087045126);
    camera.rotation.set(-0.1648484902572105, -0.053330490134809484, -200.008867524664175265);
    camera.updateMatrixWorld();
  }, [camera]);

  return null;
}

function App() {
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const animations = [
    { name: 'idl', label: '🛑 Reposo' },
    { name: 'figth', label: '⚔️ Combate' },
    { name: 'injured', label: '🤕 Herido' },
    { name: 'sad', label: '😢 Triste' },
    { name: 'dance', label: '💃 Baile' }
  ];

  return (
    <>
      {/* Estilos globales para eliminar márgenes */}
      <style>
        {`
          html, body, #root {
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
          * {
            box-sizing: border-box;
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>

      {/* Contenedor principal */}
      <div style={{ 
        position: 'fixed', // Cambiado a fixed para asegurar cobertura completa
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(0.7)'
          }}
        >
          <source src="fondoH.mp4" type="video/mp4" />
        </video>

        <Canvas
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
          shadows>
            
          {/* Configuración de cámara */}
          <CameraSetup />

          {/* Sistema de iluminación mejorado */}
          <ambientLight 
            intensity={1.2} 
            color="#ffffff" 
          />
          
          <directionalLight
            position={[10, 20, 15]}
            intensity={2.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={500}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />

          <pointLight
            position={[-10, 10, -5]}
            intensity={1}
            distance={50}
            decay={2}
            color="#ffccaa"
          />

          <hemisphereLight
            groundColor="#404040"
            intensity={0.6}
          />

          {/* Modelo 3D */}
          <ModeloGLB 
            url="/modelos/helldiver4.glb" 
            animationToPlay={currentAnimation}
          />

          {/* Controles */}
          <OrbitControls 
            makeDefault
            target={[0, 2, 0]} // Ajustado para mejor perspectiva
            minDistance={30}
            maxDistance={500}
          />

          {/* Environment personalizado */}
          <Environment 
            preset="city" 
            background={false} // Mantenemos el fondo de video
            ground={false}
          />
        </Canvas>

        {/* Panel de control mejorado */}
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 100,
          padding: '15px',
          backgroundColor: 'rgba(0,0,0,0.85)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '95%'
        }}>
          {animations.map((anim) => (
            <button
              key={anim.name}
              onClick={() => setCurrentAnimation(
                currentAnimation === anim.name ? null : anim.name
              )}
              style={{
                padding: '12px 18px',
                background: currentAnimation === anim.name 
                  ? 'linear-gradient(145deg, #e63946, #c1121f)' 
                  : 'linear-gradient(145deg, #3a3d5d, #1a1b2d)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                minWidth: '110px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: currentAnimation === anim.name 
                  ? '0 0 20px rgba(230, 57, 70, 0.8)'
                  : '0 2px 10px rgba(0,0,0,0.3)',
                flex: '1 0 auto'
              }}
            >
              {anim.label}
              {currentAnimation === anim.name && (
                <span style={{ 
                  fontSize: '18px',
                  animation: 'pulse 1s infinite',
                  textShadow: '0 0 8px rgba(255,255,255,0.7)'
                }}>■</span>
              )}
            </button>
          ))}
        </div>

        {/* Indicador de animación actual - versión mejorada */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.85)',
          padding: '12px 24px',
          borderRadius: '24px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          zIndex: 100,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center',
          minWidth: '260px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {currentAnimation 
            ? `▶ ${animations.find(a => a.name === currentAnimation)?.label}` 
            : '🛑 Reposo'}
        </div>
      </div>
    </>
  );
}

export default App;