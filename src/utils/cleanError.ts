export function sanitizeErrorText(msg?: string): string {
  if (!msg) return 'An unexpected error occurred. Please try again.';
  return String(msg)
    .replace(/firebase:\s*/gi, '')
    .replace(/firebase/gi, 'Database')
    .replace(/aistudio-build/gi, 'study-suite')
    .replace(/aistudio/gi, 'app')
    .replace(/ai studio/gi, 'app')
    .replace(/\[auth\/.*?\]/gi, '')
    .trim();
}
