"use client"

import { useState } from "react"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  MapPin,
  Heart,
  Zap,
  Target,
} from "lucide-react"

export default function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")

  const stats = [
    {
      title: "Total Orders",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Revenue",
      value: "₹24,580",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Avg Order Value",
      value: "₹158",
      change: "-3%",
      trend: "down",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Customer Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-600",
    },
  ]

  const salesData = [
    { day: "Mon", orders: 12, revenue: 1890, percentage: 34 },
    { day: "Tue", orders: 19, revenue: 2340, percentage: 54 },
    { day: "Wed", orders: 15, revenue: 2100, percentage: 43 },
    { day: "Thu", orders: 22, revenue: 3200, percentage: 63 },
    { day: "Fri", orders: 28, revenue: 4100, percentage: 80 },
    { day: "Sat", orders: 35, revenue: 5200, percentage: 100 },
    { day: "Sun", orders: 25, revenue: 3750, percentage: 71 },
  ]

  const topProducts = [
    { name: "Fresh Tomatoes", orders: 45, revenue: 1800, icon: "🍅", color: "from-red-400 to-red-600" },
    { name: "Red Onions", orders: 38, revenue: 1140, icon: "🧅", color: "from-purple-400 to-purple-600" },
    { name: "Potatoes", orders: 42, revenue: 1050, icon: "🥔", color: "from-yellow-400 to-orange-500" },
    { name: "Green Peppers", orders: 25, revenue: 1500, icon: "🫑", color: "from-green-400 to-green-600" },
  ]

  const nearbyLocations = [
    {
      name: "Central Market Area",
      distance: "0.2 km",
      footfall: "High",
      suggestion: "Peak hours: 8-10 AM, 6-8 PM",
      color: "from-green-500 to-emerald-600",
      icon: Target,
    },
    {
      name: "Business District",
      distance: "0.8 km",
      footfall: "Very High",
      suggestion: "Great for lunch hours",
      color: "from-blue-500 to-indigo-600",
      icon: Zap,
    },
    {
      name: "Residential Complex",
      distance: "1.2 km",
      footfall: "Medium",
      suggestion: "Evening sales potential",
      color: "from-orange-500 to-red-500",
      icon: MapPin,
    },
  ]

  const ngoSuggestions = [
    {
      name: "Food for All NGO",
      distance: "1.5 km",
      contact: "+91 98765 43210",
      focus: "Daily meal programs",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Helping Hands",
      distance: "2.1 km",
      contact: "+91 87654 32109",
      focus: "Street children support",
      color: "from-blue-500 to-indigo-600",
    },
    {
      name: "Community Kitchen",
      distance: "0.9 km",
      contact: "+91 76543 21098",
      focus: "Senior citizen meals",
      color: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 animate-fadeInUp">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-3">Analytics Dashboard</h1>
          <p className="text-gray-600 text-lg">Track your business performance and get insights</p>
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
            <div key={index} className="metric-card animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.trend === "up" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                  }`}
                >
                  <TrendIcon className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-gray-600 font-medium">{stat.title}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Chart */}
        <div className="card-gradient animate-fadeInUp">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Sales Performance</h3>
          <div className="space-y-4">
            {salesData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700 w-12">{data.day}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="text-sm font-bold text-gray-900">{data.orders} orders</p>
                  <p className="text-xs text-gray-600">₹{data.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card-gradient animate-fadeInUp">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${product.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}
                  >
                    <span className="text-xl">{product.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg gradient-text">₹{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Location Suggestions */}
        <div className="card-gradient animate-fadeInUp">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            <MapPin className="w-6 h-6 inline mr-3 text-blue-600" />
            High-Traffic Location Suggestions
          </h3>
          <div className="space-y-4">
            {nearbyLocations.map((location, index) => {
              const Icon = location.icon
              return (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-6 py-4 bg-white rounded-r-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${location.color} rounded-lg flex items-center justify-center mr-3 shadow-lg`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900">{location.name}</h4>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {location.distance}
                    </span>
                  </div>
                  <div className="flex items-center mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        location.footfall === "Very High"
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                          : location.footfall === "High"
                            ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                      }`}
                    >
                      {location.footfall} Footfall
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{location.suggestion}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <Zap className="w-4 h-4 inline mr-2" />
              <strong>Pro Tip:</strong> Consider relocating during low sales periods to maximize revenue potential.
            </p>
          </div>
        </div>

        {/* NGO Suggestions */}
        <div className="card-gradient animate-fadeInUp">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            <Heart className="w-6 h-6 inline mr-3 text-red-500" />
            Nearby NGOs for Social Impact
          </h3>
          <div className="space-y-4">
            {ngoSuggestions.map((ngo, index) => (
              <div
                key={index}
                className="border-l-4 border-green-500 pl-6 py-4 bg-white rounded-r-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${ngo.color} rounded-lg flex items-center justify-center mr-3 shadow-lg`}
                    >
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900">{ngo.name}</h4>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {ngo.distance}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3 font-medium">{ngo.focus}</p>
                <a
                  href={`tel:${ngo.contact}`}
                  className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all"
                >
                  📞 {ngo.contact}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-800">
              <Heart className="w-4 h-4 inline mr-2" />
              <strong>Social Impact:</strong> Donate unsold items to help the community and reduce waste while building
              goodwill.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
