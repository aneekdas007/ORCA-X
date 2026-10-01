import React from 'react';
import { 
  Compass, 
  Cpu, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-[#18303F]">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#E5EDF2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#21618C] flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5 text-[#DCEAF2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#12304A] tracking-tight">
                  ORCA-X Platform Architecture
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2]">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-[#61717D]">
                Agentic Marine Intelligence Platform • Student Team MarineX
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md bg-[#F0F4F7] hover:bg-[#E5EDF2] text-[#61717D] hover:text-[#18303F] transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* SIH & ISRO Context */}
        <div className="p-3.5 rounded-lg bg-[#F0F6FA] border border-[#B5D2E2] space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-bold text-[#12304A]">
            <span>Problem Statement: SIH26176</span>
            <span className="text-[#61717D]">Supported by ISRO</span>
          </div>
          <p className="text-[#4A5D6B] leading-relaxed text-[11px]">
            ORCA-X empowers coastal authorities, commercial vessels, and fisheries by converting natural-language marine inquiries into deterministic multi-agent task pipelines. The platform integrates spaceborne earth observations, numerical hydrodynamic models, in-situ buoys, and hydrographic charts into verified operational risk assessments.
          </p>
        </div>

        {/* Prototype vs Full Roadmap */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#61717D] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#21618C]" />
            <span>Architecture & Roadmap</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] space-y-1">
              <div className="font-bold text-[#21618C] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E824C]" />
                Phase 1 Frontend Prototype
              </div>
              <p className="text-[#61717D] leading-snug text-[11px]">
                Deterministic demonstration simulating natural language query decomposition, sequential agent pipelines, nautical vector cartography, and evidence fusion.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] space-y-1">
              <div className="font-bold text-[#1E824C] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#1E824C]" />
                Phase 2 Full Agentic Backend
              </div>
              <p className="text-[#61717D] leading-snug text-[11px]">
                Seamless transition to live WebSocket service invoking LangGraph/Autogen specialist agents, MOSDAC/INCOIS OpenDAP feeds, and real-time GIS spatial indexing.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Agent Architecture */}
        <div className="p-3.5 rounded-lg bg-[#FAFBFD] border border-[#D9E2E8] text-xs space-y-2">
          <div className="font-bold text-[#12304A]">
            Autonomous Specialist Agents
          </div>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#EBF3F7] border border-[#DCEAF2] text-[#21618C]">
              Weather Agent (Oceansat-3 / DWR)
            </span>
            <span className="px-2 py-0.5 rounded bg-[#EAF5F0] border border-[#B2D8C7] text-[#1E824C]">
              Ocean Agent (SWAN / WW3)
            </span>
            <span className="px-2 py-0.5 rounded bg-[#EEF5F8] border border-[#CCDCE5] text-[#3B82A0]">
              Geospatial Agent (NHO Bathymetry)
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FFF8EC] border border-[#E5CE9F] text-[#7A4F13]">
              Risk Assessment Engine
            </span>
            <span className="px-2 py-0.5 rounded bg-[#F0F4F7] border border-[#D9E2E8] text-[#12304A]">
              Briefing Synthesizer
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E5EDF2] flex items-center justify-between text-xs">
          <span className="text-[#7A93A6] font-mono text-[10px]">
            React 19 • TypeScript • Tailwind CSS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#21618C] hover:bg-[#1B5074] text-white font-semibold cursor-pointer shadow-xs"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
