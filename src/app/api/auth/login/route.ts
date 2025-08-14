import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Validate password against environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    let isValidPassword = false;

    try {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      isValidPassword = await bcrypt.compare(password, passwordHash);
    } catch (bcryptError) {
      console.error('Bcrypt comparison error:', bcryptError);
      return NextResponse.json(
        { success: false, error: 'Authentication error' },
        { status: 500 }
      );
    }

    if (isValidPassword) {
      const response = NextResponse.json(
        { success: true, data: { message: 'Authentication successful' } },
        { status: 200 }
      );
      
      // Set secure HTTP-only cookie
      response.cookies.set('gh_admin', '1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 hours
      });
      
      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}