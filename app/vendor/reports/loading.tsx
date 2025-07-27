export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-64 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-96"></div>
      </div>

      <div className="card mb-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-12 bg-gray-200 rounded"></div>
          <div className="w-48 h-12 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
