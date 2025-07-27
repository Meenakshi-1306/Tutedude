"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Plus,
  Eye,
  Edit,
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
} from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function SupplierDashboard() {
  const router = useRouter()
  const {
    currentUser,
    getProductsBySupplier,
    getOrdersByUser,
    getTransactionsBySupplier,
    userLocation,
    setUserLocation,
    setLocationError,
  } = useAppStore()

  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Get user's location for supplier
  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by this browser.")
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location."
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out."
              break
          }
          setLocationError(errorMessage)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    }

    if (!userLocation && currentUser?.role === "supplier") {
      getCurrentLocation()
    }
  }, [userLocation, currentUser, setUserLocation, setLocationError])

  useEffect(() => {
    if (currentUser) {
      const products = getProductsBySupplier(currentUser.id)
      const orders = getOrdersByUser(currentUser.id, "supplier")
      const transactions = getTransactionsBySupplier(currentUser.id)

      // Create recent activity feed
      const activities = [
        ...orders.slice(0, 3).map((order) => ({
          type: "order",
          title: `New order #${order.id.slice(-6)}`,
          description: `₹${order.total} - ${order.items.length} items`,
          time: new Date(order.createdAt).toLocaleDateString(),
          status: order.status,
          icon: ShoppingCart,
          color: "text-blue-600",
        })),
        ...transactions.slice(0, 2).map((txn) => ({
          type: "transaction",
          title: `Payment received`,
          description: `₹${txn.netAmount} credited`,
          time: new Date(txn.createdAt).toLocaleDateString(),
          status: txn.status,
          icon: DollarSign,
          color: "text-green-600",
        })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5)

      setRecentActivity(activities)
    }
  }, [currentUser, getProductsBySupplier, getOrdersByUser, getTransactionsBySupplier])

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access supplier dashboard</h1>
        <button onClick={() => router.push("/supplier/login")} className="btn-primary">
          Go to Login
        </button>
      </div>
    )
  }

  if (currentUser.role !== "supplier") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">This page is only accessible to suppliers.</p>
        <button onClick={() => router.push("/")} className="btn-primary">
          Go to Home
        </button>
      </div>
    )
  }

  const products = getProductsBySupplier(currentUser.id)
  const orders = getOrdersByUser(currentUser.id, "supplier")
  const transactions = getTransactionsBySupplier(currentUser.id)

  const totalRevenue = transactions.reduce((sum, txn) => sum + txn.netAmount, 0)
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const completedOrders = orders.filter((order) => order.status === "delivered").length
  const activeProducts = products.filter((product) => product.inStock).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      case "accepted":
        return "text-blue-600 bg-blue-50"
      case "preparing":
        return "text-purple-600 bg-purple-50"
      case "out_for_delivery":
        return "text-orange-600 bg-orange-50"
      case "delivered":
        return "text-green-600 bg-green-50"
      case "completed":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock
      case "completed":
        return CheckCircle
      case "delivered":
        return CheckCircle
      default:
        return AlertCircle
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-fadeInUp">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Supplier Dashboard</h1>
            <p className="text-gray-600 text-lg">Welcome back, {currentUser.name}!</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Navigation className="w-4 h-4 mr-1" />
              {currentUser.location || "Location not set"}
            </div>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => router.push("/supplier/inventory")} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
            <button onClick={() => router.push("/supplier/orders")} className="btn-secondary">
              <Eye className="w-4 h-4 mr-2" />
              View Orders
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-gradient animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold gradient-text">{products.length}</p>
              <p className="text-green-600 text-sm">{activeProducts} active</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-gradient animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold gradient-text">{orders.length}</p>
              <p className="text-yellow-600 text-sm">{pendingOrders} pending</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-gradient animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold gradient-text">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-green-600 text-sm">{transactions.length} transactions</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-gradient animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Orders</p>
              <p className="text-3xl font-bold gradient-text">{completedOrders}</p>
              <p className="text-green-600 text-sm">
                {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}% success rate
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <button
                onClick={() => router.push("/supplier/orders")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </button>
            </div>

            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  const StatusIcon = getStatusIcon(activity.status)
                  return (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4 shadow-sm`}
                      >
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                      </div>
                      <div
                        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {activity.status}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-500 mb-2">No Recent Activity</h4>
                <p className="text-gray-400">Your recent orders and transactions will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card animate-fadeInUp" style={{ animationDelay: "0.6s" }}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/supplier/inventory")}
                className="w-full flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all"
              >
                <Plus className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-700">Add New Product</span>
              </button>

              <button
                onClick={() => router.push("/supplier/orders")}
                className="w-full flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all"
              >
                <ShoppingCart className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-green-700">Manage Orders</span>
              </button>

              <button
                onClick={() => router.push("/supplier/analytics")}
                className="w-full flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all"
              >
                <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-medium text-purple-700">View Analytics</span>
              </button>

              <button
                onClick={() => router.push("/supplier/transactions")}
                className="w-full flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition-all"
              >
                <DollarSign className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium text-orange-700">View Transactions</span>
              </button>
            </div>
          </div>

          {/* Business Info */}
          <div className="card animate-fadeInUp" style={{ animationDelay: "0.7s" }}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Business Name</p>
                <p className="font-semibold text-gray-900">{currentUser.businessName || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-semibold text-gray-900">{currentUser.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">{currentUser.location || "Not set"}</p>
              </div>
            </div>
            <button className="w-full mt-4 btn-secondary">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
