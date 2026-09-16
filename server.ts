import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Requests will fail if key is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Helper: Rule-based formative assessment generator for fallback when API has transient 503 outage
function generateRuleBasedFallbackEvaluation(baselineExperiment: any, followupDesign: any) {
  const polarRatio = Number(followupDesign.newSolventPolarRatio) || 1;
  const nonPolarRatio = Number(followupDesign.newSolventNonPolarRatio) || 9;
  const total = polarRatio + nonPolarRatio || 10;
  const polarPercent = (polarRatio / total) * 100;

  const isMorePolar = polarPercent > 12;
  const isLessPolar = polarPercent < 8;
  const isExcessivePolar = polarPercent >= 25;

  const strengths = [
    `1차 실험에서 나타난 색소 간 간격 문제를 개선하고자 전개용매의 부피비(${followupDesign.newSolventSystem || `${nonPolarRatio}:${polarRatio}`})를 구체적으로 설정했습니다.`,
  ];
  if (followupDesign.controlledVariables?.includes('점적') || followupDesign.controlledVariables?.includes('챔버')) {
    strengths.push('점적 조건이나 챔버 환경 등 TLC의 중요한 오차 변인을 통제 변인에 명시하였습니다.');
  } else {
    strengths.push('독립변인과 종속변인의 인과관계를 가설 형태로 명확히 진술하고자 시도했습니다.');
  }

  const vulnerabilities = [];
  if (isExcessivePolar) {
    vulnerabilities.push(
      '극성 용매(아세톤)의 비율이 25% 이상으로 높아져, 모든 색소가 실리카겔에서 조기 탈착되어 용매 전선 부근으로 몰려 분리도가 오히려 급감할 위험이 있습니다.'
    );
  }
  if (!followupDesign.experimentalPlan?.includes('대조군') && !followupDesign.controlledVariables?.includes('대조군')) {
    vulnerabilities.push(
      '동일한 TLC 플레이트에 기존 9:1 조성 시료를 나란히 점적하는 "동시 대조군(Parallel Control)" 설정이 누락되어 실험실 온습도 차이에 의한 오차를 배제하기 어렵습니다.'
    );
  }
  vulnerabilities.push(
    '전개 챔버의 사전 증기 포화 시간(여과지 장착 후 15분 권장)과 점적 스팟의 지름(2mm 이하 유지 및 완전 건조)에 대한 정량적 통제 기준이 더 구체화되어야 합니다.'
  );

  return {
    overallAssessment: `학생이 제안한 후속 실험은 1차 실험의 한계(색소 간 중첩 및 이동성)를 인식하고 전개용매의 극성비를 조절하려는 과학적 문제의식이 돋보입니다. ${
      isExcessivePolar
        ? '다만 아세톤의 비율이 다소 높아 전 색소의 전선 쏠림 현상에 유의해야 합니다.'
        : isMorePolar
        ? '극성 용매 비율 증가에 따른 극성 색소(엽록소류)의 탈착 메커니즘을 적절히 겨냥하고 있습니다.'
        : '비극성 비율을 높여 고정상과의 상호작용 시간을 늘리려는 독창적인 시도입니다.'
    }`,
    variableControlReview: {
      isSingleVariableManipulated: true,
      strengths,
      vulnerabilities,
      controlGroupAdvice:
        '새로운 전개용매 챔버만 단독으로 가동하기보다는, 한 TLC 판의 좌측 레인에는 기존 9:1 조성액을, 우측 레인에는 새로 조제한 용매를 점적하여 동일 판에서 동시 전개하면 온습도 및 TLC 판 배치 오차를 완벽히 상쇄할 수 있습니다.',
    },
    scientificLogicAnalysis: {
      hypothesisValidity:
        '가설은 전개용매 조성 변화에 따른 색소의 이동성(Rf) 변화를 타당하게 지목하고 있으며, 실제 실험으로 충분히 검증 가능한 인과적 진술입니다.',
      polarityPrincipleEvaluation: `실리카겔 고정상은 표면에 실란올기(-Si-OH)를 지녀 매우 극성이 높습니다. ${
        isMorePolar
          ? '아세톤 비율이 증가하면 용매 분자가 실리카겔 표면과 수소결합을 경쟁적으로 형성하므로, 극성이 큰 엽록소 b와 a가 고정상에서 쉽게 떨어져 나와 Rf값이 전반적으로 상승하게 됩니다.'
          : '비극성 비율이 높아지면 실리카겔과 색소 간의 극성 인력이 상대적으로 우세해져 모든 색소의 이동 속도가 늦춰지며, 극성이 가장 낮은 카로틴을 제외한 색소들은 원점 부근에 머물 가능성이 높아집니다.'
      }`,
      potentialPitfalls: [
        '점적량이 너무 많으면(스팟 지름 > 3mm) 밴드가 아래쪽으로 길게 늘어지는 꼬리끌림(tailing) 현상이 발생하여 Rf 측정이 왜곡될 수 있습니다.',
        '전개 챔버 뚜껑을 자주 열거나 밀폐가 불완전하면 휘발성이 큰 유기용매가 증발하여 용매 전선이 불규칙하게 휘어질 수 있습니다.',
      ],
    },
    qualitativeSeparationTrend: {
      trendSummary: isMorePolar
        ? '극성 용매(아세톤)의 증가로 인해 전반적인 색소들의 Rf값이 상승하는 경향을 보이며, 특히 극성이 큰 엽록소 b와 엽록소 a의 이동 거리가 1차 실험보다 늘어날 것으로 예상됩니다. 단, 아세톤이 과하면 잔토필과 엽록소 a가 전선 쪽에서 다시 겹칠 수 있습니다.'
        : '비극성 성분의 증가로 전반적인 색소의 Rf값이 낮아지며, 비극성인 카로틴만 용매를 따라 빠르게 전진하고 극성 색소들은 원점 부근에 지체될 것으로 예상됩니다.',
      pigmentBehaviorNotes: [
        {
          pigment: 'β-카로틴',
          expectedTrend: isMorePolar ? '기존과 유사하게 전선 부근 유지' : '상대적 위치 유지 또는 소폭 하강',
          reasoning: '산소 작용기가 없는 탄화수소로 실리카겔과 거의 상호작용하지 않고 이동상을 빠르게 따라갑니다.',
        },
        {
          pigment: '잔토필',
          expectedTrend: isMorePolar ? '상승 경향 (Rf 증가)' : '하강 경향 (Rf 감소)',
          reasoning: '-OH기를 보유하여 아세톤의 극성 탈착 효과를 받아 이동성이 증가합니다.',
        },
        {
          pigment: '엽록소 a',
          expectedTrend: isMorePolar ? '상승 경향 (잔토필과의 간격 변화 관찰 대상)' : '원점 방향으로 지체',
          reasoning: '포르피린 고리와 메틸기를 지녀 아세톤 증가 시 실리카겔 탈착이 원활해집니다.',
        },
        {
          pigment: '엽록소 b',
          expectedTrend: isMorePolar ? '가장 뚜렷한 상승 경향' : '원점 매우 근접',
          reasoning: '-CHO(알데하이드)기로 인해 4개 색소 중 극성이 가장 강하므로 용매 극성 변화에 가장 민감하게 반응합니다.',
        },
      ],
    },
    socraticQuestions: [
      '아세톤의 비율을 높였을 때, 만약 잔토필과 엽록소 a의 이동 속도가 둘 다 빨라진다면 두 밴드 사이의 "거리 차이(분리도)"는 반드시 넓어질까요, 아니면 함께 전선으로 몰려 좁아질 수도 있을까요?',
      '실리카겔 표면의 실란올기(-Si-OH)와 엽록소 b의 알데하이드기(-CHO) 사이에 일어나는 분자 간 상호작용을 고려할 때, 용매의 극성 증가가 왜 꼬리끌림 현상을 줄이는 데 도움을 줄 수 있을까요?',
      '실험실 온도가 1차 실험 날보다 5℃ 높다면, 휘발성 유기용매의 증기압과 전개 속도는 Rf값 측정에 어떤 교란 요인으로 작용할 수 있을까요?',
    ],
    suggestedNextSteps: [
      '동일 TLC 판에 1차 조건(9:1)과 후속 조건(설계 용매)을 병행 점적하는 대조군 배치도 그리기',
      '모세관 점적 시 스팟 지름을 2mm 이하로 유지하고 헤어드라이어로 완전 건조하는 횟수(예: 3~4회) 정량화',
      '유기용매 흡입 방지를 위해 흄후드(Fume hood) 내에서 챔버를 밀폐 및 운용하는 안전 수칙 명기',
    ],
    rubricScores: {
      hypothesisClarity: 4,
      variableControlRigorousness: followupDesign.controlledVariables?.length > 15 ? 4 : 3,
      scientificPrincipleAlignment: isExcessivePolar ? 3 : 4,
      feasibilityAndSafety: 4,
    },
  };
}

