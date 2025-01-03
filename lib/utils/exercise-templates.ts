export type ExerciseType =
  | 'conjugation-tables'
  | 'dialogue-sorting'
  | 'drag-and-drop'
  | 'fill-in-the-blanks'
  | 'guess-the-idiom'
  | 'matching'
  | 'multiple-choice'
  | 'question-formation'
  | 'role-playing'
  | 'sentence-correction'
  | 'sentence-reordering'
  | 'sentence-splitting'
  | 'sentence-transformation'
  | 'spot-the-mistake'
  | 'word-building'
  | 'word-sorting';

const interfaceStructures = {
  'conjugation-tables': {
    exercise_type: 'conjugation-tables',
    verb: '',
    tense: '',
    pronouns: [],
    conjugations: [{
      pronoun: '',
      conjugation: ''
    }]
  },
  'dialogue-sorting': {
    exercise_type: 'dialogue-sorting',
    context: '',
    dialogueLines: [
      {
        speaker: 'Assistant',
        text: '',
        correctPosition: 0
      }
    ]
  },
  'drag-and-drop': {
    exercise_type: 'drag-and-drop',
    items: [{
      id: '',
      content: '',
      correctTarget: ''
    }],
    targets: [{
      id: '',
      label: ''
    }],
    instruction: ''
  },
  'fill-in-the-blanks': {
    exercise_type: 'fill-in-the-blanks',
    sentence: '',
    blanks: [{
      word: '',
      position: 0
    }]
  },
  'guess-the-idiom': {
    exercise_type: 'guess-the-idiom',
    title: '',
    description: '',
    idioms: [
      {
        id: '',
        phrase: '',
        meaning: '',
        context: '',
        question: '',
        options: [
          {
            text: '',
            isCorrect: false
          }
        ],
        explanation: '',
        hint: ''
      }
    ]
  },
  'matching': {
    exercise_type: 'matching',
    pairs: [{
      left: '',
      right: ''
    }]
  },
  'multiple-choice': {
    exercise_type: 'multiple-choice',
    questions: [{
      text: '',
      options: [{
        german: '',
        english: ''
      }],
      correctAnswer: 0,
      explanation: ''
    }]
  },
  'question-formation': {
    exercise_type: 'question-formation',
    statements: [{
      text: '',
      expectedQuestion: '',
      hint: ''
    }]
  },
  'role-playing': {
    exercise_type: 'role-playing',
    scenario: '',
    context: '',
    roles: [{
      id: '',
      name: '',
      description: '',
      prompts: [{
        id: '',
        text: '',
        expectedResponse: '',
        alternatives: [],
        hint: ''
      }]
    }]
  },
  'sentence-correction': {
    exercise_type: 'sentence-correction',
    sentences: [{
      id: '',
      text: '',
      correction: '',
      hint: '',
      explanation: '',
      focus: ''
    }]
  },
  'sentence-reordering': {
    exercise_type: 'sentence-reordering',
    sentences: [{
      id: '',
      segments: [{
        id: '',
        text: '',
        position: 0
      }],
      hint: ''
    }]
  },
  'sentence-splitting': {
    exercise_type: 'sentence-splitting',
    sentences: [{
      id: '',
      text: '',
      expectedSplits: [],
      hint: ''
    }]
  },
  'sentence-transformation': {
    exercise_type: 'sentence-transformation',
    sentences: [{
      original: '',
      transformation: '',
      hint: ''
    }],
    instruction: ''
  },
  'spot-the-mistake': {
    exercise_type: 'spot-the-mistake',
    paragraph: '',
    focus_words: [{
      word: '',
      position: 0,
      isMistake: false,
      correctWord: '',
    }]
  },
  'word-building': {
    exercise_type: 'word-building',
    words: [{
      id: '',
      root: '',
      prefix: '',
      suffix: '',
      target: '',
      type: '',
      hint: '',
      explanation: ''
    }]
  },
  'word-sorting': {
    exercise_type: 'word-sorting',
    categories: [{
      id: '',
      name: '',
      description: ''
    }],
    words: [{
      id: '',
      text: '',
      category: ''
    }]
  }
} as const;

export const getExerciseTypes = (): ExerciseType[] => {
  return Object.keys(interfaceStructures) as ExerciseType[];
};

export const getExerciseTemplate = (type: ExerciseType) => {
  return interfaceStructures[type]
};
