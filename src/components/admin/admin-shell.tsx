'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';
import type { AuthState, RoleName } from '@/lib/supabase/types';

const AdminContext = createContext<AuthState | null>(null);

export function useAdminAuth() {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdminAuth must be used within AdminShell');
  return value;
}

export function AdminShell({ locale, children }: { locale: string; children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  useEffect(() => {
    const checkSession = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        router.replace(`/${locale}/admin/login`);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, roles(name)')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        await supabase.auth.signOut();
        router.replace(`/${locale}/admin/login`);
        return;
      }

      const roleName = ((profile.roles as { name?: string } | null)?.name || 'viewer') as RoleName;
      setAuthState({ userId, role: roleName });
      setLoading(false);
    };

    checkSession();
  }, [locale, router]);

  const items = useMemo(
    () => [
      { href: `/${locale}/admin/dashboard`, label: t('dashboard') },
      { href: `/${locale}/admin/news`, label: t('news') },
      { href: `/${locale}/admin/services`, label: t('services') },
      { href: `/${locale}/admin/users`, label: t('usersManagement'), adminOnly: true }
    ],
    [locale, t]
  );

  if (loading || !authState) {
    return <div className="p-8 text-center text-gray-600">{t('loading')}</div>;
  }

  return (
    <AdminContext.Provider value={authState}>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b bg-white">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 p-4">
            <h1 className="text-lg font-bold text-slate-800">{t('adminDashboardTitle')}</h1>
            <div className="text-sm text-slate-600">{t('role')}: {authState.role}</div>
          </div>
        </header>

        <div className="container mx-auto grid gap-4 p-4 md:grid-cols-[220px_1fr]">
          <aside className="rounded-lg bg-white p-3 shadow-sm">
            <nav className="space-y-1">
              {items
                .filter((item) => !item.adminOnly || authState.role === 'admin')
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded px-3 py-2 text-sm ${pathname === item.href ? 'bg-blue-700 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                  >
                    {item.label}
                  </Link>
                ))}
            </nav>
          </aside>

          <section>{children}</section>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
