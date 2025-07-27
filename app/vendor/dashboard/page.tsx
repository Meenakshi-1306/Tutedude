"use client"
import { useRouter } from "next/navigation"
import { ShoppingCart, TrendingUp, Package, DollarSign, Clock, CheckCircle, Truck, AlertTriangle } from "lucide-react"
import { useAppStore } from "@/app/lib/store"
import AuthWrapper from "@/app/components/AuthWrapper"

function VendorDashboardContent() {
  const router = useRouter()
  const { currentUser, getOrdersByUser, getSuppliers, products } = useAppStore()

  const orders = currentUser ? getOrdersByUser(currentUser.id, "vendor") : []
  const suppliers = getSuppliers()
  const totalProducts = products.length

  // Calculate stats
  const totalOrders = orders.length
  const completedOrders = orders.filter((order) => order.status === "delivered").length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)

  const recentOrders = orders.slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-purple-100 text-purple-800"
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "preparing":
        return <Package className="w-4 h-4" />
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-4xl font-bold gradient-text mb-3">Welcome back, {currentUser?.name}!</h1>
        <p className="text-gray-600 text-lg">{currentUser?.businessName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card hover:shadow-xl transition-all duration-300 animate-fadeInUp">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-xl transition-all duration-300 animate-fadeInUp"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-xl transition-all duration-300 animate-fadeInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-xl transition-all duration-300 animate-fadeInUp"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="card animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              <button onClick={() => router.push("/vendor/orders")} className="btn-secondary">
                View All
              </button>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status.replace("_", " ")}</span>
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">₹{order.total}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        {order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="truncate">{order.deliveryAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-500 mb-2">No Orders Yet</h3>
                <p className="text-gray-400 mb-6">Start by browsing suppliers and placing your first order</p>
                <button onClick={() => router.push("/vendor/orders")} className="btn-primary">
                  Browse Suppliers
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card-gradient animate-fadeInUp">
            <h3 className="text-xl font-bold gradient-text mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button
                onClick={() => router.push("/vendor/orders")}
                className="w-full btn-primary text-left flex items-center"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Browse Suppliers
              </button>
              <button
                onClick={() => router.push("/vendor/analytics")}
                className="w-full btn-secondary text-left flex items-center"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                View Analytics
              </button>
              <button
                onClick={() => router.push("/vendor/wallet")}
                className="w-full btn-secondary text-left flex items-center"
              >
                <DollarSign className="w-5 h-5 mr-3" />
                Manage Wallet
              </button>
            </div>
          </div>

          {/* Suppliers Overview */}
          <div className="card animate-fadeInUp">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Available Suppliers</h3>
            <div className="space-y-3">
              {suppliers.slice(0, 3).map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{supplier.businessName}</p>
                    <p className="text-sm text-gray-600">{supplier.location}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${supplier.isActive ? "bg-green-500" : "bg-gray-400"}`}></div>
                </div>
              ))}
            </div>
            <button onClick={() => router.push("/vendor/orders")} className="w-full mt-4 btn-secondary">
              View All Suppliers
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VendorDashboard() {
  return (
    <AuthWrapper requiredRole="vendor">
      <VendorDashboardContent />
    </AuthWrapper>
  )
}
