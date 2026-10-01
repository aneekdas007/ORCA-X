import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  Radio 
} from 'lucide-react';
import type { RouteComparisonData } from '../../types';

interface MarineMapProps {
  scenarioId: string;
  routeData?: RouteComparisonData[];
  selectedRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
}

export const MarineMap: React.FC<MarineMapProps> = ({
  scenarioId,
  routeData: _routeData,
  selectedRouteId = 'route-a',
  onSelectRoute
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [activeLayers, setActiveLayers] = useState({
    bathymetry: true,
    windVectors: true,
    swell: true,
    routes: true,
  });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ lat: string; lng: string; depth: number } | null>(null);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoom(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    let lat: string;
    let lng: string;
    let depth: number;

    if (scenarioId === 'scenario2') {
      // Kochi: Arabian sea on left (west), land on right (east)
      lat = (10.15 - y * 0.25).toFixed(3);
      lng = (75.85 + x * 0.40).toFixed(3);
      const oceanDist = Math.max(0, 1 - x);
      depth = Math.max(6, Math.round(oceanDist * oceanDist * 140 + 8));
    } else if (scenarioId === 'scenario3') {
      // Visakhapatnam: Coastline runs SW to NE, deep water on SE (right/bottom)
      lat = (17.82 - y * 0.25).toFixed(3);
      lng = (83.18 + x * 0.35).toFixed(3);
      depth = Math.max(8, Math.round(Math.pow(x * 0.7 + (1 - y) * 0.3, 2) * 120 + 10));
    } else {
      // Paradip: Land on left (west), ocean on right (east)
      lat = (20.42 - y * 0.36).toFixed(3);
      lng = (86.62 + x * 0.54).toFixed(3);
      depth = Math.max(5, Math.round(x * x * 128 + 6));
    }

    setCursorPos({ lat, lng, depth });
  };

  const getSectorMeta = () => {
    switch (scenarioId) {
      case 'scenario2':
        return {
          title: 'Kochi Offshore Corridor (9°58\'N, 76°14\'E)',
          sea: 'Arabian Sea • Malabar Shelf',
          windLabel: 'Wind (NW)',
          portName: 'Kochi Port & Fairway',
          coords: "9°58'N, 76°14'E",
        };
      case 'scenario3':
        return {
          title: 'Visakhapatnam Roadstead (17°41\'N, 83°17\'E)',
          sea: 'Central Bay of Bengal • Andhra Coast',
          windLabel: 'Wind (SSW)',
          portName: 'Visakhapatnam Outer Harbour',
          coords: "17°41'N, 83°17'E",
        };
      default:
        return {
          title: 'Paradip Coastal Sector (20°15\'N, 86°40\'E)',
          sea: 'North Bay of Bengal • Odisha Shelf',
          windLabel: 'Wind (ENE)',
          portName: 'Paradip Port & Basin',
          coords: "20°15'N, 86°40'E",
        };
    }
  };

  const meta = getSectorMeta();

  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] overflow-hidden shadow-xs relative flex flex-col text-[#18303F]">
      {/* Top Map Header & Controls */}
      <div className="p-3 bg-[#F7F9FA] border-b border-[#D9E2E8] flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2]">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#12304A] tracking-wide">
              Hydrographic Situational Map
            </span>
            <span className="text-[10px] text-[#61717D] font-mono ml-2">
              {meta.title}
            </span>
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1 text-[10px]">
          <button
            onClick={() => toggleLayer('bathymetry')}
            className={`px-2 py-1 rounded-md border transition-colors cursor-pointer font-medium ${
              activeLayers.bathymetry
                ? 'bg-[#21618C] border-[#21618C] text-white'
                : 'bg-[#FFFFFF] border-[#D9E2E8] text-[#61717D] hover:bg-[#F0F4F7]'
            }`}
          >
            Bathymetry
          </button>
          <button
            onClick={() => toggleLayer('windVectors')}
            className={`px-2 py-1 rounded-md border transition-colors cursor-pointer font-medium ${
              activeLayers.windVectors
                ? 'bg-[#21618C] border-[#21618C] text-white'
                : 'bg-[#FFFFFF] border-[#D9E2E8] text-[#61717D] hover:bg-[#F0F4F7]'
            }`}
          >
            {meta.windLabel}
          </button>
          <button
            onClick={() => toggleLayer('swell')}
            className={`px-2 py-1 rounded-md border transition-colors cursor-pointer font-medium ${
              activeLayers.swell
                ? 'bg-[#21618C] border-[#21618C] text-white'
                : 'bg-[#FFFFFF] border-[#D9E2E8] text-[#61717D] hover:bg-[#F0F4F7]'
            }`}
          >
            Swell State
          </button>
          {scenarioId === 'scenario2' && (
            <button
              onClick={() => toggleLayer('routes')}
              className={`px-2 py-1 rounded-md border transition-colors cursor-pointer font-medium ${
                activeLayers.routes
                  ? 'bg-[#1E824C] border-[#1E824C] text-white'
                  : 'bg-[#FFFFFF] border-[#D9E2E8] text-[#61717D] hover:bg-[#F0F4F7]'
              }`}
            >
              Corridors
            </button>
          )}
        </div>
      </div>

      {/* Main Vector Cartography Surface — Authentic Nautical Chart Styling */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setCursorPos(null); setActiveTooltip(null); }}
        className="relative w-full h-[360px] sm:h-[420px] bg-[#D4E8F0] overflow-hidden select-none cursor-crosshair"
      >
        <div
          className="w-full h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Nautical Depth Gradients */}
              <linearGradient id="nauticalOcean" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E6F2F7" />
                <stop offset="35%" stopColor="#D4E8F0" />
                <stop offset="70%" stopColor="#B3D7E5" />
                <stop offset="100%" stopColor="#8ABFCF" />
              </linearGradient>

              {/* Coastal Landform */}
              <linearGradient id="landform" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E5EDE9" />
                <stop offset="100%" stopColor="#DBE6E0" />
              </linearGradient>

              <pattern id="nauticalGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#A9C7D7" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>

              <pattern id="hazardHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#C58A2B" strokeWidth="1.5" strokeOpacity="0.4" />
              </pattern>
            </defs>

            {/* Base Ocean Background */}
            <rect width="800" height="500" fill="url(#nauticalOcean)" />
            <rect width="800" height="500" fill="url(#nauticalGrid)" />

            {/* ========================================================
                SCENARIO 1: PARADIP, ODISHA (East Coast / Bay of Bengal)
               ======================================================== */}
            {scenarioId === 'scenario1' && (
              <g className="paradip-cartography">
                {/* Depth Contours (Isobaths) */}
                {activeLayers.bathymetry && (
                  <g className="bathymetry-layer">
                    <path d="M 120 0 Q 180 140 210 260 T 260 500" fill="none" stroke="#5F97AE" strokeWidth="1" strokeDasharray="4 3" />
                    <text x="185" y="215" fill="#3D7187" fontSize="8" fontFamily="sans-serif" fontWeight="bold">10m</text>

                    <path d="M 220 0 Q 300 160 340 300 T 400 500" fill="none" stroke="#4A849C" strokeWidth="1.2" />
                    <text x="315" y="265" fill="#2E647A" fontSize="8" fontFamily="sans-serif" fontWeight="bold">25m Shelf</text>

                    <path d="M 360 0 Q 450 180 490 320 T 560 500" fill="none" stroke="#387088" strokeWidth="1.2" strokeDasharray="6 4" />
                    <text x="465" y="295" fill="#205368" fontSize="8" fontFamily="sans-serif" fontWeight="bold">50m</text>

                    <path d="M 520 0 Q 610 200 660 360 T 730 500" fill="none" stroke="#235A70" strokeWidth="1.4" />
                    <text x="635" y="335" fill="#144357" fontSize="8" fontFamily="sans-serif" fontWeight="bold">100m Shelf Break</text>
                  </g>
                )}

                {/* Swell Marks */}
                {activeLayers.swell && (
                  <g className="swell-layer opacity-40">
                    <path d="M 280 80 Q 295 72 310 80 T 340 80" fill="none" stroke="#21618C" strokeWidth="1" />
                    <path d="M 380 140 Q 395 132 410 140 T 440 140" fill="none" stroke="#21618C" strokeWidth="1" />
                    <path d="M 460 220 Q 475 212 490 220 T 520 220" fill="none" stroke="#21618C" strokeWidth="1" />
                    <path d="M 330 310 Q 345 302 360 310 T 390 310" fill="none" stroke="#21618C" strokeWidth="1" />
                  </g>
                )}

                {/* Landmass — Odisha Coast with Mahanadi Spit */}
                <path
                  d="M 0 0 L 110 0 Q 130 80 145 130 Q 165 170 170 200 L 155 210 Q 140 200 120 220 L 105 240 Q 135 255 160 250 L 175 255 Q 185 275 160 295 L 140 310 Q 150 340 130 380 L 110 440 L 90 500 L 0 500 Z"
                  fill="url(#landform)"
                  stroke="#688E7D"
                  strokeWidth="1.5"
                />

                {/* Mahanadi River */}
                <path d="M 0 230 Q 70 235 120 225 L 105 245 Q 60 245 0 240 Z" fill="#C4E0EA" stroke="#5F97AE" strokeWidth="0.8" />
                <text x="25" y="222" fill="#4B6A5E" fontSize="8" fontWeight="600">Mahanadi River</text>

                {/* Paradip Harbor Breakwaters */}
                <path d="M 160 250 L 195 258 L 190 268" fill="none" stroke="#324B5C" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 165 272 L 190 274" fill="none" stroke="#324B5C" strokeWidth="2.5" strokeLinecap="round" />

                {/* Wind Vectors (ENE ~21 kt) */}
                {activeLayers.windVectors && (
                  <g className="wind-layer">
                    {[{ x: 300, y: 70 }, { x: 480, y: 110 }, { x: 260, y: 190 }, { x: 440, y: 220 }, { x: 330, y: 360 }].map((pos, idx) => (
                      <g key={idx} transform={`translate(${pos.x}, ${pos.y}) rotate(115)`} className="opacity-70">
                        <line x1="-10" y1="0" x2="10" y2="0" stroke="#12304A" strokeWidth="1.2" />
                        <polygon points="10,0 6,-3 6,3" fill="#12304A" />
                        <text x="0" y="-5" transform="rotate(-115)" fill="#12304A" fontSize="7" fontWeight="bold" textAnchor="middle">21kt</text>
                      </g>
                    ))}
                  </g>
                )}

                {/* 0-12 NM Coastal Fishing Zone */}
                <g className="fishing-zone-layer">
                  <path
                    d="M 140 10 Q 230 140 260 260 T 320 490 L 190 490 Q 150 330 170 255 Q 160 170 120 10 Z"
                    fill="rgba(33, 97, 140, 0.08)"
                    stroke="#21618C"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                  />
                  <text x="215" y="160" fill="#12304A" fontSize="9" fontWeight="bold">0–12 NM Coastal Fishing Zone</text>
                  <text x="215" y="174" fill="#C58A2B" fontSize="8" fontWeight="bold">Moderate Swell (1.6m – 2.1m)</text>

                  {/* Wave Pin */}
                  <g
                    transform="translate(250, 230)"
                    onMouseEnter={() => setActiveTooltip('Hs: 1.85m | Period: 8.2s | Caution advised for small motorized boats')}
                    onMouseLeave={() => setActiveTooltip(null)}
                    className="cursor-pointer"
                  >
                    <circle r="6" fill="#C58A2B" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text x="10" y="3" fill="#8A5A1A" fontSize="8" fontWeight="bold">Hs 1.85m</text>
                  </g>
                </g>

                {/* Paradip Port Central Marker */}
                <g transform="translate(195, 260)" className="cursor-pointer" onMouseEnter={() => setActiveTooltip('Paradip Major Port (20.264°N, 86.671°E)')} onMouseLeave={() => setActiveTooltip(null)}>
                  <circle r="7" fill="#12304A" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="12" y="-5" fill="#12304A" fontSize="10" fontWeight="bold">Paradip Port</text>
                  <text x="12" y="6" fill="#4B6577" fontSize="8">20°15'N, 86°40'E</text>
                </g>

                {/* Met-Ocean Buoy CB-02 */}
                <g transform="translate(280, 320)" className="cursor-pointer" onMouseEnter={() => setActiveTooltip('INCOIS Buoy CB-02 | Hs: 1.76m | SST: 28.4°C')} onMouseLeave={() => setActiveTooltip(null)}>
                  <polygon points="0,-6 5,4 -5,4" fill="#C58A2B" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="8" y="3" fill="#7A4F13" fontSize="7.5" fontWeight="bold">Buoy CB-02 (ADCP)</text>
                </g>
              </g>
            )}

            {/* ========================================================
                SCENARIO 2: KOCHI, KERALA (West Coast / Arabian Sea)
                Land on East (right), Ocean on West (left)
               ======================================================== */}
            {scenarioId === 'scenario2' && (
              <g className="kochi-cartography">
                {/* Bathymetry Contours along Malabar shelf */}
                {activeLayers.bathymetry && (
                  <g className="bathymetry-layer">
                    {/* 100m shelf break far west */}
                    <path d="M 180 0 Q 170 180 180 320 T 190 500" fill="none" stroke="#235A70" strokeWidth="1.4" />
                    <text x="145" y="330" fill="#144357" fontSize="8" fontWeight="bold">100m Shelf Break</text>

                    {/* 50m contour */}
                    <path d="M 330 0 Q 320 200 340 350 T 350 500" fill="none" stroke="#387088" strokeWidth="1.2" strokeDasharray="6 4" />
                    <text x="320" y="270" fill="#205368" fontSize="8" fontWeight="bold">50m</text>

                    {/* 25m Malabar shelf contour */}
                    <path d="M 480 0 Q 470 200 490 350 T 510 500" fill="none" stroke="#4A849C" strokeWidth="1.2" />
                    <text x="450" y="220" fill="#2E647A" fontSize="8" fontWeight="bold">25m Shelf</text>

                    {/* 10m coastal contour */}
                    <path d="M 590 0 Q 580 180 600 320 T 620 500" fill="none" stroke="#5F97AE" strokeWidth="1" strokeDasharray="4 3" />
                    <text x="580" y="160" fill="#3D7187" fontSize="8" fontWeight="bold">10m</text>
                  </g>
                )}

                {/* Swell Wave Marks (SW Swell in Arabian Sea) */}
                {activeLayers.swell && (
                  <g className="swell-layer opacity-40">
                    <path d="M 220 180 Q 235 172 250 180 T 280 180" fill="none" stroke="#21618C" strokeWidth="1" />
                    <path d="M 310 260 Q 325 252 340 260 T 370 260" fill="none" stroke="#21618C" strokeWidth="1" />
                    <path d="M 190 360 Q 205 352 220 360 T 250 360" fill="none" stroke="#21618C" strokeWidth="1" />
                  </g>
                )}

                {/* Landmass — Kerala Coastline on the EAST (Right side) */}
                {/* Fort Kochi & Vypin entrance leading into Vembanad Lake */}
                <path
                  d="M 800 0 L 660 0 Q 640 100 635 180 L 640 240 L 620 245 L 610 252 L 640 255 L 645 270 L 625 275 L 620 285 L 650 288 Q 655 350 670 420 L 685 500 L 800 500 Z"
                  fill="url(#landform)"
                  stroke="#688E7D"
                  strokeWidth="1.5"
                />

                {/* Cochin Backwaters / Vembanad Lake Channel */}
                <path
                  d="M 800 220 Q 720 240 640 248 L 650 278 Q 730 270 800 280 Z"
                  fill="#C4E0EA"
                  stroke="#5F97AE"
                  strokeWidth="0.8"
                />
                <text x="700" y="262" fill="#4B6A5E" fontSize="8" fontWeight="600">Cochin Channel</text>

                {/* Fort Kochi & Vypin Island Labels */}
                <text x="645" y="210" fill="#4B6577" fontSize="8" fontWeight="bold">Vypin Island</text>
                <text x="645" y="315" fill="#4B6577" fontSize="8" fontWeight="bold">Fort Kochi</text>

                {/* Wind Vectors (NW breeze 15-24 kt) */}
                {activeLayers.windVectors && (
                  <g className="wind-layer">
                    {[{ x: 260, y: 100 }, { x: 420, y: 140 }, { x: 240, y: 240 }, { x: 380, y: 280 }, { x: 220, y: 390 }].map((pos, idx) => (
                      <g key={idx} transform={`translate(${pos.x}, ${pos.y}) rotate(40)`} className="opacity-70">
                        <line x1="-10" y1="0" x2="10" y2="0" stroke="#12304A" strokeWidth="1.2" />
                        <polygon points="10,0 6,-3 6,3" fill="#12304A" />
                        <text x="0" y="-5" transform="rotate(-40)" fill="#12304A" fontSize="7" fontWeight="bold" textAnchor="middle">16kt</text>
                      </g>
                    ))}
                  </g>
                )}

                {/* ROUTES: Route A (Inner Shelf) vs Route B (Outer Deep Channel) */}
                {activeLayers.routes && (
                  <g className="routes-layer">
                    {/* Destination Waypoint in Northwest */}
                    <g transform="translate(140, 120)">
                      <circle r="6" fill="#12304A" stroke="#FFFFFF" strokeWidth="2" />
                      <text x="12" y="4" fill="#12304A" fontSize="9" fontWeight="bold">Offshore Station X</text>
                    </g>

                    {/* ROUTE A: Inner Shelf Channel (RECOMMENDED - GREEN) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => onSelectRoute && onSelectRoute('route-a')}
                      onMouseEnter={() => setActiveTooltip('Route A (Kochi Inner Shelf): 15.4 NM | Hs 1.35m | Sheltered by 25m contour | RECOMMENDED')}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <path
                        d="M 625 265 Q 500 200 340 160 T 140 120"
                        fill="none"
                        stroke={selectedRouteId === 'route-a' ? 'rgba(30, 130, 76, 0.28)' : 'rgba(30, 130, 76, 0.12)'}
                        strokeWidth="16"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 625 265 Q 500 200 340 160 T 140 120"
                        fill="none"
                        stroke="#1E824C"
                        strokeWidth={selectedRouteId === 'route-a' ? '3' : '2'}
                      />
                      <circle cx="450" cy="195" r="4" fill="#1E824C" stroke="#FFFFFF" strokeWidth="1.2" />
                      <text x="455" y="190" fill="#0E4F2E" fontSize="7.5" fontWeight="bold">WP-A1</text>

                      <rect x="340" y="145" width="140" height="18" rx="4" fill="#FFFFFF" stroke="#1E824C" strokeWidth="1" />
                      <text x="346" y="157" fill="#1E824C" fontSize="8" fontWeight="bold">
                        ROUTE A: 1.35m Wave (Calm)
                      </text>
                    </g>

                    {/* ROUTE B: Outer Deep Channel (AVOID - AMBER/RED) */}
                    <g
                      className="cursor-pointer"
                      onClick={() => onSelectRoute && onSelectRoute('route-b')}
                      onMouseEnter={() => setActiveTooltip('Route B (Outer Deep Arabian Sea): 17.8 NM | Hs 2.55m | 28kt Gusts | ELEVATED RISK')}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <path
                        d="M 625 265 Q 480 370 280 330 T 140 120"
                        fill="none"
                        stroke={selectedRouteId === 'route-b' ? 'rgba(197, 138, 43, 0.28)' : 'rgba(197, 138, 43, 0.12)'}
                        strokeWidth="16"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 625 265 Q 480 370 280 330 T 140 120"
                        fill="none"
                        stroke="#C58A2B"
                        strokeWidth={selectedRouteId === 'route-b' ? '3' : '2'}
                        strokeDasharray="6 4"
                      />
                      <circle cx="430" cy="355" r="4" fill="#C58A2B" stroke="#FFFFFF" strokeWidth="1.2" />
                      <text x="435" y="370" fill="#7A4F13" fontSize="7.5" fontWeight="bold">WP-B1</text>

                      <rect x="330" y="380" width="144" height="18" rx="4" fill="#FFFFFF" stroke="#C58A2B" strokeWidth="1" />
                      <text x="336" y="392" fill="#7A4F13" fontSize="8" fontWeight="bold">
                        ROUTE B: 2.55m Wave (Heavy)
                      </text>
                    </g>
                  </g>
                )}

                {/* Kochi Port & Fairway Marker */}
                <g transform="translate(625, 265)" className="cursor-pointer" onMouseEnter={() => setActiveTooltip('Kochi Port Fairway (9.966°N, 76.220°E) | Deepwater Approaches')} onMouseLeave={() => setActiveTooltip(null)}>
                  <circle r="7" fill="#12304A" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="-12" y="-10" fill="#12304A" fontSize="10" fontWeight="bold" textAnchor="end">Kochi Port</text>
                  <text x="-12" y="3" fill="#4B6577" fontSize="8" textAnchor="end">09°58'N, 76°14'E</text>
                </g>

                {/* NIOT Oceanographic Buoy AD-06 */}
                <g transform="translate(510, 340)" className="cursor-pointer" onMouseEnter={() => setActiveTooltip('NIOT Buoy AD-06 off Kochi | Hs: 1.38m | Current 0.7 kt S')} onMouseLeave={() => setActiveTooltip(null)}>
                  <polygon points="0,-6 5,4 -5,4" fill="#1E824C" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="8" y="3" fill="#0E4F2E" fontSize="7.5" fontWeight="bold">Buoy AD-06</text>
                </g>
              </g>
            )}

            {/* ========================================================
                SCENARIO 3: VISAKHAPATNAM, ANDHRA PRADESH (East Coast)
                Curved coastline with prominent Dolphin's Nose headland
               ======================================================== */}
            {scenarioId === 'scenario3' && (
              <g className="visakhapatnam-cartography">
                {/* Bathymetry Contours */}
                {activeLayers.bathymetry && (
                  <g className="bathymetry-layer">
                    <path d="M 320 0 Q 340 180 390 320 T 480 500" fill="none" stroke="#5F97AE" strokeWidth="1" strokeDasharray="4 3" />
                    <text x="325" y="90" fill="#3D7187" fontSize="8" fontWeight="bold">10m</text>

                    <path d="M 420 0 Q 450 180 500 320 T 580 500" fill="none" stroke="#4A849C" strokeWidth="1.2" />
                    <text x="430" y="110" fill="#2E647A" fontSize="8" fontWeight="bold">25m</text>

                    <path d="M 540 0 Q 570 190 620 330 T 690 500" fill="none" stroke="#387088" strokeWidth="1.2" strokeDasharray="6 4" />
                    <text x="560" y="130" fill="#205368" fontSize="8" fontWeight="bold">50m Roadstead</text>
                  </g>
                )}

                {/* Swell Marks */}
                {activeLayers.swell && (
                  <g className="swell-layer opacity-40">
                    <path d="M 450 140 Q 465 132 480 140 T 510 140" fill="none" stroke="#21618C" strokeWidth="1" />
                    <path d="M 520 240 Q 535 232 550 240 T 580 240" fill="none" stroke="#21618C" strokeWidth="1" />
                    <path d="M 590 360 Q 605 352 620 360 T 650 360" fill="none" stroke="#21618C" strokeWidth="1" />
                  </g>
                )}

                {/* Landmass — Visakhapatnam Coast with Dolphin's Nose Headland & Outer Harbour */}
                <path
                  d="M 0 0 L 250 0 Q 240 80 230 140 L 225 180 Q 210 210 200 240 L 265 265 Q 275 285 240 295 L 205 300 Q 180 340 160 400 L 140 500 L 0 500 Z"
                  fill="url(#landform)"
                  stroke="#688E7D"
                  strokeWidth="1.5"
                />

                {/* Prominent Dolphin's Nose Headland */}
                <text x="270" y="260" fill="#2C4135" fontSize="8.5" fontWeight="bold">Dolphin's Nose</text>
                <text x="270" y="272" fill="#5F7D6D" fontSize="7.5">Lighthouse (358m)</text>

                {/* Visakhapatnam Deepwater Harbour Breakwaters */}
                <path d="M 205 235 L 235 238 L 245 245" fill="none" stroke="#324B5C" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 235 262 L 250 255" fill="none" stroke="#324B5C" strokeWidth="2" strokeLinecap="round" />

                {/* Rishikonda Beach in the North */}
                <text x="245" y="80" fill="#4B6577" fontSize="8" fontWeight="bold">Rishikonda</text>

                {/* Wind Vectors (SSW ~17.5 kt) */}
                {activeLayers.windVectors && (
                  <g className="wind-layer">
                    {[{ x: 380, y: 70 }, { x: 500, y: 120 }, { x: 420, y: 220 }, { x: 560, y: 260 }, { x: 470, y: 390 }].map((pos, idx) => (
                      <g key={idx} transform={`translate(${pos.x}, ${pos.y}) rotate(-10)`} className="opacity-70">
                        <line x1="-10" y1="0" x2="10" y2="0" stroke="#12304A" strokeWidth="1.2" />
                        <polygon points="10,0 6,-3 6,3" fill="#12304A" />
                        <text x="0" y="-5" transform="rotate(10)" fill="#12304A" fontSize="7" fontWeight="bold" textAnchor="middle">17kt</text>
                      </g>
                    ))}
                  </g>
                )}

                {/* Hazard Layer: Localized Rip Current Hatch Polygon */}
                <g className="hazards-layer">
                  {/* Headland Rip Current Advisory Zone around Dolphin's Nose */}
                  <path
                    d="M 220 250 Q 285 245 295 280 L 250 310 Q 210 290 220 250 Z"
                    fill="url(#hazardHatch)"
                    stroke="#C58A2B"
                    strokeWidth="1.5"
                  />
                  <g transform="translate(300, 290)">
                    <circle r="5" fill="#C58A2B" />
                    <text x="10" y="3" fill="#7A4F13" fontSize="8" fontWeight="bold">Headland Rip Current (1.2 m/s)</text>
                    <text x="10" y="13" fill="#61717D" fontSize="7">09:30 – 12:45 IST Ebb Tide</text>
                  </g>

                  {/* Clear Deepwater Navigation Channel (Depth 20m) */}
                  <path
                    d="M 245 248 L 460 255 L 460 275 L 245 262 Z"
                    fill="rgba(30, 130, 76, 0.08)"
                    stroke="#1E824C"
                    strokeWidth="1.2"
                    strokeDasharray="4 2"
                  />
                  <text x="260" y="240" fill="#1E824C" fontSize="8" fontWeight="bold">
                    Clear Deepwater Approach (20.0m Draft)
                  </text>

                  {/* Radar Range Ring (IMD DWR Kailasagiri) */}
                  <g transform="translate(560, 160)">
                    <circle r="70" fill="none" stroke="#5F97AE" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="0" y="-76" fill="#205368" fontSize="8" textAnchor="middle" fontWeight="bold">
                      IMD DWR Kailasagiri: Clear (No Convective Squall)
                    </text>
                  </g>
                </g>

                {/* Visakhapatnam Port Marker */}
                <g transform="translate(225, 235)" className="cursor-pointer" onMouseEnter={() => setActiveTooltip('Visakhapatnam Major Port (17.686°N, 83.304°E) | Outer Harbour')} onMouseLeave={() => setActiveTooltip(null)}>
                  <circle r="7" fill="#12304A" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="-10" y="-8" fill="#12304A" fontSize="10" fontWeight="bold" textAnchor="end">Vizag Port</text>
                  <text x="-10" y="4" fill="#4B6577" fontSize="8" textAnchor="end">17°41'N, 83°17'E</text>
                </g>

                {/* INCOIS Deep Ocean Buoy BD-11 */}
                <g transform="translate(520, 310)" className="cursor-pointer" onMouseEnter={() => setActiveTooltip('INCOIS Deep Buoy BD-11 | Hs: 1.72m | SST: 28.6°C | Nominal')} onMouseLeave={() => setActiveTooltip(null)}>
                  <polygon points="0,-6 5,4 -5,4" fill="#1E824C" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="8" y="3" fill="#0E4F2E" fontSize="7.5" fontWeight="bold">Buoy BD-11 (INCOIS)</text>
                </g>
              </g>
            )}

            {/* Scale Bar (10 Nautical Miles) */}
            <g transform="translate(40, 465)">
              <rect x="0" y="0" width="70" height="3" fill="#12304A" />
              <rect x="0" y="0" width="35" height="3" fill="#21618C" />
              <text x="0" y="-3" fill="#4B6577" fontSize="8" fontFamily="monospace">0</text>
              <text x="35" y="-3" fill="#4B6577" fontSize="8" fontFamily="monospace">5</text>
              <text x="65" y="-3" fill="#4B6577" fontSize="8" fontFamily="monospace">10 NM</text>
            </g>

            {/* Compass Rose */}
            <g transform="translate(745, 55)" className="opacity-80">
              <circle r="20" fill="#FFFFFF" stroke="#B3D7E5" strokeWidth="1" />
              <line x1="0" y1="-18" x2="0" y2="18" stroke="#7A93A6" strokeWidth="0.8" />
              <line x1="-18" y1="0" x2="18" y2="0" stroke="#7A93A6" strokeWidth="0.8" />
              <polygon points="0,-16 -3,-3 0,0 3,-3" fill="#B84A4A" />
              <polygon points="0,16 -3,3 0,0 3,3" fill="#7A93A6" />
              <text x="0" y="-20" fill="#B84A4A" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
            </g>
          </svg>
        </div>

        {/* Floating Tooltip readout */}
        {activeTooltip && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md p-2 rounded-lg bg-[#FFFFFF] border border-[#21618C] text-xs text-[#18303F] shadow-md z-30 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#21618C] shrink-0" />
            <span className="leading-tight">{activeTooltip}</span>
          </div>
        )}

        {/* Zoom Controls HUD */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-30">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#12304A] border border-[#D9E2E8] shadow-xs transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#12304A] border border-[#D9E2E8] shadow-xs transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#12304A] border border-[#D9E2E8] shadow-xs transition-colors cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Cartographic Status HUD */}
        <div className="absolute bottom-2 right-3 px-2.5 py-1 rounded bg-[#FFFFFF]/90 border border-[#D9E2E8] text-[10px] text-[#61717D] font-mono shadow-xs hidden sm:flex items-center gap-3">
          <span>Datum: WGS84</span>
          <span>Projection: Mercator</span>
          {cursorPos ? (
            <span className="font-semibold text-[#18303F]">
              {cursorPos.lat}°N, {cursorPos.lng}°E • Depth: -{cursorPos.depth}m
            </span>
          ) : (
            <span className="text-[#7A93A6]">Track cursor for depth & coords</span>
          )}
        </div>
      </div>
    </div>
  );
};
