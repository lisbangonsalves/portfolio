'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// Neural Network Node
function NetworkNode({ position, active, intensity = 0 }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = active ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial
        color={active ? '#60a5fa' : '#1e40af'}
        emissive={active ? '#3b82f6' : '#1e3a8a'}
        emissiveIntensity={active ? intensity * 2 : 0.3}
      />
    </mesh>
  );
}

// Connection Line
function Connection({ start, end, active, progress = 0 }) {
  const lineRef = useRef();

  useFrame(() => {
    if (lineRef.current && active) {
      lineRef.current.material.opacity = 0.3 + progress * 0.7;
    }
  });

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={active ? '#60a5fa' : '#1e40af'}
        transparent
        opacity={active ? 0.8 : 0.2}
        linewidth={2}
      />
    </line>
  );
}

// Layer Label
function LayerLabel({ position, text }) {
  return (
    <Text
      position={position}
      fontSize={0.25}
      color="#94a3b8"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

// Neural Network Scene
function NeuralNetworkScene() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [activeNodes, setActiveNodes] = useState({});
  const [progress, setProgress] = useState(0);

  // Network architecture
  const layers = useMemo(() => [
    { nodes: 4, x: -6, label: 'Input Layer\n(Data)' },
    { nodes: 6, x: -2, label: 'Hidden Layer 1\n(Processing)' },
    { nodes: 6, x: 2, label: 'Hidden Layer 2\n(Learning)' },
    { nodes: 3, x: 6, label: 'Output Layer\n(Results)' },
  ], []);

  // Generate node positions
  const nodePositions = useMemo(() => {
    const positions = [];
    layers.forEach((layer, layerIndex) => {
      const spacing = 1.5;
      const startY = -(layer.nodes - 1) * spacing / 2;
      for (let i = 0; i < layer.nodes; i++) {
        positions.push({
          layerIndex,
          nodeIndex: i,
          position: [layer.x, startY + i * spacing, 0],
        });
      }
    });
    return positions;
  }, [layers]);

  // Generate connections
  const connections = useMemo(() => {
    const conns = [];
    for (let l = 0; l < layers.length - 1; l++) {
      const currentLayer = nodePositions.filter(n => n.layerIndex === l);
      const nextLayer = nodePositions.filter(n => n.layerIndex === l + 1);

      currentLayer.forEach(start => {
        nextLayer.forEach(end => {
          conns.push({
            start: start.position,
            end: end.position,
            layerIndex: l,
          });
        });
      });
    }
    return conns;
  }, [layers.length, nodePositions]);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const cycleTime = 4; // 4 seconds per full cycle
    const currentProgress = (time % cycleTime) / cycleTime;

    setProgress(currentProgress);

    // Determine active layer based on progress
    const layerProgress = currentProgress * layers.length;
    const currentLayer = Math.floor(layerProgress);
    setActiveLayer(currentLayer);

    // Activate nodes in current layer
    const newActiveNodes = {};
    nodePositions.forEach(node => {
      if (node.layerIndex === currentLayer) {
        const nodeProgress = (layerProgress - currentLayer) * node.nodeIndex / layers[currentLayer].nodes;
        newActiveNodes[`${node.layerIndex}-${node.nodeIndex}`] = nodeProgress;
      } else if (node.layerIndex < currentLayer) {
        newActiveNodes[`${node.layerIndex}-${node.nodeIndex}`] = 1;
      }
    });
    setActiveNodes(newActiveNodes);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 0, 10]} intensity={1} color="#3b82f6" />
      <pointLight position={[-10, 0, 10]} intensity={0.5} color="#60a5fa" />

      {/* Nodes */}
      {nodePositions.map((node, i) => {
        const key = `${node.layerIndex}-${node.nodeIndex}`;
        const intensity = activeNodes[key] || 0;
        return (
          <NetworkNode
            key={i}
            position={node.position}
            active={intensity > 0}
            intensity={intensity}
          />
        );
      })}

      {/* Connections */}
      {connections.map((conn, i) => (
        <Connection
          key={i}
          start={conn.start}
          end={conn.end}
          active={conn.layerIndex < activeLayer || (conn.layerIndex === activeLayer && progress > 0.5)}
          progress={conn.layerIndex === activeLayer ? (progress - 0.5) * 2 : 1}
        />
      ))}

      {/* Layer Labels */}
      {layers.map((layer, i) => (
        <LayerLabel
          key={i}
          position={[layer.x, -4.5, 0]}
          text={layer.label}
        />
      ))}

      {/* Data Flow Indicator */}
      <Text
        position={[0, 5.5, 0]}
        fontSize={0.35}
        color="#60a5fa"
        anchorX="center"
        anchorY="middle"
      >
        Neural Network Processing →
      </Text>
    </>
  );
}

// Main Component
export default function InteractiveRobot() {
  return (
    <div className="w-full h-full relative bg-black">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <NeuralNetworkScene />
      </Canvas>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/30 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
