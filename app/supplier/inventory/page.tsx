"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Package, Search, Filter, Save, X } from "lucide-react"
import { useAppStore } from "@/app/lib/store"

export default function SupplierInventory() {
  const { currentUser, products, getProductsBySupplier, addProduct, updateProduct, deleteProduct } = useAppStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    unit: "kg",
    category: "Vegetables",
    description: "",
    minQuantity: 1,
    inStock: true,
    icon: "📦",
    color: "from-blue-400 to-blue-600",
  })

  const supplierProducts = currentUser ? getProductsBySupplier(currentUser.id) : []

  const categories = ["Vegetables", "Fruits", "Grains", "Spices", "Dairy Products", "Beverages", "Condiments", "Others"]
  const units = ["kg", "gram", "liter", "ml", "piece", "dozen", "bundle", "packet"]
  const icons = ["🍅", "🧅", "🥔", "🥕", "🌾", "🍎", "🍌", "🥛", "🧄", "🌶️", "🫑", "🥒", "📦"]
  const colors = [
    "from-red-400 to-red-600",
    "from-green-400 to-green-600",
    "from-blue-400 to-blue-600",
    "from-yellow-400 to-orange-500",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-indigo-400 to-indigo-600",
    "from-teal-400 to-teal-600",
  ]

  const filteredProducts = supplierProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddProduct = () => {
    if (!currentUser) return

    addProduct({
      ...newProduct,
      supplierId: currentUser.id,
    })

    setNewProduct({
      name: "",
      price: 0,
      unit: "kg",
      category: "Vegetables",
      description: "",
      minQuantity: 1,
      inStock: true,
      icon: "📦",
      color: "from-blue-400 to-blue-600",
    })
    setShowAddModal(false)
  }

  const handleUpdateProduct = (productId: string, updates: any) => {
    updateProduct(productId, updates)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId)
    }
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Please log in to manage inventory</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fadeInUp">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-3">Inventory Management</h1>
            <p className="text-gray-600 text-lg">Manage your products and stock levels</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-8 animate-fadeInUp">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="input-field pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="input-field min-w-[180px]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isEditing={editingProduct === product.id}
              onEdit={() => setEditingProduct(product.id)}
              onSave={(updates) => handleUpdateProduct(product.id, updates)}
              onCancel={() => setEditingProduct(null)}
              onDelete={() => handleDeleteProduct(product.id)}
              categories={categories}
              units={units}
              icons={icons}
              colors={colors}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-500 mb-2">No Products Found</h3>
          <p className="text-gray-400 mb-8">
            {supplierProducts.length === 0
              ? "Start by adding your first product to the inventory"
              : "Try adjusting your search criteria"}
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Product
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold gradient-text mb-6">Add New Product</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  className="input-field"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  className="input-field"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Unit</label>
                <select
                  className="input-field"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, unit: e.target.value }))}
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewProduct((prev) => ({ ...prev, icon }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newProduct.icon === icon
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <span className="text-2xl">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewProduct((prev) => ({ ...prev, color }))}
                      className={`h-10 rounded-lg bg-gradient-to-r ${color} border-2 transition-all ${
                        newProduct.color === color ? "border-gray-800 scale-110" : "border-gray-200 hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Quantity</label>
                <input
                  type="number"
                  className="input-field"
                  value={newProduct.minQuantity}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, minQuantity: Number(e.target.value) }))}
                  min="1"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, inStock: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                  />
                  <span className="font-bold text-gray-700">In Stock</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button onClick={handleAddProduct} className="btn-primary flex-1">
                <Save className="w-4 h-4 mr-2" />
                Add Product
              </button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Product Card Component
function ProductCard({
  product,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  categories,
  units,
  icons,
  colors,
  index,
}: any) {
  const [editData, setEditData] = useState(product)

  const handleSave = () => {
    onSave(editData)
  }

  if (isEditing) {
    return (
      <div
        className="card hover:shadow-xl transition-all duration-300 animate-fadeInUp"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="space-y-4">
          <input
            type="text"
            className="input-field"
            value={editData.name}
            onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Product name"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              className="input-field"
              value={editData.price}
              onChange={(e) => setEditData((prev) => ({ ...prev, price: Number(e.target.value) }))}
              placeholder="Price"
              min="0"
              step="0.01"
            />
            <select
              className="input-field"
              value={editData.unit}
              onChange={(e) => setEditData((prev) => ({ ...prev, unit: e.target.value }))}
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <select
            className="input-field"
            value={editData.category}
            onChange={(e) => setEditData((prev) => ({ ...prev, category: e.target.value }))}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editData.inStock}
              onChange={(e) => setEditData((prev) => ({ ...prev, inStock: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">In Stock</span>
          </div>

          <div className="flex space-x-2">
            <button onClick={handleSave} className="btn-success flex-1 text-sm py-2">
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            <button onClick={onCancel} className="btn-secondary flex-1 text-sm py-2">
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="card hover:shadow-xl transition-all duration-300 animate-fadeInUp"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Product Icon */}
      <div
        className={`w-full h-32 bg-gradient-to-r ${product.color} rounded-xl mb-4 flex items-center justify-center shadow-lg`}
      >
        <span className="text-4xl">{product.icon}</span>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg">
            <p className="text-xl font-bold text-blue-700">
              ₹{product.price}
              <span className="text-sm font-normal text-gray-600">/{product.unit}</span>
            </p>
          </div>
          <div className={`flex items-center px-2 py-1 rounded-full ${product.inStock ? "bg-green-50" : "bg-red-50"}`}>
            <div className={`w-2 h-2 rounded-full mr-1 ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className={`text-xs font-semibold ${product.inStock ? "text-green-700" : "text-red-700"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {product.description && <p className="text-sm text-gray-600">{product.description}</p>}

        <div className="flex space-x-2 pt-2">
          <button onClick={onEdit} className="btn-secondary flex-1 text-sm py-2">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button onClick={onDelete} className="btn-warning flex-1 text-sm py-2">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
