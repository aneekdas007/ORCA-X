import React from 'react';
import { 
  Info, 
  Volume2, 
  VolumeX, 
  Printer, 
  FileCode2,
  Menu,
  X
} from 'lucide-react';
import { BrandLogo } from '../Common/BrandLogo';
import type { Language } from '../../types';
import { getUIText } from '../../utils/translations';

interface NavbarProps {
  onOpenAbout: () => void;
  isProcessing: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  hasActiveScenario: boolean;
  activeSectorLabel?: string;
  onOpenAdvisory: () => void;
  onOpenDialogue: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAbout, 
  isProcessing,
  isMuted,
  onToggleMute,
  hasActiveScenario,
  activeSectorLabel,
  onOpenAdvisory,
  onOpenDialogue,
  language,
  onLanguageChange,
  onToggleMobileSidebar,
  isMobileSidebarOpen = false
}) => {
  const ui = getUIText(language);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#12304A] border-b border-[#214361] px-3 sm:px-4 lg:px-6 py-2.5 shadow-sm transition-colors text-white">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Sidebar History Toggle */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 rounded-md bg-[#163855] hover:bg-[#1e486e] text-[#DCEAF2] border border-[#214361] transition-colors cursor-pointer shrink-0"
              aria-label={isMobileSidebarOpen ? 'Close conversation history' : 'Open conversation history'}
              title="Toggle conversation history"
            >
              {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          <BrandLogo size="md" className="shrink-0" />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                ORCA-X
              </span>
              <span className="hidden xs:inline-block px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase rounded bg-[#1e486e] text-[#DCEAF2] border border-[#3B82A0]/40 whitespace-nowrap">
                {language === 'hi' ? 'समुद्री आसूचना' : 'Marine Intelligence'}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#A2B8C7] hidden sm:block truncate">
              {ui.teamSub} • SIH26176
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Active Surveillance Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0D2438] border border-[#214361] text-xs">
            <span className={`w-2 h-2 rounded-full shrink-0 ${isProcessing ? 'bg-[#C58A2B] animate-pulse' : 'bg-[#1E824C]'}`} />
            <span className="text-[#DCEAF2] text-[11px] font-medium whitespace-nowrap">
              {isProcessing 
                ? ui.pipelineAnalyzing 
                : (hasActiveScenario && activeSectorLabel ? `${ui.activeSector} • ${activeSectorLabel}` : ui.surveillanceGridActive)}
            </span>
          </div>

          {/* Inter-Agent Trace Button */}
          {hasActiveScenario && (
            <button
              onClick={onOpenDialogue}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium text-[#DCEAF2] bg-[#1a4163] hover:bg-[#21618C] border border-[#3B82A0]/40 transition-colors cursor-pointer shrink-0"
              title="Inspect agent collaboration logs"
              aria-label="Inspect agent collaboration logs"
            >
              <FileCode2 className="w-3.5 h-3.5 text-[#A8D3E6] shrink-0" />
              <span className="hidden md:inline">{ui.agentTrace}</span>
            </button>
          )}

          {/* Export Advisory Document */}
          {hasActiveScenario && (
            <button
              onClick={onOpenAdvisory}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium text-white bg-[#21618C] hover:bg-[#1b5074] border border-[#3B82A0]/50 transition-colors cursor-pointer shadow-xs shrink-0"
              title="Official Marine Advisory Briefing"
              aria-label="Official Marine Advisory Briefing"
            >
              <Printer className="w-3.5 h-3.5 text-[#DCEAF2] shrink-0" />
              <span className="hidden md:inline">{ui.exportAdvisory}</span>
            </button>
          )}

          {/* Language Switcher Pill */}
          <div className="flex items-center rounded-md bg-[#163855] border border-[#214361] p-0.5 text-xs shrink-0">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 sm:px-2 py-1 rounded font-medium text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-[#21618C] text-white font-bold shadow-xs'
                  : 'text-[#A2B8C7] hover:text-white'
              }`}
              title="Switch to English"
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-1.5 sm:px-2 py-1 rounded font-medium text-[10px] sm:text-[11px] transition-colors cursor-pointer ${
                language === 'hi'
                  ? 'bg-[#21618C] text-white font-bold shadow-xs'
                  : 'text-[#A2B8C7] hover:text-white'
              }`}
              title="हिंदी में बदलें"
              aria-label="हिंदी में बदलें"
            >
              हिन्दी
            </button>
          </div>

          {/* Audio FX Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-md bg-[#163855] hover:bg-[#1e486e] text-[#A2B8C7] hover:text-white border border-[#214361] transition-colors cursor-pointer shrink-0"
            title={isMuted ? 'Unmute telemetry audio' : 'Mute telemetry audio'}
            aria-label={isMuted ? 'Unmute telemetry audio' : 'Mute telemetry audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#7A93A6]" /> : <Volume2 className="w-4 h-4 text-[#DCEAF2]" />}
          </button>

          {/* About Modal Trigger */}
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium text-[#DCEAF2] bg-[#163855] hover:bg-[#1e486e] border border-[#214361] transition-colors cursor-pointer shrink-0"
            title="About ORCA-X"
            aria-label="About ORCA-X"
          >
            <Info className="w-3.5 h-3.5 text-[#A8D3E6] shrink-0" />
            <span className="hidden sm:inline">{ui.about}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
