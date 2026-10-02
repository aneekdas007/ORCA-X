import React, { useState } from 'react';
import { 
  CheckCircle, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Bot, 
  CloudSun, 
  Waves, 
  MapPin, 
  Sparkles, 
  Database, 
  Gauge, 
  FileText,
  Activity
} from 'lucide-react';
import type { WorkflowStep } from '../../types';

interface WorkflowVisualizerProps {
  steps: WorkflowStep[];
  isProcessing: boolean;
  activeStepIndex: number;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  steps,
  isProcessing,
  activeStepIndex,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const getAgentIcon = (role: WorkflowStep['agentRole']) => {
    switch (role) {
      case 'weather':
        return <CloudSun className="w-3.5 h-3.5 text-[#21618C]" />;
      case 'ocean':
        return <Waves className="w-3.5 h-3.5 text-[#1E824C]" />;
      case 'geospatial':
        return <MapPin className="w-3.5 h-3.5 text-[#3B82A0]" />;
      case 'risk':
        return <Gauge className="w-3.5 h-3.5 text-[#C58A2B]" />;
      case 'synthesizer':
        return <Sparkles className="w-3.5 h-3.5 text-[#12304A]" />;
      default:
        return <Bot className="w-3.5 h-3.5 text-[#61717D]" />;
    }
  };

  const getAgentBadgeColor = (role: WorkflowStep['agentRole']) => {
    switch (role) {
      case 'weather':
        return 'border-[#B5D2E2] text-[#12304A] bg-[#EBF3F7]';
      case 'ocean':
        return 'border-[#B2D8C7] text-[#0E4F2E] bg-[#EAF5F0]';
      case 'geospatial':
        return 'border-[#CCDCE5] text-[#1E4D69] bg-[#EEF5F8]';
      case 'risk':
        return 'border-[#E5CE9F] text-[#7A4F13] bg-[#FFF8EC]';
      case 'synthesizer':
        return 'border-[#D9E2E8] text-[#12304A] bg-[#F0F4F7]';
      default:
        return 'border-[#D9E2E8] text-[#4F6270] bg-[#F7F9FA]';
    }
  };

