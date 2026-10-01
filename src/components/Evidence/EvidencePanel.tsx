import React, { useState } from 'react';
import { 
  Database, 
  Satellite, 
  Waves, 
  Radio, 
  CheckCircle, 
  ChevronRight 
} from 'lucide-react';
import type { EvidenceSource } from '../../types';

interface EvidencePanelProps {
  sources: EvidenceSource[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ sources }) => {
  const [selectedSource, setSelectedSource] = useState<EvidenceSource | null>(null);

  const getSourceIcon = (sensor: string) => {
    if (sensor.includes('Scatterometer') || sensor.includes('Satellite')) {
      return <Satellite className="w-4 h-4 text-[#21618C]" />;
    }
    if (sensor.includes('Radar')) {
      return <Radio className="w-4 h-4 text-[#3B82A0]" />;
    }
    if (sensor.includes('Wave') || sensor.includes('ADCP')) {
      return <Waves className="w-4 h-4 text-[#1E824C]" />;
    }
    return <Database className="w-4 h-4 text-[#61717D]" />;
  };

  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-5 shadow-xs text-[#18303F]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E5EDF2] gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2]">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
              Evidence & Observation Feeds
            </h3>
            <p className="text-[11px] text-[#61717D]">
              Multi-source oceanographic & spaceborne telemetry assimilation
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2.5 py-0.5 rounded font-medium bg-[#F0F4F7] text-[#61717D] border border-[#D9E2E8]">
          Multi-Source Observation Layer
        </span>
      </div>

      {/* Sources Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {sources.map((src) => (
          <div
            key={src.id}
            onClick={() => setSelectedSource(src)}
            className="p-3.5 rounded-lg bg-[#F7F9FA] hover:bg-[#F0F4F7] border border-[#D9E2E8] hover:border-[#CBD8E1] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Source Header */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-[#FFFFFF] border border-[#D9E2E8] group-hover:border-[#21618C]/40">
                    {getSourceIcon(src.sensor)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#18303F] group-hover:text-[#21618C] transition-colors">
                      {src.sourceName}
                    </h4>
                    <span className="text-[10px] text-[#61717D]">
                      {src.institution}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#EAF5F0] text-[#1E824C] border border-[#B2D8C7] flex items-center gap-1 shrink-0">
                  <CheckCircle className="w-2.5 h-2.5" />
                  {src.status}
                </span>
              </div>

              {/* Data Type */}
              <div className="text-[11px] text-[#12304A] font-medium mt-2">
                {src.dataType}
              </div>

              {/* Snippet */}
              <p className="text-[11px] text-[#61717D] mt-1 line-clamp-2 leading-relaxed">
                "{src.snippet}"
              </p>
            </div>

            {/* Metrics Footer */}
            <div className="mt-3 pt-2.5 border-t border-[#E5EDF2] flex items-center justify-between text-[10px]">
              <span className="text-[#61717D] font-mono">
                {src.timestamp}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#21618C] font-semibold">
                  Rel: {src.reliability}%
                </span>
                <ChevronRight className="w-3 h-3 text-[#7A93A6] group-hover:text-[#21618C] transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Source Modal Inspection */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-5 shadow-xl space-y-4 text-[#18303F]">
            <div className="flex items-start justify-between pb-3 border-b border-[#E5EDF2]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#EBF3F7] border border-[#DCEAF2]">
                  {getSourceIcon(selectedSource.sensor)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#12304A]">
                    {selectedSource.sourceName}
                  </h3>
                  <p className="text-xs text-[#61717D]">
                    {selectedSource.institution}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="text-[#61717D] hover:text-[#18303F] p-1 rounded-md bg-[#F0F4F7] text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#61717D]">Data Type:</span>
                  <span className="font-semibold text-[#18303F]">{selectedSource.dataType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#61717D]">Instrument / Sensor:</span>
                  <span className="font-mono text-[#21618C]">{selectedSource.sensor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#61717D]">Spatial Resolution:</span>
                  <span className="text-[#18303F]">{selectedSource.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#61717D]">Observation Timestamp:</span>
                  <span className="font-mono text-[#18303F]">{selectedSource.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#61717D]">Reliability Rating:</span>
                  <span className="font-bold text-[#1E824C]">{selectedSource.reliability}% Certified</span>
                </div>
              </div>

              <div>
                <div className="font-bold uppercase tracking-wider text-[10px] text-[#61717D] mb-1.5">
                  Extracted Telemetry Parameters
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSource.parameters.map((param, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-[#EBF3F7] border border-[#DCEAF2] text-[#21618C] font-mono text-[11px]"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F0F6FA] border border-[#DCEAF2]">
                <div className="font-bold uppercase tracking-wider text-[10px] text-[#21618C] mb-1">
                  Synthesized Evidence Telemetry Excerpt
                </div>
                <p className="text-[#18303F] italic leading-relaxed text-[11px]">
                  "{selectedSource.snippet}"
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSource(null)}
                className="px-4 py-1.5 rounded-lg bg-[#21618C] hover:bg-[#1B5074] text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
