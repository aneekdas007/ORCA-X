import React, { useState } from 'react';
import { 
  Bot, 
  CloudSun, 
  Waves, 
  MapPin, 
  Gauge, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Layers 
} from 'lucide-react';
import type { AgentMessage } from '../../types';

interface AgentDialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  dialogue?: AgentMessage[];
  scenarioTitle: string;
}

export const AgentDialogueModal: React.FC<AgentDialogueModalProps> = ({
  isOpen,
  onClose,
  dialogue = [],
  scenarioTitle
}) => {
  const [filterAgent, setFilterAgent] = useState<string>('all');

  if (!isOpen) return null;

  const getAgentBadge = (agent: string) => {
    switch (agent) {
      case 'Weather Agent':
        return {
          icon: <CloudSun className="w-3.5 h-3.5 text-[#21618C]" />,
          color: 'bg-[#EBF3F7] border-[#B5D2E2] text-[#12304A]'
        };
      case 'Ocean Agent':
        return {
          icon: <Waves className="w-3.5 h-3.5 text-[#1E824C]" />,
          color: 'bg-[#EAF5F0] border-[#B2D8C7] text-[#0E4F2E]'
        };
      case 'Geospatial Agent':
        return {
          icon: <MapPin className="w-3.5 h-3.5 text-[#3B82A0]" />,
          color: 'bg-[#EEF5F8] border-[#CCDCE5] text-[#1E4D69]'
        };
      case 'Risk Engine':
        return {
          icon: <Gauge className="w-3.5 h-3.5 text-[#C58A2B]" />,
          color: 'bg-[#FFF8EC] border-[#E5CE9F] text-[#7A4F13]'
        };
      case 'Response Synthesizer':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-[#12304A]" />,
          color: 'bg-[#F0F4F7] border-[#D9E2E8] text-[#12304A]'
        };
      default:
        return {
          icon: <Bot className="w-3.5 h-3.5 text-[#61717D]" />,
          color: 'bg-[#F7F9FA] border-[#D9E2E8] text-[#4F6270]'
        };
    }
  };

  const filteredDialogue = filterAgent === 'all'
    ? dialogue
    : dialogue.filter(m => m.sender === filterAgent || m.recipient === filterAgent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-4 sm:p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col text-[#18303F] min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#E5EDF2] shrink-0 gap-2 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-[#EBF3F7] border border-[#DCEAF2] text-[#21618C] shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[#12304A] tracking-tight truncate">
                  Agent Telemetry & Collaboration Dialogue
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2] shrink-0 whitespace-nowrap">
                  Inter-Agent Trace
                </span>
              </div>
              <p className="text-xs text-[#61717D] truncate">
                {scenarioTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-[#F0F4F7] hover:bg-[#E5EDF2] text-[#61717D] hover:text-[#18303F] transition-colors cursor-pointer text-xs shrink-0"
            aria-label="Close dialogue trace"
          >
            ✕
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs shrink-0 min-w-0">
          <span className="text-[#61717D] text-[11px] mr-1 font-semibold flex items-center gap-1 shrink-0">
            <Layers className="w-3 h-3 text-[#21618C]" /> Filter:
          </span>
          {['all', 'Weather Agent', 'Ocean Agent', 'Geospatial Agent', 'Risk Engine'].map((agentName) => (
            <button
              key={agentName}
              onClick={() => setFilterAgent(agentName)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                filterAgent === agentName
                  ? 'bg-[#21618C] text-white shadow-xs'
                  : 'bg-[#F7F9FA] text-[#61717D] hover:text-[#18303F] border border-[#D9E2E8]'
              }`}
            >
              {agentName === 'all' ? 'All Exchanges' : agentName}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
          {filteredDialogue.length === 0 ? (
            <div className="text-center py-10 text-[#7A93A6] text-xs">
              No inter-agent messages found for this filter.
            </div>
          ) : (
            filteredDialogue.map((msg) => {
              const senderStyle = getAgentBadge(msg.sender);
              const recipientStyle = getAgentBadge(msg.recipient);

              return (
                <div
                  key={msg.id}
                  className="p-3 sm:p-3.5 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] hover:border-[#CBD8E1] transition-colors space-y-2 min-w-0"
                >
                  {/* Routing header */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-xs min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded-md border flex items-center gap-1 font-semibold text-[10px] sm:text-[11px] shrink-0 ${senderStyle.color}`}>
                        {senderStyle.icon}
                        <span>{msg.sender}</span>
                      </span>

                      <ArrowRight className="w-3 h-3 text-[#7A93A6] shrink-0" />

                      <span className={`px-2 py-0.5 rounded-md border flex items-center gap-1 font-semibold text-[10px] sm:text-[11px] shrink-0 ${recipientStyle.color}`}>
                        {recipientStyle.icon}
                        <span>{msg.recipient}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#61717D] font-mono shrink-0">
                      <span>+{msg.timestamp}</span>
                      <span className="flex items-center gap-1 text-[#1E824C] font-semibold">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Message body */}
                  <p className="text-xs text-[#18303F] leading-relaxed font-sans bg-[#FFFFFF] p-2.5 rounded border border-[#E5EDF2] break-words">
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E5EDF2] flex items-center justify-between text-xs shrink-0">
          <span className="text-[#7A93A6] font-mono text-[10px] sm:text-[11px]">
            Autonomous Inter-Agent Protocol
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#21618C] hover:bg-[#1B5074] text-white font-semibold cursor-pointer shadow-xs"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
