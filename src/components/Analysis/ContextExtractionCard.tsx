import React from 'react';
import { MapPin, Clock, Compass, Target, Layers } from 'lucide-react';
import type { ExtractedContext } from '../../types';

interface ContextExtractionCardProps {
  context: ExtractedContext;
}

export const ContextExtractionCard: React.FC<ContextExtractionCardProps> = ({ context }) => {
  return (
    <div className="@container rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-4 shadow-xs text-[#18303F] min-w-0">
      <div className="flex flex-wrap items-center justify-between mb-3 pb-2 border-b border-[#E5EDF2] gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-md bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2] shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#12304A] truncate">
            Natural Language Context Extraction
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#F0F4F7] text-[#61717D] border border-[#D9E2E8] shrink-0">
          Entity Resolution
        </span>
      </div>

      <div className="grid grid-cols-1 @min-[380px]:grid-cols-2 @min-[740px]:grid-cols-4 gap-3 text-xs min-w-0">
        {/* Intent */}
        <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] min-w-0">
          <div className="flex items-center gap-1.5 text-[#61717D] text-[10px] uppercase font-bold tracking-wider mb-1">
            <Compass className="w-3 h-3 text-[#21618C] shrink-0" />
            <span>Intent</span>
          </div>
          <div className="font-semibold text-[#18303F] break-words leading-snug">
            {context.intent}
          </div>
        </div>

        {/* Location */}
        <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] min-w-0">
          <div className="flex items-center gap-1.5 text-[#61717D] text-[10px] uppercase font-bold tracking-wider mb-1">
            <MapPin className="w-3 h-3 text-[#1E824C] shrink-0" />
            <span>Location</span>
          </div>
          <div className="font-semibold text-[#18303F] break-words leading-snug">
            {context.location}
          </div>
          <div className="text-[10px] text-[#61717D] font-mono mt-0.5 break-words">
            {context.coordinates}
          </div>
        </div>

        {/* Time Window */}
        <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] min-w-0">
          <div className="flex items-center gap-1.5 text-[#61717D] text-[10px] uppercase font-bold tracking-wider mb-1">
            <Clock className="w-3 h-3 text-[#C58A2B] shrink-0" />
            <span>Time Window</span>
          </div>
          <div className="font-semibold text-[#18303F] break-words leading-snug">
            {context.timeWindow}
          </div>
        </div>

        {/* Activity */}
        <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] min-w-0">
          <div className="flex items-center gap-1.5 text-[#61717D] text-[10px] uppercase font-bold tracking-wider mb-1">
            <Target className="w-3 h-3 text-[#3B82A0] shrink-0" />
            <span>Activity</span>
          </div>
          <div className="font-semibold text-[#18303F] break-words leading-snug">
            {context.activity}
          </div>
        </div>
      </div>

      {/* Analysis Scope Tags */}
      <div className="mt-3 pt-2.5 border-t border-[#E5EDF2] flex flex-wrap items-center gap-1.5 min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#61717D] flex items-center gap-1 mr-1 shrink-0">
          <Layers className="w-3 h-3 text-[#21618C]" />
          Scope:
        </span>
        {context.scope.map((item, idx) => (
          <span
            key={idx}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#EBF3F7] border border-[#DCEAF2] text-[#21618C] font-medium break-words"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
