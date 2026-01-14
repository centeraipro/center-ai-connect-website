/**
 * Converts a business name into a URL-friendly slug
 * @param businessName - The business name to convert
 * @returns A lowercase, hyphenated slug
 */
export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
