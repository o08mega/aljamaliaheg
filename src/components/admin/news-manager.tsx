'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function NewsManager() {
  const [titleAr, setTitleAr] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [status, setStatus] = useState('');

  const addNews = async () => {
    const { error } = await supabase.from('news').insert({ title_ar: titleAr, content_ar: contentAr });
    setStatus(error ? error.message : 'News created');
    if (!error) {
      setTitleAr('');
      setContentAr('');
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-3 font-semibold">News CRUD</h2>
      <input
        value={titleAr}
        onChange={(e) => setTitleAr(e.target.value)}
        placeholder="عنوان الخبر"
        className="mb-2 w-full rounded border p-2"
      />
      <textarea
        value={contentAr}
        onChange={(e) => setContentAr(e.target.value)}
        placeholder="محتوى الخبر"
        className="mb-2 w-full rounded border p-2"
      />
      <button onClick={addNews} className="rounded bg-blue-700 px-4 py-2 text-white">
        Create
      </button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
