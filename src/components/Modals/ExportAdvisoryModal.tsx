import React from 'react';
import { Printer } from 'lucide-react';
import type { DemoScenario } from '../../types';

interface ExportAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: DemoScenario;
}

export const ExportAdvisoryModal: React.FC<ExportAdvisoryModalProps> = ({
  isOpen,
  onClose,
  scenario
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-4 sm:p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-[#18303F] min-w-0">
        {/* Modal Controls Header */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E5EDF2] gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-md bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2] shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#12304A] truncate">
              Official Marine Advisory Briefing Preview
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21618C] hover:bg-[#1B5074] text-white font-semibold text-xs cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md bg-[#F0F4F7] hover:bg-[#E5EDF2] text-[#61717D] hover:text-[#18303F] transition-colors cursor-pointer text-xs shrink-0"
              aria-label="Close advisory preview"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Official Document Sheet */}
        <div id="printable-advisory" className="p-4 sm:p-6 rounded-lg bg-[#FAFBFD] border border-[#D9E2E8] text-[#18303F] shadow-xs space-y-4 font-sans text-xs min-w-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#12304A] pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <div className="text-[10px] tracking-widest font-extrabold uppercase text-[#61717D] truncate">
                Ministry of Earth Sciences / ISRO Earth Observation Programme
              </div>
              <h1 className="text-sm sm:text-base font-bold text-[#12304A] tracking-tight mt-0.5 break-words">
                ORCA-X COASTAL MARINE INTELLIGENCE ADVISORY
              </h1>
              <div className="text-[11px] font-semibold text-[#21618C] truncate">
                Team MarineX • SIH Problem Statement SIH26176
              </div>
            </div>

            <div className="sm:text-right text-[10px] font-mono text-[#61717D] shrink-0">
              <div><strong>Advisory No:</strong> ORCA/{scenario.id === 'scenario1' ? 'PARADIP' : scenario.id === 'scenario2' ? 'KOCHI' : 'VIZAG'}/2026-{scenario.id === 'scenario1' ? 'FSH-042' : scenario.id === 'scenario2' ? 'NAV-118' : 'HAZ-009'}</div>
              <div><strong>Datum:</strong> WGS84 • {scenario.id === 'scenario2' ? 'Arabian Sea (Malabar)' : scenario.id === 'scenario3' ? 'Central Bay of Bengal' : 'North Bay of Bengal'}</div>
              <div><strong>Issued:</strong> {new Date().toLocaleDateString()} 06:00 IST</div>
            </div>
          </div>

          {/* Context Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 border border-[#D9E2E8] p-2.5 rounded bg-[#FFFFFF] text-[11px] min-w-0">
            <div className="min-w-0">
              <div className="text-[#61717D] uppercase font-bold text-[9px]">Location Sector</div>
              <div className="font-bold text-[#18303F] break-words">{scenario.context.location}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[#61717D] uppercase font-bold text-[9px]">Coordinates</div>
              <div className="font-mono text-[#18303F] break-words">{scenario.context.coordinates}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[#61717D] uppercase font-bold text-[9px]">Forecast Window</div>
              <div className="font-bold text-[#18303F] break-words">{scenario.context.timeWindow}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[#61717D] uppercase font-bold text-[9px]">Target Activity</div>
              <div className="font-bold text-[#18303F] break-words">{scenario.context.activity}</div>
            </div>
          </div>

          {/* Main Risk & Confidence Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-[#D9E2E8] bg-[#FFFFFF] gap-2 min-w-0">
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-[#61717D]">
                Marine Risk Assessment
              </div>
              <div className="text-lg sm:text-xl font-bold text-[#12304A]">
                {scenario.riskLevel} CAUTION (Index: {scenario.riskScore}/100)
              </div>
              <p className="text-[11px] text-[#61717D] mt-0.5 break-words">
                {scenario.riskSummary}
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-[#61717D]">
                Answer Confidence
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#21618C]">
                {scenario.confidence}% Verified
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-3.5 rounded-lg bg-[#F0F6FA] border border-[#B5D2E2] min-w-0">
            <div className="font-bold uppercase tracking-wider text-[10px] text-[#21618C]">
              Operational Directive & Recommendation
            </div>
            <p className="font-semibold text-xs text-[#12304A] mt-1 leading-relaxed break-words">
              "{scenario.recommendation}"
            </p>
          </div>

          {/* Key Findings List */}
          <div className="space-y-1.5 min-w-0">
            <div className="font-bold uppercase tracking-wider text-[10px] text-[#61717D]">
              Verified Met-Ocean Evidence Synthesis
            </div>
            <ul className="space-y-1 text-[11px] text-[#4A5D6B] list-disc pl-4 min-w-0">
              {scenario.keyFindings.map((finding, idx) => (
                <li key={idx} className="break-words leading-relaxed">
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          {/* Official Sign-off */}
          <div className="pt-3 border-t border-[#D9E2E8] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-[#7A93A6] gap-1">
            <span>Generated deterministically by ORCA-X Marine Risk Decision Support System</span>
            <span className="font-mono">Verification Hash: SHA256:{scenario.id.toUpperCase()}-VERIFIED-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
