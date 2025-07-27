"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  User,
  MapPin,
  Phone,
  Filter,
  Search,
  Eye,
  Check,
  X,
} from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function SupplierOrders() {
  const router = useRouter()
  const { currentUser, getOrdersByUser, updateOrder, users, isAuthenticated } = useAppStore()

  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Load orders
  useEffect(() => {
    if (currentUser) {
      const supplierOrders = getOrdersByUser(currentUser.id, "supplier")

      // Enrich orders with vendor information
      const enrichedOrders = supplierOrders.map((order) => {
        const vendor = users.find((u) => u.id === order.vendorId)
        return {
          ...order,
          vendor,
        }
      })

      setOrders(enrichedOrders)
    }
  }, [currentUser, getOrdersByUser, users])

  // Filter orders
  useEffect(() => {
    let filtered = orders

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.vendor?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredOrders(filtered)
  }, [orders, statusFilter, searchTerm])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      updateOrder(orderId, { status: newStatus })

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order,
        ),
      )

      // Close modal if open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "preparing":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    }
  }

  // Redirect if not authenticated or not a supplier
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/supplier/login")
      return
    }

    if (currentUser?.role !== "supplier") {
      router.push("/vendor/dashboard")
      return
    }
  }, [isAuthenticated, currentUser, router])

  if (!isAuthenticated || currentUser?.role !== "supplier") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const stats = getOrderStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-3">Order Management</h1>
          <p className="text-gray-600 text-lg">Manage incoming orders from vendors</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.preparing}</div>
            <div className="text-sm text-gray-600">Preparing</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders by vendor name or order ID..."
                  className="input-field pl-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="input-field pl-12 appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {orders.length === 0 ? "You haven't received any orders yet." : "No orders match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold text-gray-900">Order #{order.id.slice(-8)}</h3>
                        <div
                          className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-2 text-sm font-medium capitalize">{order.status.replace("_", " ")}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">₹{order.total}</div>
                        <div className="text-sm text-gray-600">{order.items.length} items</div>
                      </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {order.vendor?.businessName || order.vendor?.name}
                            </h4>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{order.vendor?.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            <span>{order.vendor?.phone}</span>
                          </div>
                          <div className="mt-1">Ordered: {formatDate(order.createdAt)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item: any, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <button onClick={() => setSelectedOrder(order)} className="btn-secondary flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>

                      <div className="flex space-x-2">
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order.id, "cancelled")}
                              className="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </button>
                            <button onClick={() => handleStatusUpdate(order.id, "accepted")} className="btn-primary">
                              <Check className="w-4 h-4 mr-2" />
                              Accept
                            </button>
                          </>
                        )}

                        {order.status === "accepted" && (
                          <button onClick={() => handleStatusUpdate(order.id, "preparing")} className="btn-primary">
                            <Package className="w-4 h-4 mr-2" />
                            Start Preparing
                          </button>
                        )}

                        {order.status === "preparing" && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, "out_for_delivery")}
                            className="btn-primary"
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Out for Delivery
                          </button>
                        )}

                        {order.status === "out_for_delivery" && (
                          <button onClick={() => handleStatusUpdate(order.id, "delivered")} className="btn-primary">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order ID</label>
                    <p className="font-semibold">#{selectedOrder.id.slice(-8)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1 capitalize">{selectedOrder.status.replace("_", " ")}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order Date</label>
                    <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Amount</label>
                    <p className="font-semibold text-xl gradient-text">₹{selectedOrder.total}</p>
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Vendor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Name</label>
                      <p className="font-semibold">{selectedOrder.vendor?.businessName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contact Person</label>
                      <p className="font-semibold">{selectedOrder.vendor?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="font-semibold">{selectedOrder.vendor?.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Location</label>
                      <p className="font-semibold">{selectedOrder.vendor?.location}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-600">Delivery Address</label>
                  <p className="font-semibold bg-gray-50 p-3 rounded-lg">{selectedOrder.deliveryAddress}</p>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.unit} × ₹{item.price}
                          </p>
                        </div>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.specialInstructions && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-600">Special Instructions</label>
                    <p className="bg-yellow-50 p-3 rounded-lg">{selectedOrder.specialInstructions}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  {selectedOrder.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedOrder.id, "cancelled")
                          setSelectedOrder(null)
                        }}
                        className="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Reject Order
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedOrder.id, "accepted")
                          setSelectedOrder(null)
                        }}
                        className="btn-primary"
                      >
                        Accept Order
                      </button>
                    </>
                  )}

                  {selectedOrder.status === "accepted" && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, "preparing")
                        setSelectedOrder(null)
                      }}
                      className="btn-primary"
                    >
                      Start Preparing
                    </button>
                  )}

                  {selectedOrder.status === "preparing" && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, "out_for_delivery")
                        setSelectedOrder(null)
                      }}
                      className="btn-primary"
                    >
                      Out for Delivery
                    </button>
                  )}

                  {selectedOrder.status === "out_for_delivery" && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedOrder.id, "delivered")
                        setSelectedOrder(null)
                      }}
                      className="btn-primary"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
