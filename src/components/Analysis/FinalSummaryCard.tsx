import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import type { RiskLevel } from '../../types';

interface FinalSummaryCardProps {
  headline: string;
  executiveSummary: string;
  recommendation: string;
  keyFindings: string[];
  riskLevel: RiskLevel;
}

export const FinalSummaryCard: React.FC<FinalSummaryCardProps> = ({
  headline,
  executiveSummary,
  recommendation,
  keyFindings,
  riskLevel
}) => {
  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-5 shadow-xs text-[#18303F]">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EDF2]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#21618C] text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
            ORCA-X Intelligence Synthesis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-[#EBF3F7] text-[#21618C] border border-[#B5D2E2]">
            Advisory: {riskLevel}
          </span>
        </div>
      </div>

      {/* Main Headline & Summary */}
      <div className="mt-4 space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-[#12304A] tracking-tight leading-snug">
          {headline}
        </h2>
        <p className="text-sm text-[#4A5D6B] leading-relaxed">
          {executiveSummary}
        </p>
      </div>

      {/* Operational Recommendation Highlight */}
      <div className="mt-4 p-4 rounded-lg bg-[#F0F6FA] border border-[#B5D2E2] shadow-xs">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1 rounded-md bg-[#21618C] text-white shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#21618C]">
              Operational Recommendation
            </div>
            <p className="text-sm font-semibold text-[#12304A] mt-0.5 leading-relaxed">
              "{recommendation}"
            </p>
          </div>
        </div>
      </div>

      {/* Key Findings Checklist */}
      <div className="mt-5 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#61717D]">
          Synthesized Deterministic Observations
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {keyFindings.map((finding, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#1E824C] shrink-0 mt-0.5" />
              <span className="text-xs text-[#18303F] leading-relaxed">
                {finding}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
