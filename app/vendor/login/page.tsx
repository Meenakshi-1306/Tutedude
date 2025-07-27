"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Mail, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function VendorLogin() {
  const router = useRouter()
  const { login, users, isAuthenticated, currentUser, initializeMockData } = useAppStore()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Initialize mock data on component mount
  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])

  useEffect(() => {
    // Redirect if already authenticated as vendor
    if (isAuthenticated && currentUser && currentUser.role === "vendor") {
      router.push("/vendor/dashboard")
    }
  }, [isAuthenticated, currentUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      // Check if user exists and get their role
      const user = users.find((u) => u.email === formData.email)

      if (!user) {
        setError("No account found with this email. Please register first.")
        setIsLoading(false)
        return
      }

      if (user.role !== "vendor") {
        setError("This email is registered as a supplier. Please use the supplier login page.")
        setIsLoading(false)
        return
      }

      const result = await login(formData.email, formData.password)

      if (result.success && result.user) {
        setSuccess("Login successful! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/vendor/dashboard")
        }, 1500)
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const fillDemoCredentials = () => {
    setFormData({
      email: "rajesh@vendor.com",
      password: "demo123",
    })
    setError("")
  }

  // Don't render if already authenticated as vendor
  if (isAuthenticated && currentUser && currentUser.role === "vendor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to vendor dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Vendor Login</h1>
          <p className="text-gray-600">Sign in to your vendor account</p>
        </div>

        {/* Login Form */}
        <div className="card">
          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Vendor Accounts</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Email:</strong> rajesh@vendor.com (Street Vendor)
              </p>
              <p>
                <strong>Email:</strong> priya@vendor.com (Grocery Store)
              </p>
              <p>
                <strong>Email:</strong> amit@restaurant.com (Restaurant)
              </p>
              <p>
                <strong>Password:</strong> Any password works
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="mt-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-lg transition-colors"
            >
              Use Demo Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="input-field pl-12"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="input-field pr-12"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Don't have a vendor account?</p>
              <Link
                href="/vendor/register"
                className="btn-primary w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Register as New Vendor
              </Link>
              <p className="text-xs text-gray-500 mt-2">Create a new account to start ordering supplies</p>
            </div>
          </div>
        </div>

        {/* Link to Supplier Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Are you a supplier?{" "}
            <Link href="/supplier/login" className="text-green-600 hover:text-green-800 font-medium">
              Login as Supplier
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
