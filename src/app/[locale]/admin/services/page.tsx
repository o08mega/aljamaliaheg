'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';
import { useAdminAuth } from '@/components/admin/admin-shell';

interface ServiceItem {
  id: string;
  category: string | null;
  name_ar: string;
  name_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  phone: string | null;
  created_at: string;
}

const initialForm = {
  category: '',
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  phone: ''
};

export default function AdminServicesPage() {
  const t = useTranslations();
  const { role } = useAdminAuth();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const canEdit = role === 'admin' || role === 'editor';
  const canDelete = role === 'admin';

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    setItems((data as ServiceItem[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canEdit) return;
    if (editingId) {
      await supabase.from('services').update(form).eq('id', editingId);
    } else {
      await supabase.from('services').insert(form);
    }
    setForm(initialForm);
    setEditingId(null);
    load();
  };

  const edit = (item: ServiceItem) => {
    setEditingId(item.id);
    setForm({
      category: item.category ?? '',
      name_ar: item.name_ar,
      name_en: item.name_en ?? '',
      description_ar: item.description_ar ?? '',
      description_en: item.description_en ?? '',
      phone: item.phone ?? ''
    });
  };

  const remove = async (id: string) => {
    if (!canDelete) return;
    await supabase.from('services').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-4">
      {canEdit && (
        <form onSubmit={submit} className="rounded-lg bg-white p-4 shadow-sm space-y-3">
          <h2 className="font-semibold">{editingId ? t('editService') : t('createService')}</h2>
          <input className="w-full rounded border p-2" placeholder={t('category')} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="w-full rounded border p-2" placeholder={t('serviceNameAr')} value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} required />
          <input className="w-full rounded border p-2" placeholder={t('serviceNameEn')} value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
          <textarea className="w-full rounded border p-2" placeholder={t('descriptionAr')} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
          <textarea className="w-full rounded border p-2" placeholder={t('descriptionEn')} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
          <input className="w-full rounded border p-2" placeholder={t('phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button className="rounded bg-blue-700 px-4 py-2 text-white">{t('save')}</button>
        </form>
      )}

      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">{t('servicesList')}</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded border p-3">
              <div className="font-medium">{item.name_ar}</div>
              <div className="text-sm text-slate-600">{item.category || '-'}</div>
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
