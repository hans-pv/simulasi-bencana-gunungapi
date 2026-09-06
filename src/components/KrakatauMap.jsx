import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  calculateTsunamiRadius, 
  calculateAshRadius, 
  calculateShockwaveRadius, 
  getHazardRadiiForVei,
  calculateLocationDynamicStatus,
  WIND_DIRECTIONS
} from "../utils/physicsEngine";
import { SINGLE_WORD_RATINGS } from "../data/historicalLocations";
import { calculateLavaFlowPropagation } from "../utils/volcanoFlowEngine";
import { 
  Key, 
  Compass,
  ShieldAlert, 
  Waves, 
  CloudRain, 
  Maximize2, 
  Minimize2, 
  Navigation, 
  ChevronDown, 
  Tag, 
  AlertOctagon, 
  Layers, 
  AlertTriangle, 
  Wind, 
  Play, 
  Pause, 
  RotateCcw,
  Flame
} from "lucide-react";

// Base tile providers for Google Maps standard styles (Leaflet engine)
const TILE_PROVIDERS = {
  terrain: {
    name: "Topografi & Kontur",
    icon: "⛰️",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | OpenTopoMap',
    maxZoom: 17,
  },
  light: {
    name: "Abu-abu Light (Posko)",
    icon: "🏙️",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    maxZoom: 19,
  },
  satellite: {
    name: "Satelit / Hybrid",
    icon: "🛰️",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Citra Satelit Resolusi Tinggi",
    maxZoom: 18,
  },
  roadmap: {
    name: "Peta Jalan (Streets)",
    icon: "🗺️",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }
};

// Helper for dynamic timeline phase labels synchronized with active volcano
function getTimelinePhaseLabel(minutes, volcano) {
  if (minutes <= 10) return "Inisiasi Letusan Awal";
  if (minutes <= 45) return `Paroksismal ${volcano?.name || "Erupsi"}`;
  if (minutes <= 120) return "Tsunami & Awan Panas Menjalar";
  if (minutes <= 360) return "Sebaran Abu Vulkanik Regional";
  return "Dispersi Atmosferik Pasca-Erupsi";
}

