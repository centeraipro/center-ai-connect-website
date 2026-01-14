export function extractSlugFromSubdomain(): string | null {
  const hostname = window.location.hostname;

  // For local development, return test slug or get from env
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_DEV_SLUG || 'demo';
  }

  const parts = hostname.split('.');
  if (parts.length >= 3) {
    // Return first part as slug (subdomain)
    return parts[0];
  }

  return null;
}
