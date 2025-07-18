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
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'relative',
      background: '#f0f0f0'
    }}>
      <Canvas style={{ background: '#ffffff' }}>
        <CameraSetup />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <ModeloGLB 
          url="/modelos/helldiver4.glb" 
          animationToPlay={currentAnimation}
        />
        <OrbitControls 
          makeDefault
          enabled={true}
          target={[0, 0, 0]}
          minDistance={50}
          maxDistance={300}
          enablePan={true}
        />
        <Environment preset="studio" />
      </Canvas>

      {/* Panel de control de animaciones */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 100,
        padding: '15px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)'
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
                : 'linear-gradient(145deg, #4a4e69, #22223b)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              minWidth: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {anim.label}
            {currentAnimation === anim.name && (
              <span style={{ fontSize: '18px' }}>■</span>
            )}
          </button>
        ))}
      </div>

      {/* Indicador de animación actual */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#333',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 100
      }}>
        {currentAnimation 
          ? `Animación: ${animations.find(a => a.name === currentAnimation)?.label}` 
          : 'Animación: 🛑 Reposo (default)'}
      </div>
    </div>
  );
}

export default App;