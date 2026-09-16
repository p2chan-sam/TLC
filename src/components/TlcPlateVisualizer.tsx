import React from 'react';
import { PigmentSpot } from '../types';
import { Info } from 'lucide-react';

interface TlcPlateVisualizerProps {
  pigments: PigmentSpot[];
  solventSystem: string;
  plateHeightCm?: number;
  originCm?: number;
  solventFrontCm?: number;
  followupSolventRatio?: { nonPolar: number; polar: number };
  showComparison?: boolean;
  onUpdateSpotRf?: (id: string, newRf: number) => void;
  interactive?: boolean;
}

export const TlcPlateVisualizer: React.FC<TlcPlateVisualizerProps> = ({
  pigments,
  solventSystem,
  plateHeightCm = 10.0,
  originCm = 1.0,
  solventFrontCm = 7.0,
  followupSolventRatio,
  showComparison = false,
  onUpdateSpotRf,
  interactive = false,
}) => {
  // Coordinate calculations
  // SVG viewBox height = 400, width = 280 (or 420 for dual lane)
  const plateTop = 20;
  const plateBottom = 380;
  const plateH = plateBottom - plateTop; // 360px for plateHeightCm (e.g. 10cm -> 36px/cm)
  const pxPerCm = plateH / plateHeightCm;

  const originY = plateBottom - originCm * pxPerCm;
  const solventFrontY = plateBottom - solventFrontCm * pxPerCm;
  const developmentHeight = originY - solventFrontY;

  // Calculate follow-up qualitative shift factor based on polar solvent ratio
  // Base is polar ratio = 1 (9:1)
  const polarRatio = followupSolventRatio?.polar ?? 1;
  const nonPolarRatio = followupSolventRatio?.nonPolar ?? 9;
  const totalRatio = polarRatio + nonPolarRatio || 10;
  const polarPercent = (polarRatio / totalRatio) * 100; // base is 10%

  return (
    <div className="flex flex-col items-center bg-white rounded-xl border border-slate-200 p-4 shadow-sm w-full">
      <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            TLC 플레이트 시각화
          </span>
          <p className="text-sm font-bold text-slate-800">
            {showComparison ? '기존 실험 vs 후속 가상 경향성 비교' : '1차 실험 TLC 전개 결과'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-mono">
          <span>{solventSystem}</span>
        </div>
      </div>

      <div className="relative w-full flex justify-center py-2 overflow-x-auto">
        <svg
          viewBox={showComparison ? '0 0 380 400' : '0 0 280 400'}
          className="h-[360px] max-w-full drop-shadow-md select-none"
        >
          <defs>
            {/* Silica gel textured background */}
            <linearGradient id="silicaBg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
            {/* Wet solvent mark gradient */}
            <linearGradient id="wetSolvent" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* TLC Plate body */}
          <rect
            x={showComparison ? 45 : 45}
            y={plateTop}
            width={showComparison ? 310 : 200}
            height={plateH}
            rx={6}
            fill="url(#silicaBg)"
            stroke="#cbd5e1"
            strokeWidth={1.5}
          />

          {/* Wet solvent region from bottom to solvent front */}
          <rect
            x={showComparison ? 46 : 46}
            y={solventFrontY}
            width={showComparison ? 308 : 198}
            height={plateBottom - solventFrontY}
            fill="url(#wetSolvent)"
            opacity={0.35}
          />

          {/* Left Ruler / Scale */}
          <g className="text-[10px] fill-slate-400 font-mono">
            {Array.from({ length: 11 }).map((_, i) => {
              const y = plateBottom - i * pxPerCm;
              return (
                <g key={`ruler-${i}`}>
                  <line
                    x1={35}
                    y1={y}
                    x2={43}
                    y2={y}
                    stroke="#94a3b8"
                    strokeWidth={i % 5 === 0 ? 1.5 : 1}
                  />
                  {i % 2 === 0 && (
                    <text x={28} y={y + 3} textAnchor="end">
                      {i}cm
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Origin Line (원점) */}
          <line
            x1={showComparison ? 50 : 50}
            y1={originY}
            x2={showComparison ? 350 : 240}
            y2={originY}
            stroke="#64748b"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <text
            x={showComparison ? 352 : 242}
            y={originY + 3}
            className="text-[10px] fill-slate-500 font-medium"
          >
            원점 (1.0cm)
          </text>

          {/* Solvent Front Line (용매 전선) */}
          <line
            x1={showComparison ? 50 : 50}
            y1={solventFrontY}
            x2={showComparison ? 350 : 240}
            y2={solventFrontY}
            stroke="#0284c7"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
          <text
            x={showComparison ? 352 : 242}
            y={solventFrontY + 3}
            className="text-[10px] fill-sky-600 font-bold"
          >
            전선 ({solventFrontCm}cm)
          </text>

          {/* Lane 1: Baseline Experiment */}
          <g>
            <text
              x={showComparison ? 120 : 145}
              y={plateTop + 16}
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-700"
            >
              {showComparison ? '1차 실험 (9:1)' : '시금치 추출액 전개 밴드'}
            </text>

            {/* Baseline Pigment spots */}
            {pigments.map((pigment) => {
              const spotY = originY - pigment.observedRf * developmentHeight;
              const laneX = showComparison ? 120 : 145;

              return (
                <g key={`base-${pigment.id}`}>
                  {/* Spot ellipse */}
                  <ellipse
                    cx={laneX}
                    cy={spotY}
                    rx={18}
                    ry={pigment.id === 'chlorophyll_b' ? 9 : 6}
                    fill={pigment.color}
                    opacity={0.88}
                    stroke={pigment.textColor}
                    strokeWidth={1}
                  />
                  {/* Small label */}
                  <text
                    x={laneX + 22}
                    y={spotY + 3}
                    className="text-[9px] font-semibold"
                    fill={pigment.textColor}
                  >
                    {pigment.name} (Rf {pigment.observedRf.toFixed(2)})
                  </text>
                </g>
              );
            })}
          </g>

          {/* Lane 2: Follow-up Virtual Qualitative Behavior (If comparison enabled) */}
          {showComparison && (
            <g>
              <line
                x1={200}
                y1={plateTop + 10}
                x2={200}
                y2={plateBottom - 10}
                stroke="#e2e8f0"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              <text
                x={275}
                y={plateTop + 16}
                textAnchor="middle"
                className="text-[11px] font-bold fill-indigo-700"
              >
                후속 가상 경향 ({followupSolventRatio?.nonPolar}:{followupSolventRatio?.polar})
              </text>

              {/* Qualitative shift visualization - NOT exact fake numbers, but directional range indicators */}
              {pigments.map((pigment) => {
                // Calculate qualitative shift direction:
                // If polar ratio increases (> 10%), polar pigments shift upwards
                // Chlorophyll b (polarity 4) and a (polarity 3) and xanthophyll (polarity 2) shift up.
                // Carotene barely shifts because it already runs near the front.
                const polarMultiplier = (polarPercent - 10) / 40; // positive if more polar, negative if less polar
                const sensitivity = (pigment.polarityRank - 0.5) * 0.12;
                const estimatedRfDelta = Math.max(-0.2, Math.min(0.25, polarMultiplier * sensitivity));
                const targetRf = Math.max(0.08, Math.min(0.98, pigment.observedRf + estimatedRfDelta));

                const currentY = originY - pigment.observedRf * developmentHeight;
                const virtualY = originY - targetRf * developmentHeight;
                const laneX = 270;

                return (
                  <g key={`followup-${pigment.id}`}>
                    {/* Directional arrow connecting baseline to projected position */}
                    <line
                      x1={140}
                      y1={currentY}
                      x2={laneX - 20}
                      y2={virtualY}
                      stroke="#94a3b8"
                      strokeWidth={1}
                      strokeDasharray="2 2"
                    />

                    {/* Qualitative Projected Range Band */}
                    <rect
                      x={laneX - 18}
                      y={virtualY - 8}
                      width={36}
                      height={16}
                      rx={8}
                      fill={pigment.color}
                      opacity={0.4}
                      stroke={pigment.textColor}
                      strokeWidth={1.5}
                      strokeDasharray="3 2"
                    />

                    {/* Trend indicator arrow icon */}
                    <text
                      x={laneX + 22}
                      y={virtualY + 3}
                      className="text-[9px] font-bold"
                      fill={pigment.textColor}
                    >
                      {pigment.name}{' '}
                      {estimatedRfDelta > 0.03
                        ? '▲ 상승 경향'
                        : estimatedRfDelta < -0.03
                        ? '▼ 하강 경향'
                        : '≈ 유지'}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Spot summary table / Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-2 pt-2 border-t border-slate-100">
        {pigments.map((p) => (
          <div
            key={`legend-${p.id}`}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
          >
            <div
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: p.color }}
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-800 truncate">{p.name}</div>
              <div className="text-[11px] text-slate-500">Rf: {p.observedRf.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {showComparison && (
        <div className="w-full mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>가상 점검 안내:</strong> 우측 레인의 점선 영역은 화학적 극성 비에 따른{' '}
            <em>정성적 이동 경향성(상승/하강 방향)</em>을 개념화한 것입니다. 실제 정확한 Rf값과
            분리도는 실험실 환경(온도, 점적 크기 등)에 따라 달라지므로 직접 실험을 통해 검증해야 합니다.
          </p>
        </div>
      )}
    </div>
  );
};
