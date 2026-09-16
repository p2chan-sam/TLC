import React, { useState } from 'react';
import {
  BaselineExperiment,
  FollowupDesign,
  EvaluationResult,
} from './types';
import {
  INITIAL_BASELINE_EXPERIMENT,
  SAMPLE_FOLLOWUP_DESIGNS,
} from './data/presets';
import { TlcPlateVisualizer } from './components/TlcPlateVisualizer';
import { FollowupDesignEditor } from './components/FollowupDesignEditor';
import { EvaluationReportView } from './components/EvaluationReportView';
import { BaselineEditorModal } from './components/BaselineEditorModal';
import { PrinciplesGuideModal } from './components/PrinciplesGuideModal';
import { SocraticCoachModal } from './components/SocraticCoachModal';
import {
  FlaskConical,
  BookOpen,
  Settings,
  MessageSquareQuote,
  Sparkles,
  Layers,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  const [baseline, setBaseline] = useState<BaselineExperiment>(INITIAL_BASELINE_EXPERIMENT);
  const [followup, setFollowup] = useState<FollowupDesign>(SAMPLE_FOLLOWUP_DESIGNS[0].design);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab & modal states
  const [activeTab, setActiveTab] = useState<'design' | 'report'>('design');
  const [showComparisonOnPlate, setShowComparisonOnPlate] = useState<boolean>(true);
  const [isBaselineModalOpen, setIsBaselineModalOpen] = useState<boolean>(false);
  const [isPrinciplesModalOpen, setIsPrinciplesModalOpen] = useState<boolean>(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState<boolean>(false);

  const handleEvaluate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/evaluate-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baselineExperiment: baseline,
          followupDesign: followup,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'AI 가상 점검 중 오류가 발생했습니다.');
      }

      const result: EvaluationResult = await response.json();
      setEvaluation(result);
      setActiveTab('report');
      setShowComparisonOnPlate(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || '가상 점검을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRevisionNotes = (notes: string) => {
    setFollowup((prev) => ({
      ...prev,
      studentRevisionNotes: notes,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-600 flex items-center justify-center text-white shadow-sm">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  시금치 색소 TLC 후속 실험 가상 점검 도구
                </h1>
                <span className="hidden md:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  형성평가 코칭
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                학생 주도 실험 설계 점검 · 변인 통제 논리 검증 · 소크라테스식 발문 비계
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPrinciplesModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="TLC 화학 원리 및 극성 순서 안내"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">화학 원리 가이드</span>
            </button>

            <button
              onClick={() => setIsCoachModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">탐구 코치 문답</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="font-bold underline ml-4 hover:text-rose-950"
            >
              닫기
            </button>
          </div>
        )}

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual TLC Plate & 1st Experiment Overview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Interactive TLC Visualizer */}
            <TlcPlateVisualizer
              pigments={baseline.pigments}
              solventSystem={baseline.solventSystem}
              plateHeightCm={baseline.plateHeightCm}
              solventFrontCm={baseline.solventFrontCm}
              originCm={baseline.originCm}
              showComparison={showComparisonOnPlate}
              followupSolventRatio={{
                nonPolar: followup.newSolventNonPolarRatio,
                polar: followup.newSolventPolarRatio,
              }}
            />

            {/* Comparison Mode Toggle */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                가상 후속 전개 경향성 비교 모드
              </span>
              <button
                type="button"
                onClick={() => setShowComparisonOnPlate(!showComparisonOnPlate)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  showComparisonOnPlate ? 'bg-sky-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showComparisonOnPlate ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Baseline Record Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  1차 실험 관찰 기록 요약
                </span>
                <button
                  type="button"
                  onClick={() => setIsBaselineModalOpen(true)}
                  className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  데이터 수정
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">전개용매 조건:</span>
                  <span className="font-medium text-slate-800">{baseline.solventSystem}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">고정상:</span>
                  <span className="font-medium text-slate-800">{baseline.plateType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">관찰 특이사항 및 한계점:</span>
                  <p className="p-2.5 rounded-lg bg-slate-50 text-slate-700 leading-relaxed italic border border-slate-100">
                    "{baseline.baselineNotes}"
                  </p>
                </div>
              </div>
            </div>

            {/* Inquiry Guidance Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-4 text-xs text-emerald-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                좋은 후속 탐구 설계를 위한 3원칙
              </div>
              <ul className="space-y-1.5 text-emerald-900/90 pl-1">
                <li>
                  <strong>1. 단일 조작 변인:</strong> 전개용매 극성비, 점적 농도, 챔버 조건 중{' '}
                  <em>한 번에 하나만</em> 변경하세요.
                </li>
                <li>
                  <strong>2. 대조군 동시 전개:</strong> 환경 오차 배제를 위해 기존 9:1 조성 시료와
                  나란히 점적하여 전개할 계획을 세우세요.
                </li>
                <li>
                  <strong>3. 화학적 인과관계:</strong> 실리카겔의 -OH기와 용매 극성 경쟁을 바탕으로
                  가설을 서술하세요.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Work Tabs (Design vs Assessment Report) (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Tab navigation */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'design'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FlaskConical className="w-4 h-4 text-sky-600" />
                <span>1. 후속 실험 직접 설계</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>2. AI 형성평가 및 가상 점검</span>
                {evaluation && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'design' ? (
              <FollowupDesignEditor
                design={followup}
                onChange={setFollowup}
                onSubmit={handleEvaluate}
                isLoading={isLoading}
              />
            ) : evaluation ? (
              <EvaluationReportView
                evaluation={evaluation}
                followupDesign={followup}
                baselineExperiment={baseline}
                onUpdateRevisionNotes={handleUpdateRevisionNotes}
                onOpenChatCoach={() => setIsCoachModalOpen(true)}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-bold text-base text-slate-800">
                    아직 가상 점검을 수행하지 않았습니다
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    '후속 실험 직접 설계' 탭에서 가설과 변인 설정을 작성한 후,
                    <strong> 'AI 후속 실험 가상 점검'</strong> 버튼을 클릭하면 형성평가 보고서가
                    생성됩니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('design')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors cursor-pointer"
                >
                  실험 설계서 작성하러 가기
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-400">
        시금치 색소 TLC 후속 실험 AI 가상 점검 형성평가 도구 · 고등학교 및 대학 과학 탐구실험 보조 시스템
      </footer>

      {/* Modals */}
      <BaselineEditorModal
        isOpen={isBaselineModalOpen}
        onClose={() => setIsBaselineModalOpen(false)}
        baseline={baseline}
        onSave={(newBase) => setBaseline(newBase)}
      />

      <PrinciplesGuideModal
        isOpen={isPrinciplesModalOpen}
        onClose={() => setIsPrinciplesModalOpen(false)}
      />

      <SocraticCoachModal
        isOpen={isCoachModalOpen}
        onClose={() => setIsCoachModalOpen(false)}
        baseline={baseline}
        followup={followup}
      />
    </div>
  );
}
