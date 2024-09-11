import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const App = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Configuração da cena
    const scene = new THREE.Scene();

    // Configuração da câmera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Configuração do renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Suporte para telas de alta densidade (ex: Retina)
    mountRef.current.appendChild(renderer.domElement);

    // Adicionando luzes à cena
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    scene.add(pointLight);

    // Criando uma geometria de partículas em forma de esfera
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00ff00,
      size: 0.5,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Configuração dos controles de órbita para permitir rotação com o mouse
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Função de animação
    const animate = () => {
      requestAnimationFrame(animate);

      // Fazendo as partículas girarem lentamente
      particlesMesh.rotation.y += 0.002;
      particlesMesh.rotation.x += 0.002;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Ajustar a cena quando a janela for redimensionada
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    // Limpeza
    return () => {
      window.removeEventListener('resize', onWindowResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default App;
