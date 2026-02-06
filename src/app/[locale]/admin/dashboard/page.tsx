'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';

interface DashboardStats {
  newsCount: number;
  servicesCount: number;
  contactCount: number;
  latestNews: { id: string; title_ar: string; created_at: string }[];
  latestMessages: { id: string; name: string; created_at: string }[];
}

export default function AdminDashboardPage() {
  const t = useTranslations();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const load = async () => {
      const [news, services, contacts, latestNews, latestMessages] = await Promise.all([
        supabase.from('news').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('news').select('id,title_ar,created_at').order('created_at', { ascending: false }).limit(5),
        supabase
          .from('contact_messages')
          .select('id,name,created_at')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      setStats({
        newsCount: news.count ?? 0,
        servicesCount: services.count ?? 0,
        contactCount: contacts.count ?? 0,
        latestNews: latestNews.data ?? [],
        latestMessages: latestMessages.data ?? []
      });
    };

    load();
  }, []);

  if (!stats) return <div className="rounded-lg bg-white p-6">{t('loading')}</div>;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title={t('news')} value={stats.newsCount} />
        <KpiCard title={t('services')} value={stats.servicesCount} />
        <KpiCard title={t('contactMessages')} value={stats.contactCount} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">{t('latestNews')}</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {stats.latestNews.map((item) => (
              <li key={item.id} className="rounded border p-2">
                <div>{item.title_ar}</div>
                <div className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">{t('latestActivity')}</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {stats.latestMessages.map((item) => (
              <li key={item.id} className="rounded border p-2">
                <div>{item.name || 'N/A'}</div>
                <div className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <article className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="text-sm text-slate-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-blue-800">{value}</p>
    </article>
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
