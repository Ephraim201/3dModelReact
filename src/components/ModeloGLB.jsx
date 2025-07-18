import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useState } from 'react';

export function ModeloGLB({ url, animationToPlay = null }) {
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, scene);
  const [currentAnim, setCurrentAnim] = useState('idl');

  // Carga inicial y animación por defecto
  useEffect(() => {
    console.log('Animaciones disponibles:', names);
    actions['idl']?.reset().fadeIn(0.5).play();
  }, [animations]);

  // Controlador de animaciones
  useEffect(() => {
    const targetAnim = animationToPlay || 'idl';
    
    if (actions[targetAnim]) {
      // Transición suave entre animaciones
      if (currentAnim && actions[currentAnim]) {
        actions[currentAnim].fadeOut(0.3);
      }
      
      actions[targetAnim]
        .reset()
        .fadeIn(0.3)
        .play();
      
      setCurrentAnim(targetAnim);
    }
  }, [animationToPlay, actions]);

  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />;
}