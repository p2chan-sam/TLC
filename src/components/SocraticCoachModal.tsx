import React, { useState } from 'react';
import { ChatMessage, BaselineExperiment, FollowupDesign } from '../types';
import { X, Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';

interface SocraticCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseline: BaselineExperiment;
  followup: FollowupDesign;
}

const INITIAL_COACH_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    '안녕하세요! 시금치 색소 TLC 탐구실험 지도교사 AI입니다. 후속 실험을 설계하면서 궁금한 점이나 의문점(예: 전개용매 극성 조절, 꼬리끌림 현상, 대조군 설정 등)이 있다면 편하게 질문하세요. 정답을 외우기보다 왜 그런 현상이 일어나는지 함께 생각해 봅시다!',
  timestamp: '방금',
};

const SUGGESTED_QUESTIONS = [
  '엽록소 b의 꼬리끌림(tailing)은 왜 발생하며 어떻게 줄일 수 있나요?',
  '전개용매의 극성을 너무 높이면 왜 분리가 안 되나요?',
  '실리카겔 판 대신 거름종이를 쓰면 극성 관계는 어떻게 달라지나요?',
  '대조군(Control)을 동일한 판에 함께 전개해야 하는 구체적 이유는 무엇인가요?',
];

export const SocraticCoachModal: React.FC<SocraticCoachModalProps> = ({
  isOpen,
  onClose,
  baseline,
  followup,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_COACH_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          experimentContext: {
            baseline,
            followup,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('코치 응답 생성에 실패했습니다.');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            '죄송합니다. 통신 중 일시적인 문제가 발생했습니다. 다시 질문해 주시겠어요?',
          timestamp: '방금',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl h-[620px] flex flex-col overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-sky-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-500/30 flex items-center justify-center border border-sky-400/30">
              <Bot className="w-4 h-4 text-sky-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm">TLC 탐구 코치 (소크라테스식 대화)</h3>
              <p className="text-[11px] text-sky-200">
                원리를 스스로 깨닫도록 돕는 실험 지도 AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-sky-200 hover:text-white rounded-lg hover:bg-sky-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2.5 bg-sky-50/50 border-b border-sky-100 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
          <span className="text-[11px] text-sky-800 font-semibold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-600" /> 추천 질문:
          </span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={`sq-${idx}`}
              type="button"
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white border border-sky-200 hover:border-sky-400 text-slate-700 rounded-full text-[11px] transition-colors shrink-0 shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
                <span
                  className={`block text-[9px] mt-1 ${
                    msg.role === 'user' ? 'text-sky-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]" />
              <span>탐구 코치가 생각하고 있습니다...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="실험 설계에 대해 궁금한 점을 질문해보세요..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
