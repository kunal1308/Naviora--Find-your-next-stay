"use client";

// Admin Users page body: lists every user profile doc. Reads are allowed for
// the admin per firestore.rules. Users appear here once they've signed in
// (AuthProvider upserts a profile on login).

import { useEffect, useState } from "react";
import {
  getAllUsers,
  getDisabledUserIds,
  setUserDisabled,
  type UserRecord,
} from "@/services/users";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { nameFromEmail } from "@/utils";
import { isAdmin } from "@/constants";
import { useAuth } from "@/features/auth/AuthProvider";

const PAGE_SIZE = 20;

export default function AdminUsersList() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const toast = useToast();
  // Account status comes from the server (Firebase Auth), separately from the
  // profile list, so the list still shows if the status call fails.
  const [disabledIds, setDisabledIds] = useState<Set<string> | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<UserRecord | null>(null);

  useEffect(() => {
    let active = true;
    getAllUsers().then((all) => {
      if (active) {
        setUsers(all);
        setLoading(false);
      }
    });
    getDisabledUserIds()
      .then((ids) => active && setDisabledIds(ids))
      .catch((err) => {
        if (active) {
          setStatusError(
            err instanceof Error ? err.message : "Couldn't load account status.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function toggleDisabled(target: UserRecord, disable: boolean) {
    setBusyUid(target.id);
    try {
      await setUserDisabled(target.id, disable);
      setDisabledIds((prev) => {
        const next = new Set(prev);
        if (disable) next.add(target.id);
        else next.delete(target.id);
        return next;
      });
      toast.success(disable ? "Account disabled." : "Account enabled.");
      setConfirming(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyUid(null);
    }
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? users.filter(
        (u) =>
          (u.name ?? "").toLowerCase().includes(q) ||
          (u.email ?? "").toLowerCase().includes(q) ||
          nameFromEmail(u.email).toLowerCase().includes(q),
      )
    : users;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Users
        </h1>
        <p className="text-sm text-slate-500">
          {loading
            ? "Loading…"
            : `${filtered.length} of ${users.length} user(s)`}
        </p>
      </div>

      {statusError && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Account status unavailable: {statusError}
        </p>
      )}

      <div className="mt-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search users by name or email"
        />
      </div>

      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            {query ? "No users match your search." : "No users yet."}
          </div>
        ) : (
          pageItems.map((u) => (
            <div key={u.id} className="flex items-center gap-4 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                {(u.name || u.email || "?").charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-slate-900">
                    {u.name || nameFromEmail(u.email) || "—"}
                    {u.id === user?.uid && (
                      <span className="font-normal text-slate-400"> (You)</span>
                    )}
                  </span>
                  {isAdmin(u.email) && (
                    <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                      Admin
                    </span>
                  )}
                  {disabledIds?.has(u.id) && (
                    <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                      Disabled
                    </span>
                  )}
                </div>
                <div className="truncate text-sm text-slate-500">
                  {u.email || "No email on record yet"}
                </div>
              </div>
              {/* Admins have no wishlist */}
              <div className="text-sm text-slate-500">
                {isAdmin(u.email) ? "—" : `${u.wishlist?.length ?? 0} saved`}
              </div>
              {/* No toggle for the admin, or until status has loaded */}
              {disabledIds &&
                !isAdmin(u.email) &&
                u.id !== user?.uid &&
                (disabledIds.has(u.id) ? (
                  <button
                    type="button"
                    onClick={() => toggleDisabled(u, false)}
                    disabled={busyUid === u.id}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                  >
                    {busyUid === u.id ? "Enabling…" : "Enable"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirming(u)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Disable
                  </button>
                ))}
            </div>
          ))
        )}
      </div>

      {!loading && (
        <Pagination page={current} totalPages={totalPages} onPage={setPage} />
      )}

      {confirming && (
        <ConfirmDialog
          title="Disable account?"
          danger
          confirmLabel="Disable"
          cancelLabel="Keep active"
          loading={busyUid === confirming.id}
          onConfirm={() => toggleDisabled(confirming, true)}
          onClose={() => setConfirming(null)}
          message={
            <>
              <span className="font-medium text-slate-700">
                {confirming.email || confirming.name || confirming.id}
              </span>{" "}
              won&apos;t be able to sign in and will be signed out within an
              hour. Their bookings, reviews and listings are kept, and you can
              enable the account again at any time.
            </>
          }
        />
      )}
    </div>
  );
}
