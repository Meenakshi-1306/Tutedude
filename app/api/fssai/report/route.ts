import { type NextRequest, NextResponse } from "next/server"

// Mock email service (in production, use services like SendGrid, AWS SES, etc.)
async function sendFSSAIEmail(reportData: any) {
  // Simulate email sending
  console.log("Sending FSSAI report email:", {
    to: "fssai@gov.in",
    subject: `Food Safety Violation Report - ${reportData.reportNumber}`,
    body: `
      Report Number: ${reportData.reportNumber}
      Vendor: ${reportData.vendorName}
      Supplier: ${reportData.supplierName}
      Product: ${reportData.productName}
      Issue Type: ${reportData.issueType}
      Severity: ${reportData.severity}
      Description: ${reportData.description}
      Date: ${reportData.createdAt}
    `,
  })

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true, messageId: `msg_${Date.now()}` }
}

export async function POST(request: NextRequest) {
  try {
    const reportData = await request.json()

    // Validation
    const { orderId, vendorId, supplierId, productName, issueType, description, severity } = reportData

    if (!orderId || !vendorId || !supplierId || !productName || !issueType || !description || !severity) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    if (!["low", "medium", "high", "critical"].includes(severity)) {
      return NextResponse.json({ success: false, error: "Invalid severity level" }, { status: 400 })
    }

    // Generate report
    const report = {
      id: `fssai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reportNumber: `FSSAI-${Date.now().toString().slice(-8)}`,
      ...reportData,
      status: "submitted",
      createdAt: new Date().toISOString(),
    }

    // Send email to FSSAI
    try {
      await sendFSSAIEmail({
        ...report,
        vendorName: reportData.vendorName || "Unknown Vendor",
        supplierName: reportData.supplierName || "Unknown Supplier",
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Continue with report creation even if email fails
    }

    return NextResponse.json({
      success: true,
      report,
      message: "Report submitted successfully and FSSAI has been notified via email",
    })
  } catch (error) {
    console.error("FSSAI report error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
