import React from 'react';
import { MapPin, Clock, Compass, Target, Layers } from 'lucide-react';
import type { ExtractedContext } from '../../types';

interface ContextExtractionCardProps {
  context: ExtractedContext;
}

export const ContextExtractionCard: React.FC<ContextExtractionCardProps> = ({ context }) => {
  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-4 shadow-xs text-[#18303F]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5EDF2]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2]">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
            Natural Language Context Extraction
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#F0F4F7] text-[#61717D] border border-[#D9E2E8]">
          Entity Resolution
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Intent */}
        <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8]">
          <div className="flex items-center gap-1.5 text-[#61717D] text-[10px] uppercase font-bold tracking-wider mb-1">
            <Compass className="w-3 h-3 text-[#21618C]" />
            <span>Intent</span>
          </div>
          <div className="font-semibold text-[#18303F]">
            {context.intent}
          </div>
        </div>

        {/* Location */}
        <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8]">
          <div className="flex items-center gap-1.5 text-[#61717D] text-[10px] uppercase font-bold tracking-wider mb-1">
            <MapPin className="w-3 h-3 text-[#1E824C]" />
            <span>Location</span>
          </div>
          <div className="font-semibold text-[#18303F]">
            {context.location}
          </div>
          <div className="text-[10px] text-[#61717D] font-mono mt-0.5">
            {context.coordinates}
          </div>
        </div>

        {/* Time Window */}
        <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8]">
          <div className="flex items-center gap-1.5 text-[#61717D] text-[10px] uppercase font-bold tracking-wider mb-1">
            <Clock className="w-3 h-3 text-[#C58A2B]" />
            <span>Time Window</span>
          </div>
          <div className="font-semibold text-[#18303F]">
            {context.timeWindow}
          </div>
        </div>

        {/* Activity */}
        <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8]">
          <div className="flex items-center gap-1.5 text-[#61717D] text-[10px] uppercase font-bold tracking-wider mb-1">
            <Target className="w-3 h-3 text-[#3B82A0]" />
            <span>Activity</span>
          </div>
          <div className="font-semibold text-[#18303F]">
            {context.activity}
          </div>
        </div>
      </div>

      {/* Analysis Scope Tags */}
      <div className="mt-3 pt-2.5 border-t border-[#E5EDF2] flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#61717D] flex items-center gap-1 mr-1">
          <Layers className="w-3 h-3 text-[#21618C]" />
          Scope:
        </span>
        {context.scope.map((item, idx) => (
          <span
            key={idx}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#EBF3F7] border border-[#DCEAF2] text-[#21618C] font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
