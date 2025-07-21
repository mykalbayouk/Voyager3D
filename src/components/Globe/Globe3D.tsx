'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { CountryMesh } from './CountryMesh';
import { useTravelStore } from '@/hooks/useTravelData';
import { COUNTRIES } from '@/utils/countryData';

// Earth component with texture
const EarthSphere = ({ meshRef }: { meshRef: React.RefObject<THREE.Mesh | null> }) => {
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Try multiple Earth texture sources for better reliability
    const textureSources = [
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg',
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/land_ocean_ice_cloud_2048.jpg'
    ];

    const tryLoadTexture = (sourceIndex: number) => {
      if (sourceIndex >= textureSources.length) {
        console.warn('All Earth texture sources failed, using fallback');
        setFallback(true);
        return;
      }

      loader.load(
        textureSources[sourceIndex],
        (texture) => {
          console.log('Earth texture loaded successfully from source:', sourceIndex);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          setEarthTexture(texture);
        },
        (progress) => {
          console.log('Loading Earth texture:', (progress.loaded / progress.total * 100) + '% loaded');
        },
        (error) => {
          console.warn(`Failed to load Earth texture from source ${sourceIndex}:`, error);
          tryLoadTexture(sourceIndex + 1);
        }
      );
    };

    tryLoadTexture(0);
  }, []);

  if (fallback || !earthTexture) {
    // Create a procedural Earth-like texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Ocean background
      context.fillStyle = '#1e40af';
      context.fillRect(0, 0, 512, 256);
      
      // Add some simple land masses (continents)
      context.fillStyle = '#22c55e';
      
      // North America
      context.fillRect(50, 80, 80, 60);
      context.fillRect(120, 100, 40, 40);
      
      // South America
      context.fillRect(100, 140, 30, 80);
      
      // Europe/Africa
      context.fillRect(220, 70, 60, 120);
      context.fillRect(240, 140, 40, 80);
      
      // Asia
      context.fillRect(300, 60, 120, 80);
      context.fillRect(360, 90, 80, 60);
      
      // Australia
      context.fillRect(380, 180, 60, 30);
      
      const proceduralTexture = new THREE.CanvasTexture(canvas);
      proceduralTexture.wrapS = THREE.RepeatWrapping;
      proceduralTexture.wrapT = THREE.RepeatWrapping;
      
      return (
        <Sphere ref={meshRef} args={[2, 64, 64]}>
          <meshPhongMaterial
            map={proceduralTexture}
            transparent
            opacity={0.95}
            shininess={10}
          />
        </Sphere>
      );
    }
    
    // Final fallback if canvas fails
    return (
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#1e40af"
          transparent
          opacity={0.95}
          shininess={10}
        />
        {/* Add continental land masses overlay */}
        <Sphere args={[2.001, 64, 64]}>
          <meshBasicMaterial
            color="#22c55e"
            transparent
            opacity={0.4}
          />
        </Sphere>
      </Sphere>
    );
  }

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshPhongMaterial
        map={earthTexture}
        transparent
        opacity={0.95}
        shininess={10}
      />
    </Sphere>
  );
};

interface Globe3DProps {
  autoRotate?: boolean;
  onResetView?: () => void;
}

export const Globe3D = ({ autoRotate = false, onResetView }: Globe3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const { selectedCountry, setSelectedCountry, savedCountries } = useTravelStore();

  // Debug: Check if COUNTRIES is loaded
  useEffect(() => {
    console.log('Globe3D: COUNTRIES array:', COUNTRIES);
    console.log('Globe3D: COUNTRIES length:', COUNTRIES.length);
  }, []);

  // Debug effect to track selectedCountry changes
  useEffect(() => {
    console.log('Globe3D: selectedCountry changed to:', selectedCountry);
  }, [selectedCountry]);

  // Handle reset view functionality
  useEffect(() => {
    if (onResetView) {
      // Store the reset function reference so it can be called from outside
      (window as any).resetGlobeView = () => {
        if (controlsRef.current) {
          // Reset camera position
          controlsRef.current.reset();
        }
      };
    }
  }, [onResetView]);

  // Convert lat/lng to 3D coordinates on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number = 2.05) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  const handleCountryClick = (countryCode: string) => {
    console.log('Globe3D: Country clicked:', countryCode); // Debug log
    console.log('Globe3D: Current selected country before update:', selectedCountry);
    
    // Add a small delay to ensure the click isn't interfered with by OrbitControls
    setTimeout(() => {
      setSelectedCountry(countryCode);
      console.log('Globe3D: setSelectedCountry called with:', countryCode);
    }, 10);
  };

  const handleCountryHover = (countryCode: string | null) => {
    setHoveredCountry(countryCode);
    document.body.style.cursor = countryCode ? 'pointer' : 'default';
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800">
      <Canvas
        camera={{ position: [-2, 1.5, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.domElement.style.cursor = 'default';
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-10, 10, 10]} intensity={0.4} color="#ffffff" />
        <pointLight position={[10, -10, -10]} intensity={0.3} color="#e0f2fe" />

        {/* Earth Sphere */}
        <EarthSphere meshRef={meshRef} />

        {/* Atmospheric Glow */}
        <Sphere args={[2.1, 64, 64]}>
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Country Markers */}
        {COUNTRIES.map((country) => {
          const pos = latLngToVector3(country.lat, country.lng);
          console.log(`Rendering ${country.name} at position:`, pos); // Debug log
          return (
            <CountryMesh
              key={country.code}
              country={country}
              position={pos}
              isSelected={selectedCountry === country.code}
              isHovered={hoveredCountry === country.code}
              isSaved={savedCountries.has(country.code)}
              onClick={() => handleCountryClick(country.code)}
              onHover={(hovered: boolean) => handleCountryHover(hovered ? country.code : null)}
            />
          );
        })}

        {/* Controls */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          zoomSpeed={0.6}
          rotateSpeed={0.5}
          minDistance={3}
          maxDistance={12}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
          makeDefault
        />
      </Canvas>
    </div>
  );
};
