// lib/keywordMatcher.ts
export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function compareKeywords(jobDesc: string, resume: string) {
  const jobKeywords = new Set(extractKeywords(jobDesc));
  const resumeKeywords = new Set(extractKeywords(resume));
  const matched = Array.from(jobKeywords).filter((kw) => resumeKeywords.has(kw));
  const missing = Array.from(jobKeywords).filter((kw) => !resumeKeywords.has(kw));
  const unique = Array.from(resumeKeywords).filter((kw) => !jobKeywords.has(kw));
  const matchPercent = jobKeywords.size
    ? Math.round((matched.length / jobKeywords.size) * 100)
    : 0;
  return { matched, missing, unique, matchPercent };
}
