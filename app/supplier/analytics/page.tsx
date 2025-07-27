"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Truck, Clock } from "lucide-react"

export default function SupplierAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")

  const stats = [
    { title: "Total Orders", value: "89", change: "+15%", trend: "up", icon: Package },
    { title: "Revenue", value: "₹45,280", change: "+22%", trend: "up", icon: DollarSign },
    { title: "Avg Delivery Time", value: "2.4h", change: "-15%", trend: "up", icon: Clock },
    { title: "Customer Rating", value: "4.9", change: "+0.1", trend: "up", icon: Users },
  ]

  const deliveryData = [
    { day: "Mon", orders: 8, revenue: 3200, avgTime: 2.1 },
    { day: "Tue", orders: 12, revenue: 4800, avgTime: 2.3 },
    { day: "Wed", orders: 10, revenue: 4200, avgTime: 2.0 },
    { day: "Thu", orders: 15, revenue: 6300, avgTime: 2.5 },
    { day: "Fri", orders: 18, revenue: 7200, avgTime: 2.8 },
    { day: "Sat", orders: 16, revenue: 6400, avgTime: 2.2 },
    { day: "Sun", orders: 10, revenue: 4180, avgTime: 1.9 },
  ]

  const topProducts = [
    { name: "Fresh Vegetables Bundle", orders: 25, revenue: 12500 },
    { name: "Dairy Products Pack", orders: 18, revenue: 9000 },
    { name: "Grains & Spices", orders: 22, revenue: 8800 },
    { name: "Fruits Assortment", orders: 15, revenue: 7500 },
  ]

  const zonePerformance = [
    { zone: "Zone A", orders: 35, revenue: 18200, avgDelivery: "2.1h" },
    { zone: "Zone B", orders: 28, revenue: 14800, avgDelivery: "2.8h" },
    { zone: "Zone C", orders: 16, revenue: 8400, avgDelivery: "3.2h" },
    { zone: "Zone D", orders: 10, revenue: 3880, avgDelivery: "2.5h" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Analytics</h1>
          <p className="text-gray-600">Track your supply performance and optimize operations</p>
        </div>
        <select className="input-field w-auto" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 3 months</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-8 h-8 text-green-600" />
                <div className={`flex items-center text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  <TrendIcon className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Delivery Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
          <div className="space-y-3">
            {deliveryData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{data.day}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(data.orders / 18) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{data.orders} orders</p>
                  <p className="text-xs text-gray-600">
                    ₹{data.revenue} • {data.avgTime}h avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Product Categories</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Performance */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Truck className="w-5 h-5 inline mr-2" />
          Zone Performance Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Zone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Delivery</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody>
              {zonePerformance.map((zone, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{zone.zone}</td>
                  <td className="py-3 px-4 text-gray-700">{zone.orders}</td>
                  <td className="py-3 px-4 text-gray-700">₹{zone.revenue}</td>
                  <td className="py-3 px-4 text-gray-700">{zone.avgDelivery}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(zone.orders / 35) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{Math.round((zone.orders / 35) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
