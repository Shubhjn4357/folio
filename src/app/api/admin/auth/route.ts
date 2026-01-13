import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie, clearAuthCookie, isAuthenticated } from '@/lib/auth';

// Simple credential check (in production, use database)
async function validateCredentials(username: string, password: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  return username === adminUsername && password === adminPassword;
}

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const isValid = await validateCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken(username);
    
    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

// DELETE - Logout
export async function DELETE() {
  try {
    await clearAuthCookie();
    return NextResponse.json({ success: true, message: 'Logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

// GET - Check auth status
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    return NextResponse.json({ authenticated });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
