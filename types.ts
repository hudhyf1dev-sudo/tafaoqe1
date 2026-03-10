
export enum SectionType {
  GRAMMAR_TRANSFORM = 'GRAMMAR_TRANSFORM',
  GRAMMAR_MCQ = 'GRAMMAR_MCQ',
  MATCHING = 'MATCHING',
  DROPDOWN = 'DROPDOWN',
  SPELLING = 'SPELLING',
  READING = 'READING',
  FILL_GAPS = 'FILL_GAPS'
}

export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  group?: string; // لتمثيل اسم التمرين (مثلاً: تمرين C ص 5)
  correctAnswers?: string[]; // لدعم الجمل التي تحتوي على أكثر من فراغ
  acceptedAnswers?: string[];
  options?: string[];
  matchingPairs?: { left: string; right: string }[];
  readingPassage?: string;
}

export interface Section {
  id: string;
  unitId: number;
  type: SectionType;
  title: string;
  motivation: string;
  questions: Question[];
}

export interface Unit {
  id: number;
  title: string;
  sections: Section[];
}

export interface AppData {
  units: Unit[];
}

export interface UserProgress {
  scores: Record<string, number>;
}
