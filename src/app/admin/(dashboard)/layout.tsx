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
    <div className="min-h-screen bg-primary flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 w-full md:ml-64 p-4 md:p-8 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}