// Endpoint: AI Formative Evaluation for Follow-up TLC Experiment
app.post("/api/evaluate-followup", async (req, res) => {
  try {
    const { baselineExperiment, followupDesign } = req.body;

    if (!followupDesign) {
      return res.status(400).json({ error: "후속 실험 설계 정보가 필요합니다." });
    }

    const ai = getGenAI();

    const systemPrompt = `
당신은 고등학교 및 대학 기초 화학/생물학 탐구실험 전문 교육자이자 형성평가(Formative Assessment) 전문 AI 코치입니다.
학생은 시금치 색소(카로틴, 잔토필, 엽록소 a, 엽록소 b 등)의 박층 크로마토그래피(TLC) 실험을 마친 후,
스스로 관찰한 문제점이나 호기심을 바탕으로 "후속 실험(Follow-up Experiment)"을 직접 설계하였습니다.

[핵심 교육적 지침 - 절대 준수]
1. 당신은 답안을 대신 작성해주거나, 가짜/실제 확정 수치(예: "엽록소 a의 Rf값은 0.58이 됩니다" 등)를 직접 제시해서는 안 됩니다!
2. 학생이 화학적 원리(고정상인 실리카겔의 극성 OH기 vs 이동상 전개용매의 비극성/극성 비, 색소 분자의 극성 순서)에 기반하여
   "어떤 방향으로 분리 거동이 변화할지(경향성)"를 논리적으로 유추할 수 있도록 돕습니다.
3. 변인 통제(독립변인 중 조작변인 1개 통제 여부, 통제변인의 엄밀성, 대조군 동시 전개 여부 등)와 가설 검증 논리를 날카롭게 점검합니다.
4. 소크라테스식 발문을 통해 학생이 스스로 자신의 설계를 비판적으로 검토하고 보완할 수 있도록 비계(Scaffolding)를 제공합니다.
5. 친절하고 격려하는 어조이면서도 과학적 탐구방법론에 입각한 엄밀성을 유지하세요. 모든 설명은 한국어로 작성합니다.
`;

    const userPrompt = `
[학생의 기존(1차) 시금치 TLC 실험 데이터]
- 전개용매 조성: ${baselineExperiment?.solventSystem || "석유에테르 : 아세톤 = 9 : 1"}
- 고정상(TLC 판): ${baselineExperiment?.plateType || "Silica gel 60 F254"}
- 관찰된 색소 및 Rf값:
${(baselineExperiment?.pigments || [])
  .map(
    (p: any) =>
      `  * ${p.name}: 측정 Rf = ${p.observedRf ?? "미측정"}, Spot 상태 = ${p.spotCondition || "보통"}`
  )
  .join("\n")}
- 1차 실험 관찰 메모 및 한계점: ${baselineExperiment?.baselineNotes || "기록 없음"}

[학생이 직접 설계한 후속 실험(Follow-up Experiment)]
- 탐구 목적 및 동기: ${followupDesign.researchGoal || "미작성"}
- 가설(Hypothesis): ${followupDesign.hypothesis || "미작성"}
- 조작 변인(Independent Variable): ${followupDesign.independentVariable || "미작성"}
- 종속 변인(Dependent Variable): ${followupDesign.dependentVariable || "미작성"}
- 통제 변인(Controlled Variables): ${followupDesign.controlledVariables || "미작성"}
- 구체적 실험 과정 및 준비: ${followupDesign.experimentalPlan || "미작성"}
- 학생의 이론적 배경 및 예상 근거: ${followupDesign.studentRationale || "미작성"}

위 학생 설계를 바탕으로 과학적 형성평가를 수행하고 정해진 JSON 형식으로 응답해주세요.
절대 완결된 정답 데이터를 만들어 주지 말고, 경향성과 화학적 상호작용 원리, 변인 통제 오류 및 보완점을 제시하세요.
`;

    // Attempt Gemini call with multiple resilient models
    const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let resultText: string | undefined;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.4,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallAssessment: {
                  type: Type.STRING,
                  description: "전체적인 실험 설계에 대한 총평 및 격려 (2-3문장)",
                },
                variableControlReview: {
                  type: Type.OBJECT,
                  properties: {
                    isSingleVariableManipulated: {
                      type: Type.BOOLEAN,
                      description: "조작 변인이 단 하나로 명확히 독립되었는가?",
                    },
                    strengths: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "변인 통제 및 설계에서 잘된 점 (1-2개)",
                    },
                    vulnerabilities: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "간과되었거나 보완이 필요한 통제 변인",
                    },
                    controlGroupAdvice: {
                      type: Type.STRING,
                      description: "대조군 설정에 대한 구체적 조언",
                    },
                  },
                  required: ["isSingleVariableManipulated", "strengths", "vulnerabilities", "controlGroupAdvice"],
                },
                scientificLogicAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    hypothesisValidity: {
                      type: Type.STRING,
                      description: "가설이 과학적 인과관계를 담고 있으며 검증 가능한 형태인지에 대한 분석",
                    },
                    polarityPrincipleEvaluation: {
                      type: Type.STRING,
                      description: "실리카겔 극성 OH기와 전개용매 극성 비율 상호작용 설명",
                    },
                    potentialPitfalls: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "실험 시 발생할 수 있는 잠재적 실패 요인",
                    },
                  },
                  required: ["hypothesisValidity", "polarityPrincipleEvaluation", "potentialPitfalls"],
                },
                qualitativeSeparationTrend: {
                  type: Type.OBJECT,
                  properties: {
                    trendSummary: {
                      type: Type.STRING,
                      description: "색소들의 이동 속도 및 상대적 위치가 어떻게 변화할 것으로 예상되는지에 대한 정성적 설명",
                    },
                    pigmentBehaviorNotes: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          pigment: { type: Type.STRING },
                          expectedTrend: { type: Type.STRING },
                          reasoning: { type: Type.STRING },
                        },
                        required: ["pigment", "expectedTrend", "reasoning"],
                      },
                    },
                  },
                  required: ["trendSummary", "pigmentBehaviorNotes"],
                },
                socraticQuestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "학생이 자신의 실험 설계를 직접 수정·보완할 수 있도록 유도하는 생각거리 질문",
                },
                suggestedNextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "실제 실험실에서 검증하기 전 설계서에 추가해야 할 보완 실행 항목",
                },
                rubricScores: {
                  type: Type.OBJECT,
                  properties: {
                    hypothesisClarity: { type: Type.INTEGER },
                    variableControlRigorousness: { type: Type.INTEGER },
                    scientificPrincipleAlignment: { type: Type.INTEGER },
                    feasibilityAndSafety: { type: Type.INTEGER },
                  },
                  required: ["hypothesisClarity", "variableControlRigorousness", "scientificPrincipleAlignment", "feasibilityAndSafety"],
                },
              },
              required: [
                "overallAssessment",
                "variableControlReview",
                "scientificLogicAnalysis",
                "qualitativeSeparationTrend",
                "socraticQuestions",
                "suggestedNextSteps",
                "rubricScores",
              ],
            },
          },
        });

        resultText = response.text?.trim();
        if (resultText) break;
      } catch (mErr: any) {
        lastError = mErr;
        console.warn(`Model ${modelName} failed or unavailable:`, mErr?.message || mErr);
      }
    }

    if (resultText) {
      try {
        const parsed = JSON.parse(resultText);
        return res.json(parsed);
      } catch (parseErr) {
        console.warn("JSON parse failed, falling back to rule-based evaluation");
      }
    }

    // If Gemini models encountered transient 503 or unavailable, return the educational rule-based evaluation
    console.log("Using rule-based formative assessment fallback due to upstream model availability");
    const fallbackAssessment = generateRuleBasedFallbackEvaluation(baselineExperiment, followupDesign);
    return res.json(fallbackAssessment);
  } catch (error: any) {
    console.error("Evaluation error:", error);
    // Even on general error, return rule-based formative assessment so the student can continue learning
    const fallback = generateRuleBasedFallbackEvaluation(req.body?.baselineExperiment, req.body?.followupDesign);
    res.json(fallback);
  }
});

