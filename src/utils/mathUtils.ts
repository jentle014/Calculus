export function cleanMathText(text?: string): string {
  if (!text) return '';

  let cleaned = String(text);

  // 1. Remove LaTeX dollar sign wrappers e.g. $y$ -> y, $$x^2$$ -> x²
  cleaned = cleaned.replace(/\$\$(.*?)\$\$/g, '$1');
  cleaned = cleaned.replace(/\$(.*?)\$/g, '$1');

  // 2. Convert common LaTeX math commands to clean readable Unicode / text
  cleaned = cleaned
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\infty/g, '∞')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\pm/g, '±')
    .replace(/\\int/g, '∫')
    .replace(/\\lim/g, 'lim')
    .replace(/\\to/g, '→')
    .replace(/\\partial/g, '∂');

  // 3. Clean up power notation (e.g., ^2 -> ², ^3 -> ³)
  cleaned = cleaned
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³');

  // 4. Remove any remaining stray dollar signs
  cleaned = cleaned.replace(/\$/g, '');

  return cleaned.trim();
}

export function cleanQuestionObject<T extends { q: string; options: string[]; hint?: string; pattern?: string; steps?: any[] }>(qObj: T): T {
  if (!qObj) return qObj;
  return {
    ...qObj,
    q: cleanMathText(qObj.q),
    options: (qObj.options || []).map((opt) => cleanMathText(opt)),
    hint: qObj.hint ? cleanMathText(qObj.hint) : qObj.hint,
    pattern: qObj.pattern ? cleanMathText(qObj.pattern) : qObj.pattern,
    steps: Array.isArray(qObj.steps)
      ? qObj.steps.map((st) => ({
          ...st,
          title: st.title ? cleanMathText(st.title) : st.title,
          body: st.body ? cleanMathText(st.body) : st.body
        }))
      : qObj.steps
  };
}
