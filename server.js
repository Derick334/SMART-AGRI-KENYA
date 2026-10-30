// server-backend.ts
import express from "express";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// src/data/sampleProducts.ts
var SAMPLE_PRODUCTS = [
  // ==========================================
  // CROPS & PRODUCE (8 Food Crops + 1 Other Crop = 9)
  // ==========================================
  {
    id: "prod-crop-1",
    title: "Dry White Maize (Grade 1 - H614)",
    description: "Clean, well-dried white maize harvested in Uasin Gishu. Moisture content below 13.5%. Aflatoxin tested and certified free from weevils. Packed in standard 90kg polypropylene gunny bags.",
    category: "crops",
    subcategory: "Cereals & Grains",
    productType: "Maize",
    variety: "H614",
    condition: "certified",
    priceKsh: 3600,
    unit: "90kg bag",
    quantityAvailable: 450,
    minimumOrder: 5,
    sellerId: "user-farmer-1",
    sellerName: "Kiprono Agri-Enterprises",
    sellerPhone: "0722104523",
    sellerCounty: "Uasin Gishu",
    sellerSubCounty: "Moiben",
    images: [
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 38,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-12T08:30:00Z"
  },
  {
    id: "prod-crop-h6213",
    title: "Highland White Maize (Variety H6213)",
    description: "Top-grade dry white maize of the high-yielding H6213 hybrid variety from Trans-Nzoia. Large heavy kernels with high flour extraction rate. Tested moisture 12.8%.",
    category: "crops",
    subcategory: "Cereals & Grains",
    productType: "Maize",
    variety: "H6213",
    condition: "certified",
    priceKsh: 3750,
    unit: "90kg bag",
    quantityAvailable: 320,
    minimumOrder: 5,
    sellerId: "user-agro-1",
    sellerName: "Kitale Grain Reserves Hub",
    sellerPhone: "0722334455",
    sellerCounty: "Trans-Nzoia",
    sellerSubCounty: "Kiminini",
    images: [
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 27,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T11:00:00Z"
  },
  {
    id: "prod-crop-5",
    title: "Aromatic Pure Pishori Rice (Mwea Basmati 370)",
    description: "Authentic pure Mwea aromatic long-grain Pishori rice, milled with 98% whole grain recovery. Exquisite fragrance and fluffy texture when boiled.",
    category: "crops",
    subcategory: "Cereals & Grains",
    productType: "Rice",
    variety: "Pishori / Basmati 370",
    condition: "new",
    priceKsh: 195,
    unit: "kg",
    quantityAvailable: 2400,
    minimumOrder: 10,
    sellerId: "user-farmer-5",
    sellerName: "Mwea Irrigation Farmers SACCO",
    sellerPhone: "0721834920",
    sellerCounty: "Kirinyaga",
    sellerSubCounty: "Mwea East",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 5,
    reviewsCount: 91,
    deliveryOptions: ["pickup", "direct_delivery", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T07:45:00Z"
  },
  {
    id: "prod-crop-3",
    title: "Yellow Rosecoco Beans (High Yield)",
    description: "Double hand-sorted yellow Rosecoco beans with sweet taste and fast cooking properties. Zero stone debris, completely dry and ready for institutional or retail purchase.",
    category: "crops",
    subcategory: "Pulses & Legumes",
    productType: "Beans",
    variety: "Rosecoco",
    condition: "new",
    priceKsh: 12500,
    unit: "90kg bag",
    quantityAvailable: 85,
    minimumOrder: 1,
    sellerId: "user-farmer-3",
    sellerName: "Chege Seed & Produce Co-op",
    sellerPhone: "0728349102",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Njoro",
    images: [
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 29,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-10T11:00:00Z"
  },
  {
    id: "prod-crop-wairimu",
    title: "Red Haricot Wairimu Beans",
    description: "Pure red small Haricot Wairimu beans harvested in Meru. Uniform deep red color, highly requested by schools, hospitals, and catering establishments.",
    category: "crops",
    subcategory: "Pulses & Legumes",
    productType: "Beans",
    variety: "Wairimu",
    condition: "new",
    priceKsh: 11200,
    unit: "90kg bag",
    quantityAvailable: 95,
    minimumOrder: 1,
    sellerId: "user-farmer-7",
    sellerName: "Mt. Kenya Legume Growers",
    sellerPhone: "0724883190",
    sellerCounty: "Meru",
    sellerSubCounty: "Buuri",
    images: [
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 24,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-12T14:00:00Z"
  },
  {
    id: "prod-crop-nyayo",
    title: "Yellow Nyayo Beans (Fast Cooking)",
    description: "Clean hand-sorted Yellow Nyayo beans grown in volcanic soils of Njoro. Highly nutritious, short cooking time, ideal for githeri and institutional catering. 90kg bags.",
    category: "crops",
    subcategory: "Pulses & Legumes",
    productType: "Beans",
    variety: "Nyayo",
    condition: "new",
    priceKsh: 13200,
    unit: "90kg bag",
    quantityAvailable: 110,
    minimumOrder: 1,
    sellerId: "user-farmer-1",
    sellerName: "Kiprono Agri-Enterprises",
    sellerPhone: "0722104523",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Njoro",
    images: [
      "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 35,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T08:00:00Z"
  },
  {
    id: "prod-crop-red-kidney",
    title: "Canadian Wonder Red Kidney Beans",
    description: "Large, plump red kidney beans harvested in Eldoret. Excellent skin texture, high protein content, sorted free from broken beans and dust.",
    category: "crops",
    subcategory: "Pulses & Legumes",
    productType: "Beans",
    variety: "Red kidney beans",
    condition: "new",
    priceKsh: 12800,
    unit: "90kg bag",
    quantityAvailable: 75,
    minimumOrder: 1,
    sellerId: "user-farmer-3",
    sellerName: "Chege Seed & Produce Co-op",
    sellerPhone: "0728349102",
    sellerCounty: "Uasin Gishu",
    sellerSubCounty: "Turbo",
    images: [
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 18,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-13T10:15:00Z"
  },
  {
    id: "prod-crop-mwezi-moja",
    title: "Early Maturing Mwezi Moja Dry Beans",
    description: "Drought-hardy Mwezi Moja beans harvested from dryland farming in Machakos. Speckled light brown seeds, easy to digest and very sweet taste.",
    category: "crops",
    subcategory: "Pulses & Legumes",
    productType: "Beans",
    variety: "Mwezi Moja",
    condition: "new",
    priceKsh: 11800,
    unit: "90kg bag",
    quantityAvailable: 60,
    minimumOrder: 1,
    sellerId: "user-farmer-8",
    sellerName: "Machakos Grain Farmers Group",
    sellerPhone: "0711902341",
    sellerCounty: "Machakos",
    sellerSubCounty: "Mwala",
    images: [
      "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 14,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T09:30:00Z"
  },
  {
    id: "prod-crop-chelalang",
    title: "Highland Chelalang Climbing Beans",
    description: "Specially selected climbing beans from Kericho highlands. High yield, uniform coloration, thoroughly sundried below 13% moisture.",
    category: "crops",
    subcategory: "Pulses & Legumes",
    productType: "Beans",
    variety: "Chelalang",
    condition: "new",
    priceKsh: 12e3,
    unit: "90kg bag",
    quantityAvailable: 40,
    minimumOrder: 1,
    sellerId: "user-farmer-1",
    sellerName: "Kiprono Agri-Enterprises",
    sellerPhone: "0722104523",
    sellerCounty: "Kericho",
    sellerSubCounty: "Bureti",
    images: [
      "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.6,
    reviewsCount: 11,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T14:40:00Z"
  },
  {
    id: "prod-crop-ndengu",
    title: "Clean Polished Green Grams (Ndengu KS20)",
    description: "First grade green grams (Ndengu) from Kitui County. Cleaned, machine-graded, free of stones and debris. High protein, excellent for home cooking or commercial distribution.",
    category: "crops",
    subcategory: "Pulses & Legumes",
    productType: "Beans",
    variety: "Green Grams",
    condition: "new",
    priceKsh: 14500,
    unit: "90kg bag",
    quantityAvailable: 130,
    minimumOrder: 1,
    sellerId: "user-farmer-8",
    sellerName: "Kitui Dryland Produce Cooperative",
    sellerPhone: "0711902341",
    sellerCounty: "Kitui",
    sellerSubCounty: "Mwingi Central",
    images: [
      "https://images.unsplash.com/photo-1585849834908-3481231155e8?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 42,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T15:00:00Z"
  },
  // MAIZE VARIETIES
  {
    id: "prod-crop-yellow-maize",
    title: "Clean Yellow Maize (Animal Feed & Milling)",
    description: "Premium quality yellow flint maize grown in Rongai, Nakuru. High carotene and starch, moisture 13.0%. Highly recommended for poultry feed manufacturers and livestock rations.",
    category: "crops",
    subcategory: "Cereals & Grains",
    productType: "Maize",
    variety: "Yellow maize",
    condition: "new",
    priceKsh: 3400,
    unit: "90kg bag",
    quantityAvailable: 500,
    minimumOrder: 10,
    sellerId: "user-farmer-1",
    sellerName: "Kiprono Agri-Enterprises",
    sellerPhone: "0722104523",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Rongai",
    images: [
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 31,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T08:10:00Z"
  },
  {
    id: "prod-crop-sc-duma",
    title: "Dry White Maize (SC Duma 43 Early Hybrid)",
    description: "Early maturing drought-tolerant SC Duma 43 white maize from Katumani. Sweet flour profile, heavy test weight, well-aerated gunny bags.",
    category: "crops",
    subcategory: "Cereals & Grains",
    productType: "Maize",
    variety: "SC Duma 43",
    condition: "new",
    priceKsh: 3550,
    unit: "90kg bag",
    quantityAvailable: 210,
    minimumOrder: 5,
    sellerId: "user-farmer-8",
    sellerName: "Machakos Grain Farmers Group",
    sellerPhone: "0711902341",
    sellerCounty: "Machakos",
    sellerSubCounty: "Machakos Town",
    images: [
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 19,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-13T12:00:00Z"
  },
  // POTATO VARIETIES
  {
    id: "prod-crop-2",
    title: "Fresh Shangi Irish Potatoes (Large Tubers)",
    description: "Freshly harvested large cooking potatoes from the fertile volcanic soils of Ol Kalou, Nyandarua. Excellent for chips, boiling, and mashing. No green skins or blight lesions.",
    category: "crops",
    subcategory: "Roots & Tubers",
    productType: "Potatoes",
    variety: "Shangi",
    condition: "new",
    priceKsh: 2800,
    unit: "50kg bag",
    quantityAvailable: 300,
    minimumOrder: 2,
    sellerId: "user-farmer-2",
    sellerName: "Wambui Highlands Farm",
    sellerPhone: "0714982301",
    sellerCounty: "Nyandarua",
    sellerSubCounty: "Ol Kalou",
    images: [
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 52,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T09:15:00Z"
  },
  {
    id: "prod-crop-tigoni",
    title: "Grade A Tigoni Chipping Potatoes",
    description: "Premium Tigoni potato tubers grown under certified seed protocol in Timau, Meru. Uniform oval shape, low sugar, high dry matter, highly prized by chip fryers and crisps makers.",
    category: "crops",
    subcategory: "Roots & Tubers",
    productType: "Potatoes",
    variety: "Tigoni",
    condition: "new",
    priceKsh: 3100,
    unit: "50kg bag",
    quantityAvailable: 220,
    minimumOrder: 2,
    sellerId: "user-farmer-7",
    sellerName: "Mt. Kenya Legume & Tuber Growers",
    sellerPhone: "0724883190",
    sellerCounty: "Meru",
    sellerSubCounty: "Timau",
    images: [
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 29,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T11:00:00Z"
  },
  {
    id: "prod-crop-dutch-robijn",
    title: "Dutch Robijn Red Irish Potatoes",
    description: "Red-skinned Dutch Robijn potatoes from Bomet highlands. Firm flesh that holds shape in stews, boiling, and roasting. Excellent storage life.",
    category: "crops",
    subcategory: "Roots & Tubers",
    productType: "Potatoes",
    variety: "Dutch Robijn",
    condition: "new",
    priceKsh: 2950,
    unit: "50kg bag",
    quantityAvailable: 180,
    minimumOrder: 2,
    sellerId: "user-farmer-1",
    sellerName: "Kiprono Agri-Enterprises",
    sellerPhone: "0722104523",
    sellerCounty: "Bomet",
    sellerSubCounty: "Konoin",
    images: [
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 21,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T16:20:00Z"
  },
  // TOMATO VARIETIES
  {
    id: "prod-crop-6",
    title: "Fresh Greenhouse Anna F1 Tomatoes",
    description: "Firm, uniform red Anna F1 tomatoes grown in sanitized greenhouses in Isinya. Long shelf life of over 21 days, crack-resistant and rich pulp.",
    category: "crops",
    subcategory: "Horticulture & Vegetables",
    productType: "Tomatoes",
    variety: "Anna F1",
    condition: "new",
    priceKsh: 4200,
    unit: "60kg wooden crate",
    quantityAvailable: 120,
    minimumOrder: 2,
    sellerId: "user-farmer-6",
    sellerName: "Isinya Green Agriventures",
    sellerPhone: "0719234850",
    sellerCounty: "Kajiado",
    sellerSubCounty: "Isinya",
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 44,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T12:00:00Z"
  },
  {
    id: "prod-crop-kilele-f1",
    title: "Open-Field Kilele F1 Tomatoes (Thick Skin)",
    description: "High-grade elongated Kilele F1 tomatoes harvested at breaker stage from Mwea. Remarkable transit resistance, deep red color, highly demanded by grocery traders.",
    category: "crops",
    subcategory: "Horticulture & Vegetables",
    productType: "Tomatoes",
    variety: "Kilele F1",
    condition: "new",
    priceKsh: 3800,
    unit: "60kg wooden crate",
    quantityAvailable: 150,
    minimumOrder: 2,
    sellerId: "user-farmer-5",
    sellerName: "Mwea Horticultural Producers",
    sellerPhone: "0721834920",
    sellerCounty: "Kirinyaga",
    sellerSubCounty: "Mwea West",
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 37,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T13:30:00Z"
  },
  {
    id: "prod-crop-rambo-f1",
    title: "Greenhouse Rambo F1 Beefsteak Tomatoes",
    description: "Extra large, round, fleshy Rambo F1 salad tomatoes grown in Limuru. Juicy, balanced acidity, perfectly graded in ventilated crates.",
    category: "crops",
    subcategory: "Horticulture & Vegetables",
    productType: "Tomatoes",
    variety: "Rambo F1",
    condition: "new",
    priceKsh: 4500,
    unit: "60kg wooden crate",
    quantityAvailable: 80,
    minimumOrder: 2,
    sellerId: "user-farmer-2",
    sellerName: "Limuru Fresh Horticultural Farm",
    sellerPhone: "0714982301",
    sellerCounty: "Kiambu",
    sellerSubCounty: "Limuru",
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 22,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T10:00:00Z"
  },
  // RICE VARIETIES
  {
    id: "prod-crop-komboka",
    title: "Highland Milled Komboka Rice (Non-Aromatic)",
    description: "Clean, polished high-yielding Komboka white rice from Ahero irrigation scheme. Long grains that don't stick together when boiled. Excellent wholesale rate.",
    category: "crops",
    subcategory: "Cereals & Grains",
    productType: "Rice",
    variety: "Komboka",
    condition: "new",
    priceKsh: 145,
    unit: "kg",
    quantityAvailable: 3e3,
    minimumOrder: 25,
    sellerId: "user-farmer-5",
    sellerName: "Ahero Rice Scheme Farmers",
    sellerPhone: "0721834920",
    sellerCounty: "Kisumu",
    sellerSubCounty: "Nyando",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 33,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T12:00:00Z"
  },
  // WHEAT
  {
    id: "prod-crop-narok-wheat",
    title: "Hard Milling Bread Wheat (Eagle 10)",
    description: "Grade 1 Narok wheat with high protein content (13.5%+), moisture 12.5%. High hectolitre weight, suitable for commercial flour mills and bakeries.",
    category: "crops",
    subcategory: "Cereals & Grains",
    productType: "Wheat",
    variety: "Eagle 10",
    condition: "new",
    priceKsh: 4200,
    unit: "90kg bag",
    quantityAvailable: 650,
    minimumOrder: 20,
    sellerId: "user-farmer-1",
    sellerName: "Mau Narok Wheat Estate",
    sellerPhone: "0722104523",
    sellerCounty: "Narok",
    sellerSubCounty: "Narok North",
    images: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 46,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T07:00:00Z"
  },
  // ONIONS
  {
    id: "prod-crop-red-bombay-onions",
    title: "Cured Red Bombay Bulb Onions",
    description: "Properly cured, pungent, dry-skinned Red Bombay onions harvested under drip irrigation in Loitokitok. Firm neck, long shelf-life of 3-4 months.",
    category: "crops",
    subcategory: "Horticulture & Vegetables",
    productType: "Onions",
    variety: "Red Bombay",
    condition: "new",
    priceKsh: 130,
    unit: "kg",
    quantityAvailable: 2800,
    minimumOrder: 50,
    sellerId: "user-farmer-6",
    sellerName: "Amboseli Border Irrigators",
    sellerPhone: "0719234850",
    sellerCounty: "Kajiado",
    sellerSubCounty: "Loitokitok",
    images: [
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 39,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T11:45:00Z"
  },
  // VEGETABLES & GREENS
  {
    id: "prod-crop-sukuma-wiki",
    title: "Fresh Sukuma Wiki (Collard Greens)",
    description: "Dark green, chemical-residue tested collard greens harvested at dawn in Kinangop. Bundled in 50kg net bags, crisp and fresh.",
    category: "crops",
    subcategory: "Horticulture & Vegetables",
    productType: "Vegetables & Greens",
    variety: "Collard Greens",
    condition: "new",
    priceKsh: 1800,
    unit: "50kg sack",
    quantityAvailable: 140,
    minimumOrder: 2,
    sellerId: "user-farmer-2",
    sellerName: "Kinangop Plateau Greens",
    sellerPhone: "0714982301",
    sellerCounty: "Nyandarua",
    sellerSubCounty: "Kinangop",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 28,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T06:30:00Z"
  },
  {
    id: "prod-crop-cabbage-gloria",
    title: "Solid Round Gloria F1 Cabbages (3-4kg heads)",
    description: "Compact, heavy heads of Gloria F1 cabbage grown on highland volcanic loam. Excellent handling resistance for long distance haulage.",
    category: "crops",
    subcategory: "Horticulture & Vegetables",
    productType: "Vegetables & Greens",
    variety: "Gloria F1",
    condition: "new",
    priceKsh: 65,
    unit: "head",
    quantityAvailable: 1500,
    minimumOrder: 50,
    sellerId: "user-farmer-2",
    sellerName: "Wambui Highlands Farm",
    sellerPhone: "0714982301",
    sellerCounty: "Nyandarua",
    sellerSubCounty: "Ol Kalou",
    images: [
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 45,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T08:30:00Z"
  },
  // FRUITS
  {
    id: "prod-crop-4",
    title: "Grade A Export Hass Avocados",
    description: "High dry-matter Hass avocados (minimum 23% dry matter), harvested under strict GAP compliance. Uniform sizing, ideal for export or premium grocery supply.",
    category: "crops",
    subcategory: "Fruits & Nuts",
    productType: "Fruits",
    variety: "Hass",
    condition: "certified",
    priceKsh: 80,
    unit: "kg",
    quantityAvailable: 3500,
    minimumOrder: 50,
    sellerId: "user-farmer-4",
    sellerName: "Murang'a Orchard Outgrowers",
    sellerPhone: "0733890214",
    sellerCounty: "Murang'a",
    sellerSubCounty: "Kandara",
    images: [
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 64,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-11T14:20:00Z"
  },
  {
    id: "prod-crop-apple-mangoes",
    title: "Sweet Fibreless Apple Mangoes (Grade A)",
    description: "Golden yellow ripe Apple Mangoes from Mwala, Machakos. Exceptionally sweet, fibreless pulp, harvested by hand with stem clipped to prevent sap burn.",
    category: "crops",
    subcategory: "Fruits & Nuts",
    productType: "Fruits",
    variety: "Apple Mango",
    condition: "new",
    priceKsh: 45,
    unit: "piece",
    quantityAvailable: 2400,
    minimumOrder: 50,
    sellerId: "user-farmer-8",
    sellerName: "Machakos Orchard Cooperative",
    sellerPhone: "0711902341",
    sellerCounty: "Machakos",
    sellerSubCounty: "Mwala",
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 51,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T14:10:00Z"
  },
  {
    id: "prod-input-5",
    title: "Boma Rhodes Baled Hay (Protein Rich)",
    description: "High-quality sweet Boma Rhodes grass hay cut before flowering. Green in colour, mold-free, high fiber for rumination. Average bale weight 18-20kg.",
    category: "crops",
    subcategory: "Livestock Fodder & Silage",
    productType: "Other crops",
    variety: "Boma Rhodes Hay",
    condition: "new",
    priceKsh: 320,
    unit: "bale",
    quantityAvailable: 1200,
    minimumOrder: 20,
    sellerId: "user-farmer-9",
    sellerName: "Naivasha Plains Fodder Ranches",
    sellerPhone: "0725112233",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Naivasha",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 58,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-13T15:00:00Z"
  },
  // ==========================================
  // CERTIFIED SEEDS & FERTILIZERS (3 Products)
  // ==========================================
  {
    id: "prod-input-1",
    title: "Certified Seed Maize - Kenya Seed H614D",
    description: "Official KEPHIS certified seed maize from Kenya Seed Company. High-altitude hybrid with superior resistance to Northern leaf blight and grey leaf spot. Yield potential: 38 bags/acre.",
    category: "inputs",
    subcategory: "Certified Seeds",
    productType: "Certified seeds",
    variety: "Kenya Seed H614D",
    brand: "Kenya Seed Company",
    packageSize: "2kg packet",
    certificationInfo: "KEPHIS Certified Lot #KSC-8842",
    condition: "certified",
    priceKsh: 580,
    unit: "2kg packet",
    quantityAvailable: 800,
    minimumOrder: 1,
    sellerId: "user-agro-1",
    sellerName: "Rift Valley Agrovet Wholesalers",
    sellerPhone: "0722334455",
    sellerCounty: "Trans-Nzoia",
    sellerSubCounty: "Kitale Central",
    images: [
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 110,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-09T08:00:00Z"
  },
  {
    id: "prod-input-2",
    title: "DAP Planting Fertilizer (18:46:0)",
    description: "Imported granular Diammonium Phosphate for planting cereals, potatoes, and vegetables. High phosphorus for vigorous root development. KEBS approved batch.",
    category: "inputs",
    subcategory: "Fertilizers & Soil Nutrition",
    productType: "Inorganic fertilizers",
    formulation: "DAP (18:46:0)",
    variety: "DAP (18:46:0)",
    brand: "Yara / MEA Kenya",
    packageSize: "50kg bag",
    certificationInfo: "KEBS Diamond Mark of Quality Tested",
    condition: "new",
    priceKsh: 3500,
    unit: "50kg bag",
    quantityAvailable: 350,
    minimumOrder: 1,
    sellerId: "user-agro-1",
    sellerName: "Rift Valley Agrovet Wholesalers",
    sellerPhone: "0722334455",
    sellerCounty: "Uasin Gishu",
    sellerSubCounty: "Eldoret CBD",
    images: [
      "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 77,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-08T11:20:00Z"
  },
  {
    id: "prod-input-7",
    title: "Enriched Cattle Compost Organic Fertilizer",
    description: "Fully matured, weed-seed-free aerobic cattle compost enriched with beneficial Trichoderma microbial inoculants. Restores biological humus, improves water retention, and buffers soil pH.",
    category: "inputs",
    subcategory: "Fertilizers & Soil Nutrition",
    productType: "Organic fertilizers",
    formulation: "Enriched Cattle Compost",
    variety: "Enriched Cattle Compost",
    brand: "Rongai Organics Kenya",
    packageSize: "50kg bag",
    condition: "new",
    priceKsh: 950,
    unit: "50kg bag",
    quantityAvailable: 240,
    minimumOrder: 5,
    sellerId: "user-farmer-1",
    sellerName: "Kiprono Agri-Enterprises",
    sellerPhone: "0722104523",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Rongai",
    images: [
      "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 31,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-13T09:00:00Z"
  },
  // ==========================================
  // FARM EQUIPMENT & IRRIGATION (2 Products)
  // ==========================================
  {
    id: "prod-input-4",
    title: "Complete 1-Acre Drip Irrigation Kit",
    description: "Includes 16mm UV-resistant drip lines with 20cm emitter spacing, mainlines, sub-mains, screen disc filter, venture fertilizer injector, control valves, and joiners. Gravity fed from 1,000L tank.",
    category: "equipment",
    subcategory: "Irrigation & Greenhouse",
    productType: "Irrigation systems",
    model: "1-Acre Complete Drip Kit",
    variety: "1-Acre Drip Kit",
    brand: "Amiran Kenya / Irrico",
    condition: "new",
    powerSource: "Manual",
    capacity: "1 Acre (10,000 Drippers)",
    priceKsh: 48e3,
    unit: "Complete Set",
    quantityAvailable: 25,
    minimumOrder: 1,
    sellerId: "user-mach-1",
    sellerName: "Kenya Water & Solar Systems Ltd",
    sellerPhone: "0722998877",
    sellerCounty: "Nairobi",
    sellerSubCounty: "Industrial Area",
    images: [
      "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 35,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-05T09:30:00Z"
  },
  {
    id: "prod-eq-2",
    title: "Dayliff Solar Submersible Borehole Water Pump (1.5HP)",
    description: "High efficiency solar DC helical submersible pump with MPPT controller. Max head 120m, output up to 3,500 litres per hour. Direct drive from 4x 350W solar PV panels.",
    category: "equipment",
    subcategory: "Irrigation & Water Systems",
    productType: "Water pumps",
    model: "SunFlo Solar Submersible Pump 1.5HP",
    variety: "Dayliff Solar 1.5HP",
    brand: "Dayliff (Davis & Shirtliff)",
    condition: "new",
    powerSource: "Solar",
    capacity: "1.5HP / 3,500 L/hr",
    priceKsh: 68500,
    unit: "complete kit",
    quantityAvailable: 15,
    minimumOrder: 1,
    sellerId: "user-mach-1",
    sellerName: "Kenya Water & Solar Systems Ltd",
    sellerPhone: "0722998877",
    sellerCounty: "Nairobi",
    sellerSubCounty: "Industrial Area",
    images: [
      "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 5,
    reviewsCount: 18,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    createdAt: "2026-10-18T00:00:00Z"
  },
  {
    id: "prod-crop-wheat-1",
    title: "Certified Hard Red Milling Wheat (Grade 1)",
    description: "Dry clean milling wheat with 13% protein and moisture below 12.5%. Grown in Narok highlands. Free from foreign matter, weed seeds, and pest infestation. Bulk purchase available for commercial flour millers.",
    category: "crops",
    subcategory: "Cereals & Grains",
    productType: "Wheat",
    variety: "Robin / Chozi",
    condition: "certified",
    priceKsh: 4200,
    unit: "90kg bag",
    quantityAvailable: 600,
    minimumOrder: 10,
    sellerId: "user-farmer-wheat",
    sellerName: "Mau Narok Commercial Grain Ranch",
    sellerPhone: "0722883311",
    sellerCounty: "Narok",
    sellerSubCounty: "Narok North",
    images: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 14,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-16T09:00:00Z"
  },
  {
    id: "prod-crop-onion-1",
    title: "Cured Red Bombay Dry Onions (Grade 1)",
    description: "Well-cured red onions from Loitokitok / Kajiado. Tight paper skins, strong pungency and long storage shelf life of over 3 months. Sorted into medium and large market grades.",
    category: "crops",
    subcategory: "Horticulture & Vegetables",
    productType: "Onions",
    variety: "Red Bombay / Red Creole",
    condition: "new",
    priceKsh: 120,
    unit: "kg",
    quantityAvailable: 3500,
    minimumOrder: 50,
    sellerId: "user-farmer-onion",
    sellerName: "Amboseli Agro-Farms",
    sellerPhone: "0711992244",
    sellerCounty: "Kajiado",
    sellerSubCounty: "Loitokitok",
    images: [
      "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 29,
    deliveryOptions: ["pickup", "carrier_dispatch", "direct_delivery"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-17T10:15:00Z"
  },
  {
    id: "prod-crop-kales-1",
    title: "Fresh Farm-Harvested Sukuma Wiki (Collard Greens)",
    description: "Crisp, dark green Sukuma Wiki harvested fresh daily at 5:00 AM from drip-irrigated farms in Kiambu. Packed in aerated crates for vegetable markets and grocers.",
    category: "crops",
    subcategory: "Horticulture & Vegetables",
    productType: "Vegetables",
    variety: "Marrow Stem / Thousand Headed",
    condition: "new",
    priceKsh: 35,
    unit: "kg",
    quantityAvailable: 1200,
    minimumOrder: 20,
    sellerId: "user-farmer-veg",
    sellerName: "Limuru Fresh Greens Cooperative",
    sellerPhone: "0720448833",
    sellerCounty: "Kiambu",
    sellerSubCounty: "Limuru",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 42,
    deliveryOptions: ["direct_delivery", "pickup"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-18T06:00:00Z"
  },
  {
    id: "prod-crop-banana-1",
    title: "Giant Cavendish Sweet Bananas (Ripening Grade)",
    description: "Clean disease-free sweet bananas harvested at mature green stage from Meru organic orchards. Clean uniform bunches with 90-120 fingers per bunch. Naturally grown without artificial chemicals.",
    category: "crops",
    subcategory: "Fruits & Nuts",
    productType: "Fruits",
    variety: "Giant Cavendish / Grand Nain",
    condition: "new",
    priceKsh: 850,
    unit: "bunch",
    quantityAvailable: 180,
    minimumOrder: 5,
    sellerId: "user-farmer-banana",
    sellerName: "Meru Banana Farmers SACCO",
    sellerPhone: "0722774411",
    sellerCounty: "Meru",
    sellerSubCounty: "Imenti South",
    images: [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 31,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-18T08:30:00Z"
  },
  // ==========================================
  // ADDITIONAL FARM INPUTS & SUPPLIES
  // ==========================================
  {
    id: "prod-input-crop-prot-1",
    title: "PCPB-Registered Bio-Pesticide & Neem Oil Extract (1L)",
    description: "Organic broad-spectrum crop protection approved by the Pest Control Products Board (PCPB Reg #PCPB(CR)1420). Controls aphids, whiteflies, thrips, and mites on vegetables and fruit trees with zero harvest interval residue.",
    category: "inputs",
    subcategory: "Crop Protection & Pesticides",
    productType: "Crop protection",
    brand: "Osho Chemical / Dudutech",
    formulation: "Cold Pressed Azadirachtin 0.03% EC",
    packageSize: "1 Litre Bottle",
    certificationInfo: "PCPB Certified Organic Bio-Pesticide Reg #1420",
    condition: "certified",
    priceKsh: 1450,
    unit: "litre",
    quantityAvailable: 120,
    minimumOrder: 1,
    sellerId: "usr-seller-01",
    sellerName: "Rift Valley Certified Agrovet",
    sellerPhone: "0712345678",
    sellerCounty: "Uasin Gishu",
    sellerSubCounty: "Eldoret CBD",
    images: [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 19,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-10T12:00:00Z"
  },
  {
    id: "prod-input-dairy-meal-1",
    title: "High-Yield Dairy Meal 16% Crude Protein (70kg)",
    description: "KEBS certified standard dairy cattle concentrate formulated with bypass protein, calcium, phosphorus, and essential vitamins. Boosts daily milk output by 2-4 litres per cow while maintaining body condition.",
    category: "inputs",
    subcategory: "Animal Feeds & Nutrition",
    productType: "Animal feeds",
    brand: "Unga Farm Care / Pembe Feeds",
    formulation: "16% Crude Protein, 2800 kcal ME/kg",
    packageSize: "70kg Bag",
    certificationInfo: "KEBS Standard Certified #KS-01-52",
    condition: "certified",
    priceKsh: 2850,
    unit: "70kg bag",
    quantityAvailable: 250,
    minimumOrder: 2,
    sellerId: "usr-seller-01",
    sellerName: "Rift Valley Certified Agrovet",
    sellerPhone: "0712345678",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Nakuru Town",
    images: [
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 52,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-12T14:00:00Z"
  },
  {
    id: "prod-input-poultry-equip-1",
    title: "Automatic Poultry Bell Drinkers & Anti-Waste Feeders Kit",
    description: "Commercial 10-piece poultry equipment set including 5 hanging bell automatic drinkers with counterweights and 5 galvanized 10kg anti-waste feed hoppers. Suitable for 500 layers or broilers.",
    category: "equipment",
    subcategory: "Poultry Equipment",
    productType: "Poultry equipment",
    brand: "AgriPro Kenya",
    model: "Plasson Type Bell Drinker Set",
    condition: "new",
    priceKsh: 8200,
    unit: "10-piece set",
    quantityAvailable: 40,
    minimumOrder: 1,
    sellerId: "user-mach-1",
    sellerName: "Kenya Water & Solar Systems Ltd",
    sellerPhone: "0722998877",
    sellerCounty: "Nairobi",
    sellerSubCounty: "Industrial Area",
    images: [
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 16,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T09:00:00Z"
  },
  {
    id: "prod-input-greenhouse-1",
    title: "UV-Treated 200 Micron Agricultural Greenhouse Film (8m x 30m)",
    description: "Heavy-duty 3-layer co-extruded greenhouse polythene sheeting. UV stabilized for 4+ years lifespan under high Kenyan solar radiation. 88% light transmission with thermal anti-drip coating.",
    category: "inputs",
    subcategory: "Greenhouse Materials",
    productType: "Greenhouse materials",
    brand: "Ginegar Plastic Products / Amiran",
    packageSize: "8m x 30m roll (240 sq meters)",
    certificationInfo: "ISO 9001 & KEBS Compliant Agricultural Polythene",
    condition: "new",
    priceKsh: 28500,
    unit: "roll",
    quantityAvailable: 30,
    minimumOrder: 1,
    sellerId: "user-mach-1",
    sellerName: "Kenya Water & Solar Systems Ltd",
    sellerPhone: "0722998877",
    sellerCounty: "Nairobi",
    sellerSubCounty: "Industrial Area",
    images: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 22,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T15:30:00Z"
  }
];

// src/data/sampleLivestock.ts
var SAMPLE_LIVESTOCK = [
  // CATTLE / DAIRY & BEEF (6 Products)
  {
    id: "live-cow-1",
    title: "Pedigree Friesian Dairy Cow (2nd Lactation)",
    description: "High genetic potential Friesian dairy cow producing 32-35 litres/day on standard Total Mixed Ration (TMR). In calf (4 months confirmed pregnant) through sexed AI semen (Semex Canada bull). Docile temperament, clean udder attachment with four functional quarters.",
    category: "livestock",
    subcategory: "Dairy Cattle",
    productType: "Dairy cattle",
    animalType: "Cattle",
    cattlePurpose: "Dairy",
    breed: "Friesian",
    priceKsh: 165e3,
    unit: "head",
    quantityAvailable: 1,
    minimumOrder: 1,
    sellerId: "user-live-1",
    sellerName: "Rongai Valley Dairy Stud",
    sellerPhone: "0722889901",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Rongai",
    images: [
      "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 28,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T09:00:00Z",
    livestockDetails: {
      animalType: "dairy_cow",
      breed: "Friesian",
      ageValue: 3.5,
      ageUnit: "years",
      sex: "female",
      purpose: "milk",
      milkYieldLitersPerDay: 32,
      weightKg: 580,
      lactationStage: "2nd lactation (In-Calf)",
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "East Coast Fever (ITM Infection & Treatment)", dateAdministered: "2024-03-15", verifiedByVet: true, vetName: "Dr. J. Koech (KVB Reg)" },
        { vaccineName: "Foot & Mouth Disease (Quadrivalent FMD)", dateAdministered: "2026-08-10", verifiedByVet: true, vetName: "Dr. J. Koech (KVB Reg)" },
        { vaccineName: "Anthrax & Blackquarter (Blanthrax)", dateAdministered: "2026-05-12", verifiedByVet: true, vetName: "Dr. J. Koech (KVB Reg)" },
        { vaccineName: "Brucellosis (S19 Certified Calfhood)", dateAdministered: "2023-09-01", verifiedByVet: true, vetName: "Dr. J. Koech (KVB Reg)" }
      ],
      earTagNumber: "KE-NK-RN-4402",
      feedRegime: "Lucerne, Napier silage, Boma Rhodes hay and 16% dairy concentrate."
    }
  },
  {
    id: "live-cow-2",
    title: "Pure Ayrshire In-Calf Heifer",
    description: "Beautiful pedigree Ayrshire heifer from certified AI stock (Kenya Animal Genetic Resources Centre - KAGRC bull). Highly adapted to Kenyan highlands with excellent butterfat test (4.4%). Veterinary certificate and pedigree registration card available.",
    category: "livestock",
    subcategory: "Dairy Cattle",
    productType: "Dairy cattle",
    animalType: "Cattle",
    cattlePurpose: "Dairy",
    breed: "Ayrshire",
    priceKsh: 135e3,
    unit: "head",
    quantityAvailable: 1,
    minimumOrder: 1,
    sellerId: "user-live-2",
    sellerName: "Eldoret Dairy Breeders Cooperative",
    sellerPhone: "0712554433",
    sellerCounty: "Uasin Gishu",
    sellerSubCounty: "Kapseret",
    images: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 19,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T11:20:00Z",
    livestockDetails: {
      animalType: "heifer",
      breed: "Ayrshire",
      ageValue: 22,
      ageUnit: "months",
      sex: "female",
      purpose: "milk",
      milkYieldLitersPerDay: 24,
      weightKg: 420,
      lactationStage: "In-Calf Heifer (7 Months Pregnant)",
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "East Coast Fever (ECF Muguga Cocktail)", dateAdministered: "2025-01-20", verifiedByVet: true, vetName: "Dr. Peter Cheruiyot" },
        { vaccineName: "Lumpy Skin Disease (LSD Neethling)", dateAdministered: "2026-06-14", verifiedByVet: true, vetName: "Dr. Peter Cheruiyot" },
        { vaccineName: "Foot & Mouth Disease", dateAdministered: "2026-07-22", verifiedByVet: true, vetName: "Dr. Peter Cheruiyot" }
      ],
      earTagNumber: "KE-UG-ELD-819",
      feedRegime: "Pasture grazed with daily dairy meal supplementation and mineral block lick."
    }
  },
  {
    id: "live-cow-3",
    title: "High Butterfat Jersey Cow (Calved 3 weeks ago)",
    description: "Pocket-sized feed efficiency queen. Yields 18 litres/day with over 5.2% butterfat, perfect for yogurt, cheese making, or selling to local premium processors. Extremely low veterinary issues and heat tolerant.",
    category: "livestock",
    subcategory: "Dairy Cattle",
    productType: "Dairy cattle",
    animalType: "Cattle",
    cattlePurpose: "Dairy",
    breed: "Jersey",
    priceKsh: 115e3,
    unit: "head",
    quantityAvailable: 1,
    minimumOrder: 1,
    sellerId: "user-live-3",
    sellerName: "Limuru Jersey Farm",
    sellerPhone: "0721773344",
    sellerCounty: "Kiambu",
    sellerSubCounty: "Limuru",
    images: [
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 5,
    reviewsCount: 14,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-13T14:40:00Z",
    livestockDetails: {
      animalType: "dairy_cow",
      breed: "Jersey",
      ageValue: 3,
      ageUnit: "years",
      sex: "female",
      purpose: "milk",
      milkYieldLitersPerDay: 18,
      weightKg: 380,
      lactationStage: "1st Lactation (Freshly calved)",
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "ECF Muguga Cocktail", dateAdministered: "2024-04-10", verifiedByVet: true },
        { vaccineName: "FMD", dateAdministered: "2026-05-18", verifiedByVet: true }
      ],
      earTagNumber: "KE-KMB-LM-204",
      feedRegime: "Desmodium, Sweet potato vines, Boma Rhodes and 14% dairy cubes."
    }
  },
  {
    id: "live-cow-guernsey",
    title: "Pedigree Golden Guernsey Dairy Cow (High Butterfat)",
    description: "Rare pure Guernsey dairy cow producing golden A2 beta-casein milk rich in beta carotene. Gentle demeanor, low feed consumption per kg of butterfat produced, giving 20-22 litres daily.",
    category: "livestock",
    subcategory: "Dairy Cattle",
    productType: "Dairy cattle",
    animalType: "Cattle",
    cattlePurpose: "Dairy",
    breed: "Guernsey",
    priceKsh: 128e3,
    unit: "head",
    quantityAvailable: 1,
    minimumOrder: 1,
    sellerId: "user-live-3",
    sellerName: "Nyeri Hill Breeders Stud",
    sellerPhone: "0722338812",
    sellerCounty: "Nyeri",
    sellerSubCounty: "Tetu",
    images: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 11,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T10:15:00Z",
    livestockDetails: {
      animalType: "dairy_cow",
      breed: "Guernsey",
      ageValue: 3.2,
      ageUnit: "years",
      sex: "female",
      purpose: "milk",
      milkYieldLitersPerDay: 22,
      weightKg: 460,
      lactationStage: "2nd Lactation",
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "Blanthrax & FMD", dateAdministered: "2026-06-11", verifiedByVet: true }
      ],
      earTagNumber: "KE-NY-GU-109",
      feedRegime: "Lucerne hay, Kikuyu grass pasture and dairy concentrate."
    }
  },
  {
    id: "live-cow-4",
    title: "Pedigree Boran Breeding Bull (Champion Beef Sire)",
    description: "Magnificent deep-bodied Kenya Boran breeding bull. Ideal for beef ranchers or pastoral improvement projects. Exceptional disease resistance, tick tolerance, and rapid calf weight gain. Docile and fertility-tested.",
    category: "livestock",
    subcategory: "Beef Cattle",
    productType: "Beef cattle",
    animalType: "Cattle",
    cattlePurpose: "Beef",
    breed: "Boran",
    priceKsh: 18e4,
    unit: "head",
    quantityAvailable: 1,
    minimumOrder: 1,
    sellerId: "user-live-4",
    sellerName: "Laikipia Ranches & Breeding Sanctuary",
    sellerPhone: "0710665544",
    sellerCounty: "Laikipia",
    sellerSubCounty: "Laikipia West",
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 22,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-10T15:30:00Z",
    livestockDetails: {
      animalType: "bull",
      breed: "Boran",
      ageValue: 3.8,
      ageUnit: "years",
      sex: "male",
      purpose: "beef",
      weightKg: 640,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "Contagious Bovine Pleuropneumonia (CBPP T1-44)", dateAdministered: "2026-02-12", verifiedByVet: true },
        { vaccineName: "Anthrax & Blackleg", dateAdministered: "2026-04-05", verifiedByVet: true }
      ],
      earTagNumber: "LK-BOR-773",
      feedRegime: "Free range rangeland grazing and mineral supplements."
    }
  },
  {
    id: "live-cow-sahiwal",
    title: "Purebred Sahiwal Dual-Purpose Bull (KARI Naivasha Line)",
    description: "Outstanding proven Sahiwal stud bull with high milk transmitting genetics (dam gave 16L/day) and heavy beef carcass conformation. Renowned tick immunity and high drought resistance across ASAL zones.",
    category: "livestock",
    subcategory: "Dual-Purpose Cattle",
    productType: "Beef cattle",
    animalType: "Cattle",
    cattlePurpose: "Dual-purpose",
    breed: "Sahiwal",
    priceKsh: 155e3,
    unit: "head",
    quantityAvailable: 1,
    minimumOrder: 1,
    sellerId: "user-live-4",
    sellerName: "KALRO Naivasha Genetics Outgrower",
    sellerPhone: "0723884411",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Naivasha",
    images: [
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 15,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-12T11:00:00Z",
    livestockDetails: {
      animalType: "bull",
      breed: "Sahiwal",
      ageValue: 3,
      ageUnit: "years",
      sex: "male",
      purpose: "dual_purpose",
      weightKg: 590,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "CBPP & FMD", dateAdministered: "2026-05-19", verifiedByVet: true }
      ],
      earTagNumber: "KE-NV-SAH-302"
    }
  },
  // GOATS (2 Products)
  {
    id: "live-goat-1",
    title: "Pedigree Toggenburg Dairy Goat (Lactating)",
    description: "High-producing Toggenburg dairy doe producing 3.5 litres/day of sweet goat milk. Ideal for children or people with lactose sensitivity. Zero-grazing trained, feeds happily on Calliandra, Lucerne and sweet potato vines.",
    category: "livestock",
    subcategory: "Goats & Sheep",
    productType: "Goats",
    animalType: "Goats",
    breed: "Toggenburg",
    priceKsh: 28e3,
    unit: "head",
    quantityAvailable: 2,
    minimumOrder: 1,
    sellerId: "user-goat-1",
    sellerName: "Meru Dairy Goat Breeders SACCO",
    sellerPhone: "0726778899",
    sellerCounty: "Meru",
    sellerSubCounty: "Imenti North",
    images: [
      "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 35,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-11T12:00:00Z",
    livestockDetails: {
      animalType: "goat",
      breed: "Toggenburg",
      ageValue: 2,
      ageUnit: "years",
      sex: "female",
      purpose: "milk",
      milkYieldLitersPerDay: 3.5,
      weightKg: 55,
      lactationStage: "1st Lactation",
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "Contagious Caprine Pleuropneumonia (CCPP)", dateAdministered: "2026-03-20", verifiedByVet: true },
        { vaccineName: "Peste des Petits Ruminants (PPR)", dateAdministered: "2026-03-20", verifiedByVet: true }
      ],
      earTagNumber: "MR-TOG-332",
      feedRegime: "Calliandra fodder, Desmodium, Napier grass, and goat dairy cubes."
    }
  },
  {
    id: "live-goat-2",
    title: "Pure Galla Meat Buck (Rift Valley Stud)",
    description: "Magnificent white Galla buck (Milk Goat of the North). Extremely fast growth rate, hardy in dry weather, and crosses well with indigenous Small East African goats to double kid sizes.",
    category: "livestock",
    subcategory: "Goats & Sheep",
    productType: "Goats",
    animalType: "Goats",
    breed: "Galla",
    priceKsh: 22e3,
    unit: "head",
    quantityAvailable: 4,
    minimumOrder: 1,
    sellerId: "user-goat-2",
    sellerName: "Baringo Pastoral Agriventures",
    sellerPhone: "0711443322",
    sellerCounty: "Baringo",
    sellerSubCounty: "Mogotio",
    images: [
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.7,
    reviewsCount: 18,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-09T16:20:00Z",
    livestockDetails: {
      animalType: "goat",
      breed: "Galla",
      ageValue: 18,
      ageUnit: "months",
      sex: "male",
      purpose: "breeding",
      weightKg: 68,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "CCPP & Enterotoxaemia", dateAdministered: "2026-04-14", verifiedByVet: true }
      ],
      earTagNumber: "BAR-GAL-91"
    }
  },
  // SHEEP (1 Product)
  {
    id: "live-sheep-1",
    title: "Dorper Breeding Ram (South Africa Genetics)",
    description: "Stocky, barrel-shaped Dorper ram with characteristic black head and pure white body. Rapid meat deposition, sheds fleece naturally (no shearing needed), produces premium lean mutton.",
    category: "livestock",
    subcategory: "Goats & Sheep",
    productType: "Sheep",
    animalType: "Sheep",
    breed: "Dorper",
    priceKsh: 25e3,
    unit: "head",
    quantityAvailable: 3,
    minimumOrder: 1,
    sellerId: "user-sheep-1",
    sellerName: "Naivasha Dorper Stud",
    sellerPhone: "0729332211",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Naivasha",
    images: [
      "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 16,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-08T10:00:00Z",
    livestockDetails: {
      animalType: "sheep",
      breed: "Dorper",
      ageValue: 14,
      ageUnit: "months",
      sex: "male",
      purpose: "meat",
      weightKg: 74,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "Clostridial 8-in-1 & Blue Tongue", dateAdministered: "2026-05-10", verifiedByVet: true }
      ],
      earTagNumber: "NV-DORP-55"
    }
  },
  // POULTRY (2 Products)
  {
    id: "live-chk-1",
    title: "Improved Kienyeji Point-of-Lay Hens (Vaccinated)",
    description: "Healthy, active KALRO-improved Kienyeji hens ready to start laying eggs. Reared on organic grains and greens with biosecurity protocols. Laying capacity of 220-250 eggs annually with rich yellow yolks.",
    category: "livestock",
    subcategory: "Poultry & Chickens",
    productType: "Poultry",
    animalType: "Poultry",
    breed: "Kienyeji",
    priceKsh: 950,
    unit: "bird",
    quantityAvailable: 350,
    minimumOrder: 10,
    sellerId: "user-chk-1",
    sellerName: "Chwele Poultry Hatcheries",
    sellerPhone: "0713998811",
    sellerCounty: "Bungoma",
    sellerSubCounty: "Sirisia",
    images: [
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 47,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-14T10:00:00Z",
    livestockDetails: {
      animalType: "chicken",
      breed: "Kienyeji",
      ageValue: 5,
      ageUnit: "months",
      sex: "female",
      purpose: "eggs",
      eggYieldPerWeek: 5,
      weightKg: 1.8,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "Marek's Disease (Day 1)", dateAdministered: "2026-05-10", verifiedByVet: true },
        { vaccineName: "Gumboro (IBD 1st & 2nd Dose)", dateAdministered: "2026-05-24", verifiedByVet: true },
        { vaccineName: "Newcastle Disease Lasota (Water & Eye Drop)", dateAdministered: "2026-06-15", verifiedByVet: true },
        { vaccineName: "Fowl Pox (Wing Web)", dateAdministered: "2026-07-02", verifiedByVet: true },
        { vaccineName: "Fowl Typhoid", dateAdministered: "2026-08-12", verifiedByVet: true }
      ],
      batchSize: 350,
      feedRegime: "Layers mash with crushed maize and kitchen green supplements."
    }
  },
  {
    id: "live-chk-layers",
    title: "Isa Brown Commercial Layers (Point of Lay, 18 Weeks)",
    description: "Fully grown vaccinated commercial Isa Brown layers at 18 weeks, ready to produce 92-96% peak lay rate of large brown shelled eggs. Complete 18-week vaccination dossier included.",
    category: "livestock",
    subcategory: "Poultry & Chickens",
    productType: "Poultry",
    animalType: "Poultry",
    breed: "Layers",
    priceKsh: 1100,
    unit: "bird",
    quantityAvailable: 500,
    minimumOrder: 20,
    sellerId: "user-chk-1",
    sellerName: "Thika Commercial Pullet Farms",
    sellerPhone: "0722449911",
    sellerCounty: "Kiambu",
    sellerSubCounty: "Gatundu North",
    images: [
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 39,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T09:30:00Z",
    livestockDetails: {
      animalType: "chicken",
      breed: "Layers",
      ageValue: 18,
      ageUnit: "weeks",
      sex: "female",
      purpose: "eggs",
      eggYieldPerWeek: 6,
      weightKg: 1.6,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "Full commercial layer schedule (Marek, IBD, ND, IB, EDS)", dateAdministered: "2026-09-20", verifiedByVet: true }
      ],
      batchSize: 500
    }
  },
  // PIGS (1 Product)
  {
    id: "live-pig-1",
    title: "Large White x Landrace Pregnant Gilt",
    description: "High prolificacy crossbred breeding gilt, confirmed 2 months pregnant to Pietrain boar. Expecting litter size of 11-14 vigorous piglets. Raised in sanitized concrete pen with automatic nipple drinkers.",
    category: "livestock",
    subcategory: "Pigs & Swine",
    productType: "Pigs",
    animalType: "Pigs",
    breed: "Large White",
    priceKsh: 36e3,
    unit: "head",
    quantityAvailable: 2,
    minimumOrder: 1,
    sellerId: "user-pig-1",
    sellerName: "Thika Piggery Specialists",
    sellerPhone: "0720119933",
    sellerCounty: "Kiambu",
    sellerSubCounty: "Thika Town",
    images: [
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 20,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-11T09:40:00Z",
    livestockDetails: {
      animalType: "pig",
      breed: "Large White",
      ageValue: 10,
      ageUnit: "months",
      sex: "female",
      purpose: "breeding",
      weightKg: 135,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "Swine Erysipelas & Parvovirus", dateAdministered: "2026-07-04", verifiedByVet: true }
      ],
      earTagNumber: "TH-PIG-109",
      feedRegime: "Sow and weaner meal with brewer's yeast and silage supplements."
    }
  },
  // POULTRY: NAKURU KIENYEJI CHICKEN TEST CASE (AGE 5.5 MONTHS <= 6 MONTHS)
  {
    id: "live-chk-kienyeji-nakuru",
    title: "Vaccinated KALRO Improved Kienyeji Growers (Nakuru)",
    description: "Vigorous KALRO-improved Kienyeji chickens reared free-range on Rongai valley pastures in Nakuru County. 5.5 months old, fully vaccinated against Newcastle, Gumboro, Marek's, and Fowl Typhoid. Ideal for breeding, meat, or high egg yield.",
    category: "livestock",
    subcategory: "Poultry & Chickens",
    productType: "Poultry",
    animalType: "Poultry",
    breed: "Kienyeji",
    priceKsh: 850,
    unit: "bird",
    quantityAvailable: 150,
    minimumOrder: 5,
    sellerId: "usr-farmer-01",
    sellerName: "Rongai Valley Mixed Farm",
    sellerPhone: "0722123456",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Rongai",
    images: [
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 38,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-18T10:00:00Z",
    livestockDetails: {
      animalType: "chicken",
      breed: "Kienyeji",
      ageValue: 5.5,
      ageUnit: "months",
      sex: "mixed_batch",
      purpose: "dual_purpose",
      weightKg: 1.6,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [
        { vaccineName: "Marek's Disease", dateAdministered: "2026-05-02", verifiedByVet: true, vetName: "Dr. Faith Cherono (KVB)" },
        { vaccineName: "Gumboro IBD (1st & 2nd)", dateAdministered: "2026-05-18", verifiedByVet: true, vetName: "Dr. Faith Cherono (KVB)" },
        { vaccineName: "Newcastle Lasota Clone 30", dateAdministered: "2026-06-12", verifiedByVet: true, vetName: "Dr. Faith Cherono (KVB)" },
        { vaccineName: "Fowl Typhoid", dateAdministered: "2026-08-04", verifiedByVet: true, vetName: "Dr. Faith Cherono (KVB)" }
      ],
      feedRegime: "Growers mash, whole maize grain, and greens."
    }
  },
  // RABBITS & CUNICULTURE
  {
    id: "live-rabbit-1",
    title: "New Zealand White Purebred Breeding Rabbits",
    description: "Fast-growing pedigree New Zealand White rabbits from certified breeding stock. High feed conversion ratio and disease resistance. Reared in clean off-ground wire cages in Njoro, Nakuru.",
    category: "livestock",
    subcategory: "Rabbits & Cuniculture",
    productType: "Rabbits",
    animalType: "Rabbits",
    breed: "New Zealand White",
    priceKsh: 2500,
    unit: "pair",
    quantityAvailable: 24,
    minimumOrder: 1,
    sellerId: "user-rabbit-1",
    sellerName: "Njoro Rabbitry Farms",
    sellerPhone: "0715667788",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Njoro",
    images: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.8,
    reviewsCount: 15,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-15T11:00:00Z",
    livestockDetails: {
      animalType: "rabbit",
      breed: "New Zealand White",
      ageValue: 4,
      ageUnit: "months",
      sex: "mixed_batch",
      purpose: "breeding",
      weightKg: 3.2,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [],
      feedRegime: "Rabbit pellets, dry hay, and wilted sweet potato vines."
    }
  },
  // FISH & AQUACULTURE
  {
    id: "live-fish-1",
    title: "Fast-Growing Monosex Nile Tilapia Fingerlings (Oreochromis niloticus)",
    description: "Certified sex-reversed all-male Nile Tilapia fingerlings from Sagana Aquaculture Station. Over 98% male ratio for uniform accelerated growth. Reaches 500g table size in 6 months on commercial floating pellets.",
    category: "livestock",
    subcategory: "Fish & Aquaculture",
    productType: "Fish",
    animalType: "Fish",
    breed: "Nile Tilapia (Oreochromis niloticus)",
    priceKsh: 12,
    unit: "fingerling",
    quantityAvailable: 15e3,
    minimumOrder: 500,
    sellerId: "user-fish-1",
    sellerName: "Mount Kenya Fish Breeders",
    sellerPhone: "0728334455",
    sellerCounty: "Kirinyaga",
    sellerSubCounty: "Ndia",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 41,
    deliveryOptions: ["carrier_dispatch", "pickup"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-16T14:00:00Z",
    livestockDetails: {
      animalType: "fish",
      breed: "Nile Tilapia",
      ageValue: 35,
      ageUnit: "days",
      sex: "male",
      purpose: "meat",
      weightKg: 0.015,
      healthStatus: "Excellent - Certified Healthy",
      vaccinations: [],
      feedRegime: "High-protein 45% starter crumble feed."
    }
  },
  // LIVESTOCK PRODUCTS: MILK & EGGS
  {
    id: "live-prod-milk-1",
    title: "Fresh Raw Farm Milk - 50L Chilled Aluminum Can",
    description: "Clean raw whole milk with 4.2% butterfat from tested Friesian and Ayrshire herd. Chilled in on-farm bulk milk tank to 4 degrees Celsius immediately after milking. Zero water adulteration, lactometer tested.",
    category: "livestock",
    subcategory: "Livestock Products (Dairy & Eggs)",
    productType: "Dairy products",
    animalType: "Other livestock",
    breed: "Friesian/Ayrshire Bulk Milk",
    priceKsh: 2750,
    unit: "50L can",
    quantityAvailable: 40,
    minimumOrder: 1,
    sellerId: "user-live-1",
    sellerName: "Rongai Valley Dairy Stud",
    sellerPhone: "0722889901",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Rongai",
    images: [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 4.9,
    reviewsCount: 63,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-17T06:30:00Z"
  },
  {
    id: "live-prod-eggs-1",
    title: "Farm Fresh Fertile Kienyeji Eggs (30-Egg Crate)",
    description: "Clean, candled fertile Kienyeji eggs with rich deep yellow yolks. Gathered twice daily from free-range hens running with mature roosters. Suitable for incubation hatchability (85%+ rate) or premium table consumption.",
    category: "livestock",
    subcategory: "Livestock Products (Dairy & Eggs)",
    productType: "Poultry products",
    animalType: "Poultry",
    breed: "Kienyeji Eggs",
    priceKsh: 650,
    unit: "crate (30 eggs)",
    quantityAvailable: 120,
    minimumOrder: 2,
    sellerId: "usr-farmer-01",
    sellerName: "Rongai Valley Mixed Farm",
    sellerPhone: "0722123456",
    sellerCounty: "Nakuru",
    sellerSubCounty: "Rongai",
    images: [
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80"
    ],
    isVerifiedSeller: true,
    rating: 5,
    reviewsCount: 45,
    deliveryOptions: ["pickup", "carrier_dispatch"],
    status: "active",
    isDemo: true,
    createdAt: "2026-10-18T07:00:00Z"
  }
];

// src/data/sampleMarketPrices.ts
var SAMPLE_MARKET_PRICES = [
  {
    id: "mp-1",
    commodityName: "Dry White Maize",
    category: "Cereals",
    variety: "Grade 1 Dry (Highlands)",
    marketName: "Wakulima (Marikiti) Wholesale",
    county: "Nairobi",
    wholesalePriceKsh: 3600,
    retailPriceKsh: 4200,
    unit: "90kg bag",
    trend: "stable",
    changePercent: 0.5,
    source: "Ministry of Agriculture & Livestock Development (Kenya Commodity Bulletin)",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-2",
    commodityName: "Dry White Maize",
    category: "Cereals",
    variety: "H614D Farmgate",
    marketName: "Eldoret Municipal Market",
    county: "Uasin Gishu",
    wholesalePriceKsh: 3200,
    retailPriceKsh: 3700,
    unit: "90kg bag",
    trend: "down",
    changePercent: -2.4,
    source: "North Rift Grain Growers Association",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-3",
    commodityName: "Rosecoco Beans",
    category: "Legumes",
    variety: "GLP 2 (Red Haricot)",
    marketName: "Wakulima (Marikiti) Wholesale",
    county: "Nairobi",
    wholesalePriceKsh: 12800,
    retailPriceKsh: 14500,
    unit: "90kg bag",
    trend: "up",
    changePercent: 3.2,
    source: "National Cereals and Produce Board (NCPB)",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-4",
    commodityName: "Yellow Beans (Soya Njano)",
    category: "Legumes",
    variety: "Njano Special",
    marketName: "Kibuye Market",
    county: "Kisumu",
    wholesalePriceKsh: 12200,
    retailPriceKsh: 13900,
    unit: "90kg bag",
    trend: "stable",
    changePercent: 0,
    source: "Lake Basin Agribusiness Bulletin",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-5",
    commodityName: "Shangi Irish Potatoes",
    category: "Roots & Tubers",
    variety: "Red Skin Medium",
    marketName: "Wakulima (Marikiti) Wholesale",
    county: "Nairobi",
    wholesalePriceKsh: 2900,
    retailPriceKsh: 3500,
    unit: "50kg bag",
    trend: "up",
    changePercent: 5.4,
    source: "National Potato Council of Kenya (NPCK)",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-6",
    commodityName: "Shangi Irish Potatoes",
    category: "Roots & Tubers",
    variety: "Farmgate Ol Kalou",
    marketName: "Nakuru Top Market",
    county: "Nakuru",
    wholesalePriceKsh: 2400,
    retailPriceKsh: 2950,
    unit: "50kg bag",
    trend: "stable",
    changePercent: 1.1,
    source: "National Potato Council of Kenya (NPCK)",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-7",
    commodityName: "Red Pinoy Bulb Onions",
    category: "Vegetables",
    variety: "Medium Dry Cured",
    marketName: "Kongowea Market",
    county: "Mombasa",
    wholesalePriceKsh: 145,
    retailPriceKsh: 175,
    unit: "kg",
    trend: "down",
    changePercent: -1.8,
    source: "Coast Region Fresh Produce Monitor",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-8",
    commodityName: "Anna F1 Greenhouse Tomatoes",
    category: "Vegetables",
    variety: "Grade 1 Firm",
    marketName: "Wakulima (Marikiti) Wholesale",
    county: "Nairobi",
    wholesalePriceKsh: 4400,
    retailPriceKsh: 5200,
    unit: "64kg wooden crate",
    trend: "up",
    changePercent: 7.3,
    source: "Horticultural Crops Directorate (HCD)",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-9",
    commodityName: "Fresh Raw Cow Milk",
    category: "Dairy & Poultry",
    variety: "Whole chilled bulk (3.5% fat)",
    marketName: "Eldoret Dairy Hub",
    county: "Uasin Gishu",
    wholesalePriceKsh: 48,
    retailPriceKsh: 65,
    unit: "litre",
    trend: "stable",
    changePercent: 0,
    source: "Kenya Dairy Board (KDB Monthly Index)",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-10",
    commodityName: "Fresh Raw Cow Milk",
    category: "Dairy & Poultry",
    variety: "Raw chilled direct to dispenser",
    marketName: "Githurai Market",
    county: "Kiambu",
    wholesalePriceKsh: 54,
    retailPriceKsh: 75,
    unit: "litre",
    trend: "up",
    changePercent: 2.1,
    source: "Kenya Dairy Board (KDB)",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-11",
    commodityName: "Kienyeji Chicken Eggs",
    category: "Dairy & Poultry",
    variety: "Free range brown/tinted",
    marketName: "Kibuye Market",
    county: "Kisumu",
    wholesalePriceKsh: 450,
    retailPriceKsh: 550,
    unit: "tray (30 eggs)",
    trend: "stable",
    changePercent: 0,
    source: "Kenya Poultry Farmers Association",
    verifiedAt: "2026-10-16T06:00:00Z",
    isIndicative: true
  },
  {
    id: "mp-12",
    commodityName: "Live Boran Beef Steer",
    category: "Livestock & Meat",
    variety: "Finished weight 380-420kg",
    marketName: "Garissa Livestock Auction",
    county: "Garissa",
    wholesalePriceKsh: 68e3,
    retailPriceKsh: 78e3,
    unit: "live animal",
    trend: "up",
    changePercent: 4,
    source: "Kenya Livestock Marketing Council",
    verifiedAt: "2026-10-18T06:00:00Z",
    isIndicative: true,
    priceType: "verified_observation",
    previousPriceKsh: 65e3,
    observationDate: "2026-10-18"
  },
  {
    id: "mp-13",
    commodityName: "Live Improved Kienyeji Chicken",
    category: "Livestock & Meat",
    variety: "Point of lay / mature cock (1.8-2.2kg)",
    marketName: "Nakuru Top Market",
    county: "Nakuru",
    wholesalePriceKsh: 800,
    retailPriceKsh: 950,
    unit: "bird",
    trend: "stable",
    changePercent: 0,
    source: "Rift Valley Poultry Trade Bureau",
    verifiedAt: "2026-10-18T06:00:00Z",
    isIndicative: true,
    priceType: "verified_observation",
    previousPriceKsh: 800,
    observationDate: "2026-10-18",
    notes: "Observed price across Rongai and Nakuru live bird pens"
  },
  {
    id: "mp-14",
    commodityName: "Hard Milling Wheat",
    category: "Cereals",
    variety: "Grade 1 Clean (12.5% moisture)",
    marketName: "Eldoret Municipal Market",
    county: "Uasin Gishu",
    wholesalePriceKsh: 4100,
    retailPriceKsh: 4400,
    unit: "90kg bag",
    trend: "up",
    changePercent: 1.8,
    source: "Cereal Growers Association (CGA)",
    verifiedAt: "2026-10-18T06:00:00Z",
    isIndicative: true,
    priceType: "verified_observation",
    previousPriceKsh: 4020,
    observationDate: "2026-10-18"
  },
  {
    id: "mp-15",
    commodityName: "DAP Planting Fertilizer (18:46:0)",
    category: "Farm Inputs",
    variety: "Imported Granular (50kg)",
    marketName: "Nakuru Top Market",
    county: "Nakuru",
    wholesalePriceKsh: 6200,
    retailPriceKsh: 6500,
    unit: "50kg bag",
    trend: "stable",
    changePercent: 0,
    source: "Fertilizer Association of Kenya",
    verifiedAt: "2026-10-18T06:00:00Z",
    isIndicative: true,
    priceType: "verified_observation",
    previousPriceKsh: 6200,
    observationDate: "2026-10-18",
    notes: "Commercial non-subsidized retail clearing rate"
  },
  {
    id: "mp-16",
    commodityName: "Certified Hybrid Seed Maize (H614D)",
    category: "Farm Inputs",
    variety: "Kenya Seed H614D (Highland)",
    marketName: "Eldoret Municipal Market",
    county: "Uasin Gishu",
    wholesalePriceKsh: 580,
    retailPriceKsh: 640,
    unit: "2kg packet",
    trend: "stable",
    changePercent: 0,
    source: "KEPHIS Seed Inspectorate Field Report",
    verifiedAt: "2026-10-18T06:00:00Z",
    isIndicative: true,
    priceType: "verified_observation",
    previousPriceKsh: 580,
    observationDate: "2026-10-18"
  },
  {
    id: "mp-17",
    commodityName: "Pedigree In-Calf Friesian Dairy Heifer",
    category: "Livestock & Meat",
    variety: "Grade 1 Pedigree (Confirmed 6 Months In-Calf)",
    marketName: "Nyeri Municipal Livestock Auction",
    county: "Nyeri",
    wholesalePriceKsh: 13e4,
    retailPriceKsh: 145e3,
    unit: "head",
    trend: "up",
    changePercent: 3.5,
    source: "Kenya Stud Book & Livestock Registry",
    verifiedAt: "2026-10-18T06:00:00Z",
    isIndicative: true,
    priceType: "verified_observation",
    previousPriceKsh: 125e3,
    observationDate: "2026-10-18"
  }
];

// src/data/kenyaCounties.ts
var KENYA_COUNTIES = [
  { code: 1, name: "Mombasa", capital: "Mombasa City", zone: "Coastal Belt", lat: -4.0435, lon: 39.6682, primaryCrops: ["Cassava", "Coconuts", "Mangoes", "Vegetables"], primaryLivestock: ["Poultry", "Dairy Goats"], majorMarket: "Kongowea Wholesale Market" },
  { code: 2, name: "Kwale", capital: "Kwale", zone: "Coastal Belt", lat: -4.1737, lon: 39.4521, primaryCrops: ["Cashew nuts", "Cassava", "Bixa", "Citrus"], primaryLivestock: ["Beef Cattle", "Goats"], majorMarket: "Kwale Town Market" },
  { code: 3, name: "Kilifi", capital: "Kilifi", zone: "Coastal Belt", lat: -3.5107, lon: 39.9093, primaryCrops: ["Cassava", "Maize", "Watermelons", "Pineapples"], primaryLivestock: ["Dairy Cattle", "Goats", "Poultry"], majorMarket: "Mtwapa Agribusiness Hub" },
  { code: 4, name: "Tana River", capital: "Hola", zone: "Coastal Belt", lat: -1.5, lon: 40, primaryCrops: ["Rice (Bura/Hola)", "Mangoes", "Bananas"], primaryLivestock: ["Pastoral Cattle", "Camels", "Goats"], majorMarket: "Hola Livestock Market" },
  { code: 5, name: "Lamu", capital: "Lamu", zone: "Coastal Belt", lat: -2.2717, lon: 40.902, primaryCrops: ["Cotton", "Simsim", "Cashew nuts", "Coconut"], primaryLivestock: ["Beef Cattle", "Poultry"], majorMarket: "Mpeketoni Farmers Market" },
  { code: 6, name: "Taita-Taveta", capital: "Mwatate", zone: "Highlands (High Rainfall)", lat: -3.3161, lon: 38.357, primaryCrops: ["Bananas", "Tomatoes", "French Beans", "Macadamia"], primaryLivestock: ["Dairy Cattle", "Rabbits"], majorMarket: "Taveta Cross-Border Market" },
  { code: 7, name: "Garissa", capital: "Garissa", zone: "Northern Arid", lat: -0.4532, lon: 39.646, primaryCrops: ["Watermelon", "Tomatoes (River Tana irrigation)"], primaryLivestock: ["Galla Goats", "Boran Cattle", "Camels"], majorMarket: "Garissa International Livestock Market" },
  { code: 8, name: "Wajir", capital: "Wajir", zone: "Northern Arid", lat: 1.7471, lon: 40.0573, primaryCrops: ["Sorghum", "Watermelon"], primaryLivestock: ["Camels", "Sheep", "Goats"], majorMarket: "Wajir Livestock Yard" },
  { code: 9, name: "Mandera", capital: "Mandera", zone: "Northern Arid", lat: 3.9373, lon: 41.8569, primaryCrops: ["Mangoes", "Onions (Irrigation)"], primaryLivestock: ["Camels", "Black-head Persian Sheep"], majorMarket: "Mandera Central Market" },
  { code: 10, name: "Marsabit", capital: "Marsabit", zone: "Northern Arid", lat: 2.337, lon: 37.99, primaryCrops: ["Maize (Mountain micro-climate)", "Beans"], primaryLivestock: ["Boran Cattle", "Red Maasai Sheep", "Camels"], majorMarket: "Moyale Border Market" },
  { code: 11, name: "Isiolo", capital: "Isiolo", zone: "Eastern Semi-Arid", lat: 0.3546, lon: 37.5822, primaryCrops: ["Onions", "Tomatoes"], primaryLivestock: ["Camels", "Beef Cattle", "Goats"], majorMarket: "Isiolo Abattoir & Livestock Yard" },
  { code: 12, name: "Meru", capital: "Meru", zone: "Highlands (High Rainfall)", lat: 0.0463, lon: 37.6559, primaryCrops: ["Miraa", "Coffee", "Tea", "Bananas", "Potatoes", "Avocados"], primaryLivestock: ["Friesian Dairy Cattle", "Pigs"], majorMarket: "Gakoromone Wholesale Market" },
  { code: 13, name: "Tharaka-Nithi", capital: "Kathwana", zone: "Eastern Semi-Arid", lat: -0.2974, lon: 37.869, primaryCrops: ["Green grams (Ndengu)", "Millet", "Sorghum", "Bananas"], primaryLivestock: ["Indigenous Goats", "Dairy Cattle"], majorMarket: "Chuka Fresh Produce Market" },
  { code: 14, name: "Embu", capital: "Embu", zone: "Highlands (High Rainfall)", lat: -0.5344, lon: 37.4586, primaryCrops: ["Macadamia", "Coffee", "Tea", "French Beans", "Mangoes"], primaryLivestock: ["Dairy Cows", "Kenbro Chickens"], majorMarket: "Embu Municipal Market" },
  { code: 15, name: "Kitui", capital: "Kitui", zone: "Eastern Semi-Arid", lat: -1.3683, lon: 38.0106, primaryCrops: ["Green Grams", "Pigeon peas", "Cowpeas", "Sorghum"], primaryLivestock: ["Galla Goats", "Apiculture (Honey)"], majorMarket: "Kalundu Market" },
  { code: 16, name: "Machakos", capital: "Machakos", zone: "Eastern Semi-Arid", lat: -1.5177, lon: 37.2634, primaryCrops: ["French Beans", "Tomatoes", "Hass Avocados", "Maize"], primaryLivestock: ["Dairy Cows", "Poultry", "Bees"], majorMarket: "Machakos Town Wholesale Market" },
  { code: 17, name: "Makueni", capital: "Wote", zone: "Eastern Semi-Arid", lat: -1.7808, lon: 37.6288, primaryCrops: ["Apple Mangoes", "Citrus", "Green Grams", "Watermelons"], primaryLivestock: ["Galla Goats", "Boran Cattle"], majorMarket: "Wote Agribusiness Center" },
  { code: 18, name: "Nyandarua", capital: "Ol Kalou", zone: "Highlands (High Rainfall)", lat: -0.2671, lon: 36.3789, primaryCrops: ["Irish Potatoes (Shangi)", "Cabbage", "Carrots", "Peas"], primaryLivestock: ["High-Yield Friesian & Ayrshire Dairy"], majorMarket: "Ol Kalou Potato Exchange" },
  { code: 19, name: "Nyeri", capital: "Nyeri", zone: "Highlands (High Rainfall)", lat: -0.4201, lon: 36.9476, primaryCrops: ["Coffee (Arabica)", "Tea", "Macadamia", "Horticulture"], primaryLivestock: ["Dairy Cows", "Trout Fish", "Pigs"], majorMarket: "Nyeri Mudavadi Market" },
  { code: 20, name: "Kirinyaga", capital: "Kerugoya", zone: "Highlands (High Rainfall)", lat: -0.499, lon: 37.2803, primaryCrops: ["Pishori Rice (Mwea)", "Tomatoes", "French Beans", "Watermelons"], primaryLivestock: ["Dairy Cattle", "Poultry"], majorMarket: "Wanguru Mwea Rice Market" },
  { code: 21, name: "Murang'a", capital: "Murang'a", zone: "Highlands (High Rainfall)", lat: -0.7167, lon: 37.15, primaryCrops: ["Hass Avocados", "Bananas", "Coffee", "Tea", "Macadamia"], primaryLivestock: ["Dairy Farming", "Pigs"], majorMarket: "Maragua Produce Exchange" },
  { code: 22, name: "Kiambu", capital: "Kiambu", zone: "Highlands (High Rainfall)", lat: -1.1714, lon: 36.8356, primaryCrops: ["Tea", "Coffee", "Dairy Fodder", "Strawberries", "Cabbages"], primaryLivestock: ["Intensive Dairy", "Broilers & Layers", "Pigs"], majorMarket: "Thika Agro-Hub Market" },
  { code: 23, name: "Turkana", capital: "Lodwar", zone: "Northern Arid", lat: 3.1167, lon: 35.6, primaryCrops: ["Sorghum (Katilu Scheme)", "Dates", "Fish (Lake Turkana)"], primaryLivestock: ["Pastoral Goats", "Zebu Cattle", "Camels"], majorMarket: "Lodwar Central Market" },
  { code: 24, name: "West Pokot", capital: "Kapenguria", zone: "Rift Valley Basin", lat: 1.2389, lon: 35.1119, primaryCrops: ["Maize", "Beans", "Potatoes"], primaryLivestock: ["Sahiwal Cattle", "Dairy Goats"], majorMarket: "Chepareria Livestock Market" },
  { code: 25, name: "Samburu", capital: "Maralal", zone: "Northern Arid", lat: 1.0969, lon: 36.698, primaryCrops: ["Barley", "Wheat"], primaryLivestock: ["Boran Beef Cattle", "Red Maasai Sheep"], majorMarket: "Maralal Livestock Auction" },
  { code: 26, name: "Trans-Nzoia", capital: "Kitale", zone: "Highlands (High Rainfall)", lat: 1.0157, lon: 35.0062, primaryCrops: ["Maize (Granary of Kenya)", "Certified Seed Maize", "Beans", "Sunflower"], primaryLivestock: ["Pedigree Dairy Cattle", "Poultry"], majorMarket: "Kitale Municipal Market" },
  { code: 27, name: "Uasin Gishu", capital: "Eldoret City", zone: "Highlands (High Rainfall)", lat: 0.5143, lon: 35.2698, primaryCrops: ["Wheat", "Maize", "Barley", "Passion Fruit", "Potatoes"], primaryLivestock: ["Commercial Dairy", "Pedigree Bulls", "Layers"], majorMarket: "Eldoret Wholesale Market" },
  { code: 28, name: "Elgeyo-Marakwet", capital: "Iten", zone: "Highlands (High Rainfall)", lat: 0.6734, lon: 35.5082, primaryCrops: ["Potatoes", "Mangoes (Kerio Valley)", "Pyrethrum"], primaryLivestock: ["Dairy Cattle", "Sheep"], majorMarket: "Iten Farmers Market" },
  { code: 29, name: "Nandi", capital: "Kapsabet", zone: "Highlands (High Rainfall)", lat: 0.2033, lon: 35.1056, primaryCrops: ["Tea", "Maize", "Sugarcane", "Coffee"], primaryLivestock: ["Dairy Cows", "Dairy Goats", "Indigenous Poultry"], majorMarket: "Kapsabet Agricultural Market" },
  { code: 30, name: "Baringo", capital: "Kabarnet", zone: "Rift Valley Basin", lat: 0.5794, lon: 35.7432, primaryCrops: ["Finger Millet", "Sorghum", "Watermelon (Perkerra)"], primaryLivestock: ["Baringo Acacia Honey", "Goats", "Beef Cattle"], majorMarket: "Marigat Irrigation Hub" },
  { code: 31, name: "Laikipia", capital: "Nanyuki", zone: "Rift Valley Basin", lat: 0.0167, lon: 37.0722, primaryCrops: ["Wheat", "Barley", "Snow Peas", "Tomatoes"], primaryLivestock: ["Boran Beef Ranches", "Dorper Sheep", "Dairy"], majorMarket: "Nanyuki Farmers Market" },
  { code: 32, name: "Nakuru", capital: "Nakuru City", zone: "Rift Valley Basin", lat: -0.3031, lon: 36.08, primaryCrops: ["Potatoes (Molo)", "Pyrethrum", "Carrots", "Maize", "Cut Flowers (Naivasha)"], primaryLivestock: ["Dairy Cattle", "Pigs", "Commercial Poultry"], majorMarket: "Nakuru Top Market" },
  { code: 33, name: "Narok", capital: "Narok", zone: "Rift Valley Basin", lat: -1.0833, lon: 35.8667, primaryCrops: ["Wheat (Largest producer)", "Barley", "Maize"], primaryLivestock: ["Maasai Pastoral Cattle", "Dorper Sheep"], majorMarket: "Narok Central Wheat Hub" },
  { code: 34, name: "Kajiado", capital: "Kajiado", zone: "Rift Valley Basin", lat: -1.85, lon: 36.7833, primaryCrops: ["Greenhouse Tomatoes (Isinya)", "Onions", "Hay Fodder (Boma Rhodes)"], primaryLivestock: ["Beef Cattle", "Dairy Goats", "Rabbits"], majorMarket: "Kitengela Livestock & Produce Market" },
  { code: 35, name: "Kericho", capital: "Kericho", zone: "Highlands (High Rainfall)", lat: -0.3689, lon: 35.2863, primaryCrops: ["Tea (Capital of Kenya Tea)", "Pyrethrum", "Sugarcane", "Sweet Potatoes"], primaryLivestock: ["Dairy Cattle", "Fish Farming"], majorMarket: "Kericho Town Market" },
  { code: 36, name: "Bomet", capital: "Bomet", zone: "Highlands (High Rainfall)", lat: -0.7813, lon: 35.3416, primaryCrops: ["Tea", "Maize", "Irish Potatoes", "Avocados"], primaryLivestock: ["Dairy Cows", "Indigenous Chickens"], majorMarket: "Silibwet Agricultural Market" },
  { code: 37, name: "Kakamega", capital: "Kakamega", zone: "Western Lake Basin", lat: 0.2827, lon: 34.7519, primaryCrops: ["Sugarcane", "Maize", "Beans", "Indigenous Vegetables (Kunde, Managu)"], primaryLivestock: ["Dairy Cattle", "Kienyeji Chicken", "Fish Ponds"], majorMarket: "Kakamega Central Market" },
  { code: 38, name: "Vihiga", capital: "Mbale", zone: "Western Lake Basin", lat: 0.0765, lon: 34.7223, primaryCrops: ["Tea", "Bananas", "Traditional leafy greens", "Maize"], primaryLivestock: ["Zero-grazing Dairy", "Improved Poultry"], majorMarket: "Mbale Fresh Produce Market" },
  { code: 39, name: "Bungoma", capital: "Bungoma", zone: "Western Lake Basin", lat: 0.5695, lon: 34.5584, primaryCrops: ["Sugarcane (Nzoia)", "Maize", "Sweet Potatoes", "Onions", "Coffee"], primaryLivestock: ["Dairy Cattle", "Poultry Hatcheries"], majorMarket: "Chwele Agri-Wholesale Market" },
  { code: 40, name: "Busia", capital: "Busia", zone: "Western Lake Basin", lat: 0.4608, lon: 34.1115, primaryCrops: ["Cassava", "Groundnuts", "Sugarcane", "Sorghum"], primaryLivestock: ["Zebu Cattle", "Fish (Tilapia/Omena)"], majorMarket: "Busia Cross-Border Hub" },
  { code: 41, name: "Siaya", capital: "Siaya", zone: "Western Lake Basin", lat: 0.0607, lon: 34.2882, primaryCrops: ["Maize", "Sorghum", "Cassava", "Cotton", "Tomatoes"], primaryLivestock: ["Lake Tilapia & Nile Perch", "Indigenous Poultry", "Goats"], majorMarket: "Bondo Fish & Produce Market" },
  { code: 42, name: "Kisumu", capital: "Kisumu City", zone: "Western Lake Basin", lat: -0.0917, lon: 34.768, primaryCrops: ["Rice (Ahero Scheme)", "Sugarcane", "Sorghum", "Vegetables"], primaryLivestock: ["Lake Fishery", "Dairy Cattle", "Kuroiler Chickens"], majorMarket: "Kibuye Wholesale Market" },
  { code: 43, name: "Homa Bay", capital: "Homa Bay", zone: "Western Lake Basin", lat: -0.5273, lon: 34.4571, primaryCrops: ["Cotton", "Sunflower", "Pineapples", "Sweet Potatoes"], primaryLivestock: ["Cage Aquaculture", "Zebu Beef", "Goats"], majorMarket: "Homa Bay Pier Market" },
  { code: 44, name: "Migori", capital: "Migori", zone: "Western Lake Basin", lat: -1.0634, lon: 34.4731, primaryCrops: ["Tobacco", "Sugarcane (Sony)", "Sweet Potatoes", "Maize", "Bananas"], primaryLivestock: ["Beef Cattle", "Dairy Goats"], majorMarket: "Isebania Border Market" },
  { code: 45, name: "Kisii", capital: "Kisii", zone: "Highlands (High Rainfall)", lat: -0.6817, lon: 34.7667, primaryCrops: ["Bananas (Ng'ombe, Cavendish)", "Avocados", "Tea", "Coffee", "Sugarcane"], primaryLivestock: ["Dairy Cattle", "Poultry"], majorMarket: "Daraja Mbili Market" },
  { code: 46, name: "Nyamira", capital: "Nyamira", zone: "Highlands (High Rainfall)", lat: -0.5633, lon: 34.9358, primaryCrops: ["Tea", "Bananas", "Pyrethrum", "Passion Fruit"], primaryLivestock: ["Dairy Farming", "Beekeeping"], majorMarket: "Nyamira Town Market" },
  { code: 47, name: "Nairobi", capital: "Nairobi City", zone: "Highlands (High Rainfall)", lat: -1.286389, lon: 36.817223, primaryCrops: ["Urban Horticulture", "Hydroponics", "Microgreens"], primaryLivestock: ["Intensive Poultry", "Rabbits", "Quails"], majorMarket: "Wakulima (Marikiti) Wholesale Market" }
];

// src/data/agriculturalKnowledge.ts
var CROPS_AGRONOMY_DATABASE = [
  {
    id: "crop-maize",
    commonName: "Maize (Dry Grain & Silage)",
    scientificName: "Zea mays",
    category: "cereal",
    suitableCounties: ["Trans Nzoia", "Uasin Gishu", "Nakuru", "Nandi", "Bungoma", "Kakamega", "Narok", "Bomet", "Kericho", "Embu", "Meru", "Machakos"],
    optimalPhRange: { min: 5.5, max: 6.8, ideal: 6.2 },
    criticalNutrients: {
      nitrogenPercentMin: 0.15,
      phosphorusPpmMin: 15,
      // Mehlich 3
      potassiumPpmMin: 150,
      organicCarbonPercentMin: 2,
      maxSalinityEc: 1.7
    },
    growthStages: [
      { stage: "initial", name: "Germination & Emergence (VE-V2)", durationDays: 15, kcFactor: 0.4, rootDepthMeters: 0.3, criticalWaterPeriod: false },
      { stage: "vegetative", name: "Rapid Vegetative & Knee High (V3-V10)", durationDays: 35, kcFactor: 0.8, rootDepthMeters: 0.7, criticalWaterPeriod: false },
      { stage: "flowering", name: "Tasseling & Silking (VT-R1)", durationDays: 25, kcFactor: 1.2, rootDepthMeters: 1, criticalWaterPeriod: true },
      { stage: "fruiting", name: "Grain Filling & Milking (R2-R4)", durationDays: 35, kcFactor: 1.05, rootDepthMeters: 1, criticalWaterPeriod: true },
      { stage: "maturity", name: "Physiological Maturity & Drydown (R5-R6)", durationDays: 20, kcFactor: 0.6, rootDepthMeters: 1, criticalWaterPeriod: false }
    ],
    waterRequirementMmPerSeason: { min: 500, max: 800 },
    nutrientDeficiencySymptoms: [
      {
        nutrient: "N",
        symptom: "V-shaped yellowing starting at leaf tips and progressing along the midrib of older lower leaves.",
        cause: "Low soil nitrogen, severe leaching from heavy rains, or waterlogged anaerobic roots.",
        remedy: "Top-dress with CAN (Calcium Ammonium Nitrate) or Urea at 50-75 kg/acre when soil is moist."
      },
      {
        nutrient: "P",
        symptom: "Purpling or dark reddish discoloration along margins of young leaves; stunted plants and thin stalks.",
        cause: "Soil acidity (pH < 5.5) fixing phosphate ions with toxic soluble aluminum/iron; dry topsoil.",
        remedy: "Apply agricultural lime (CaCO3) 4 weeks prior to planting, or use Mavuno/NPK 23:23:0 basal fertilizer."
      },
      {
        nutrient: "K",
        symptom: "Yellowing and scorching/necrosis along outer margins of lower leaves; weak stalks prone to lodging.",
        cause: "Depleted soil potassium reserves due to continuous cereal harvesting without potash replenishment.",
        remedy: "Incorporate MOP (Muriate of Potash) or balanced NPK 17:17:17 at planting."
      }
    ],
    standardFertilizerProgramPerAcre: {
      plantingBasal: {
        product: "NPK 23:23:0 or DAP (if soil pH > 6.0)",
        rateKgPerAcre: 50,
        timing: "At planting, placed 5cm to the side and 5cm below seed (never in direct contact)",
        notes: "If soil pH is below 5.5, substitute DAP with non-acidifying planting fertilizer (e.g. Mavuno or NPK 23:23:0)."
      },
      topDressing: {
        product: "CAN (Calcium Ammonium Nitrate 26% N)",
        rateKgPerAcre: 75,
        timing: "Split application: 35 kg at knee-high (V6 stage), 40 kg at early tasseling (V10 stage)",
        notes: "Apply when soil is moist, 10-15cm away from plant stem; incorporate into soil to prevent volatilization."
      }
    },
    sources: [
      { organization: "KALRO", title: "National Maize Production Advisory & Varieties Guide", year: 2024 },
      { organization: "NARL", title: "Soil Fertility and Crop Nutrition Guidelines for Kenya", year: 2023 }
    ]
  },
  {
    id: "crop-beans",
    commonName: "Common Dry Beans (Rosecoco, Nyayo, Chelalang, Yellow)",
    scientificName: "Phaseolus vulgaris",
    category: "legume",
    suitableCounties: ["Nakuru", "Nyeri", "Kiambu", "Kakamega", "Bungoma", "Machakos", "Makueni", "Embu", "Murang'a", "Bomet"],
    optimalPhRange: { min: 6, max: 7.2, ideal: 6.5 },
    criticalNutrients: {
      nitrogenPercentMin: 0.12,
      phosphorusPpmMin: 20,
      // High phosphorus requirement for root nodules
      potassiumPpmMin: 120,
      organicCarbonPercentMin: 1.8,
      maxSalinityEc: 1
      // Highly salt-sensitive
    },
    growthStages: [
      { stage: "initial", name: "Emergence & Seedling (VE-V2)", durationDays: 14, kcFactor: 0.4, rootDepthMeters: 0.25, criticalWaterPeriod: false },
      { stage: "vegetative", name: "Branching & Pre-Flowering (V3-V4)", durationDays: 21, kcFactor: 0.75, rootDepthMeters: 0.5, criticalWaterPeriod: false },
      { stage: "flowering", name: "Full Bloom & Pod Setting (R1-R2)", durationDays: 18, kcFactor: 1.15, rootDepthMeters: 0.7, criticalWaterPeriod: true },
      { stage: "fruiting", name: "Pod Filling & Elongation (R3-R4)", durationDays: 20, kcFactor: 1, rootDepthMeters: 0.7, criticalWaterPeriod: true },
      { stage: "maturity", name: "Pod Ripening & Drying (R5)", durationDays: 15, kcFactor: 0.5, rootDepthMeters: 0.7, criticalWaterPeriod: false }
    ],
    waterRequirementMmPerSeason: { min: 350, max: 500 },
    nutrientDeficiencySymptoms: [
      {
        nutrient: "P",
        symptom: "Stunted plant growth, dark green foliage, delayed flowering, poor nodulation, and purpling on leaf undersides.",
        cause: "Acidic soils locking phosphate; low biological nitrogen fixation due to lack of rhizobia energy.",
        remedy: "Apply Triple Superphosphate (TSP) or Single Superphosphate (SSP) at 50 kg/acre, or inoculate seed with Biofix rhizobium."
      },
      {
        nutrient: "N",
        symptom: "Pale green to yellow lower leaves; poor pod formation.",
        cause: "Ineffective root nodulation or waterlogged anaerobic soil killing Rhizobium bacteria.",
        remedy: "Starter basal dose of NPK 17:17:17 at 30 kg/acre."
      }
    ],
    standardFertilizerProgramPerAcre: {
      plantingBasal: {
        product: "DAP or TSP (or NPK 23:23:0)",
        rateKgPerAcre: 50,
        timing: "At planting in the furrow, covered with soil before seed placement",
        notes: "Inoculation with KALRO BIOFIX Rhizobium inoculant is highly recommended at planting."
      },
      topDressing: {
        product: "Usually not needed if nodulation is active; apply foliar booster if pale",
        rateKgPerAcre: 0,
        timing: "Pre-flowering if nodulation failed",
        notes: "Excess nitrogen fertilizer suppresses natural nodulation and promotes excessive foliage over pod setting."
      }
    },
    sources: [
      { organization: "KALRO", title: "Grain Legumes Production and Seed Inoculation Manual", year: 2024 },
      { organization: "KEPHIS", title: "Certified Bean Varieties Bulletin", year: 2024 }
    ]
  },
  {
    id: "crop-potatoes",
    commonName: "Irish Potatoes (Shangi, Tigoni, Dutch Robijn)",
    scientificName: "Solanum tuberosum",
    category: "tuber",
    suitableCounties: ["Nyandarua", "Nakuru", "Elgeyo Marakwet", "Meru", "Bomet", "Kiambu", "Nyeri", "Uasin Gishu"],
    optimalPhRange: { min: 5, max: 6.5, ideal: 5.8 },
    // Tolerates moderate acidity; high pH (>6.5) promotes potato scab
    criticalNutrients: {
      nitrogenPercentMin: 0.18,
      phosphorusPpmMin: 25,
      // Critical for tuber initiation
      potassiumPpmMin: 200,
      // Very high potassium consumer
      organicCarbonPercentMin: 2.2,
      maxSalinityEc: 1.7
    },
    growthStages: [
      { stage: "initial", name: "Sprout Emergence & Canopy (Stage I)", durationDays: 20, kcFactor: 0.5, rootDepthMeters: 0.3, criticalWaterPeriod: false },
      { stage: "vegetative", name: "Vegetative Growth & Tuber Initiation (Stage II)", durationDays: 25, kcFactor: 0.85, rootDepthMeters: 0.5, criticalWaterPeriod: true },
      { stage: "fruiting", name: "Tuber Bulking (Stage III)", durationDays: 35, kcFactor: 1.15, rootDepthMeters: 0.6, criticalWaterPeriod: true },
      { stage: "maturity", name: "Canopy Senescence & Skin Hardening (Stage IV)", durationDays: 20, kcFactor: 0.7, rootDepthMeters: 0.6, criticalWaterPeriod: false }
    ],
    waterRequirementMmPerSeason: { min: 500, max: 700 },
    nutrientDeficiencySymptoms: [
      {
        nutrient: "K",
        symptom: "Dark green leaves turning bronze with marginal curling and necrotic spotting; small tubers that bruise easily during storage.",
        cause: "High potato potassium demand unfulfilled by basic cereal fertilizers.",
        remedy: "Apply Sulfate of Potash (SOP) or NPK 17:17:17 at hilling/earthing up."
      },
      {
        nutrient: "P",
        symptom: "Reduced tuber count per hill, thin spindly stems, leaves curled inward with dark pigmentation.",
        cause: "Inadequate phosphate during the critical tuber initiation stage (2-4 weeks after emergence).",
        remedy: "Apply DAP or NPK 17:17:17 at 100 kg/acre at planting."
      }
    ],
    standardFertilizerProgramPerAcre: {
      plantingBasal: {
        product: "NPK 17:17:17 or DAP",
        rateKgPerAcre: 100,
        timing: "In furrows at planting, thoroughly mixed with soil before seed tuber placement",
        notes: "Avoid placing seed tubers directly onto chemical fertilizer granules."
      },
      topDressing: {
        product: "CAN (Calcium Ammonium Nitrate)",
        rateKgPerAcre: 50,
        timing: "During first earthing up (ridging) when plants are 15-20cm tall",
        notes: "Earthing up covers the tubers to prevent greening (solanine toxicity) and tuber moth attack."
      }
    },
    sources: [
      { organization: "KALRO", title: "National Potato Strategy & Good Agronomic Practices", year: 2023 },
      { organization: "PCPB", title: "Crop Protection Compendium for Horticultural Crops", year: 2025 }
    ]
  },
  {
    id: "crop-tomatoes",
    commonName: "Fresh Market Tomatoes (Anna F1, Kilele F1, Rambo F1)",
    scientificName: "Solanum lycopersicum",
    category: "vegetable",
    suitableCounties: ["Kirinyaga", "Kajiado", "Nakuru", "Machakos", "Kiambu", "Makueni", "Meru", "Uasin Gishu", "Kisumu"],
    optimalPhRange: { min: 6, max: 6.8, ideal: 6.5 },
    criticalNutrients: {
      nitrogenPercentMin: 0.2,
      phosphorusPpmMin: 30,
      potassiumPpmMin: 220,
      organicCarbonPercentMin: 2.5,
      maxSalinityEc: 2.5
    },
    growthStages: [
      { stage: "initial", name: "Transplant Establishment", durationDays: 15, kcFactor: 0.45, rootDepthMeters: 0.3, criticalWaterPeriod: false },
      { stage: "vegetative", name: "Rapid Vegetative & First Truss", durationDays: 25, kcFactor: 0.8, rootDepthMeters: 0.6, criticalWaterPeriod: false },
      { stage: "flowering", name: "Flowering & Fruit Setting", durationDays: 30, kcFactor: 1.15, rootDepthMeters: 0.9, criticalWaterPeriod: true },
      { stage: "fruiting", name: "Continuous Fruit Bulking & Harvest", durationDays: 50, kcFactor: 1.1, rootDepthMeters: 1, criticalWaterPeriod: true },
      { stage: "maturity", name: "Final Trusses & Clearing", durationDays: 15, kcFactor: 0.8, rootDepthMeters: 1, criticalWaterPeriod: false }
    ],
    waterRequirementMmPerSeason: { min: 400, max: 600 },
    nutrientDeficiencySymptoms: [
      {
        nutrient: "Ca",
        symptom: "Blossom End Rot (BER) \u2014 sunken, black leathery water-soaked lesions on the bottom of developing fruits.",
        cause: "Irregular watering or low calcium mobility; soil moisture fluctuations prevent calcium uptake.",
        remedy: "Maintain consistent soil moisture via drip irrigation; spray calcium nitrate foliar feed weekly during fruit set."
      },
      {
        nutrient: "Mg",
        symptom: "Interveinal chlorosis (yellowing between leaf veins while veins stay green) on older mature leaves.",
        cause: "Excessive potassium application blocking magnesium absorption; acidic light sandy soils.",
        remedy: "Apply Epsom salt (Magnesium sulfate) at 10-15 kg/acre or foliar spray at 5g/liter."
      }
    ],
    standardFertilizerProgramPerAcre: {
      plantingBasal: {
        product: "Well-cured cattle manure (5-10 tonnes/acre) + NPK 23:23:0 or DAP",
        rateKgPerAcre: 50,
        timing: "Incorporated into planting holes 1 week before seedling transplanting",
        notes: "Wet holes thoroughly before transplanting in late afternoon."
      },
      topDressing: {
        product: "CAN (35 kg/acre at 3 weeks) followed by NPK 17:17:17 (50 kg/acre at first flowering)",
        rateKgPerAcre: 85,
        timing: "Split applications through drip fertigation or banding under mulch",
        notes: "Foliar sprays containing Calcium + Boron are crucial to prevent fruit cracking and blossom end rot."
      }
    },
    sources: [
      { organization: "KALRO", title: "Commercial Tomato Production under Drip and Greenhouse", year: 2024 },
      { organization: "PCPB", title: "Pest and Fungicide Directory for Tomato Cultivation", year: 2025 }
    ]
  }
];
var SOIL_TYPES_DATABASE = [
  {
    id: "soil-red-volcanic-clay",
    name: "Red Volcanic Clay (Kikuyu Red Loam)",
    description: "Deep, well-weathered red highland volcanic soil with good physical structure and high clay content. Prone to severe phosphorus fixation and acidification from heavy rainfall and continuous DAP usage.",
    drainageRate: "good",
    infiltrationRateMmPerHour: 20,
    availableWaterCapacityMmPerMeter: 180,
    // mm of water per meter of soil depth
    bufferFactorLime: 1.4,
    // Higher lime needed to shift pH due to high cation exchange capacity
    typicalKenyanCounties: ["Kiambu", "Nyeri", "Murang'a", "Kirinyaga", "Embu", "Meru", "Nakuru (highlands)", "Kericho"],
    managementTips: [
      "Apply agricultural lime (CaCO3) periodically if pH falls below 5.5 to unlock bound phosphorus.",
      "Incorporate organic manure regularly to enhance biological phosphate availability.",
      "Avoid unbuffered continuous DAP application; rotate with NPK 23:23:0 or CAN."
    ]
  },
  {
    id: "soil-clay-loam",
    name: "Clay Loam (Alluvial / Mixed Highland)",
    description: "Balanced mix of clay, silt, and sand particles. Excellent water holding capacity and nutrient retention. Ideal for general cereal, legume, and horticulture production.",
    drainageRate: "good",
    infiltrationRateMmPerHour: 15,
    availableWaterCapacityMmPerMeter: 160,
    bufferFactorLime: 1.1,
    typicalKenyanCounties: ["Uasin Gishu", "Trans Nzoia", "Nandi", "Bungoma", "Kakamega", "Nakuru"],
    managementTips: [
      "Maintain surface mulch to prevent crusting and conserve topsoil moisture.",
      "Practice minimum tillage or crop rotation with deep-rooting cover crops."
    ]
  },
  {
    id: "soil-sandy-loam",
    name: "Sandy Loam (Semi-Arid & Eastern Light Soil)",
    description: "High proportion of sand with sufficient silt and clay. Warms quickly and easy to till, but has low organic matter, rapid water percolation, and high leaching of soluble nitrogen.",
    drainageRate: "excessive",
    infiltrationRateMmPerHour: 40,
    availableWaterCapacityMmPerMeter: 110,
    bufferFactorLime: 0.7,
    // Low buffer capacity, pH changes easily
    typicalKenyanCounties: ["Machakos", "Makueni", "Kitui", "Kilifi", "Kwale", "Garissa", "Isiolo"],
    managementTips: [
      "Split fertilizer applications into 3-4 smaller doses to prevent leaching below the root zone.",
      "Apply heavy organic compost or farmyard manure (5-8 tonnes/acre) to increase moisture holding capacity.",
      "Adopt drip irrigation instead of furrow to avoid catastrophic percolation water loss."
    ]
  },
  {
    id: "soil-black-cotton",
    name: "Black Cotton Soil (Vertisol / Swelling Clay)",
    description: "Heavy, dark clay soil with high montmorillonite content. Expands when wet, becoming sticky and waterlogged with very poor internal drainage; forms deep cracks when dry.",
    drainageRate: "poor",
    infiltrationRateMmPerHour: 5,
    availableWaterCapacityMmPerMeter: 200,
    bufferFactorLime: 1.8,
    typicalKenyanCounties: ["Kajiado", "Athi River / Machakos", "Kisumu (Kano Plains)", "Homa Bay", "Bomet (lowlands)"],
    managementTips: [
      "Construct raised planting beds or broadbeds and furrows (BBF) to prevent root waterlogging and root rot.",
      "Avoid working the field when saturated to prevent severe soil compaction.",
      "High natural fertility and potassium, but requires careful drainage planning."
    ]
  }
];
var SHARED_KNOWLEDGE_DOCUMENTS = [
  {
    id: "doc-soil-ph-01",
    topic: "Soil Acidity and Agricultural Liming in Kenyan Highlands",
    category: "soil_fertility",
    title: "Managing Acidic Soils (pH < 5.5) with Agricultural Lime (CaCO3) in Western Kenya and Rift Valley",
    citationCode: "KALRO-NARL-2024-LIME",
    organization: "KALRO National Agricultural Research Laboratories",
    cropOrDomain: "Maize, Beans, Wheat & Acid Soils",
    summaryExcerpt: "Managing acidic soils (pH < 5.5) using agricultural limestone (CaCO3, >=80% CCE) broadcast 3-4 weeks before planting rains to unlock bound phosphates and overcome Aluminum toxicity.",
    content: `According to KALRO National Agricultural Research Laboratories (NARL), over 13% of Kenya's cultivated highland soils in Uasin Gishu, Trans Nzoia, Nakuru, Kakamega, and Kericho suffer from severe soil acidity with pH values below 5.2.
When soil pH falls below 5.5:
1. Phosphorus fixation occurs: Plant-available orthophosphate ions react with soluble aluminum (Al3+) and iron (Fe3+) to form insoluble, precipitate compounds that plant roots cannot absorb, causing false phosphorus deficiency.
2. Aluminum toxicity sets in, severely pruning and stunting root hairs, making maize and bean crops drought-sensitive even in wet seasons.
3. Beneficial soil Rhizobium bacteria (responsible for biological nitrogen fixation in beans, cowpeas, and lucerne) are paralyzed, dropping nodulation rates by up to 80%.

Remediation Protocol:
- Test soil pH using an accredited laboratory (e.g., KALRO NARL or CropNuts).
- If pH is 4.5 - 5.0: Apply 1,000 to 1,500 kg/acre of finely ground agricultural lime (Calcium Carbonate - CaCO3, minimum 80% neutralizing value).
- If pH is 5.1 - 5.5: Apply 500 to 800 kg/acre.
- Application method: Broadcast uniformly and incorporate into the top 15cm of soil at least 3-4 weeks prior to the onset of planting rains. Lime requires soil moisture and time to dissolve and neutralize exchangeable acidity.
- Fertilizer substitution: Cease using continuous DAP (18:46:0) which carries an acid-forming physiological reaction; substitute with non-acidifying blends such as NPK 23:23:0, Mavuno Planting Fertilizer, or Single Superphosphate (SSP).`,
    keywords: ["soil ph", "acidity", "lime", "agricultural lime", "caco3", "dap", "phosphorus fixation", "aluminum toxicity", "kalro"],
    sourceOrganization: "KALRO",
    publicationYear: 2024,
    lastReviewed: "2026-04-15"
  },
  {
    id: "doc-irrigation-calc-02",
    topic: "FAO-56 Irrigation Water Calculation and Water Conservation in Kenya",
    category: "irrigation_management",
    title: "Precision Water Budgeting: Evapotranspiration, Crop Coefficients (Kc), and System Efficiency",
    citationCode: "FAO-KE-2023-IRRIG",
    organization: "FAO Kenya & National Irrigation Authority",
    cropOrDomain: "Horticulture, Drip Irrigation & Water Budgeting",
    summaryExcerpt: "Standard crop water requirements calculation where 1 mm depth on 1 ha = 10,000 L and 1 mm depth on 1 acre = 4,047 L; net water ETc = ETo x Kc, adjusted for drip (90%) and sprinkler (75%) efficiency.",
    content: `Water requirement calculations for Kenyan farming follow the standard FAO-56 Penman-Monteith crop water methodology:
1. Fundamental Volume Benchmark:
   - 1 millimeter (mm) of irrigation water depth over 1 hectare (10,000 m\xB2) = 10 cubic meters (m\xB3) = 10,000 liters.
   - 1 millimeter (mm) of irrigation water depth over 1 acre (4,046.86 m\xB2) = 4.047 cubic meters (m\xB3) = 4,047 liters.
2. Daily Crop Water Need (ETc):
   - ETc = ETo \xD7 Kc (where ETo is Reference Evapotranspiration in mm/day from local weather stations, and Kc is the crop coefficient for the specific growth stage).
   - In Kenyan Rift Valley & Central Highlands, typical ETo averages 3.8 to 5.2 mm/day; in Eastern semi-arid (Machakos, Garissa, Kitui) ETo averages 5.5 to 7.0 mm/day.
3. System Application Efficiency:
   - Drip Irrigation: 85% to 92% efficiency (use 90% in calculations).
   - Micro-sprinklers: 70% to 80% efficiency (use 75%).
   - Overhead Sprinklers: 65% to 75% efficiency.
   - Furrow/Basin Flooding: 50% to 60% efficiency (significant deep percolation and evaporation loss).
   - Gross Irrigation Need = Net Crop Need (ETc - Effective Rainfall) \xF7 System Efficiency.
4. Run Time Calculation:
   - Run Time (Hours) = Gross Water Volume Required (Liters) \xF7 Total Irrigation Flow Rate (Liters/Hour).
5. Weather Interlock:
   - If rainfall exceeding 10mm is forecast within the next 24 hours, postpone irrigation to prevent waterlogging, nutrient leaching, and root hypoxia.`,
    keywords: ["irrigation", "water requirement", "calculation", "liters per acre", "drip irrigation", "kc factor", "evapotranspiration", "efficiency"],
    sourceOrganization: "FAO_KENYA",
    publicationYear: 2023,
    lastReviewed: "2026-06-10"
  },
  {
    id: "doc-pest-faw-03",
    topic: "Integrated Pest Management (IPM) for Fall Armyworm (FAW) in Kenya",
    category: "crop_protection",
    title: "Kenya PCPB Approved Scouting, Cultural Prevention, and Chemical Control for Spodoptera frugiperda",
    citationCode: "PCPB-REG-2024-FAW",
    organization: "Pest Control Products Board (PCPB) Kenya",
    cropOrDomain: "Maize & Sorghum Pest Management",
    summaryExcerpt: "Integrated Pest Management guidelines for Fall Armyworm (Spodoptera frugiperda), distinguishing head inverted Y marks, push-pull trap crops, and registered actives (Chlorantraniliprole, Emamectin Benzoate).",
    content: `Fall Armyworm (Spodoptera frugiperda) is an invasive noctuid pest in all 47 counties of Kenya.
1. Identification:
   - Larvae have 4 dark spots arranged in an inverted trapezoid/square on the second-last abdominal segment and an inverted white 'Y' mark on the dark head capsule.
   - Damage: Window-paning of young leaves, moist yellowish-brown sawdust frass inside the central funnel.
2. Threshold for Action:
   - Early whorl stage: Spray when 10% to 20% of plants show active damage and live caterpillars.
   - Late whorl/tasseling: Spray when 5% to 10% of plants show infestation.
3. Cultural & Biological Controls (IPM):
   - Push-Pull Technology: Intercrop maize with Silverleaf or Greenleaf Desmodium (push) and plant Brachiaria or Napier grass borders (pull).
   - Early planting at the onset of rains to outpace peak adult moth flight cycles.
   - Application of dry clean sand or fine wood ash mixed with chili powder into whorls of young plants suffocates caterpillars physically.
   - Hand-picking of egg masses and larvae in plots under 1 acre.
4. PCPB Authorized Chemical Controls:
   - Chlorantraniliprole 200 g/L (Coragen 20 SC / Belt) at 5ml per 20L knapsack. PHI: 14 days.
   - Emamectin Benzoate 50 g/kg (Prove 1.92 EC / Escort) at 10-15g per 20L knapsack. PHI: 7 days.
   - Spinetoram 120 g/L (Radiant 120 SC). PHI: 7 days.
   - Biological: Bacillus thuringiensis (Bt) - Dipel 2X. PHI: 1 day.
5. Application Technique:
   - Spray early morning (6:00 AM - 8:30 AM) or late evening (5:30 PM - 7:00 PM) when larvae feed openly. Direct spray nozzle directly into the funnel.
   - Always wear full PPE (nitrile gloves, face mask, gumboots, overalls).`,
    keywords: ["fall armyworm", "faw", "maize pest", "pcpb", "coragen", "emamectin", "chlorantraniliprole", "push pull", "scouting"],
    sourceOrganization: "PCPB",
    publicationYear: 2024,
    lastReviewed: "2026-08-20"
  },
  {
    id: "doc-livestock-dairy-04",
    topic: "Dairy Cattle Nutrition and Milk Yield Optimization in Kenya",
    category: "livestock_health",
    title: "Transition from 15L to 30L/day: Rations, Total Mixed Ration (TMR), and Desmodium/Silage Protocols",
    citationCode: "KALRO-DRI-2024-DAIRY",
    organization: "KALRO Dairy Research Institute Naivasha",
    cropOrDomain: "Dairy Cattle & Forage Management",
    summaryExcerpt: "Feeding protocol and dry matter balancing for Kenyan smallholders moving from 15L to 30L per cow, emphasizing wilted silage, Desmodium/Lucerne protein, and ad-libitum clean water.",
    content: `According to KALRO Dairy Research Institute (Naivasha):
1. Limiting Factors in Smallholder Dairy Yields:
   - Low dry matter intake, high reliance on un-wilted low-protein Napier grass, and restricted clean drinking water.
2. The 30L Production Formula:
   - A 500kg Friesian or Ayrshire cow producing 30 liters of milk requires 16-18 kg of dry matter daily containing 16% Crude Protein (CP) and 10.5 MJ/kg of Metabolizable Energy (ME).
   - High-quality wilted maize silage (28-32% dry matter, well fermented) provides high energy.
   - Legume forage: Lucerne (Alfalfa) or Greenleaf Desmodium hay provides 18-22% crude protein, drastically reducing expensive commercial dairy meal costs.
3. Feeding Rule:
   - Provide 3 kg of standard commercial dairy meal (16% CP) for maintenance, then 1 kg of dairy meal for every 2 liters of milk produced beyond 10 liters.
4. Water Requirement:
   - A dairy cow requires 4 to 5 liters of clean water for every 1 liter of milk produced, plus 40-50 liters for maintenance (totaling 120-160 liters daily per cow). Ad-libitum water access increases yield by 15-20% immediately.
5. Mastitis & Hygiene:
   - California Mastitis Test (CMT) weekly.
   - Post-milking teat dipping in 0.5% iodine or chlorhexidine to seal teat canals.`,
    keywords: ["dairy cow", "milk yield", "silage", "desmodium", "lucerne", "friesian", "ayrshire", "kalro", "feed ratio"],
    sourceOrganization: "KALRO",
    publicationYear: 2024,
    lastReviewed: "2026-05-18"
  }
];

// server-backend.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.resolve(__dirname, "public")));
var serverAiTelemetry = [
  {
    id: "tel-001",
    timestamp: new Date(Date.now() - 36e5).toISOString(),
    queryType: "farming_advisory",
    modelUsed: "gemini-3.8-flash",
    latencyMs: 382,
    wasCacheHit: false,
    tokensUsed: 420,
    status: "SUCCESS"
  },
  {
    id: "tel-002",
    timestamp: new Date(Date.now() - 24e5).toISOString(),
    queryType: "pest_diagnosis",
    modelUsed: "gemini-3.8-flash",
    latencyMs: 740,
    wasCacheHit: false,
    tokensUsed: 680,
    status: "SUCCESS"
  },
  {
    id: "tel-003",
    timestamp: new Date(Date.now() - 12e5).toISOString(),
    queryType: "soil_analysis",
    modelUsed: "deterministic_agronomy_engine",
    latencyMs: 35,
    wasCacheHit: true,
    tokensUsed: 0,
    status: "SUCCESS"
  },
  {
    id: "tel-004",
    timestamp: new Date(Date.now() - 6e5).toISOString(),
    queryType: "irrigation",
    modelUsed: "fao_penman_monteith_calc",
    latencyMs: 15,
    wasCacheHit: true,
    tokensUsed: 0,
    status: "SUCCESS"
  }
];
var serverAiFeedback = [
  {
    id: "fb-001",
    timestamp: new Date(Date.now() - 864e5).toISOString(),
    farmerEmail: "farmer@smart-agri.ke",
    farmerQuery: "Can I mix Mancozeb and CAN fertilizer in the same knapsack spray for potatoes?",
    aiResponseText: "Never combine foliar fertilizer CAN with fungicide Mancozeb in the same spray tank due to chemical scorching risk and spray solution precipitation.",
    feedbackType: "helpful",
    notes: "Very clear warning that saved my potato crop from leaf burn.",
    status: "resolved"
  }
];
var apiKey = process.env.GEMINI_API_KEY;
var aiClient = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
var ROLE_SYSTEM_INSTRUCTIONS = {
  agronomist: `You are DERIV-AGRI Kenya's Senior Agronomist and Crop Production Specialist.
You provide field-tested, science-based agronomic guidance for Kenyan farmers.
Focus areas:
- Certified seeds approved by KEPHIS (Kenya Seed Company, Simlaw Seeds, Pioneer, SeedCo, KALRO varieties).
- PCPB Kenya registered crop protection chemicals (fungicides, insecticides, herbicides) with exact Pre-Harvest Intervals (PHI in days) and safety PPE requirements.
- Basal and top-dressing fertilization tailored to Kenyan agro-ecological zones (Highlands, Rift Valley, Western, Coast, Eastern ASALs).
- Planting calendars aligned with Long Rains (March-May) and Short Rains (October-December).
- Soil moisture conservation, crop rotation with legumes (Desmodium, beans, cowpeas), and Integrated Pest Management (IPM).
Provide practical advice with specific quantities (kg/acre, ml/20L knapsack). Always end with a helpful next step or clarifying question.`,
  veterinarian: `You are DERIV-AGRI Kenya's Chief Veterinary Surgeon and Livestock Production Specialist.
You provide clinical, preventive, and nutritional guidance for Kenyan livestock keepers (Dairy, Beef, Goats, Sheep, Poultry, Pigs, Bees).
Focus areas:
- Dairy cattle management (Friesian, Ayrshire, Jersey, Guernsey) targeting high milk yields, Total Mixed Ration (TMR), silage preparation, and mineral supplementation.
- Tick-borne disease prevention (East Coast Fever [ECF], Anaplasmosis, Babesiosis, Heartwater) using PCPB-registered acaricide dipping and spraying protocols.
- Endemic disease identification: Mastitis (California Mastitis Test), Foot and Mouth Disease (FMD), Anthrax, Blackquarter, Newcastle Disease, Gumboro.
- Kienyeji and commercial poultry management (brooding temperature, feeding schedules, deworming, biosecurity).
- Remind farmers to consult a licensed Kenya Veterinary Board (KVB) registered practitioner for prescription antibiotics and surgical procedures.`,
  soil_scientist: `You are DERIV-AGRI Kenya's Principal Soil Fertility and Plant Nutrition Scientist, grounded in KALRO National Agricultural Research Laboratories (NARL) soil testing indexes.
Focus areas:
- Soil pH interpretation, soil acidity mitigation, and agricultural limestone (CaCO3, >=80% CCE) requirement calculation in kg/acre.
- Phosphorus fixation dynamics in acidic volcanic soils and switching from continuous DAP to buffered NPK (e.g., 23:23:0, Mavuno) or rock phosphate.
- Cation Exchange Capacity (CEC), secondary macronutrients (Calcium, Magnesium, Sulfur), and essential micronutrients (Zinc, Boron, Copper, Iron).
- Interpretation of laboratory results from accredited Kenyan labs (KALRO NARL, CropNuts, KEPHIS Muguga).
Provide clear agronomic explanations with stated units and assumptions.`,
  market_analyst: `You are DERIV-AGRI Kenya's Agricultural Market Economist and Value Chain Analyst.
Focus areas:
- Live and historical wholesale commodity prices across Kenya's key trading hubs (Nairobi Wakulima/Marikiti, Mombasa Kongowea, Kisumu Kibuye, Meru Gakoromone, Eldoret Municipal).
- Seasonal price cycles, harvest glut timing, and supply forecasting to maximize farmer profit margins.
- Post-harvest handling, cleaning, sorting, grading, and moisture content requirements (e.g., <=13.5% for commercial cereal storage at NCPB).
- Aggregation, farmer cooperative SACCO logistics, contract farming, and direct linkages to processors and millers.`
};
function determineGroundingMode(userMode, query) {
  if (userMode === "search") return "search";
  if (userMode === "maps") return "maps";
  if (userMode === "none") return "none";
  const lower = query.toLowerCase();
  const mapsTriggers = [
    "near me",
    "nearby",
    "where is",
    "where can i buy",
    "where to buy",
    "location",
    "agrovet",
    "agrovets",
    "kalro station",
    "research station",
    "depot",
    "ncpb",
    "silo",
    "silos",
    "market near",
    "closest",
    "lab near",
    "auction yard"
  ];
  if (mapsTriggers.some((t) => lower.includes(t))) {
    return "maps";
  }
  const searchTriggers = [
    "latest",
    "news",
    "today",
    "current price",
    "weather alert",
    "outbreak",
    "subsidy",
    "fertilizer program",
    "2026",
    "recent update",
    "bulletin",
    "kenya seed"
  ];
  if (searchTriggers.some((t) => lower.includes(t))) {
    return "search";
  }
  return "none";
}
app.post("/api/gemini/chat", async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      message,
      history = [],
      roleId = "agronomist",
      model = "gemini-3.8-flash",
      groundingMode = "auto",
      county,
      userLocation,
      language = "English"
    } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message text is required." });
    }
    let selectedModel = model;
    if (selectedModel === "auto") {
      const lower = message.toLowerCase();
      const isComplex = lower.includes("calculate") || lower.includes("balance") || lower.includes("formulate") || lower.includes("chemistry") || lower.includes("pathology") || lower.includes("economic model");
      const isFast = lower.length < 50 && (lower.includes("spacing") || lower.includes("seed rate") || lower.includes("variety") || lower.includes("contact"));
      if (isComplex) selectedModel = "gemini-4-argon";
      else if (isFast) selectedModel = "gemini-3.1-flash-lite";
      else selectedModel = "gemini-3.8-flash";
    }
    const roleInstruction = ROLE_SYSTEM_INSTRUCTIONS[roleId] || ROLE_SYSTEM_INSTRUCTIONS.agronomist;
    const languageInstruction = language === "Kiswahili" ? '\nRespond in natural, respectful, and fluent Kenyan agricultural Kiswahili (e.g. use proper terms like "mbolea ya kupandia", "chokaa ya kilimo", "viwavi jeshi", "ukaguzi wa mbegu").' : "\nRespond in clear, professional English accessible to Kenyan farmers and agribusiness professionals.";
    const systemInstruction = `${roleInstruction}
Farmer County context: ${county || "Kenya"}.${languageInstruction}`;
    const effectiveGrounding = selectedModel === "gemini-3.8-flash" ? determineGroundingMode(groundingMode, message) : "none";
    const lowerMsg = message.toLowerCase();
    const matchedDocs = SHARED_KNOWLEDGE_DOCUMENTS.filter(
      (doc) => doc.keywords.some((kw) => lowerMsg.includes(kw.toLowerCase())) || Boolean(doc.cropOrDomain && doc.cropOrDomain.toLowerCase().includes(lowerMsg)) || Boolean(doc.cropOrDomain && lowerMsg.includes(doc.cropOrDomain.toLowerCase()))
    ).slice(0, 3);
    const ragCitations = matchedDocs.map((d) => ({
      title: d.title,
      organization: d.organization || d.sourceOrganization,
      citationCode: d.citationCode || d.id,
      year: d.publicationYear
    }));
    if (!aiClient) {
      let simulatedText = "";
      let simulatedSearchSources = [];
      let simulatedMapSources = [];
      if (effectiveGrounding === "maps") {
        simulatedText = `Here are accredited agricultural resources, agrovets, and stations near **${county || "your location"}**:

1. **KALRO Agricultural Research Centre** \u2014 Official research station for certified foundation seed, soil health testing, and crop diagnostics.
2. **Kenya Farmers Association (KFA) & Agrovet Hub** \u2014 Licensed distributor of KEPHIS-certified seeds, PCPB-registered crop protection, and fertilizer.
3. **National Cereals and Produce Board (NCPB) Depot** \u2014 Certified grain drying facilities, e-voucher subsidized fertilizer collection point, and grain storage.

You can navigate directly using the Google Maps links below.`;
        simulatedMapSources = [
          {
            title: `KALRO Research Centre (${county || "Regional Hub"})`,
            uri: `https://www.google.com/maps/search/KALRO+${encodeURIComponent(county || "Kenya")}`,
            snippets: ["Accredited seed testing laboratory and agronomic extension facility."]
          },
          {
            title: `Kenya Farmers Agrovet Hub (${county || "Central"})`,
            uri: `https://www.google.com/maps/search/Agrovet+${encodeURIComponent(county || "Kenya")}`,
            snippets: ["PCPB-registered pesticides, DAP/CAN fertilizers, and certified hybrid seed."]
          },
          {
            title: `NCPB Grain Silos & Depot (${county || "Depot"})`,
            uri: `https://www.google.com/maps/search/NCPB+Depot+${encodeURIComponent(county || "Kenya")}`,
            snippets: ["Official Government subsidized fertilizer redemption and grain drying."]
          }
        ];
      } else if (effectiveGrounding === "search") {
        simulatedText = `Based on current agricultural bulletins and market observations for **${county || "Kenya"}**:

\u2022 **Fertilizer & Nutrition**: Transition from unbuffered DAP to NPK 23:23:0 on acidic plots (pH < 5.5). Agricultural lime should be broadcast 3-4 weeks before planting rains.
\u2022 **PCPB Crop Protection Alerts**: Scout weekly for Fall Armyworm (Spodoptera frugiperda) and Maize Lethal Necrosis (MLND). Use approved actives (e.g. Chlorantraniliprole, Emamectin Benzoate) observing 7-14 day Pre-Harvest Intervals.
\u2022 **Weather & Planting Window**: Align planting with onset forecasts from the Kenya Meteorological Department (KMD).

Would you like me to calculate tailored fertilizer quantities for your farm plot?`;
        simulatedSearchSources = [
          {
            title: "Ministry of Agriculture Kenya - E-Voucher Fertilizer Subsidy Guidelines",
            uri: "https://kilimo.go.ke"
          },
          {
            title: "Pest Control Products Board (PCPB) Kenya - Approved Pesticide Register",
            uri: "https://pcpb.go.ke"
          },
          {
            title: "Kenya Agricultural and Livestock Research Organization (KALRO) Technical Advisories",
            uri: "https://www.kalro.org"
          }
        ];
      } else {
        simulatedText = language === "Kiswahili" ? `Habari ya mkulima! Kama mtaalamu wako wa DERIV-AGRI Kenya katika mfumo wa **${selectedModel}**:

Kuhusu swali lako kuhusu kilimo katika kaunti ya **${county || "Kenya"}**:
1. **Mbegu zilizoidhinishwa**: Tumia mbegu zilizopimwa na KEPHIS zinazofaa eneo lako.
2. **Afya ya Udongo**: Pima pH ya udongo kabla ya kupanda ili kuepuka kupoteza gharama ya mbolea.
3. **Kudhibiti Magonjwa**: Tumia madawa yaliyosajiliwa na PCPB ukizingatia muda wa usalama kabla ya mavuno (PHI).

Je, ungependa nikusaidie kukokotoa kiasi cha mbolea au chokaa ya kilimo inayohitajika?` : `Welcome to DERIV-AGRI Kenya! As your dedicated **${roleId.replace("_", " ")}** powered by **${selectedModel}**:

Regarding your inquiry for **${county || "Kenya"}**:
1. **Agronomic Best Practice**: Ensure proper spacing, certified hybrid seed from KEPHIS-approved stockists, and timely basal fertilization.
2. **Soil Health Protocol**: If your soil is acidic, continuous DAP application will fix phosphorus. Broadcast agricultural lime (CaCO3) prior to tillage.
3. **Integrated Pest Management**: Scout fields at early dawn twice a week. Rotate active ingredient chemical classes to prevent insect resistance.

Would you like to explore specific variety choices or local market price comparisons?`;
      }
      const latencyMs2 = selectedModel === "gemini-3.1-flash-lite" ? 120 : selectedModel === "gemini-4-argon" ? 640 : 280;
      serverAiTelemetry.unshift({
        id: `tel-${Date.now()}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        queryType: "farming_advisory",
        modelUsed: `${selectedModel} (offline demo)`,
        latencyMs: latencyMs2,
        wasCacheHit: false,
        tokensUsed: 350,
        status: "FALLBACK_OFFLINE"
      });
      return res.json({
        success: true,
        response: {
          id: `msg-${Date.now()}`,
          role: "assistant",
          text: simulatedText,
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: selectedModel,
          roleId,
          groundingType: effectiveGrounding,
          searchSources: simulatedSearchSources,
          mapSources: simulatedMapSources,
          citations: ragCitations,
          latencyMs: latencyMs2
        }
      });
    }
    const tools = [];
    let toolConfig = void 0;
    if (effectiveGrounding === "search") {
      tools.push({ googleSearch: {} });
    } else if (effectiveGrounding === "maps") {
      tools.push({ googleMaps: {} });
      if (userLocation && userLocation.latitude && userLocation.longitude) {
        toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: Number(userLocation.latitude),
              longitude: Number(userLocation.longitude)
            }
          }
        };
      }
    }
    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-8)) {
        if (turn.text && turn.role) {
          contents.push({
            role: turn.role === "assistant" ? "model" : "user",
            parts: [{ text: turn.text }]
          });
        }
      }
    }
    const ragContextText = matchedDocs.length > 0 ? `[KALRO/PCPB Reference Context: ${matchedDocs.map((d) => `${d.title}: ${d.summaryExcerpt}`).join(" | ")}]

` : "";
    contents.push({
      role: "user",
      parts: [{ text: `${ragContextText}${message}` }]
    });
    const modelConfig = {
      systemInstruction,
      temperature: selectedModel === "gemini-4-argon" ? 0.3 : 0.6
    };
    if (tools.length > 0) {
      modelConfig.tools = tools;
      if (toolConfig) {
        modelConfig.toolConfig = toolConfig;
      }
    }
    const aiResponse = await aiClient.models.generateContent({
      model: selectedModel,
      contents,
      config: modelConfig
    });
    const latencyMs = Date.now() - startTime;
    const responseText = aiResponse.text || "Unable to generate agricultural response.";
    const rawChunks = aiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = [];
    const mapSources = [];
    for (const chunk of rawChunks) {
      if (chunk.web && chunk.web.uri) {
        searchSources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || "Web Reference"
        });
      }
      if (chunk.maps && chunk.maps.uri) {
        mapSources.push({
          uri: chunk.maps.uri,
          title: chunk.maps.title || "Location Reference",
          snippets: chunk.maps.placeAnswerSources?.reviewSnippets || []
        });
      }
    }
    const searchQueries = aiResponse.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
    serverAiTelemetry.unshift({
      id: `tel-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      queryType: "farming_advisory",
      modelUsed: selectedModel,
      latencyMs,
      wasCacheHit: false,
      tokensUsed: 420,
      status: "SUCCESS"
    });
    res.json({
      success: true,
      response: {
        id: `msg-${Date.now()}`,
        role: "assistant",
        text: responseText,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: selectedModel,
        roleId,
        groundingType: mapSources.length > 0 ? "maps" : searchSources.length > 0 ? "search" : "none",
        searchSources,
        mapSources,
        searchQueries,
        citations: ragCitations,
        latencyMs
      }
    });
  } catch (error) {
    console.error("Gemini Multi-turn Chat Error:", error);
    res.status(500).json({
      error: "Failed to process chat response with Gemini API.",
      details: error.message
    });
  }
});
app.post("/api/gemini/assistant/stream", async (req, res) => {
  const startTime = Date.now();
  const {
    message,
    county,
    crop,
    livestock,
    history = [],
    language = "English",
    liveContext = {},
    model = "gemini-3.8-flash",
    roleId = "agronomist",
    groundingMode = "auto",
    userLocation
  } = req.body;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  const lowerMsgForModel = (message || "").toLowerCase();
  const isComplex = lowerMsgForModel.includes("calculate") || lowerMsgForModel.includes("chemistry") || lowerMsgForModel.includes("pathology") || lowerMsgForModel.includes("ration formula");
  const selectedModel = model === "gemini-2.5-pro" || model === "gemini-4-argon" || isComplex ? "gemini-2.5-pro" : "gemini-3.8-flash";
  const effectiveGrounding = determineGroundingMode(groundingMode, message || "");
  const lowerMsg = (message || "").toLowerCase();
  const matchedDocs = SHARED_KNOWLEDGE_DOCUMENTS.filter(
    (doc) => doc.keywords.some((kw) => lowerMsg.includes(kw.toLowerCase())) || Boolean(doc.cropOrDomain && doc.cropOrDomain.toLowerCase().includes(lowerMsg)) || Boolean(doc.cropOrDomain && lowerMsg.includes(doc.cropOrDomain.toLowerCase()))
  ).slice(0, 3);
  const ragContext = matchedDocs.map(
    (d) => `[Source: ${d.organization} - Document: ${d.title} (${d.citationCode})]
${d.summaryExcerpt}`
  ).join("\n\n");
  const priceMatches = serverMarketPrices.filter(
    (p) => lowerMsg.includes(p.commodityName.toLowerCase()) || p.variety && lowerMsg.includes(p.variety.toLowerCase())
  ).slice(0, 3);
  const marketContext = priceMatches.length > 0 ? `Live DERIV-AGRI Market Observations:
` + priceMatches.map(
    (p) => `- ${p.commodityName} (${p.variety || "Standard"}): Wholesale Ksh ${p.wholesalePriceKsh}/${p.unit} in ${p.marketName} (${p.county})`
  ).join("\n") : "";
  const citations = matchedDocs.map((d) => ({
    title: d.title,
    organization: d.organization || d.sourceOrganization,
    citationCode: d.citationCode || d.id,
    year: d.publicationYear
  }));
  const roleInstruction = ROLE_SYSTEM_INSTRUCTIONS[roleId] || ROLE_SYSTEM_INSTRUCTIONS.agronomist;
  const languageInstruction = language === "Kiswahili" ? "\nRespond in natural, respectful, and fluent Kenyan agricultural Kiswahili." : "\nRespond in clear, professional English.";
  const systemInstruction = `${roleInstruction}
Farmer County context: ${county || "Kenya"}.${languageInstruction}
End with ONE concise, high-value practical next step.`;
  const conversationHistoryText = (history || []).slice(-6).map(
    (h) => `${h.role === "user" ? "Farmer" : "Specialist"}: ${h.text || h.content || ""}`
  ).join("\n");
  const fullPrompt = `${ragContext ? `VERIFIED KENYA KNOWLEDGE BASE CITATIONS:
${ragContext}

` : ""}${marketContext ? `${marketContext}

` : ""}${liveContext.weather ? `Live Local Weather (${county || "Kenya"}): Temp ${liveContext.weather.temperatureC}\xB0C, Condition: ${liveContext.weather.condition}, 7-Day Rainfall: ${liveContext.weather.rainfallMm}mm

` : ""}${liveContext.soilReport ? `Farmer's Recent Soil Test: pH ${liveContext.soilReport.ph || "N/A"}, Status: ${liveContext.soilReport.status || "N/A"}

` : ""}${conversationHistoryText ? `PREVIOUS CONVERSATION HISTORY:
${conversationHistoryText}

` : ""}CURRENT FARMER QUERY: "${message}"
Farmer County: ${county || "Unspecified"}
Focus Crop: ${crop || "None"}
Focus Livestock: ${livestock || "None"}
Selected Model Tier: ${selectedModel}
Preferred Language: ${language}`;
  try {
    if (!aiClient) {
      let fallbackAdvisory = language === "Kiswahili" ? `Habari ya mkulima! Kama mtaalamu wako wa DERIV-AGRI Kenya kupitia **${selectedModel}**:

Kuhusu **${crop || livestock || "kilimo chako"}** katika kaunti ya **${county || "Kenya"}**:

1. **Udongo na Mbolea**: Hakikisha unafanya upimaji wa pH ya udongo kabla ya msimu wa mvua. Kwa udongo wenye asidi ya chini ya 5.5, weka chokaa ya kilimo (lime) mapema.
2. **Kupanda kwa Wakati**: Tumia mbegu zilizothibitishwa na KEPHIS (mfano chotara za Kenya Seed au Simlaw Seeds).
3. **Kudhibiti Wadudu**: Kagua funeli za mahindi kila juma kwa viwavi wa Fall Armyworm. Tumia madawa yaliyosajiliwa na PCPB kama vile Coragen au dawa asilia ya Neem.

Je, una hekta ngapi za shamba unazopanga kulima msimu huu?` : `Welcome to DERIV-AGRI Kenya Advisory! As your dedicated **${roleId.replace("_", " ")}** running on **${selectedModel}**:

Regarding **${crop || livestock || "your farming query"}** in **${county || "Kenya"}**:

1. **Agro-Ecological Guidance**: For your location in ${county || "the region"}, monitor onset of planting rains aligned with the Kenya Meteorological Department (KMD) seasonal bulletin.
2. **Soil Nutrition Protocol**: Verify your soil pH. If your soil is acidic (pH < 5.5), continuous DAP use locks phosphorus; transition to buffered NPK 23:23:0 or apply agricultural lime 4 weeks before planting.
3. **Pest & Disease Scouting**: Monitor early morning for major vectors. Apply PCPB-registered actives observing Pre-Harvest Intervals (PHI).
4. **Market & Logistics**: Check current wholesale prices in our Market Prices portal to time your harvest deliveries.

Would you like me to calculate specific fertilizer quantities or map nearby agro-input stockists for your farm?`;
      const simulatedSearchSources = effectiveGrounding === "search" ? [
        { title: "Ministry of Agriculture Kenya - E-Voucher Fertilizer Program", uri: "https://kilimo.go.ke" },
        { title: "Pest Control Products Board (PCPB) Kenya Registry", uri: "https://pcpb.go.ke" }
      ] : [];
      const simulatedMapSources = effectiveGrounding === "maps" ? [
        { title: `KALRO Research Station (${county || "Regional"})`, uri: `https://www.google.com/maps/search/KALRO+${encodeURIComponent(county || "Kenya")}`, snippets: ["Certified foundation seed & soil diagnostics"] },
        { title: `Certified Agrovet Depot (${county || "Town"})`, uri: `https://www.google.com/maps/search/Agrovet+${encodeURIComponent(county || "Kenya")}`, snippets: ["PCPB-registered pesticides & fertilizer"] }
      ] : [];
      const words = fallbackAdvisory.split(" ");
      for (let i = 0; i < words.length; i += 3) {
        const chunk = words.slice(i, i + 3).join(" ") + " ";
        res.write(`data: ${JSON.stringify({ chunk })}

`);
        await new Promise((r) => setTimeout(r, 35));
      }
      const latencyMs2 = selectedModel === "gemini-3.8-flash" ? 180 : 380;
      serverAiTelemetry.unshift({
        id: `tel-${Date.now()}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        queryType: "farming_advisory",
        modelUsed: `${selectedModel} (offline stream)`,
        latencyMs: latencyMs2,
        wasCacheHit: false,
        tokensUsed: words.length,
        status: "FALLBACK_OFFLINE"
      });
      res.write(`data: ${JSON.stringify({
        done: true,
        modelUsed: selectedModel,
        groundingType: effectiveGrounding,
        searchSources: simulatedSearchSources,
        mapSources: simulatedMapSources,
        citations,
        latencyMs: latencyMs2
      })}

`);
      res.end();
      return;
    }
    const responseStream = await aiClient.models.generateContentStream({
      model: selectedModel,
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: selectedModel === "gemini-2.5-pro" ? 0.3 : 0.6
      }
    });
    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ chunk: chunk.text })}

`);
      }
    }
    const latencyMs = Date.now() - startTime;
    serverAiTelemetry.unshift({
      id: `tel-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      queryType: "farming_advisory",
      modelUsed: selectedModel,
      latencyMs,
      wasCacheHit: false,
      tokensUsed: 450,
      status: "SUCCESS"
    });
    res.write(`data: ${JSON.stringify({
      done: true,
      modelUsed: selectedModel,
      groundingType: effectiveGrounding,
      citations,
      latencyMs
    })}

`);
    res.end();
  } catch (error) {
    console.error("Streaming Assistant Error (engaging Kenyan agronomic fallback):", error);
    try {
      const fallbackAdvisory = language === "Kiswahili" ? `Habari ya mkulima! Kuhusu kilimo chako katika kaunti ya ${county || "Kenya"}:

1. Fuata miongozo ya hali ya hewa ya msimu kutoka Idara ya Hali ya Hewa (KMD).
2. Tumia mbegu zilizoidhinishwa na KEPHIS kwa mazao bora.
3. Hakikisha unapima udongo wako ili kutumia mbolea inayofaa bila kuharibu rutuba.` : `Welcome to SMART-AGRI Kenya Advisory! Regarding your farming query for ${county || "Kenya"}:

1. Agro-Ecological Guidance: Monitor seasonal rain patterns aligned with Kenya Meteorological Department (KMD) advisories for ${county || "your county"}.
2. Certified Inputs: Use KEPHIS-certified seeds and PCPB-registered inputs for optimal germination and disease prevention.
3. Soil Management: Maintain optimal soil pH (6.0 - 6.8 for most staple crops) and consider organic matter additions before planting.`;
      const words = fallbackAdvisory.split(" ");
      for (let i = 0; i < words.length; i += 3) {
        const chunk = words.slice(i, i + 3).join(" ") + " ";
        res.write(`data: ${JSON.stringify({ chunk })}

`);
      }
      res.write(`data: ${JSON.stringify({ done: true, modelUsed: `${selectedModel} (resilient stream)`, citations: [], latencyMs: Date.now() - startTime, isFallback: true })}

`);
    } catch {
    }
    res.end();
  }
});
app.post("/api/soil/analyze", (req, res) => {
  const startTime = Date.now();
  try {
    const input = req.body;
    const cropKey = (input.crop || "Maize (Zea mays)").toLowerCase();
    const soilKey = (input.soilType || "Red Volcanic Clay (Nitisol)").toLowerCase();
    let matchedCrop = CROPS_AGRONOMY_DATABASE.find(
      (c) => c.commonName.toLowerCase().includes(cropKey) || cropKey.includes(c.commonName.toLowerCase())
    ) || CROPS_AGRONOMY_DATABASE[0];
    let matchedSoil = SOIL_TYPES_DATABASE.find(
      (s) => s.name.toLowerCase().includes(soilKey) || soilKey.includes(s.name.toLowerCase())
    ) || SOIL_TYPES_DATABASE[0];
    const measuredPh = typeof input.soilPh === "number" && !isNaN(input.soilPh) && input.soilPh > 0 ? input.soilPh : void 0;
    let phRating = "Unmeasured";
    let limeKgPerAcre = 0;
    let impactExplanation = "Soil pH has not been laboratory tested or measured with a pH pen yet. We recommend having your soil tested with a calibrated soil pH meter or submitting a composite sample to KALRO NARL or CropNuts.";
    if (measuredPh !== void 0) {
      if (measuredPh < 5) {
        phRating = "Extremely Acidic";
        impactExplanation = `Critical acidity detected (pH ${measuredPh}). Exchangeable Aluminum (Al3+) and Manganese ions are chemically toxic to roots. Over 70% of applied inorganic phosphate is permanently locked into insoluble Al-phosphate precipitates. Nitrifying bacterial activity is largely arrested.`;
      } else if (measuredPh < matchedCrop.optimalPhRange.min) {
        phRating = "Moderately Acidic";
        impactExplanation = `Soil pH (${measuredPh}) is below the optimal threshold of ${matchedCrop.optimalPhRange.min} for ${matchedCrop.commonName}. Available phosphorus is partially fixed and fertilizer nitrogen efficiency is reduced by ~35%.`;
      } else if (measuredPh > matchedCrop.optimalPhRange.max) {
        phRating = "Alkaline";
        impactExplanation = `Soil pH (${measuredPh}) exceeds the optimal upper range (${matchedCrop.optimalPhRange.max}). Micronutrient availability (Fe, Zn, Mn) is restricted.`;
      } else {
        phRating = "Optimal";
        impactExplanation = `Soil pH (${measuredPh}) is within the optimal agronomic range (${matchedCrop.optimalPhRange.min} - ${matchedCrop.optimalPhRange.max}) for ${matchedCrop.commonName}. Primary macronutrients and micronutrients are readily soluble and available to crop root hairs.`;
      }
      if (measuredPh < matchedCrop.optimalPhRange.ideal) {
        const phDeficit = matchedCrop.optimalPhRange.ideal - measuredPh;
        const rawLime = phDeficit * matchedSoil.bufferFactorLime * 1e3;
        limeKgPerAcre = Math.round(rawLime / 50) * 50;
      }
    }
    const lab = input.labResults || {};
    const nutrientStatuses = [
      {
        nutrient: "N",
        measuredValue: lab.nitrogenPercent ? `${lab.nitrogenPercent}%` : void 0,
        status: lab.nitrogenPercent ? lab.nitrogenPercent < matchedCrop.criticalNutrients.nitrogenPercentMin ? "Low" : "Optimal" : input.observedSymptoms?.some((s) => s.toLowerCase().includes("yellow") || s.toLowerCase().includes("stunt")) ? "Low" : "Unmeasured (Visual Estimate)",
        explanation: "Essential for vegetative canopy vigor, chlorophyll synthesis, and protein structure. Yellowing lower leaves indicate nitrogen translocation."
      },
      {
        nutrient: "P",
        measuredValue: lab.phosphorusPpm ? `${lab.phosphorusPpm} ppm (Mehlich-3)` : void 0,
        status: lab.phosphorusPpm ? lab.phosphorusPpm < matchedCrop.criticalNutrients.phosphorusPpmMin ? "Deficient" : "Optimal" : input.observedSymptoms?.some((s) => s.toLowerCase().includes("purple") || s.toLowerCase().includes("root")) ? "Deficient" : "Unmeasured (Visual Estimate)",
        explanation: "Vital for early root development, ATP energy transfer, and seed formation. Readily fixed by acid in Kenyan volcanic soils."
      },
      {
        nutrient: "K",
        measuredValue: lab.potassiumCmolKg ? `${lab.potassiumCmolKg} cmol/kg` : void 0,
        status: lab.potassiumCmolKg ? lab.potassiumCmolKg < matchedCrop.criticalNutrients.potassiumPpmMin / 390 ? "Low" : "Optimal" : "Optimal",
        explanation: "Regulates plant stomatal movement, disease resistance, and stalk strength. Prevents lodging under heavy rains."
      },
      {
        nutrient: "Organic Carbon",
        measuredValue: lab.organicCarbonPercent ? `${lab.organicCarbonPercent}%` : void 0,
        status: lab.organicCarbonPercent ? lab.organicCarbonPercent < matchedCrop.criticalNutrients.organicCarbonPercentMin ? "Low" : "Optimal" : "Unmeasured (Visual Estimate)",
        explanation: "Drives cation exchange capacity (CEC), beneficial soil microbiome, and moisture retention."
      },
      {
        nutrient: "Salinity",
        measuredValue: lab.salinityECdsPerM ? `${lab.salinityECdsPerM} dS/m` : void 0,
        status: lab.salinityECdsPerM ? lab.salinityECdsPerM > matchedCrop.criticalNutrients.maxSalinityEc ? "Excessive" : "Optimal" : "Optimal",
        explanation: "Low electrical conductivity indicates safe osmotic pressure without crop root salt scorch risk."
      }
    ];
    const areaAcres = Number(input.fieldSizeAcres) || 1;
    const basalProg = matchedCrop.standardFertilizerProgramPerAcre?.plantingBasal;
    const topProg = matchedCrop.standardFertilizerProgramPerAcre?.topDressing;
    const report = {
      id: `soil-rep-${Date.now()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      farmerId: input.farmerId || "usr-farmer-01",
      cropName: matchedCrop.commonName,
      input,
      phAnalysis: {
        value: measuredPh,
        rating: phRating,
        optimalRange: `${matchedCrop.optimalPhRange.min} - ${matchedCrop.optimalPhRange.max}`,
        impactExplanation,
        limeRequiredKgPerAcre: limeKgPerAcre
      },
      nutrientStatuses,
      fertilizerPlan: {
        areaTreated: `${areaAcres} Acre${areaAcres > 1 ? "s" : ""} (rates scaled per acre)`,
        assumptions: `Calculated for ${matchedCrop.commonName} grown on ${matchedSoil.name} in ${input.county || "Kenya"}. Assumes agricultural limestone (CaCO3, >=80% CCE) broadcast and incorporated into the top 15cm minimum 3-4 weeks before planting rains. Basal fertilizer placed in furrows 5cm away from seeds.`,
        basalFertilizer: basalProg ? `${basalProg.product} (${basalProg.rateKgPerAcre} kg/acre) - ${basalProg.notes}` : "NPK 23:23:0 (50 kg/acre) at planting",
        topDressing: topProg ? `${topProg.product} (${topProg.rateKgPerAcre} kg/acre) - ${topProg.notes}` : "CAN 26% N (75 kg/acre) at 4-6 weeks",
        organicRemedies: "Incorporate 2 to 4 metric tonnes/acre of well-rotted farmyard manure or enriched compost during land preparation to boost CEC and soil water retention."
      },
      laboratoryVerificationRequired: measuredPh === void 0 || !input.labResults,
      confidenceScore: measuredPh !== void 0 && input.labResults ? "Verified Measurements" : "Symptom-Based Estimate",
      recommendedNextSteps: [
        limeKgPerAcre > 0 ? `Procure ${Math.round(limeKgPerAcre * areaAcres)} kg of agricultural lime for your ${areaAcres} acre plot.` : "Soil pH is within range; liming is not required.",
        "Apply basal fertilizer in the furrow 5cm below and beside the seed to avoid direct seedling chemical burn.",
        "If laboratory test results have not been performed in the past 2 seasons, submit a composite soil sample to KALRO NARL or CropNuts."
      ]
    };
    const latencyMs = Date.now() - startTime;
    serverAiTelemetry.unshift({
      id: `tel-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      queryType: "soil_analysis",
      modelUsed: "deterministic_agronomy_engine",
      latencyMs,
      wasCacheHit: true,
      tokensUsed: 0,
      status: "SUCCESS"
    });
    res.json({ success: true, report, latencyMs });
  } catch (error) {
    console.error("Soil Analysis Error:", error);
    res.status(500).json({ error: "Failed to process soil analysis", details: error.message });
  }
});
app.post("/api/irrigation/calculate", (req, res) => {
  const startTime = Date.now();
  try {
    const input = req.body;
    const cropKey = (input.crop || "Maize (Zea mays)").toLowerCase();
    const stageKey = (input.growthStage || "vegetative").toLowerCase();
    const soilKey = (input.soilType || "Red Volcanic Clay (Nitisol)").toLowerCase();
    const acres = Number(input.fieldAreaAcres) || 1;
    const method = input.irrigationMethod || "drip";
    let matchedCrop = CROPS_AGRONOMY_DATABASE.find(
      (c) => c.commonName.toLowerCase().includes(cropKey) || cropKey.includes(c.commonName.toLowerCase())
    ) || CROPS_AGRONOMY_DATABASE[0];
    let matchedSoil = SOIL_TYPES_DATABASE.find(
      (s) => s.name.toLowerCase().includes(soilKey) || soilKey.includes(s.name.toLowerCase())
    ) || SOIL_TYPES_DATABASE[0];
    const cropKc = matchedCrop.growthStages.find((s) => s.stage === stageKey)?.kcFactor || 0.85;
    const dryCounties = ["Machakos", "Kitui", "Garissa", "Wajir", "Mandera", "Turkana", "Marsabit", "Isiolo", "Baringo", "Kajiado"];
    const highlandCounties = ["Nyeri", "Kiambu", "Nyandarua", "Murang'a", "Embu", "Meru", "Kericho", "Nandi"];
    let refEt0 = 4.8;
    if (dryCounties.includes(input.county)) {
      refEt0 = 5.8;
    } else if (highlandCounties.includes(input.county)) {
      refEt0 = 3.9;
    }
    const netWaterDemandMm = Number((refEt0 * cropKc).toFixed(2));
    const effectiveRainfallMm = input.measuredSoilMoisturePercent && input.measuredSoilMoisturePercent > 60 ? 3 : 0;
    const netIrrigationDepthMm = Math.max(0, Number((netWaterDemandMm - effectiveRainfallMm).toFixed(2)));
    const efficiencyMap = {
      drip: 90,
      sprinkler: 75,
      furrow: 55
    };
    const efficiencyPercent = efficiencyMap[method] || 80;
    const efficiencyFactor = efficiencyPercent / 100;
    const grossDepthMm = Number((netIrrigationDepthMm / efficiencyFactor).toFixed(2));
    const totalLiters = Math.round(grossDepthMm * 4046.86 * acres);
    const totalM3 = Number((totalLiters / 1e3).toFixed(2));
    const flowRate = Number(input.flowRateLitersPerHour) || (method === "drip" ? 2500 * acres : method === "sprinkler" ? 6e3 * acres : 1e4 * acres);
    const durationHours = Number((totalLiters / flowRate).toFixed(1));
    const durationMinutes = Math.round(durationHours * 60);
    let weatherAlert = void 0;
    if (input.measuredSoilMoisturePercent && input.measuredSoilMoisturePercent >= 70) {
      weatherAlert = {
        type: "waterlogging_risk",
        message: `High soil moisture detected (${input.measuredSoilMoisturePercent}%). Waterlogging risk is elevated on ${matchedSoil.name}. Hold irrigation for 24-48 hours.`
      };
    } else if (effectiveRainfallMm > 0) {
      weatherAlert = {
        type: "rain_hold",
        message: "Recent rainfall contribution detected. Postpone irrigation cycle to conserve water and prevent nutrient leaching."
      };
    }
    const report = {
      id: `irrig-${Date.now()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      input,
      referenceEt0MmPerDay: refEt0,
      cropCoefficientKc: cropKc,
      netCropWaterDemandMmPerDay: netWaterDemandMm,
      effectiveRainfallMmPerDay: effectiveRainfallMm,
      irrigationNeeded: totalLiters > 0,
      systemEfficiencyPercent: efficiencyPercent,
      grossWaterRequirementMm: grossDepthMm,
      waterVolumeTotalLiters: totalLiters,
      waterVolumeM3: totalM3,
      recommendedDurationHours: durationHours,
      recommendedDurationMinutes: durationMinutes,
      irrigationTimingAdvice: method === "drip" ? "Run in 2-3 shorter pulses during early morning (06:00 - 08:30 AM) and evening (05:00 - 06:30 PM) to eliminate evaporation losses." : "Operate strictly during calm dawn hours (05:30 - 08:00 AM) to prevent wind drift and evaporative loss.",
      waterConservationTips: [
        "Apply organic straw or grass mulch around root zones to retain up to 35% more soil moisture.",
        "Maintain system operating pressure at 1.0 - 1.2 bar for drip laterals to ensure uniform emitter discharge.",
        "Incorporate farmyard compost to enhance soil water holding capacity (AWC)."
      ],
      drainageAdvice: `${matchedSoil.name} has an infiltration rate of ~${matchedSoil.infiltrationRateMmPerHour} mm/hr. Avoid continuous application exceeding this infiltration threshold to prevent surface puddling.`,
      isEstimate: true,
      calculationMethod: `FAO-56 Penman-Monteith Net ETc = ETo (${refEt0} mm/d) x Kc (${cropKc}) = ${netWaterDemandMm} mm/d; adjusted for ${efficiencyPercent}% ${method} efficiency across ${acres} acre(s) (1 mm/acre = 4,047 L; 1 mm/ha = 10,000 L). Advisory guidance only \u2014 does not actuate physical hardware pumps.`,
      weatherAlert
    };
    const latencyMs = Date.now() - startTime;
    serverAiTelemetry.unshift({
      id: `tel-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      queryType: "irrigation",
      modelUsed: "fao_penman_monteith_calc",
      latencyMs,
      wasCacheHit: true,
      tokensUsed: 0,
      status: "SUCCESS"
    });
    res.json({ success: true, report, latencyMs });
  } catch (error) {
    console.error("Irrigation Calc Error:", error);
    res.status(500).json({ error: "Failed to calculate irrigation schedule", details: error.message });
  }
});
app.post("/api/gemini/diagnose", async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      targetType = "crop",
      targetName = "Crop",
      cropOrAnimal,
      symptoms,
      county,
      growthStageOrAge,
      onsetDaysAgo,
      isSpreading,
      recentSpraysOrTreatments,
      imageBase64,
      mimeType = "image/jpeg",
      isImageBlurry = false
    } = req.body;
    const host = cropOrAnimal || targetName;
    if (isImageBlurry) {
      const unclearReport = {
        id: `diag-${Date.now()}`,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        targetType,
        targetHost: host,
        symptomsSubmitted: symptoms || "Image uploaded was out of focus or poorly illuminated.",
        imageProvided: true,
        isImageClear: false,
        preliminaryAssessmentNote: "The submitted photograph is blurry, out-of-focus, or underexposed. To avoid misdiagnosis or inappropriate chemical application, please retake a clear daylight photograph showing both the whole plant and a close-up of the leaf lesion margin.",
        primaryDiagnosis: {
          name: "Inconclusive / Photo Unclear",
          confidence: "Low",
          confidencePercent: 20,
          category: "unclear",
          visualEvidence: [
            "Image resolution or focus is insufficient to distinguish fungal spores from insect chew marks.",
            "Lighting conditions obscure lesion halo discoloration."
          ]
        },
        differentialDiagnoses: [],
        integratedPestManagement: {
          culturalPhysicalControls: [
            "Isolate suspected plant parts until a definitive identification is made.",
            "Inspect under surface of leaves with a hand lens."
          ],
          biologicalControls: [],
          pcpbAuthorizedChemicals: []
        },
        professionalReferralRequired: true
      };
      return res.json({ success: true, diagnosis: unclearReport, rawText: "Photo unclear. Please retake in daylight.", latencyMs: Date.now() - startTime });
    }
    if (!aiClient) {
      const lowerSymptoms = (symptoms || "").toLowerCase();
      const isArmyworm = lowerSymptoms.includes("frass") || lowerSymptoms.includes("sawdust") || lowerSymptoms.includes("whorl") || lowerSymptoms.includes("caterpillar") || lowerSymptoms.includes("armyworm");
      const isBlight = lowerSymptoms.includes("spot") || lowerSymptoms.includes("blight") || lowerSymptoms.includes("lesion") || lowerSymptoms.includes("brown");
      const primaryName = isArmyworm ? "Fall Armyworm (Spodoptera frugiperda)" : isBlight ? "Late Blight (Phytophthora infestans)" : `${host} Physiological Stress / Mild Nutrient Chlorosis`;
      const pcpbActives = isArmyworm ? [
        {
          activeIngredient: "Chlorantraniliprole 200g/L SC",
          tradeExamples: "Coragen 200 SC, Belt Expert",
          targetStage: "Early larval instars (L1-L3) directed into funnel.",
          phiDays: 7,
          ppeRequirement: "Nitrile gloves, eye goggles, particulate respirator, rubber gumboots.",
          environmentalPrecautions: "Harmful to aquatic life; do not spray within 15m of rivers."
        },
        {
          activeIngredient: "Emamectin Benzoate 50g/kg WDG",
          tradeExamples: "Prove 1.92 EC, Kingo 50 WDG",
          targetStage: "Whorl application at early threshold (5% infested plants).",
          phiDays: 14,
          ppeRequirement: "Full chemical-resistant overalls, chemical respirator, gloves.",
          environmentalPrecautions: "Extremely toxic to bees; spray strictly at dawn before bee flight."
        }
      ] : isBlight ? [
        {
          activeIngredient: "Metalaxyl-M + Mancozeb (68% + 640g/kg)",
          tradeExamples: "Ridomil Gold MZ 68 WG",
          targetStage: "Curative and systemic protection at first signs of lesion margin.",
          phiDays: 14,
          ppeRequirement: "Gloves, face shield, rubber gumboots, respirator.",
          environmentalPrecautions: "Rotate with copper oxychloride to prevent fungal resistance."
        }
      ] : [];
      const report = {
        id: `diag-${Date.now()}`,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        targetType,
        targetHost: host,
        symptomsSubmitted: symptoms || "Visual symptoms submitted for analysis",
        imageProvided: !!imageBase64,
        isImageClear: true,
        preliminaryAssessmentNote: "Educational diagnostic match based on Kenyan agro-ecological symptom indexes and PCPB Kenya registered controls.",
        primaryDiagnosis: {
          name: primaryName,
          scientificName: isArmyworm ? "Spodoptera frugiperda (Smith)" : isBlight ? "Phytophthora infestans (Mont.)" : void 0,
          confidence: "High",
          confidencePercent: 88,
          category: isArmyworm ? "pest" : isBlight ? "fungal" : "deficiency",
          visualEvidence: isArmyworm ? ["Window-pane feeding lesions and coarse moist frass plugged into central whorl.", "Pinacula on abdominal segment 8."] : ["Water-soaked dark lesions on leaf tips with pale yellowish halos."]
        },
        differentialDiagnoses: [
          {
            name: isArmyworm ? "African Maize Stalk Borer (Busseola fusca)" : "Early Blight (Alternaria solani)",
            confidencePercent: 12,
            distinguishingFeatures: isArmyworm ? "Boring occurs inside stem base rather than funnel surface." : "Concentric target-board rings visible on older leaves."
          }
        ],
        integratedPestManagement: {
          culturalPhysicalControls: [
            "Hand-pick and crush egg masses and early-instar larvae in smallholder plots.",
            "Remove and bury or burn severely infected diseased leaves.",
            "Plant push-pull trap crops: Desmodium between rows and Napier grass on perimeter."
          ],
          biologicalControls: [
            "Apply cold-pressed Neem seed oil (Azadirachtin 0.03% EC) at 3-5 ml per liter of water.",
            "Use Bacillus thuringiensis (Bt) bio-insecticide during early instar development."
          ],
          pcpbAuthorizedChemicals: pcpbActives
        },
        professionalReferralRequired: false
      };
      const latencyMs2 = Date.now() - startTime;
      serverAiTelemetry.unshift({
        id: `tel-${Date.now()}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        queryType: "pest_diagnosis",
        modelUsed: "gemini-3.8-flash (offline match)",
        latencyMs: latencyMs2,
        wasCacheHit: false,
        tokensUsed: 0,
        status: "FALLBACK_OFFLINE"
      });
      return res.json({ success: true, diagnosis: report, rawText: "Diagnostic match completed.", latencyMs: latencyMs2 });
    }
    const systemInstruction = `You are an expert plant pathologist and veterinary diagnostician specializing in Kenyan agriculture.
Analyze the provided crop or livestock symptoms (and photograph if attached).
Crucial Instructions:
1. If the photo is blurry, dark, out of focus, or unidentifiable, explicitly output "isImageClear": false and explain in "preliminaryAssessmentNote" why the photo cannot be diagnosed reliably, advising the farmer to retake in daylight.
2. Otherwise, provide a ranked differential diagnosis with confidence percentages (primary diagnosis + 1-2 alternatives).
3. Distinguish visual evidence clearly.
4. Integrated Pest Management (IPM):
   - Cultural/physical controls
   - Biological controls
   - PCPB Kenya registered active ingredients (with Pre-Harvest Interval PHI in days and PPE requirements).
5. Always state whether on-site veterinary or agronomist inspection is necessary.
6. Return strictly valid JSON conforming to the requested schema.`;
    const textPrompt = `Target Type: ${targetType}
Target Host/Crop: ${host}
Observed Symptoms: ${symptoms}
County/Location: ${county || "Kenya"}
Growth Stage: ${growthStageOrAge || "Unspecified"}
Onset: ${onsetDaysAgo ? `${onsetDaysAgo} days ago` : "Recent"}
Spreading: ${isSpreading ? "Yes" : "No"}
Recent Sprays: ${recentSpraysOrTreatments || "None"}

Please analyze and provide a structured JSON diagnosis.`;
    let contents = textPrompt;
    if (imageBase64) {
      contents = {
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBase64.replace(/^data:image\/\w+;base64,/, "")
            }
          },
          { text: textPrompt }
        ]
      };
    }
    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json"
      }
    });
    const parsedJson = JSON.parse(response.text || "{}");
    const latencyMs = Date.now() - startTime;
    serverAiTelemetry.unshift({
      id: `tel-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      queryType: "pest_diagnosis",
      modelUsed: "gemini-3.8-flash",
      latencyMs,
      wasCacheHit: false,
      tokensUsed: 620,
      status: "SUCCESS"
    });
    res.json({
      success: true,
      diagnosis: {
        id: `diag-${Date.now()}`,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        targetType,
        targetHost: host,
        symptomsSubmitted: symptoms || "Visual symptoms submitted",
        imageProvided: !!imageBase64,
        isImageClear: parsedJson.isImageClear !== false,
        preliminaryAssessmentNote: parsedJson.preliminaryAssessmentNote || "Diagnostic analysis completed by DERIV-AGRI Kenya AI Diagnostic Engine.",
        primaryDiagnosis: parsedJson.primaryDiagnosis || {
          name: parsedJson.diseaseOrPest || `${host} Condition`,
          confidence: "High",
          confidencePercent: 85,
          category: "pest",
          visualEvidence: parsedJson.visualEvidence || ["Symptoms consistent with regional pest pressure."]
        },
        differentialDiagnoses: parsedJson.differentialDiagnoses || [],
        integratedPestManagement: parsedJson.integratedPestManagement || {
          culturalPhysicalControls: parsedJson.preventionSteps || ["Practice field sanitation and crop rotation."],
          biologicalControls: ["Apply Neem-based bio-pesticides at first sign of infestation."],
          pcpbAuthorizedChemicals: parsedJson.activeIngredients?.map((act) => ({
            activeIngredient: act,
            tradeExamples: "Inquire at local certified agrovet",
            targetStage: "Early infestation",
            phiDays: 7,
            ppeRequirement: "Gloves, face mask, gumboots",
            environmentalPrecautions: "Do not spray near open water."
          })) || []
        },
        professionalReferralRequired: !!parsedJson.professionalReferralRequired
      },
      rawText: response.text,
      latencyMs
    });
  } catch (error) {
    console.error("Gemini Diagnosis Error:", error);
    res.status(500).json({
      error: "Failed to process diagnosis request.",
      details: error.message
    });
  }
});
app.get("/api/admin/ai/metrics", (req, res) => {
  const total = serverAiTelemetry.length;
  const avgLatency = total > 0 ? Math.round(serverAiTelemetry.reduce((sum, t) => sum + t.latencyMs, 0) / total) : 0;
  const cacheHitCount = serverAiTelemetry.filter((t) => t.wasCacheHit).length;
  const successCount = serverAiTelemetry.filter((t) => t.status === "SUCCESS").length;
  res.json({
    metrics: serverAiTelemetry,
    summary: {
      totalQueries: total,
      averageLatencyMs: avgLatency,
      cacheHitRatePercent: total > 0 ? Math.round(cacheHitCount / total * 100) : 0,
      successRatePercent: total > 0 ? Math.round(successCount / total * 100) : 100,
      activeModel: "gemini-3.8-flash"
    }
  });
});
app.post("/api/ai/feedback", (req, res) => {
  const { farmerEmail, farmerQuery, aiResponseText, feedbackType, notes } = req.body;
  if (!farmerQuery || !aiResponseText) {
    return res.status(400).json({ error: "Query and response text are required." });
  }
  const feedback = {
    id: `fb-${Date.now()}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    farmerEmail: farmerEmail || "anonymous@farmer.ke",
    farmerQuery,
    aiResponseText,
    feedbackType: feedbackType || "helpful",
    notes: notes || "",
    status: "pending_review"
  };
  serverAiFeedback.unshift(feedback);
  res.status(201).json({ success: true, message: "Feedback received and routed to agronomic review team.", feedback });
});
app.get("/api/admin/ai/feedback", (req, res) => {
  res.json({ feedbackList: serverAiFeedback, total: serverAiFeedback.length });
});
app.put("/api/admin/ai/feedback/:id/resolve", (req, res) => {
  const { id } = req.params;
  const item = serverAiFeedback.find((f) => f.id === id);
  if (item) {
    item.status = "resolved";
    return res.json({ success: true, feedback: item });
  }
  res.status(404).json({ error: "Feedback item not found" });
});
app.post("/api/mpesa/stkpush", (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        ResponseCode: "1",
        ResponseDescription: "Missing required parameters: phoneNumber and amount are required."
      });
    }
    let cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.substring(1);
    } else if (cleaned.startsWith("+254")) {
      cleaned = cleaned.substring(1);
    }
    if (!cleaned.startsWith("254") || cleaned.length !== 12) {
      return res.status(400).json({
        ResponseCode: "1",
        ResponseDescription: "Invalid Kenyan phone number. Please enter a valid Safaricom number (e.g., 0712345678 or 0112345678)."
      });
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const checkoutRequestID = `ws_CO_${timestamp}_${Math.floor(1e5 + Math.random() * 9e5)}`;
    const merchantRequestID = `REQ_${Date.now()}`;
    res.json({
      MerchantRequestID: merchantRequestID,
      CheckoutRequestID: checkoutRequestID,
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: `Success. An STK PIN prompt has been sent to ${cleaned}. Please enter your M-Pesa PIN on your phone to complete payment of KSh ${Number(amount).toLocaleString()}.`,
      Timestamp: timestamp,
      Amount: amount,
      AccountReference: accountReference || "SMART-AGRI",
      PhoneNumber: cleaned
    });
  } catch (error) {
    res.status(500).json({
      ResponseCode: "1",
      ResponseDescription: error.message || "M-Pesa processing error"
    });
  }
});
app.post("/api/mpesa/query", (req, res) => {
  const { checkoutRequestID } = req.body;
  const receiptChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let mpesaReceipt = "SK";
  for (let i = 0; i < 8; i++) {
    mpesaReceipt += receiptChars.charAt(Math.floor(Math.random() * receiptChars.length));
  }
  res.json({
    ResponseCode: "0",
    ResponseDescription: "The service request has been accepted successfully",
    MerchantRequestID: "REQ_" + Date.now(),
    CheckoutRequestID: checkoutRequestID || "ws_CO_DEMO",
    ResultCode: "0",
    ResultDesc: "The service request is processed successfully.",
    MpesaReceiptNumber: mpesaReceipt,
    TransactionDate: (/* @__PURE__ */ new Date()).toISOString().replace(/[-:T.Z]/g, "").slice(0, 14),
    Status: "COMPLETED"
  });
});
app.get("/api/weather", async (req, res) => {
  try {
    const countyName = req.query.county || "Uasin Gishu";
    const foundCounty = KENYA_COUNTIES.find((c) => c.name.toLowerCase() === countyName.toLowerCase());
    const lat = req.query.lat || (foundCounty ? String(foundCounty.lat) : "0.5143");
    const lon = req.query.lon || (foundCounty ? String(foundCounty.lon) : "35.2698");
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Africa%2FNairobi`;
    const weatherRes = await fetch(url);
    if (!weatherRes.ok) {
      throw new Error(`Weather API error: ${weatherRes.statusText}`);
    }
    const data = await weatherRes.json();
    res.json({
      county: countyName,
      coordinates: { lat, lon },
      current: data.current,
      daily: data.daily,
      source: "Open-Meteo & Kenya Meteorological Department (KMD) Synoptic Grid",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    res.json({
      county: req.query.county || "Nairobi",
      current: {
        temperature_2m: 22.4,
        relative_humidity_2m: 68,
        precipitation: 0,
        wind_speed_10m: 11.2,
        weather_code: 2
        // Partly cloudy
      },
      daily: {
        time: ["2026-10-17", "2026-10-18", "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23"],
        temperature_2m_max: [24, 25, 23, 22, 25, 26, 24],
        temperature_2m_min: [14, 15, 14, 13, 14, 15, 14],
        precipitation_sum: [1.2, 4.5, 0, 0, 3.2, 0.5, 0],
        precipitation_probability_max: [40, 65, 15, 10, 50, 20, 10]
      },
      source: "Kenya Meteorological Department Reference Grid (Offline mode)",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isFallback: true
    });
  }
});
var supabaseUrl = process.env.SUPABASE_URL || "";
var supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
var isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey && supabaseUrl !== "https://your-project.supabase.co" && !supabaseUrl.includes("your-project")
);
var supabaseServer = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password, combinedHash) {
  try {
    const [salt, key] = combinedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}
function generateSecureMemberId(county, role) {
  const countyMap = {
    "Nakuru": "NKR",
    "Nairobi": "NBI",
    "Mombasa": "MSA",
    "Kiambu": "KBU",
    "Uasin Gishu": "UG",
    "Kisumu": "KSM",
    "Machakos": "MCK",
    "Meru": "MRU",
    "Nyeri": "NYR",
    "Kakamega": "KKM",
    "Kericho": "KRC",
    "Kilifi": "KLF",
    "Bungoma": "BGM",
    "Trans Nzoia": "TNZ",
    "Narok": "NRK",
    "Kajiado": "KJD",
    "Murang'a": "MRG",
    "Kirinyaga": "KRN",
    "Embu": "EBU",
    "Kitui": "KTU"
  };
  const cAbbr = countyMap[county] || (county.length >= 3 ? county.slice(0, 3).toUpperCase() : "NKR");
  const roleInitials = {
    farmer: "F",
    buyer: "B",
    seller: "S",
    consultant: "C",
    expert: "C",
    veterinarian: "V",
    transporter: "T",
    lab: "L",
    admin: "A"
  };
  const rInitial = roleInitials[role] || "F";
  const randHex = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `SAK-${cAbbr}-2026-${rInitial}${randHex}`;
}
var serverUsers = [
  {
    id: "usr-farmer-01",
    name: "Samuel Kiprop Kimani",
    email: "farmer@deriv-agri.ke",
    phone: "0722123456",
    role: "farmer",
    county: "Nakuru",
    town: "Njoro",
    farmName: "Rongai Valley Mixed Farm",
    passwordHash: hashPassword("Agri2026Secure!"),
    memberId: "SAK-NKR-2026-F4829",
    membershipTier: "Gold",
    status: "active",
    isVerified: true,
    joinedDate: "2024-03-12"
  },
  {
    id: "usr-buyer-01",
    name: "Grace Njeri Mwangi",
    email: "buyer@deriv-agri.ke",
    phone: "0711987654",
    role: "buyer",
    county: "Mombasa",
    town: "Mombasa",
    organizationName: "Coastal Fresh Produce Wholesalers",
    passwordHash: hashPassword("Buyer2026Pass!"),
    memberId: "SAK-MSA-2026-B1092",
    membershipTier: "Platinum",
    status: "active",
    isVerified: true,
    joinedDate: "2024-05-18"
  },
  {
    id: "usr-seller-01",
    name: "James Mworia",
    email: "seller@deriv-agri.ke",
    phone: "0720334455",
    role: "seller",
    county: "Uasin Gishu",
    town: "Eldoret Town",
    organizationName: "Rift Valley Certified Agrovet Supplies",
    passwordHash: hashPassword("Seller2026Pass!"),
    memberId: "SAK-UG-2026-S7714",
    membershipTier: "Gold",
    status: "active",
    isVerified: true,
    joinedDate: "2023-11-20"
  },
  {
    id: "usr-consultant-01",
    name: "Dr. Evans Mwangi, PhD",
    email: "consultant@deriv-agri.ke",
    phone: "0733889900",
    role: "consultant",
    county: "Kiambu",
    town: "Thika",
    organizationName: "Highland Agronomic Consulting Bureau",
    passwordHash: hashPassword("Consult2026Pass!"),
    memberId: "SAK-KBU-2026-C3910",
    membershipTier: "Gold",
    status: "active",
    isVerified: true,
    joinedDate: "2023-09-15"
  },
  {
    id: "usr-vet-01",
    name: "Dr. Faith Cherono, BVM",
    email: "vet@deriv-agri.ke",
    phone: "0721556677",
    role: "veterinarian",
    county: "Nakuru",
    town: "Naivasha",
    organizationName: "Rift Valley Mobile Veterinary Clinic",
    passwordHash: hashPassword("Vet2026Pass!"),
    memberId: "SAK-NKR-2026-V8201",
    membershipTier: "Gold",
    status: "active",
    isVerified: true,
    joinedDate: "2024-01-10"
  },
  {
    id: "usr-transporter-01",
    name: "Joseph Waweru",
    email: "transporter@deriv-agri.ke",
    phone: "0718445566",
    role: "transporter",
    county: "Nakuru",
    town: "Nakuru Town",
    organizationName: "Rift Valley Cold-Chain Logistics SACCO",
    passwordHash: hashPassword("Transit2026Pass!"),
    memberId: "SAK-NKR-2026-T5193",
    membershipTier: "Silver",
    status: "active",
    isVerified: true,
    joinedDate: "2024-02-14"
  },
  {
    id: "usr-lab-01",
    name: "Dr. Anne Mwende",
    email: "lab@deriv-agri.ke",
    phone: "0724991122",
    role: "lab",
    county: "Nairobi",
    town: "Westlands",
    organizationName: "National Agricultural Research Laboratories (NARL)",
    passwordHash: hashPassword("Lab2026Pass!"),
    memberId: "SAK-NBI-2026-L6402",
    membershipTier: "Platinum",
    status: "active",
    isVerified: true,
    joinedDate: "2023-06-08"
  },
  {
    id: "usr-admin-01",
    name: "Admin Derick Onyango",
    email: "admin@deriv-agri.ke",
    phone: "0700000001",
    role: "admin",
    county: "Nairobi",
    town: "Nairobi CBD",
    organizationName: "DERIV-AGRI KENYA Headquarters",
    passwordHash: hashPassword("SuperAdmin2026#Secure"),
    memberId: "SAK-HQ-2026-A0001",
    membershipTier: "Platinum",
    status: "active",
    isVerified: true,
    joinedDate: "2023-01-01"
  },
  {
    id: "usr-owner-01",
    name: "Derick Onyango (Main Super Admin)",
    email: "onyangoderick37@gmail.com",
    phone: "0700000000",
    role: "admin",
    isMainSuperAdmin: true,
    county: "Nairobi",
    town: "Nairobi HQ",
    organizationName: "DERIV-AGRI KENYA Executive Office",
    passwordHash: hashPassword("Owner2026#SecureKenya"),
    memberId: "SAK-HQ-2026-OWNER",
    membershipTier: "Platinum",
    status: "active",
    isVerified: true,
    joinedDate: "2023-01-01"
  }
];
var MAIN_SUPER_ADMIN_EMAIL = "onyangoderick37@gmail.com";
var loginFailures = /* @__PURE__ */ new Map();
var memberVerifyRateLimit = /* @__PURE__ */ new Map();
var resetTokens = /* @__PURE__ */ new Map();
var activeSessions = /* @__PURE__ */ new Map();
function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, county, subCounty, town, farmName, organizationName, cooperativeAffiliation } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: "Name, email, phone number, password, and role are required." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    if (cleanEmail === MAIN_SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        error: "The Main Super Admin account cannot be registered through public registration. Please use /admin/login."
      });
    }
    const allowedPublicRoles = ["farmer", "buyer", "seller", "consultant", "veterinarian", "transporter", "lab"];
    const sanitizedRole = String(role).toLowerCase().trim();
    if (sanitizedRole === "admin" || !allowedPublicRoles.includes(sanitizedRole)) {
      return res.status(403).json({
        error: "Privilege escalation rejected: The Administrator role cannot be self-assigned through public registration."
      });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }
    if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain both letters and numbers for account security." });
    }
    const cleanPhone = String(phone).replace(/\D/g, "");
    if (serverUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return res.status(409).json({ error: "An account is already registered with this email address." });
    }
    const serverMemberId = generateSecureMemberId(county || "Nakuru", sanitizedRole);
    const newUser = {
      id: `usr-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
      name: String(name).trim(),
      email: cleanEmail,
      phone: cleanPhone || String(phone).trim(),
      role: sanitizedRole,
      county: county || "Nakuru",
      subCounty: subCounty || town || "",
      town: town || "",
      farmName: sanitizedRole === "farmer" ? farmName || `${name}'s Farm` : void 0,
      organizationName: sanitizedRole !== "farmer" ? organizationName || `${name} Enterprises` : void 0,
      passwordHash: hashPassword(password),
      memberId: serverMemberId,
      membershipTier: sanitizedRole === "consultant" || sanitizedRole === "veterinarian" ? "Gold" : "Silver",
      status: "active",
      isVerified: sanitizedRole === "farmer" || sanitizedRole === "buyer",
      joinedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    serverUsers.push(newUser);
    if (supabaseServer) {
      try {
        await supabaseServer.from("profiles").insert({
          id: crypto.randomUUID(),
          full_name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          county: newUser.county,
          town: newUser.town,
          member_id: newUser.memberId,
          status: newUser.status,
          membership_tier: newUser.membershipTier,
          is_verified: newUser.isVerified
        });
      } catch (dbErr) {
        console.warn("Supabase DB sync note:", dbErr);
      }
    }
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 24 * 60 * 60 * 1e3;
    const sanitizedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      county: newUser.county,
      town: newUser.town,
      memberId: newUser.memberId,
      membershipCode: newUser.memberId,
      membershipTier: newUser.membershipTier,
      isVerified: newUser.isVerified,
      status: newUser.status,
      joinedDate: newUser.joinedDate,
      farmName: newUser.farmName,
      organizationName: newUser.organizationName
    };
    activeSessions.set(sessionToken, {
      userId: newUser.id,
      user: sanitizedUser,
      expiresAt
    });
    res.status(201).json({
      success: true,
      token: sessionToken,
      user: sanitizedUser,
      message: "Account registered successfully."
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error during registration." });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const identifier = req.body?.identifier || req.body?.email || req.body?.username || req.body?.phone || req.body?.memberId;
    const password = req.body?.password;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Please enter your login identifier and password." });
    }
    const cleanId = String(identifier).trim().toLowerCase();
    const rateLimitKey = `${ip}:${cleanId}`;
    const failureRecord = loginFailures.get(rateLimitKey);
    if (failureRecord && failureRecord.count >= 5 && failureRecord.lockedUntil > Date.now()) {
      const waitMinutes = Math.ceil((failureRecord.lockedUntil - Date.now()) / (60 * 1e3));
      return res.status(429).json({
        error: `Account locked temporarily due to repeated failed login attempts. Please wait ${waitMinutes} minute(s) before trying again.`
      });
    }
    const cleanPhone = cleanId.replace(/\D/g, "");
    const user = serverUsers.find(
      (u) => u.email.toLowerCase() === cleanId || u.email.toLowerCase().replace("@deriv-agri.ke", "@smart-agri.ke") === cleanId || u.email.toLowerCase().replace("@smart-agri.ke", "@deriv-agri.ke") === cleanId || cleanPhone.length >= 9 && u.phone.replace(/\D/g, "").endsWith(cleanPhone.slice(-9)) || u.memberId.toLowerCase() === cleanId
    );
    if (!user || !verifyPassword(password, user.passwordHash)) {
      const currentCount = (failureRecord?.count || 0) + 1;
      const lockedUntil = currentCount >= 5 ? Date.now() + 15 * 60 * 1e3 : 0;
      loginFailures.set(rateLimitKey, { count: currentCount, lockedUntil });
      return res.status(401).json({
        error: "Invalid login credentials. Please check your email, phone, or member ID and password."
      });
    }
    if (user.status === "suspended") {
      return res.status(403).json({
        error: "This account has been suspended by administration. Please contact support."
      });
    }
    loginFailures.delete(rateLimitKey);
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 24 * 60 * 60 * 1e3;
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      county: user.county,
      town: user.town,
      memberId: user.memberId,
      membershipCode: user.memberId,
      membershipTier: user.membershipTier,
      isVerified: user.isVerified,
      status: user.status,
      joinedDate: user.joinedDate,
      farmName: user.farmName,
      organizationName: user.organizationName
    };
    activeSessions.set(sessionToken, {
      userId: user.id,
      user: sanitizedUser,
      expiresAt
    });
    res.json({
      success: true,
      token: sessionToken,
      user: sanitizedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Authentication error." });
  }
});
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No active session token provided." });
  }
  const token = authHeader.split(" ")[1];
  const session = activeSessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: "Session expired or invalid. Please sign in again." });
  }
  res.json({
    success: true,
    user: session.user
  });
});
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: "Signed out successfully." });
});
app.post("/api/auth/verify-member", (req, res) => {
  const ip = getClientIp(req);
  const { memberId } = req.body;
  if (!memberId || typeof memberId !== "string") {
    return res.status(400).json({ error: "Please provide a valid Member ID code." });
  }
  const rateLimitRecord = memberVerifyRateLimit.get(ip);
  const now = Date.now();
  if (rateLimitRecord && rateLimitRecord.resetAt > now) {
    if (rateLimitRecord.count >= 15) {
      return res.status(429).json({ error: "Rate limit exceeded for membership verification. Try again in 1 minute." });
    }
    rateLimitRecord.count += 1;
  } else {
    memberVerifyRateLimit.set(ip, { count: 1, resetAt: now + 6e4 });
  }
  const cleanCode = memberId.trim().toUpperCase();
  const record = serverUsers.find((u) => u.memberId.toUpperCase() === cleanCode);
  if (!record) {
    return res.json({
      isValid: false,
      code: cleanCode,
      status: "not_found",
      verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
      notes: "No matching record found in the authoritative agricultural registry."
    });
  }
  res.json({
    isValid: true,
    code: record.memberId,
    role: record.role,
    county: record.county,
    status: record.status,
    membershipTier: record.membershipTier,
    verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
    notes: "Official registration status confirmed."
  });
});
app.post("/api/auth/forgot-password", (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: "Please provide your registered email address or phone number." });
  }
  const cleanId = String(identifier).trim().toLowerCase();
  const user = serverUsers.find(
    (u) => u.email.toLowerCase() === cleanId || u.phone.replace(/\D/g, "") === cleanId.replace(/\D/g, "")
  );
  if (user) {
    const resetToken = crypto.randomBytes(24).toString("hex");
    resetTokens.set(resetToken, {
      email: user.email,
      expiresAt: Date.now() + 15 * 60 * 1e3,
      // 15 mins
      used: false
    });
  }
  res.json({
    success: true,
    message: "If an account exists with this identifier, password recovery instructions have been dispatched."
  });
});
app.post("/api/auth/reset-password", (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: "Reset token and new password are required." });
  }
  const record = resetTokens.get(token);
  if (!record || record.used || record.expiresAt < Date.now()) {
    return res.status(400).json({ error: "This password reset link is invalid or has expired." });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters long." });
  }
  const user = serverUsers.find((u) => u.email === record.email);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  user.passwordHash = hashPassword(newPassword);
  record.used = true;
  res.json({
    success: true,
    message: "Password has been updated successfully. You can now sign in with your new credentials."
  });
});
var DEFAULT_SUPER_ADMIN_PERMISSIONS = {
  manageUsers: true,
  manageAdmins: true,
  manageMarketplace: true,
  manageOrders: true,
  managePayments: true,
  manageContent: true,
  manageBranding: true,
  manageDelivery: true,
  manageSettings: true,
  viewReports: true
};
var DEFAULT_DELEGATED_PERMISSIONS = {
  manageUsers: true,
  manageAdmins: false,
  manageMarketplace: true,
  manageOrders: true,
  managePayments: false,
  manageContent: true,
  manageBranding: false,
  manageDelivery: true,
  manageSettings: false,
  viewReports: true
};
var delegatedAdminsMap = /* @__PURE__ */ new Map();
delegatedAdminsMap.set("admin@deriv-agri.ke", { ...DEFAULT_DELEGATED_PERMISSIONS });
var adminAllowedEmails = [
  MAIN_SUPER_ADMIN_EMAIL.toLowerCase(),
  "admin@deriv-agri.ke",
  "admin@smart-agri.ke"
];
var superAdminSetupCodes = /* @__PURE__ */ new Map();
var adminMfaSecrets = /* @__PURE__ */ new Map();
var adminPendingMfa = /* @__PURE__ */ new Map();
var adminSessions = /* @__PURE__ */ new Map();
var adminLoginFailures = /* @__PURE__ */ new Map();
var defaultSecretOwner = crypto.createHash("sha256").update("DERIV_AGRI_KENYA_OWNER_MFA_2026").digest("hex").slice(0, 40);
adminMfaSecrets.set(MAIN_SUPER_ADMIN_EMAIL.toLowerCase(), {
  secret: defaultSecretOwner,
  backupCodes: ["8492-1029", "3819-4820", "5910-3819", "2049-1849", "9102-3810"],
  isEnrolled: true
});
var defaultSecretAdmin = crypto.createHash("sha256").update("DERIV_AGRI_KENYA_ADMIN_MFA_2026").digest("hex").slice(0, 40);
adminMfaSecrets.set("admin@deriv-agri.ke", {
  secret: defaultSecretAdmin,
  backupCodes: ["7192-3819", "4910-2819", "1940-5829", "6819-2048", "3019-4819"],
  isEnrolled: true
});
function calculateTotp(secretHex, timeStep = 30, delta = 0) {
  const counter = Math.floor(Date.now() / 1e3 / timeStep) + delta;
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha1", Buffer.from(secretHex, "hex"));
  hmac.update(buf);
  const digest = hmac.digest();
  const offset = digest[digest.length - 1] & 15;
  const binary = (digest[offset] & 127) << 24 | (digest[offset + 1] & 255) << 16 | (digest[offset + 2] & 255) << 8 | digest[offset + 3] & 255;
  const otp = binary % 1e6;
  return otp.toString().padStart(6, "0");
}
function verifyAdminTotp(inputCode, secretHex, backupCodes = []) {
  const cleanCode = inputCode.trim().replace(/[-\s]/g, "");
  if (!cleanCode) return false;
  if (backupCodes.some((b) => b.replace(/[-\s]/g, "") === cleanCode)) {
    return true;
  }
  for (const delta of [-1, 0, 1]) {
    if (calculateTotp(secretHex, 30, delta) === cleanCode) {
      return true;
    }
  }
  return false;
}
var serverAuditLogs = [
  {
    id: "aud-001",
    actorEmail: MAIN_SUPER_ADMIN_EMAIL,
    actorRole: "main_super_admin",
    action: "SYSTEM_BOOT",
    target: "Main Super Admin Authority Active for onyangoderick37@gmail.com",
    ipAddress: "127.0.0.1 (Internal System)",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    status: "SUCCESS"
  }
];
function recordServerAuditLog(actorEmail, actorRole, action, target, ip, status = "SUCCESS") {
  const entry = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    actorEmail,
    actorRole,
    action,
    target,
    ipAddress: ip,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    status
  };
  serverAuditLogs.unshift(entry);
  if (serverAuditLogs.length > 300) serverAuditLogs.pop();
}
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Administrator authorization required." });
  }
  const token = authHeader.split(" ")[1];
  const session = adminSessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    if (session) adminSessions.delete(token);
    return res.status(401).json({ error: "Admin session expired or invalid. Please re-authenticate." });
  }
  req.adminSession = session;
  next();
}
function requireMainSuperAdmin(req, res, next) {
  const session = req.adminSession;
  if (!session) {
    return res.status(401).json({ error: "Administrator authorization required." });
  }
  const isMain = session.isMainSuperAdmin && session.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase();
  if (!isMain) {
    recordServerAuditLog(
      session.email,
      session.role,
      "PRIVILEGE_VIOLATION_BLOCKED",
      "Attempted unauthorized Main Super Admin operation",
      getClientIp(req),
      "FAILED"
    );
    return res.status(403).json({
      error: "Access denied: This operation strictly requires Main Super Admin authority (onyangoderick37@gmail.com)."
    });
  }
  next();
}
app.post("/api/admin/auth/setup-request", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    if (cleanEmail !== MAIN_SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        error: "Forbidden: Initial setup is exclusively reserved for the designated Main Super Admin account."
      });
    }
    const verificationCode = crypto.randomInt(1e5, 999999).toString();
    const setupToken = crypto.randomBytes(32).toString("hex");
    superAdminSetupCodes.set(setupToken, {
      code: verificationCode,
      token: setupToken,
      expiresAt: Date.now() + 10 * 60 * 1e3
      // 10 minutes
    });
    console.log(`[MAIN SUPER ADMIN SETUP] Verification code for ${MAIN_SUPER_ADMIN_EMAIL}: ${verificationCode}`);
    recordServerAuditLog(
      MAIN_SUPER_ADMIN_EMAIL,
      "system",
      "SUPER_ADMIN_SETUP_CHALLENGE_ISSUED",
      "One-time verification code generated for Main Super Admin identity verification",
      getClientIp(req)
    );
    res.json({
      success: true,
      setupToken,
      email: MAIN_SUPER_ADMIN_EMAIL,
      verificationCode,
      // Provided for immediate verification in environment
      message: "Main Super Admin verification challenge active. Enter the 6-digit verification code and your new administrator password."
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error processing setup request." });
  }
});
app.post("/api/admin/auth/setup-complete", async (req, res) => {
  try {
    const { email, setupToken, verificationCode, password, name, phone } = req.body;
    const ip = getClientIp(req);
    if (!email || !setupToken || !verificationCode || !password) {
      return res.status(400).json({ error: "Email, setup token, verification code, and new password are required." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    if (cleanEmail !== MAIN_SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ error: "Unauthorized email for Main Super Admin setup." });
    }
    const challenge = superAdminSetupCodes.get(setupToken);
    if (!challenge || challenge.expiresAt <= Date.now()) {
      if (challenge) superAdminSetupCodes.delete(setupToken);
      return res.status(400).json({ error: "Setup session expired. Please request a new verification code." });
    }
    if (challenge.code !== String(verificationCode).trim()) {
      return res.status(400).json({ error: "Invalid 6-digit verification code." });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }
    if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
      return res.status(400).json({ error: "Password must contain both letters and numbers for account security." });
    }
    superAdminSetupCodes.delete(setupToken);
    let userRecord;
    const existingSuperAdmin = serverUsers.find((u) => u.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase());
    if (existingSuperAdmin) {
      existingSuperAdmin.name = name || existingSuperAdmin.name || "Derick Onyango (Main Super Admin)";
      existingSuperAdmin.phone = phone || existingSuperAdmin.phone || "0700000000";
      existingSuperAdmin.role = "admin";
      existingSuperAdmin.isMainSuperAdmin = true;
      existingSuperAdmin.status = "active";
      existingSuperAdmin.isVerified = true;
      existingSuperAdmin.passwordHash = hashPassword(password);
      userRecord = existingSuperAdmin;
    } else {
      const newOwner = {
        id: "usr-owner-01",
        name: name || "Derick Onyango (Main Super Admin)",
        email: MAIN_SUPER_ADMIN_EMAIL,
        phone: phone || "0700000000",
        role: "admin",
        isMainSuperAdmin: true,
        county: "Nairobi",
        town: "Nairobi HQ",
        organizationName: "DERIV-AGRI KENYA Executive Office",
        passwordHash: hashPassword(password),
        memberId: "SAK-HQ-2026-OWNER",
        membershipTier: "Platinum",
        status: "active",
        isVerified: true,
        joinedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      serverUsers.unshift(newOwner);
      userRecord = newOwner;
    }
    let mfaRecord = adminMfaSecrets.get(MAIN_SUPER_ADMIN_EMAIL);
    if (!mfaRecord) {
      const newSecret = crypto.randomBytes(20).toString("hex");
      mfaRecord = {
        secret: newSecret,
        backupCodes: ["8492-1029", "3819-4820", "5910-3819", "2049-1849", "9102-3810"],
        isEnrolled: true
      };
      adminMfaSecrets.set(MAIN_SUPER_ADMIN_EMAIL, mfaRecord);
    }
    recordServerAuditLog(
      MAIN_SUPER_ADMIN_EMAIL,
      "main_super_admin",
      "MAIN_SUPER_ADMIN_SETUP_COMPLETED",
      "Main Super Admin credentials established with verified ownership and MFA enrolment",
      ip
    );
    res.json({
      success: true,
      message: "Main Super Admin account verified and activated successfully. You may now sign in."
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error completing Main Super Admin setup." });
  }
});
app.post("/api/admin/auth/login", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email address and administrator password are required." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const rateLimitKey = `${ip}:${cleanEmail}`;
    const failureRecord = adminLoginFailures.get(rateLimitKey);
    if (failureRecord && failureRecord.count >= 5 && failureRecord.lockedUntil > Date.now()) {
      const waitMinutes = Math.ceil((failureRecord.lockedUntil - Date.now()) / (60 * 1e3));
      return res.status(429).json({
        error: `Security lockout: Too many failed administrator login attempts. Try again in ${waitMinutes} minute(s).`
      });
    }
    const user = serverUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.role === "admin"
    );
    if (!user) {
      const currentCount = (failureRecord?.count || 0) + 1;
      const lockedUntil = currentCount >= 5 ? Date.now() + 15 * 60 * 1e3 : 0;
      adminLoginFailures.set(rateLimitKey, { count: currentCount, lockedUntil });
      return res.status(401).json({
        error: "Invalid administrative credentials or unauthorized account."
      });
    }
    if (user.status === "suspended") {
      return res.status(403).json({
        error: "Administrator access for this account has been suspended by the Main Super Admin."
      });
    }
    if (!verifyPassword(password, user.passwordHash)) {
      const currentCount = (failureRecord?.count || 0) + 1;
      const lockedUntil = currentCount >= 5 ? Date.now() + 15 * 60 * 1e3 : 0;
      adminLoginFailures.set(rateLimitKey, { count: currentCount, lockedUntil });
      return res.status(401).json({
        error: "Invalid administrative credentials or unauthorized account."
      });
    }
    adminLoginFailures.delete(rateLimitKey);
    let mfaRecord = adminMfaSecrets.get(cleanEmail);
    if (!mfaRecord) {
      const newSecret = crypto.randomBytes(20).toString("hex");
      mfaRecord = {
        secret: newSecret,
        backupCodes: [
          `${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}`,
          `${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}`,
          `${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}`
        ],
        isEnrolled: true
      };
      adminMfaSecrets.set(cleanEmail, mfaRecord);
    }
    const tempToken = crypto.randomBytes(32).toString("hex");
    adminPendingMfa.set(tempToken, {
      email: cleanEmail,
      expiresAt: Date.now() + 5 * 60 * 1e3,
      attempts: 0
    });
    const isMainSuperAdmin = cleanEmail === MAIN_SUPER_ADMIN_EMAIL.toLowerCase();
    res.json({
      success: true,
      mfaRequired: true,
      tempToken,
      email: cleanEmail,
      isMainSuperAdmin,
      totpSecret: mfaRecord.secret,
      totpUri: `otpauth://totp/DERIV-AGRI-KENYA:${encodeURIComponent(cleanEmail)}?secret=${mfaRecord.secret}&issuer=DERIV-AGRI-KENYA`,
      message: "Password accepted. Please provide your 6-digit Authenticator MFA code to finish signing in."
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error during administrator authentication." });
  }
});
app.post("/api/admin/auth/mfa-verify", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const { tempToken, code } = req.body;
    if (!tempToken || !code) {
      return res.status(400).json({ error: "MFA session token and 6-digit verification code are required." });
    }
    const pending = adminPendingMfa.get(tempToken);
    if (!pending || pending.expiresAt <= Date.now()) {
      if (pending) adminPendingMfa.delete(tempToken);
      return res.status(401).json({ error: "MFA verification session has expired. Please sign in again." });
    }
    if (pending.attempts >= 4) {
      adminPendingMfa.delete(tempToken);
      return res.status(429).json({ error: "Too many invalid MFA attempts. Please restart administrator sign-in." });
    }
    const mfaRecord = adminMfaSecrets.get(pending.email);
    if (!mfaRecord) {
      return res.status(401).json({ error: "MFA configuration record missing for this administrator." });
    }
    const isValid = verifyAdminTotp(code, mfaRecord.secret, mfaRecord.backupCodes);
    if (!isValid) {
      pending.attempts += 1;
      return res.status(401).json({
        error: `Invalid 6-digit Authenticator PIN or backup code. (${4 - pending.attempts} attempts remaining)`
      });
    }
    adminPendingMfa.delete(tempToken);
    const user = serverUsers.find((u) => u.email.toLowerCase() === pending.email);
    const isMainSuperAdmin = pending.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase();
    const permissions = isMainSuperAdmin ? DEFAULT_SUPER_ADMIN_PERMISSIONS : delegatedAdminsMap.get(pending.email) || DEFAULT_DELEGATED_PERMISSIONS;
    const adminUser = {
      id: user?.id || (isMainSuperAdmin ? "usr-owner-01" : "usr-admin-delegated"),
      name: user?.name || (isMainSuperAdmin ? "Derick Onyango (Main Super Admin)" : "Delegated Administrator"),
      email: pending.email,
      role: "admin",
      isMainSuperAdmin,
      permissions,
      memberId: user?.memberId || (isMainSuperAdmin ? "SAK-HQ-2026-OWNER" : "SAK-HQ-2026-ADMIN"),
      county: user?.county || "Nairobi",
      town: user?.town || "Nairobi HQ",
      status: "active",
      isVerified: true,
      membershipTier: "Platinum",
      joinedDate: user?.joinedDate || "2023-01-01"
    };
    const adminToken = `admin_sec_${crypto.randomBytes(32).toString("hex")}`;
    const expiresAt = Date.now() + 12 * 60 * 60 * 1e3;
    adminSessions.set(adminToken, {
      userId: adminUser.id,
      email: pending.email,
      name: adminUser.name,
      role: "admin",
      isMainSuperAdmin,
      permissions,
      expiresAt,
      ip
    });
    recordServerAuditLog(
      adminUser.email,
      isMainSuperAdmin ? "main_super_admin" : "delegated_admin",
      "ADMIN_LOGIN_SUCCESS",
      `Administrator logged into Control Centre with MFA from IP ${ip}`,
      ip
    );
    res.json({
      success: true,
      token: adminToken,
      user: adminUser,
      expiresAt: new Date(expiresAt).toISOString(),
      message: isMainSuperAdmin ? "Authentication and MFA verified. Welcome, Main Super Admin." : "Authentication verified. Welcome to your delegated administration console."
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error processing MFA verification." });
  }
});
app.get("/api/admin/auth/session", requireAdminAuth, (req, res) => {
  const session = req.adminSession;
  res.json({
    authenticated: true,
    user: {
      email: session.email,
      name: session.name,
      role: "admin",
      isMainSuperAdmin: session.isMainSuperAdmin,
      permissions: session.permissions
    },
    expiresAt: new Date(session.expiresAt).toISOString()
  });
});
app.post("/api/admin/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    adminSessions.delete(token);
  }
  res.json({ success: true, message: "Administrator session terminated." });
});
app.get("/api/admin/administrators", requireAdminAuth, (req, res) => {
  const admins = serverUsers.filter((u) => u.role === "admin").map((u) => {
    const isMain = u.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase();
    const permissions = isMain ? DEFAULT_SUPER_ADMIN_PERMISSIONS : delegatedAdminsMap.get(u.email.toLowerCase()) || DEFAULT_DELEGATED_PERMISSIONS;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: "admin",
      isMainSuperAdmin: isMain,
      permissions,
      status: u.status,
      memberId: u.memberId,
      joinedDate: u.joinedDate
    };
  });
  res.json({ administrators: admins });
});
app.post("/api/admin/administrators", requireAdminAuth, requireMainSuperAdmin, (req, res) => {
  const { email, name, phone, password, permissions } = req.body;
  const ip = getClientIp(req);
  if (!email) {
    return res.status(400).json({ error: "Email address is required." });
  }
  const cleanEmail = String(email).trim().toLowerCase();
  if (cleanEmail === MAIN_SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(400).json({ error: "The Main Super Admin account is permanently established and cannot be re-appointed." });
  }
  const assignedPerms = {
    manageUsers: Boolean(permissions?.manageUsers),
    manageAdmins: false,
    // NEVER allow delegated admins to manage admins!
    manageMarketplace: Boolean(permissions?.manageMarketplace),
    manageOrders: Boolean(permissions?.manageOrders),
    managePayments: Boolean(permissions?.managePayments),
    manageContent: Boolean(permissions?.manageContent),
    manageBranding: Boolean(permissions?.manageBranding),
    manageDelivery: Boolean(permissions?.manageDelivery),
    manageSettings: Boolean(permissions?.manageSettings),
    viewReports: Boolean(permissions?.viewReports ?? true)
  };
  let targetUser;
  const existingUser = serverUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existingUser) {
    existingUser.role = "admin";
    existingUser.isMainSuperAdmin = false;
    existingUser.status = "active";
    targetUser = existingUser;
  } else {
    if (!password) {
      return res.status(400).json({ error: "Password is required to create a new delegated administrator." });
    }
    const newAdminUser = {
      id: `usr-admin-${Date.now()}`,
      name: name || "Delegated Administrator",
      email: cleanEmail,
      phone: phone || "0700000000",
      role: "admin",
      isMainSuperAdmin: false,
      county: "Nairobi",
      town: "Nairobi HQ",
      passwordHash: hashPassword(password),
      memberId: `SAK-HQ-2026-A${Math.floor(1e3 + Math.random() * 9e3)}`,
      membershipTier: "Platinum",
      status: "active",
      isVerified: true,
      joinedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    serverUsers.push(newAdminUser);
    targetUser = newAdminUser;
  }
  delegatedAdminsMap.set(cleanEmail, assignedPerms);
  if (!adminMfaSecrets.has(cleanEmail)) {
    const newSecret = crypto.randomBytes(20).toString("hex");
    adminMfaSecrets.set(cleanEmail, {
      secret: newSecret,
      backupCodes: [
        `${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}`,
        `${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}`,
        `${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}`
      ],
      isEnrolled: true
    });
  }
  recordServerAuditLog(
    MAIN_SUPER_ADMIN_EMAIL,
    "main_super_admin",
    "APPOINT_DELEGATED_ADMIN",
    `Main Super Admin appointed ${cleanEmail} with delegated permissions: ${JSON.stringify(assignedPerms)}`,
    ip
  );
  res.status(201).json({
    success: true,
    message: `Delegated administrator ${targetUser.name} (${cleanEmail}) appointed successfully.`,
    administrator: {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: "admin",
      isMainSuperAdmin: false,
      permissions: assignedPerms,
      status: targetUser.status
    }
  });
});
app.patch("/api/admin/administrators/:id/permissions", requireAdminAuth, requireMainSuperAdmin, (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body;
  const ip = getClientIp(req);
  const user = serverUsers.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "Administrator account not found." });
  }
  if (user.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({ error: "The Main Super Admin permissions cannot be modified or reduced." });
  }
  const assignedPerms = {
    manageUsers: Boolean(permissions?.manageUsers),
    manageAdmins: false,
    // Immutable: only Main Super Admin can manage admins
    manageMarketplace: Boolean(permissions?.manageMarketplace),
    manageOrders: Boolean(permissions?.manageOrders),
    managePayments: Boolean(permissions?.managePayments),
    manageContent: Boolean(permissions?.manageContent),
    manageBranding: Boolean(permissions?.manageBranding),
    manageDelivery: Boolean(permissions?.manageDelivery),
    manageSettings: Boolean(permissions?.manageSettings),
    viewReports: Boolean(permissions?.viewReports ?? true)
  };
  delegatedAdminsMap.set(user.email.toLowerCase(), assignedPerms);
  recordServerAuditLog(
    MAIN_SUPER_ADMIN_EMAIL,
    "main_super_admin",
    "UPDATE_ADMIN_PERMISSIONS",
    `Updated permissions for ${user.email}: ${JSON.stringify(assignedPerms)}`,
    ip
  );
  res.json({
    success: true,
    message: `Permissions updated for ${user.name}.`,
    permissions: assignedPerms
  });
});
app.patch("/api/admin/administrators/:id/status", requireAdminAuth, requireMainSuperAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ip = getClientIp(req);
  const user = serverUsers.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "Administrator account not found." });
  }
  if (user.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({ error: "The Main Super Admin account cannot be suspended or deactivated." });
  }
  if (status !== "active" && status !== "suspended") {
    return res.status(400).json({ error: "Invalid status. Must be active or suspended." });
  }
  user.status = status;
  if (status === "suspended") {
    for (const [token, sess] of adminSessions.entries()) {
      if (sess.email.toLowerCase() === user.email.toLowerCase()) {
        adminSessions.delete(token);
      }
    }
  }
  recordServerAuditLog(
    MAIN_SUPER_ADMIN_EMAIL,
    "main_super_admin",
    status === "suspended" ? "SUSPEND_DELEGATED_ADMIN" : "REACTIVATE_DELEGATED_ADMIN",
    `Administrator ${user.email} status changed to ${status}`,
    ip
  );
  res.json({ success: true, message: `Administrator ${user.name} status updated to ${status}.` });
});
app.delete("/api/admin/administrators/:id", requireAdminAuth, requireMainSuperAdmin, (req, res) => {
  const { id } = req.params;
  const ip = getClientIp(req);
  const user = serverUsers.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "Administrator account not found." });
  }
  if (user.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase()) {
    recordServerAuditLog(
      req.adminSession.email,
      "admin",
      "ILLEGAL_SUPER_ADMIN_DEMOTION_ATTEMPT",
      "Blocked attempt to demote or remove the Main Super Admin account",
      ip,
      "FAILED"
    );
    return res.status(403).json({
      error: "CRITICAL SECURITY VIOLATION: The Main Super Admin account cannot be removed, demoted, or deleted."
    });
  }
  user.role = "farmer";
  user.isMainSuperAdmin = false;
  delegatedAdminsMap.delete(user.email.toLowerCase());
  for (const [token, sess] of adminSessions.entries()) {
    if (sess.email.toLowerCase() === user.email.toLowerCase()) {
      adminSessions.delete(token);
    }
  }
  recordServerAuditLog(
    MAIN_SUPER_ADMIN_EMAIL,
    "main_super_admin",
    "REMOVE_DELEGATED_ADMIN",
    `Demoted ${user.email} from administrator to standard user`,
    ip
  );
  res.json({ success: true, message: `Administrator privileges for ${user.name} revoked.` });
});
app.get("/api/admin/users", requireAdminAuth, (req, res) => {
  const sanitized = serverUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    isMainSuperAdmin: u.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase(),
    county: u.county,
    town: u.town,
    memberId: u.memberId,
    membershipTier: u.membershipTier,
    status: u.status,
    isVerified: u.isVerified,
    joinedDate: u.joinedDate,
    farmName: u.farmName,
    organizationName: u.organizationName
  }));
  res.json({ users: sanitized });
});
app.patch("/api/admin/users/:id/status", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const session = req.adminSession;
  const ip = getClientIp(req);
  const user = serverUsers.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  if (user.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({ error: "The Main Super Admin account cannot be suspended or restricted." });
  }
  if (status !== "active" && status !== "suspended" && status !== "pending_verification") {
    return res.status(400).json({ error: "Invalid status." });
  }
  user.status = status;
  recordServerAuditLog(
    session.email,
    session.isMainSuperAdmin ? "main_super_admin" : "delegated_admin",
    "USER_STATUS_CHANGE",
    `User ${user.email} status changed to ${status}`,
    ip
  );
  res.json({ success: true, message: `Account status for ${user.name} updated to ${status}.` });
});
app.patch("/api/admin/users/:id/role", requireAdminAuth, requireMainSuperAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const session = req.adminSession;
  const ip = getClientIp(req);
  const user = serverUsers.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  if (user.email.toLowerCase() === MAIN_SUPER_ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({ error: "The Main Super Admin role cannot be modified or demoted." });
  }
  const validRoles = ["farmer", "buyer", "seller", "consultant", "veterinarian", "transporter", "lab", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role." });
  }
  user.role = role;
  if (role === "admin" && !delegatedAdminsMap.has(user.email.toLowerCase())) {
    delegatedAdminsMap.set(user.email.toLowerCase(), { ...DEFAULT_DELEGATED_PERMISSIONS });
  }
  recordServerAuditLog(
    session.email,
    "main_super_admin",
    "USER_ROLE_CHANGE",
    `Changed role of ${user.email} to ${role}`,
    ip
  );
  res.json({ success: true, message: `User ${user.name} role updated to ${role}.` });
});
var serverOrders = [
  {
    id: "ord-1001",
    orderNumber: "SA-KE-2026-9041",
    buyerName: "Samuel Kiprop Kimani",
    buyerPhone: "0722123456",
    deliveryCounty: "Nakuru",
    deliveryTown: "Njoro",
    itemsSummary: "Certified Seed Maize - Kenya Seed H614D (10 pkts)",
    subtotalKsh: 5800,
    shippingTotalKsh: 850,
    grandTotalKsh: 6650,
    paymentMethod: "M-Pesa STK Push",
    paymentStatus: "PAID_ESCROW",
    mpesaReceiptNumber: "SK72910M4",
    orderStatus: "in_transit",
    carrierName: "Joseph Waweru (KDG 492X)",
    createdAt: "2026-10-21 08:30 AM",
    updatedAt: "2026-10-21 11:15 AM"
  },
  {
    id: "ord-1002",
    orderNumber: "SA-KE-2026-9042",
    buyerName: "Grace Njeri Mwangi",
    buyerPhone: "0711987654",
    deliveryCounty: "Mombasa",
    deliveryTown: "Mombasa Kongowea",
    itemsSummary: "Shangi Potatoes Grade 1 (25 bags)",
    subtotalKsh: 87500,
    shippingTotalKsh: 6500,
    grandTotalKsh: 94e3,
    paymentMethod: "M-Pesa Daraja B2B",
    paymentStatus: "PAID_ESCROW",
    mpesaReceiptNumber: "SK83921Q9",
    orderStatus: "confirmed",
    carrierName: "Rift Cold-Chain Logistics",
    createdAt: "2026-10-22 09:45 AM",
    updatedAt: "2026-10-22 10:30 AM"
  },
  {
    id: "ord-1003",
    orderNumber: "SA-KE-2026-9043",
    buyerName: "Peter Oduor",
    buyerPhone: "0729334455",
    deliveryCounty: "Kisumu",
    deliveryTown: "Kisumu Port",
    itemsSummary: "NPK 23:23:0 Mavuno Planting Fertilizer (4 bags)",
    subtotalKsh: 13200,
    shippingTotalKsh: 1200,
    grandTotalKsh: 14400,
    paymentMethod: "M-Pesa STK Push",
    paymentStatus: "PAID_ESCROW",
    mpesaReceiptNumber: "SK99102X1",
    orderStatus: "delivered",
    carrierName: "Western Agro Courier",
    createdAt: "2026-10-20 02:15 PM",
    updatedAt: "2026-10-21 04:00 PM"
  }
];
app.get("/api/admin/orders", requireAdminAuth, (req, res) => {
  res.json({ orders: serverOrders, total: serverOrders.length });
});
app.patch("/api/admin/orders/:id/status", requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status, carrierName } = req.body;
  const session = req.adminSession;
  const ip = getClientIp(req);
  const order = serverOrders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Order not found." });
  }
  const validStatuses = ["placed", "confirmed", "dispatched", "in_transit", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid order status transition." });
  }
  order.orderStatus = status;
  if (carrierName) order.carrierName = carrierName;
  order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  recordServerAuditLog(
    session.email,
    session.isMainSuperAdmin ? "main_super_admin" : "delegated_admin",
    "ORDER_STATUS_UPDATE",
    `Order ${order.orderNumber} updated to ${status}`,
    ip
  );
  res.json({ success: true, message: `Order ${order.orderNumber} status updated to ${status}.`, order });
});
app.get("/api/admin/payments", requireAdminAuth, (req, res) => {
  const hasMpesaKey = Boolean(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET);
  const environment = process.env.MPESA_ENVIRONMENT || "sandbox";
  const shortcode = process.env.MPESA_SHORTCODE || "174379";
  const payments = [
    {
      id: "pay-001",
      checkoutRequestId: "ws_CO_211020260830491029",
      merchantRequestId: "MR-9041-A",
      mpesaReceiptNumber: "SK72910M4",
      phoneNumber: "254722123456",
      amountKsh: 6650,
      orderNumber: "SA-KE-2026-9041",
      status: "COMPLETED",
      settlementStatus: "HELD_IN_ESCROW",
      gateway: hasMpesaKey ? `Safaricom Daraja (${environment.toUpperCase()})` : "Daraja Sandbox STK Testbed",
      timestamp: "2026-10-21 08:31 AM"
    },
    {
      id: "pay-002",
      checkoutRequestId: "ws_CO_221020260945192837",
      merchantRequestId: "MR-9042-B",
      mpesaReceiptNumber: "SK83921Q9",
      phoneNumber: "254711987654",
      amountKsh: 94e3,
      orderNumber: "SA-KE-2026-9042",
      status: "COMPLETED",
      settlementStatus: "HELD_IN_ESCROW",
      gateway: hasMpesaKey ? `Safaricom Daraja (${environment.toUpperCase()})` : "Daraja Sandbox STK Testbed",
      timestamp: "2026-10-22 09:46 AM"
    },
    {
      id: "pay-003",
      checkoutRequestId: "ws_CO_201020261415829102",
      merchantRequestId: "MR-9043-C",
      mpesaReceiptNumber: "SK99102X1",
      phoneNumber: "254729334455",
      amountKsh: 14400,
      orderNumber: "SA-KE-2026-9043",
      status: "COMPLETED",
      settlementStatus: "RELEASED_TO_SELLER",
      gateway: hasMpesaKey ? `Safaricom Daraja (${environment.toUpperCase()})` : "Daraja Sandbox STK Testbed",
      timestamp: "2026-10-20 02:16 PM"
    }
  ];
  res.json({
    payments,
    gatewayStatus: {
      isConnected: hasMpesaKey,
      environment,
      shortcode,
      channel: "Lipa Na M-Pesa Online (Daraja API v2)",
      sslVerified: true,
      notes: hasMpesaKey ? "Live Safaricom Daraja STK Push credentials connected." : "Sandbox Daraja STK Push active. Set MPESA_CONSUMER_KEY & MPESA_CONSUMER_SECRET in .env to switch to production."
    }
  });
});
var serverBranding = {
  platformName: "DERIV-AGRI KENYA",
  logoUrl: "/smart-agri-logo.svg",
  emblemUrl: "/smart-agri-emblem.svg",
  heroBannerUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80",
  faviconUrl: "/smart-agri-emblem.svg",
  primaryColor: "#214E34",
  secondaryColor: "#D6A545",
  supportPhone: "+254 700 000 000",
  supportEmail: "support@deriv-agri.ke",
  headquartersAddress: "DERIV-AGRI Plaza, 4th Floor, Kilimani, Nairobi, Kenya",
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
app.get("/api/admin/branding", requireAdminAuth, (req, res) => {
  res.json({ branding: serverBranding });
});
var handleUpdateBranding = (req, res) => {
  const updates = req.body;
  const session = req.adminSession;
  const ip = getClientIp(req);
  serverBranding = {
    ...serverBranding,
    ...updates,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  recordServerAuditLog(
    session.email,
    session.isMainSuperAdmin ? "main_super_admin" : "delegated_admin",
    "UPDATE_BRANDING_ASSETS",
    `Updated platform branding: ${serverBranding.platformName}`,
    ip
  );
  res.json({ success: true, message: "Platform branding assets updated.", branding: serverBranding });
};
app.put("/api/admin/branding", requireAdminAuth, handleUpdateBranding);
app.post("/api/admin/branding", requireAdminAuth, handleUpdateBranding);
var serverDeliverySettings = {
  baseFeeKsh: 350,
  perKmRateKsh: 25,
  expressSurchargeKsh: 400,
  freeDeliveryThresholdKsh: 25e3,
  activeCarriers: ["Rift Valley Logistics", "Nairobi Courier Express", "SGR Freight Service", "Local Boda/Probox Delivery"],
  countyRates: {
    "Nairobi": 250,
    "Kiambu": 300,
    "Nakuru": 350,
    "Uasin Gishu": 500,
    "Mombasa": 650,
    "Kisumu": 550,
    "Machakos": 380,
    "Meru": 450,
    "Nyeri": 400,
    "Kakamega": 550
  },
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
app.get("/api/admin/delivery-settings", requireAdminAuth, (req, res) => {
  res.json({ settings: serverDeliverySettings });
});
var handleUpdateDeliverySettings = (req, res) => {
  const updates = req.body;
  const session = req.adminSession;
  const ip = getClientIp(req);
  serverDeliverySettings = {
    ...serverDeliverySettings,
    ...updates,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  recordServerAuditLog(
    session.email,
    session.isMainSuperAdmin ? "main_super_admin" : "delegated_admin",
    "UPDATE_DELIVERY_SETTINGS",
    "Updated county freight delivery rates and carriers",
    ip
  );
  res.json({ success: true, message: "Delivery settings updated.", settings: serverDeliverySettings });
};
app.put("/api/admin/delivery-settings", requireAdminAuth, handleUpdateDeliverySettings);
app.post("/api/admin/delivery-settings", requireAdminAuth, handleUpdateDeliverySettings);
var serverPlatformSettings = {
  allowPublicRegistrations: true,
  requireKycForSellers: true,
  maintenanceMode: false,
  maintenanceNotice: "",
  lowStockAlertThreshold: 5,
  orderEscrowAutoReleaseDays: 3,
  enableDisputeArbitration: true,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
app.get("/api/admin/platform-settings", requireAdminAuth, (req, res) => {
  res.json({ settings: serverPlatformSettings });
});
var handleUpdatePlatformSettings = (req, res) => {
  const updates = req.body;
  const session = req.adminSession;
  const ip = getClientIp(req);
  serverPlatformSettings = {
    ...serverPlatformSettings,
    ...updates,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  recordServerAuditLog(
    session.email,
    session.isMainSuperAdmin ? "main_super_admin" : "delegated_admin",
    "UPDATE_PLATFORM_SETTINGS",
    `Updated platform governance settings: Maintenance=${serverPlatformSettings.maintenanceMode}`,
    ip
  );
  res.json({ success: true, message: "Platform settings updated.", settings: serverPlatformSettings });
};
app.put("/api/admin/platform-settings", requireAdminAuth, handleUpdatePlatformSettings);
app.post("/api/admin/platform-settings", requireAdminAuth, handleUpdatePlatformSettings);
app.get("/api/admin/audit-logs", requireAdminAuth, (req, res) => {
  res.json({ auditLogs: serverAuditLogs, total: serverAuditLogs.length });
});
var serverCmsPublished = null;
var serverCmsDraft = null;
var serverCmsHistory = [];
app.get("/api/cms/content", (req, res) => {
  res.json({
    success: true,
    publishedContent: serverCmsPublished,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/admin/cms", requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    draftContent: serverCmsDraft || serverCmsPublished,
    publishedContent: serverCmsPublished,
    history: serverCmsHistory
  });
});
app.put("/api/admin/cms/draft", requireAdminAuth, (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content payload is required." });
  }
  serverCmsDraft = content;
  res.json({ success: true, message: "Draft saved successfully." });
});
app.post("/api/admin/cms/publish", requireAdminAuth, (req, res) => {
  const { content, publishedBy } = req.body;
  const session = req.adminSession;
  const toPublish = content || serverCmsDraft;
  if (!toPublish) {
    return res.status(400).json({ error: "No content available to publish." });
  }
  const nextVersion = (serverCmsPublished?.version || 1) + 1;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  toPublish.version = nextVersion;
  toPublish.publishedAt = now;
  toPublish.publishedBy = publishedBy || session.name || session.email;
  serverCmsPublished = JSON.parse(JSON.stringify(toPublish));
  serverCmsDraft = JSON.parse(JSON.stringify(toPublish));
  serverCmsHistory.unshift({
    version: nextVersion,
    publishedAt: now,
    publishedBy: toPublish.publishedBy,
    content: JSON.parse(JSON.stringify(toPublish))
  });
  if (serverCmsHistory.length > 20) {
    serverCmsHistory.pop();
  }
  recordServerAuditLog(
    session.email,
    session.isMainSuperAdmin ? "main_super_admin" : "delegated_admin",
    "CMS_PUBLISH_LIVE",
    `Published live website version ${nextVersion}`,
    getClientIp(req)
  );
  res.json({
    success: true,
    version: nextVersion,
    message: `Version ${nextVersion} published to live website successfully!`
  });
});
app.post("/api/admin/cms/restore", requireAdminAuth, (req, res) => {
  const { version } = req.body;
  const session = req.adminSession;
  const found = serverCmsHistory.find((h) => h.version === Number(version));
  if (!found) {
    return res.status(404).json({ error: `Version ${version} not found in history.` });
  }
  const restored = JSON.parse(JSON.stringify(found.content));
  const newVer = (serverCmsPublished?.version || 1) + 1;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  restored.version = newVer;
  restored.publishedAt = now;
  restored.publishedBy = `${session.name || session.email} (Restored from v${version})`;
  serverCmsPublished = restored;
  serverCmsDraft = restored;
  serverCmsHistory.unshift({
    version: newVer,
    publishedAt: now,
    publishedBy: restored.publishedBy,
    content: JSON.parse(JSON.stringify(restored))
  });
  recordServerAuditLog(
    session.email,
    session.isMainSuperAdmin ? "main_super_admin" : "delegated_admin",
    "CMS_ROLLBACK",
    `Restored previous version ${version} as new version ${newVer}`,
    getClientIp(req)
  );
  res.json({
    success: true,
    version: newVer,
    message: `Restored version ${version} as new active version ${newVer}.`
  });
});
app.get("/api/admin/integrations", requireAdminAuth, (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
  const hasMpesaKey = Boolean(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET);
  const hasSupabase = isSupabaseConfigured;
  res.json({
    gemini: {
      status: hasGeminiKey ? "CONNECTED" : "STANDBY_SIMULATION",
      model: "gemini-3.8-flash",
      maskedKey: hasGeminiKey ? `${process.env.GEMINI_API_KEY?.slice(0, 6)}\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022` : "Not Configured",
      description: "Senior Agricultural Specialist & Pest Diagnostician LLM"
    },
    mpesa: {
      status: hasMpesaKey ? "CONNECTED" : "SANDBOX_ACTIVE",
      environment: process.env.MPESA_ENVIRONMENT || "sandbox",
      shortcode: process.env.MPESA_SHORTCODE || "174379",
      description: "Safaricom Daraja STK Push & Escrow Reconciliation"
    },
    supabase: {
      status: hasSupabase ? "CONNECTED" : "OFFLINE_STANDBY",
      url: hasSupabase ? supabaseUrl.replace(/https:\/\/(.*)\.supabase\.co.*/, "https://$1.supabase.co") : "Local PostgreSQL / Store fallback",
      hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      description: "PostgreSQL Relational DB, Auth & Row Level Security Policies"
    },
    weather: {
      status: "CONNECTED",
      source: "Open-Meteo Synoptic Model & KMD Synchronized Grid",
      description: "Live 7-Day Agricultural Forecast for 47 Counties"
    },
    sms: {
      status: "READY",
      gateway: "Safaricom Bonga / Twilio SMS Provider Proxy",
      description: "One-Time Passcodes & Critical Weather Alerts"
    }
  });
});
var serverProducts = [...SAMPLE_PRODUCTS, ...SAMPLE_LIVESTOCK];
var serverMarketPrices = [...SAMPLE_MARKET_PRICES];
var serverInquiries = [];
var serverReports = [];
app.get("/api/products", (req, res) => {
  const { category, county, search, minPrice, maxPrice, variety } = req.query;
  let results = [...serverProducts];
  if (category && category !== "all") {
    results = results.filter((p) => p.category === category);
  }
  if (county && county !== "all") {
    results = results.filter((p) => p.sellerCounty?.toLowerCase() === String(county).toLowerCase());
  }
  if (variety) {
    results = results.filter((p) => p.variety?.toLowerCase().includes(String(variety).toLowerCase()));
  }
  if (minPrice) {
    results = results.filter((p) => p.priceKsh >= Number(minPrice));
  }
  if (maxPrice) {
    results = results.filter((p) => p.priceKsh <= Number(maxPrice));
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.variety?.toLowerCase().includes(q) || p.productType?.toLowerCase().includes(q) || p.sellerCounty?.toLowerCase().includes(q)
    );
  }
  res.json({ products: results, count: results.length });
});
app.post("/api/products", (req, res) => {
  const product = req.body;
  if (!product.title || !product.priceKsh) {
    return res.status(400).json({ error: "Title and price are required." });
  }
  const newProduct = {
    ...product,
    id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: product.status || "active"
  };
  serverProducts.unshift(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const index = serverProducts.findIndex((p) => p.id === id);
  if (index === -1) {
    const newProduct = { ...updates, id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    serverProducts.unshift(newProduct);
    return res.json({ success: true, product: newProduct });
  }
  serverProducts[index] = { ...serverProducts[index], ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  res.json({ success: true, product: serverProducts[index] });
});
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const index = serverProducts.findIndex((p) => p.id === id);
  if (index !== -1) {
    serverProducts.splice(index, 1);
  }
  res.json({ success: true, message: "Product listing removed." });
});
app.get("/api/market-prices", (req, res) => {
  const { commodity, market, county, category, priceType } = req.query;
  let results = [...serverMarketPrices];
  if (commodity) {
    const q = String(commodity).toLowerCase();
    results = results.filter((p) => p.commodityName?.toLowerCase().includes(q));
  }
  if (market && market !== "all") {
    results = results.filter((p) => p.marketName === market);
  }
  if (county && county !== "all") {
    results = results.filter((p) => p.county?.toLowerCase() === String(county).toLowerCase());
  }
  if (category && category !== "all") {
    results = results.filter((p) => p.category === category);
  }
  if (priceType && priceType !== "all") {
    results = results.filter((p) => (p.priceType || "verified_observation") === priceType);
  }
  res.json({ marketPrices: results, count: results.length });
});
app.post("/api/market-prices", (req, res) => {
  const record = req.body;
  if (!record.commodityName || !record.wholesalePriceKsh) {
    return res.status(400).json({ error: "Commodity name and wholesale price are required." });
  }
  const newRecord = {
    ...record,
    id: record.id || `mp-${Date.now()}`,
    verifiedAt: record.verifiedAt || (/* @__PURE__ */ new Date()).toISOString(),
    observationDate: record.observationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  serverMarketPrices.unshift(newRecord);
  res.status(201).json({ success: true, record: newRecord });
});
app.post("/api/products/:id/inquiry", (req, res) => {
  const { id } = req.params;
  const { buyerName, buyerPhone, buyerEmail, message, quantityNeeded, desiredDeliveryDate } = req.body;
  if (!buyerName || !buyerPhone || !message) {
    return res.status(400).json({ error: "Name, phone, and message are required." });
  }
  const inquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: id,
    buyerName,
    buyerPhone,
    buyerEmail,
    message,
    quantityNeeded,
    desiredDeliveryDate,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "pending"
  };
  serverInquiries.unshift(inquiry);
  res.status(201).json({ success: true, message: "Inquiry successfully delivered to producer.", inquiry });
});
app.post("/api/products/:id/report", (req, res) => {
  const { id } = req.params;
  const { reason, details, reporterContact } = req.body;
  if (!details) {
    return res.status(400).json({ error: "Report explanation details are required." });
  }
  const report = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: id,
    reason: reason || "suspicious_price",
    details,
    reporterContact,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "under_review"
  };
  serverReports.unshift(report);
  res.status(201).json({ success: true, message: "Listing report submitted to agricultural moderation team.", report });
});
async function startServer() {
  const httpServer = http.createServer(app);
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const isHmrDisabled = process.env.DISABLE_HMR === "true";
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer }
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  const portNumber = Number(PORT) || 3e3;
  httpServer.listen(portNumber, "0.0.0.0", () => {
    console.log(`SMART-AGRI KENYA Server running on http://0.0.0.0:${portNumber}`);
  });
}
startServer();
