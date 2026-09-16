import React from 'react';
import { X, BookOpen, Atom, HelpCircle, CheckCircle2 } from 'lucide-react';
import { SCIENTIFIC_PRINCIPLES_GUIDE, DEFAULT_PIGMENTS } from '../data/presets';

interface PrinciplesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrinciplesGuideModal: React.FC<PrinciplesGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                {SCIENTIFIC_PRINCIPLES_GUIDE.title}
              </h3>
              <p className="text-xs text-slate-500">
                고정상과 이동상, 광합성 색소의 화학적 특성 및 변인 통제 가이드
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Pigment Polarity Hierarchy Visual */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              시금치 광합성 4대 색소 극성 및 분리 순서
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {DEFAULT_PIGMENTS.map((p, idx) => (
                <div
                  key={p.id}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {idx === 0 ? '극성 최저 (Rf 최대)' : idx === 3 ? '극성 최고 (Rf 최소)' : `순위 ${idx + 1}`}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                    </div>
                    <div className="font-bold text-sm text-slate-800">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mb-2">
                      {p.chemicalName}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Principle sections */}
          <div className="space-y-4">
            {SCIENTIFIC_PRINCIPLES_GUIDE.sections.map((section, index) => (
              <div
                key={`section-${index}`}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70"
              >
                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  {section.heading.replace(/^[0-9]\.\s*/, '')}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Socratic advice for students */}
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-900 leading-relaxed flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold mb-1">탐구 설계 시 유의할 점</h5>
              <p>
                단순히 “아세톤을 더 넣으면 잘 분리될 것이다”라는 막연한 추측 대신,
                <strong> “아세톤 비율이 증가하면 실리카겔 표면 흡착 경쟁에서 어떤 변화가 일어나는가?”</strong>
                를 분자 수준에서 고려하여 가설을 세워보세요. 또한 대조군(Control)을 같은 판에 나란히 점적해야
                실험실 온습도와 전개 속도의 오차를 통제할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
