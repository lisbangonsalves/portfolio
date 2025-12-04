'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Car Component
function Car({ position, onPositionChange }) {
  const carRef = useRef();
  const [velocity, setVelocity] = useState({ x: 0, z: 0 });
  const [rotation, setRotation] = useState(0);
  const keys = useRef({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
        if (key === 'w' || key === 'arrowup') keys.current.w = true;
        if (key === 's' || key === 'arrowdown') keys.current.s = true;
        if (key === 'a' || key === 'arrowleft') keys.current.a = true;
        if (key === 'd' || key === 'arrowright') keys.current.d = true;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keys.current.w = false;
      if (key === 's' || key === 'arrowdown') keys.current.s = false;
      if (key === 'a' || key === 'arrowleft') keys.current.a = false;
      if (key === 'd' || key === 'arrowright') keys.current.d = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!carRef.current) return;

    const speed = 0.1;
    const turnSpeed = 0.05;

    let newRotation = rotation;

    // Turning
    if (keys.current.a) newRotation += turnSpeed;
    if (keys.current.d) newRotation -= turnSpeed;

    // Movement
    let newVelocity = { x: velocity.x, z: velocity.z };
    if (keys.current.w) {
      newVelocity.x += Math.sin(newRotation) * speed;
      newVelocity.z += Math.cos(newRotation) * speed;
    }
    if (keys.current.s) {
      newVelocity.x -= Math.sin(newRotation) * speed * 0.5;
      newVelocity.z -= Math.cos(newRotation) * speed * 0.5;
    }

    // Apply friction
    newVelocity.x *= 0.9;
    newVelocity.z *= 0.9;

    // Update position
    carRef.current.position.x += newVelocity.x;
    carRef.current.position.z += newVelocity.z;

    // Boundaries
    const boundary = 20;
    carRef.current.position.x = Math.max(-boundary, Math.min(boundary, carRef.current.position.x));
    carRef.current.position.z = Math.max(-boundary, Math.min(boundary, carRef.current.position.z));

    carRef.current.rotation.y = newRotation;

    setRotation(newRotation);
    setVelocity(newVelocity);

    onPositionChange(carRef.current.position);
  });

  return (
    <group ref={carRef} position={position}>
      {/* Car Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.5, 0.8, 2.5]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      {/* Car Roof */}
      <mesh position={[0, 1.1, -0.2]} castShadow>
        <boxGeometry args={[1.3, 0.6, 1.2]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.8, 0.2, 0.8]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.8, 0.2, 0.8]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[-0.8, 0.2, -0.8]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.8, 0.2, -0.8]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* Windows */}
      <mesh position={[0, 1.1, 0.3]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.1]} />
        <meshStandardMaterial color="#3498db" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// Building Component
function Building({ position, width, height, depth, color }) {
  return (
    <mesh position={[position[0], height / 2, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Tree Component
function Tree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#27ae60" />
      </mesh>
    </group>
  );
}

// Ground Component
function Ground() {
  return (
    <>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
      {/* Grid lines for road effect */}
      <gridHelper args={[50, 50, '#7f8c8d', '#7f8c8d']} position={[0, 0.01, 0]} />
    </>
  );
}

// Camera Follow Component
function CameraRig({ target }) {
  useFrame(({ camera }) => {
    if (target) {
      camera.position.lerp(
        new THREE.Vector3(target.x - 8, target.y + 8, target.z + 8),
        0.1
      );
      camera.lookAt(target.x, target.y, target.z);
    }
  });
  return null;
}

// Main Scene Component
function Scene() {
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0.5, z: 0 });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Sky sunPosition={[100, 20, 100]} />

      <Ground />

      <Car position={[0, 0.5, 0]} onPositionChange={setCarPosition} />

      {/* Buildings */}
      <Building position={[-8, 0, -8]} width={3} height={5} depth={3} color="#3498db" />
      <Building position={[8, 0, -8]} width={4} height={7} depth={4} color="#9b59b6" />
      <Building position={[-10, 0, 8]} width={3} height={6} depth={3} color="#e67e22" />
      <Building position={[10, 0, 10]} width={3.5} height={4} depth={3.5} color="#1abc9c" />
      <Building position={[0, 0, -15]} width={5} height={8} depth={4} color="#34495e" />

      {/* Trees */}
      <Tree position={[-5, 0, 5]} />
      <Tree position={[6, 0, -4]} />
      <Tree position={[-12, 0, -2]} />
      <Tree position={[4, 0, 12]} />
      <Tree position={[-8, 0, 15]} />
      <Tree position={[12, 0, -10]} />

      <CameraRig target={carPosition} />
    </>
  );
}

// Main Component
export default function DriveableWorld() {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-sky-400 to-sky-200">
      <Canvas shadows camera={{ position: [-8, 8, 8], fov: 60 }}>
        <Scene />
      </Canvas>
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
        <p className="font-semibold mb-1">Controls:</p>
        <p>W/↑ - Forward</p>
        <p>S/↓ - Backward</p>
        <p>A/← - Turn Left</p>
        <p>D/→ - Turn Right</p>
      </div>
    </div>
  );
}
