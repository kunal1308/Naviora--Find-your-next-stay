// Admin allow-list. Simple email check for now — good enough for a single
// admin. A production app would use Firebase custom claims / roles.
// This same email is enforced in firestore.rules for catalog writes.

export const ADMIN_EMAILS = ["karan.arora040820@gmail.com"];

export function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}
