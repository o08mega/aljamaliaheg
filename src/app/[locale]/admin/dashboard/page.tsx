import { getTranslations } from 'next-intl/server';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
import { NewsManager } from '@/components/admin/news-manager';

export default async function AdminDashboardPage() {
  const t = await getTranslations();

  return (
    <main className="container mx-auto space-y-6 p-6">
      <header className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <MdOutlineDashboardCustomize className="text-xl text-blue-700" />
          <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
        </div>
        <p className="text-gray-600">{t('quickActions')}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <NewsManager />
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">Services CRUD (next step)</h2>
          <p className="text-sm text-gray-600">Ready for role-based actions using Supabase RLS.</p>
        </div>
      </section>
    </main>
  );
}
