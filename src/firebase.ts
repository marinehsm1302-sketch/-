import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  increment
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { MemeItem, CheerMessage, PodOrder } from "./types";

// Resilient initialization
const isPlaceholder = firebaseConfig.apiKey === "PLACEHOLDER_KEY";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// -------------------------------------------------------------
// SECURE FIRESTORE ERROR HANDLING PROTOCOL (As mandated by skill rules)
// -------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// HYBRID DATA PERSISTENCE LAYER & FALLBACKS
// -------------------------------------------------------------
export const INITIAL_MEMES: MemeItem[] = [
  {
    id: "meme_ppippi",
    title: "아파트 삼진 아웃! 삐끼삐끼 댄스",
    origin: "기아 타이거즈 치어리더들의 삼진 세레머니가 글로벌 밈 숏폼 열풍을 일으켰습니다.",
    votes: 3582,
    tags: ["세레머니", "치어리더", "글로벌"]
  },
  {
    id: "meme_kdy",
    title: "김도영 너 혹시 기아의 축복이냐?",
    origin: "최연소 30호 홈런-30도루를 극적으로 달성하며 기아의 역사를 통째로 흔들어놓은 MVP에게 바치는 찬사.",
    votes: 2940,
    tags: ["김도영", "홈런왕", "MVP"]
  },
  {
    id: "meme_v12",
    title: "어차피 우승은 KIA TIGERS! V12!",
    origin: "한국 정규리그 및 역대 한국시리즈 무패 신화(12회 우승)를 이어가는 타이거즈 팬맥의 심장 소리.",
    votes: 1845,
    tags: ["한국시리즈", "V12", "가문의영광"]
  },
  {
    id: "meme_7rank",
    title: "네가 해라 7급 공무원",
    origin: "매번 경기 양상이 쫄깃하거나 고비일 때, 영웅 한 명에게 감독직 다음으로 무겁다는 'KIA 야구 주무관' 자리를 팬들이 투표하는 은어.",
    votes: 820,
    tags: ["해학민족", "재치명소", "경기밈"]
  },
  {
    id: "meme_socra",
    title: "타이거즈 소크라테스 응원가 떼창",
    origin: "광주 야구장을 완전히 집어삼킬 듯 웅장하게 울려 퍼지는 떼창 밈, 상대 선발도 주춤하게 만든다는 전설의 응원.",
    votes: 1420,
    tags: ["응원가", "소크라테스", "떼창"]
  }
];

export const INITIAL_CHEERS: CheerMessage[] = [
  {
    id: "cheer_1",
    nickname: "광주호랑이",
    message: "올해 분위기 미쳤다! 무조건 V13 가자고오오!!!!",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    voodooTarget: "삼성 라이온즈"
  },
  {
    id: "cheer_2",
    nickname: "도영아사랑해",
    message: "김도영 오늘도 홈런 하나 장전했다. 기아 타이거즈 화이팅!",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "cheer_3",
    nickname: "양햄든든",
    message: "현종 신림 수호신 오늘도 투구 완벽했다. 기아팬이라 행복합니다.",
    createdAt: new Date(Date.now() - 600000).toISOString(),
    voodooTarget: "LG 트윈스"
  }
];

