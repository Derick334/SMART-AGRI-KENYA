import { 
  Product, 
  CartItem, 
  Order, 
  UserProfile, 
  SoilTestRequest, 
  ForumPost, 
  MarketPriceRecord, 
  UserRole,
  AdminStats 
} from '../types';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { SAMPLE_LIVESTOCK } from '../data/sampleLivestock';
import { SAMPLE_MARKET_PRICES } from '../data/sampleMarketPrices';

const LOCAL_STORAGE_KEY_PRODUCTS = 'smart_agri_products_v1';
const LOCAL_STORAGE_KEY_ORDERS = 'smart_agri_orders_v1';
const LOCAL_STORAGE_KEY_CART = 'smart_agri_cart_v1';
const LOCAL_STORAGE_KEY_USER = 'smart_agri_user_v1';
const LOCAL_STORAGE_KEY_SOIL = 'smart_agri_soil_v1';
const LOCAL_STORAGE_KEY_FORUM = 'smart_agri_forum_v1';

// Default mock user: verified farmer in Kenya
export const DEFAULT_USER: UserProfile = {
  id: 'usr-farmer-01',
  name: 'Samuel Kiprop Kimani',
  email: 'samuel.kimani@agri.co.ke',
  phone: '0722123456',
  role: 'farmer',
  county: 'Nakuru',
  subCounty: 'Njoro',
  ward: 'Nessuit',
  farmName: 'Rongai Valley Mixed Farm',
  farmSizeAcres: 12.5,
  idNumber: '28475921',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2024-03-12',
};

export const ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  name: 'Admin Derick Onyango',
  email: 'admin@smart-agri.ke',
  phone: '0700000001',
  role: 'admin',
  county: 'Nairobi',
  subCounty: 'Westlands',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  joinedDate: '2023-01-01',
};

// Initial Seed Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SA-KE-2026-9041',
    buyerId: 'usr-farmer-01',
    buyerName: 'Samuel Kiprop Kimani',
    buyerPhone: '0722123456',
    deliveryCounty: 'Nakuru',
    deliveryTown: 'Njoro',
    deliveryAddress: 'Plot 42, Nessuit Road near Dairy Co-op',
    items: [
      {
        productId: 'prod-input-1',
        productTitle: 'Certified Seed Maize - Kenya Seed H614D',
        category: 'inputs',
        unit: '2kg packet',
        quantity: 10,
        unitPriceKsh: 580,
        totalPriceKsh: 5800,
        sellerId: 'user-agro-1',
        sellerName: 'Rift Valley Agrovet Wholesalers',
        sellerPhone: '0722334455',
        selectedDelivery: 'delivery',
        shippingCostKsh: 850,
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
      }
    ],
    subtotalKsh: 5800,
    shippingTotalKsh: 850,
    grandTotalKsh: 6650,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    mpesaReceiptNumber: 'SK72910M4',
    orderStatus: 'in_transit',
    transporterDetails: {
      name: 'Joseph Waweru',
      phone: '0722883311',
      vehiclePlate: 'KDG 492X',
      vehicleType: 'Probox / Small Van',
    },
    trackingSteps: [
      { status: 'placed', label: 'Order Confirmed', description: 'Paid via M-Pesa STK Push (SK72910M4)', timestamp: '2026-10-16 08:30 AM', completed: true },
      { status: 'confirmed', label: 'Dispatched by Seller', description: 'Packed at Kitale Central Agrovet', timestamp: '2026-10-16 11:15 AM', completed: true },
      { status: 'in_transit', label: 'On Route via A104 Highway', description: 'Driver reached Timboroa, heading towards Nakuru', timestamp: '2026-10-17 07:45 AM', completed: true },
      { status: 'delivered', label: 'Delivered', description: 'Recipient to sign pickup code', timestamp: 'Estimated Today 02:00 PM', completed: false },
    ],
    createdAt: '2026-10-16T08:30:00Z',
  }
];

