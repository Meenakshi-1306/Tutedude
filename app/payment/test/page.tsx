"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, AlertCircle, Shield, ArrowLeft, Wallet } from "lucide-react"

export default function PaymentTest() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [amount, setAmount] = useState("")
  const [paymentType, setPaymentType] = useState("order")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  useEffect(() => {
    const urlAmount = searchParams.get("amount")
    const urlType = searchParams.get("type")
    if (urlAmount) setAmount(urlAmount)
    if (urlType) setPaymentType(urlType)
  }, [searchParams])

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Test payment initiated:", { amount, cardDetails, paymentType })

    if (paymentType === "wallet") {
      alert("Money added to wallet successfully!")
      router.push("/vendor/wallet")
    } else {
      alert("Payment successful! Redirecting to order tracking...")
      router.push("/vendor/orders/track/12345")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => router.back()} className="btn-secondary mr-4">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {paymentType === "wallet" ? "Add Money to Wallet" : "Complete Payment"}
            </h1>
            <p className="text-gray-600">Secure payment processing</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Warning Banner */}
          <div className="card mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
              <div>
                <p className="text-yellow-800 font-semibold text-lg">Test Environment</p>
                <p className="text-yellow-700">
                  This is a demo payment interface. No actual charges will be made. Real payment gateway integration
                  will be added in production.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="card-gradient">
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      {paymentType === "wallet" ? "Amount to Add" : "Order Amount"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        className="input-field pl-12 text-xl font-bold"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        required
                        readOnly={paymentType !== "wallet"}
                      />
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                      Card Details
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        className="input-field"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          className="input-field"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          className="input-field"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    className="btn-primary w-full text-xl py-4"
                    disabled={!amount || !cardDetails.name || !cardDetails.number}
                  >
                    {paymentType === "wallet" ? (
                      <>
                        <Wallet className="w-5 h-5 inline mr-2" />
                        Add ₹{amount || "0.00"} to Wallet
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 inline mr-2" />
                        Pay ₹{amount || "0.00"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-6">
              {/* Security Notice */}
              <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <p className="text-green-800 font-bold">Secure Payment</p>
                </div>
                <p className="text-green-700 text-sm">
                  Your payment information is encrypted and protected with industry-standard security.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="card">
                <h4 className="font-bold text-gray-900 mb-4">Accepted Payment Methods</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center p-3 bg-blue-50 rounded-xl">
                    <span className="text-blue-700 font-bold text-sm">VISA</span>
                  </div>
                  <div className="flex items-center justify-center p-3 bg-red-50 rounded-xl">
                    <span className="text-red-700 font-bold text-sm">Mastercard</span>
                  </div>
                  <div className="flex items-center justify-center p-3 bg-purple-50 rounded-xl">
                    <span className="text-purple-700 font-bold text-sm">RuPay</span>
                  </div>
                  <div className="flex items-center justify-center p-3 bg-orange-50 rounded-xl">
                    <span className="text-orange-700 font-bold text-sm">UPI</span>
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              {amount && (
                <div className="card">
                  <h4 className="font-bold text-gray-900 mb-4">Payment Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold">₹{amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fee</span>
                      <span className="font-semibold text-green-600">₹0</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-xl gradient-text">₹{amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
