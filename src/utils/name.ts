// Derive a friendly display name from an email's local part when no name is
// available (e.g. some Google sign-ins). "john.doe@gmail.com" → "John Doe".
// Returns "" when there's no email.
export function nameFromEmail(email?: string | null): string {
  if (!email) return "";
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
