export interface AdminCredentials {
  username: string;
  password: string;
}

/**
 * Log in to admin portal
 */
export async function loginAdmin(credentials: AdminCredentials): Promise<boolean> {
  const res = await fetch('/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return true;
}

/**
 * Log out from admin portal
 */
export async function logoutAdmin(): Promise<boolean> {
  const res = await fetch('/api/admin/auth', {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Logout failed');
  }

  return true;
}

/**
 * Check admin authentication status
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/auth', { cache: 'no-store' });
    const data = await res.json();
    return !!data.authenticated;
  } catch {
    return false;
  }
}
