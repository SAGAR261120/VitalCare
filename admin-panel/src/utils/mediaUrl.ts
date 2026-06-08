const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const API_ORIGIN = API_URL.replace(/\/api\/v1\/?$/, '');

export const resolveMediaUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};
