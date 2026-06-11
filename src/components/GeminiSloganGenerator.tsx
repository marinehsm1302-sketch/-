import React, { useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { SloganItem } from "../types";

interface GeminiSloganGeneratorProps {
  onSelectSlogan: (slogan: SloganItem) => void;
}

const SAMPLE_EVENTS = [
  "김도영 9회말 기적의 역전 만루홈런",
  "치어리더 삼진 아웃 삐끼삐끼 아파트 댄스",
  "양현종 완벽 무실점 승리투수 달성",
  "한국시리즈 사상 최강 V12 등극 기념",
  "소크라테스 웅장한 찬송가 떼창 레이스",
  "기아 주무관 7급공무원 감독님 세레머니"
];

const STYLE_PRESETS = [
  { label: "열정 충만 광주 아재", value: "열정적인 광주 사투리 아저씨 톤" },
  { label: "힙스터 뉴웨이브 밈", value: "젊고 트렌디한 MZ 숏폼 밈 패러디 톤" },
  { label: "묵직한 역사와 전통", value: "타이거즈 왕조 무패 신화 전통 톤" },
  { label: "유코 위트 해학주의", value: "위트 있고 해학적인 한줄평 유머 톤" }
];

export function GeminiSloganGenerator({ onSelectSlogan }: GeminiSloganGeneratorProps) {
  const [selectedEvent, setSelectedEvent] = useState(SAMPLE_EVENTS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0].value);
  const [customVibe, setCustomVibe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSlogans, setGeneratedSlogans] = useState<SloganItem[]>([
    { text: "아따, 기아 타이거즈 불꽃 타격은 못 말려불장께!", sub: "KIA HOT BLAST 2026" },
    { text: "김도영, 너 시방 야구천재 자격이 흘러넘친다잉!", sub: "DO-YOUNG THE MVP" },
    { text: "삼진 아웃 잡고 삐끼삐끼 탁탁 찌르자구!", sub: "OUT 세레머니 DANCE" },
    { text: "어차피 끝판왕 우승은 KIA TIGERS여!", sub: "CHAMPION V12 SAGA" }
  ]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorStatus(null);
    try {
      const response = await fetch("/api/gemini/generate-slogan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameRecord: selectedEvent,
          style: selectedStyle,
          customVibe: customVibe
        })
      });

      const data = await response.json();
      if (data.slogans && Array.isArray(data.slogans)) {
        setGeneratedSlogans(data.slogans);
        if (data.isFallback) {
          console.log("[Gemini] Generated successfully but note fallback mock data provided.");
        }
      } else {
        throw new Error("Invalid format returned by AI Slogan backend.");
      }
    } catch (err) {
      console.error(err);
      setErrorStatus("슬로건 생성 중 에러가 발생하여 기본 기아 타이거즈 스페셜 슬로건을 로드합니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            AI 타이거즈 슬로건 제작소
          </h2>
          <span className="text-[10px] bg-yellow-950/40 text-yellow-500 font-bold px-2 py-0.5 rounded-full border border-yellow-900/30">
            Powered by Gemini
          </span>
        </div>
        <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
          오늘 있었던 경기 소재나 팬덤 밈을 선택하고 분위기에 맞게 Gemini AI가 인쇄 카피라이팅을 자동으로 브랜딩해 드립니다.
        </p>

        {/* Input Parameters */}
        <div className="space-y-3.5 mb-4">
          
          {/* Quick Match Event selector */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase mb-1.5">
              1. 경기 이슈 및 팬덤 밈 선택
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {SAMPLE_EVENTS.map(event => (
                <button
                  key={event}
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className={`text-left text-[11px] p-2.5 rounded-xl border transition-all truncate ${
                    selectedEvent === event
                      ? "bg-red-950/40 text-red-400 border-red-500/50 font-black shadow-md"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800/80 hover:border-neutral-700 hover:text-neutral-300"
                  }`}
                >
                  🐯 {event}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Styles */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase mb-1.5">
              2. 인쇄 슬로건 분위기 무드
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {STYLE_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setSelectedStyle(preset.value)}
                  className={`text-[10px] font-bold p-2.5 rounded-xl border text-center transition-all ${
                    selectedStyle === preset.value
                      ? "bg-yellow-950/30 text-yellow-500 border-yellow-500/50 font-black"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800/80 hover:border-neutral-700"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom additions */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase mb-1">
              3. 추가 요청 사항 (선택)
            </label>
            <input
              type="text"
              placeholder="직접 입력 예: 전설 양현종, 선동열 투수 찬조 격려 포함해줘"
              value={customVibe}
              onChange={(e) => setCustomVibe(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-900/50"
            />
          </div>

        </div>

        {/* Generate Button trigger */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md shadow-red-700/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>타이거즈 AI 슬로건 작당 모의중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>KIA 타이거즈 AI 실시간 전용 슬로건 제안받기</span>
            </>
          )}
        </button>

        {errorStatus && (
          <div className="text-[10px] text-yellow-500 bg-yellow-950/20 rounded-xl p-2 mt-2 border border-yellow-900/40">
            {errorStatus}
          </div>
        )}

        {/* Output List */}
        <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2.5">
          <label className="block text-[11px] font-extrabold text-neutral-300 tracking-wider uppercase mb-1">
            ✨ 제안된 디자인 문구 (클릭 시 굿즈에 즉시 적용)
          </label>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {generatedSlogans.map((slogan, index) => (
              <button
                key={index}
                onClick={() => onSelectSlogan(slogan)}
                className="w-full text-left bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/40 rounded-xl p-2.5 px-3 transition-colors flex items-center justify-between gap-4 group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-red-500 transition-colors">
                    {slogan.text}
                  </div>
                  <div className="text-[9px] font-mono text-neutral-500 mt-0.5 tracking-wider font-semibold">
                    {slogan.sub}
                  </div>
                </div>
                <div className="text-neutral-500 group-hover:text-red-500 transition-colors shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
