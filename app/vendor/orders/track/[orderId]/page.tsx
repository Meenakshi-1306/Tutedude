"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OrderTracking({ params }: { params: { orderId: string } }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(2)

  const orderDetails = {
    id: params.orderId,
    supplier: "Fresh Produce Co.",
    total: 185,
    items: [
      { name: "Fresh Tomatoes", quantity: 2, unit: "kg" },
      { name: "Red Onions", quantity: 1, unit: "kg" },
      { name: "Potatoes", quantity: 3, unit: "kg" },
    ],
    deliveryAgent: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      vehicle: "Bike - KA 01 AB 1234",
    },
  }

  const trackingSteps = [
    { id: 1, title: "Order Placed", description: "Your order has been confirmed", time: "10:30 AM", icon: Package },
    {
      id: 2,
      title: "Order Accepted",
      description: "Supplier has accepted your order",
      time: "10:45 AM",
      icon: CheckCircle,
    },
    { id: 3, title: "Preparing Order", description: "Your items are being prepared", time: "11:00 AM", icon: Clock },
    { id: 4, title: "Out for Delivery", description: "Order is on the way", time: "11:30 AM", icon: Truck },
    { id: 5, title: "Delivered", description: "Order has been delivered", time: "", icon: CheckCircle },
  ]

  useEffect(() => {
    // Simulate order progress
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 5 ? prev + 1 : prev))
    }, 10000) // Progress every 10 seconds for demo

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="btn-secondary mr-4">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Track Order</h1>
          <p className="text-gray-600">Order ID: #{orderDetails.id}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tracking Timeline */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>

            <div className="space-y-6">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = step.id <= currentStep
                const isCurrent = step.id === currentStep

                return (
                  <div key={step.id} className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                          {step.title}
                        </h4>
                        {step.time && <span className="text-sm text-gray-500">{step.time}</span>}
                      </div>
                      <p className={`text-sm ${isCompleted || isCurrent ? "text-gray-600" : "text-gray-400"}`}>
                        {step.description}
                      </p>
                    </div>

                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`absolute left-5 mt-10 w-0.5 h-6 ${step.id < currentStep ? "bg-green-500" : "bg-gray-200"}`}
                        style={{ marginLeft: "-1px" }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Delivery Agent Info */}
          {currentStep >= 4 && (
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Agent</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{orderDetails.deliveryAgent.name}</p>
                  <p className="text-sm text-gray-600">{orderDetails.deliveryAgent.vehicle}</p>
                </div>
                <a href={`tel:${orderDetails.deliveryAgent.phone}`} className="btn-secondary">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Supplier</span>
                <span className="font-medium">{orderDetails.supplier}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Total</span>
                <span className="font-medium">₹{orderDetails.total}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Items Ordered</h4>
              <div className="space-y-2">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <MapPin className="w-5 h-5 inline mr-2" />
              Delivery Address
            </h3>
            <div className="text-sm text-gray-600">
              <p>Your Business Location</p>
              <p>Zone A - Central</p>
              <p>Lat: 12.9716, Long: 77.5946</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
