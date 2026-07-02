"use client";

// Admin Users page body: lists every user profile doc. Reads are allowed for
// the admin per firestore.rules. Users appear here once they've signed in
// (AuthProvider upserts a profile on login).

import { useEffect, useState } from "react";
import { getAllUsers, type UserRecord } from "@/services/users";
import Pagination from "@/components/ui/Pagination";
import { nameFromEmail } from "@/utils";
import { isAdmin } from "@/constants";
import { useAuth } from "@/features/auth/AuthProvider";

const PAGE_SIZE = 20;

export default function AdminUsersList() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    getAllUsers().then((all) => {
      if (active) {
        setUsers(all);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = users.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Users
        </h1>
        <p className="text-sm text-slate-500">
          {loading ? "Loading…" : `${users.length} user(s)`}
        </p>
      </div>

      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No users yet.</div>
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
                </div>
                <div className="truncate text-sm text-slate-500">
                  {u.email || "No email on record yet"}
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {u.wishlist?.length ?? 0} saved
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && (
        <Pagination page={current} totalPages={totalPages} onPage={setPage} />
      )}
    </div>
  );
}