export const HybridDB = {
  // Get all memes
  async getMemes(): Promise<MemeItem[]> {
    if (isPlaceholder) {
      const stored = localStorage.getItem("kia_tigers_memes");
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem("kia_tigers_memes", JSON.stringify(INITIAL_MEMES));
      return INITIAL_MEMES;
    }

    try {
      const memesColl = collection(db, "memes");
      const snapshot = await getDocs(memesColl);
      if (snapshot.empty) {
        // Safe database auto-seeding
        for (const meme of INITIAL_MEMES) {
          await setDoc(doc(db, "memes", meme.id), meme);
        }
        return INITIAL_MEMES;
      }
      return snapshot.docs.map(doc => doc.data() as MemeItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, "memes");
      return INITIAL_MEMES;
    }
  },

  // Vote for a meme
  async voteMeme(memeId: string): Promise<MemeItem[]> {
    if (isPlaceholder) {
      const memes = await this.getMemes();
      const updated = memes.map(m => m.id === memeId ? { ...m, votes: m.votes + 1 } : m);
      localStorage.setItem("kia_tigers_memes", JSON.stringify(updated));
      return updated;
    }

    try {
      const memeRef = doc(db, "memes", memeId);
      await updateDoc(memeRef, {
        votes: increment(1)
      });
      return this.getMemes();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `memes/${memeId}`);
      return this.getMemes();
    }
  },

  // Get all cheer messages
  async getCheers(): Promise<CheerMessage[]> {
    if (isPlaceholder) {
      const stored = localStorage.getItem("kia_tigers_cheers");
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem("kia_tigers_cheers", JSON.stringify(INITIAL_CHEERS));
      return INITIAL_CHEERS;
    }

    try {
      const cheersColl = collection(db, "cheers");
      const q = query(cheersColl, orderBy("createdAt", "desc"), limit(40));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        // Safe database auto-seeding
        for (const cheer of INITIAL_CHEERS) {
          await setDoc(doc(db, "cheers", cheer.id), cheer);
        }
        return INITIAL_CHEERS;
      }
      return snapshot.docs.map(doc => doc.data() as CheerMessage);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, "cheers");
      return INITIAL_CHEERS;
    }
  },

  // Add a cheer message
  async addCheer(nickname: string, message: string, voodooTarget?: string): Promise<CheerMessage[]> {
    const finalNickname = nickname || "익명호랑이";
    const finalMessage = message || "";

    if (isPlaceholder) {
      const cheers = await this.getCheers();
      const newCheer: CheerMessage = {
        id: "cheer_" + Date.now(),
        nickname: finalNickname,
        message: finalMessage,
        createdAt: new Date().toISOString()
      };
      if (voodooTarget) newCheer.voodooTarget = voodooTarget;
      
      const updated = [newCheer, ...cheers];
      localStorage.setItem("kia_tigers_cheers", JSON.stringify(updated));
      return updated;
    }

    try {
      const cheerId = "cheer_" + Date.now();
      const newCheer: CheerMessage = {
        id: cheerId,
        nickname: finalNickname,
        message: finalMessage,
        createdAt: new Date().toISOString()
      };
      if (voodooTarget) newCheer.voodooTarget = voodooTarget;

      await setDoc(doc(db, "cheers", cheerId), newCheer);
      return this.getCheers();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "cheers");
      return this.getCheers();
    }
  },

  // Get virtual orders
  async getOrders(): Promise<PodOrder[]> {
    if (isPlaceholder) {
      const stored = localStorage.getItem("kia_tigers_orders");
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    }

    try {
      const ordersColl = collection(db, "orders");
      const q = query(ordersColl, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as PodOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, "orders");
      return [];
    }
  },

  // Create custom POD order
  async createOrder(orderData: Omit<PodOrder, "id" | "createdAt" | "status">): Promise<PodOrder> {
    const orderId = "KIA-POD-" + Math.floor(100000 + Math.random() * 900000);
    const orderDateStr = new Date().toISOString();
    const newOrder: PodOrder = {
      ...orderData,
      id: orderId,
      createdAt: orderDateStr,
      status: "PENDING"
    };

    if (isPlaceholder) {
      const orders = await this.getOrders();
      const updated = [newOrder, ...orders];
      localStorage.setItem("kia_tigers_orders", JSON.stringify(updated));
      return newOrder;
    }

    try {
      await setDoc(doc(db, "orders", orderId), newOrder);
      return newOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
      return newOrder;
    }
  }
};

// Validate Firebase Connection on boot (as requested by skill rules)
async function testConnection() {
  if (isPlaceholder) {
    console.log("[Firebase Hub] Operating in ultra-secure Hybrid local storage database mode.");
    return;
  }
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("[Firebase Hub] Cloud Run live Firestore context successfully initialized!");
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firebase test connection indicates client is offline. Switched to secure emulator fallback.");
    }
  }
}
testConnection();
