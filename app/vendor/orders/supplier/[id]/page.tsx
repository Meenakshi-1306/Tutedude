"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, MapPin, Phone, Package } from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function SupplierProducts() {
  const router = useRouter()
  const params = useParams()
  const supplierId = params.id as string

  const { users, getProductsBySupplier, currentUser } = useAppStore()
  const [cart, setCart] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  const supplier = users.find((u) => u.id === supplierId)
  const products = getProductsBySupplier(supplierId)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${supplierId}`)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [supplierId])

  // Save cart to localStorage
  const saveCart = (newCart: any[]) => {
    setCart(newCart)
    localStorage.setItem(`cart_${supplierId}`, JSON.stringify(newCart))
  }

  const categories = ["all", ...new Set(products.map((p) => p.category.toLowerCase()))]

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category.toLowerCase() === selectedCategory)

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      const newCart = cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      saveCart(newCart)
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }]
      saveCart(newCart)
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const newCart = cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    saveCart(newCart)
  }

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.id !== productId)
    saveCart(newCart)
  }

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Please add items to cart before checkout")
      return
    }

    // Save cart data for checkout
    localStorage.setItem("checkout_cart", JSON.stringify(cart))
    localStorage.setItem("checkout_supplier", supplierId)

    router.push("/vendor/orders/checkout")
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to continue</h1>
        <button onClick={() => router.push("/vendor/login")} className="btn-primary">
          Go to Login
        </button>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Supplier not found</h1>
        <button onClick={() => router.push("/vendor/orders")} className="btn-primary">
          Back to Suppliers
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">{supplier.businessName}</h1>
              <p className="text-gray-600">{supplier.location}</p>
            </div>
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">Cart ({getTotalItems()} items)</span>
                <span className="font-bold text-xl gradient-text">₹{getTotalPrice()}</span>
              </div>
              <button onClick={handleCheckout} className="btn-primary w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>

        {/* Supplier Info */}
        <div className="card mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{supplier.businessName}</h2>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{supplier.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>{supplier.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 mr-1" />
              <span className="font-medium">4.8</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                  selectedCategory === category
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const cartQuantity = getCartItemQuantity(product.id)
              return (
                <div key={product.id} className="card hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    {/* Product Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${product.color} rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl`}
                    >
                      {product.icon}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                    <div className="flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold gradient-text">₹{product.price}</span>
                      <span className="text-gray-600 ml-1">/{product.unit}</span>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-center mb-4">
                      <div
                        className={`flex items-center px-2 py-1 rounded-full ${
                          product.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <span className="text-xs font-medium">{product.inStock ? "In Stock" : "Out of Stock"}</span>
                      </div>
                    </div>

                    {/* Add to Cart Controls */}
                    {product.inStock ? (
                      cartQuantity > 0 ? (
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                            className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-lg min-w-[40px] text-center">{cartQuantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                            className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)} className="btn-primary w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Cart
                        </button>
                      )
                    ) : (
                      <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
                        Out of Stock
                      </button>
                    )}

                    {product.minQuantity && product.minQuantity > 1 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Min. order: {product.minQuantity} {product.unit}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Available</h3>
            <p className="text-gray-500">
              {selectedCategory === "all"
                ? "This supplier hasn't added any products yet."
                : `No products found in ${selectedCategory} category.`}
            </p>
          </div>
        )}

        {/* Floating Cart Button for Mobile */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 lg:hidden">
            <button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="font-bold">{getTotalItems()}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
