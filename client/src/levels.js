const rules = {
  easy: { min: 2, max: 5, hearts: 3 },
  normal: { min: 2, max: 9, hearts: 3 },
  hard: { min: 2, max: 12, hearts: 3 }
}

export const actualLevel = (level) => {
  if ( levels.includes(level) ) {
    return level;
  }
  return defaultLevel;
};

export const rulesForLevel = (level) => {
  return rules[level];
}

export const levels = ['easy', 'normal', 'hard'];
export const defaultLevel = 'normal';