export function normalizeAnswer(raw: string): string {
  return raw.split(',').map((s) => s.trim()).sort().join(',');
}

export function isAnswerCorrect(selected: string, correct: string): boolean {
  return normalizeAnswer(selected) === normalizeAnswer(correct);
}

export function getCorrectKeys(correct: string): string[] {
  return correct.split(',').map((s) => s.trim());
}
