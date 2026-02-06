'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';

export default function AdminLoginPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.replace(`/${locale}/admin/dashboard`);
    };
    check();
  }, [locale, router]);

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace(`/${locale}/admin/dashboard`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">{t('adminLogin')}</h1>

        <input
          className="mb-4 w-full rounded border p-2"
          placeholder={t('email')}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <input
          type="password"
          className="mb-4 w-full rounded border p-2"
          placeholder={t('password')}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button onClick={login} className="w-full rounded bg-blue-700 py-2 text-white">
          {t('login')}
        </button>

        {message && <p className="mt-4 text-center text-sm text-red-700">{message}</p>}
      </div>
    </div>
  );
}
