// Turn a hotel name into a URL-safe id/slug, e.g. "The Royal Amber!" →
// "the-royal-amber". Pure helper (no I/O).
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
