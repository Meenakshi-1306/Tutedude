"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu,
  X,
  Home,
  Building2,
  ShoppingCart,
  BarChart3,
  LogOut,
  Receipt,
  Wallet,
  Package,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"
import { useAppStore } from "@/app/lib/store"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout, isAuthenticated } = useAppStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getNavItems = () => {
    if (pathname.startsWith("/vendor")) {
      return [
        { href: "/vendor/dashboard", label: "Dashboard", icon: Home, color: "text-blue-600" },
        { href: "/vendor/orders", label: "Orders", icon: ShoppingCart, color: "text-green-600" },
        { href: "/vendor/reports", label: "Reports", icon: AlertTriangle, color: "text-red-600" },
        { href: "/vendor/analytics", label: "Analytics", icon: BarChart3, color: "text-purple-600" },
        { href: "/vendor/wallet", label: "Wallet", icon: Wallet, color: "text-orange-600" },
      ]
    }
    if (pathname.startsWith("/supplier")) {
      return [
        { href: "/supplier/dashboard", label: "Dashboard", icon: Home, color: "text-blue-600" },
        { href: "/supplier/inventory", label: "Inventory", icon: Package, color: "text-indigo-600" },
        { href: "/supplier/orders", label: "Orders", icon: ShoppingCart, color: "text-green-600" },
        { href: "/supplier/transactions", label: "Transactions", icon: Receipt, color: "text-indigo-600" },
        { href: "/supplier/analytics", label: "Analytics", icon: BarChart3, color: "text-purple-600" },
      ]
    }
    return []
  }

  const navItems = getNavItems()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SupplyChain Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? item.color : "text-gray-600"}`} />
                  <span className={`font-medium ${isActive ? item.color : "text-gray-600"}`}>{item.label}</span>
                </Link>
              )
            })}

            {/* User Info & Logout */}
            {isAuthenticated && currentUser && (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-600">{currentUser.businessName || currentUser.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-50">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-all ${
                    isActive ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className={`w-4 h-4 ${isActive ? item.color : "text-gray-600"}`} />
                  <span className={`font-medium ${isActive ? item.color : "text-gray-600"}`}>{item.label}</span>
                </Link>
              )
            })}

            {isAuthenticated && currentUser && (
              <>
                <div className="px-3 py-3 border-t border-gray-200 mt-2">
                  <p className="font-semibold text-gray-900">{currentUser.name}</p>
                  <p className="text-sm text-gray-600">{currentUser.businessName || currentUser.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-3 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
