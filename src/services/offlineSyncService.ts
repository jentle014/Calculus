import { Question } from '../types';
import { RAW_QUESTION_BANK } from '../data/questionBank';

import derivativesImg from '../assets/images/calculus_derivatives_diagram_1786048382838.jpg';
import integralsImg from '../assets/images/calculus_integrals_area_1786048442186.jpg';
import limitsImg from '../assets/images/calculus_limits_graph_1786048455996.jpg';

const OFFLINE_QUESTIONS_KEY = 'studySuite_offline_questions';
const OFFLINE_IMAGE_HINTS_KEY = 'studySuite_offline_image_hints';
const OFFLINE_SYNC_INFO_KEY = 'studySuite_offline_sync_info';

export interface OfflineSyncInfo {
  isSynced: boolean;
  questionCount: number;
  imageCount: number;
  syncedAt: string | null;
}

// Convert image URL to Base64 data URL for offline persistence
export async function imageUrlToBase64(url: string): Promise<string> {
  return new Promise((resolve) => {
    if (url.startsWith('data:image')) {
      resolve(url);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 600;
        canvas.height = img.naturalHeight || img.height || 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataURL);
          return;
        }
      } catch (e) {
        console.warn('Canvas conversion fallback for image:', e);
      }
      resolve(url);
    };
    img.onerror = () => {
      resolve(url);
    };
    img.src = url;
  });
}

// Perform full sync of Question Bank + Image Hints to device localStorage
export async function syncOfflineBankWithImages(
  customQuestions: Question[] = []
): Promise<OfflineSyncInfo> {
  const allQuestions = [...RAW_QUESTION_BANK, ...customQuestions];
  const nowIso = new Date().toISOString();

  // 1. Save all questions with hints & steps locally
  try {
    localStorage.setItem(OFFLINE_QUESTIONS_KEY, JSON.stringify(allQuestions));
  } catch (e) {
    console.warn('Failed to save questions to localStorage:', e);
  }

  // 2. Convert and cache core calculus image hints into Base64 strings
  const imageMap: Record<string, string> = {};
  let imageCount = 0;

  try {
    const [b64Deriv, b64Integ, b64Limits] = await Promise.all([
      imageUrlToBase64(derivativesImg),
      imageUrlToBase64(integralsImg),
      imageUrlToBase64(limitsImg)
    ]);

    imageMap['derivatives'] = b64Deriv;
    imageMap['differentiation'] = b64Deriv;
    imageMap['integrals'] = b64Integ;
    imageMap['integration'] = b64Integ;
    imageMap['limits'] = b64Limits;
    imageMap['continuity'] = b64Limits;
    imageCount = 3;

    // Cache custom question attached images into image storage
    for (const cq of customQuestions) {
      if (cq.imageUrl && cq.id) {
        try {
          imageMap[cq.id] = await imageUrlToBase64(cq.imageUrl);
          imageCount++;
        } catch (e) {
          console.warn('Could not cache custom image for', cq.id, e);
        }
      }
    }

    localStorage.setItem(OFFLINE_IMAGE_HINTS_KEY, JSON.stringify(imageMap));
  } catch (e) {
    console.warn('Failed to cache image hints locally:', e);
  }

  const syncInfo: OfflineSyncInfo = {
    isSynced: true,
    questionCount: allQuestions.length,
    imageCount,
    syncedAt: nowIso
  };

  try {
    localStorage.setItem(OFFLINE_SYNC_INFO_KEY, JSON.stringify(syncInfo));
  } catch (e) {
    console.warn('Failed to write sync info to localStorage:', e);
  }

  return syncInfo;
}

// Retrieve cached image hint data URL for a topic
export function getOfflineImageHint(topicOrKeyword: string): string | null {
  try {
    const raw = localStorage.getItem(OFFLINE_IMAGE_HINTS_KEY);
    if (!raw) return null;
    const map: Record<string, string> = JSON.parse(raw);
    const kw = (topicOrKeyword || '').toLowerCase();

    if (kw.includes('limit') || kw.includes('continu')) return map['limits'] || map['continuity'] || null;
    if (kw.includes('integr') || kw.includes('area')) return map['integrals'] || map['integration'] || null;
    if (kw.includes('deriv') || kw.includes('differen') || kw.includes('station')) return map['derivatives'] || map['differentiation'] || null;

    // Fallback to first available cached image
    return Object.values(map)[0] || null;
  } catch (e) {
    return null;
  }
}

// Get offline sync status
export function getOfflineSyncInfo(): OfflineSyncInfo {
  try {
    const raw = localStorage.getItem(OFFLINE_SYNC_INFO_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read offline sync info:', e);
  }
  return {
    isSynced: false,
    questionCount: 0,
    imageCount: 0,
    syncedAt: null
  };
}

// Check if bank is synced locally
export function isOfflineBankSynced(): boolean {
  return getOfflineSyncInfo().isSynced;
}
