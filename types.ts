export interface Question {
  id: number;
  text: string;
}

export type Score = 1 | 2 | 3 | 4 | 5;

// Map question ID to score
export type Answers = Record<number, Score>;

export interface Factor {
  key: string;
  name: string;
  description: string;
  questionIds: number[];
}

export interface FactorResult {
  factorKey: string;
  factorName: string;
  rawScore: number;
  averageScore: number; // The clinically significant 1-5 score
  isPositive: boolean; // Usually > 2
}

export interface AssessmentResult {
  totalScore: number;
  totalItems: number; // Should be 90
  globalSeverityIndex: number; // Total / 90
  positiveItemCount: number; // Count of items >= 2
  factorResults: FactorResult[];
  timestamp: number;
}

// Local Analysis Types
export interface LevelRule {
  min: number;
  max: number;
  label?: string; // Global label
  status?: string; // Dimension status
  text?: string; // Global text
  content?: string; // Dimension content
  advice?: string; // Dimension advice
}

export interface DimensionRule {
  id: string;
  original_name: string;
  display_name: string;
  desc: string;
  levels: LevelRule[];
}

export interface InterpretationData {
  meta_info: any;
  global_assessment: {
    title: string;
    levels: LevelRule[];
  };
  dimensions: DimensionRule[];
}

export interface DimensionReport {
  key: string;
  name: string;
  displayName: string;
  score: number;
  status: string;
  content: string;
  advice: string;
  severityLevel: number; // 1 to 4 based on index
}

export interface GeneratedReport {
  globalAssessment: {
    label: string;
    text: string;
    levelIndex: number;
  };
  dimensions: DimensionReport[];
  crisisWarning: boolean;
}

export interface AIAnalysisResponse {
  summary: string;
  empatheticMessage: string;
  suggestions: string[];
  crisisWarning: boolean;
}