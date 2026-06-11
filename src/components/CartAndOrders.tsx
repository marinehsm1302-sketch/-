import React, { useState } from "react";
import { ShoppingCart, ClipboardList, Check, Tag, CreditCard, Inbox, Plus, Minus, Trash2 } from "lucide-react";
import { CustomDesign, PodOrder, GoodType } from "../types";

interface CartItem {
  id: string;
  design: CustomDesign;
  quantity: number;
  price: number;
}

interface CartAndOrdersProps {
  cartItems: CartItem[];
  orders: PodOrder[];
  onUpdateCartQty: (id: string, delta: number) => void;
  onRemoveCartItem: (id: string) => void;
  onCheckout: (customer: { name: string; email: string; phone: string; address: string }) => void;
}

export function CartAndOrders({ cartItems, orders, onUpdateCartQty, onRemoveCartItem, onCheckout }: CartAndOrdersProps) {
  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");
  
  // Checkout form info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("광주광역시 북구 임동 챔피언스필드 1루 홈클럽 락커룸 수령처");
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [lastOrder, setLastOrder] = useState<PodOrder | null>(null);

  const totalCartPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const customer = {
      name: name.trim() || "기아사랑호랭이",
      email: email.trim() || "kia@tigers.co.kr",
      phone: phone.trim() || "010-1982-1112",
      address: address.trim()
    };

    onCheckout(customer);
    setIsCheckedOut(true);
    
    // Fake the order card transition
    setTimeout(() => {
      setName("");
      setEmail("");
      setPhone("");
    }, 100);
  };

  const getMerchLabel = (type: GoodType) => {
    switch (type) {
      case GoodType.TSHIRT: return "티셔츠";
      case GoodType.CAP: return "볼캡";
      case GoodType.PHONE_CASE: return "폰케이스";
      case GoodType.MUG: return "머그컵";
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
      
      {/* Visual Navigation selectors */}
      <div className="flex border-b border-neutral-800 bg-neutral-950/40">
        <button
          onClick={() => { setActiveTab("cart"); setIsCheckedOut(false); }}
          className={`flex-1 text-center py-4 text-xs font-black tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
            activeTab === "cart"
              ? "text-red-500 border-b-2 border-red-500 bg-neutral-900/10"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          장바구니 ({cartItems.length}개)
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 text-center py-4 text-xs font-black tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
            activeTab === "orders"
              ? "text-red-500 border-b-2 border-red-500 bg-neutral-900/10"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          가상 주문 발주 조회 ({orders.length}개)
        </button>
      </div>

      <div className="p-6">
        {activeTab === "cart" ? (
          <div>
            {!isCheckedOut ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Cart list (7 Columns) */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
                    <Tag className="w-4 h-4 text-red-500" />
                    담긴 커스텀 POD 품목 목록
                  </h3>
                  
                  {cartItems.length === 0 ? (
                    <div className="bg-neutral-950/50 rounded-2xl p-8 border border-neutral-850/50 text-center flex flex-col items-center justify-center text-neutral-500 italic text-xs gap-2">
                      <Inbox className="w-8 h-8 text-neutral-600 animate-bounce" />
                      <span>아지 장바구니에 담은 나만의 굿즈가 없구만요! 옆의 컴포저에서 디자인해보시라요.</span>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-neutral-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-neutral-800 shrink-0" style={{ backgroundColor: item.design.baseColor }}>
                              {item.design.goodsType === GoodType.TSHIRT ? "👕" : item.design.goodsType === GoodType.CAP ? "Cap" : item.design.goodsType === GoodType.PHONE_CASE ? "📱" : "🥛"}
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-xs text-white">
                                [{getMerchLabel(item.design.goodsType)}] "{item.design.sloganText || "기아우승"}"
                              </span>
                              <div className="text-[10px] font-mono text-neutral-500 tracking-wider">
                                칼라: {item.design.baseColor} | 글씨: {item.design.textColor}
                              </div>
                              <div className="text-[10px] bg-red-950/40 text-red-400 px-1.5 py-0.5 rounded border border-red-900/30 font-medium inline-block leading-none mt-1">
                                {item.design.sloganSubText || "KIA REAL TIME SAGA"}
                              </div>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-4 shrink-0">
                            {/* Quantity buttons */}
                            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                              <button
                                onClick={() => onUpdateCartQty(item.id, -1)}
                                className="w-6 h-6 flex items-center justify-center text-xs text-neutral-400 hover:text-white"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-black font-mono text-white">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateCartQty(item.id, 1)}
                                className="w-6 h-6 flex items-center justify-center text-xs text-neutral-400 hover:text-white"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            {/* Total price */}
                            <div className="text-right">
                              <div className="text-xs font-black text-white font-mono leading-none">₩{(item.price * item.quantity).toLocaleString()}</div>
                              <button
                                onClick={() => onRemoveCartItem(item.id)}
                                className="text-[9px] text-neutral-500 hover:text-red-500 flex items-center gap-0.5 justify-end mt-1.5 font-bold transition-colors"
                              >
                                <Trash2 className="w-2.5 h-2.5" /> 삭제
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submision Payment form (5 Columns) */}
                <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-inner">
                  <h3 className="text-xs font-black text-neutral-300 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                    <CreditCard className="w-4 h-4 text-red-500" />
                    POD 굿즈 무료 발주 시뮬레이터 (가상 결제)
                  </h3>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        발주인 실명/호칭
                      </label>
                      <input
                        type="text"
                        placeholder="이름을 입력하쇼 (기본값: 기아사랑호랭이)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-850 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        연락처 번호
                      </label>
                      <input
                        type="tel"
                        placeholder="전화번호 (예: 010-1982-1112)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-850 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        이메일 주소
                      </label>
                      <input
                        type="email"
                        placeholder="이메일 (기본값: kia@tigers.co.kr)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-850 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        굿즈 수령 받으실 가상 주소
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        className="w-full bg-neutral-900 border border-neutral-850 rounded-xl py-1.5 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="border-t border-neutral-850 pt-3 mt-4 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400">굿즈 합계 금액:</span>
                        <span className="text-white font-mono">₩{totalCartPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400">출고 배송 비용:</span>
                        <span className="text-green-500 font-extrabold uppercase font-mono">₩0 (무료제작 지원)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-1 border-t border-dashed border-neutral-800">
                        <span className="font-extrabold text-white">최종 가상 결제액:</span>
                        <span className="text-red-500 font-black font-mono">₩{totalCartPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={cartItems.length === 0}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md mt-4 shadow-red-700/10 flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span>기아 타이거즈 V12 공식 POD 가상 발주하기</span>
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              /* checkout success animation card display */
              <div className="bg-neutral-950 border border-red-900/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden max-w-xl mx-auto flex flex-col items-center justify-center text-center">
                {/* Glowing light bars */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />

                <div className="w-12 h-12 bg-red-600/90 text-white rounded-full flex items-center justify-center text-xl shrink-0 shadow-lg border border-red-400/20 mb-4 animate-bounce">
                  🏆
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-lg font-black text-white">기아 타이거즈 POD 발주 무사히 완료!</h4>
                  <p className="text-xs text-neutral-400">
                    전설의 타이거즈 호랑이 기운을 담아 가상 주문서가 안전하게 인쇄 출고 센터에 인계되었습니다.
                  </p>
                </div>

                {/* THE EXQUISITE RETRO V12 GUARANTEE CARD RECEIPT */}
                <div className="w-full bg-white text-black font-mono rounded-2xl p-5 border border-neutral-200 mt-6 shadow-inner text-left relative overflow-hidden transform hover:scale-[1.01] transition-transform">
                  
                  {/* Decorative stamp stamp */}
                  <div className="absolute right-3 top-3 border border-red-500 p-1 text-[8px] font-black tracking-widest text-red-500 rounded uppercase font-mono leading-none rotate-12">
                    V12 TRADITION
                  </div>

                  <div className="text-center border-b border-dashed border-neutral-300 pb-3 mb-3">
                    <h5 className="font-sans font-black text-base text-neutral-900">KIA TIGERS OFFICIAL POD BATCH</h5>
                    <span className="text-[9px] text-neutral-500">광주광역시 북구 임동 서림로 10 / V12 CENTER</span>
                  </div>

                  {/* Order metadata specs */}
                  <div className="space-y-1.5 text-xs border-b border-dashed border-neutral-300 pb-3 mb-3 text-neutral-800">
                    <div className="flex justify-between">
                      <span>가상 발주 번호:</span>
                      <span className="font-extrabold text-neutral-900">KIA-POD-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>수 령 인:</span>
                      <span>{name || "기아사랑호랭이"}님</span>
                    </div>
                    <div className="flex justify-between">
                      <span>연 락 처:</span>
                      <span>{phone || "010-1982-1112"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>수 령 지:</span>
                      <span className="truncate max-w-[170px]">{address}</span>
                    </div>
                  </div>

                  {/* Printed specifications of item designs */}
                  <div className="space-y-2 border-b border-dashed border-neutral-300 pb-3 mb-3">
                    {cartItems.map((item, index) => (
                      <div key={index} className="text-xs text-neutral-800 flex justify-between gap-4">
                        <span>
                          [{getMerchLabel(item.design.goodsType)}] "{item.design.sloganText || "기아우승"}"<br/>
                          <span className="text-[10px] text-neutral-500">└ 칼라 {item.design.baseColor} / {item.quantity}개</span>
                        </span>
                        <span className="font-extrabold text-neutral-900">₩{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Final check specs */}
                  <div className="flex justify-between text-xs text-neutral-950 font-black">
                    <span>최종 가상 보전 결제액:</span>
                    <span>₩{totalCartPrice.toLocaleString()} (실결제 0원)</span>
                  </div>

                  {/* Bottom stamp */}
                  <div className="text-center text-[9px] text-neutral-400 mt-4 leading-none font-sans uppercase">
                    ※ 기아 타이거즈를 사랑하는 마음을 담아 무료로 시뮬레이션 출고됩니다!
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckedOut(false)}
                  className="mt-6 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-extrabold text-xs py-2 px-6 rounded-xl transition-colors shrink-0"
                >
                  새로운 굿즈 다시 제작하러 가기
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Real Historic Orders record viewer */
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <ClipboardList className="w-4 h-4 text-red-500" />
              가상 POD 상품 주문/제작 출고 이력
            </h3>

            {orders.length === 0 ? (
              <div className="bg-neutral-950/50 rounded-2xl p-12 border border-neutral-850/50 text-center flex flex-col items-center justify-center text-neutral-500 italic text-xs gap-2">
                <ClipboardList className="w-8 h-8 text-neutral-600 animate-pulse" />
                <span>아직 주문된 이력이 없소잉! 장바구니에서 상품을 가상 발주해 보시라요.</span>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                {orders.map((order) => (
                  <div key={order.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3 hover:border-red-900/40 transition-colors">
                    
                    {/* Order header status */}
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-2 flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] text-neutral-500 font-mono block">KIA POD MEME TRACK</span>
                        <span className="text-xs font-black text-white font-mono">{order.id}</span>
                      </div>
                      <span className="px-2.5 py-0.5 text-[9px] font-black bg-red-950 text-red-400 border border-red-900/60 rounded-full flex items-center gap-1 animate-pulse">
                        ● 인쇄 출고 대기 중 (PENDING)
                      </span>
                    </div>

                    {/* Order detail specifications list */}
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs text-neutral-400 flex justify-between gap-4">
                          <span>
                            • [{getMerchLabel(item.design.goodsType)}] "{item.design.sloganText || "기아우승"}" ({item.quantity}개)
                          </span>
                          <span className="font-mono text-neutral-300">₩{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Receipt bottom summary info */}
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-900 text-[10px] text-neutral-500 flex-wrap gap-2">
                      <span>가상 수령지: {order.address}</span>
                      <span className="font-black text-white font-mono text-xs">총합: ₩{order.totalPrice.toLocaleString()}</span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
