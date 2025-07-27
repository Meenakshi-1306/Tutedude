"use client"

import { useState } from "react"
import { Receipt, TrendingUp, DollarSign, Filter, Download, Eye } from "lucide-react"

export default function SupplierTransactions() {
  const [timeFilter, setTimeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const transactions = [
    {
      id: 1,
      orderId: "ORD-001",
      vendorName: "Central Food Corner",
      amount: 185,
      commission: 18.5,
      netAmount: 166.5,
      date: "2024-01-15",
      time: "2:30 PM",
      status: "completed",
      paymentMethod: "Vendor Wallet",
    },
    {
      id: 2,
      orderId: "ORD-002",
      vendorName: "Fresh Market Hub",
      amount: 320,
      commission: 32,
      netAmount: 288,
      date: "2024-01-14",
      time: "4:45 PM",
      status: "completed",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: 3,
      orderId: "ORD-003",
      vendorName: "Quick Snacks",
      amount: 105,
      commission: 10.5,
      netAmount: 94.5,
      date: "2024-01-14",
      time: "11:20 AM",
      status: "pending",
      paymentMethod: "Card Payment",
    },
    {
      id: 4,
      orderId: "ORD-004",
      vendorName: "Corner Store",
      amount: 275,
      commission: 27.5,
      netAmount: 247.5,
      date: "2024-01-13",
      time: "3:15 PM",
      status: "completed",
      paymentMethod: "Vendor Wallet",
    },
  ]

  const stats = {
    totalRevenue: 885,
    totalCommission: 88.5,
    netEarnings: 796.5,
    completedOrders: 3,
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesTime = timeFilter === "all" // Add time filtering logic as needed
    return matchesStatus && matchesTime
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-4xl font-bold gradient-text mb-3">Transaction History</h1>
        <p className="text-gray-600 text-lg">View and manage your payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="metric-card animate-fadeInUp">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
          <p className="text-gray-600 text-sm">Total Revenue</p>
        </div>

        <div className="metric-card animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">10%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{stats.totalCommission}</p>
          <p className="text-gray-600 text-sm">Platform Commission</p>
        </div>

        <div className="metric-card animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{stats.netEarnings}</p>
          <p className="text-gray-600 text-sm">Net Earnings</p>
        </div>

        <div className="metric-card animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
              {stats.completedOrders}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
          <p className="text-gray-600 text-sm">Total Orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-8 animate-fadeInUp">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select className="input-field w-auto" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <select
              className="input-field w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card animate-fadeInUp">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-4 px-4 font-bold text-gray-900">Order Details</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Amount</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Commission</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Net Amount</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Payment Method</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Status</th>
                <th className="text-left py-4 px-4 font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">#{transaction.orderId}</p>
                      <p className="text-sm text-gray-600">{transaction.vendorName}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-lg text-gray-900">₹{transaction.amount}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-orange-600">₹{transaction.commission}</p>
                    <p className="text-xs text-gray-500">10% fee</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-lg text-green-600">₹{transaction.netAmount}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {transaction.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`status-${transaction.status}`}>{transaction.status}</span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-16">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl">No transactions found</p>
          <p className="text-gray-400 mt-2">Transactions will appear here once you start receiving orders</p>
        </div>
      )}
    </div>
  )
}
