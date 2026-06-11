import React, { useState, useEffect } from "react";
import { Move, ShoppingBag, Type, Layers, Check, Sparkles } from "lucide-react";
import { GoodType, CustomDesign, SloganItem } from "../types";

interface GoodsCustomizerProps {
  initialSlogan: SloganItem;
  onAddToCart: (design: CustomDesign, count: number, price: number) => void;
}

const MERCHANDISE = [
  { type: GoodType.TSHIRT, label: "타이거즈 클래식 반팔 티셔츠", basePrice: 22000, imgUrl: "👕" },
  { type: GoodType.CAP, label: "V12 영광의 아웃라인 매치 볼캡", basePrice: 19000, imgUrl: "🧢" },
  { type: GoodType.PHONE_CASE, label: "불타는 용광로 에코 하드케이스", basePrice: 16000, imgUrl: "📱" },
  { type: GoodType.MUG, label: "사투리가 쏟아지는 아침 머그컵", basePrice: 13000, imgUrl: "🥛" }
];

const COLORS = [
  { name: "기아 레드", hex: "#C41E3A" }, // KIA signature Red
  { name: "차콜 블랙", hex: "#1A1A1A" },
  { name: "챔피언 옐로우", hex: "#EAAA00" },
  { name: "크림 화이트", hex: "#F5F5F0" }
];

const TEXT_COLORS = [
  { name: "순백색", hex: "#FFFFFF" },
  { name: "타이거 레드", hex: "#E60000" },
  { name: "리치 블랙", hex: "#000000" },
  { name: "골든 옐로", hex: "#FFDD00" }
];

const FONTS = [
  { name: "굵은 헤드라인", value: "font-sans font-black tracking-tighter" },
  { name: "레트로 고딕", value: "font-mono font-extrabold tracking-normal" },
  { name: "클래식 산스", value: "font-sans font-bold tracking-tight" },
  { name: "붓글씨 세리프", value: "font-serif italic font-extrabold" }
];

const STICKERS = [
  { id: "tiger", label: "호랑이실루엣 🐯", style: "🐯" },
  { id: "trophy", label: "우승 트로피 🏆", style: "🏆" },
  { id: "baseball", label: "불꽃 야구공 ⚾", style: "⚾" },
  { id: "v12", label: "V12 엠블럼 🌟", style: "⭐️" }
];

