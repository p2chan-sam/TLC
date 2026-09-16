export interface PigmentSpot {
  id: string;
  name: string;
  chemicalName: string;
  color: string;
  textColor: string;
  observedRf: number;
  spotCondition: string;
  polarityRank: number; // 1: most non-polar (carotene) to 4: most polar (chlorophyll b)
  description: string;
}

export interface BaselineExperiment {
  solventSystem: string;
  nonPolarRatio: number; // e.g. 9
  polarRatio: number; // e.g. 1
  plateType: string;
  plateHeightCm: number;
  solventFrontCm: number;
  originCm: number;
  pigments: PigmentSpot[];
  baselineNotes: string;
}

export interface FollowupDesign {
  researchGoal: string;
  hypothesis: string;
  independentVariable: string;
  dependentVariable: string;
  controlledVariables: string;
  newSolventNonPolarRatio: number;
  newSolventPolarRatio: number;
  newSolventSystem: string;
  chamberCondition: string; // e.g. "여과지 삽입 포화 챔버", "미포화 챔버"
  experimentalPlan: string;
  studentRationale: string;
  studentRevisionNotes: string;
}

export interface RubricScores {
  hypothesisClarity: number; // 1-5
  variableControlRigorousness: number; // 1-5
  scientificPrincipleAlignment: number; // 1-5
  feasibilityAndSafety: number; // 1-5
}

export interface VariableControlReview {
  isSingleVariableManipulated: boolean;
  strengths: string[];
  vulnerabilities: string[];
  controlGroupAdvice: string;
}

export interface ScientificLogicAnalysis {
  hypothesisValidity: string;
  polarityPrincipleEvaluation: string;
  potentialPitfalls: string[];
}

export interface PigmentBehaviorNote {
  pigment: string;
  expectedTrend: string;
  reasoning: string;
}

export interface QualitativeSeparationTrend {
  trendSummary: string;
  pigmentBehaviorNotes: PigmentBehaviorNote[];
}

export interface EvaluationResult {
  overallAssessment: string;
  variableControlReview: VariableControlReview;
  scientificLogicAnalysis: ScientificLogicAnalysis;
  qualitativeSeparationTrend: QualitativeSeparationTrend;
  socraticQuestions: string[];
  suggestedNextSteps: string[];
  rubricScores: RubricScores;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
