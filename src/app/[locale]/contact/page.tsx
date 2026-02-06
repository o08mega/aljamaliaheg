'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';

export default function ContactPage() {
  const t = useTranslations();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      message
    });

    if (error) {
      setStatus(t('contactError'));
      return;
    }

    setStatus(t('contactSuccess'));
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <main className="container mx-auto max-w-2xl p-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-blue-900">{t('contactFormTitle')}</h1>

        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border p-2"
            placeholder={t('name')}
            required
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
            placeholder={t('email')}
            type="email"
            required
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-36 w-full rounded border p-2"
            placeholder={t('message')}
            required
          />

          <button type="submit" className="rounded bg-blue-700 px-4 py-2 text-white">
            {t('send')}
          </button>
        </form>

        {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}
      </div>
    </main>
  );
}
