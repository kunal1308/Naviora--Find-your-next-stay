# Naviora ✈️🏨

**Find your next stay.** A modern, full-stack hotel booking platform.

Naviora is a full-stack travel booking app built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Firebase**. Guests can search, filter, and book handpicked hotels across the world's best destinations — and any user can switch to **host mode** to list their own properties. It includes real payments (Razorpay test mode), image uploads (Cloudinary), analytics, and a full SEO layer.

---

## 🚀 Live Demo

🌐 **https://naviora-find-your-next-stay.vercel.app/**

---

## ✨ Features

### 🔐 Authentication

- Firebase Authentication — Email/Password **and** Google
- App-wide auth via React Context (`useAuth`)
- Persistent sessions; profile doc auto-created on login
- Admins routed to their dashboard; guests to hotels

### 🔎 Hotels & Search

- Browse hotels across 10+ destinations
- **URL-driven filters** — price, rating, amenities, sort (shareable & bookmarkable)
- Prices normalized to ₹ for correct cross-currency filtering/sorting
- **Windowed pagination** (compact even with many pages)
- Hotel detail page with **image gallery lightbox**, amenities, and reviews

### ❤️ Wishlist

- Per-user, **live-synced** with Firestore
- Save from cards or the detail page
- Hidden for signed-out visitors

### 📅 Booking & Payments

- Date + guest selection with live price breakdown (nights + taxes)
- **Razorpay** checkout (test mode) with server-side **signature verification**
- Booking written only after a verified payment
- **Edit / cancel** bookings (allowed up to 1 day before check-in)
- Duplicate-booking guard for the same hotel

### 🏡 Host Mode (dual-mode marketplace)

- Any signed-in user can **list a property** — no separate account
- `/host` dashboard to add / edit / delete their own listings
- User listings appear in public search but are hidden from their own owner

### 🛠️ Admin

- Email-gated admin area
- Listings CRUD + all-users view
- One-click sample-data generator

### 📸 Images

- **Cloudinary** uploads (unsigned)
- Optimized delivery via `next/image`
- Full-screen gallery lightbox with keyboard + swipe-friendly controls

### 📊 Analytics & 🔍 SEO

- Firebase Analytics — page views + custom events (search, filters, view, booking, etc.)
- Metadata, Open Graph image, `sitemap.xml`, `robots.txt`, web manifest, favicon
- Private routes marked `noindex`

### 🎨 UI / UX

- Fully responsive (mobile filter **bottom-sheet**, hamburger nav)
- Loading skeletons, error boundary, custom 404
- Keyboard focus rings, lucide icons, Inter font, teal brand theme

---

## 🧱 Tech Stack

### Frontend

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- lucide-react (icons)

### Backend / Services

- Firebase Authentication
- Firebase Firestore
- Firebase Analytics
- Cloudinary (image hosting)
- Razorpay (payments, test mode)

---

## 📂 Project Structure

```bash
src/
│
├── app/          # Routes (pages, layouts, route handlers, SEO files)
├── components/   # Shared UI (layout, ui, analytics)
├── features/     # Domain modules (auth, hotels, wishlist, profile, host, admin)
├── lib/          # Integrations (firebase, cloudinary, analytics)
├── services/     # Data access (hotels, bookings, users, reviews, destinations)
├── hooks/        # Shared hooks
├── types/        # Shared TypeScript types
├── utils/        # Pure helpers (format, currency, slug, name)
├── constants/    # Routes, amenities, currency, admin, site config
└── styles/       # Global styles (globals.css lives in app/)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full breakdown.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay (test mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Site URL (used for SEO: sitemap, canonical, OG). Your deployed URL in prod.
NEXT_PUBLIC_SITE_URL=
```

---

## 📦 Installation

