import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Eye, Flame, Sun, Compass, RotateCcw, Video, Maximize2, Minimize2, Sparkles, Clock } from "lucide-react";
import { VEI_PRESETS } from "../utils/physicsEngine";

// Procedural soft cloud/smoke particle texture
function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(230, 230, 230, 0.7)");
  gradient.addColorStop(0.7, "rgba(180, 180, 180, 0.25)");
  gradient.addColorStop(1, "rgba(100, 100, 100, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Generate realistic geological 3D terrain mesh based on volcano morphology
function generateVolcanoTerrain(volcano) {
  const terrainType = volcano?.terrainType || "stratovolcano_cone";
  const name = volcano?.name || "";
  
  const group = new THREE.Group();
  const size = 360;
  const segments = 120;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  const pos = geometry.attributes.position;
  const colors = [];
  const vertex = new THREE.Vector3();

  // Distinct geological parameters
  const isToba = terrainType === "giant_lake_caldera" || name.includes("Toba");
  const isTambora = name.includes("Tambora");
  const isKrakatau = name.includes("Krakatau");
  const isMerapi = name.includes("Merapi") && !name.includes("Marapi");
  const isSemeru = name.includes("Semeru");
  const isBatur = name.includes("Batur");
  const isGede = name.includes("Gede");
  const isSlamet = name.includes("Slamet");
  const isKerinci = name.includes("Kerinci");
  const isRinjani = name.includes("Rinjani");
  const isMarapi = name.includes("Marapi");
  const isIsland = terrainType === "island_composite" || isKrakatau || name.includes("Ruang") || name.includes("Awu") || name.includes("Gamalama");

  for (let i = 0; i < pos.count; i++) {
    vertex.fromBufferAttribute(pos, i);
    const x = vertex.x;
    const z = vertex.z;
    const r = Math.sqrt(x * x + z * z);
    const angle = Math.atan2(z, x);

    let height = 0;

    if (isToba) {
      // Giant Caldera with Outer Rim, Inner Lake, and Resurgent Samosir Island
      const rimRadius = 110;
      const rimDist = Math.abs(r - rimRadius);
      // High caldera cliffs
      const rimHeight = Math.max(0, 45 * Math.exp(-Math.pow(rimDist / 28, 2)));
      // Outer gentle slope
      const outerSlope = r > rimRadius ? Math.max(0, 30 * Math.exp(-(r - rimRadius) / 60)) : 0;
      // Lake depression
      const lakeDepression = r < rimRadius ? -12 : 0;
      // Resurgent Island (Samosir) in the lake
      const islandDist = Math.sqrt(Math.pow(x - 18, 2) + Math.pow(z + 10, 2));
      const samosirIsland = Math.max(0, 24 * Math.exp(-Math.pow(islandDist / 32, 2)));

      height = rimHeight + outerSlope + lakeDepression + samosirIsland;
      // Add rugged plateau noise
      height += Math.sin(x * 0.08) * Math.cos(z * 0.08) * 2.5;
    } else if (isTambora) {
      // Massive stratovolcano with huge, sheer collapsed caldera (6 km wide, 1 km deep)
      const baseCone = Math.max(0, 95 * Math.exp(-Math.pow(r / 75, 1.4)));
      // Steep Caldera Rim at r = 32
      if (r < 32) {
        // Deep caldera pit
        height = 32 - Math.pow((32 - r) / 32, 0.7) * 28;
      } else {
        height = baseCone;
      }
      // Radial erosional ravines (Barrancos)
      const ridges = Math.cos(angle * 14) * 4.5 * Math.sin(r * 0.06);
      height += ridges;
    } else if (isKrakatau) {
      // Krakatau Caldera complex (sea surrounding Anak Krakatau + remnants of Rakata)
      // Water level is at y = 0
      // Rakata Peak remnant (south-east ridge)
      const rakataDist = Math.sqrt(Math.pow(x + 40, 2) + Math.pow(z - 35, 2));
      const rakataPeak = Math.max(0, 68 * Math.exp(-Math.pow(rakataDist / 38, 2)));

      // Anak Krakatau emergent cone in the center
      const anakDist = Math.sqrt(Math.pow(x - 5, 2) + Math.pow(z - 5, 2));
      let anakCone = Math.max(0, 48 * Math.exp(-Math.pow(anakDist / 24, 1.3)));
      if (anakDist < 6) {
        // Small active summit crater
        anakCone -= (6 - anakDist) * 1.5;
      }

      // Sertung & Panjang outer reef remnants
      const sertungDist = Math.sqrt(Math.pow(x - 45, 2) + Math.pow(z + 40, 2));
      const sertungRidge = Math.max(0, 28 * Math.exp(-Math.pow(sertungDist / 26, 2)));

      height = rakataPeak + anakCone + sertungRidge - 3;
    } else if (isMerapi) {
      // Steep active cone with prominent southern breach/gully (Kali Gendol) and lava dome
      const cone = Math.max(0, 105 * Math.exp(-Math.pow(r / 62, 1.25)));
      // South-facing collapse gorge (angle near PI/2)
      const isSouthGully = Math.abs(angle - 1.3) < 0.45 && r > 12 && r < 90;
      const gullyDepth = isSouthGully ? 18 * Math.sin((r - 12) / 80 * Math.PI) : 0;
      // Rugged volcanic ravines
      const ravines = Math.sin(angle * 16) * 5.0 * (r / 90);

      height = Math.max(0, cone - gullyDepth + ravines);
    } else if (isSemeru) {
      // Gunung Semeru (Mahameru) - Steep classic stratovolcano with Besuk Kobokan lava flow path
      const cone = Math.max(0, 115 * Math.exp(-Math.pow(r / 68, 1.2)));
      // Jonggring Saloko crater vent
      if (r < 10) {
        height = 108 - Math.pow(10 - r, 1.2) * 1.8;
      } else {
        height = cone;
      }
      // Southeastern avalanche/pyroclastic furrow (Besuk Kobokan)
      const isBesuk = Math.abs(angle + 0.8) < 0.38 && r > 14 && r < 110;
      if (isBesuk) {
        height -= 14 * Math.sin((r - 14) / 96 * Math.PI);
      }
      // Radial ridges
      height += Math.cos(angle * 18) * 4.2 * Math.sin(r * 0.05);
    } else if (isRinjani) {
      // Gunung Rinjani & Segara Anak Caldera Complex with emergent Gunung Barujari
      const rinjaniPeakDist = Math.sqrt(Math.pow(x - 36, 2) + Math.pow(z + 14, 2));
      const rinjaniPeak = Math.max(0, 118 * Math.exp(-Math.pow(rinjaniPeakDist / 42, 1.4)));

      // Segara Anak Caldera Rim (Radius ~48 centered at -6, -4)
      const caldX = x + 6;
      const caldZ = z + 4;
      const caldDist = Math.sqrt(caldX * caldX + caldZ * caldZ);
      const rimHeight = Math.max(0, 48 * Math.exp(-Math.pow(Math.abs(caldDist - 44) / 16, 1.8)));

      // Segara Anak lake depression
      const lakeFloor = caldDist < 42 ? -8 : 0;

      // Emergent Gunung Barujari inside Segara Anak lake
      const barujariDist = Math.sqrt(Math.pow(caldX - 8, 2) + Math.pow(caldZ + 6, 2));
      let barujariCone = Math.max(0, 36 * Math.exp(-Math.pow(barujariDist / 14, 1.3)));
      if (barujariDist < 4) {
        barujariCone -= (4 - barujariDist) * 1.8; // Active Barujari vent
      }

      height = rinjaniPeak + rimHeight + lakeFloor + barujariCone;
    } else if (isKerinci) {
      // Gunung Kerinci - Highest Volcano in Indonesia (3,805 m)
      // Soaring symmetrical cone with steep upper flank
      const cone = Math.max(0, 128 * Math.exp(-Math.pow(r / 60, 1.22)));
      if (r < 11) {
        // Active sulfur crater lake
        height = 118 - Math.pow(11 - r, 1.3) * 2.8;
      } else {
        height = cone;
      }
      // Radial volcanic valleys
      height += Math.sin(angle * 14) * 4.8 * (r / 75);
    } else if (isGede) {
      // Gunung Gede-Pangrango Twin Volcano Complex
      // Peak 1: Gunung Gede (Active, with big crater complex) at (-14, -10)
      const gedeDist = Math.sqrt(Math.pow(x + 14, 2) + Math.pow(z + 10, 2));
      let gedeCone = Math.max(0, 102 * Math.exp(-Math.pow(gedeDist / 44, 1.3)));
      if (gedeDist < 12) {
        gedeCone -= Math.pow(12 - gedeDist, 1.2) * 2.4; // Kawah Ratu & Gumuruh
      }

      // Peak 2: Gunung Pangrango (Extinct cone) at (+22, +16)
      const pangrangoDist = Math.sqrt(Math.pow(x - 22, 2) + Math.pow(z - 16, 2));
      const pangrangoCone = Math.max(0, 108 * Math.exp(-Math.pow(pangrangoDist / 46, 1.4)));

      // Saddle ridge between Gede & Pangrango (Kandang Badak)
      height = Math.max(gedeCone, pangrangoCone) + Math.min(gedeCone, pangrangoCone) * 0.35;
      height += Math.cos(angle * 12) * 3.5 * Math.sin(r * 0.05);
    } else if (isSlamet) {
      // Gunung Slamet - Massive Stratovolcano in Central Java
      const cone = Math.max(0, 120 * Math.exp(-Math.pow(r / 70, 1.2)));
      if (r < 14) {
        // Deep Kawah IV active vent
        height = 110 - Math.pow(14 - r, 1.25) * 2.5;
      } else {
        height = cone;
      }
      // Extensive radial ravines (Barrancos)
      height += Math.cos(angle * 20) * 5.2 * (r / 80);
    } else if (isMarapi) {
      // Gunung Marapi - High summit plateau with active crater complex
      const cone = Math.max(0, 104 * Math.exp(-Math.pow(r / 62, 1.28)));
      if (r < 18) {
        // Summit plateau & multiple craters (Bancah, Kapal, Tuo)
        const plateau = 96 - Math.pow(18 - r, 0.9) * 1.5;
        const subCrater = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 3;
        height = plateau + subCrater;
      } else {
        height = cone;
      }
      height += Math.sin(angle * 15) * 4.0 * (r / 80);
    } else {
      // General Stratovolcano with realistic summit crater & volcanic fluting
      const cone = Math.max(0, 92 * Math.exp(-Math.pow(r / 65, 1.3)));
      if (r < 12) {
        // Crater bowl
        height = 84 - Math.pow(12 - r, 1.3) * 2.2;
      } else {
        height = cone;
      }
      height += Math.sin(angle * 12) * 4 * (r / 80);
    }

    // Secondary organic terrain micro-noise
    const microNoise = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 1.4 + Math.sin(x * 0.35 + z * 0.25) * 0.8;
    height = Math.max(isIsland ? -6 : 0, height + microNoise);

    pos.setY(i, height);

    // Realistic Elevation-Based Vertex Coloring (Daylight Tropical Earth Palette)
    // 1. Sea/Water level (deep blue / shallow aqua)
    // 2. Coastal/Base tropical rainforest lush green (#2e6128, #3b7a33)
    // 3. Mid-slope sub-montane forest to volcanic scree (#607047, #786d58)
    // 4. Upper cone bare volcanic andesite ash & rocky ribs (#484542, #5e5954)
    // 5. Active crater rim sulfur & incandescent lava vent (#b89437, #ff4500)
    let cR = 0.22, cG = 0.42, cB = 0.18; // Default lush green

    if (height <= 0.5 && isIsland) {
      // Shoreline sandy beach / shallow coastal reef
      cR = 0.76; cG = 0.72; cB = 0.52;
    } else if (height < 25) {
      // Lush tropical green foot-slopes
      const t = height / 25;
      cR = THREE.MathUtils.lerp(0.18, 0.28, t);
      cG = THREE.MathUtils.lerp(0.46, 0.42, t);
      cB = THREE.MathUtils.lerp(0.14, 0.16, t);
    } else if (height < 60) {
      // Transition from upper tropical forest to alpine volcanic ash
      const t = (height - 25) / 35;
      cR = THREE.MathUtils.lerp(0.28, 0.46, t);
      cG = THREE.MathUtils.lerp(0.42, 0.42, t);
      cB = THREE.MathUtils.lerp(0.16, 0.35, t);
    } else if (height < 95) {
      // Barren volcanic scree, tephra, and jagged andesite ribs
      const t = (height - 60) / 35;
      cR = THREE.MathUtils.lerp(0.46, 0.35, t);
      cG = THREE.MathUtils.lerp(0.42, 0.33, t);
      cB = THREE.MathUtils.lerp(0.35, 0.30, t);
    } else {
      // Summit crater rim, sulfur dusting & active vents
      if (r < 14) {
        // Glowing incandescent magma chamber
        cR = 0.95; cG = 0.25; cB = 0.05;
      } else {
        // Scorched crater rim with yellow sulfur hints
        cR = 0.55; cG = 0.48; cB = 0.25;
      }
    }

    // Add subtle ambient shadow variation based on radius & angle
    const sunSlopeFactor = (Math.cos(angle - 0.7) * 0.12);
    cR = Math.min(1, Math.max(0, cR + sunSlopeFactor));
    cG = Math.min(1, Math.max(0, cG + sunSlopeFactor));
    cB = Math.min(1, Math.max(0, cB + sunSlopeFactor));

    colors.push(cR, cG, cB);
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.88,
    metalness: 0.05,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(geometry, terrainMat);
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = true;
  group.add(terrainMesh);

  // Active glowing lava dome/vent inside the main crater
  const domeGeo = new THREE.DodecahedronGeometry(isSemeru || isMerapi ? 6 : 9, 2);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0xff3b00,
    emissive: 0xff2200,
    emissiveIntensity: 1.8,
    roughness: 0.3,
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  
  if (isSemeru) {
    dome.position.set(0, 102, 0);
  } else if (isMerapi) {
    dome.position.set(0, 96, 0);
  } else if (isTambora) {
    dome.position.set(0, 26, 0);
  } else if (isKrakatau) {
    dome.position.set(-5, 42, -5);
  } else if (isToba) {
    dome.position.set(18, 20, -10);
  } else {
    dome.position.set(0, 78, 0);
  }
  group.add(dome);

  // Ocean / Lake Water Plane
  if (isIsland || isToba || isBatur) {
    const waterGeo = new THREE.PlaneGeometry(500, 500, 32, 32);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: isToba ? 0x0284c7 : 0x0369a1, // Radiant tropical blue water
      roughness: 0.12,
      metalness: 0.75,
      transparent: true,
      opacity: 0.88,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = isToba ? 2 : 0.2;
    group.add(waterMesh);
  }

  return { group, domeMesh: dome };
}

export default function ThreeVolcanoScene({ 
  activeVolcano, 
  vei = 6, 
  timeMinutes = 0, 
  isPlaying: _isPlaying = false, 
  themeMode: _themeMode = "auto" 
}) {
  const rootRef = useRef(null);
  const mountRef = useRef(null);
  const [cameraView, setCameraView] = useState("cinematic");
  const [isAutoOrbit, setIsAutoOrbit] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const shockwaveRef = useRef(null);
  const volcanoGroupRef = useRef(null);
  const domeRef = useRef(null);
  const animFrameId = useRef(null);

  // Spherical camera coordinate refs (Smooth Lerping & responsive controls)
  const sphericalRef = useRef({ radius: 260, theta: 0.7, phi: 1.15 });
  const targetSphericalRef = useRef({ radius: 260, theta: 0.7, phi: 1.15 });
  const isDraggingRef = useRef(false);
  const autoOrbitRef = useRef(true);

  const config = VEI_PRESETS[vei] || VEI_PRESETS[6];
  const isParoxysmalCollapse = vei >= 6 && timeMinutes >= 15;
  const collapsed = isParoxysmalCollapse;

  // Sync auto orbit ref
  useEffect(() => {
    autoOrbitRef.current = isAutoOrbit;
  }, [isAutoOrbit]);

  // Main Three.js Scene Lifecycle (Siang Hari Cerah Tropis / Sunny Tropical Daylight)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 1. Scene Setup with Bright Tropical Daylight Sky & Horizon Fog
    const scene = new THREE.Scene();
    const skyBlueColor = new THREE.Color(0x38bdf8); // Sky blue
    scene.background = skyBlueColor;
    scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0016);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    cameraRef.current = camera;

    // 3. Renderer Setup with Shadows & Anti-Aliasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Realistic Daylight Lighting System
    // Soft Sky Ambient Fill Light
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e3a1e, 1.4);
    scene.add(hemiLight);

    // Warm Sun Directional Light casting dramatic mountain shadows
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.6);
    sunLight.position.set(160, 240, 120);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 800;
    const shadowSize = 180;
    sunLight.shadow.camera.left = -shadowSize;
    sunLight.shadow.camera.right = shadowSize;
    sunLight.shadow.camera.top = shadowSize;
    sunLight.shadow.camera.bottom = -shadowSize;
    scene.add(sunLight);

    // Secondary Sunlight Fill (backscatter)
    const sunFill = new THREE.DirectionalLight(0xbae6fd, 0.8);
    sunFill.position.set(-140, 80, -100);
    scene.add(sunFill);

    // Dynamic Crater Magma Glow
    const craterGlow = new THREE.PointLight(0xff3700, 6, 220);
    craterGlow.position.set(0, 90, 0);
    scene.add(craterGlow);

    // 5. Generate Geologically Accurate Volcano 3D Terrain
    const { group: volcanoGroup, domeMesh } = generateVolcanoTerrain(activeVolcano);
    scene.add(volcanoGroup);
    volcanoGroupRef.current = volcanoGroup;
    domeRef.current = domeMesh;

    // 6. Plinian Eruption Volcanic Ash & Pyroclastic Bomb Particle System
    const particleCount = 3400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const ventY = domeMesh?.position.y || 80;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Vent dispersion
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = ventY + Math.random() * 8;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      // Vertical blast velocity with convective dispersion
      velocities[i3] = (Math.random() - 0.5) * 1.6;
      velocities[i3 + 1] = 1.4 + Math.random() * 3.8;
      velocities[i3 + 2] = (Math.random() - 0.5) * 1.6;

      // Fiery incandescent orange/red base transitioning to dark billowing ash in daylight
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.35 + Math.random() * 0.3;
      colors[i3 + 2] = 0.05;

      sizes[i] = 4 + Math.random() * 6;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleTexture = createParticleTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 7,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = {
      mesh: particles,
      positions,
      velocities,
      colors,
      count: particleCount,
      ventY,
    };

    // 7. Atmospheric Shockwave Ring (Refraction condensation ring)
    const shockGeo = new THREE.RingGeometry(1, 4, 64);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const shockwave = new THREE.Mesh(shockGeo, shockMat);
    shockwave.rotation.x = Math.PI / 2;
    shockwave.position.y = ventY + 10;
    scene.add(shockwave);
    shockwaveRef.current = shockwave;

    // 8. Interactive Mouse Drag & Wheel Controls
    let prevMousePos = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      setIsAutoOrbit(false);
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      targetSphericalRef.current.theta -= deltaX * 0.007;
      targetSphericalRef.current.phi = Math.max(
        0.12,
        Math.min(Math.PI / 2 - 0.02, targetSphericalRef.current.phi - deltaY * 0.007)
      );
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      setIsAutoOrbit(false);
      targetSphericalRef.current.radius = Math.max(
        60,
        Math.min(650, targetSphericalRef.current.radius + e.deltaY * 0.25)
      );
    };

    // Touch controls for mobile/tablets
    let touchStartDist = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        setIsAutoOrbit(false);
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        targetSphericalRef.current.theta -= deltaX * 0.008;
        targetSphericalRef.current.phi = Math.max(
          0.12,
          Math.min(Math.PI / 2 - 0.02, targetSphericalRef.current.phi - deltaY * 0.008)
        );
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = (touchStartDist - dist) * 0.4;
        targetSphericalRef.current.radius = Math.max(
          60,
          Math.min(650, targetSphericalRef.current.radius + factor)
        );
        touchStartDist = dist;
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // 9. Animation Loop
    let shockRadius = 1;
    let lastTime = performance.now();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Auto Orbit cinematic gentle rotation if active and user isn't dragging
      if (autoOrbitRef.current && !isDraggingRef.current) {
        targetSphericalRef.current.theta += delta * 0.12;
      }

      // Smooth Camera Lerp
      const s = sphericalRef.current;
      const ts = targetSphericalRef.current;
      s.radius = THREE.MathUtils.lerp(s.radius, ts.radius, 0.08);
      s.theta = THREE.MathUtils.lerp(s.theta, ts.theta, 0.08);
      s.phi = THREE.MathUtils.lerp(s.phi, ts.phi, 0.08);

      // Convert spherical coordinates to 3D Cartesian position
      camera.position.x = s.radius * Math.sin(s.phi) * Math.sin(s.theta);
      camera.position.y = s.radius * Math.cos(s.phi);
      camera.position.z = s.radius * Math.sin(s.phi) * Math.cos(s.theta);
      
      const lookTargetY = Math.min(60, ventY * 0.6);
      camera.lookAt(0, lookTargetY, 0);

      // Animate Eruption Column Particles
      if (particlesRef.current) {
        const p = particlesRef.current;
        const posArray = p.mesh.geometry.attributes.position.array;
        const colArray = p.mesh.geometry.attributes.color.array;
        const heightMultiplier = Math.max(0.5, (config.columnHeightKm || 20) / 35);

        for (let i = 0; i < p.count; i++) {
          const i3 = i * 3;
          posArray[i3] += p.velocities[i3] * 0.75;
          posArray[i3 + 1] += p.velocities[i3 + 1] * 0.95 * heightMultiplier;
          posArray[i3 + 2] += p.velocities[i3 + 2] * 0.75;

          // Umbrella Cloud convective expansion at troposphere boundary
          if (posArray[i3 + 1] > p.ventY + 50 * heightMultiplier) {
            posArray[i3] += (posArray[i3] > 0 ? 0.48 : -0.48);
            posArray[i3 + 2] += (posArray[i3 + 2] > 0 ? 0.48 : -0.48);
          }

          // Daytime Ash Shading: Glowing incandescent core -> dark volcanic ash billows (#333 -> #666)
          const yProgress = Math.min(1, (posArray[i3 + 1] - p.ventY) / (130 * heightMultiplier));
          colArray[i3] = THREE.MathUtils.lerp(1.0, 0.32, yProgress);
          colArray[i3 + 1] = THREE.MathUtils.lerp(0.35, 0.30, yProgress);
          colArray[i3 + 2] = THREE.MathUtils.lerp(0.06, 0.28, yProgress);

          // Reset particles at top or boundary
          if (
            posArray[i3 + 1] > p.ventY + 160 * heightMultiplier ||
            Math.abs(posArray[i3]) > 170 ||
            Math.abs(posArray[i3 + 2]) > 170
          ) {
            posArray[i3] = (Math.random() - 0.5) * 8;
            posArray[i3 + 1] = p.ventY + Math.random() * 5;
            posArray[i3 + 2] = (Math.random() - 0.5) * 8;
          }
        }
        p.mesh.geometry.attributes.position.needsUpdate = true;
        p.mesh.geometry.attributes.color.needsUpdate = true;
      }

      // Animate Shockwave Ring
      if (shockwaveRef.current) {
        shockRadius += delta * 140;
        if (shockRadius > 280) shockRadius = 1;
        shockwaveRef.current.scale.set(shockRadius, shockRadius, 1);
        shockwaveRef.current.material.opacity = Math.max(0, 0.8 * (1 - shockRadius / 280));
      }

      // Animate Lava Dome pulsation
      if (domeRef.current) {
        const pulse = 1.0 + Math.sin(now * 0.006) * 0.15;
        domeRef.current.scale.set(pulse, pulse, pulse);
        domeRef.current.material.emissiveIntensity = 1.4 + Math.sin(now * 0.008) * 0.6;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener("resize", handleResize);

    // Active ResizeObserver on mountRef container to instantly detect fullscreen & layout changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeVolcano, vei, config.columnHeightKm, config.megatons]);

  // Sync native browser fullscreen change events (e.g. user presses Esc key)
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  // Force Three.js canvas size update when fullscreen state changes
  useEffect(() => {
    const resize = () => {
      const container = mountRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      if (!container || !renderer || !camera) return;
      const w = isFullscreen ? window.innerWidth : (container.clientWidth || 600);
      const h = isFullscreen ? window.innerHeight : (container.clientHeight || 400);
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    resize();
    const t1 = setTimeout(resize, 40);
    const t2 = setTimeout(resize, 150);
    const t3 = setTimeout(resize, 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isFullscreen]);

  // Handle Preset Camera Views (Orbit, Pesisir, Satelit, Drone) with Smooth Flying Lerp
  const applyCameraPreset = useCallback((preset) => {
    setCameraView(preset);

    if (preset === "cinematic") {
      // Orbit Sinematik Normal
      targetSphericalRef.current = { radius: 260, theta: 0.7, phi: 1.15 };
      setIsAutoOrbit(true);
    } else if (preset === "coastline") {
      // Pesisir (Coastline View: Low Angle dari kejauhan melihat kolom abu membubung tinggi ke langit)
      targetSphericalRef.current = { radius: 360, theta: 0.35, phi: 1.46 };
      setIsAutoOrbit(false);
    } else if (preset === "topdown") {
      // Satelit (Bird's Eye Top-down melihat kawah dan kaldera secara ortografis)
      targetSphericalRef.current = { radius: 380, theta: 0.0, phi: 0.1 };
      setIsAutoOrbit(false);
    } else if (preset === "drone") {
      // Drone FPV (Close-up terbang dekat tebing kawah aktif)
      targetSphericalRef.current = { radius: 125, theta: 1.1, phi: 0.98 };
      setIsAutoOrbit(false);
    }
  }, []);

  const resetCamera = () => {
    applyCameraPreset("cinematic");
  };

  // Robust Native Fullscreen + CSS Fullscreen Toggle
  const toggleFullscreen = async () => {
    const elem = rootRef.current;
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (elem) {
        try {
          if (elem.requestFullscreen) {
            await elem.requestFullscreen();
          } else if (elem.webkitRequestFullscreen) {
            await elem.webkitRequestFullscreen();
          }
        } catch {
          // CSS fallback already activated via state
        }
      }
    } else {
      if (document.fullscreenElement) {
        try {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen();
          }
        } catch {
          // ignore
        }
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={rootRef}
      className={`relative w-full h-full rounded-2xl overflow-hidden border border-sky-400/30 shadow-2xl transition-all ${
        isFullscreen 
          ? "!fixed !inset-0 !z-[99999] !w-screen !h-screen !rounded-none !m-0 !p-0 bg-sky-950" 
          : "min-h-[380px] bg-sky-950"
      }`}
    >
      {/* 3D WebGL Canvas Mount */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden block" 
        style={{ width: "100%", height: "100%" }}
      />

      {/* Top Left: Volcano Info & Daylight Badge */}
      <div className={`absolute top-3 left-3 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xl text-xs flex items-center gap-2.5 transition-all ${
        activeVolcano?.isFutureProjection
          ? "bg-slate-950/90 border border-violet-500/60 shadow-violet-500/20"
          : "bg-slate-900/90 border border-sky-500/30"
      }`}>
        <div className="flex items-center gap-1.5 font-bold">
          {activeVolcano?.isFutureProjection ? (
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          ) : (
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          )}
          <span className={activeVolcano?.isFutureProjection ? "text-cyan-300" : "text-amber-400"}>
            {activeVolcano?.name || "Gunung Berapi"}
          </span>
        </div>

        {activeVolcano?.isFutureProjection && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-violet-600/40 to-cyan-500/40 text-cyan-300 border border-cyan-400/50 shadow-sm animate-pulse flex items-center gap-1">
            <Clock className="w-3 h-3 text-fuchsia-400" />
            <span>PROYEKSI ~2046</span>
          </span>
        )}

        <div className="h-3 w-px bg-slate-700" />
        <span className="text-slate-300 flex items-center gap-1">
          <Sun className="w-3.5 h-3.5 text-amber-300" />
          <span>Siang Cerah</span>
        </span>
        <div className="h-3 w-px bg-slate-700" />
        <span className="text-slate-300">
          Kolom: <strong className="text-white">{config.columnHeightKm} KM</strong>
        </span>
        <div className="h-3 w-px bg-slate-700" />
        <span className={`px-2 py-0.5 rounded font-semibold ${
          collapsed 
            ? "bg-red-500/20 text-red-400 border border-red-500/30" 
            : activeVolcano?.isFutureProjection
            ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
        }`}>
          {collapsed ? "Kaldera Kolaps" : activeVolcano?.isFutureProjection ? "Skenario Erupsi 2046" : "Kawah Aktif"}
        </span>
      </div>

      {/* Top Right: Functional Camera Preset Controls Bar */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-sky-500/30 shadow-xl">
        <button
          onClick={() => applyCameraPreset("cinematic")}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            cameraView === "cinematic"
              ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 ring-1 ring-amber-300"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
          title="Sudut Pandang Orbit Sinematik 360°"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Orbit</span>
        </button>

        <button
          onClick={() => applyCameraPreset("coastline")}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
            cameraView === "coastline"
              ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 ring-1 ring-amber-300"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
          title="Pandangan Pesisir / Dataran Rendah (Melihat Erupsi Membubung ke Langit)"
        >
          Pesisir
        </button>

        <button
          onClick={() => applyCameraPreset("topdown")}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
            cameraView === "topdown"
              ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 ring-1 ring-amber-300"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
          title="Pandangan Satelit Atas (Melihat Kawah & Awan Piroklastik Menyebar)"
        >
          Satelit
        </button>

        <button
          onClick={() => applyCameraPreset("drone")}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1 ${
            cameraView === "drone"
              ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 ring-1 ring-amber-300"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
          title="Drone FPV Jarak Dekat Kawah Aktif"
        >
          <Video className="w-3 h-3" />
          <span>Drone</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-0.5" />

        {/* Auto Orbit Toggle */}
        <button
          onClick={() => setIsAutoOrbit(!isAutoOrbit)}
          className={`px-2 py-1.5 text-xs rounded-lg font-medium transition-all ${
            isAutoOrbit 
              ? "bg-sky-600/40 text-sky-300 border border-sky-500/40" 
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
          title={isAutoOrbit ? "Matikan Rotasi Otomatis" : "Nyalakan Rotasi Otomatis"}
        >
          Auto
        </button>

        {/* Reset Camera */}
        <button
          onClick={resetCamera}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset Sudut Kamera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Toggle with Active Highlight & Exit Icon */}
        <button
          onClick={toggleFullscreen}
          className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
            isFullscreen 
              ? "bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-md ring-1 ring-amber-300" 
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
          title={isFullscreen ? "Keluar Layar Penuh (Esc)" : "Layar Penuh"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-950" /> : <Maximize2 className="w-3.5 h-3.5" />}
          {isFullscreen && <span className="text-[11px] font-black pr-0.5">Keluar</span>}
        </button>
      </div>

      {/* Bottom Hint Bar */}
      <div className="absolute bottom-2.5 left-3 text-[11px] text-slate-200/90 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/50 shadow pointer-events-none flex items-center gap-2">
        <Eye className="w-3.5 h-3.5 text-amber-400" />
        <span>Drag mouse untuk rotasi 360° • Scroll mouse untuk zoom in/out</span>
      </div>

      {/* Bottom Right: Geological 3D Topography Tag */}
      <div className="absolute bottom-2.5 right-3 text-[11px] text-sky-200/80 bg-sky-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-sky-600/40 pointer-events-none">
        3D Topografi Geomorfologi • Siang Cerah
      </div>
    </div>
  );
}
