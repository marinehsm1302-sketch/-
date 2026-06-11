import React, { useState } from "react";
import { ThumbsUp, Send, User, MessageCircle, RefreshCw } from "lucide-react";
import { MemeItem, CheerMessage } from "../types";

interface MemeBoardProps {
  memes: MemeItem[];
  cheers: CheerMessage[];
  onVote: (memeId: string) => void;
  onAddCheer: (nickname: string, message: string, voodooTarget?: string) => void;
}

export function MemeBoard({ memes, cheers, onVote, onAddCheer }: MemeBoardProps) {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [voodooTarget, setVoodooTarget] = useState("");

  const VOODOO_TEAMS = ["SAMSUNG LIONS", "LG TWINS", "DOOSAN BEARS", "SSG LANDERS", "LOTTE GIANTS", "HANWHA EAGLES"];

  const handleCheerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onAddCheer(nickname.trim(), message.trim(), voodooTarget || undefined);
    setMessage("");
    // Optional: Keep nickname or clear it
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Best Tigers Memes Voting Box */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-red-500 font-mono">#01</span> 타이거즈 역대 최고 밈 투표소
            </h2>
            <span className="text-[10px] bg-red-950 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-900/40">
              팬덤 화력 실시간 검증
            </span>
          </div>
          <p className="text-xs text-neutral-400 mb-4">
            가장 찰떡이고 정감 가는 기아 밈을 꾹 투표해 주시지라. 득표가 우수한 밈은 실시간 POD 굿즈 슬로건 카드로 원클릭 제작할 수 있어라!
          </p>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {memes.map((meme) => (
              <div
                key={meme.id}
                className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-3.5 hover:border-red-900/40 transition-colors group flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-white text-xs group-hover:text-red-500 transition-colors">
                      {meme.title}
                    </span>
                    {meme.tags.map(tag => (
                      <span key={tag} className="text-[9px] bg-neutral-900 text-neutral-400 font-medium px-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                    {meme.origin}
                  </p>
                </div>

                <button
                  onClick={() => onVote(meme.id)}
                  className="flex flex-col items-center justify-center bg-red-950/20 hover:bg-red-900 text-red-500 hover:text-white border border-red-900/30 p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shrink-0 min-w-[50px]"
                >
                  <ThumbsUp className="w-3.5 h-3.5 mb-1" />
                  <span className="text-[10px] font-black font-mono tracking-tight">{meme.votes}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 text-center font-mono italic">
          ※ 매 시즌 팬들의 제보를 거쳐 기아 시그니처 밈들이 실시간 업데이트됩니다.
        </div>
      </div>

      {/* 2. Tigers Live Cheer Wall */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-red-500 font-mono">#02</span> 기아 챔필 실시간 라이브 응원 댓글
            </h2>
            <span className="text-[10px] bg-yellow-950/30 text-yellow-500 font-bold px-2 py-0.5 rounded-full border border-yellow-900/20">
              화력 뿜기보드
            </span>
          </div>

          {/* Quick Submission Form */}
          <form onSubmit={handleCheerSubmit} className="bg-neutral-950 rounded-2xl p-3 border border-neutral-800 space-y-2 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <User className="absolute left-2.5 top-2 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="호랑이 닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={12}
                  className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-1.5 pl-8 pr-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-800/80"
                />
              </div>

              {/* Voodoo defense */}
              <select
                value={voodooTarget}
                onChange={(e) => setVoodooTarget(e.target.value)}
                className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-1.5 px-3 text-xs text-neutral-300 focus:outline-none focus:border-red-800/80"
              >
                <option value="">저격할 타팀 고르기 (선택)</option>
                {VOODOO_TEAMS.map(team => (
                  <option key={team} value={team}>vs {team}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="댓글은 매너 있게 쓰장께! (예: 도영이 오늘 홈런 미쳤다!!)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={80}
                required
                className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-2 pl-3 pr-10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-800/80"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-lg transition-colors duration-200"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Cheer messages stack container */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {cheers.map((cheer) => (
              <div key={cheer.id} className="bg-neutral-950/40 border border-neutral-800 rounded-xl p-3 flex flex-col gap-1 hover:border-neutral-700transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-xs">{cheer.nickname || "익명호랑이"}</span>
                    {cheer.voodooTarget && (
                      <span className="text-[8px] font-black bg-red-950/80 text-red-400 border border-red-900/30 px-1 py-0.5 rounded leading-none shrink-0">
                        저격: {cheer.voodooTarget}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500">
                    {new Date(cheer.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {cheer.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 mt-3 text-[11px] text-red-500 font-extrabold">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>광주 최고 극성 팬들의 타격 릴레이 중!</span>
        </div>
      </div>

    </div>
  );
}
