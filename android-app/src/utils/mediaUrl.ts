import { API_CONFIG } from '../constants';

const API_ORIGIN = API_CONFIG.BASE_URL.replace(/\/api\/v1\/?$/, '');

export const resolveMediaUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};
