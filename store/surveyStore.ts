import { create } from 'zustand';

export interface Question {
  id: string;
  text: string;
  section: string;
  answer?: number;
}

interface SurveyState {
  questions: Question[];
  setAnswer: (questionId: string, answer: number) => void;
  isComplete: () => boolean;
  resetSurvey: () => void;
}

const questions: Question[] = [
  {
    id: '1',
    text: 'Complex and novel ideas excite you more than simple ones.',
    section: 'Cognitive & Thought Process',
  },
  {
    id: '2',
    text: 'You prefer detailed planning over spontaneous decisions.',
    section: 'Cognitive & Thought Process',
  },
  {
    id: '3',
    text: 'You usually feel more persuaded by emotions than facts.',
    section: 'Emotional & Decision-Making Style',
  },
  {
    id: '4',
    text: 'You are comfortable making quick decisions under pressure.',
    section: 'Emotional & Decision-Making Style',
  },
  {
    id: '5',
    text: 'Your living and working spaces are clean and organized.',
    section: 'Organization & Lifestyle',
  },
  {
    id: '6',
    text: 'You find it easy to introduce yourself to new people.',
    section: 'Organization & Lifestyle',
  },
  {
    id: '7',
    text: 'You feel re-energized after social interactions.',
    section: 'Social & Energy Levels',
  },
];

export const useSurveyStore = create<SurveyState>((set, get) => ({
  questions,
  setAnswer: (questionId: string, answer: number) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, answer } : q
      ),
    })),
  isComplete: () => get().questions.every((q) => q.answer !== undefined),
  resetSurvey: () =>
    set((state) => ({
      questions: state.questions.map((q) => ({ ...q, answer: undefined })),
    })),
}));