"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  ShoppingCart,
  MapPin,
  Package,
  Leaf,
  Plus,
  Navigation,
  AlertCircle,
  Store,
  Coffee,
  Truck,
  Utensils,
  Cake,
  Building,
} from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function VendorOrders() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [radiusFilter, setRadiusFilter] = useState(15) // Default 15km
  const [vendorTypeFilter, setVendorTypeFilter] = useState("all")
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt" | null>(null)

  const {
    getSuppliersWithinRadius,
    currentUser,
    userLocation,
    locationError,
    setUserLocation,
    setLocationError,
    calculateDistance,
  } = useAppStore()

  const categories = ["All", "Vegetables", "Fruits", "Grains", "Spices", "Dairy Products", "Beverages", "Condiments"]

  const vendorTypes = [
    { value: "all", label: "All Types", icon: Store },
    { value: "street_vendor", label: "Street Vendors", icon: ShoppingCart },
    { value: "restaurant", label: "Restaurants", icon: Utensils },
    { value: "cafe", label: "Cafes", icon: Coffee },
    { value: "food_truck", label: "Food Trucks", icon: Truck },
    { value: "grocery_store", label: "Grocery Stores", icon: Store },
    { value: "bakery", label: "Bakeries", icon: Cake },
    { value: "catering", label: "Catering", icon: Building },
  ]

  // Get user's location
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
          setLocationPermission("granted")
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location."
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user."
              setLocationPermission("denied")
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

    if (!userLocation && !locationError) {
      getCurrentLocation()
    }
  }, [userLocation, locationError, setUserLocation, setLocationError])

  const suppliers = getSuppliersWithinRadius(radiusFilter)

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleSupplierClick = (supplierId: string) => {
    router.push(`/vendor/orders/supplier/${supplierId}`)
  }

  const getSupplierColor = (index: number) => {
    const colors = [
      "from-green-500 to-emerald-600",
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-orange-500 to-red-500",
      "from-teal-500 to-cyan-600",
      "from-rose-500 to-pink-600",
    ]
    return colors[index % colors.length]
  }

  const getDistanceText = (supplier: any) => {
    if (!userLocation || !supplier.latitude || !supplier.longitude) {
      return null
    }

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      supplier.latitude,
      supplier.longitude,
    )

    return `${distance.toFixed(1)} km away`
  }

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLocationPermission("granted")
          setLocationError(null)
        },
        (error) => {
          setLocationPermission("denied")
          setLocationError("Location access denied. Showing all suppliers.")
        },
      )
    }
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view suppliers</h1>
        <button onClick={() => router.push("/vendor/login")} className="btn-primary">
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-4xl font-bold gradient-text mb-3">Find Suppliers</h1>
        <p className="text-gray-600 text-lg">Connect with verified suppliers for your business needs</p>
      </div>

      {/* Location Status */}
      {locationError && (
        <div className="card mb-6 bg-yellow-50 border-yellow-200 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-medium">Location Access Required</p>
                <p className="text-yellow-700 text-sm">{locationError}</p>
              </div>
            </div>
            {locationPermission === "denied" && (
              <button onClick={requestLocationPermission} className="btn-secondary text-sm">
                <Navigation className="w-4 h-4 mr-2" />
                Enable Location
              </button>
            )}
          </div>
        </div>
      )}

      {userLocation && (
        <div className="card mb-6 bg-green-50 border-green-200 animate-fadeInUp">
          <div className="flex items-center">
            <Navigation className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800">
              <span className="font-medium">Location enabled:</span> Showing suppliers within {radiusFilter}km radius
            </p>
          </div>
        </div>
      )}

      {/* Vendor Type Filter */}
      <div className="card mb-6 animate-fadeInUp">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Business Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {vendorTypes.map((type) => {
            const IconComponent = type.icon
            return (
              <button
                key={type.value}
                onClick={() => setVendorTypeFilter(type.value)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                  vendorTypeFilter === type.value
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <IconComponent className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium text-center">{type.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-8 animate-fadeInUp">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search suppliers..."
              className="input-field pl-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="input-field min-w-[180px]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category === "All" ? "" : category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <select
                className="input-field min-w-[120px]"
                value={radiusFilter}
                onChange={(e) => setRadiusFilter(Number(e.target.value))}
              >
                <option value={1}>1 km</option>
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={15}>15 km</option>
                <option value={20}>20 km</option>
                <option value={25}>25 km</option>
                <option value={30}>30 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSuppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              onClick={() => handleSupplierClick(supplier.id)}
              className="card hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                {/* Supplier Icon */}
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${getSupplierColor(index)} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg`}
                >
                  <Package className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{supplier.businessName || supplier.name}</h3>
                <p className="text-gray-600 mb-4">{supplier.name}</p>

                {/* Status */}
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`flex items-center px-3 py-1 rounded-full ${supplier.isActive ? "bg-green-50" : "bg-gray-50"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${supplier.isActive ? "bg-green-500" : "bg-gray-400"}`}
                    ></div>
                    <span className={`text-sm font-semibold ${supplier.isActive ? "text-green-700" : "text-gray-600"}`}>
                      {supplier.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Location and Distance */}
                <div className="space-y-2 mb-6">
                  {supplier.location && (
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      {supplier.location}
                    </div>
                  )}
                  {getDistanceText(supplier) && (
                    <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                      <Navigation className="w-4 h-4 mr-2" />
                      {getDistanceText(supplier)}
                    </div>
                  )}
                </div>

                <button className="btn-primary w-full text-lg" disabled={!supplier.isActive}>
                  <ShoppingCart className="w-5 h-5 inline mr-2" />
                  {supplier.isActive ? "View Products" : "Currently Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-500 mb-2">No Suppliers Found</h3>
          <p className="text-gray-400 mb-8">
            {suppliers.length === 0
              ? "No suppliers have registered yet. Be the first to invite suppliers to join!"
              : "Try adjusting your search criteria or increasing the radius"}
          </p>
          {suppliers.length === 0 && (
            <button onClick={() => router.push("/supplier/register")} className="btn-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Invite Suppliers
            </button>
          )}
        </div>
      )}
    </div>
  )
}
