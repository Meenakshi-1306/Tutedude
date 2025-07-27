"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, Phone, Building2, MapPin, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function SupplierRegister() {
  const router = useRouter()
  const { register, isAuthenticated, currentUser } = useAppStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    location: "",
  })

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && currentUser) {
      if (currentUser.role === "supplier") {
        router.push("/supplier/dashboard")
      } else {
        router.push("/vendor/dashboard")
      }
    }
  }, [isAuthenticated, currentUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Basic validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    if (!formData.phone.match(/^\+?[\d\s-()]{10,}$/)) {
      setError("Please enter a valid phone number")
      setLoading(false)
      return
    }

    try {
      const result = await register({
        ...formData,
        role: "supplier",
        isActive: true,
      })

      if (result.success) {
        setSuccess("Registration successful! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/supplier/dashboard")
        }, 2000)
      } else {
        if (result.error?.includes("already exists")) {
          setError("Account already exists with this email. Please login instead.")
        } else {
          setError(result.error || "Registration failed")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Don't render if already authenticated
  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-4 sm:py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 animate-fadeInUp">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2 sm:mb-3">Supplier Registration</h1>
          <p className="text-gray-600 text-base sm:text-lg">Join our network of trusted suppliers</p>
        </div>

        <div className="card-gradient animate-fadeInUp">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm sm:text-base">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-green-700 text-sm sm:text-base">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="input-field text-sm sm:text-base"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="input-field text-sm sm:text-base"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="input-field text-sm sm:text-base"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="input-field pr-12 text-sm sm:text-base"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Business Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    className="input-field text-sm sm:text-base"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your business name"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="input-field text-sm sm:text-base"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Responsive Register Button */}
            <button
              type="submit"
              className="w-full btn-primary text-sm sm:text-base md:text-lg py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 min-h-[48px] sm:min-h-[56px] md:min-h-[64px] flex items-center justify-center space-x-2 transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">Creating Account...</span>
                  <span className="sm:hidden">Creating...</span>
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Register as Supplier</span>
                  <span className="sm:hidden">Register</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Already have an account?{" "}
              <Link href="/supplier/login" className="text-green-600 hover:text-green-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