// Initial Seed Soil Test
const INITIAL_SOIL_REQUESTS: SoilTestRequest[] = [
  {
    id: 'soil-req-01',
    sampleCode: 'NARL-2026-8812',
    farmerId: 'usr-farmer-01',
    farmerName: 'Samuel Kiprop Kimani',
    farmerPhone: '0722123456',
    county: 'Nakuru',
    subCounty: 'Njoro',
    fieldName: 'Upper Boma Maize Field (Block A)',
    farmSizeAcres: 5,
    intendedCrop: 'Maize (Hybrid 614D) & Beans',
    previousCrop: 'Maize (continuous 3 seasons)',
    previousFertilizer: 'DAP only at planting (50kg/acre)',
    submissionMethod: 'courier_dispatch',
    labId: 'lab-kalro-narl',
    labName: 'KALRO National Agricultural Research Laboratories (NARL)',
    status: 'completed',
    requestedAt: '2026-10-05T09:00:00Z',
    result: {
      ph: 5.2,
      phClassification: 'Moderately Acidic',
      nitrogenPercent: 0.16,
      phosphorusPpm: 12.4, // Low
      potassiumPpm: 210, // Adequate
      organicMatterPercent: 2.1,
      soilTexture: 'Red Volcanic Clay',
      salinityEc: 0.28,
      suitabilityScore: 74,
      limeRequirementKgPerAcre: 600,
      recommendedBasalFertilizer: 'Apply NPK 23:23:0 or Mavuno Planting Fertilizer instead of DAP to avoid further soil acidification.',
      recommendedTopDressing: 'CAN (Calcium Ammonium Nitrate) at 75kg/acre when maize is knee-high (V6 stage).',
      organicRemedies: [
        'Apply 5 tonnes/acre of well-composted farmyard cattle manure to boost organic carbon.',
        'Incorporate agricultural lime (CaCO3) 4 weeks prior to onset of next planting rains.',
        'Rotate with cowpeas or lablab legume cover crop to fix biological atmospheric nitrogen.'
      ],
      agronomistNotes: 'Significant soil acidification observed due to repeated continuous DAP application without liming. Phosphorus availability is currently locked by exchangeable aluminum ions. Liming will unlock natural soil phosphate.',
      labOfficerName: 'Dr. Anne Mwende, Senior Soil Analyst (NARL)',
      reportPdfUrl: '#',
    }
  }
];

// Initial Seed Forum Posts
const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-farmer-01',
    authorName: 'Samuel Kiprop Kimani',
    authorRole: 'farmer',
    authorCounty: 'Nakuru',
    title: 'How we increased dairy milk yield from 18L to 31L per cow in Rongai',
    content: 'Fellow farmers, we recently shifted our feeding protocol from ordinary Napier to wilted silage combined with Desmodium legume fodder and a balanced 16% dairy concentrate. Making sure cows have clean ad-libitum water 24/7 made a dramatic difference! Don\'t overlook water intake.',
    category: 'Dairy & Livestock',
    likes: 47,
    repliesCount: 16,
    isVerifiedFarmer: true,
    createdAt: '2026-10-15T14:20:00Z',
  },
  {
    id: 'post-2',
    authorId: 'user-agro-1',
    authorName: 'Rift Valley Agrovet',
    authorRole: 'expert',
    authorCounty: 'Uasin Gishu',
    title: 'Alert: Early scouting for Fall Armyworm in late-season maize',
    content: 'Farmers in Uasin Gishu and Trans-Nzoia should scout fields twice a week. Check the central funnel for fresh sawdust frass. Spray early morning before caterpillars bury deep into the whorl. Recommended actives include Chlorantraniliprole and Emamectin Benzoate.',
    category: 'Crop Protection',
    likes: 35,
    repliesCount: 9,
    isVerifiedFarmer: true,
    createdAt: '2026-10-14T09:10:00Z',
  },
  {
    id: 'post-3',
    authorId: 'usr-buyer-02',
    authorName: 'Grace Njeri (Mombasa Grocers)',
    authorRole: 'buyer',
    authorCounty: 'Mombasa',
    title: 'Looking for reliable suppliers of 50 tonnes of Shangi potatoes weekly',
    content: 'We supply hotel chains in Mombasa and Diani. Looking for Nyandarua or Molo farmers who can guarantee consistent grade 1 Shangi potatoes delivered to Kongowea Market. Direct payments via M-Pesa or bank guarantee on delivery.',
    category: 'Market & Pricing',
    likes: 62,
    repliesCount: 28,
    isVerifiedFarmer: true,
    createdAt: '2026-10-13T16:00:00Z',
  }
];

