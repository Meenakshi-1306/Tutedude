"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Clock, CreditCard, Check, AlertCircle, ShoppingCart, Truck } from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function Checkout() {
  const router = useRouter()
  const { currentUser, users, addOrder, isAuthenticated } = useAppStore()

  const [cart, setCart] = useState<any[]>([])
  const [supplierId, setSupplierId] = useState<string>("")
  const [deliveryOption, setDeliveryOption] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [error, setError] = useState("")

  // Load cart data from localStorage
  useEffect(() => {
    const cartData = localStorage.getItem("checkout_cart")
    const supplierIdData = localStorage.getItem("checkout_supplier")

    if (cartData && supplierIdData) {
      setCart(JSON.parse(cartData))
      setSupplierId(supplierIdData)
    } else {
      // No cart data, redirect back
      router.push("/vendor/orders")
    }
  }, [router])

  // Set default delivery address
  useEffect(() => {
    if (currentUser && !deliveryAddress) {
      const address = currentUser.businessName
        ? `${currentUser.businessName}, ${currentUser.location || "Delhi"}`
        : `${currentUser.name}, ${currentUser.location || "Delhi"}`
      setDeliveryAddress(address)
    }
  }, [currentUser, deliveryAddress])

  const supplier = users.find((u) => u.id === supplierId)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = deliveryOption === "express" ? 50 : 20
  const platformFee = Math.round(subtotal * 0.02)
  const total = subtotal + deliveryFee + platformFee

  const handlePlaceOrder = async () => {
    if (!currentUser || !supplier) {
      setError("Missing user or supplier information")
      return
    }

    if (cart.length === 0) {
      setError("Cart is empty")
      return
    }

    if (!deliveryAddress.trim()) {
      setError("Please enter delivery address")
      return
    }

    setIsPlacingOrder(true)
    setError("")

    try {
      // Create order
      const orderData = {
        vendorId: currentUser.id,
        supplierId: supplier.id,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          unit: item.unit,
        })),
        total: total,
        status: "pending" as const,
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod,
        specialInstructions: specialInstructions.trim(),
      }

      addOrder(orderData)

      // Clear cart
      localStorage.removeItem("checkout_cart")
      localStorage.removeItem("checkout_supplier")

      setOrderSuccess(true)

      // Redirect after success
      setTimeout(() => {
        if (paymentMethod === "card" || paymentMethod === "upi") {
          router.push(`/payment/test?amount=${total}&type=order`)
        } else {
          router.push("/vendor/dashboard")
        }
      }, 2000)
    } catch (err) {
      setError("Failed to place order. Please try again.")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been sent to {supplier?.businessName}. You'll receive updates on the order status.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-bold text-xl gradient-text">₹{total}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {paymentMethod === "card" || paymentMethod === "upi"
                ? "Redirecting to payment..."
                : "Redirecting to dashboard..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!supplier || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Cart is empty</h1>
        <button onClick={() => router.push("/vendor/orders")} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="btn-secondary mr-4">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Supplier Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{supplier.businessName || supplier.name}</p>
                <p className="text-gray-600">{supplier.location}</p>
                <p className="text-gray-600">{supplier.phone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({cart.length})</h3>
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.unit} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <MapPin className="w-5 h-5 inline mr-2" />
                Delivery Address
              </h3>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your complete delivery address..."
                className="input-field min-h-[100px] resize-none"
                required
              />
            </div>

            {/* Delivery Options */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Clock className="w-5 h-5 inline mr-2" />
                Delivery Options
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={deliveryOption === "standard"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Standard Delivery (2-4 hours)</p>
                    <p className="text-sm text-gray-600">₹20 delivery fee</p>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={deliveryOption === "express"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Express Delivery (1-2 hours)</p>
                    <p className="text-sm text-gray-600">₹50 delivery fee</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <CreditCard className="w-5 h-5 inline mr-2" />
                Payment Method
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">UPI Payment</p>
                    <p className="text-sm text-gray-600">Pay instantly with UPI</p>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-gray-600">Pay securely with your card</p>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Vendor Wallet</p>
                    <p className="text-sm text-gray-600">Pay using wallet balance</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions (Optional)</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special instructions for the supplier..."
                className="input-field min-h-[80px] resize-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                <div className="flex items-center mb-2">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>Estimated delivery: {deliveryOption === "express" ? "1-2" : "2-4"} hours</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Quality guaranteed</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !deliveryAddress.trim()}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
