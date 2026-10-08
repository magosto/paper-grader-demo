export interface GradeResult {
  overallScore: number;
  grammarScore: number;
  lengthScore: number;
  formattingScore: number;
  contentScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  wordCount: number;
}

export interface GradeResponse {
  grade: GradeResult;
  extractedText: string;
}
