import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ModeloGLB } from './components/ModeloGLB.jsx';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useState } from 'react';
import './styles/global.css';
import './components/Controls.css';

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
  const [panelExpanded, setPanelExpanded] = useState(false);
  
  const animations = [
    { name: 'idl', label: 'STANDBY' },
    { name: 'figth', label: 'ENGAGE' },
    { name: 'injured', label: 'WOUNDED' },
    { name: 'sad', label: 'MORALE DOWN' },
    { name: 'patada', label: 'KICK' },
    { name: 'dance', label: 'VICTORY' },
    { name: 'pointing', label: 'TARGET' },
    { name: 'salute', label: 'SALUTE' }
  ];

  return (
    <div className="app-container">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src="fondoH.mp4" type="video/mp4" />
      </video>

      {/* Canvas 3D */}
      <Canvas
        gl={{ alpha: true, antialias: true }}
        shadows
        className="main-canvas"
      >
        <CameraSetup />
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight
          position={[15, 25, 20]}
          intensity={3}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <ModeloGLB url="/modelos/helldiver5.glb" animationToPlay={currentAnimation} />
        <OrbitControls 
          makeDefault
          target={[0, 2, 0]}
          minDistance={30}
          maxDistance={500}
        />
        <Environment preset="city" background={false} ground={false} />
      </Canvas>

      {/* Panel desplegable */}
      <div className={`panel-container ${panelExpanded ? 'expanded' : ''}`}>
  <div className="controls-panel">
    {animations.map((anim) => (
      <button
        key={anim.name}
        className={`control-button ${currentAnimation === anim.name ? 'active' : ''}`}
        onClick={() => setCurrentAnimation(anim.name)}
      >
        <span>{anim.label}</span>
      </button>
    ))}
  </div>
  <button 
    className="panel-trigger"
    onClick={() => setPanelExpanded(!panelExpanded)}
  >
    {panelExpanded ? '◄' : '►'}
  </button>
</div>

<div className="status-indicator">
  <div className="status-dot"></div>
  <span>{currentAnimation || 'STANDBY'}</span>
</div>

      {/* Indicador de estado simplificado */}
      <div className="status-indicator">
        <div className={`status-dot ${currentAnimation ? 'active' : ''}`}></div>
        {currentAnimation || 'STANDBY'}
      </div>
    </div>
  );
}

export default App;