import React from 'react';
import { FollowupDesign } from '../types';
import {
  FlaskConical,
  HelpCircle,
  Sparkles,
  Sliders,
  CheckSquare,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { SAMPLE_FOLLOWUP_DESIGNS } from '../data/presets';

interface FollowupDesignEditorProps {
  design: FollowupDesign;
  onChange: (updated: FollowupDesign) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const FollowupDesignEditor: React.FC<FollowupDesignEditorProps> = ({
  design,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const handleFieldChange = (field: keyof FollowupDesign, value: any) => {
    onChange({
      ...design,
      [field]: value,
    });
  };

  const handleSolventRatioChange = (nonPolar: number, polar: number) => {
    const newSystem = `석유에테르 : 아세톤 = ${nonPolar} : ${polar} (v/v)`;
    onChange({
      ...design,
      newSolventNonPolarRatio: nonPolar,
      newSolventPolarRatio: polar,
      newSolventSystem: newSystem,
    });
  };

  const loadSample = (index: number) => {
    const sample = SAMPLE_FOLLOWUP_DESIGNS[index];
    if (sample) {
      onChange(sample.design);
    }
  };

  // Solvent polarity calculation
  const totalParts = design.newSolventNonPolarRatio + design.newSolventPolarRatio;
  const polarPercent = totalParts > 0 ? (design.newSolventPolarRatio / totalParts) * 100 : 10;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
      {/* Header & Quick sample load */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <FlaskConical className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-slate-800 text-base">
              학생 후속 실험 직접 설계서 (Student Design Sheet)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            1차 실험의 문제점이나 호기심을 해결하기 위한 후속 실험 변인과 가설을 작성하세요.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400">샘플 불러오기:</span>
          {SAMPLE_FOLLOWUP_DESIGNS.map((s, idx) => (
            <button
              key={`sample-${idx}`}
              type="button"
              onClick={() => loadSample(idx)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title={s.subtitle}
            >
              예시 {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Research Goal & Motivation */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          1. 후속 탐구 목적 및 문제 인식
        </label>
        <p className="text-xs text-slate-500">
          1차 실험에서 무엇이 아쉬웠거나, 어떤 현상(예: 엽록소 a와 잔토필의 겹침, 꼬리끌림)을 개선하고 싶나요?
        </p>
        <textarea
          rows={2}
          value={design.researchGoal}
          onChange={(e) => handleFieldChange('researchGoal', e.target.value)}
          placeholder="예: 1차 실험에서 잔토필과 엽록소 a의 이동 거리가 너무 가까워 경계가 겹쳤습니다. 전개용매의 조성을 조절하여 두 색소 간의 분리 간격을 넓히고자 합니다."
          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Step 2: Hypothesis Formulation */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            2. 검증하고자 하는 가설 (Hypothesis)
          </label>
          <span className="text-[11px] text-sky-600 font-medium flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" />
            조작변인과 종속변인의 인과관계를 포함하세요
          </span>
        </div>
        <textarea
          rows={2}
          value={design.hypothesis}
          onChange={(e) => handleFieldChange('hypothesis', e.target.value)}
          placeholder="예: 극성 용매인 아세톤의 부피비를 9:1에서 8:2로 늘리면, 극성이 있는 잔토필과 엽록소류의 실리카겔 탈착이 촉진되어 전반적인 Rf값이 상승하고 밴드 간 분리도가 개선될 것이다."
          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Step 3: Variables Setup */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          3. 엄밀한 변인 통제 설정 (Variables Control)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Independent Variable */}
          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              조작 변인 (Independent)
            </div>
            <p className="text-[11px] text-sky-700 mb-2">단 하나만 다르게 할 조건</p>
            <input
              type="text"
              value={design.independentVariable}
              onChange={(e) => handleFieldChange('independentVariable', e.target.value)}
              placeholder="예: 전개용매 석유에테르와 아세톤 비율"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Dependent Variable */}
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              종속 변인 (Dependent)
            </div>
            <p className="text-[11px] text-emerald-700 mb-2">측정하고 관찰할 결과</p>
            <input
              type="text"
              value={design.dependentVariable}
              onChange={(e) => handleFieldChange('dependentVariable', e.target.value)}
              placeholder="예: 색소별 이동 거리, Rf값, 분리 간격"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Controlled Variables */}
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              통제 변인 (Controlled)
            </div>
            <p className="text-[11px] text-amber-700 mb-2">동일하게 유지해야 할 모든 조건</p>
            <textarea
              rows={2}
              value={design.controlledVariables}
              onChange={(e) => handleFieldChange('controlledVariables', e.target.value)}
              placeholder="예: TLC판 재질, 점적 크기 및 농도, 전개 거리(7cm), 챔버 포화도, 온도"
              className="w-full px-2.5 py-1 text-xs bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Step 4: Solvent System Fine-Tuning Slider */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              4. 전개용매 조성 비율 설정기 (Mobile Phase Composition)
            </span>
            <p className="text-[11px] text-slate-500">
              비극성 용매(석유에테르)와 극성 용매(아세톤)의 부피 혼합비를 조절하세요.
            </p>
          </div>
          <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs text-xs font-mono font-bold text-slate-800">
            {design.newSolventSystem}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>비극성 용매 (석유에테르 / 헥세인)</span>
              <span className="font-bold text-sky-700">{design.newSolventNonPolarRatio} mL</span>
            </div>
            <input
              type="range"
              min="5"
              max="10"
              step="0.5"
              value={design.newSolventNonPolarRatio}
              onChange={(e) =>
                handleSolventRatioChange(
                  parseFloat(e.target.value) || 9,
                  design.newSolventPolarRatio
                )
              }
              className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>극성 용매 (아세톤)</span>
              <span className="font-bold text-rose-600">{design.newSolventPolarRatio} mL</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={design.newSolventPolarRatio}
              onChange={(e) =>
                handleSolventRatioChange(
                  design.newSolventNonPolarRatio,
                  parseFloat(e.target.value) || 0
                )
              }
              className="w-full accent-rose-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Polarity Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-medium text-slate-600">
            <span>극성 용매 비율: {polarPercent.toFixed(1)}%</span>
            <span>
              {polarPercent > 25
                ? '⚠️ 극성 과다: 전선 부근으로 모든 색소 몰림 위험'
                : polarPercent < 5
                ? '⚠️ 극성 부족: 극성 색소(엽록소류) 이동 정체 위험'
                : '적정 극성 탐색 구간 (5~20%)'}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-sky-400 transition-all"
              style={{ width: `${100 - polarPercent}%` }}
              title="비극성 성분"
            />
            <div
              className="h-full bg-rose-500 transition-all"
              style={{ width: `${polarPercent}%` }}
              title="극성 성분"
            />
          </div>
        </div>

        {/* Chamber Condition */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            챔버 사전 포화 조건
          </label>
          <select
            value={design.chamberCondition}
            onChange={(e) => handleFieldChange('chamberCondition', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500"
          >
            <option value="밀폐 챔버 내 여과지를 적셔 전개용매 증기로 15분간 사전 포화">
              밀폐 챔버 내 여과지 삽입 후 15분간 사전 포화 (권장: 균일 전개)
            </option>
            <option value="여과지 없이 밀폐 챔버 5분 포화">여과지 없이 밀폐 챔버 5분 포화</option>
            <option value="사전 포화 없이 용매 투입 즉시 TLC판 투입 (미포화)">
              사전 포화 없이 즉시 투입 (용매 증발로 가장자리 왜곡 가능성 있음)
            </option>
          </select>
        </div>
      </div>

      {/* Step 5: Experimental Plan & Rationale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            5. 구체적 실험 과정 및 대조군 설정
          </label>
          <textarea
            rows={4}
            value={design.experimentalPlan}
            onChange={(e) => handleFieldChange('experimentalPlan', e.target.value)}
            placeholder="1. 전개용매를 제조한다.&#10;2. 한 TLC 판에 대조군(기존 9:1)과 실험군 시료를 나란히 점적하거나 동일 조건 챔버를 병행 운용한다.&#10;3. 점적 크기를 지름 2mm 이하로 통제하고..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            6. 학생이 생각한 이론적 근거 (Rationale)
          </label>
          <textarea
            rows={4}
            value={design.studentRationale}
            onChange={(e) => handleFieldChange('studentRationale', e.target.value)}
            placeholder="실리카겔 고정상의 극성 실란올기(-OH)와 전개용매 분자, 색소 분자의 극성 차이로 인해 왜 이런 분리 변화가 일어날 것이라 예상했는지 서술하세요."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all ${
            isLoading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 cursor-pointer hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>AI 형성평가 가상 점검 수행 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>AI 후속 실험 가상 점검 및 형성평가 피드백 받기</span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          * AI는 확정된 정답 수치를 대신 주지 않으며, 화학 원리 기반의 경향성과 변인통제 논리를 점검하여 보완을 돕습니다.
        </p>
      </div>
    </div>
  );
};