// Helper to safely load localStorage
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

class AgriStore {
  private products: Product[];
  private cart: CartItem[];
  private orders: Order[];
  private currentUser: UserProfile;
  private soilRequests: SoilTestRequest[];
  private forumPosts: ForumPost[];
  private marketPrices: MarketPriceRecord[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Combine products and livestock as base catalogue
    const allInitialProducts = [...SAMPLE_PRODUCTS, ...SAMPLE_LIVESTOCK];
    this.products = getLocal<Product[]>(LOCAL_STORAGE_KEY_PRODUCTS, allInitialProducts);
    this.cart = getLocal<CartItem[]>(LOCAL_STORAGE_KEY_CART, []);
    this.orders = getLocal<Order[]>(LOCAL_STORAGE_KEY_ORDERS, INITIAL_ORDERS);
    this.currentUser = getLocal<UserProfile>(LOCAL_STORAGE_KEY_USER, DEFAULT_USER);
    this.soilRequests = getLocal<SoilTestRequest[]>(LOCAL_STORAGE_KEY_SOIL, INITIAL_SOIL_REQUESTS);
    this.forumPosts = getLocal<ForumPost[]>(LOCAL_STORAGE_KEY_FORUM, INITIAL_FORUM_POSTS);
    this.marketPrices = SAMPLE_MARKET_PRICES;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.products;
  }

