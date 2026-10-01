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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-[#18303F]">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EDF2]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2]">
              <Printer className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
              Official Marine Advisory Briefing Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21618C] hover:bg-[#1B5074] text-white font-semibold text-xs cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md bg-[#F0F4F7] hover:bg-[#E5EDF2] text-[#61717D] hover:text-[#18303F] transition-colors cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Official Document Sheet */}
        <div id="printable-advisory" className="p-6 rounded-lg bg-[#FAFBFD] border border-[#D9E2E8] text-[#18303F] shadow-xs space-y-4 font-sans text-xs">
          {/* Official Letterhead */}
          <div className="border-b-2 border-[#12304A] pb-3 flex items-start justify-between">
            <div>
              <div className="text-[10px] tracking-widest font-extrabold uppercase text-[#61717D]">
                Ministry of Earth Sciences / ISRO Earth Observation Programme
              </div>
              <h1 className="text-base font-bold text-[#12304A] tracking-tight mt-0.5">
                ORCA-X COASTAL MARINE INTELLIGENCE ADVISORY
              </h1>
              <div className="text-[11px] font-semibold text-[#21618C]">
                Team MarineX • SIH Problem Statement SIH26176
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-[#61717D]">
              <div><strong>Advisory No:</strong> ORCA/{scenario.id === 'scenario1' ? 'PARADIP' : scenario.id === 'scenario2' ? 'KOCHI' : 'VIZAG'}/2026-{scenario.id === 'scenario1' ? 'FSH-042' : scenario.id === 'scenario2' ? 'NAV-118' : 'HAZ-009'}</div>
              <div><strong>Datum:</strong> WGS84 • {scenario.id === 'scenario2' ? 'Arabian Sea (Malabar)' : scenario.id === 'scenario3' ? 'Central Bay of Bengal' : 'North Bay of Bengal'}</div>
              <div><strong>Issued:</strong> {new Date().toLocaleDateString()} 06:00 IST</div>
            </div>
          </div>

          {/* Context Table */}
          <div className="grid grid-cols-4 gap-2 border border-[#D9E2E8] p-2.5 rounded bg-[#FFFFFF] text-[11px]">
            <div>
              <div className="text-[#61717D] uppercase font-bold text-[9px]">Location Sector</div>
              <div className="font-bold text-[#18303F]">{scenario.context.location}</div>
            </div>
            <div>
              <div className="text-[#61717D] uppercase font-bold text-[9px]">Coordinates</div>
              <div className="font-mono text-[#18303F]">{scenario.context.coordinates}</div>
            </div>
            <div>
              <div className="text-[#61717D] uppercase font-bold text-[9px]">Forecast Window</div>
              <div className="font-bold text-[#18303F]">{scenario.context.timeWindow}</div>
            </div>
            <div>
              <div className="text-[#61717D] uppercase font-bold text-[9px]">Target Activity</div>
              <div className="font-bold text-[#18303F]">{scenario.context.activity}</div>
            </div>
          </div>

          {/* Main Risk & Confidence Banner */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-[#D9E2E8] bg-[#FFFFFF]">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#61717D]">
                Marine Risk Assessment
              </div>
              <div className="text-lg font-black text-[#12304A] tracking-tight">
                {scenario.riskLevel} CAUTION ({scenario.riskScore}/100 HAZARD INDEX)
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-[#61717D]">
                Evidence Confidence
              </div>
              <div className="text-lg font-bold text-[#21618C]">
                {scenario.confidence}%
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
              Executive Briefing: {scenario.headline}
            </h2>
            <p className="text-[#4A5D6B] leading-relaxed text-[11px]">
              {scenario.executiveSummary}
            </p>
          </div>

          {/* Operational Recommendation */}
          <div className="p-3 rounded-md border border-[#B5D2E2] bg-[#F0F6FA] text-[#12304A] font-medium">
            <strong className="block text-[10px] uppercase tracking-wider text-[#21618C] mb-0.5">
              Mandatory Marine Directive:
            </strong>
            "{scenario.recommendation}"
          </div>

          {/* Key Findings List */}
          <div className="space-y-1 pt-1">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#12304A]">
              Deterministic Observations:
            </h3>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#4A5D6B]">
              {scenario.keyFindings.map((finding, idx) => (
                <li key={idx}>{finding}</li>
              ))}
            </ul>
          </div>

          {/* Evidence Sources Citation */}
          <div className="pt-2 border-t border-[#D9E2E8] flex items-center justify-between text-[9px] text-[#7A93A6] font-mono">
            <span>Verified Feeds: {scenario.evidence.map(e => e.sourceName.split('(')[0].trim()).slice(0, 4).join(' • ')}</span>
            <span>Marine Intelligence Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};
