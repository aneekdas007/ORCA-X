import React from 'react';
import { 
  Compass, 
  RotateCcw, 
  Info, 
  Volume2, 
  VolumeX, 
  Printer, 
  FileCode2 
} from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onOpenAbout: () => void;
  isProcessing: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  hasActiveScenario: boolean;
  activeSectorLabel?: string;
  onOpenAdvisory: () => void;
  onOpenDialogue: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onReset, 
  onOpenAbout, 
  isProcessing,
  isMuted,
  onToggleMute,
  hasActiveScenario,
  activeSectorLabel,
  onOpenAdvisory,
  onOpenDialogue
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#12304A] border-b border-[#214361] px-4 lg:px-6 py-2.5 shadow-sm transition-colors text-white">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        {/* Brand & Mission Identification */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#21618C] border border-[#3b82a0]/40 text-white shadow-sm">
            <Compass className="w-5 h-5 text-[#DCEAF2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                ORCA-X
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-[#1e486e] text-[#DCEAF2] border border-[#3B82A0]/40">
                Marine Intelligence
              </span>
            </div>
            <p className="text-[11px] text-[#A2B8C7] hidden sm:block">
              SIH Problem Statement SIH26176 • Supported by ISRO
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Active Surveillance Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-[#0D2438] border border-[#214361] text-xs">
            <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-[#C58A2B] animate-pulse' : 'bg-[#1E824C]'}`} />
            <span className="text-[#DCEAF2] text-[11px] font-medium">
              {isProcessing 
                ? 'Agent Pipeline Analyzing' 
                : (hasActiveScenario && activeSectorLabel ? `Active Sector • ${activeSectorLabel}` : 'Surveillance Grid Active')}
            </span>
          </div>

          {/* Inter-Agent Trace Button */}
          {hasActiveScenario && (
            <button
              onClick={onOpenDialogue}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#DCEAF2] bg-[#1a4163] hover:bg-[#21618C] border border-[#3B82A0]/40 transition-colors cursor-pointer"
              title="Inspect agent collaboration logs"
            >
              <FileCode2 className="w-3.5 h-3.5 text-[#A8D3E6]" />
              <span className="hidden sm:inline">Agent Trace</span>
            </button>
          )}

          {/* Export Advisory Document */}
          {hasActiveScenario && (
            <button
              onClick={onOpenAdvisory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-[#21618C] hover:bg-[#1b5074] border border-[#3B82A0]/50 transition-colors cursor-pointer shadow-sm"
              title="Official Marine Advisory Briefing"
            >
              <Printer className="w-3.5 h-3.5 text-[#DCEAF2]" />
              <span className="hidden sm:inline">Export Advisory</span>
            </button>
          )}

          {/* Audio FX Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-md bg-[#163855] hover:bg-[#1e486e] text-[#A2B8C7] hover:text-white border border-[#214361] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute telemetry audio' : 'Mute telemetry audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#7A93A6]" /> : <Volume2 className="w-4 h-4 text-[#DCEAF2]" />}
          </button>

          {/* Reset Action */}
          <button
            onClick={onReset}
            disabled={isProcessing}
            title="Start new analysis session"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#DCEAF2] bg-[#163855] hover:bg-[#1e486e] border border-[#214361] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#A8D3E6]" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* About Modal Trigger */}
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#DCEAF2] bg-[#163855] hover:bg-[#1e486e] border border-[#214361] transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#A8D3E6]" />
            <span>About</span>
          </button>
        </div>
      </div>
    </header>
  );
};
