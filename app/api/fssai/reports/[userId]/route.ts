import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    // In a real app, fetch from database
    // For demo, return mock data
    const mockReports = [
      {
        id: "fssai_1",
        reportNumber: "FSSAI-12345678",
        orderId: "order_1",
        vendorId: userId,
        supplierId: "supplier_1",
        productName: "Spoiled Tomatoes",
        issueType: "Quality Issue",
        description: "Received rotten tomatoes with bad smell",
        severity: "high",
        status: "under_review",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      reports: mockReports,
    })
  } catch (error) {
    console.error("Get reports error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
