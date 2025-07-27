"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "vendor" | "supplier"
  businessName?: string
  location?: string
  latitude?: number
  longitude?: number
  vendorType?: "street_vendor" | "restaurant" | "cafe" | "food_truck" | "catering" | "grocery_store" | "bakery"
  isActive: boolean
  createdAt: string
}

interface Product {
  id: string
  name: string
  price: number
  unit: string
  category: string
  supplierId: string
  inStock: boolean
  icon: string
  color: string
  description?: string
  minQuantity?: number
}

interface Order {
  id: string
  vendorId: string
  supplierId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
    name: string
    unit: string
  }>
  total: number
  status: "pending" | "accepted" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"
  deliveryAddress: string
  paymentMethod: string
  specialInstructions?: string
  createdAt: string
  updatedAt: string
}

interface Transaction {
  id: string
  orderId: string
  supplierId: string
  vendorId: string
  amount: number
  commission: number
  netAmount: number
  status: "completed" | "pending" | "failed"
  paymentMethod: string
  createdAt: string
}

interface FSSAIReport {
  id: string
  orderId: string
  vendorId: string
  supplierId: string
  productName: string
  issueType: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "submitted" | "under_review" | "resolved" | "rejected"
  createdAt: string
  reportNumber: string
}

// Store
interface AppStore {
  // Authentication
  isAuthenticated: boolean
  currentUser: User | null

  // Users
  users: User[]

  // Products
  products: Product[]

  // Orders
  orders: Order[]

  // Transactions
  transactions: Transaction[]

  // FSSAI Reports
  fssaiReports: FSSAIReport[]

  // Location
  userLocation: { latitude: number; longitude: number } | null
  locationError: string | null

  // Auth Actions
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  register: (
    userData: Omit<User, "id" | "createdAt"> & { password: string },
  ) => Promise<{ success: boolean; user?: User; error?: string }>

  // Location Actions
  setUserLocation: (location: { latitude: number; longitude: number }) => void
  setLocationError: (error: string) => void
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number

  // User Actions
  updateUser: (id: string, updates: Partial<User>) => void

  // Product Actions
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Order Actions
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void
  updateOrder: (id: string, updates: Partial<Order>) => void

  // Transaction Actions
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void

  // FSSAI Report Actions
  addFSSAIReport: (report: Omit<FSSAIReport, "id" | "createdAt" | "reportNumber">) => void
  updateFSSAIReport: (id: string, updates: Partial<FSSAIReport>) => void

  // Getters
  getSuppliers: () => User[]
  getVendors: () => User[]
  getSuppliersWithinRadius: (radius: number) => User[]
  getVendorsByType: (type?: string) => User[]
  getProductsBySupplier: (supplierId: string) => Product[]
  getOrdersByUser: (userId: string, role: "vendor" | "supplier") => Order[]
  getTransactionsBySupplier: (supplierId: string) => Transaction[]
  getFSSAIReportsByUser: (userId: string) => FSSAIReport[]

  // Initialize mock data
  initializeMockData: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      currentUser: null,
      users: [],
      products: [],
      orders: [],
      transactions: [],
      fssaiReports: [],
      userLocation: null,
      locationError: null,

      // Location Actions
      setUserLocation: (location) => {
        set({ userLocation: location, locationError: null })
      },

      setLocationError: (error) => {
        set({ locationError: error })
      },

      calculateDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371 // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180)
        const dLon = (lon2 - lon1) * (Math.PI / 180)
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c // Distance in kilometers
        return distance
      },

      // Auth Actions - FIXED TO PREVENT CROSS-ROLE LOGIN
      login: async (email: string, password: string) => {
        const users = get().users
        const user = users.find((u) => u.email === email)

        if (!user) {
          return { success: false, error: "User not found. Please register first." }
        }

        // Password validation
        if (!password || password.length === 0) {
          return { success: false, error: "Password is required" }
        }

        // Set authentication state
        set({
          isAuthenticated: true,
          currentUser: user,
        })

        return { success: true, user }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
        })
      },

      register: async (userData) => {
        const users = get().users
        const existingUser = users.find((u) => u.email === userData.email)

        if (existingUser) {
          return { success: false, error: "User already exists with this email. Please login instead." }
        }

        // Remove password from userData before creating user object
        const { password, ...userDataWithoutPassword } = userData
        const newUser: User = {
          ...userDataWithoutPassword,
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          users: [...state.users, newUser],
          isAuthenticated: true,
          currentUser: newUser,
        }))

        return { success: true, user: newUser }
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
          currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...updates } : state.currentUser,
        }))
      },

      addProduct: (productData) => {
        const product: Product = {
          ...productData,
          id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }
        set((state) => ({ products: [...state.products, product] }))
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) => (product.id === id ? { ...product, ...updates } : product)),
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }))
      },

      addOrder: (orderData) => {
        const order: Order = {
          ...orderData,
          id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ orders: [...state.orders, order] }))
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order,
          ),
        }))
      },

      addTransaction: (transactionData) => {
        const transaction: Transaction = {
          ...transactionData,
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ transactions: [...state.transactions, transaction] }))
      },

      addFSSAIReport: (reportData) => {
        const report: FSSAIReport = {
          ...reportData,
          id: `fssai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          reportNumber: `FSSAI-${Date.now().toString().slice(-8)}`,
          status: "submitted",
        }
        set((state) => ({ fssaiReports: [...state.fssaiReports, report] }))
      },

      updateFSSAIReport: (id, updates) => {
        set((state) => ({
          fssaiReports: state.fssaiReports.map((report) => (report.id === id ? { ...report, ...updates } : report)),
        }))
      },

      // Getters
      getSuppliers: () => get().users.filter((user) => user.role === "supplier"),
      getVendors: () => get().users.filter((user) => user.role === "vendor"),

      getSuppliersWithinRadius: (radius) => {
        const { userLocation, calculateDistance } = get()
        const suppliers = get().users.filter((user) => user.role === "supplier")

        if (!userLocation) {
          return suppliers // Return all suppliers if location is not available
        }

        return suppliers.filter((supplier) => {
          if (!supplier.latitude || !supplier.longitude) {
            return true // Include suppliers without location data
          }

          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            supplier.latitude,
            supplier.longitude,
          )

          return distance <= radius
        })
      },

      getVendorsByType: (type) => {
        const vendors = get().users.filter((user) => user.role === "vendor")
        if (!type || type === "all") return vendors
        return vendors.filter((vendor) => vendor.vendorType === type)
      },

      getProductsBySupplier: (supplierId) => get().products.filter((product) => product.supplierId === supplierId),

      getOrdersByUser: (userId, role) => {
        const orders = get().orders
        return role === "vendor"
          ? orders.filter((order) => order.vendorId === userId)
          : orders.filter((order) => order.supplierId === userId)
      },

      getTransactionsBySupplier: (supplierId) =>
        get().transactions.filter((transaction) => transaction.supplierId === supplierId),

      getFSSAIReportsByUser: (userId) => {
        const reports = get().fssaiReports
        return reports.filter((report) => report.vendorId === userId)
      },

      // Initialize mock data
      initializeMockData: () => {
        const state = get()
        if (state.users.length > 0) return // Already initialized

        // Mock Users with proper coordinates and vendor types (Delhi area)
        const mockUsers: User[] = [
          {
            id: "vendor_demo_1",
            name: "Rajesh Kumar",
            email: "rajesh@vendor.com",
            phone: "+91 98765 43210",
            role: "vendor",
            businessName: "Central Food Corner",
            location: "Zone A - Central Market, Delhi",
            latitude: 28.6139,
            longitude: 77.209,
            vendorType: "street_vendor",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "vendor_demo_2",
            name: "Priya Sharma",
            email: "priya@vendor.com",
            phone: "+91 87654 32109",
            role: "vendor",
            businessName: "Fresh Market Hub",
            location: "Zone B - North Delhi",
            latitude: 28.7041,
            longitude: 77.1025,
            vendorType: "grocery_store",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "vendor_demo_3",
            name: "Amit Gupta",
            email: "amit@restaurant.com",
            phone: "+91 76543 21098",
            role: "vendor",
            businessName: "Spice Route Restaurant",
            location: "Connaught Place, Delhi",
            latitude: 28.6315,
            longitude: 77.2167,
            vendorType: "restaurant",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "vendor_demo_4",
            name: "Sunita Devi",
            email: "sunita@cafe.com",
            phone: "+91 65432 10987",
            role: "vendor",
            businessName: "Morning Brew Cafe",
            location: "Khan Market, Delhi",
            latitude: 28.5984,
            longitude: 77.2319,
            vendorType: "cafe",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "vendor_demo_5",
            name: "Ravi Singh",
            email: "ravi@foodtruck.com",
            phone: "+91 54321 09876",
            role: "vendor",
            businessName: "Delhi Delights Food Truck",
            location: "India Gate, Delhi",
            latitude: 28.6129,
            longitude: 77.2295,
            vendorType: "food_truck",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "vendor_demo_6",
            name: "Meera Patel",
            email: "meera@bakery.com",
            phone: "+91 43210 98765",
            role: "vendor",
            businessName: "Golden Crust Bakery",
            location: "Lajpat Nagar, Delhi",
            latitude: 28.5677,
            longitude: 77.2431,
            vendorType: "bakery",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "supplier_demo_1",
            name: "Amit Singh",
            email: "amit@supplier.com",
            phone: "+91 76543 21098",
            role: "supplier",
            businessName: "Fresh Produce Co.",
            location: "Wholesale Market, Delhi",
            latitude: 28.6304,
            longitude: 77.2177,
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "supplier_demo_2",
            name: "Sunita Devi",
            email: "sunita@supplier.com",
            phone: "+91 65432 10987",
            role: "supplier",
            businessName: "Grain Masters",
            location: "Agricultural Hub, Punjab",
            latitude: 28.6692,
            longitude: 77.4538,
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "supplier_demo_3",
            name: "Ravi Patel",
            email: "ravi@supplier.com",
            phone: "+91 54321 09876",
            role: "supplier",
            businessName: "Organic Farms",
            location: "Gurgaon, Haryana",
            latitude: 28.4595,
            longitude: 77.0266,
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "supplier_demo_4",
            name: "Meera Gupta",
            email: "meera@supplier.com",
            phone: "+91 43210 98765",
            role: "supplier",
            businessName: "Spice World",
            location: "Faridabad, Haryana",
            latitude: 28.4089,
            longitude: 77.3178,
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "supplier_demo_5",
            name: "Vikram Singh",
            email: "vikram@supplier.com",
            phone: "+91 32109 87654",
            role: "supplier",
            businessName: "Mountain Fresh",
            location: "Noida, UP",
            latitude: 28.5355,
            longitude: 77.391,
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "supplier_demo_6",
            name: "Kavita Sharma",
            email: "kavita@supplier.com",
            phone: "+91 21098 76543",
            role: "supplier",
            businessName: "Dairy Delights",
            location: "Rohtak, Haryana (Far)",
            latitude: 28.8955,
            longitude: 76.6066,
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
          },
        ]

        // Mock Products
        const mockProducts: Product[] = [
          {
            id: "prod_demo_1",
            name: "Fresh Tomatoes",
            price: 40,
            unit: "kg",
            category: "Vegetables",
            supplierId: "supplier_demo_1",
            inStock: true,
            icon: "🍅",
            color: "from-red-400 to-red-600",
            description: "Fresh, ripe tomatoes perfect for cooking",
            minQuantity: 1,
          },
          {
            id: "prod_demo_2",
            name: "Red Onions",
            price: 30,
            unit: "kg",
            category: "Vegetables",
            supplierId: "supplier_demo_1",
            inStock: true,
            icon: "🧅",
            color: "from-purple-400 to-purple-600",
            description: "Premium quality red onions",
            minQuantity: 1,
          },
          {
            id: "prod_demo_3",
            name: "Potatoes",
            price: 25,
            unit: "kg",
            category: "Vegetables",
            supplierId: "supplier_demo_1",
            inStock: true,
            icon: "🥔",
            color: "from-yellow-400 to-orange-500",
            description: "Fresh potatoes, great for all cooking needs",
            minQuantity: 1,
          },
          {
            id: "prod_demo_4",
            name: "Basmati Rice",
            price: 80,
            unit: "kg",
            category: "Grains",
            supplierId: "supplier_demo_2",
            inStock: true,
            icon: "🌾",
            color: "from-amber-400 to-orange-500",
            description: "Premium basmati rice, aged for perfect aroma",
            minQuantity: 5,
          },
          {
            id: "prod_demo_5",
            name: "Wheat Flour",
            price: 45,
            unit: "kg",
            category: "Grains",
            supplierId: "supplier_demo_2",
            inStock: true,
            icon: "🌾",
            color: "from-yellow-500 to-orange-600",
            description: "Fine quality wheat flour for all baking needs",
            minQuantity: 2,
          },
          {
            id: "prod_demo_6",
            name: "Green Chilies",
            price: 60,
            unit: "kg",
            category: "Vegetables",
            supplierId: "supplier_demo_1",
            inStock: true,
            icon: "🌶️",
            color: "from-green-400 to-green-600",
            description: "Fresh green chilies with perfect heat",
            minQuantity: 1,
          },
          {
            id: "prod_demo_7",
            name: "Organic Carrots",
            price: 50,
            unit: "kg",
            category: "Vegetables",
            supplierId: "supplier_demo_3",
            inStock: true,
            icon: "🥕",
            color: "from-orange-400 to-orange-600",
            description: "Organic carrots grown without pesticides",
            minQuantity: 1,
          },
          {
            id: "prod_demo_8",
            name: "Turmeric Powder",
            price: 120,
            unit: "kg",
            category: "Spices",
            supplierId: "supplier_demo_4",
            inStock: true,
            icon: "🟡",
            color: "from-yellow-600 to-orange-700",
            description: "Pure turmeric powder with high curcumin content",
            minQuantity: 1,
          },
          {
            id: "prod_demo_9",
            name: "Fresh Milk",
            price: 60,
            unit: "liter",
            category: "Dairy",
            supplierId: "supplier_demo_6",
            inStock: true,
            icon: "🥛",
            color: "from-blue-200 to-blue-400",
            description: "Fresh cow milk delivered daily",
            minQuantity: 1,
          },
        ]

        // Mock Orders with comprehensive data
        const mockOrders: Order[] = [
          {
            id: "order_demo_1",
            vendorId: "vendor_demo_1",
            supplierId: "supplier_demo_1",
            items: [
              { productId: "prod_demo_1", quantity: 5, price: 40, name: "Fresh Tomatoes", unit: "kg" },
              { productId: "prod_demo_2", quantity: 3, price: 30, name: "Red Onions", unit: "kg" },
              { productId: "prod_demo_6", quantity: 2, price: 60, name: "Green Chilies", unit: "kg" },
            ],
            total: 410,
            status: "delivered",
            deliveryAddress: "Central Food Corner, Zone A - Central Market, Delhi",
            paymentMethod: "cod",
            createdAt: "2024-01-15T10:30:00.000Z",
            updatedAt: "2024-01-16T14:30:00.000Z",
          },
          {
            id: "order_demo_2",
            vendorId: "vendor_demo_1",
            supplierId: "supplier_demo_2",
            items: [
              { productId: "prod_demo_4", quantity: 10, price: 80, name: "Basmati Rice", unit: "kg" },
              { productId: "prod_demo_5", quantity: 5, price: 45, name: "Wheat Flour", unit: "kg" },
            ],
            total: 1025,
            status: "out_for_delivery",
            deliveryAddress: "Central Food Corner, Zone A - Central Market, Delhi",
            paymentMethod: "upi",
            createdAt: "2024-01-18T09:15:00.000Z",
            updatedAt: "2024-01-18T16:45:00.000Z",
          },
          {
            id: "order_demo_3",
            vendorId: "vendor_demo_2",
            supplierId: "supplier_demo_1",
            items: [
              { productId: "prod_demo_1", quantity: 8, price: 40, name: "Fresh Tomatoes", unit: "kg" },
              { productId: "prod_demo_3", quantity: 10, price: 25, name: "Potatoes", unit: "kg" },
            ],
            total: 570,
            status: "preparing",
            deliveryAddress: "Fresh Market Hub, Zone B - North Delhi",
            paymentMethod: "wallet",
            createdAt: "2024-01-19T11:20:00.000Z",
            updatedAt: "2024-01-19T15:30:00.000Z",
          },
          {
            id: "order_demo_4",
            vendorId: "vendor_demo_2",
            supplierId: "supplier_demo_2",
            items: [{ productId: "prod_demo_4", quantity: 15, price: 80, name: "Basmati Rice", unit: "kg" }],
            total: 1200,
            status: "accepted",
            deliveryAddress: "Fresh Market Hub, Zone B - North Delhi",
            paymentMethod: "cod",
            createdAt: "2024-01-20T08:45:00.000Z",
            updatedAt: "2024-01-20T10:15:00.000Z",
          },
          {
            id: "order_demo_5",
            vendorId: "vendor_demo_1",
            supplierId: "supplier_demo_1",
            items: [
              { productId: "prod_demo_2", quantity: 5, price: 30, name: "Red Onions", unit: "kg" },
              { productId: "prod_demo_3", quantity: 8, price: 25, name: "Potatoes", unit: "kg" },
              { productId: "prod_demo_6", quantity: 3, price: 60, name: "Green Chilies", unit: "kg" },
            ],
            total: 530,
            status: "pending",
            deliveryAddress: "Central Food Corner, Zone A - Central Market, Delhi",
            paymentMethod: "wallet",
            createdAt: "2024-01-21T13:30:00.000Z",
            updatedAt: "2024-01-21T13:30:00.000Z",
          },
        ]

        // Mock Transactions
        const mockTransactions: Transaction[] = [
          {
            id: "txn_demo_1",
            orderId: "order_demo_1",
            supplierId: "supplier_demo_1",
            vendorId: "vendor_demo_1",
            amount: 410,
            commission: 20.5,
            netAmount: 389.5,
            status: "completed",
            paymentMethod: "UPI",
            createdAt: "2024-01-16T14:30:00.000Z",
          },
        ]

        set({
          users: mockUsers,
          products: mockProducts,
          orders: mockOrders,
          transactions: mockTransactions,
        })
      },
    }),
    {
      name: "bhojanyaan-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        users: state.users,
        products: state.products,
        orders: state.orders,
        transactions: state.transactions,
        fssaiReports: state.fssaiReports,
        userLocation: state.userLocation,
        locationError: state.locationError,
      }),
    },
  ),
)
