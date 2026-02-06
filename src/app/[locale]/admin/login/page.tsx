'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : 'Logged in successfully');
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

        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
