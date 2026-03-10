
export const isCloseMatch = (input: string, correct: string): boolean => {
  const s1 = input.toLowerCase().trim();
  const s2 = correct.toLowerCase().trim();
  if (s1 === s2) return false; // It's an exact match

  // Simple check for 1 or 2 character differences (Levenshtein distance simplified)
  if (Math.abs(s1.length - s2.length) > 2) return false;

  let dist = 0;
  const maxLen = Math.max(s1.length, s2.length);
  for (let i = 0; i < maxLen; i++) {
    if (s1[i] !== s2[i]) dist++;
  }

  return dist <= 2;
};

export const normalizeString = (str: string) => str.toLowerCase().trim().replace(/[.?!,]/g, "");
