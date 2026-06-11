import React from "react";
import { Flame, Trophy } from "lucide-react";
import { CheerMessage } from "../types";

interface TigersHeroProps {
  cheers: CheerMessage[];
  totalVotes: number;
  totalOrdersCount: number;
}

const RECENT_GAMES = [
  { date: "06.10", opponent: "한화", score: "2 : 8", result: "패", isLive: true },
  { date: "06.09", opponent: "LG", score: "8 : 4", result: "승", isLive: false },
  { date: "06.08", opponent: "LG", score: "6 : 5", result: "승", isLive: false },
  { date: "06.06", opponent: "두산", score: "9 : 3", result: "승", isLive: false },
  { date: "06.05", opponent: "두산", score: "3 : 5", result: "패", isLive: false },
];

export function TigersHero({ cheers, totalVotes, totalOrdersCount }: TigersHeroProps) {
  // Calculate flame power based on interactions
  const cheerPower = cheers.length * 15;
  const votePower = Math.floor(totalVotes * 0.1);
  const checkoutPower = totalOrdersCount * 50;
  const rawPower = 30 + cheerPower + votePower + checkoutPower;
  const liveFlameGauge = Math.min(100, Math.max(30, rawPower % 100));

  return (
    <div className="bg-neutral-900 border border-red-900/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
      {/* Red Glowing Abstract Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-yellow-500/5 rounded-full blur-2xl -z-10 pointer-events-none" />

      {/* Official Platform Thumbnail Cover Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 border border-neutral-800/80 shadow-2xl group flex flex-col md:flex-row bg-neutral-950/80 hover:border-red-500/30 transition-colors duration-300">
        <div className="md:w-3/5 overflow-hidden relative">
          <img 
            src="/appimg.png" 
            alt="팬코트 KIA 타이거즈 팬 커뮤니티" 
            className="w-full h-full min-h-[180px] object-cover filter brightness-[0.85] hover:brightness-[0.95] group-hover:scale-[1.01] transition-all duration-500 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="p-5 md:p-6 flex flex-col justify-center md:w-2/5 border-t md:border-t-0 md:border-l border-neutral-800/60 bg-gradient-to-br from-neutral-950 to-neutral-900">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-red-600 text-white rounded-md tracking-widest uppercase animate-pulse">
              OFFICIAL THUMBNAIL
            </span>
            <span className="text-[10px] text-yellow-500 font-extrabold tracking-wide">
              ★ 100% 팬 맞춤 제작
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-white leading-tight">
            팬코트 (FANCOURT) <br className="hidden md:block"/>
            <span className="text-red-500 text-sm md:text-base">열혈 타이거즈 팬 커뮤니티</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            기아 타이거즈 팬들을 위한 실시간 전용 공간입니다! 3D 굿즈 캔버스에서 한정판 슬로건 문구, 가상 유니폼, 스마트 코트 굿즈를 내 취향대로 멋지게 커스터마이징하고 응원의 불씨를 당겨보세요.
          </p>
        </div>
      </div>

      {/* Recent Games Score Ticker */}
      <div className="relative z-10 bg-black/80 border border-neutral-800 rounded-2xl p-3.5 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-between w-full lg:w-auto pb-2 lg:pb-0 border-b lg:border-none border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <span className="text-xs font-black text-red-500 tracking-wider">RECENT GAME SCORES</span>
          </div>
          <span className="text-[11px] text-white font-black bg-red-600 px-2 py-0.5 rounded-md border border-red-500/30">최근 경기 스코어</span>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 w-full justify-start lg:justify-end px-1">
          {RECENT_GAMES.map((game, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs shrink-0 font-mono transition-all hover:bg-neutral-900/80 ${
                game.isLive 
                  ? "bg-red-950/70 border-red-500 text-red-200 ring-2 ring-red-900/40 shadow-lg shadow-red-950/50"
                  : game.result === "승" 
                    ? "bg-neutral-900 border-neutral-800 text-neutral-200" 
                    : "bg-neutral-900 border-neutral-800 text-neutral-300"
              }`}
            >
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide ${
                game.isLive 
                  ? "bg-red-600 text-white animate-pulse" 
                  : game.result === "승" 
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-900/50" 
                    : "bg-rose-950 text-rose-400 border border-rose-900/50"
              }`}>
                {game.isLive ? `${game.result} (최신)` : game.result}
              </span>
              <span className="text-neutral-300 text-[10px] font-bold">{game.date}</span>
              <span className="font-sans font-bold text-neutral-200">vs {game.opponent}</span>
              <span className="font-extrabold tracking-wider text-yellow-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 shadow-inner">
                {game.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full tracking-wider uppercase">
              ALWAYS KIA TIGERS
            </span>
            <span className="text-xs text-neutral-400 font-mono">EST. 1982</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            타이거즈 <span className="text-red-500 font-extrabold">실시간 POD 크래프트</span>
          </h1>
          <p className="text-xs text-neutral-300 mt-1 max-w-xl leading-relaxed">
            광주의 불타는 심장! 기아의 역사적인 득점 배틀과 가슴 뛰는 팬덤 밈을
            그 자리에서 바로 매력 넘치는 굿즈로 직조해 구매까지 완성해 보시지라!
          </p>
        </div>

        {/* Core Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-800/80 border border-neutral-700/50 rounded-2xl px-4 py-2.5 text-center">
            <div className="flex items-center gap-1 justify-center text-yellow-500 font-black text-xl">
              <Trophy className="w-5 h-5" />
              <span>V12</span>
            </div>
            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
              KBO 최다 우승
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Match Stats & Fandom Fire Burner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: Scoreboard */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* Stadium Scoreboard Display */}
          <div className="bg-neutral-950/80 rounded-2xl p-4 border border-neutral-800 flex flex-col justify-between relative h-full">
            <div className="flex justify-between items-center text-xs text-neutral-500 font-mono mb-3">
              <span>RECENT GAME SCOREBOARD</span>
              <span className="text-red-500 animate-pulse font-bold">● V12 RUNNING</span>
            </div>

            <div className="flex items-center justify-around py-4 my-auto">
              {/* KIA Tigers Team info */}
              <div className="text-center">
                <div className="w-14 h-14 bg-red-700/95 text-white flex items-center justify-center rounded-2xl font-black text-3xl shadow-lg shadow-red-700/20 border border-red-500/40 mx-auto transform hover:scale-105 transition-transform">
                  T
                </div>
                <div className="font-bold text-white mt-2 text-sm tracking-wide">KIA Tigers</div>
                <div className="text-[10px] text-neutral-500 font-bold">크래프트 히어로</div>
              </div>

              {/* Score Number Display */}
              <div className="flex items-center gap-3 bg-neutral-940 border border-neutral-800/60 px-4 py-2.5 rounded-2xl shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600/30" />
                <div className="bg-black/90 px-3.5 py-1.5 rounded-xl border border-neutral-800 min-w-[55px] text-center shadow-lg relative">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">2</span>
                  <span className="absolute top-[45%] left-0 w-full h-[1px] bg-neutral-950/80" />
                </div>
                <span className="text-2xl font-black text-neutral-500 font-mono animate-pulse">:</span>
                <div className="bg-black/90 px-3.5 py-1.5 rounded-xl border border-neutral-800 min-w-[55px] text-center shadow-lg relative">
                  <span className="text-4xl sm:text-5xl font-black text-red-500 font-mono tracking-tight drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">8_</span>
                  <span className="absolute top-[45%] left-0 w-full h-[1px] bg-neutral-950/80" />
                </div>
              </div>

              {/* Target Opponent info */}
              <div className="text-center opacity-80">
                <div className="w-14 h-14 bg-neutral-800 text-neutral-300 flex items-center justify-center rounded-2xl font-black text-3xl border border-neutral-700 mx-auto">
                  H
                </div>
                <div className="font-bold text-neutral-300 mt-2 text-sm tracking-wide">HANWHA E.</div>
                <div className="text-[10px] text-neutral-500 font-bold font-sans">오늘 다시 복수 승리!</div>
              </div>
            </div>

            {/* Winning highlights */}
            <div className="mt-4 bg-red-950/40 border border-red-800/20 rounded-xl p-2 px-3 text-xs text-red-300 flex items-center justify-between">
              <span className="font-medium">⚡ 어제 경기 아쉬운 패배를 딛고, 오늘 홈경기 타이거즈의 뜨거운 반격을 기대합니다!</span>
              <span className="font-bold text-yellow-500 bg-red-900/50 px-1.5 py-0.5 rounded text-[10px]">
                FIGHT TIGERS
              </span>
            </div>
          </div>
        </div>

        {/* Fandom Fire Burner (Fire Gauge) */}
        <div className="md:col-span-5 bg-neutral-950/80 rounded-2xl p-4 border border-neutral-800 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold mb-2">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-red-500 animate-bounce" />
                타이거즈 실시간 팬덤 화력 게이지
              </span>
              <span className="font-mono text-red-500 font-black">{liveFlameGauge}%</span>
            </div>

            {/* Large Visual Guage Container */}
            <div className="relative w-full h-8 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 mt-1">
              {/* Moving Fire Wave */}
              <div
                className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${liveFlameGauge}%` }}
              >
                {/* Sparkles effect */}
                <div className="absolute top-0 right-0 h-full w-4 bg-white/30 blur-sm animate-pulse" />
              </div>
              {/* Absolute indicator label Inside */}
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white tracking-widest drop-shadow-md">
                {liveFlameGauge > 80 ? "🔥 미쳐부는 광주 용광로 폭발 직전! 🔥" : "🐯 타이거즈 화력 충전중 🐯"}
              </span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-4 border-t border-neutral-900">
            <div>
              <div className="text-xs font-bold text-neutral-400">투표 화력</div>
              <div className="text-sm font-black text-white mt-0.5">{totalVotes}P</div>
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-400">치어 댓글</div>
              <div className="text-sm font-black text-white mt-0.5">{cheers.length}개</div>
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-400">주문 크래프트</div>
              <div className="text-sm font-black text-white mt-0.5">{totalOrdersCount}건</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
