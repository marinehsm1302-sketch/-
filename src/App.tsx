import React, { useState, useEffect } from "react";
import { Award, ShieldAlert, Sparkles, Trophy, Heart } from "lucide-react";
import { MemeItem, CheerMessage, CustomDesign, PodOrder, SloganItem } from "./types";
import { HybridDB, INITIAL_MEMES, INITIAL_CHEERS } from "./firebase";
import { TigersHero } from "./components/TigersHero";
import { MemeBoard } from "./components/MemeBoard";
import { GeminiSloganGenerator } from "./components/GeminiSloganGenerator";
import { GoodsCustomizer } from "./components/GoodsCustomizer";
import { CartAndOrders } from "./components/CartAndOrders";

interface CartItem {
  id: string;
  design: CustomDesign;
  quantity: number;
  price: number;
}

export default function App() {
  const [memes, setMemes] = useState<MemeItem[]>([]);
  const [cheers, setCheers] = useState<CheerMessage[]>([]);
  const [orders, setOrders] = useState<PodOrder[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedSlogan, setSelectedSlogan] = useState<SloganItem>({
    text: "압도하라 기아타이거즈, 전설은 계속된다",
    sub: "KIA TIGERS V12"
  });

  // Load initial data from HybridDB (LocalStorage fallback + Cloud Sync support)
  useEffect(() => {
    async function loadData() {
      // 1. Load Memes
      try {
        const fetchMemes = await HybridDB.getMemes();
        setMemes(fetchMemes);
      } catch (err) {
        console.warn("Could not read real-time memes from Firestore, falling back to secure local sync:", err);
        const stored = localStorage.getItem("kia_tigers_memes");
        setMemes(stored ? JSON.parse(stored) : INITIAL_MEMES);
      }

      // 2. Load Cheers
      try {
        const fetchCheers = await HybridDB.getCheers();
        setCheers(fetchCheers);
      } catch (err) {
        console.warn("Could not read real-time cheers from Firestore, falling back to secure local sync:", err);
        const stored = localStorage.getItem("kia_tigers_cheers");
        setCheers(stored ? JSON.parse(stored) : INITIAL_CHEERS);
      }

      // 3. Load Orders
      try {
        const fetchOrders = await HybridDB.getOrders();
        setOrders(fetchOrders);
      } catch (err) {
        console.warn("Could not read real-time orders from Firestore, falling back to secure local sync:", err);
        const stored = localStorage.getItem("kia_tigers_orders");
        setOrders(stored ? JSON.parse(stored) : []);
      }
    }
    loadData();
  }, []);

  // Vote for a meme
  const handleVote = async (memeId: string) => {
    try {
      const updated = await HybridDB.voteMeme(memeId);
      setMemes(updated);
    } catch (err) {
      console.warn("Syncing list-voting state in local context due to transient Firestore link:", err);
      const updated = memes.map(m => m.id === memeId ? { ...m, votes: m.votes + 1 } : m);
      setMemes(updated);
      localStorage.setItem("kia_tigers_memes", JSON.stringify(updated));
    }
  };

  // Submit a live cheer comment
  const handleAddCheer = async (nickname: string, message: string, voodooTarget?: string) => {
    try {
      const updated = await HybridDB.addCheer(nickname, message, voodooTarget);
      setCheers(updated);
    } catch (err) {
      console.warn("Syncing cheer message state in local context due to transient Firestore link:", err);
      const newCheer: CheerMessage = {
        id: "cheer_" + Date.now(),
        nickname: nickname || "익명호랑이",
        message: message || "",
        createdAt: new Date().toISOString()
      };
      if (voodooTarget) newCheer.voodooTarget = voodooTarget;
      
      const updated = [newCheer, ...cheers];
      setCheers(updated);
      localStorage.setItem("kia_tigers_cheers", JSON.stringify(updated));
    }
  };

  // Add custom design to basket
  const handleAddToCart = (design: CustomDesign, count: number, price: number) => {
    const newItem: CartItem = {
      id: "cart_" + Date.now(),
      design,
      quantity: count,
      price
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: Math.max(1, item.quantity + delta)
        };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Checkout and place a custom simulated POD order
  const handleCheckout = async (customer: { name: string; email: string; phone: string; address: string }) => {
    if (cartItems.length === 0) return;

    try {
      const orderItems = cartItems.map(item => ({
        design: item.design,
        quantity: item.quantity,
        price: item.price
      }));

      const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      const placedOrder = await HybridDB.createOrder({
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        items: orderItems,
        totalPrice
      });

      // Update historic orders list
      setOrders(prev => [placedOrder, ...prev]);
      
      // Clear shopping basket
      setCartItems([]);
    } catch (err) {
      console.error("Simulated Checkout Issue:", err);
    }
  };

  // Calculate live sum stats for Fire Flame gauge calculations
  const totalVotes = memes.reduce((sum, m) => sum + m.votes, 0);

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans tracking-tight antialiased">
      
      {/* Dynamic Ambient Header Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(100%_150%_at_top_center,rgba(196,30,58,0.18)_0%,rgba(0,0,0,0)_80%)] pointer-events-none -z-10" />

      {/* Top Warning Banner warning about AI simulation */}
      <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 text-center py-2 px-4 border-b border-red-900/30 text-[11px] font-bold tracking-wide flex items-center justify-center gap-1.5 flex-wrap">
        <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse animate-bounce" />
        <span>KIA 타이거즈 V12 공식 팬덤 크래프트숍 MVP 데모가 구동중입니다. 가상 결제로 마음껏 제작해보시지라!</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Unit 1: Hero Scoreboard Panel with real-time stats & heat index */}
        <TigersHero
          cheers={cheers}
          totalVotes={totalVotes}
          totalOrdersCount={orders.length}
        />

        {/* Dynamic Multi-column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Area: Goods Creation, AI generator Slogan (7 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header info for Section Design */}
            <div className="border-b border-neutral-800 pb-3">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-red-500" />
                나만의 기아 밈 굿즈 크래프트 캔버스
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                티셔츠, 볼캡, 머그컵을 선택하고 원하는 슬로건이나 스티커를 인쇄 배치해보세요.
              </p>
            </div>

            {/* Customizer Component */}
            <GoodsCustomizer
              initialSlogan={selectedSlogan}
              onAddToCart={handleAddToCart}
            />

            {/* AI Auto Slogan Engine component */}
            <GeminiSloganGenerator
              onSelectSlogan={(slogan) => setSelectedSlogan(slogan)}
            />

          </div>

          {/* Right Area: Fan votes, cheers boards, and shopping basket (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Header info for Section Community */}
            <div className="border-b border-neutral-800 pb-3">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                광주 타이거즈 라이브 팬 포럼
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                기아 밈 선호도 평가 및 역사적인 한줄평 저격글을 발사해보세요.
              </p>
            </div>

            {/* Shopping cart list & Historic transactions panel */}
            <CartAndOrders
              cartItems={cartItems}
              orders={orders}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveCartItem={handleRemoveCartItem}
              onCheckout={handleCheckout}
            />

          </div>
        </div>

        {/* Interactive Community Meme Board (Runs full width) */}
        <div className="border-t border-neutral-800 pt-8">
          <MemeBoard
            memes={memes}
            cheers={cheers}
            onVote={handleVote}
            onAddCheer={handleAddCheer}
          />
        </div>

      </main>

      {/* Footer Branding Area */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-10 mt-16 text-center text-xs text-neutral-500 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-neutral-400 font-bold">
          <Trophy className="w-4 h-4 text-red-500" />
          <span>V12 CHAMPION KIA TIGERS FANDOM PLATFORM</span>
        </div>
        <p className="max-w-2xl mx-auto text-[11px] leading-relaxed px-4">
          본 애플리케이션 프레임워크는 KIA 타이거즈 야구 팬덤을 위한 비상업적 팬 메이드 POD MVP 데모 서비스입니다.<br/>
          실제 결제는 이루어지지 않으며, 모든 상품 생성과 주문 프로세스는 가상 에뮬레이션 공간에서 안전하게 보존되고 처리됩니다.
        </p>
        <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-600 font-mono">
          <span>COSMIC RED THEME</span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            CRAFTED WITH <Heart className="w-3 h-3 text-red-500 fill-red-500" /> FOR TIGERS FANS
          </span>
        </div>
      </footer>

    </div>
  );
}
