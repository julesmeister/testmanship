export const difficultyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type DifficultyLevel = typeof difficultyLevels[number];
