'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';
import { useAdminAuth } from '@/components/admin/admin-shell';

interface NewsItem {
  id: string;
  title_ar: string;
  title_en: string | null;
  content_ar: string;
  content_en: string | null;
  published: boolean;
  created_at: string;
}

const initialForm = { title_ar: '', title_en: '', content_ar: '', content_en: '', published: true };

export default function AdminNewsPage() {
  const t = useTranslations();
  const { role } = useAdminAuth();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const canEdit = role === 'admin' || role === 'editor';
  const canDelete = role === 'admin';

  const load = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    setItems((data as NewsItem[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canEdit) return;

    if (editingId) {
      await supabase.from('news').update(form).eq('id', editingId);
    } else {
      await supabase.from('news').insert(form);
    }

    setForm(initialForm);
    setEditingId(null);
    load();
  };

  const edit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      title_ar: item.title_ar,
      title_en: item.title_en ?? '',
      content_ar: item.content_ar,
      content_en: item.content_en ?? '',
      published: item.published
    });
  };

  const remove = async (id: string) => {
    if (!canDelete) return;
    await supabase.from('news').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-4">
      {canEdit && (
        <form onSubmit={submit} className="rounded-lg bg-white p-4 shadow-sm space-y-3">
          <h2 className="font-semibold">{editingId ? t('editNews') : t('createNews')}</h2>
          <input className="w-full rounded border p-2" placeholder="العنوان" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} required />
          <input className="w-full rounded border p-2" placeholder="Title EN" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
          <textarea className="w-full rounded border p-2" placeholder="المحتوى" value={form.content_ar} onChange={(e) => setForm({ ...form, content_ar: e.target.value })} required />
          <textarea className="w-full rounded border p-2" placeholder="Content EN" value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> {t('published')}</label>
          <button className="rounded bg-blue-700 px-4 py-2 text-white">{t('save')}</button>
        </form>
      )}

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">{t('newsList')}</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded border p-3">
              <div className="font-medium">{item.title_ar}</div>
              <div className="text-sm text-slate-600">{new Date(item.created_at).toLocaleString()}</div>
              <div className="mt-2 flex gap-2">
                {canEdit && <button className="rounded border px-3 py-1 text-sm" onClick={() => edit(item)}>{t('edit')}</button>}
                {canDelete && <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700" onClick={() => remove(item.id)}>{t('delete')}</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
