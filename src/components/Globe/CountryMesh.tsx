'use client';

import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { CountryData } from '@/types/TravelObject';

interface CountryMeshProps {
  country: CountryData;
  position: THREE.Vector3;
  isSelected: boolean;
  isHovered: boolean;
  isSaved: boolean; // New prop to indicate if country has saved travel data
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export const CountryMesh = ({
  country,
  position,
  isSelected,
  isHovered,
  isSaved,
  onClick,
  onHover,
}: CountryMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  // Debug log when component mounts
  useState(() => {
    console.log('CountryMesh created for:', country.name, 'at position:', position);
    return null;
  });

  useFrame((state, delta) => {
    setTime(time + delta);
    
    if (meshRef.current) {
      // Calculate scale based on camera distance - smaller default size with dramatic shrinking when zoomed in
      const cameraDistance = state.camera.position.length();
      // Base scale starts much smaller (0.4) and shrinks dramatically when zooming in (down to 0.03)
      const baseScale = Math.max(0.03, Math.min(0.5, (cameraDistance - 2.5) / 3)); 
      
      // Pulse animation for selected countries
      if (isSelected) {
        const pulseScale = 1 + Math.sin(time * 3) * 0.1;
        meshRef.current.scale.setScalar(baseScale * pulseScale);
      } else {
        const hoverScale = isHovered ? 1.2 : 1;
        meshRef.current.scale.setScalar(baseScale * hoverScale);
      }

      // Rotate to always face camera
      meshRef.current.lookAt(state.camera.position);
    }
  });

  // Determine color based on state
  const getColor = () => {
    if (isSelected) return '#06b6d4'; // Keep selected dots blue (teal)
    if (isHovered) return '#06b6d4'; // Secondary teal for hover
    if (isSaved) return '#10b981'; // Success green for countries with saved travel data
    return '#fbbf24'; // Bright yellow/gold for better visibility against Earth texture
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        console.log('CountryMesh: Country clicked:', country.name);
        onClick();
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        console.log('CountryMesh: Pointer enter:', country.name);
        onHover(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        console.log('CountryMesh: Pointer leave:', country.name);
        onHover(false);
      }}
    >
      <sphereGeometry args={[0.025, 16, 16]} />
      <meshBasicMaterial
        color={getColor()}
        transparent
        opacity={0.95}
      />
      
      {/* Always visible subtle glow for better visibility against Earth */}
      <mesh scale={2.0}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial
          color={getColor()}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Enhanced glow effect for selected/hovered countries */}
      {(isSelected || isHovered) && (
        <mesh scale={3.0}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshBasicMaterial
            color={getColor()}
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </mesh>
  );
};
