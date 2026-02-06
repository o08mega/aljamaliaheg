import { AdminShell } from '@/components/admin/admin-shell';

export default function AdminLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return <AdminShell locale={locale}>{children}</AdminShell>;
}
