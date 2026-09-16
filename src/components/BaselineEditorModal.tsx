import React, { useState } from 'react';
import { BaselineExperiment, PigmentSpot } from '../types';
import { X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { DEFAULT_PIGMENTS, INITIAL_BASELINE_EXPERIMENT } from '../data/presets';

interface BaselineEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseline: BaselineExperiment;
  onSave: (newBaseline: BaselineExperiment) => void;
}

export const BaselineEditorModal: React.FC<BaselineEditorModalProps> = ({
  isOpen,
  onClose,
  baseline,
  onSave,
}) => {
  const [formData, setFormData] = useState<BaselineExperiment>(baseline);

  if (!isOpen) return null;

  const handlePigmentRfChange = (id: string, rf: number) => {
    setFormData((prev) => ({
      ...prev,
      pigments: prev.pigments.map((p) =>
        p.id === id ? { ...p, observedRf: Math.max(0.01, Math.min(0.99, rf)) } : p
      ),
    }));
  };

  const handlePigmentConditionChange = (id: string, cond: string) => {
    setFormData((prev) => ({
      ...prev,
      pigments: prev.pigments.map((p) => (p.id === id ? { ...p, spotCondition: cond } : p)),
    }));
  };

  const handleResetToDefault = () => {
    setFormData(INITIAL_BASELINE_EXPERIMENT);
  };

  const handleApply = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">1차 실험 결과 데이터 수정</h3>
            <p className="text-xs text-slate-500">
              실제 수행한 시금치 색소 TLC 실험의 Rf값과 관찰된 스팟 상태를 입력하세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Solvent & Plate info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                전개용매 조성 (기존 조건)
              </label>
              <input
                type="text"
                value={formData.solventSystem}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, solventSystem: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                TLC 플레이트 고정상
              </label>
              <input
                type="text"
                value={formData.plateType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, plateType: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Pigment spots editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              색소별 측정 Rf값 및 분리 상태
            </label>
            <div className="space-y-3">
              {formData.pigments.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-[130px]">
                    <div
                      className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: p.color }}
                    />
                    <div>
                      <span className="font-semibold text-sm text-slate-800">{p.name}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {p.chemicalName.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">Rf:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.05"
                      max="0.99"
                      value={p.observedRf}
                      onChange={(e) =>
                        handlePigmentRfChange(p.id, parseFloat(e.target.value) || 0)
                      }
                      className="w-20 px-2 py-1.5 text-sm font-mono border border-slate-300 rounded-md text-center focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="스팟 형태 (예: 선명함, 꼬리끌림, 잔토필과 겹침)"
                      value={p.spotCondition}
                      onChange={(e) => handlePigmentConditionChange(p.id, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes / Issues */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              1차 실험에서 관찰된 한계점 및 특이사항
            </label>
            <textarea
              rows={3}
              value={formData.baselineNotes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, baselineNotes: e.target.value }))
              }
              placeholder="예: 엽록소 a와 잔토필의 밴드 간격이 너무 좁아서 분리가 불완전했음..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            기본값 복원
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              변경사항 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