  public addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };
    this.products = [newProduct, ...this.products];
    setLocal(LOCAL_STORAGE_KEY_PRODUCTS, this.products);
    this.notify();
    return newProduct;
  }

  public updateProductStatus(id: string, status: Product['status']) {
    this.products = this.products.map(p => p.id === id ? { ...p, status } : p);
    setLocal(LOCAL_STORAGE_KEY_PRODUCTS, this.products);
    this.notify();
  }

  public deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    setLocal(LOCAL_STORAGE_KEY_PRODUCTS, this.products);
    this.notify();
  }

  // --- Cart ---
  public getCart(): CartItem[] {
    return this.cart;
  }

  public addToCart(product: Product, quantity: number = 1, deliveryPreference: 'pickup' | 'delivery' = 'delivery', shippingCostKsh: number = 500) {
    const existingIndex = this.cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
      this.cart[existingIndex].shippingCostKsh = shippingCostKsh;
    } else {
      this.cart.push({
        product,
        quantity,
        selectedDelivery: deliveryPreference,
        shippingCostKsh: deliveryPreference === 'delivery' ? shippingCostKsh : 0,
      });
    }
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  public updateCartQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cart = this.cart.map(item => item.product.id === productId ? { ...item, quantity } : item);
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  public updateCartDelivery(productId: string, selectedDelivery: 'pickup' | 'delivery', shippingCostKsh: number) {
    this.cart = this.cart.map(item => 
      item.product.id === productId 
        ? { ...item, selectedDelivery, shippingCostKsh: selectedDelivery === 'delivery' ? shippingCostKsh : 0 } 
        : item
    );
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  public removeFromCart(productId: string) {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  public clearCart() {
    this.cart = [];
    setLocal(LOCAL_STORAGE_KEY_CART, this.cart);
    this.notify();
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return this.orders;
  }

  public createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingSteps'>): Order {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SA-KE-${new Date().getFullYear()}-${randomDigits}`;

    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      trackingSteps: [
        { status: 'placed', label: 'Order Received', description: 'Pending confirmation from seller', timestamp: new Date().toLocaleTimeString(), completed: true },
        { status: 'confirmed', label: 'Seller Preparation', description: 'Inspection and packaging in progress', timestamp: 'Pending', completed: false },
        { status: 'in_transit', label: 'In Transit', description: 'Assigned to licensed transporter', timestamp: 'Pending', completed: false },
        { status: 'delivered', label: 'Delivered', description: 'Buyer confirmation and release', timestamp: 'Pending', completed: false },
      ],
    };

    this.orders = [newOrder, ...this.orders];
    setLocal(LOCAL_STORAGE_KEY_ORDERS, this.orders);
    this.clearCart();
    this.notify();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus'], mpesaReceipt?: string) {
    this.orders = this.orders.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, orderStatus };
        if (paymentStatus) updated.paymentStatus = paymentStatus;
        if (mpesaReceipt) updated.mpesaReceiptNumber = mpesaReceipt;
        // update tracking steps
        if (orderStatus === 'seller_confirmed') {
          updated.trackingSteps[1].completed = true;
          updated.trackingSteps[1].timestamp = new Date().toLocaleTimeString();
        } else if (orderStatus === 'in_transit') {
          updated.trackingSteps[1].completed = true;
          updated.trackingSteps[2].completed = true;
          updated.trackingSteps[2].timestamp = new Date().toLocaleTimeString();
        } else if (orderStatus === 'delivered') {
          updated.trackingSteps.forEach(s => s.completed = true);
        }
        return updated;
      }
      return o;
    });
    setLocal(LOCAL_STORAGE_KEY_ORDERS, this.orders);
    this.notify();
  }

  // --- User & Auth ---
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    setLocal(LOCAL_STORAGE_KEY_USER, user);
    this.notify();
  }

  public switchRole(role: UserRole) {
    if (role === 'admin') {
      this.currentUser = { ...ADMIN_USER };
    } else {
      this.currentUser = {
        ...DEFAULT_USER,
        role,
        farmName: role === 'transporter' ? 'Rift Transporters SACCO' : (role === 'expert' ? 'AgriConsult Kenya' : 'Rongai Valley Farm'),
      };
    }
    setLocal(LOCAL_STORAGE_KEY_USER, this.currentUser);
    this.notify();
  }

  // --- Soil Tests ---
  public getSoilRequests(): SoilTestRequest[] {
    return this.soilRequests;
  }

  public submitSoilRequest(requestData: Omit<SoilTestRequest, 'id' | 'sampleCode' | 'requestedAt' | 'status'>): SoilTestRequest {
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newRequest: SoilTestRequest = {
      ...requestData,
      id: `soil-${Date.now()}`,
      sampleCode: `NARL-${new Date().getFullYear()}-${codeNum}`,
      requestedAt: new Date().toISOString(),
      status: 'submitted',
    };
    this.soilRequests = [newRequest, ...this.soilRequests];
    setLocal(LOCAL_STORAGE_KEY_SOIL, this.soilRequests);
    this.notify();
    return newRequest;
  }

  // --- Community Forum ---
  public getForumPosts(): ForumPost[] {
    return this.forumPosts;
  }

  public addForumPost(post: Omit<ForumPost, 'id' | 'likes' | 'repliesCount' | 'createdAt'>): ForumPost {
    const newPost: ForumPost = {
      ...post,
      id: `post-${Date.now()}`,
      likes: 1,
      repliesCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.forumPosts = [newPost, ...this.forumPosts];
    setLocal(LOCAL_STORAGE_KEY_FORUM, this.forumPosts);
    this.notify();
    return newPost;
  }

  public likePost(postId: string) {
    this.forumPosts = this.forumPosts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    setLocal(LOCAL_STORAGE_KEY_FORUM, this.forumPosts);
    this.notify();
  }

  // --- Market Prices ---
  public getMarketPrices(): MarketPriceRecord[] {
    return this.marketPrices;
  }

  // --- Admin Statistics ---
  public getAdminStats(): AdminStats {
    const totalVolume = this.orders.reduce((sum, ord) => sum + ord.grandTotalKsh, 0);
    return {
      totalUsers: 14820,
      verifiedFarmers: 8940,
      activeListings: this.products.length,
      pendingApprovals: this.products.filter(p => p.status === 'pending_approval').length,
      totalOrders: this.orders.length + 1840,
      totalVolumeKsh: totalVolume + 14850000,
      openDisputes: 3,
      soilTestsCompleted: this.soilRequests.filter(s => s.status === 'completed').length + 380,
    };
  }
}

export const agriStore = new AgriStore();