export default function KrakatauMap({ 
  activeVolcano,
  volcanoes = [],
  onSelectVolcano,
  vei, 
  timeMinutes, 
  setTimeMinutes,
  isPlaying,
  setIsPlaying,
  selectedLocation, 
  onSelectLocation, 
  googleMapsApiKey,
  onOpenApiKeyModal,
  themeMode: _themeMode,
  showEscapeRoutes: _showEscapeRoutes = true,
  onToggleEscapeRoutes: _onToggleEscapeRoutes,
  windDirection = "B",
  setWindDirection,
  windSpeedKmH = 35,
  setWindSpeedKmH,
  magmaType = "andesite",
}) {
  const mapWrapperRef = useRef(null);
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const currentTileLayerRef = useRef(null);
  const centerMarkerRef = useRef(null);
  const isGoogleLoadedRef = useRef(false);
  const onSelectLocationRef = useRef(onSelectLocation);
  useEffect(() => {
    onSelectLocationRef.current = onSelectLocation;
  }, [onSelectLocation]);

  // States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [baseLayer, setBaseLayer] = useState("terrain");
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isVolcanoDropdownOpen, setIsVolcanoDropdownOpen] = useState(false);
  const [mapVolcanoFilter, setMapVolcanoFilter] = useState("all");

  // Manual Wind Simulation States (Fallback to internal state if not provided via props)
  const [internalWindDirection, setInternalWindDirection] = useState(windDirection || "B");
  const [internalWindSpeedKmH, setInternalWindSpeedKmH] = useState(windSpeedKmH || 35);
  const effectiveWindDirection = windDirection || internalWindDirection;
  const effectiveWindSpeed = windSpeedKmH || internalWindSpeedKmH;
  const handleSelectWindDirection = setWindDirection || setInternalWindDirection;
  const handleSelectWindSpeed = setWindSpeedKmH || setInternalWindSpeedKmH;
  const [isWindCompassOpen, setIsWindCompassOpen] = useState(false);

  // Map Element Visibility Toggles (Hide/Show)
  const [showCityNames, setShowCityNames] = useState(true);
  const [showDangerLevels, setShowDangerLevels] = useState(true);
  const [showEscapeRoutes, setShowEscapeRoutes] = useState(true);
  const [showLaharRiver, setShowLaharRiver] = useState(true);
  const [showLavaFlow, setShowLavaFlow] = useState(true);
  const [isFilterToolbarCollapsed, setIsFilterToolbarCollapsed] = useState(true);

  // Layer toggles
  const [layers, setLayers] = useState({
    pyroclastic: true,
    tsunami: true,
    ash: true,
    shockwave: true,
    markers: true,
  });

  const [mapMode, setMapMode] = useState("leaflet");



  // Physics calculated values
  const hazardRadii = getHazardRadiiForVei(vei);
  const dynamicTsunamiRadiusKm = calculateTsunamiRadius(vei, timeMinutes);
  const dynamicAshRadiusKm = calculateAshRadius(vei, timeMinutes);
  const dynamicShockwaveRadiusKm = calculateShockwaveRadius(timeMinutes);

  // Topographic Lava Flow & Lahar simulation state
  const flowSim = useMemo(() => {
    return calculateLavaFlowPropagation(activeVolcano, timeMinutes, vei, magmaType);
  }, [activeVolcano, timeMinutes, vei, magmaType]);

  // References to Leaflet dynamic overlays
  const overlaysRef = useRef({
    pyroclasticCircle: null,
    tsunamiMaxCircle: null,
    dynamicTsunamiWave: null,
    dynamicAshCloud: null,
    dynamicShockwave: null,
    markers: [],
    escapePolylines: [],
    safeHavenMarkers: [],
  });

  const volcanoCoords = useMemo(() => activeVolcano ? activeVolcano.coords : { lat: -6.1021, lng: 105.4230 }, [activeVolcano]);
  const locationsList = useMemo(() => activeVolcano ? activeVolcano.locations : [], [activeVolcano]);

  // Downwind cities count affected by directional ash plume
  const downwindCitiesCount = useMemo(() => {
    return locationsList.filter((loc) => {
      const st = calculateLocationDynamicStatus(loc, vei, timeMinutes, {
        windDirection: effectiveWindDirection,
        windSpeedKmH: effectiveWindSpeed,
      });
      return st.isCoveredByAsh && st.isDirectDownwind;
    }).length;
  }, [locationsList, vei, timeMinutes, effectiveWindDirection, effectiveWindSpeed]);

  // Google Maps Loader
  useEffect(() => {
    if (googleMapsApiKey && !isGoogleLoadedRef.current) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        isGoogleLoadedRef.current = true;
        setMapMode("google");
      };
      script.onerror = () => {
        console.warn("Failed to load Google Maps API. Fallback to Leaflet.");
        setMapMode("leaflet");
      };
      document.head.appendChild(script);
    }
  }, [googleMapsApiKey]);

  // Initialize Leaflet Map instance (Persistent single mount)
  useEffect(() => {
    if (mapMode !== "leaflet" || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }
      try {
        const map = L.map(mapContainerRef.current, {
          center: [volcanoCoords.lat, volcanoCoords.lng],
          zoom: 8,
          minZoom: 3,
          maxZoom: 18,
          zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        // Base tile layer
        const provider = TILE_PROVIDERS[baseLayer] || TILE_PROVIDERS.terrain;
        const tile = L.tileLayer(provider.url, {
          attribution: provider.attribution,
          maxZoom: provider.maxZoom,
        }).addTo(map);
        currentTileLayerRef.current = tile;

        leafletMapRef.current = map;
      } catch (err) {
        console.warn("Leaflet init handled:", err);
      }
    }

    return () => {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch {
          // ignore
        }
        leafletMapRef.current = null;
      }
    };
  }, [mapMode]);

  // Cinematic Motion Fly-To Camera Transition & Volcano Marker
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Smooth camera glide transition across Indonesia (2.5s duration)
    map.flyTo([volcanoCoords.lat, volcanoCoords.lng], 8, {
      duration: 2.5,
      easeLinearity: 0.25,
    });

    if (centerMarkerRef.current) {
      map.removeLayer(centerMarkerRef.current);
    }

    const volcanoIcon = L.divIcon({
      className: "custom-volcano-icon",
      html: `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-red-500 opacity-75"></span>
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-amber-600 border-2 border-amber-300 flex items-center justify-center text-white text-[13px] font-bold shadow-xl shadow-red-600/70">
            🌋
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const marker = L.marker([volcanoCoords.lat, volcanoCoords.lng], { icon: volcanoIcon })
      .addTo(map)
      .bindPopup(`
        <div style="color: #0f172a; font-family: sans-serif; min-width: 220px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
            <span style="font-weight: 900; font-size: 14px; color: #dc2626;">${activeVolcano?.name || "Gunung Berapi"}</span>
            <span style="font-size: 10px; font-weight: bold; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px;">VEI ${activeVolcano?.defaultVei}</span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">${activeVolcano?.year || ""} • ${activeVolcano?.province || ""}</div>
          <div style="margin-top: 6px; font-size: 11px; background: #fef2f2; padding: 4px 6px; border-radius: 6px; color: #b91c1c; border-left: 3px solid #ef4444; font-weight: 600;">
            Bahaya Utama: ${activeVolcano?.primaryHazard || "Erupsi Kolosal"}
          </div>
        </div>
      `);

    centerMarkerRef.current = marker;
  }, [activeVolcano, volcanoCoords.lat, volcanoCoords.lng]);

  // Switch Tile Layer smoothly
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || mapMode !== "leaflet") return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const provider = TILE_PROVIDERS[baseLayer] || TILE_PROVIDERS.terrain;
    const newTile = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
    }).addTo(map);
    currentTileLayerRef.current = newTile;
  }, [baseLayer, mapMode]);

  // Update Hazard Overlays, Escape Routes & Location Markers
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || mapMode !== "leaflet") return;

    const overlays = overlaysRef.current;

    // Clean old overlays
    if (overlays.pyroclasticCircle) map.removeLayer(overlays.pyroclasticCircle);
    if (overlays.tsunamiMaxCircle) map.removeLayer(overlays.tsunamiMaxCircle);
    if (overlays.dynamicTsunamiWave) map.removeLayer(overlays.dynamicTsunamiWave);
    if (overlays.dynamicAshCloud) map.removeLayer(overlays.dynamicAshCloud);
    if (overlays.dynamicShockwave) map.removeLayer(overlays.dynamicShockwave);
    
    overlays.markers.forEach((m) => map.removeLayer(m));
    overlays.markers = [];

    overlays.escapePolylines.forEach((p) => map.removeLayer(p));
    overlays.escapePolylines = [];

    overlays.safeHavenMarkers.forEach((s) => map.removeLayer(s));
    overlays.safeHavenMarkers = [];

    const center = [volcanoCoords.lat, volcanoCoords.lng];

    // 1. Pyroclastic Danger Zone (KRB III)
    if (layers.pyroclastic) {
      overlays.pyroclasticCircle = L.circle(center, {
        radius: hazardRadii.pyroclasticRadiusKm * 1000,
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.25,
        weight: 2,
        dashArray: "4, 4",
      }).addTo(map);
    }

    // 2. Directional Dynamic Ash Plume & Dispersion Cone
    if (layers.ash && dynamicAshRadiusKm > 0) {
      const windAngle = WIND_DIRECTIONS[effectiveWindDirection]?.angle ?? 270;
      const windSpeed = effectiveWindSpeed || 35;
      
      const downwindReachKm = Math.round(dynamicAshRadiusKm * (1.1 + (windSpeed / 50) * 0.7));
      const nearVentUmbrellaKm = Math.round(dynamicAshRadiusKm * 0.25);
      const halfSpreadAngle = 38;

      const plumePoints = [];
      
      // Arc 1: Downwind expansion arc (spread from windAngle - halfSpread to windAngle + halfSpread)
      const numDownwindSteps = 16;
      for (let i = 0; i <= numDownwindSteps; i++) {
        const stepAngle = (windAngle - halfSpreadAngle) + (i / numDownwindSteps) * (halfSpreadAngle * 2);
        const rad = (stepAngle * Math.PI) / 180;
        const dist = downwindReachKm * (1 - 0.12 * Math.pow((i - numDownwindSteps / 2) / (numDownwindSteps / 2), 2));
        const pLat = volcanoCoords.lat + (dist * Math.cos(rad)) / 111;
        const pLng = volcanoCoords.lng + (dist * Math.sin(rad)) / (111 * Math.cos((volcanoCoords.lat * Math.PI) / 180));
        plumePoints.push([pLat, pLng]);
      }

      // Arc 2: Near-vent explosive umbrella base
      const numBaseSteps = 16;
      for (let i = 0; i <= numBaseSteps; i++) {
        const stepAngle = (windAngle + halfSpreadAngle) + (i / numBaseSteps) * (360 - halfSpreadAngle * 2);
        const rad = (stepAngle * Math.PI) / 180;
        const pLat = volcanoCoords.lat + (nearVentUmbrellaKm * Math.cos(rad)) / 111;
        const pLng = volcanoCoords.lng + (nearVentUmbrellaKm * Math.sin(rad)) / (111 * Math.cos((volcanoCoords.lat * Math.PI) / 180));
        plumePoints.push([pLat, pLng]);
      }

      overlays.dynamicAshCloud = L.polygon(plumePoints, {
        color: "#a855f7",
        fillColor: "#9333ea",
        fillOpacity: 0.22,
        weight: 2,
        dashArray: "5, 5",
      }).addTo(map);

      overlays.dynamicAshCloud.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px; padding: 3px;">
          <b style="color: #7e22ce;">Koridor Sebaran Abu Vulkanik</b><br/>
          Arah Tiup: <b>${WIND_DIRECTIONS[effectiveWindDirection]?.name || effectiveWindDirection} (${WIND_DIRECTIONS[effectiveWindDirection]?.angle || 270}°)</b><br/>
          Kecepatan Angin: <b>${windSpeed} km/jam</b><br/>
          Jangkauan: <b>${downwindReachKm} km</b> (T+${timeMinutes}m)
        </div>
      `);
    }

    // 3. Dynamic Tsunami Wavefront (for coastal/island volcanoes)
    if (layers.tsunami && dynamicTsunamiRadiusKm > 0 && activeVolcano?.terrainType !== "stratovolcano_cone") {
      overlays.dynamicTsunamiWave = L.circle(center, {
        radius: dynamicTsunamiRadiusKm * 1000,
        color: "#06b6d4",
        fillColor: "#0284c7",
        fillOpacity: 0.14,
        weight: 3,
      }).addTo(map);
    }

    // 4. Dynamic Shockwave
    if (layers.shockwave && dynamicShockwaveRadiusKm > 0 && dynamicShockwaveRadiusKm < 2200) {
      overlays.dynamicShockwave = L.circle(center, {
        radius: dynamicShockwaveRadiusKm * 1000,
        color: "#fbbf24",
        fillOpacity: 0,
        weight: 2,
        dashArray: "6, 6",
      }).addTo(map);
    }

    // 5. Render Tsunami Escape Route Polylines & Safe Haven Markers
    if (showEscapeRoutes && locationsList.length > 0) {
      locationsList.forEach((loc) => {
        if (!loc.escapeRoute || !loc.escapeRoute.safeHavenCoords) return;

        const isLocationSelected = selectedLocation?.id === loc.id;
        const routeColor = isLocationSelected ? "#10b981" : "#059669";
        const routeWeight = isLocationSelected ? 4 : 2.5;

        // Draw Escape Polyline if routePath exists
        if (loc.escapeRoute.routePath && loc.escapeRoute.routePath.length > 1) {
          const polyline = L.polyline(loc.escapeRoute.routePath, {
            color: routeColor,
            weight: routeWeight,
            dashArray: isLocationSelected ? "6, 4" : "5, 5",
            opacity: isLocationSelected ? 0.95 : 0.75,
          }).addTo(map);

          polyline.bindTooltip(`
            <div style="font-family: sans-serif; font-size: 11px;">
              <b>Rute Evakuasi: ${loc.name}</b><br/>
              Ke: <b>${loc.escapeRoute.safeHavenName}</b><br/>
              Elevasi: <span style="color:#059669; font-weight:bold;">+${loc.escapeRoute.safeElevationM} mdpl</span> • Jarak: ${loc.escapeRoute.walkingDistanceKm} km (${loc.escapeRoute.estimatedWalkMinutes} mnt)
            </div>
          `);

          polyline.on("click", (e) => {
            if (e && e.originalEvent) {
              e.originalEvent.stopPropagation();
            }
            onSelectLocationRef.current?.(loc);
            if (leafletMapRef.current) {
              leafletMapRef.current.flyTo([loc.lat, loc.lng], 9, { duration: 1.0 });
            }
          });

          overlays.escapePolylines.push(polyline);
        }

        // Draw Safe High Ground Pin
        const safeCoords = loc.escapeRoute.safeHavenCoords;
        const safeHavenIcon = L.divIcon({
          className: "custom-safe-haven-icon",
          html: `
            <div class="group relative cursor-pointer flex flex-col items-center pointer-events-auto">
              <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-emerald-300 flex items-center justify-center text-white text-[11px] font-black shadow-lg shadow-emerald-600/50 ${
                isLocationSelected ? "ring-2 ring-amber-400 scale-125" : ""
              }">
                ▲
              </div>
              <span class="mt-0.5 px-1 py-0.2 rounded text-[9px] font-bold whitespace-nowrap bg-slate-950/90 text-emerald-300 border border-emerald-500/60 shadow pointer-events-auto cursor-pointer">
                +${loc.escapeRoute.safeElevationM}m
              </span>
            </div>
          `,
          iconSize: [60, 38],
          iconAnchor: [30, 12],
        });

        const safeMarker = L.marker([safeCoords.lat, safeCoords.lng], { icon: safeHavenIcon }).addTo(map);
        
        safeMarker.on("click", (e) => {
          if (e && e.originalEvent) {
            e.originalEvent.stopPropagation();
          }
          onSelectLocationRef.current?.(loc);
          if (leafletMapRef.current) {
            leafletMapRef.current.flyTo([safeCoords.lat, safeCoords.lng], 10, { duration: 1.0 });
          }
        });

        overlays.safeHavenMarkers.push(safeMarker);
      });
    }

    // 5B. Topographic Contour Drainage Valleys & Dynamic Magma / Lahar Flow
    if ((showLaharRiver || showLavaFlow) && volcanoCoords) {
      const flowSim = calculateLavaFlowPropagation(activeVolcano, timeMinutes, vei, magmaType);
      const activeMagma = flowSim.magma;

      flowSim.valleySimulations.forEach((vSim) => {
        // 1. Alur Lembah Sungai Pengalir Lahar Dingin Alami (Berdasarkan Kontur Geologi Lembah Terendah)
        if (showLaharRiver && vSim.laharSubPath.length >= 2) {
          const laharPolyline = L.polyline(vSim.laharSubPath, {
            color: "#2563eb",
            weight: 3.5,
            dashArray: "6, 4",
            opacity: 0.85
          }).addTo(map);

          laharPolyline.bindTooltip(`
            <div style="font-family: sans-serif; font-size: 11px; padding: 3px; max-width: 240px;">
              <b style="color: #1d4ed8; font-size: 12px;">🌊 ${vSim.valleyName}</b><br/>
              <span style="color: #64748b; font-size: 10px; display: block; margin: 2px 0;">${vSim.valleyDesc}</span>
              <div style="color: #0369a1; font-weight: 600; font-size: 10px; margin-top: 2px;">
                Elevasi: ${vSim.currentElevM} mdpl • Panjang Lembah: ${vSim.totalLengthKm} KM
              </div>
              <span style="color: #dc2626; font-weight: bold; font-size: 10px; display: block; margin-top: 2px;">
                ⚠️ Waspada Banjir Lahar Dingin (Curah Hujan &gt; 50 mm/jam)
              </span>
            </div>
          `);
          overlays.escapePolylines.push(laharPolyline);
        }

        // 2. Aliran Lava Pijar Mengikuti Kontur Lembah Terendah Sesuai Tipe Magma & Timeline
        if (showLavaFlow && vSim.isFlowActive && vSim.activeLavaSubPath.length >= 2) {
          // Heat Glow Effect (Aura Pijar Menyala)
          const lavaGlow = L.polyline(vSim.activeLavaSubPath, {
            color: activeMagma.colorHead,
            weight: 8,
            opacity: 0.4,
            lineCap: "round",
            lineJoin: "round"
          }).addTo(map);
          overlays.escapePolylines.push(lavaGlow);

          // Core Lava Stream (Aliran Inti Pijar)
          const lavaCore = L.polyline(vSim.activeLavaSubPath, {
            color: activeMagma.colorBody,
            weight: 4.5,
            opacity: 0.95,
            lineCap: "round",
            lineJoin: "round"
          }).addTo(map);
          overlays.escapePolylines.push(lavaCore);

          // Flow Front Head (Ujung Kepala Aliran Bergerak Aktif)
          if (vSim.frontPoint) {
            const frontIcon = L.divIcon({
              className: "lava-flow-front-marker",
              html: `
                <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                  <span style="position: absolute; width: 22px; height: 22px; border-radius: 9999px; background-color: ${activeMagma.colorHead}; opacity: 0.75; animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
                  <div style="width: 14px; height: 14px; border-radius: 9999px; background-color: ${activeMagma.colorHead}; border: 2px solid #ffffff; box-shadow: 0 0 12px ${activeMagma.colorHead};"></div>
                </div>
              `,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            });

            const frontMarker = L.marker(vSim.frontPoint, { icon: frontIcon, zIndexOffset: 600 }).addTo(map);
            frontMarker.bindPopup(`
              <div style="color: #0f172a; font-family: sans-serif; min-width: 240px; padding: 3px;">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
                  <span style="font-weight: 900; font-size: 13px; color: ${activeMagma.colorBody};">
                    🔥 Front Aliran Lava (${activeMagma.name.split(" ")[0]})
                  </span>
                  <span style="font-size: 10px; font-weight: bold; background: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; border: 1px solid #fed7aa;">
                    T+${timeMinutes}m (VEI ${vei})
                  </span>
                </div>
                <div style="font-size: 11px; line-height: 1.5; color: #334155;">
                  <div><b>Lembah Kontur:</b> ${vSim.valleyName}</div>
                  <div><b>Jarak dari Kawah:</b> <span style="font-weight: bold; color: #b45309;">${vSim.reachedDistanceKm} KM</span> (Total Alur: ${vSim.totalLengthKm} KM)</div>
                  <div><b>Elevasi Dasar Lembah:</b> <span style="font-weight: bold; color: #0284c7;">${vSim.currentElevM} mdpl</span></div>
                  <div><b>Kecepatan Alir:</b> <span style="font-weight: bold; color: #16a34a;">${vSim.currentSpeedKmH} km/jam</span></div>
                  <div><b>Suhu Permukaan:</b> <span style="font-weight: bold; color: #dc2626;">${vSim.currentTempC}°C</span></div>
                </div>
                <div style="margin-top: 6px; padding: 5px 7px; border-radius: 6px; background: #fef2f2; border-left: 3px solid #ef4444; font-size: 10px; color: #991b1b; font-weight: 600;">
                  ${activeMagma.hazardDetail}
                </div>
              </div>
            `);
            overlays.safeHavenMarkers.push(frontMarker);
          }
        }
      });
    }

    // 6. Render City Location Markers with Rich Popups
    if (layers.markers && locationsList.length > 0) {
      locationsList.forEach((loc) => {
        const dynamicStatus = calculateLocationDynamicStatus(loc, vei, timeMinutes, {
          windDirection: effectiveWindDirection,
          windSpeedKmH: effectiveWindSpeed,
        });
        const isSelected = selectedLocation?.id === loc.id;

        // Dynamic Rating metadata synchronized with VEI
        const ratingKey = dynamicStatus.hazardLevel || "WASPADA";
        const ratingConfig = SINGLE_WORD_RATINGS[ratingKey] || SINGLE_WORD_RATINGS.WASPADA;

        let pinColor = ratingConfig.color;
        if (dynamicStatus.inPyroclasticZone) pinColor = "#dc2626";

        let labelHtml = "";
        if (showCityNames || showDangerLevels) {
          labelHtml = `
            <div class="mt-1 flex items-center gap-1 pointer-events-auto cursor-pointer transition-all">
              ${showCityNames ? `
                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight whitespace-nowrap bg-slate-950/90 text-slate-200 border border-slate-700/80 shadow-md hover:border-amber-400 pointer-events-auto cursor-pointer">
                  ${loc.name}
                </span>
              ` : ""}
              ${showDangerLevels ? `
                <span style="background-color: ${pinColor};" class="px-1 py-0.2 rounded text-[8px] font-extrabold text-white uppercase shadow pointer-events-auto cursor-pointer">
                  ${ratingKey}
                </span>
              ` : ""}
            </div>
          `;
        }

        const markerIcon = L.divIcon({
          className: "custom-place-marker",
          html: `
            <div class="group relative cursor-pointer flex flex-col items-center btn-premium pointer-events-auto">
              <div style="background-color: ${pinColor}; box-shadow: 0 0 ${isSelected ? "18px" : "6px"} ${pinColor};" 
                   class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 ${isSelected ? "border-white scale-125 ring-2 ring-amber-400" : "border-slate-900"} flex items-center justify-center text-white text-[9px] font-black transition-all pointer-events-auto cursor-pointer">
                •
              </div>
              ${labelHtml}
            </div>
          `,
          iconSize: [140, 56],
          iconAnchor: [70, 10],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon }).addTo(map);

        marker.on("click", (e) => {
          if (e && e.originalEvent) {
            e.originalEvent.stopPropagation();
          }
          onSelectLocationRef.current?.(loc);
          if (leafletMapRef.current) {
            leafletMapRef.current.flyTo([loc.lat, loc.lng], 9, { duration: 1.0 });
          }
        });

        overlays.markers.push(marker);
      });
    }
  }, [
    vei, 
    timeMinutes, 
    layers, 
    selectedLocation, 
    mapMode, 
    hazardRadii, 
    dynamicTsunamiRadiusKm, 
    dynamicAshRadiusKm, 
    dynamicShockwaveRadiusKm, 
    activeVolcano, 
    showEscapeRoutes,
    showCityNames,
    showDangerLevels,
    showLaharRiver,
    showLavaFlow,
    magmaType,
    locationsList,
    volcanoCoords,
    isFullscreen,
    effectiveWindDirection,
    effectiveWindSpeed
  ]);

  // Smooth flyTo when selectedLocation changes
  useEffect(() => {
    if (selectedLocation && leafletMapRef.current) {
      leafletMapRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 10, {
        duration: 1.2,
      });
    }
  }, [selectedLocation]);

  // Fullscreen handlers
  const toggleFullscreen = () => {
    const elem = mapWrapperRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
        }
      }, 200);
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  // Automatic Map Canvas Re-align on Container Resizing (e.g. Switching to Peta / Split view)
  useEffect(() => {
    if (!mapWrapperRef.current) return;
    const ro = new ResizeObserver(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    });
    ro.observe(mapWrapperRef.current);
    return () => {
      ro.disconnect();
    };
  }, []);

  const handleRecenter = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([volcanoCoords.lat, volcanoCoords.lng], 8, { duration: 1.2 });
    }
  };

  return (
    <div 
      ref={mapWrapperRef}
      className={`relative w-full h-full min-h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col transition-all ${
        isFullscreen ? "map-fullscreen-wrapper" : ""
      }`}
    >
      {/* Map Canvas Mount */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Unified Navigation & Control Bar Overlay */}
      <div 
        className="absolute top-3 inset-x-3 z-30 pointer-events-none flex flex-col gap-2"
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          {/* Left Block: Volcano Selector & Core Navigation */}
          <div 
            className="pointer-events-auto flex items-center gap-1.5 flex-wrap"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Volcano Combobox Selector with Universal Synchronization */}
            <div className="relative">
              <button
                onClick={() => setIsVolcanoDropdownOpen(!isVolcanoDropdownOpen)}
                className={`bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-xl hover:bg-slate-800 transition btn-premium ${
                  activeVolcano?.isFutureProjection
                    ? "border-violet-500/80 text-cyan-200 ring-1 ring-cyan-400/50 shadow-violet-950/40"
                    : "border-slate-700/80 text-slate-100"
                }`}
                title="Pilih Simulasi Gunung Berapi Indonesia (Peta & 3D)"
              >
                <span className="text-base leading-none">
                  {activeVolcano?.isFutureProjection ? "🔮" : "🌋"}
                </span>
                <div className="flex flex-col items-start text-left leading-tight">
                  <span className={`text-xs font-black ${
                    activeVolcano?.isFutureProjection ? "text-cyan-300" : "text-amber-400"
                  }`}>
                    {activeVolcano?.name || "Pilih Gunung"}
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-medium">
                    {activeVolcano?.isFutureProjection ? "Proyeksi ~2046" : activeVolcano?.year} • VEI {activeVolcano?.defaultVei}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isVolcanoDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isVolcanoDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-[330px] max-h-[420px] overflow-y-auto bg-slate-900/98 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl p-2.5 space-y-2 z-40 animate-modal-enter scrollbar-thin">
                  {/* Dropdown Header */}
                  <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 px-1 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm">🌋</span>
                      <span className="text-slate-200">Katalog Simulasi Gunung</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[9.5px]">20 Skenario</span>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-lg p-0.5 text-[10px] font-bold gap-0.5">
                    <button
                      onClick={() => setMapVolcanoFilter("all")}
                      className={`flex-1 py-1 rounded transition text-center ${
                        mapVolcanoFilter === "all"
                          ? "bg-slate-700 text-white font-black shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Semua (20)
                    </button>
                    <button
                      onClick={() => setMapVolcanoFilter("future")}
                      className={`flex-1 py-1 rounded transition text-center flex items-center justify-center gap-1 ${
                        mapVolcanoFilter === "future"
                          ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black shadow-sm"
                          : "text-cyan-300 hover:text-cyan-100"
                      }`}
                    >
                      <span>🔮 2046 (5)</span>
                    </button>
                    <button
                      onClick={() => setMapVolcanoFilter("historical")}
                      className={`flex-1 py-1 rounded transition text-center flex items-center justify-center gap-1 ${
                        mapVolcanoFilter === "historical"
                          ? "bg-gradient-to-r from-red-600 to-amber-600 text-white font-black shadow-sm"
                          : "text-amber-400 hover:text-amber-200"
                      }`}
                    >
                      <span>🌋 Historis (15)</span>
                    </button>
                  </div>

                  {/* Volcano List */}
                  <div className="space-y-1 pt-0.5">
                    {(volcanoes || [])
                      .filter((v) => {
                        if (mapVolcanoFilter === "future") return v.isFutureProjection;
                        if (mapVolcanoFilter === "historical") return !v.isFutureProjection;
                        return true;
                      })
                      .map((v) => {
                        const isCurrent = v.id === activeVolcano?.id;
                        const isFuture = v.isFutureProjection;

                        return (
                          <button
                            key={v.id}
                            onClick={() => {
                              onSelectVolcano?.(v);
                              setIsVolcanoDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition flex items-center gap-2.5 border ${
                              isCurrent
                                ? isFuture
                                  ? "bg-violet-950/60 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50"
                                  : "bg-amber-500/20 border-amber-400 text-white shadow-md ring-1 ring-amber-400/40"
                                : isFuture
                                ? "bg-slate-950/70 hover:bg-slate-800/90 border-violet-900/50 text-slate-300 hover:text-white"
                                : "bg-slate-950/60 hover:bg-slate-800 border-slate-800/70 text-slate-300"
                            }`}
                          >
                            {/* Left VEI Badge */}
                            <div className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center shrink-0 border font-mono ${
                              isCurrent 
                                ? isFuture
                                  ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white border-cyan-300 font-black shadow-sm"
                                  : "bg-amber-500 text-slate-950 border-amber-300 font-black shadow-sm" 
                                : isFuture
                                ? "bg-slate-900 border-violet-700/60 text-cyan-300 font-bold"
                                : "bg-slate-900 border-slate-700 text-amber-400 font-bold"
                            }`}>
                              <span className="text-[7px] uppercase tracking-tighter leading-none">VEI</span>
                              <span className="text-[11px] font-black leading-none mt-0.5">{v.defaultVei}</span>
                            </div>

                            {/* Stack: Title on top-left, year top-right, province below */}
                            <div className="flex flex-col min-w-0 flex-1 text-left">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`font-black text-xs block truncate text-left ${
                                  isCurrent 
                                    ? isFuture ? "text-cyan-300" : "text-amber-400"
                                    : "text-white"
                                }`}>
                                  {v.name}
                                </span>
                                <span className={`text-[9px] font-mono font-bold shrink-0 px-1 py-0.2 rounded ${
                                  isFuture 
                                    ? "bg-violet-900/60 text-cyan-300 border border-violet-600/40"
                                    : "text-slate-400"
                                }`}>
                                  {isFuture ? "🔮 ~2046" : v.year}
                                </span>
                              </div>
                              <span className="text-[9.5px] text-slate-400 block truncate text-left mt-0.5">
                                {v.province}
                              </span>
                            </div>

                            {isCurrent && (
                              <span className={`text-xs font-black shrink-0 ${isFuture ? "text-cyan-400" : "text-amber-400"}`}>
                                ●
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation & Action Buttons Toolbar */}
            <div className="flex items-center bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-xl gap-1">
              {/* Recenter Button */}
              <button
                onClick={handleRecenter}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 btn-premium transition"
                title={`Pusatkan ke ${activeVolcano?.name}`}
              >
                <Compass className="w-4 h-4 text-amber-400" />
              </button>

              {/* Fullscreen Button - Highlighted, prominent & unblocked */}
              <button
                onClick={toggleFullscreen}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 shadow-md btn-premium ${
                  isFullscreen 
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-amber-500/30" 
                    : "bg-slate-800/90 text-amber-300 border-amber-500/40 hover:text-white hover:bg-amber-600 hover:border-amber-400"
                }`}
                title={isFullscreen ? "Keluar Layar Penuh (Esc)" : "Mode Layar Penuh Peta"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="font-bold text-[11px]">{isFullscreen ? "Keluar FS" : "Fullscreen"}</span>
              </button>

              {/* Google Maps API Key Button */}
              <button
                onClick={onOpenApiKeyModal}
                className="px-2 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition flex items-center gap-1 btn-premium"
                title="Konfigurasi Google Maps API Key"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-[11px]">{googleMapsApiKey ? "Google Maps" : "API Key"}</span>
              </button>
            </div>
          </div>

          {/* Right Block: Wind, Style, Hazards & Visibility */}
          <div 
            className="pointer-events-auto flex items-center gap-1.5 flex-wrap justify-end"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Manual Wind Compass Control Button & Panel */}
            <div className="relative">
              <button
                onClick={() => setIsWindCompassOpen(!isWindCompassOpen)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-xl transition btn-premium ${
                  isWindCompassOpen
                    ? "bg-purple-600 text-white border-purple-400 shadow-purple-600/40"
                    : "bg-slate-900/95 backdrop-blur-md border-purple-500/40 text-purple-300 hover:text-white hover:bg-slate-800"
                }`}
                title="Simulasi Arah Mata Angin & Sebaran Abu Vulkanik"
              >
                <Wind className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                <span>Angin: {WIND_DIRECTIONS[effectiveWindDirection]?.key} ({effectiveWindSpeed} km/h)</span>
                {downwindCitiesCount > 0 && (
                  <span className="bg-purple-500 text-white text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full">
                    {downwindCitiesCount}
                  </span>
                )}
              </button>

              {/* Wind Compass Interactive Floating Modal */}
              {isWindCompassOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900/98 backdrop-blur-2xl border-2 border-purple-500/70 rounded-2xl shadow-2xl p-3.5 space-y-3 animate-modal-enter z-40 text-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs">
                      <Wind className="w-4 h-4" />
                      <span>SIMULASI ARAH ANGIN ABU</span>
                    </div>
                    <button
                      onClick={() => setIsWindCompassOpen(false)}
                      className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Direction Indicator Banner */}
                  <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-2 text-center text-xs">
                    <div className="text-[10px] uppercase font-bold text-purple-400">Vektor Tiupan Abu Vulkanik:</div>
                    <div className="text-sm font-black text-white mt-0.5 flex items-center justify-center gap-1.5">
                      <span className="text-amber-400 text-base">{WIND_DIRECTIONS[effectiveWindDirection]?.arrow}</span>
                      <span>{WIND_DIRECTIONS[effectiveWindDirection]?.headingText}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      Kecepatan: <strong className="text-purple-300 font-mono">{effectiveWindSpeed} km/jam</strong> • Plume T+{timeMinutes}m
                    </div>
                  </div>

                  {/* 8-Direction Compass Rose Interactive Grid */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                      Pilih 8 Arah Mata Angin:
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-mono font-bold">
                      {/* Row 1: BL (315°), U (0°), TL (45°) */}
                      <button
                        onClick={() => handleSelectWindDirection("BL")}
                        className={`p-2 rounded-xl border transition flex flex-col items-center justify-center ${
                          effectiveWindDirection === "BL"
                            ? "bg-purple-600 border-purple-300 text-white font-black shadow"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-xs">↖ BL</span>
                        <span className="text-[9px] text-slate-400 font-normal">315°</span>
                      </button>

                      <button
                        onClick={() => handleSelectWindDirection("U")}
                        className={`p-2 rounded-xl border transition flex flex-col items-center justify-center ${
                          effectiveWindDirection === "U"
                            ? "bg-purple-600 border-purple-300 text-white font-black shadow"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-xs">↑ U</span>
                        <span className="text-[9px] text-slate-400 font-normal">0°</span>
                      </button>

                      <button
                        onClick={() => handleSelectWindDirection("TL")}
                        className={`p-2 rounded-xl border transition flex flex-col items-center justify-center ${
                          effectiveWindDirection === "TL"
                            ? "bg-purple-600 border-purple-300 text-white font-black shadow"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-xs">↗ TL</span>
                        <span className="text-[9px] text-slate-400 font-normal">45°</span>
                      </button>

                      {/* Row 2: B (270°), Center needle, T (90°) */}
                      <button
                        onClick={() => handleSelectWindDirection("B")}
                        className={`p-2 rounded-xl border transition flex flex-col items-center justify-center ${
                          effectiveWindDirection === "B"
                            ? "bg-purple-600 border-purple-300 text-white font-black shadow"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-xs">← B</span>
                        <span className="text-[9px] text-slate-400 font-normal">270°</span>
                      </button>

                      <div className="p-1 rounded-xl bg-slate-950 border border-purple-500/40 flex items-center justify-center text-center">
                        <div 
                          className="w-7 h-7 rounded-full bg-purple-900/60 border border-purple-400 flex items-center justify-center text-amber-300 transition-transform duration-500"
                          style={{ transform: `rotate(${WIND_DIRECTIONS[effectiveWindDirection]?.angle || 0}deg)` }}
                        >
                          ▲
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectWindDirection("T")}
                        className={`p-2 rounded-xl border transition flex flex-col items-center justify-center ${
                          effectiveWindDirection === "T"
                            ? "bg-purple-600 border-purple-300 text-white font-black shadow"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-xs">→ T</span>
                        <span className="text-[9px] text-slate-400 font-normal">90°</span>
                      </button>

                      {/* Row 3: BD (225°), S (180°), TG (135°) */}
                      <button
                        onClick={() => handleSelectWindDirection("BD")}
                        className={`p-2 rounded-xl border transition flex flex-col items-center justify-center ${
                          effectiveWindDirection === "BD"
                            ? "bg-purple-600 border-purple-300 text-white font-black shadow"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-xs">↙ BD</span>
                        <span className="text-[9px] text-slate-400 font-normal">225°</span>
                      </button>

                      <button
                        onClick={() => handleSelectWindDirection("S")}
                        className={`p-2 rounded-xl border transition flex flex-col items-center justify-center ${
                          effectiveWindDirection === "S"
                            ? "bg-purple-600 border-purple-300 text-white font-black shadow"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-xs">↓ S</span>
                        <span className="text-[9px] text-slate-400 font-normal">180°</span>
                      </button>

                      <button
                        onClick={() => handleSelectWindDirection("TG")}
                        className={`p-2 rounded-xl border transition flex flex-col items-center justify-center ${
                          effectiveWindDirection === "TG"
                            ? "bg-purple-600 border-purple-300 text-white font-black shadow"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-xs">↘ TG</span>
                        <span className="text-[9px] text-slate-400 font-normal">135°</span>
                      </button>
                    </div>
                  </div>

                  {/* Wind Speed Scrubber */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Kecepatan Angin:</span>
                      <span className="text-purple-300 font-mono font-black">{effectiveWindSpeed} km/jam</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={effectiveWindSpeed}
                      onChange={(e) => handleSelectWindSpeed(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Quick Monsoon Presets */}
                  <div className="pt-1 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Preset Musim Angin Indonesia:
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-medium">
                      <button
                        onClick={() => {
                          handleSelectWindDirection("T");
                          handleSelectWindSpeed(45);
                        }}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-left transition"
                      >
                        <div className="font-bold text-slate-200">Monsun Barat</div>
                        <div className="text-[9px] text-slate-400">Tiup ke Timur (90°)</div>
                      </button>
                      <button
                        onClick={() => {
                          handleSelectWindDirection("B");
                          handleSelectWindSpeed(35);
                        }}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-left transition"
                      >
                        <div className="font-bold text-slate-200">Monsun Timur</div>
                        <div className="text-[9px] text-slate-400">Tiup ke Barat (270°)</div>
                      </button>
                    </div>
                  </div>

                  {/* Downwind Risk Summary */}
                  <div className="p-2 rounded-xl bg-purple-900/20 border border-purple-500/40 text-[11px] text-purple-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>{downwindCitiesCount} Kota</strong> berada di jalur koridor abu pekat arah {effectiveWindDirection}!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Google Maps Standard Layer Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
                className="bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 shadow-xl hover:bg-slate-800 transition btn-premium"
                title="Pilih Gaya Peta Standar"
              >
                <span className="text-sm">{TILE_PROVIDERS[baseLayer]?.icon || "🗺️"}</span>
                <span className="hidden sm:inline">{TILE_PROVIDERS[baseLayer]?.name || "Gaya Peta"}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLayerMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-1.5 space-y-1 animate-modal-enter z-30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800">
                    Gaya Peta Standar Google Maps:
                  </div>
                  {Object.entries(TILE_PROVIDERS).map(([key, provider]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setBaseLayer(key);
                        setIsLayerMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                        baseLayer === key 
                          ? "bg-amber-500 text-slate-950 font-bold" 
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{provider.icon}</span>
                        <span>{provider.name}</span>
                      </div>
                      {baseLayer === key && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hazard Layers Filter Buttons */}
            <div className="bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setLayers((prev) => ({ ...prev, pyroclastic: !prev.pyroclastic }))}
                className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold transition btn-premium ${
                  layers.pyroclastic ? "bg-red-500/25 text-red-400 border border-red-500/50" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                }`}
                title="Zona Awan Panas & Piroklastik"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden lg:inline text-[11px]">Piroklastik</span>
              </button>

              <button
                onClick={() => setLayers((prev) => ({ ...prev, tsunami: !prev.tsunami }))}
                className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold transition btn-premium ${
                  layers.tsunami ? "bg-cyan-500/25 text-cyan-400 border border-cyan-500/50" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                }`}
                title="Gelombang Tsunami Vulkanik"
              >
                <Waves className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden lg:inline text-[11px]">Tsunami</span>
              </button>

              <button
                onClick={() => setLayers((prev) => ({ ...prev, ash: !prev.ash }))}
                className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold transition btn-premium ${
                  layers.ash ? "bg-purple-500/25 text-purple-400 border border-purple-500/50" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                }`}
                title="Sebaran Abu Vulkanik Tephra"
              >
                <CloudRain className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden lg:inline text-[11px]">Abu</span>
              </button>

              <button
                onClick={() => setShowLaharRiver((prev) => !prev)}
                className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold transition btn-premium ${
                  showLaharRiver ? "bg-blue-500/25 text-blue-400 border border-blue-500/50" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                }`}
                title="Alur Bahaya Banjir Lahar Dingin di Lembah Sungai"
              >
                <Waves className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden lg:inline text-[11px]">Lahar</span>
              </button>

              <button
                onClick={() => setShowLavaFlow((prev) => !prev)}
                className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold transition btn-premium ${
                  showLavaFlow ? "bg-orange-500/25 text-orange-400 border border-orange-500/50" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                }`}
                title="Simulasi Aliran Lava Pijar Topografi"
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden lg:inline text-[11px]">Lava</span>
              </button>
            </div>

            {/* Collapsible Visibility Toolbar (Nama Kota, Level Bahaya, Rute Aman) */}
            <div className="flex items-center bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-xl transition-all">
              <button
                onClick={() => setIsFilterToolbarCollapsed(!isFilterToolbarCollapsed)}
                className={`px-2 py-1 rounded-lg transition flex items-center gap-1 text-xs font-semibold ${
                  !isFilterToolbarCollapsed ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title={isFilterToolbarCollapsed ? "Tampilkan Filter Label & Rute" : "Sembunyikan Filter Label"}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Filter</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${!isFilterToolbarCollapsed ? "rotate-180" : ""}`} />
              </button>

              {!isFilterToolbarCollapsed && (
                <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
                  {/* Toggle Nama Kota */}
                  <button
                    onClick={() => setShowCityNames(!showCityNames)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 btn-premium ${
                      showCityNames
                        ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                    }`}
                    title="Tampilkan / Sembunyikan Label Nama Kota"
                  >
                    <Tag className={`w-3.5 h-3.5 ${showCityNames ? "text-amber-400" : "text-slate-500"}`} />
                    <span className="hidden md:inline text-[11px]">Kota</span>
                  </button>

                  {/* Toggle Level Bahaya */}
                  <button
                    onClick={() => setShowDangerLevels(!showDangerLevels)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 btn-premium ${
                      showDangerLevels
                        ? "bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                    }`}
                    title="Tampilkan / Sembunyikan Badge Level Bahaya"
                  >
                    <AlertOctagon className={`w-3.5 h-3.5 ${showDangerLevels ? "text-red-400" : "text-slate-500"}`} />
                    <span className="hidden md:inline text-[11px]">Bahaya</span>
                  </button>

                  {/* Toggle Rute Aman */}
                  <button
                    onClick={() => setShowEscapeRoutes(!showEscapeRoutes)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 btn-premium ${
                      showEscapeRoutes
                        ? "bg-emerald-600/90 text-white border border-emerald-400/80 shadow-emerald-600/30"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                    }`}
                    title="Tampilkan / Sembunyikan Rute Evakuasi & Ketinggian Aman"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${showEscapeRoutes ? "text-white" : "text-slate-500"}`} />
                    <span className="hidden md:inline text-[11px]">Rute</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Timeline Simulation Widget (Synchronized with Selected Volcano) */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center">
        <div className="bg-slate-900/95 backdrop-blur-xl px-3 py-2 rounded-2xl border border-slate-700/90 shadow-2xl flex flex-wrap sm:flex-nowrap items-center gap-2.5 text-slate-200">
          {/* Play / Pause Toggle Button */}
          <button
            onClick={() => setIsPlaying && setIsPlaying(!isPlaying)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-lg font-bold ${
              isPlaying
                ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/25 ring-2 ring-amber-400/50 animate-pulse"
                : "bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-red-500/25 hover:brightness-110"
            }`}
            title={isPlaying ? "Jeda Simulasi Timeline" : "Mulai Simulasi Timeline"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            )}
          </button>

          {/* Volcano & Dynamic Phase Info */}
          <div className="flex flex-col text-left min-w-0 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-400 font-mono tracking-tight">
                T+{timeMinutes}m
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                ({Math.floor(timeMinutes / 60)}j {timeMinutes % 60}m)
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-amber-300 border border-amber-500/30 uppercase">
                {activeVolcano?.name?.replace("Gunung ", "") || "Simulasi"}
              </span>
            </div>
            <span className="text-[10px] text-slate-300 truncate max-w-[140px] sm:max-w-[200px] mt-0.5 font-medium">
              {getTimelinePhaseLabel(timeMinutes, activeVolcano)}
            </span>
          </div>

          {/* Scrubber Range & Step Controls */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700/70">
            <input
              type="range"
              min="0"
              max="720"
              step="5"
              value={timeMinutes}
              onChange={(e) => setTimeMinutes && setTimeMinutes(Number(e.target.value))}
              className="w-20 sm:w-28 accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              title="Geser timeline letusan"
            />
            <button
              onClick={() => {
                if (setIsPlaying) setIsPlaying(false);
                if (setTimeMinutes) setTimeMinutes(0);
              }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reset Timeline ke T+0"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              onClick={() => setTimeMinutes && setTimeMinutes(Math.max(0, timeMinutes - 15))}
              className="px-1.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-300 hover:text-white transition-colors"
              title="Mundur 15 Menit"
            >
              -15m
            </button>
            <button
              onClick={() => setTimeMinutes && setTimeMinutes(Math.min(720, timeMinutes + 15))}
              className="px-1.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-300 hover:text-white transition-colors"
              title="Maju 15 Menit"
            >
              +15m
            </button>

            {/* Live Lava Flow Extent Indicator */}
            {showLavaFlow && timeMinutes > 0 && flowSim.maxFrontDistanceKm > 0 && (
              <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-700/70 text-[10px] shrink-0">
                <Flame className="w-3.5 h-3.5" style={{ color: flowSim.magma.colorHead }} />
                <span className="font-bold" style={{ color: flowSim.magma.colorHead }}>
                  {flowSim.magma.name.split(" ")[0]}:
                </span>
                <span className="text-amber-300 font-mono font-black">
                  {flowSim.maxFrontDistanceKm} KM
                </span>
                <span className="text-slate-400 text-[9px]">
                  (~{flowSim.avgCurrentSpeedKmH} km/j)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
