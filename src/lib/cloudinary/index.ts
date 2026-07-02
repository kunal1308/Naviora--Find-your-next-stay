// Cloudinary setup — image hosting. We store image URLs in Firestore and the
// files live on Cloudinary's CDN.
//
// To enable, create a free Cloudinary account, then set in .env.local:
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME     (Dashboard → Product Environment)
//   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET  (Settings → Upload → add an UNSIGNED preset)

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

// Build a delivery URL from a public id, with transformations applied.
// e.g. cloudinaryUrl("hotels/goa-1", "w_800,c_fill,q_auto,f_auto")
export function cloudinaryUrl(
  publicId: string,
  transforms = "f_auto,q_auto",
): string {
  if (!CLOUDINARY_CLOUD_NAME) return publicId; // not configured → passthrough
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

// Unsigned client-side upload — used by the admin panel later.
// Returns the hosted image URL to store in Firestore.
export async function uploadImage(file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_* in .env.local.",
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error("Cloudinary upload failed");

  const data: { secure_url: string } = await res.json();
  return data.secure_url;
}
