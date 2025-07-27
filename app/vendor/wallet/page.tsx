"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet, CreditCard, Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, DollarSign } from "lucide-react"

export default function VendorWallet() {
  const router = useRouter()
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [amount, setAmount] = useState("")

  const walletBalance = 2450
  const transactions = [
    {
      id: 1,
      type: "debit",
      description: "Order #ORD-001 - Fresh Produce Co.",
      amount: 185,
      date: "2024-01-15",
      time: "2:30 PM",
      status: "completed",
    },
    {
      id: 2,
      type: "credit",
      description: "Wallet Top-up",
      amount: 1000,
      date: "2024-01-14",
      time: "10:15 AM",
      status: "completed",
    },
    {
      id: 3,
      type: "debit",
      description: "Order #ORD-002 - Grain Masters",
      amount: 320,
      date: "2024-01-14",
      time: "4:45 PM",
      status: "completed",
    },
    {
      id: 4,
      type: "credit",
      description: "Cashback Reward",
      amount: 25,
      date: "2024-01-13",
      time: "6:20 PM",
      status: "completed",
    },
  ]

  const handleAddMoney = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }
    router.push(`/payment/test?amount=${amount}&type=wallet`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-4xl font-bold gradient-text mb-3">My Wallet</h1>
        <p className="text-gray-600 text-lg">Manage your payments and transactions</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Wallet Balance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <div className="card-gradient animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Available Balance</p>
                  <p className="text-3xl font-bold gradient-text">₹{walletBalance.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => setShowAddMoney(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-700 font-semibold">This Month</p>
                </div>
                <p className="text-xl font-bold text-blue-800">₹1,240</p>
                <p className="text-xs text-blue-600">Spent on orders</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-sm text-green-700 font-semibold">Cashback</p>
                </div>
                <p className="text-xl font-bold text-green-800">₹85</p>
                <p className="text-xs text-green-600">Earned this month</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <Wallet className="w-5 h-5 text-purple-600 mr-2" />
                  <p className="text-sm text-purple-700 font-semibold">Total Orders</p>
                </div>
                <p className="text-xl font-bold text-purple-800">24</p>
                <p className="text-xs text-purple-600">This month</p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="card animate-fadeInUp">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card animate-fadeInUp">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowAddMoney(true)}
                className="w-full flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-semibold text-blue-700">Add Money</span>
              </button>
              <button className="w-full flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                <CreditCard className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-semibold text-green-700">Payment Methods</span>
              </button>
            </div>
          </div>

          <div className="card animate-fadeInUp">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Wallet Benefits</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">Instant payments for faster checkout</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">Earn cashback on every order</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">No transaction fees</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold gradient-text mb-6">Add Money to Wallet</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  className="input-field text-lg"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[500, 1000, 2000].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="p-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <span className="font-semibold text-gray-700">₹{quickAmount}</span>
                  </button>
                ))}
              </div>

              <div className="flex space-x-4">
                <button onClick={handleAddMoney} className="btn-primary flex-1">
                  Add Money
                </button>
                <button onClick={() => setShowAddMoney(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
