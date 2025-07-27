import Link from "next/link"
import {
  Shield,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  BarChart3,
  AlertTriangle,
  Navigation,
  Truck,
  Heart,
  ArrowRight,
  Star,
} from "lucide-react"

export default function LandingPage() {
  const problemStats = [
    { number: "40%", label: "Supply Chain Accidents", icon: AlertTriangle, color: "text-red-600" },
    { number: "₹2.5L", label: "Average Loss per Accident", icon: TrendingUp, color: "text-orange-600" },
    { number: "60%", label: "Inefficient Routes", icon: Navigation, color: "text-yellow-600" },
    { number: "3hrs", label: "Wasted Daily per Vendor", icon: Clock, color: "text-purple-600" },
  ]

  const solutionFeatures = [
    {
      icon: Shield,
      title: "Accident Prevention",
      description:
        "Smart route optimization and group deliveries reduce individual trips by 70%, significantly lowering accident risks",
      color: "from-green-500 to-emerald-600",
      benefit: "70% fewer trips",
    },
    {
      icon: Navigation,
      title: "Intelligent Routing",
      description:
        "AI-powered route planning ensures safest and most efficient paths, avoiding high-risk areas and traffic",
      color: "from-blue-500 to-indigo-600",
      benefit: "50% safer routes",
    },
    {
      icon: Users,
      title: "Group Deliveries",
      description:
        "Consolidate multiple vendor orders into single delivery runs, reducing road congestion and accidents",
      color: "from-purple-500 to-pink-600",
      benefit: "60% cost reduction",
    },
    {
      icon: BarChart3,
      title: "Real-time Monitoring",
      description: "Live tracking and emergency alerts ensure immediate response to any incidents or delays",
      color: "from-orange-500 to-red-500",
      benefit: "Instant alerts",
    },
  ]

  const marketBenefits = [
    {
      title: "For Vendors",
      benefits: [
        "Reduced supply costs through group orders",
        "Lower accident insurance premiums",
        "Predictable delivery schedules",
        "Access to wider supplier network",
      ],
      color: "from-blue-500 to-purple-600",
      icon: Users,
    },
    {
      title: "For Suppliers",
      benefits: [
        "Optimized delivery routes",
        "Higher order volumes",
        "Reduced fuel and vehicle costs",
        "Better resource utilization",
      ],
      color: "from-green-500 to-emerald-600",
      icon: Truck,
    },
    {
      title: "For Society",
      benefits: [
        "Fewer road accidents",
        "Reduced traffic congestion",
        "Lower carbon emissions",
        "Food waste reduction through NGO connections",
      ],
      color: "from-orange-500 to-red-500",
      icon: Heart,
    },
  ]

  const successMetrics = [
    { number: "85%", label: "Accident Reduction", icon: Shield },
    { number: "₹50K", label: "Monthly Savings per Vendor", icon: TrendingUp },
    { number: "200+", label: "Active Users", icon: Users },
    { number: "15+", label: "Cities Covered", icon: MapPin },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-red-500 bg-opacity-20 backdrop-blur-sm border border-red-300 rounded-full px-6 py-3 mb-8">
              <AlertTriangle className="w-5 h-5 text-red-300 mr-2" />
              <span className="text-red-100 font-semibold">40% of supply chain accidents are preventable</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              End Supply Chain
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Accidents Forever
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionary platform that prevents accidents, saves lives, and transforms how vendors and suppliers
              connect through intelligent route optimization and group deliveries.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/vendor/register"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 flex items-center"
              >
                <Shield className="w-5 h-5 mr-2" />
                Join as a vendor
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/supplier/register"
                className="group border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center"
              >
                <Truck className="w-5 h-5 mr-2" />
                Join as Supplier
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-red-100 rounded-full px-6 py-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 font-semibold">The Crisis We're Solving</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Supply Chain Accidents Are
              <span className="block text-red-600">Devastating Our Markets</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every day, vendors risk their lives making multiple supply runs. Inefficient routes, poor coordination,
              and individual trips lead to preventable accidents and massive economic losses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problemStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${stat.color === "text-red-600" ? "bg-red-100" : stat.color === "text-orange-600" ? "bg-orange-100" : stat.color === "text-yellow-600" ? "bg-yellow-100" : "bg-purple-100"}`}
                    >
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 rounded-full px-6 py-3 mb-6">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold">Our Revolutionary Solution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Intelligent Safety-First
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Supply Chain Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI algorithms optimize routes, group deliveries, and prevent accidents while creating a more
              efficient marketplace for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutionFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
                >
                  <div className="flex items-start space-x-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                        <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                          {feature.benefit}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Market Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Benefits for
              <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Everyone in the Market
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform creates value for all stakeholders while making the supply chain safer and more efficient.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {marketBenefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="text-center mb-8">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{benefit.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {benefit.benefits.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 rounded-full px-6 py-3 mb-6">
              <Star className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold">Proven Results</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Impact on
              <span className="block text-green-600">Safety & Efficiency</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div key={index} className="text-center group">
                  <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <Icon className="w-12 h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <div className="text-4xl font-bold text-green-600 mb-2">{metric.number}</div>
                    <div className="text-gray-600 font-medium">{metric.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make Supply Chains
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Safer & More Efficient?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of vendors and suppliers who have already reduced accidents by 85% and increased efficiency
            by 60%
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/vendor/register"
              className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Shield className="w-5 h-5 mr-2" />
              Start Safe Operations Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/supplier/register"
              className="group border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center"
            >
              <Truck className="w-5 h-5 mr-2" />
              Join as Supplier
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
