import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar userRole={user.role} />
      <Header user={user} />
      <main className="lg:ml-64 mt-16 p-4 md:p-8">{children}</main>
    </div>
  );
}
