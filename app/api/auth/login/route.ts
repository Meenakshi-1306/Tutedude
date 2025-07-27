import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Query your database for the user
    // 2. Verify the password hash
    // 3. Generate a JWT token
    // 4. Set secure cookies

    // For demo purposes, we'll simulate this
    const mockUsers = [
      { id: "1", email: "vendor@demo.com", role: "vendor", name: "Demo Vendor" },
      { id: "2", email: "supplier@demo.com", role: "supplier", name: "Demo Supplier" },
    ]

    const user = mockUsers.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Simulate password verification (in real app, use bcrypt)
    if (password.length < 3) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
