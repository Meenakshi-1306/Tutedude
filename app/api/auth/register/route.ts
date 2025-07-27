import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Basic validation
    const { name, email, password, role } = userData

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 })
    }

    if (!["vendor", "supplier"].includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Save to database
    // 4. Generate JWT token

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      businessName: userData.businessName,
      location: userData.location,
      phone: userData.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      user: newUser,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
