import React from 'react';
import { 
  PlusCircle, 
  Layers, 
  Cpu, 
  Satellite, 
  Waves, 
  MapPin, 
  Radio,
  ExternalLink 
} from 'lucide-react';

import type { DemoScenario } from '../../types';

interface SidebarProps {
  onReset: () => void;
  isProcessing: boolean;
  onOpenAbout: () => void;
  activeScenario?: DemoScenario | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onReset,
  isProcessing,
  onOpenAbout,
  activeScenario = null,
}) => {
  const getSectorInfo = () => {
    if (!activeScenario) {
      return {
        title: 'Surveillance Grid',
        statusText: 'Ready',
        isLocked: false,
        name: 'Indian Coastal Maritime Zones',
        coords: 'Awaiting Spatial Query Lock',
        bufferLabel: 'Coverage Mode:',
        bufferValue: 'Adaptive Ingestion (0–50 NM)',
        radarLabel: 'Coastal Radar Grid:',
        radarStatus: 'Multi-Station Ready',
        buoyLabel: 'Ocean Buoy Array:',
        buoyStatus: 'Telemetry Synced'
      };
    }

    if (activeScenario.id === 'scenario2') {
      return {
        title: 'Extracted Sector',
        statusText: 'Locked',
        isLocked: true,
        name: 'Kochi Coast & Arabian Sea Shelf',
        coords: "09°50'N – 10°10'N, 75°50'E – 76°15'E",
        bufferLabel: 'Shelf Buffer:',
        bufferValue: '0–30 Nautical Miles (Malabar)',
        radarLabel: 'Kochi DWR Radar:',
        radarStatus: '10-min Scan Active',
        buoyLabel: 'NIOT Buoy AD-06:',
        buoyStatus: 'ADCP Stream Online'
      };
    }

    if (activeScenario.id === 'scenario3') {
      return {
        title: 'Extracted Sector',
        statusText: 'Locked',
        isLocked: true,
        name: 'Visakhapatnam Coast & Andhra Shelf',
        coords: "17°35'N – 17°50'N, 83°15'E – 83°30'E",
        bufferLabel: 'Outer Roadstead:',
        bufferValue: '0–25 Nautical Miles',
        radarLabel: 'Kailasagiri DWR:',
        radarStatus: '10-min Sweep Active',
        buoyLabel: 'INCOIS Buoy BD-11:',
        buoyStatus: 'Deep Moored Online'
      };
    }

    // Default: Scenario 1 Paradip
    return {
      title: 'Extracted Sector',
      statusText: 'Locked',
      isLocked: true,
      name: 'Paradip Coast & Bay of Bengal Shelf',
      coords: "20°15'N – 20°35'N, 86°40'E – 87°15'E",
      bufferLabel: 'Shelf Buffer:',
      bufferValue: '0–24 Nautical Miles',
      radarLabel: 'Paradip DWR Radar:',
      radarStatus: '10-min Scan Active',
      buoyLabel: 'NIOT Buoy CB-02:',
      buoyStatus: 'ADCP Stream Online'
    };
  };

  const sector = getSectorInfo();

  return (
    <aside className="w-full lg:w-72 bg-[#FFFFFF] border-r border-[#D9E2E8] flex flex-col justify-between shrink-0 h-full p-4 overflow-y-auto text-[#18303F]">
      <div className="space-y-5">
        {/* New Query Action */}
        <button
          onClick={onReset}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-xs text-white bg-[#21618C] hover:bg-[#1b5074] border border-[#21618C] transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-[#DCEAF2]" />
          <span>New Marine Query</span>
        </button>

        {/* Coastal Surveillance Sector - Dynamic based on prompt extraction */}
        <div className="p-3.5 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#61717D] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#21618C]" />
              {sector.title}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
              sector.isLocked 
                ? 'bg-[#EAF5F0] text-[#1E824C] border-[#B2D8C7]' 
                : 'bg-[#EBF3F7] text-[#21618C] border-[#B5D2E2]'
            }`}>
              {sector.statusText}
            </span>
          </div>

          <div className="text-xs space-y-1">
            <div className="font-semibold text-[#18303F]">
              {sector.name}
            </div>
            <div className="text-[11px] font-mono text-[#61717D]">
              {sector.coords}
            </div>
            <div className="text-[11px] text-[#61717D] pt-1 border-t border-[#E5EDF2] flex justify-between">
              <span>{sector.bufferLabel}</span>
              <span className="font-medium text-[#18303F]">
                {sector.bufferValue}
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Agent System Grid */}
        <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#D9E2E8] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#61717D] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#21618C]" />
              Specialist Agents
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#1E824C] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E824C]"></span>
              Synchronized
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-[#F0F4F7]">
              <span className="flex items-center gap-1.5 text-[#18303F]">
                <Satellite className="w-3.5 h-3.5 text-[#3B82A0]" />
                Weather Agent
              </span>
              <span className="text-[10px] text-[#21618C] bg-[#EBF3F7] px-1.5 py-0.5 rounded font-mono">
                Oceansat-3 / DWR
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-[#F0F4F7]">
              <span className="flex items-center gap-1.5 text-[#18303F]">
                <Waves className="w-3.5 h-3.5 text-[#3B82A0]" />
                Ocean Agent
              </span>
              <span className="text-[10px] text-[#21618C] bg-[#EBF3F7] px-1.5 py-0.5 rounded font-mono">
                SWAN / WW3
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5 text-[#18303F]">
                <Layers className="w-3.5 h-3.5 text-[#3B82A0]" />
                Geospatial Agent
              </span>
              <span className="text-[10px] text-[#21618C] bg-[#EBF3F7] px-1.5 py-0.5 rounded font-mono">
                NHO Bathymetry
              </span>
            </div>
          </div>
        </div>

        {/* Observation Feeds Telemetry */}
        <div className="p-3.5 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] space-y-2">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#61717D] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#21618C]" />
            Observation Telemetry
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#61717D]">Oceansat-3 OSCAT:</span>
              <span className="font-medium text-[#18303F]">Nominal (05:30 Cycle)</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#61717D]">
                {sector.radarLabel}
              </span>
              <span className="font-medium text-[#18303F]">
                {sector.radarStatus}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#61717D]">
                {sector.buoyLabel}
              </span>
              <span className="font-medium text-[#18303F]">
                {sector.buoyStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 mt-6 border-t border-[#D9E2E8]">
        <div className="p-3 rounded-lg bg-[#F0F4F7] border border-[#D9E2E8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#12304A]">Team MarineX</span>
            <span className="text-[10px] font-semibold text-[#21618C] px-1.5 py-0.5 rounded bg-[#DCEAF2]">
              SIH26176
            </span>
          </div>
          <p className="text-[11px] text-[#61717D] mt-1">
            Supported by Indian Space Research Organisation (ISRO)
          </p>
          <div className="mt-2.5 pt-2 border-t border-[#D9E2E8]/60 flex items-center justify-between text-[11px]">
            <span className="text-[#61717D]">Architecture Details</span>
            <button
              onClick={onOpenAbout}
              className="text-[#21618C] hover:text-[#12304A] flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
