# A1 Motor Group — Landing Page

Modern, responsive landing page for **A1 Motor Group** (car dealership), built with **Vite + React** and CSS modules.

## Run the project

```bash
npm install
npm run dev
```

This starts both the frontend (Vite) on [http://localhost:5173](http://localhost:5173) and the backend API server on [http://localhost:3001](http://localhost:3001).

- **Build:** `npm run build`
- **Preview build:** `npm run preview`

## Assets

Images are read from the **`Assests`** folder at the project root. The scripts `predev` and `prebuild` copy `Assests` into `public/Assests` so the app can serve them. Ensure you have:

- `Assests/logo.webp`
- `Assests/Hero.webp`
- `Assests/Sell.webp`
- `Assests/Cars/2021 Toyota 4Runner/2021 Toyota 4Runner  1.webp` (and other car images as needed)

If `Assests` is missing, the app still runs but images will not load until you add the folder and run `npm run dev` or `npm run build` again.

## Structure

- **`src/components/`** — Header, Hero, Inventory, SellYourCar, Contact, Footer, Layout
- **`src/pages/`** — HomePage, ApplyForFinancing, SellYourCarPage, AboutUsPage, AdminInventory
- **`src/utils/api.js`** — API client utilities
- **`src/data/inventory.json`** — Vehicle inventory data (managed by backend)
- **`server/index.js`** — Express backend server with API endpoints
- **`src/App.jsx`** — Router and routes
- **`src/index.css`** — Global styles and CSS variables
- **`public/`** — Static assets (populated from `Assests` by the copy script)
- **`public/uploads/`** — Uploaded vehicle photos (created automatically)

## Routes

- **`/`** — Home (landing)
- **`/apply-for-financing`** — Financing application wizard (6 steps)
- **`/sell-your-car`** — Sell your car form (3 steps)
- **`/about-us`** — About Us page
- **`/admin/inventory`** — Admin inventory management (add/edit vehicles, VIN decode, photo upload)

## Nav links

- **Inventory** → `/#inventory`
- **Apply For Financing** → `/apply-for-financing`
- **Sell Your Car** → `/#sell-your-car`
- **About Us** → `/#about`
- **Phone** → `tel:+14089825456`

Smooth scrolling is enabled for anchor navigation on the home page.
