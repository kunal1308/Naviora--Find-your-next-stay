// Route Handler: /api/admin/users — admin-only account controls.
//   GET  → { disabled: string[] }        uids of disabled accounts
//   POST { uid, disabled: boolean } →    disable or re-enable an account
//
// Disabling blocks sign-in and revokes the user's sessions; their data
// (bookings, reviews, listings) is kept, so Enable fully restores them.
// Callers send `Authorization: Bearer <Firebase ID token>` (web and mobile).

import { NextResponse } from "next/server";
import { isAdmin } from "@/constants";
import {
  adminAuth,
  isFirebaseAdminConfigured,
  verifyAdminRequest,
} from "@/lib/firebase-admin";

function notConfigured() {
  return NextResponse.json(
    { error: "User management isn't configured on the server yet." },
    { status: 500 },
  );
}

function forbidden() {
  return NextResponse.json({ error: "Admins only." }, { status: 403 });
}

export async function GET(request: Request) {
  if (!isFirebaseAdminConfigured()) return notConfigured();
  if (!(await verifyAdminRequest(request))) return forbidden();

  try {
    // listUsers pages through every account, 1000 at a time.
    const disabled: string[] = [];
    let pageToken: string | undefined;
    do {
      const page = await adminAuth().listUsers(1000, pageToken);
      page.users.forEach((u) => u.disabled && disabled.push(u.uid));
      pageToken = page.pageToken;
    } while (pageToken);
    return NextResponse.json({ disabled });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Couldn't load users." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) return notConfigured();
  const caller = await verifyAdminRequest(request);
  if (!caller) return forbidden();

  try {
    const { uid, disabled } = await request.json();
    if (typeof uid !== "string" || !uid || typeof disabled !== "boolean") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    if (uid === caller.uid) {
      return NextResponse.json(
        { error: "You can't disable your own account." },
        { status: 400 },
      );
    }

    const target = await adminAuth()
      .getUser(uid)
      .catch(() => null);
    if (!target) {
      return NextResponse.json(
        { error: "This account no longer exists." },
        { status: 404 },
      );
    }
    if (isAdmin(target.email)) {
      return NextResponse.json(
        { error: "Admin accounts can't be disabled." },
        { status: 400 },
      );
    }

    await adminAuth().updateUser(uid, { disabled });
    // Sign them out everywhere. Their current session token can still work
    // for up to an hour, but it can't be refreshed.
    if (disabled) await adminAuth().revokeRefreshTokens(uid);

    return NextResponse.json({ uid, disabled });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: 500 },
    );
  }
}
