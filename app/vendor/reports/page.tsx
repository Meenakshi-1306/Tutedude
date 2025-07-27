"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Plus, Search, Filter, FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { useAppStore } from "@/app/lib/store"
import AuthWrapper from "@/app/components/AuthWrapper"

function VendorReportsContent() {
  const router = useRouter()
  const { currentUser, getFSSAIReportsByUser, getOrdersByUser, addFSSAIReport, users, products } = useAppStore()
  const [showReportForm, setShowReportForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    orderId: "",
    productName: "",
    issueType: "",
    description: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
  })

  const reports = currentUser ? getFSSAIReportsByUser(currentUser.id) : []
  const orders = currentUser
    ? getOrdersByUser(currentUser.id, "vendor").filter((order) => order.status === "delivered")
    : []

  const issueTypes = [
    "Quality Issue",
    "Contamination",
    "Expired Product",
    "Packaging Problem",
    "Foreign Object",
    "Adulteration",
    "Mislabeling",
    "Other",
  ]

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setLoading(true)

    try {
      const selectedOrder = orders.find((order) => order.id === formData.orderId)
      if (!selectedOrder) {
        alert("Please select a valid order")
        return
      }

      const supplier = users.find((user) => user.id === selectedOrder.supplierId)

      await addFSSAIReport({
        orderId: formData.orderId,
        vendorId: currentUser.id,
        supplierId: selectedOrder.supplierId,
        productName: formData.productName,
        issueType: formData.issueType,
        description: formData.description,
        severity: formData.severity,
      })

      // Simulate email sending
      console.log("FSSAI Report Email Sent:", {
        to: "fssai@gov.in",
        subject: `Food Safety Report - ${formData.issueType}`,
        reportData: {
          ...formData,
          vendorName: currentUser.name,
          vendorBusiness: currentUser.businessName,
          supplierName: supplier?.name,
          supplierBusiness: supplier?.businessName,
          timestamp: new Date().toISOString(),
        },
      })

      alert("Report submitted successfully! FSSAI has been notified via email.")
      setShowReportForm(false)
      setFormData({
        orderId: "",
        productName: "",
        issueType: "",
        description: "",
        severity: "medium",
      })
    } catch (error) {
      alert("Failed to submit report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.issueType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "" || report.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-4 h-4" />
      case "under_review":
        return <Eye className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 animate-fadeInUp">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-3">FSSAI Reports</h1>
          <p className="text-gray-600 text-lg">Report food safety issues to authorities</p>
        </div>
        <button onClick={() => setShowReportForm(true)} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          New Report
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card mb-8 animate-fadeInUp">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reports..."
              className="input-field pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="input-field min-w-[180px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-6">
          {filteredReports.map((report, index) => (
            <div
              key={report.id}
              className="card hover:shadow-xl transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{report.productName}</h3>
                    <p className="text-gray-600">{report.issueType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(report.status)} mb-2`}
                  >
                    {getStatusIcon(report.status)}
                    <span className="ml-1 capitalize">{report.status.replace("_", " ")}</span>
                  </span>
                  <p className="text-sm text-gray-500">Report #{report.reportNumber}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Severity</p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(report.severity)}`}
                  >
                    {report.severity.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Submitted</p>
                  <p className="text-sm text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{report.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-500 mb-2">No Reports Found</h3>
          <p className="text-gray-400 mb-8">
            {reports.length === 0
              ? "You haven't submitted any FSSAI reports yet."
              : "No reports match your search criteria."}
          </p>
          {reports.length === 0 && (
            <button onClick={() => setShowReportForm(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Submit Your First Report
            </button>
          )}
        </div>
      )}

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Submit FSSAI Report</h2>
                <button onClick={() => setShowReportForm(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Order</label>
                  <select
                    className="input-field"
                    value={formData.orderId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, orderId: e.target.value }))}
                    required
                  >
                    <option value="">Choose a delivered order</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        Order #{order.id.slice(-8)} - {new Date(order.createdAt).toLocaleDateString()} - ₹{order.total}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.productName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, productName: e.target.value }))}
                    placeholder="Name of the problematic product"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Issue Type</label>
                    <select
                      className="input-field"
                      value={formData.issueType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, issueType: e.target.value }))}
                      required
                    >
                      <option value="">Select issue type</option>
                      {issueTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Severity</label>
                    <select
                      className="input-field"
                      value={formData.severity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, severity: e.target.value as any }))}
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                  <textarea
                    className="input-field min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed information about the issue, including when it was discovered, potential health risks, and any other relevant details..."
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="btn-secondary flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VendorReports() {
  return (
    <AuthWrapper requiredRole="vendor">
      <VendorReportsContent />
    </AuthWrapper>
  )
}
