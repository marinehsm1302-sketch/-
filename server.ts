import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let geminiAi: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiAi) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    geminiAi = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiAi;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Gemini-powered KIA Tigers Slogan and Meme generator
app.post("/api/gemini/generate-slogan", async (req, res) => {
  const { gameRecord, style, customVibe } = req.body;

  try {
    const ai = getGeminiClient();
    const prompt = `
당신은 대한민국 최고 인기 프로야구 구단인 'KIA 타이거즈(기아 타이거즈)'의 열정적이고 센스 넘치는 팬덤 크리에이터이자 카피라이터입니다.
기아 타이거즈의 어조인 전라도 사투리, 기아의 역사(선동열, 이종범, 김도영, 양현종, V12, 삐끼삐끼 댄스, 소크라테스 등), 그리고 기아 타이거즈 팬들이 자주 사용하는 시그니처 밈(Meme)과 응원 슬로건을 활용해주세요.

[입력 정보]
- 경기 기록/소재: ${gameRecord || "최신 승리 또는 홈런 신기록"}
- 원하는 스타일: ${style || "열정적이고 가슴 웅장한"} (예: 열정, 유머/사투리, 위트/밈, 감격적)
- 추가 요청 키워드: ${customVibe || "압도하라 기아타이거즈"}

위 정보를 정교하게 녹여내어, 티셔츠, 스마트폰 케이스, 모자, 머그컵 같은 'POD(Print on Demand) 굿즈'에 인쇄하기에 가장 적절하고 힙(Hip)하며 매력적인 한국어 굿즈 인쇄용 디자인 슬로건/문구를 5개 창조해 주십시오.

[출력 형식 제한]
- 반드시 5개의 문구만 배열 형태를 가진 아름다운 JSON 형태로 출력해주세요.
- 각 문구는 야구 팬들이 가슴 뛰어하며 진짜 살 것 같은 감각적인 응원 텍스트, 혹은 유쾌한 밈이어야 합니다.
- 기타 불필요한 서론, 설명, 마크다운 기호 없이 순수한 JSON 데이터만 응답해야 합니다.
- JSON 예시:
{
  "slogans": [
    { "text": "압도하라 타이거즈, 전설은 계속된다", "sub": "KIA TIGERS CLASSIC" },
    { "text": "아야, 인자 불 한번 뿜어불랑께!", "sub": "RED SPIRIT 2026" },
    ...
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text || "{}";
    res.json(JSON.parse(responseText.trim()));
  } catch (error) {
    console.error("Gemini Slogan Generator Error:", error);
    // Provide nice sample fallback if API key is missing or quota exceeded
    res.json({
      error: error instanceof Error ? error.message : "Internal Server Error",
      isFallback: true,
      slogans: [
        { text: `${gameRecord || "압도하라 기아타이거즈"} - KIA TIGERS WIN!`, sub: "V12 VICTORY TRADITION" },
        { text: "아야! 타이거즈가 왔당께!", sub: "KIA MEME RED FORCE" },
        { text: "김도영 홈런 흘러넘친다!", sub: "SUPERSTAR 30-30" },
        { text: "삐끼삐끼 삼진 아웃 댄스", sub: "CHAMPION V12 RUN" },
        { text: "압도적으로 영광스러운 KIA", sub: "ALWAYS KIA TIGERS" }
      ]
    });
  }
});

// Setup Vite development server or production static serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KIA Tigers Platform] Server is running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start full stack server:", err);
});