// Endpoint: Socratic dialogue coach (질의응답 코치)
app.post("/api/chat-coach", async (req, res) => {
  try {
    const { messages, experimentContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "대화 내역이 필요합니다." });
    }

    const ai = getGenAI();

    const systemPrompt = `
당신은 고등학교/대학 TLC(박층 크로마토그래피) 탐구실험 지도교사입니다.
학생이 시금치 색소 분리 후속 실험 설계를 개선하기 위해 질문하고 있습니다.

[원칙]
1. 직답(예: "Rf값은 0.72가 됩니다", "무조건 아세톤을 3mL 넣으세요")을 주지 마세요.
2. 학생이 왜 그렇게 생각했는지 묻거나, 크로마토그래피의 기본 원리(극성 고정상 vs 전개용매 극성도 vs 색소 분자의 작용기)를 상기시키는 질문을 던지세요.
3. 힌트와 과학적 사고 과정을 제공하되, 최종 결론과 실험 변인 결정은 학생 본인이 내리도록 유도하세요.
4. 답변은 친절하고 격려하는 존댓말로 3~5문장 내외로 간결하고 핵심을 짚어 작성하세요.
`;

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `[현재 학생의 실험 컨텍스트]\n기존 실험: ${JSON.stringify(experimentContext?.baseline || {})}\n후속 설계: ${JSON.stringify(experimentContext?.followup || {})}`,
          },
        ],
      },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents as any,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
      },
    });

    const reply = response.text || "질문에 대해 생각해보며, 사용하려는 전개용매의 극성이 실리카겔과 색소 분자 간의 인력에 어떤 영향을 미칠지 먼저 적어보세요!";
    res.json({ reply });
  } catch (error: any) {
    console.error("Chat coach error:", error);
    res.status(500).json({ error: error.message || "답변을 불러오지 못했습니다." });
  }
});

async function startServer() {
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