```bash
# Clone
git clone https://github.com/kunal1308/Naviora--Find-your-next-stay.git
cd Naviora--Find-your-next-stay

# Install
npm install

# Configure
cp .env.example .env.local   # then fill in your keys

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed sample data

Sign in as the admin, open **/admin → Sample data → Add sample hotels** to populate the catalog. (Requires Firestore created and rules published.)

### Build

```bash
npm run build
npm start
```

---

## 🔒 Firestore Rules

Security rules live in [`firestore.rules`](firestore.rules) — public read for the catalog, owner-only writes for user data and host listings, admin-only writes for the curated catalog. Publish them in the Firebase console (or via the Firebase CLI).

---

## 🚀 Deployment

Deployed on **Vercel**.

1. Import the repo in Vercel
2. Add all environment variables (from `.env.example`)
3. Set `NEXT_PUBLIC_SITE_URL` to your deployed URL
4. Add the Vercel domain to **Firebase → Authentication → Authorized domains**

---

## 📱 Screens Included

- Landing page (hero, search, destinations, gallery)
- Hotels (search, filters, pagination)
- Hotel details (gallery, booking, reviews)
- Destinations
- Wishlist
- Profile & bookings
- Host dashboard (list / edit)
- Admin (listings, users)
- Auth (login / signup)

---

## 👨‍💻 Author

Developed by **Kunal**.

---

## 📄 License

Built for educational and portfolio purposes.

---

# 📸 Screenshots

## 🏠 Home Page
<img width="959" height="496" alt="image" src="https://github.com/user-attachments/assets/75c61417-7001-46c3-bba5-f29c6f44b8c1" />
<img width="959" height="497" alt="image" src="https://github.com/user-attachments/assets/169aac81-2fb3-4466-9af8-fd049771a1b4" />
<img width="959" height="502" alt="image" src="https://github.com/user-attachments/assets/87eb779f-41aa-48dd-bd49-11d961f0710c" />

## Auth (login / signup)
<img width="959" height="497" alt="image" src="https://github.com/user-attachments/assets/8a293deb-d5c5-4ee9-a4f8-e76e7edd14af" />
<img width="959" height="498" alt="image" src="https://github.com/user-attachments/assets/39de4e06-28b0-4cf9-a7e1-a373fda67072" />
  
## 🔎 Hotels & Filters
<img width="959" height="498" alt="image" src="https://github.com/user-attachments/assets/6b301515-f401-4d67-9d55-2125ef839d28" />

## 📄 Hotel Details
<img width="959" height="500" alt="image" src="https://github.com/user-attachments/assets/a69c64cd-1a21-4065-81b2-33c88efd8bf7" />
<img width="959" height="500" alt="image" src="https://github.com/user-attachments/assets/a0dd59bd-f421-4619-a8e4-60c41035f79f" />
<img width="959" height="498" alt="image" src="https://github.com/user-attachments/assets/4b7041ae-4139-4975-ac7e-225fff439415" />

## 📅 Booking & Payment
<img width="959" height="497" alt="image" src="https://github.com/user-attachments/assets/756f3ae4-48bc-4401-bd55-cd391adec990" />
<img width="959" height="502" alt="image" src="https://github.com/user-attachments/assets/eb42f0e6-346a-4050-ac0b-116e5dbbfdac" />
<img width="959" height="496" alt="image" src="https://github.com/user-attachments/assets/583adbf1-63ae-4906-8891-eaa2f4d3a3fe" />

## 🏡 Host Dashboard
<img width="959" height="497" alt="image" src="https://github.com/user-attachments/assets/87164c00-f461-41a2-a1e2-a3edcfe527fb" />
<img width="959" height="495" alt="image" src="https://github.com/user-attachments/assets/0322a914-9c0b-4b28-b777-f6cb434d1875" />
<img width="959" height="493" alt="image" src="https://github.com/user-attachments/assets/c164739e-d425-4368-90b8-c1072ce3b503" />

## 🛠️ Admin
<img width="959" height="500" alt="image" src="https://github.com/user-attachments/assets/5f4443b6-c6b1-40c0-9d66-8f69a9dba51f" />
<img width="959" height="498" alt="image" src="https://github.com/user-attachments/assets/44c9933b-ca1e-4fde-ad9b-6f5b8fd3ba98" />