  const completedStepsCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.min(100, Math.round((completedStepsCount / steps.length) * 100));

  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-4 shadow-sm text-[#18303F] transition-all min-w-0 overflow-hidden">
      {/* Header with expand toggle */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#D9E2E8] gap-2 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="p-1.5 rounded-md bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2] shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#12304A] tracking-wide truncate">
                Agentic Orchestration Pipeline
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2] shrink-0 whitespace-nowrap">
                Execution Flow
              </span>
            </div>
            <p className="text-[11px] text-[#61717D] truncate">
              Autonomous task decomposition, specialist agent telemetry retrieval & deterministic synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-[#21618C] whitespace-nowrap">
              {progressPercent}% Fused
            </div>
            <div className="text-[10px] text-[#61717D] whitespace-nowrap">
              {completedStepsCount} of {steps.length} Steps
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-md bg-[#F0F4F7] hover:bg-[#E5EDF2] text-[#61717D] hover:text-[#18303F] transition-colors cursor-pointer shrink-0"
            title={isExpanded ? 'Collapse Trace' : 'Expand Trace'}
            aria-label={isExpanded ? 'Collapse Trace' : 'Expand Trace'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Clean Visual Pipeline Representation */}
      <div className="py-3 px-1 overflow-x-auto max-w-full min-w-0">
        <div className="min-w-[620px] flex items-center justify-between gap-1 text-[11px]">
          {/* Query Node */}
          <div className="flex flex-col items-center">
            <div className="px-2.5 py-1.5 rounded-md bg-[#F7F9FA] border border-[#D9E2E8] text-[#18303F] font-semibold shadow-xs flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-[#21618C]" />
              <span>Query</span>
            </div>
          </div>

          <span className="text-[#9AB4C3] font-bold">→</span>

          {/* Context Parser */}
          <div className="flex flex-col items-center">
            <div className="px-2.5 py-1.5 rounded-md bg-[#EBF3F7] border border-[#B5D2E2] text-[#12304A] font-semibold shadow-xs">
              Context Parser
            </div>
          </div>

          <span className="text-[#9AB4C3] font-bold">→</span>

          {/* Planner */}
          <div className="flex flex-col items-center">
            <div className="px-2.5 py-1.5 rounded-md bg-[#F0F4F7] border border-[#D9E2E8] text-[#18303F] font-semibold shadow-xs">
              Task Planner
            </div>
          </div>

          <span className="text-[#9AB4C3] font-bold">→</span>

          {/* Specialist Cluster */}
          <div className="p-1.5 rounded-lg bg-[#FAFBFD] border border-[#CCDCE5] flex items-center gap-1.5 shadow-xs">
            <div className="px-2 py-1 rounded bg-[#EBF3F7] border border-[#B5D2E2] text-[#21618C] flex items-center gap-1">
              <CloudSun className="w-3 h-3" />
              <span>Weather</span>
            </div>
            <div className="px-2 py-1 rounded bg-[#EAF5F0] border border-[#B2D8C7] text-[#1E824C] flex items-center gap-1">
              <Waves className="w-3 h-3" />
              <span>Ocean</span>
            </div>
            <div className="px-2 py-1 rounded bg-[#EEF5F8] border border-[#CCDCE5] text-[#3B82A0] flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Geospatial</span>
            </div>
          </div>

          <span className="text-[#9AB4C3] font-bold">→</span>

          {/* Fusion */}
          <div className="flex flex-col items-center">
            <div className="px-2.5 py-1.5 rounded-md bg-[#F0F4F7] border border-[#D9E2E8] text-[#18303F] font-semibold shadow-xs flex items-center gap-1">
              <Database className="w-3 h-3 text-[#21618C]" />
              <span>Fusion</span>
            </div>
          </div>

          <span className="text-[#9AB4C3] font-bold">→</span>

          {/* Risk */}
          <div className="flex flex-col items-center">
            <div className="px-2.5 py-1.5 rounded-md bg-[#FFF8EC] border border-[#E5CE9F] text-[#7A4F13] font-semibold shadow-xs">
              Risk Engine
            </div>
          </div>

          <span className="text-[#9AB4C3] font-bold">→</span>

          {/* Response */}
          <div className="flex flex-col items-center">
            <div className="px-2.5 py-1.5 rounded-md bg-[#12304A] text-white font-bold shadow-xs">
              ORCA-X Briefing
            </div>
          </div>
        </div>
      </div>

      {/* Step by step log trace */}
      {isExpanded && (
        <div className="mt-1 space-y-2 pt-3 border-t border-[#D9E2E8] min-w-0">
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 min-w-0">
            {steps.map((step, idx) => {
              const isCurrent = isProcessing && activeStepIndex === idx;
              const isDone = step.status === 'completed';

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-lg border text-xs transition-colors flex items-start gap-2.5 min-w-0 ${
                    isCurrent
                      ? 'bg-[#EBF3F7] border-[#21618C] shadow-xs'
                      : isDone
                      ? 'bg-[#FFFFFF] border-[#E5EDF2] hover:bg-[#F9FBFC]'
                      : 'bg-[#F7F9FA] border-[#E5EDF2] opacity-60'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="mt-0.5 shrink-0">
                    {isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#21618C] animate-spin" />
                    ) : isDone ? (
                      <CheckCircle className="w-3.5 h-3.5 text-[#1E824C]" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-[#CBD8E1] flex items-center justify-center text-[9px] text-[#7A93A6]">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Step Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                        <span className="font-semibold text-[#18303F] break-words">
                          {step.name}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border font-medium flex items-center gap-1 shrink-0 whitespace-nowrap ${getAgentBadgeColor(
                            step.agentRole
                          )}`}
                        >
                          {getAgentIcon(step.agentRole)}
                          <span>{step.agent}</span>
                        </span>
                      </div>
                      {step.timestamp && (
                        <span className="text-[10px] text-[#7A93A6] font-mono shrink-0 whitespace-nowrap">
                          +{step.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#61717D] mt-0.5 leading-relaxed break-words">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
