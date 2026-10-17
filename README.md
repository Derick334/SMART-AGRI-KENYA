# SMART-AGRI KENYA

**SMART-AGRI KENYA** is a full-stack digital agricultural ecosystem engineered for smallholder and commercial farmers, livestock keepers, input suppliers, produce buyers, transporters, laboratories, and agricultural administrators across all 47 counties of Kenya.

The platform eliminates exploitative broker cartels, unlocks scientific soil health testing, provides rapid crop and livestock disease diagnosis with Pest Control Products Board (PCPB) registered active ingredients, displays official commodity market clearing prices, and enables farm-to-door delivery with M-Pesa Daraja escrow protection.

---

## 1. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend:** Node.js Express server (`server.ts`) with Vite middleware mounted in dev.
- **Database:** PostgreSQL schema with Row-Level Security (RLS), constraints, foreign keys, and indexes (`/src/db/schema.sql`).
- **AI Core:** Google GenAI SDK (`@google/genai`) running `gemini-3.8-flash` on the server for agricultural advisory and visual pest/disease diagnosis.
- **Payments:** Safaricom M-Pesa Daraja STK Push flow with server-side validation, receipt generation, and transaction query.
- **Geospatial & Logistics:** KeNHA road corridor distance and multi-vehicle freight calculation engine (`/src/services/distanceCalculator.ts`).
- **Weather:** Real-time synoptic weather integration via Open-Meteo for Kenya coordinates.

---

## 2. Main Navigation Tabs (All 19 Implemented)

1. **Home (`/`)**: National agricultural hub, quick search, featured produce, livestock spotlight, emergency hotlines.
2. **Marketplace (`/marketplace`)**: Searchable agricultural marketplace with category, county, price, and seller filters.
3. **Crops and Plants (`/crops`)**: Maize, beans, potatoes, Mwea Pishori rice, export Hass avocados, tomatoes, and seedlings.
4. **Livestock (`/livestock`)**: Dedicated purchasing system for pedigree cows, beef bulls, and poultry, with side-by-side comparison.
5. **Farm Inputs (`/inputs`)**: KEPHIS certified hybrid seeds, DAP/CAN fertilizers, balanced animal feeds, and machinery.
6. **Soil Testing (`/soil-testing`)**: Soil analysis request workflow with KALRO NARL and CropNuts, pH/NPK charts, and lime recommendations.
7. **Pest & Disease Diagnosis (`/pest-diagnosis`)**: Visual/symptom checker with PCPB registered active ingredients and withholding periods (PHI).
8. **Market Prices (`/market-prices`)**: Wholesale commodity clearing prices from Wakulima (Nairobi), Kongowea, Kibuye, and Eldoret.
9. **Weather (`/weather`)**: 7-day forecast, precipitation probability, and agro-ecological planting calendar across 47 counties.
10. **Farming Advice & AI Assistant (`/ai-assistant`)**: Gemini 3.8 Flash agronomy and veterinary assistant with English and Swahili support.
11. **Irrigation & Soil Monitoring (`/irrigation`)**: Real-time soil moisture telemetry simulator and 1-acre drip sizing calculator.
12. **Farmer Community (`/community`)**: Farmer forum discussions, practical advice exchange, likes, and complaint filing.
13. **Expert Consultation (`/experts`)**: Book KALRO agronomists, KVB licensed veterinary surgeons, and irrigation engineers.
14. **Orders & Deliveries (`/orders`)**: Live order tracking timeline, transporter driver contacts, and M-Pesa receipts.
15. **Farmer Dashboard (`/dashboard`)**: Farmer shop management, inventory controls, listing publishing, and sales revenue.
16. **About Us (`/about`)**: Institutional alignment with KALRO, KEPHIS, PCPB, and Kenya Dairy Board.
17. **Contact & Support (`/contact`)**: Regional hubs in Nairobi, Eldoret, Nakuru, Kisumu, and Mombasa, plus toll-free hotlines.
18. **Login / Register (`/auth`)**: Role-based access for Farmers, Buyers, Transporters, Experts, and Administrators.
19. **Admin Portal (`/admin`)**: KYC identity approvals, listing moderation, shipping tariff configurations, and audit logs.

---

## 3. Database Architecture (`/src/db/schema.sql`)

The database is designed for PostgreSQL & Supabase, including:
- `users`: Core authentication and role permissions (`farmer`, `buyer`, `transporter`, `expert`, `lab`, `admin`).
- `farmer_profiles`: National ID verification, KRA PIN, cooperative membership, and M-Pesa payout phone.
- `products` & `product_images`: Catalog items with quantity, minimum order, variety, price in KSh, and county location.
- `livestock_listings` & `livestock_vaccinations`: Specialized tables for breed, age, lactation stage, milk yield, egg yield, ear tags, and vet vaccination records.
- `transporters`: Vehicle registration plates, capacity in kg, and KeNHA rate per kilometer.
- `orders` & `order_items`: Order tracking with buyer addresses, subtotal, freight fee, and M-Pesa receipts.
- `payment_transactions`: Daraja MerchantRequestID, CheckoutRequestID, and callback reconciliation.
- `soil_laboratories`, `soil_test_requests`, and `soil_test_results`: Accredited laboratories, chemical profiles (pH, N, P, K, organic matter, salinity), lime requirement, and agronomic plans.
- `pest_disease_references` & `pest_approved_products`: PCPB-registered active ingredients, withholding periods (PHI), and PPE requirements.
- `market_price_observations`: Daily wholesale clearing records across terminal municipal markets.
- `platform_audit_logs`: Administrative actions and security compliance logs.

---

## 4. Status of Platform Features

| Feature | Execution Status | Data Source / Integration |
|---|---|---|
| **Marketplace & Livestock Search** | **Live** | Interactive in-memory & localStorage store seeded with 50+ Kenyan listings |
| **Livestock Comparison Tool** | **Live** | Client-side side-by-side genetic and production comparison |
| **M-Pesa Daraja STK Push** | **Live (Simulated & Daraja Ready)** | Server-side `/api/mpesa/stkpush` & `/api/mpesa/query` |
| **KeNHA Freight Calculator** | **Live** | KeNHA road distance matrix and multi-vehicle pricing model |
| **Gemini AI Agronomy Specialist** | **Live** | Server-side `/api/gemini/assistant` running `gemini-3.8-flash` |
| **Multimodal Pest Diagnosis** | **Live** | Server-side `/api/gemini/diagnose` with PCPB database |
| **Weather & Rains** | **Live** | Open-Meteo Synoptic API proxy for all 47 counties |
| **KALRO Soil Analysis** | **Live** | Interactive request workflow & accredited lab reports |
| **Farmer Seller Dashboard** | **Live** | Create, edit, pause, and delete product listings |
| **Administrator Security Portal** | **Live** | Role-gated `/admin` with KYC approvals and tariff configuration |

---

## 5. Local Setup Instructions (VS Code)

1. Clone or extract the project repository.
2. Ensure Node.js v18+ is installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure your `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` for live AI generation.
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser at `http://localhost:3000`.

---

## 6. Testing Instructions

To run TypeScript verification:
```bash
npm run lint
```

To build production bundle:
```bash
npm run build
```

---

## 7. Deployment Instructions

1. **Build the SPA assets:**
   ```bash
   npm run build
   ```
2. **Launch with Node / tsx:**
   ```bash
   npm start
   ```
3. Set environment variables on your hosting provider (e.g. Cloud Run, Railway, Render):
   - `GEMINI_API_KEY`
   - `PORT=3000`
   - `NODE_ENV=production`
   - Safaricom Daraja API keys for live transactions.
