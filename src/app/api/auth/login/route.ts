import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// In-memory rate limiting store
const rateLimitStore = new Map<
  string,
  { attempts: number; lastAttempt: Date }
>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_ATTEMPTS = 5;

function getRateLimitKey(request: NextRequest): string {
  // Get IP from x-forwarded-for header or fallback to connection IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "unknown";
  return `login_attempts:${ip}`;
}

function cleanupOldEntries() {
  const now = new Date();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now.getTime() - data.lastAttempt.getTime() > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(key: string): boolean {
  cleanupOldEntries();

  const now = new Date();
  const existing = rateLimitStore.get(key);

  if (!existing) {
    rateLimitStore.set(key, { attempts: 1, lastAttempt: now });
    return true; // Allow
  }

  // Check if the window has expired
  if (now.getTime() - existing.lastAttempt.getTime() > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(key, { attempts: 1, lastAttempt: now });
    return true; // Allow
  }

  // Check if we've exceeded the limit
  if (existing.attempts >= MAX_ATTEMPTS) {
    return false; // Deny
  }

  // Increment attempts
  existing.attempts += 1;
  existing.lastAttempt = now;
  return true; // Allow
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again later.",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { password } = body;

    // Check for required environment variables
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 },
      );
    }

    let isValidPassword = false;

    try {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      isValidPassword = await bcrypt.compare(password, passwordHash);
    } catch (bcryptError) {
      console.error("Bcrypt comparison error:", bcryptError);
      return NextResponse.json(
        { success: false, error: "Authentication error" },
        { status: 500 },
      );
    }

    if (isValidPassword) {
      const response = NextResponse.json(
        { success: true, data: { message: "Authentication successful" } },
        { status: 200 },
      );

      // Set secure HTTP-only cookie
      response.cookies.set("gh_admin", "1", {
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
