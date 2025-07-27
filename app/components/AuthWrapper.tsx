"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppStore } from "@/app/lib/store"

interface AuthWrapperProps {
  children: React.ReactNode
  requiredRole?: "vendor" | "supplier"
}

export default function AuthWrapper({ children, requiredRole }: AuthWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, currentUser, initializeMockData } = useAppStore()

  useEffect(() => {
    // Initialize mock data on app start
    initializeMockData()
  }, [initializeMockData])

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !currentUser) {
      // Redirect to appropriate login page based on the current path
      if (pathname.startsWith("/vendor")) {
        router.push("/vendor/login")
      } else if (pathname.startsWith("/supplier")) {
        router.push("/supplier/login")
      } else {
        router.push("/")
      }
      return
    }

    // Check if user has the required role
    if (requiredRole && currentUser.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      if (currentUser.role === "vendor") {
        router.push("/vendor/dashboard")
      } else if (currentUser.role === "supplier") {
        router.push("/supplier/dashboard")
      }
      return
    }
  }, [isAuthenticated, currentUser, requiredRole, pathname, router])

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Show error if wrong role
  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