export function GoodsCustomizer({ initialSlogan, onAddToCart }: GoodsCustomizerProps) {
  const [selectedMerch, setSelectedMerch] = useState(MERCHANDISE[0]);
  const [baseColor, setBaseColor] = useState(COLORS[0].hex);
  const [textColor, setTextColor] = useState(TEXT_COLORS[0].hex);
  const [sloganText, setSloganText] = useState("");
  const [sloganSubText, setSloganSubText] = useState("");
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(STICKERS[0].id);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textSize, setTextSize] = useState(13);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Sync with AI-generated slogans automatically
  useEffect(() => {
    if (initialSlogan) {
      setSloganText(initialSlogan.text);
      setSloganSubText(initialSlogan.sub);
    }
  }, [initialSlogan]);

  const handlePositionChange = (axis: "x" | "y", value: number) => {
    setTextPosition(prev => ({
      ...prev,
      [axis]: value
    }));
  };

  const handleAddToCart = () => {
    const design: CustomDesign = {
      goodsType: selectedMerch.type,
      baseColor,
      textColor,
      sloganText,
      sloganSubText,
      fontStyle: selectedFont,
      stickerId: selectedSticker,
      textPosition,
      textSize
    };

    onAddToCart(design, quantity, selectedMerch.basePrice);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const currentMerchPrice = selectedMerch.basePrice * quantity;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Real-time Interactive 2D/3D Mockup Canvas Room (7 Columns) */}
      <div className="xl:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg flex flex-col items-center justify-center relative">
        <div className="absolute top-4 left-4 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-red-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">POD 실시간 목업 스튜디오</span>
        </div>

        {/* Dynamic Watermark details */}
        <div className="absolute top-4 right-4 text-right">
          <span className="text-[9px] font-mono text-neutral-500 block leading-none">AUTO PREVIEW</span>
          <span className="text-[10px] font-black text-red-500 font-mono">KIA OFFICIAL POD</span>
        </div>

        {/* THE INTEGRATED HIGH-POLISHED CANVAS DISPLAY CONTAINER */}
        <div className="relative w-full aspect-square max-w-[420px] bg-neutral-950 rounded-2xl border border-neutral-800 flex items-center justify-center overflow-hidden my-6 shadow-inner">
          
          {/* Radial shade simulating 3D lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_75%)] pointer-events-none" />

          {/* DYNAMIC SHAPE BASE RENDERER (Merch Mockup container) */}
          <div 
            className="w-64 h-64 rounded-3xl transition-transform duration-500 relative flex items-center justify-center shadow-2xl"
            style={{ 
              backgroundColor: baseColor,
              borderRadius: selectedMerch.type === GoodType.MUG ? "40px 10px 10px 40px" : selectedMerch.type === GoodType.CAP ? "50% 50% 10% 10% / 60% 60% 5% 5%" : "24px"
            }}
          >
            {/* Merch Specific structure overlays */}
            
            {/* T-Shirt Collar outline */}
            {selectedMerch.type === GoodType.TSHIRT && (
              <div className="absolute top-0 left-1/2 -translate-x-1/12 w-20 h-6 bg-neutral-950 rounded-b-full opacity-60 border-b border-white/10" />
            )}

            {/* Mug Handle design */}
            {selectedMerch.type === GoodType.MUG && (
              <div 
                className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-10 h-32 border-[14px] rounded-r-full -z-10 transition-colors"
                style={{ borderColor: baseColor }}
              />
            )}

            {/* Cap Brim design */}
            {selectedMerch.type === GoodType.CAP && (
              <div 
                className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-48 h-8 rounded-b-2xl opacity-90 transition-colors"
                style={{ backgroundColor: baseColor, filter: "brightness(0.85)" }}
              />
            )}

            {/* Phonecase camera cutout */}
            {selectedMerch.type === GoodType.PHONE_CASE && (
              <div className="absolute top-3 left-4 w-10 h-16 bg-neutral-950 border border-white/5 rounded-lg opacity-80" />
            )}

            {/* Customizer Print area with Drag-Position styling */}
            <div 
              className="absolute pointer-events-none text-center select-none flex flex-col items-center justify-center transition-all p-2  max-w-[210px] break-words uppercase"
              style={{
                transform: `translate(${textPosition.x}px, ${textPosition.y}px)`,
                color: textColor
              }}
            >
              {/* Optional Sticker Stamp overlay */}
              {selectedSticker && (
                <span className="text-3xl mb-1.5 drop-shadow-md animate-bounce duration-[2000ms]">
                  {STICKERS.find(s => s.id === selectedSticker)?.style}
                </span>
              )}

              {/* Core Slogan Text printed */}
              <div 
                style={{ fontSize: `${textSize}px`, color: textColor }} 
                className={`${selectedFont} leading-tight drop-shadow-md break-words`}
              >
                {sloganText || "우승은 KIA타이거즈!"}
              </div>

              {/* Sub header printed */}
              {sloganSubText && (
                <div 
                  className="text-[9px] font-mono tracking-widest mt-1 opacity-75 font-black uppercase"
                  style={{ color: textColor }}
                >
                  {sloganSubText}
                </div>
              )}
            </div>

          </div>

          {/* Quick status bar */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-900/90 border border-neutral-850 px-2.5 py-1 rounded-full whitespace-nowrap">
            <Move className="w-3 h-3 text-red-500 animate-pulse" />
            <span>디스플레이 캔버스 실사 시뮬레이션</span>
          </div>

        </div>

        {/* Canvas Position offsets adjustment panel */}
        <div className="w-full bg-neutral-950 rounded-2xl p-4 border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 mb-1">
              ↔ 가로 축 조정 (X Offset)
            </label>
            <input
              type="range"
              min={-50}
              max={50}
              value={textPosition.x}
              onChange={(e) => handlePositionChange("x", Number(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 mb-1">
              ↕ 세로 축 조정 (Y Offset)
            </label>
            <input
              type="range"
              min={-50}
              max={50}
              value={textPosition.y}
              onChange={(e) => handlePositionChange("y", Number(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 mb-1">
              🔎 글꼴 사이즈 배율 ({textSize}px)
            </label>
            <input
              type="range"
              min={9}
              max={24}
              value={textSize}
              onChange={(e) => setTextSize(Number(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>
        </div>

      </div>

      {/* Control Design Custom Settings Panel (5 Columns) */}
      <div className="xl:col-span-5 bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg space-y-4">
        
        <div>
          <h2 className="text-base font-black text-white mb-1.5 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-red-500" />
            나만의 기아 굿즈 세부 원단 옵션
          </h2>
          <p className="text-xs text-neutral-400">
            기본 원단 모델, 상징 컬러웨이 및 마크 스탬프를 정교하고 자유롭게 맞춰보세요.
          </p>
        </div>

        {/* 1. Goods Merchandise types Grid */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-neutral-300 uppercase">
            A. 기본 굿즈 타입 선택
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {MERCHANDISE.map(m => (
              <button
                key={m.type}
                onClick={() => setSelectedMerch(m)}
                className={`flex items-center gap-2 text-left p-2.5 rounded-xl border transition-all ${
                  selectedMerch.type === m.type
                    ? "bg-red-950/40 text-red-400 border-red-500/50 font-black"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800/80 hover:border-neutral-700"
                }`}
              >
                <span className="text-lg">{m.imgUrl}</span>
                <div>
                  <div className="text-[10px] font-bold truncate leading-snug">{m.label}</div>
                  <div className="text-[9px] font-mono text-neutral-500 mt-0.5">₩{m.basePrice.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Base Color selections */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-neutral-300 uppercase">
            B. 원단(바디) 배경 컬러 선택
          </label>
          <div className="flex gap-2.5 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c.hex}
                onClick={() => setBaseColor(c.hex)}
                className="flex items-center gap-1.5 border border-neutral-800 hover:border-neutral-700 rounded-full px-2.5 py-1 text-[10px] font-bold text-neutral-400 transition-colors"
              >
                <span className="w-3 w-3 h-3 h-3 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
                {baseColor === c.hex && <Check className="w-3 h-3 text-red-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Text Print Color selections */}
        <div className="space-y-1.5 col-span-2">
          <label className="block text-[11px] font-bold text-neutral-300 uppercase">
            C. 인쇄 텍스트 컬러 선택
          </label>
          <div className="flex gap-2 flex-wrap">
            {TEXT_COLORS.map(t => (
              <button
                key={t.hex}
                onClick={() => setTextColor(t.hex)}
                className="flex items-center gap-1 border border-neutral-800 hover:border-neutral-700 rounded-full px-2 py-0.5 pr-2.5 text-[9px] font-bold text-neutral-400"
              >
                <span className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: t.hex }} />
                <span>{t.name}</span>
                {textColor === t.hex && <Check className="w-2.5 h-2.5 text-yellow-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Font family styles selection */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-neutral-300 uppercase">
            D. 인쇄 글꼴 서체 결정
          </label>
          <div className="grid grid-cols-2 gap-1 px-0.5">
            {FONTS.map(f => (
              <button
                key={f.value}
                onClick={() => setSelectedFont(f.value)}
                className={`text-[10px] font-semibold py-1.5 px-2 rounded-lg border transition-all text-center truncate ${
                  selectedFont === f.value
                    ? "bg-red-950/20 text-red-400 border-red-500/50"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800/80 hover:border-neutral-700"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Emblem Stickers select */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-neutral-300 uppercase">
            E. 타이거즈 엠블럼 스티커 장식
          </label>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setSelectedSticker(null)}
              className={`text-[9px] font-bold py-1.5 px-1 rounded-lg border transition-all text-center ${
                selectedSticker === null
                  ? "bg-red-950/20 text-red-400 border-red-500/50"
                  : "bg-neutral-950 text-neutral-500 border-neutral-800/80"
              }`}
            >
              없앰 ❌
            </button>
            {STICKERS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSticker(s.id)}
                className={`text-[9px] font-bold py-1.5 px-1 rounded-lg border transition-all text-center truncate ${
                  selectedSticker === s.id
                    ? "bg-red-950/20 text-red-400 border-red-500/50"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800/80 hover:border-neutral-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Custom Text Fields Input */}
        <div className="grid grid-cols-1 gap-2 bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase mb-0.5">
              인쇄 메인 슬로건 직적 입력
            </label>
            <input
              type="text"
              value={sloganText}
              onChange={(e) => setSloganText(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500/50"
              placeholder="우승은 기아야!"
              maxLength={22}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase mb-0.5">
              인쇄 하부 문구 (서브 타이틀)
            </label>
            <input
              type="text"
              value={sloganSubText}
              onChange={(e) => setSloganSubText(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500/50"
              placeholder="RED SPIRIT KIA TIGERS"
              maxLength={30}
            />
          </div>
        </div>

        {/* 7. Action Add Basket & Quantities */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center bg-neutral-950 border border-neutral-850 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="w-7 h-7 flex items-center justify-center text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-black font-mono text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-7 h-7 flex items-center justify-center text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-1 font-extrabold text-xs py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${
              justAdded
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white shadow-red-700/10 active:scale-95"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>장바구니 담기 완료지라!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>나만의 타이거즈 디자인 장바구니 담기 — ₩{currentMerchPrice.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
