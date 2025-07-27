"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Building2, ArrowLeft } from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function SupplierLogin() {
  const router = useRouter()
  const { login, isAuthenticated, currentUser, initializeMockData, users } = useAppStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Initialize mock data on component mount
  useEffect(() => {
    initializeMockData()
  }, [initializeMockData])

  useEffect(() => {
    // Redirect if already authenticated as supplier
    if (isAuthenticated && currentUser && currentUser.role === "supplier") {
      router.push("/supplier/dashboard")
    }
  }, [isAuthenticated, currentUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      // Check if user exists and get their role
      const user = users.find((u) => u.email === formData.email)

      if (!user) {
        setError("No account found with this email. Please register first.")
        setLoading(false)
        return
      }

      if (user.role !== "supplier") {
        setError("This email is registered as a vendor. Please use the vendor login page.")
        setLoading(false)
        return
      }

      const result = await login(formData.email, formData.password)

      if (result.success && result.user) {
        setSuccess("Login successful! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/supplier/dashboard")
        }, 1500)
      } else {
        setError(result.error || "Login failed")
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
    // Clear error when user starts typing
    if (error) setError("")
  }

  const fillDemoCredentials = () => {
    setFormData({
      email: "amit@supplier.com",
      password: "demo123",
    })
    setError("")
  }

  // Don't render if already authenticated as supplier
  if (isAuthenticated && currentUser && currentUser.role === "supplier") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to supplier dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-8 px-4">
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

        <div className="text-center mb-8 animate-fadeInUp">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">Supplier Login</h1>
          <p className="text-gray-600 text-lg">Access your supplier dashboard</p>
        </div>

        <div className="card-gradient animate-fadeInUp">
          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Supplier Accounts</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Email:</strong> amit@supplier.com
              </p>
              <p>
                <strong>Email:</strong> sunita@supplier.com
              </p>
              <p>
                <strong>Email:</strong> ravi@supplier.com
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

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="input-field"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your supplier email"
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
                  className="input-field pr-12"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
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

            <button
              type="submit"
              className="w-full btn-primary py-4 flex items-center justify-center space-x-2 transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5" />
                  <span>Login as Supplier</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Registration Section */}
        <div className="mt-8 text-center">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 text-sm mb-4">Don't have a supplier account?</p>
            <Link
              href="/supplier/register"
              className="w-full inline-block btn-secondary py-3 px-6 text-center transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Building2 className="w-4 h-4 inline mr-2" />
              Register as Supplier
            </Link>
            <p className="text-xs text-gray-500 mt-2">Create a new supplier account</p>
          </div>
        </div>

        {/* Link to Vendor Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Are you a vendor?{" "}
            <Link href="/vendor/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Login as Vendor
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
