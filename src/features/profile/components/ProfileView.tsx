"use client";

// Profile page body (Client Component — needs the signed-in user).
// Shows account info and the user's bookings, joined with hotel names.

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  getBookingsByUser,
  cancelBooking,
  updateBooking,
  canModifyBooking,
  paymentIdsOf,
} from "@/services/bookings";
import { getHotels } from "@/services/hotels";
import { getAvatar, updateAvatar } from "@/services/users";
import ImageUploader from "@/components/ui/ImageUploader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import Pagination from "@/components/ui/Pagination";
import EditBookingDialog from "@/features/profile/components/EditBookingDialog";
import type { Booking, Hotel } from "@/types";
import { formatCurrency, formatDate, nameFromEmail } from "@/utils";
import { ROUTES } from "@/constants";

const STATUS_STYLES: Record<Booking["status"], string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-slate-200 text-slate-600",
};

const BOOKINGS_PER_PAGE = 5;

export default function ProfileView() {
  const { user, loading } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Record<string, Hotel>>({});
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    let active = true;
    Promise.all([
      getBookingsByUser(user.uid),
      getHotels(),
      getAvatar(user.uid),
    ]).then(([bk, hs, av]) => {
      if (!active) return;
      setBookings(bk);
      setHotels(Object.fromEntries(hs.map((h) => [h.id, h])));
      setAvatarUrl(av);
      setLoadingData(false);
    });
    return () => {
      active = false;
    };
  }, [user]);

  async function handleAvatar(url: string) {
    if (!user) return;
    setAvatarUrl(url); // optimistic
    try {
      await updateAvatar(user.uid, url);
      toast.success("Profile photo updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save photo.");
    }
  }

  async function reloadBookings() {
    if (!user) return;
    setBookings(await getBookingsByUser(user.uid));
  }

  async function confirmCancel() {
    if (!cancelling) return;
    setCancelBusy(true);
    setCancelError(null);
    try {
      const paymentIds = paymentIdsOf(cancelling);
      const refundable =
        paymentIds.length > 0 && canModifyBooking(cancelling.checkIn);

      if (refundable) {
        const res = await fetch("/api/razorpay/refund", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIds,
            hotelId: cancelling.hotelId,
            prevCheckIn: cancelling.checkIn,
            prevCheckOut: cancelling.checkOut,
            cancel: true,
          }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Refund failed.");
        await updateBooking(cancelling.id, {
          status: "cancelled",
          refunds: [
            ...(cancelling.refunds ?? []),
            ...result.refunds.map((r: { refundId: string }) => r.refundId),
          ],
        });
      } else {
        await cancelBooking(cancelling.id);
      }

      await reloadBookings();
      setCancelling(null);
      toast.success(
        refundable ? "Booking cancelled and refunded." : "Booking cancelled.",
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cancel failed.";
      setCancelError(message);
      toast.error(message);
    } finally {
      setCancelBusy(false);
    }
  }

  if (loading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
        <p className="text-lg font-medium text-slate-700">
          Sign in to view your profile
        </p>
        <Link
          href={ROUTES.login}
          className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(bookings.length / BOOKINGS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageBookings = bookings.slice(
    (currentPage - 1) * BOOKINGS_PER_PAGE,
    currentPage * BOOKINGS_PER_PAGE,
  );

  return (
    <div className="space-y-8">
      {/* Account */}
      <section className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <div className="relative h-14 w-14 overflow-hidden rounded-full">
              <Image
                src={avatarUrl}
                alt="Profile photo"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-xl font-bold text-white">
              {(user.displayName || user.email || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-slate-900">
              {user.displayName || nameFromEmail(user.email) || "Traveler"}
            </div>
            <div className="text-sm text-slate-500">{user.email}</div>
            <div className="mt-2">
              <ImageUploader onUploaded={handleAvatar} label="Change photo" />
            </div>
          </div>
        </div>
      </section>

      {/* Bookings */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900">My bookings</h2>

        {loadingData ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
            <p className="text-slate-600">No bookings yet.</p>
            <Link
              href={ROUTES.hotels}
              className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Find a stay
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {pageBookings.map((b) => {
              const hotel = hotels[b.hotelId];
              return (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div>
                    <Link
                      href={ROUTES.hotel(b.hotelId)}
                      className="font-medium text-slate-900 hover:text-brand-700"
                    >
                      {hotel?.name ?? b.hotelId}
                    </Link>
                    <div className="text-sm text-slate-500">
                      {formatDate(b.checkIn)} → {formatDate(b.checkOut)} ·{" "}
                      {b.guests} {b.guests === 1 ? "guest" : "guests"}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        {formatCurrency(b.totalPrice, b.currency)}
                      </div>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    {b.status === "confirmed" &&
                      (canModifyBooking(b.checkIn) ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(b)}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCancelError(null);
                              setCancelling(b);
                            }}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Changes closed
                        </span>
                      ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPage={setPage}
        />
      </section>

      {editing && (
        <EditBookingDialog
          booking={editing}
          hotel={hotels[editing.hotelId]}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void reloadBookings();
          }}
        />
      )}

      {cancelling && (
        <ConfirmDialog
          title="Cancel booking?"
          danger
          confirmLabel="Cancel booking"
          cancelLabel="Keep booking"
          loading={cancelBusy}
          error={cancelError}
          onConfirm={confirmCancel}
          onClose={() => setCancelling(null)}
          message={
            <>
              Cancel your stay at{" "}
              <span className="font-medium text-slate-700">
                {hotels[cancelling.hotelId]?.name ?? cancelling.hotelId}
              </span>
              ?{" "}
              {paymentIdsOf(cancelling).length > 0 &&
              canModifyBooking(cancelling.checkIn) ? (
                <>
                  You&apos;ll be refunded{" "}
                  {formatCurrency(cancelling.totalPrice, cancelling.currency)}.{" "}
                </>
              ) : null}
              This can&apos;t be undone.
            </>
          }
        />
      )}
    </div>
  );
}
