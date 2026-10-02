import React from 'react';
import { Shield, Info } from 'lucide-react';
import type { ConfidenceFactor } from '../../types';

interface ConfidenceCardProps {
  confidence: number;
  factors: ConfidenceFactor[];
}

export const ConfidenceCard: React.FC<ConfidenceCardProps> = ({ confidence, factors }) => {
  return (
    <div className="@container rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-4 sm:p-5 shadow-xs text-[#18303F] min-w-0">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E5EDF2] gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-md bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2] shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#12304A] truncate">
            Evidence Confidence Evaluation
          </span>
        </div>
        <span className="text-[10px] text-[#61717D] font-mono shrink-0">
          Multi-Sensor Index
        </span>
      </div>

      <div className="mt-4 flex flex-col @min-[540px]:flex-row items-start @min-[540px]:items-center justify-between gap-3 min-w-0">
        {/* Prominent Confidence Display */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#12304A] shrink-0 font-mono">
            {confidence}%
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-[#18303F] whitespace-nowrap">
              Answer Confidence
            </div>
            <div className="text-[11px] text-[#61717D] leading-tight break-words">
              Corroborated across 5 independent marine observation streams
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-md bg-[#F7F9FA] border border-[#D9E2E8] text-[11px] text-[#61717D] flex items-center gap-1.5 shrink-0 self-start @min-[540px]:self-auto">
          <Info className="w-3.5 h-3.5 text-[#21618C] shrink-0" />
          <span className="whitespace-nowrap">Cross-sensor agreement verified</span>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="mt-5 space-y-2.5 min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#61717D]">
          Confidence Composition Factors
        </div>

        <div className="grid grid-cols-1 @min-[480px]:grid-cols-2 gap-2.5 min-w-0">
          {factors.map((factor, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] hover:border-[#CBD8E1] transition-colors min-w-0"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
                <span className="text-xs font-semibold text-[#18303F] min-w-0 truncate">
                  {factor.name}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-[#61717D] font-mono whitespace-nowrap">
                    Weight: {factor.weight}
                  </span>
                  <span className="text-xs font-bold text-[#21618C] font-mono">
                    {factor.score}%
                  </span>
                </div>
              </div>

              {/* Clean progress bar */}
              <div className="w-full h-1.5 bg-[#E5EDF2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#21618C] rounded-full"
                  style={{ width: `${factor.score}%` }}
                />
              </div>

              <p className="text-[11px] text-[#61717D] mt-1.5 leading-snug break-words">
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2 text-[10px] text-[#7A93A6] border-t border-[#F0F4F7] break-words">
        * Confidence index represents multi-source corroboration and data density across active sensor feeds.
      </div>
    </div>
  );
};
