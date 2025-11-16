import { NextRequest, NextResponse } from "next/server";
import { authService, userService } from "@/lib/domain/user-management/service";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const body = await request.json();
    const { username, password } = body;
    const user = await userService.getUserByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = authService.verifyUser(user, password);

    if (isValidPassword) {
      const response = NextResponse.json(
        { success: true, data: { message: "Authentication successful" } },
        { status: 200 },
      );
      response.cookies.set("logged_in_user", user.username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8, // 8 hours
      });
      return response;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
