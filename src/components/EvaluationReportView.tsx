import React, { useState } from 'react';
import { EvaluationResult, FollowupDesign, BaselineExperiment } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Printer,
  ChevronDown,
  ChevronUp,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
  Edit3,
  BookmarkCheck,
} from 'lucide-react';

interface EvaluationReportViewProps {
  evaluation: EvaluationResult;
  followupDesign: FollowupDesign;
  baselineExperiment: BaselineExperiment;
  onUpdateRevisionNotes: (notes: string) => void;
  onOpenChatCoach: () => void;
}

export const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({
  evaluation,
  followupDesign,
  baselineExperiment,
  onUpdateRevisionNotes,
  onOpenChatCoach,
}) => {
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, string>>({});
  const [localRevisionNotes, setLocalRevisionNotes] = useState(
    followupDesign.studentRevisionNotes || ''
  );
  const [isSavedLocally, setIsSavedLocally] = useState(false);

  const handleSaveRevision = () => {
    onUpdateRevisionNotes(localRevisionNotes);
    setIsSavedLocally(true);
    setTimeout(() => setIsSavedLocally(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const { rubricScores } = evaluation;
  const averageScore = (
    (rubricScores.hypothesisClarity +
      rubricScores.variableControlRigorousness +
      rubricScores.scientificPrincipleAlignment +
      rubricScores.feasibilityAndSafety) /
    4
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner / Assessment Mode Notice */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg print:bg-white print:text-black print:border print:border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              AI 형성평가 가상 점검 완료
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              학생 설계 후속 실험 형성평가 피드백 보고서
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              본 도구는 인위적인 수치를 대신 제공하지 않으며, 학생이 화학적 원리와 변인 통제
              논리를 바탕으로 자신의 설계를 스스로 보완하고 실제 실험으로 검증할 수 있도록 지원합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 print:hidden">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              보고서 인쇄 / PDF
            </button>
            <button
              onClick={onOpenChatCoach}
              className="px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              AI 교사와 실시간 문답
            </button>
          </div>
        </div>

        {/* Overall Assessment Quote */}
        <div className="mt-5 p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-sm text-slate-100 leading-relaxed">
          <div className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-1">
            종합 총평 및 평가 코멘트
          </div>
          {evaluation.overallAssessment}
        </div>
      </div>

      {/* 4 Rubric Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">가설 명확성</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
              {rubricScores.hypothesisClarity} / 5
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-sky-500 h-1.5 rounded-full"
              style={{ width: `${(rubricScores.hypothesisClarity / 5) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">인과관계 및 검증 가능성</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">변인통제 엄밀성</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
              {rubricScores.variableControlRigorousness} / 5
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-indigo-500 h-1.5 rounded-full"
              style={{ width: `${(rubricScores.variableControlRigorousness / 5) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">단일 조작 및 잠재오차 통제</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">화학원리 정합성</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              {rubricScores.scientificPrincipleAlignment} / 5
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${(rubricScores.scientificPrincipleAlignment / 5) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">실리카겔-용매 극성 상호작용</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">실행성 및 안전</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              {rubricScores.feasibilityAndSafety} / 5
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-amber-500 h-1.5 rounded-full"
              style={{ width: `${(rubricScores.feasibilityAndSafety / 5) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">실험실 재현성 및 위험요소</p>
        </div>
      </div>

      {/* Module 1: Variable Control Deep Dive */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileCheck className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-base">
            1. 변인 통제 및 실험 설계 타당성 점검
          </h3>
        </div>

        {/* Single Variable Status */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            evaluation.variableControlReview.isSingleVariableManipulated
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}
        >
          {evaluation.variableControlReview.isSingleVariableManipulated ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <div className="font-bold mb-0.5">
              {evaluation.variableControlReview.isSingleVariableManipulated
                ? '단일 조작 변인 통제 양호'
                : '조작 변인의 다중 변경 또는 모호성 감지'}
            </div>
            <p className="leading-relaxed">
              {evaluation.variableControlReview.isSingleVariableManipulated
                ? '의도한 조작 변인이 명확하게 한 가지로 설정되어 다른 변인과의 간섭을 최소화했습니다.'
                : '여러 조건(예: 용매 종류와 부피비, 점적 농도 등)이 동시에 바뀌면 어떤 요인 때문에 결과가 변했는지 검증하기 어렵습니다.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              설계에서 우수한 점
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {evaluation.variableControlReview.strengths.map((s, idx) => (
                <li key={`str-${idx}`} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vulnerabilities */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              간과되었거나 보완할 통제 변인
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {evaluation.variableControlReview.vulnerabilities.map((v, idx) => (
                <li key={`vul-${idx}`} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Control Group Advice */}
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-indigo-950">
            <BookmarkCheck className="w-4 h-4 text-indigo-600" />
            대조군(Control Group) 설정 및 비교 가이드
          </div>
          <p>{evaluation.variableControlReview.controlGroupAdvice}</p>
        </div>
      </div>

      {/* Module 2: Chemical Principles & Expected Separation Trends */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ArrowUpRight className="w-5 h-5 text-sky-600" />
          <h3 className="font-bold text-slate-800 text-base">
            2. 화학적 원리 분석 및 예상 분리 거동 (정성적 경향성)
          </h3>
        </div>

        {/* Hypothesis & Polarity evaluation */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1">가설의 과학적 타당성 검토:</span>
            <p className="text-slate-700">{evaluation.scientificLogicAnalysis.hypothesisValidity}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1">
              고정상-이동상 극성 상호작용 메커니즘 분석:
            </span>
            <p className="text-slate-700">
              {evaluation.scientificLogicAnalysis.polarityPrincipleEvaluation}
            </p>
          </div>
        </div>

        {/* Qualitative pigment behavior table */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            색소별 예상 이동 경향성 및 이유
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {evaluation.qualitativeSeparationTrend.pigmentBehaviorNotes.map((note, idx) => (
              <div
                key={`pig-${idx}`}
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">{note.pigment}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    {note.expectedTrend}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{note.reasoning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Pitfalls */}
        {evaluation.scientificLogicAnalysis.potentialPitfalls?.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900">
            <span className="font-bold flex items-center gap-1.5 mb-1.5 text-rose-950">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              실험 시 발생 가능한 잠재적 실패 요인 및 주의점
            </span>
            <ul className="space-y-1">
              {evaluation.scientificLogicAnalysis.potentialPitfalls.map((pitfall, idx) => (
                <li key={`pit-${idx}`} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Module 3: Socratic Questions for Student Reflection (Interactive) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-base">
              3. 소크라테스식 탐구 발문 및 학생 성찰 (Socratic Scaffolding)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            질문에 직접 답하며 설계를 보완해 보세요
          </span>
        </div>

        <p className="text-xs text-slate-500">
          아래 질문들은 AI가 정답을 주는 대신, 여러분이 화학적 원리를 깊이 생각하여 설계를 보완하도록 이끄는 발문입니다.
          각 질문에 대한 생각을 적어보세요.
        </p>

        <div className="space-y-4">
          {evaluation.socraticQuestions.map((q, idx) => (
            <div key={`sq-${idx}`} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2">
              <div className="flex items-start gap-2 text-xs font-bold text-amber-950">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                  Q{idx + 1}
                </span>
                <span className="mt-0.5 leading-relaxed">{q}</span>
              </div>
              <textarea
                rows={2}
                value={reflectionAnswers[idx] || ''}
                onChange={(e) =>
                  setReflectionAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                }
                placeholder="질문에 대한 나의 생각과 보완 아이디어를 적어보세요..."
                className="w-full px-3 py-2 text-xs bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          ))}
        </div>

        {/* Suggested Next Steps Checklist */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            실제 실험 전 권장 보완 단계 (Action Checklist)
          </h4>
          <div className="space-y-1.5">
            {evaluation.suggestedNextSteps.map((step, idx) => (
              <div
                key={`step-${idx}`}
                className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
              >
                <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module 4: Student Revision Note (핵심: 학생이 직접 수정·보완하는 공간) */}
      <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                4. 피드백 반영: 최종 후속 실험 설계 수정·보완 기록장
              </h3>
              <p className="text-xs text-slate-500">
                AI의 점검 내용과 위의 발문 성찰을 종합하여, 실제 실험실에서 수행할 수정 프로토콜을 작성하세요.
              </p>
            </div>
          </div>
        </div>

        <textarea
          rows={5}
          value={localRevisionNotes}
          onChange={(e) => setLocalRevisionNotes(e.target.value)}
          placeholder="[수정·보완 기록 예시]&#10;1. 대조군 설정: TLC 판 좌측 레인에 기존 9:1 조성 시료를, 우측 레인에 8:2 조성 시료를 동시 전개하여 온습도 오차를 통제하기로 보완함.&#10;2. 꼬리끌림 방지: 점적 크기를 2mm 이하로 유지하고 3회 완전 건조 후 재점적하기로 함.&#10;3. 챔버 포화: 여과지를 넣어 15분간 사전 포화 후 전개를 개시하기로 프로토콜 수정."
          className="w-full px-4 py-3 text-sm border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-indigo-50/20"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-500">
            {isSavedLocally && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 수정 내용이 저장되었습니다!
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={handleSaveRevision}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            수정·보완 내용 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
