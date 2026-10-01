import React from 'react';
import { AlertTriangle, ShieldCheck, Info, Navigation } from 'lucide-react';
import type { RiskLevel, RouteComparisonData } from '../../types';

interface RiskCardProps {
  riskLevel: RiskLevel;
  riskScore: number;
  riskSummary: string;
  scenarioId: string;
  routeData?: RouteComparisonData[];
  onSelectRoute?: (routeId: string) => void;
  selectedRouteId?: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  riskLevel,
  riskScore,
  riskSummary,
  scenarioId,
  routeData,
  onSelectRoute,
  selectedRouteId
}) => {
  const getRiskStyle = (level: RiskLevel) => {
    switch (level) {
      case 'LOW':
        return {
          textColor: 'text-[#1E824C]',
          bgColor: 'bg-[#EAF5F0]',
          borderColor: 'border-[#B2D8C7]',
          barColor: 'bg-[#1E824C]'
        };
      case 'MODERATE':
      case 'ELEVATED':
        return {
          textColor: 'text-[#C58A2B]',
          bgColor: 'bg-[#FFF8EC]',
          borderColor: 'border-[#E5CE9F]',
          barColor: 'bg-[#C58A2B]'
        };
      case 'HIGH':
      case 'CRITICAL':
        return {
          textColor: 'text-[#B84A4A]',
          bgColor: 'bg-[#FDF2F2]',
          borderColor: 'border-[#F2C2C2]',
          barColor: 'bg-[#B84A4A]'
        };
    }
  };

  const style = getRiskStyle(riskLevel);

  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-5 shadow-xs text-[#18303F] transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EDF2]">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${style.bgColor} ${style.textColor} border ${style.borderColor}`}>
            {riskLevel === 'LOW' ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
            Marine Risk Assessment
          </span>
        </div>
        <span className="text-[10px] text-[#61717D] font-mono">
          Deterministic Evaluation
        </span>
      </div>

      {/* Main Gauge and Score */}
      <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#61717D] mb-1">
            Hazard Severity Level
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${style.textColor}`}>
              {riskLevel === 'LOW' && scenarioId === 'scenario2'
                ? 'LOW / MODERATE'
                : riskLevel}
            </span>
            <span className="text-sm font-semibold text-[#61717D]">
              ({riskScore}/100 Index)
            </span>
          </div>
          <p className="text-xs text-[#61717D] mt-1.5 max-w-lg leading-relaxed">
            {riskSummary}
          </p>
        </div>

        {/* Visual Gauge Bar */}
        <div className="w-full md:w-56 shrink-0 p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8]">
          <div className="flex justify-between text-[10px] font-bold text-[#61717D] mb-1.5">
            <span>CALM</span>
            <span>MODERATE</span>
            <span>SEVERE</span>
          </div>
          <div className="w-full h-2.5 bg-[#E5EDF2] rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${style.barColor}`}
              style={{ width: `${Math.min(100, Math.max(10, riskScore))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#61717D] mt-1.5">
            <span>Safety Threshold</span>
            <span className="font-semibold text-[#18303F]">Hs &lt; 2.2m</span>
          </div>
        </div>
      </div>

      {/* Scenario 2: Route-specific comparative cards */}
      {scenarioId === 'scenario2' && routeData && (
        <div className="mt-4 pt-4 border-t border-[#E5EDF2]">
          <div className="text-xs font-bold text-[#12304A] mb-2.5 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#21618C]" />
            <span>Offshore Route Corridor Evaluation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {routeData.map((route) => {
              const isSelected = selectedRouteId === route.routeId;
              const isRouteA = route.routeId === 'route-a';

              return (
                <div
                  key={route.routeId}
                  onClick={() => onSelectRoute && onSelectRoute(route.routeId)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? isRouteA
                        ? 'bg-[#EAF5F0] border-[#1E824C] shadow-xs'
                        : 'bg-[#FFF8EC] border-[#C58A2B] shadow-xs'
                      : 'bg-[#F7F9FA] border-[#D9E2E8] hover:border-[#CBD8E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#18303F]">
                      {route.routeName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isRouteA
                          ? 'bg-[#1E824C] text-white'
                          : 'bg-[#C58A2B] text-white'
                      }`}
                    >
                      {route.recommendation}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#61717D] leading-snug">
                    {route.summary}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#E5EDF2] flex items-center justify-between text-[11px]">
                    <span className="text-[#61717D]">
                      Wave: <strong className="text-[#18303F]">{route.avgWaveHeight}m</strong>
                    </span>
                    <span className="text-[#61717D]">
                      Wind: <strong className="text-[#18303F]">{route.avgWindSpeed} kt</strong>
                    </span>
                    <span className="text-[#61717D]">
                      Risk: <strong className={isRouteA ? 'text-[#1E824C]' : 'text-[#C58A2B]'}>{route.riskScore}/100</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scenario 3: Marine Hazard Checklist indicators */}
      {scenarioId === 'scenario3' && (
        <div className="mt-4 pt-4 border-t border-[#E5EDF2]">
          <div className="text-xs font-bold text-[#12304A] mb-2.5 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#21618C]" />
            <span>Hazard Category Breakdown</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] flex items-center justify-between">
              <span className="text-[#18303F] font-medium">Tropical Cyclogenesis</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF5F0] text-[#1E824C] border border-[#B2D8C7]">
                CLEAR • 0 Alerts
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] flex items-center justify-between">
              <span className="text-[#18303F] font-medium">Storm Surge Anomaly</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF5F0] text-[#1E824C] border border-[#B2D8C7]">
                NORMAL (±0.08m)
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] flex items-center justify-between">
              <span className="text-[#18303F] font-medium">Dolphin's Nose Rip Current</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFF8EC] text-[#7A4F13] border border-[#E5CE9F]">
                MODERATE ADVISORY
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] flex items-center justify-between">
              <span className="text-[#18303F] font-medium">Offshore Swell Chop</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFF8EC] text-[#7A4F13] border border-[#E5CE9F]">
                1.8m Hs (Elevated)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
