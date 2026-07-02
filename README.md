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
- Footer pages (About, Help, Contact, Terms, Privacy, etc.)

---

## 👨‍💻 Author

Developed by **Kunal**.

---

## 📄 License

Built for educational and portfolio purposes.

---

# 📸 Screenshots

## 🏠 Home Page


## 🔎 Hotels & Filters


## 📄 Hotel Details


## 📅 Booking & Payment


## 🏡 Host Dashboard


## 🛠️ Admin

