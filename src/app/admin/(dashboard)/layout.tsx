import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminSidebar from '@/components/dashboard/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[var(--primary)] text-[var(--text-main)] flex flex-col md:flex-row relative z-0 selection:bg-neon-purple selection:text-white">
      <AdminSidebar />
      <main className="flex-1 w-full md:ml-64 p-6 md:p-10 mt-16 md:mt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
