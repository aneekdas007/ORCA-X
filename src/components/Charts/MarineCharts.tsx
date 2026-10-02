import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { DemoScenario } from '../../types';

interface MarineChartsProps {
  scenario: DemoScenario;
}

export const MarineCharts: React.FC<MarineChartsProps> = ({ scenario }) => {
  const [activeMetric, setActiveMetric] = useState<'wave' | 'wind' | 'risk'>('wave');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { chartType, chartData } = scenario;

  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#D9E2E8] p-4 sm:p-5 shadow-xs text-[#18303F] min-w-0">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E5EDF2] gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-md bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2] shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#12304A] truncate">
              {chartType === 'route_comparison'
                ? 'Navigational Route Corridor Metric Comparison — Kochi'
                : chartType === 'hazard_timeline'
                ? 'Diurnal Hazard Index & Headland Current Forecast — Visakhapatnam'
                : 'Oceanographic Wave & Atmospheric Wind Forecast — Paradip'}
            </h3>
            <p className="text-[11px] text-[#61717D] truncate">
              Numerical model simulation • INCOIS SWAN & Oceansat-3 Feeds
            </p>
          </div>
        </div>

        {/* Metric Switcher for Scenario 1 */}
        {chartType === 'wave_wind_time' && (
          <div className="flex items-center gap-1 text-[11px] bg-[#F7F9FA] p-1 rounded-lg border border-[#D9E2E8] shrink-0">
            <button
              onClick={() => setActiveMetric('wave')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeMetric === 'wave'
                  ? 'bg-[#21618C] text-white shadow-xs'
                  : 'text-[#61717D] hover:text-[#18303F]'
              }`}
            >
              Wave (Hs)
            </button>
            <button
              onClick={() => setActiveMetric('wind')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeMetric === 'wind'
                  ? 'bg-[#21618C] text-white shadow-xs'
                  : 'text-[#61717D] hover:text-[#18303F]'
              }`}
            >
              Wind (kts)
            </button>
            <button
              onClick={() => setActiveMetric('risk')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeMetric === 'risk'
                  ? 'bg-[#C58A2B] text-white shadow-xs'
                  : 'text-[#61717D] hover:text-[#18303F]'
              }`}
            >
              Risk Index
            </button>
          </div>
        )}
      </div>

      {/* SCENARIO 1: Wave / Wind / Risk Time Series Chart */}
      {chartType === 'wave_wind_time' && (
        <div className="mt-5 min-w-0">
          {/* Legend and Threshold indicator */}
          <div className="flex flex-wrap items-center justify-between text-xs text-[#61717D] mb-3 gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
              {activeMetric === 'wave' && (
                <>
                  <span className="flex items-center gap-1.5 text-[#18303F] font-semibold whitespace-nowrap">
                    <span className="w-3 h-1.5 bg-[#21618C] rounded shrink-0"></span>
                    <span>Significant Wave Height (Hs in meters)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#C58A2B] text-[11px] font-medium whitespace-nowrap">
                    <span className="w-3 h-0.5 bg-[#C58A2B] border-dashed shrink-0"></span>
                    <span>Caution Threshold (&gt;1.8m)</span>
                  </span>
                </>
              )}
              {activeMetric === 'wind' && (
                <>
                  <span className="flex items-center gap-1.5 text-[#18303F] font-semibold whitespace-nowrap">
                    <span className="w-3 h-1.5 bg-[#21618C] rounded shrink-0"></span>
                    <span>Sustained Wind (kt)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#3B82A0] font-semibold whitespace-nowrap">
                    <span className="w-3 h-1.5 bg-[#3B82A0] rounded shrink-0"></span>
                    <span>Gust Velocity (kt)</span>
                  </span>
                </>
              )}
              {activeMetric === 'risk' && (
                <span className="flex items-center gap-1.5 text-[#C58A2B] font-semibold whitespace-nowrap">
                  <span className="w-3 h-1.5 bg-[#C58A2B] rounded shrink-0"></span>
                  <span>Composite Hazard Index (0-100)</span>
                </span>
              )}
            </div>

            <span className="text-[11px] text-[#7A93A6] font-mono shrink-0">
              Paradip Offshore Sector
            </span>
          </div>

          {/* Clean Bar Chart */}
          <div className="relative h-56 w-full pt-4 min-w-0">
            <div className="h-44 w-full flex items-end justify-between gap-1 sm:gap-2 px-1 sm:px-2 border-b border-l border-[#CBD8E1] min-w-0">
              {chartData.map((d, i) => {
                let value = 0;
                let max = 1;
                let displayVal = '';
                let barColor = 'bg-[#21618C]';

                if (activeMetric === 'wave') {
                  value = (d.waveHeight as number) || 0;
                  max = 3.0;
                  displayVal = `${value}m`;
                  barColor = value >= 1.8 ? 'bg-[#C58A2B]' : 'bg-[#21618C]';
                } else if (activeMetric === 'wind') {
                  value = (d.windSpeed as number) || 0;
                  max = 35;
                  displayVal = `${value}kt`;
                  barColor = 'bg-[#3B82A0]';
                } else {
                  value = (d.riskScore as number) || 0;
                  max = 100;
                  displayVal = `${value}`;
                  barColor = value >= 60 ? 'bg-[#B84A4A]' : 'bg-[#C58A2B]';
                }

                const heightPercent = Math.min(100, Math.round((value / max) * 100));

                return (
                  <div
                    key={i}
                    className="flex-1 min-w-0 flex flex-col items-center group relative cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Tooltip on hover */}
                    {hoveredIdx === i && (
                      <div className="absolute -top-10 z-30 px-2 py-1 rounded bg-[#12304A] text-[10px] text-white whitespace-nowrap shadow-md">
                        <strong>{d.time}:</strong> {displayVal}
                        {activeMetric === 'wind' && d.gustSpeed && ` (Gusts: ${d.gustSpeed}kt)`}
                      </div>
                    )}

                    {/* Value on top */}
                    <span className="text-[9px] sm:text-[10px] font-mono text-[#61717D] font-bold mb-1 group-hover:text-[#18303F] truncate w-full text-center">
                      {displayVal}
                    </span>

                    {/* Bar container */}
                    <div className="w-full max-w-[34px] h-36 bg-[#F0F4F7] rounded-t flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t ${barColor} transition-all duration-300 group-hover:opacity-90`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Time Label */}
                    <span className="text-[8px] sm:text-[9px] text-[#7A93A6] font-mono mt-2 text-center truncate w-full">
                      {d.time.replace(' IST', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SCENARIO 2: Route A vs Route B Comparative Chart */}
      {chartType === 'route_comparison' && (
        <div className="mt-5 space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2 min-w-0">
            <span className="text-[#61717D] truncate">
              Comparative Environmental Metric Differential
            </span>
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold shrink-0">
              <span className="flex items-center gap-1.5 text-[#1E824C] whitespace-nowrap">
                <span className="w-3 h-3 rounded bg-[#1E824C] shrink-0"></span>
                Route A (Inner Shelf)
              </span>
              <span className="flex items-center gap-1.5 text-[#C58A2B] whitespace-nowrap">
                <span className="w-3 h-3 rounded bg-[#C58A2B] shrink-0"></span>
                Route B (Outer Deep)
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2 min-w-0">
            {chartData.map((metric, idx) => {
              const valA = Number(metric.RouteA);
              const valB = Number(metric.RouteB);
              const unit = metric.unit as string;
              const maxScale = Math.max(valA, valB) * 1.25 || 100;
              const pctA = Math.round((valA / maxScale) * 100);
              const pctB = Math.round((valB / maxScale) * 100);

              return (
                <div key={idx} className="p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E2E8] min-w-0">
                  <div className="flex flex-wrap items-center justify-between text-xs mb-2 gap-1 min-w-0">
                    <span className="font-semibold text-[#18303F] min-w-0 truncate">
                      {metric.time}
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs shrink-0">
                      <span className="text-[#1E824C] font-bold whitespace-nowrap">
                        A: {valA} {unit}
                      </span>
                      <span className="text-[#7A93A6]">vs</span>
                      <span className="text-[#C58A2B] font-bold whitespace-nowrap">
                        B: {valB} {unit}
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1.5 min-w-0">
                    {/* Route A Bar */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-[#61717D] w-14 font-semibold shrink-0">Route A</span>
                      <div className="flex-1 h-2 bg-[#E5EDF2] rounded-full overflow-hidden min-w-0">
                        <div
                          className="h-full bg-[#1E824C] rounded-full transition-all duration-500"
                          style={{ width: `${pctA}%` }}
                        />
                      </div>
                    </div>

                    {/* Route B Bar */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-[#61717D] w-14 font-semibold shrink-0">Route B</span>
                      <div className="flex-1 h-2 bg-[#E5EDF2] rounded-full overflow-hidden min-w-0">
                        <div
                          className="h-full bg-[#C58A2B] rounded-full transition-all duration-500"
                          style={{ width: `${pctB}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-[#EAF5F0] border border-[#B2D8C7] text-xs text-[#0E4F2E] flex items-center justify-between min-w-0">
            <span className="leading-relaxed">Result: Route A provides a <strong>46% reduction in wave impact</strong> and eliminates high cross-sea roll hazard.</span>
          </div>
        </div>
      )}

      {/* SCENARIO 3: Marine Hazard Timeline & Estuarine Rip Current Severity */}
      {chartType === 'hazard_timeline' && (
        <div className="mt-5 space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between text-xs text-[#61717D] gap-2 min-w-0">
            <span className="truncate">Diurnal Hazard Risk Profile (24-Hour Cycle)</span>
            <span className="text-[#C58A2B] font-semibold text-[11px] shrink-0">
              {scenario.id === 'scenario3' 
                ? 'Rip Current Peak: 09:30 – 12:45 IST (Dolphin\'s Nose Ebb Tide)' 
                : 'Rip Current Peak: 09:00 – 12:00 IST (Ebb Tide)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-w-0">
            {chartData.map((block, idx) => {
              const score = Number(block.riskScore);
              const isPeak = idx === 2;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-colors min-w-0 ${
                    isPeak
                      ? 'bg-[#FFF8EC] border-[#E5CE9F]'
                      : 'bg-[#F7F9FA] border-[#D9E2E8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 gap-2 min-w-0">
                    <span className="text-xs font-bold text-[#18303F] min-w-0 truncate">
                      {block.time}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 whitespace-nowrap ${
                        isPeak
                          ? 'bg-[#C58A2B] text-white'
                          : 'bg-[#EBF3F7] text-[#21618C] border border-[#DCEAF2]'
                      }`}
                    >
                      {score}/100 Risk
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-[#61717D] pt-1 border-t border-[#E5EDF2] min-w-0">
                    <div className="flex justify-between gap-1">
                      <span className="truncate">Significant Wave:</span>
                      <strong className="text-[#18303F] shrink-0">{block.waveHeight}m</strong>
                    </div>
                    <div className="flex justify-between gap-1">
                      <span className="truncate">{scenario.id === 'scenario3' ? 'Headland Rip Speed:' : 'Estuary Rip Speed:'}</span>
                      <strong className={`shrink-0 ${isPeak ? 'text-[#C58A2B]' : 'text-[#18303F]'}`}>
                        {block.currentSpeed} m/s
                      </strong>
                    </div>
                    <div className="flex justify-between gap-1">
                      <span className="truncate">Wind Speed:</span>
                      <strong className="text-[#18303F] shrink-0">{block.windSpeed} kt</strong>
                    </div>
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
