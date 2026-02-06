'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';
import { useAdminAuth } from '@/components/admin/admin-shell';

interface UserRow {
  id: string;
  full_name: string | null;
  role_id: string | null;
  roles: { name: string }[] | null;
}

interface RoleRow {
  id: string;
  name: string;
}

export default function AdminUsersPage() {
  const t = useTranslations();
  const { role } = useAdminAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);

  const load = async () => {
    const [usersRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('id,full_name,role_id,roles(name)').order('created_at', { ascending: false }),
      supabase.from('roles').select('id,name').order('name', { ascending: true })
    ]);

    setUsers(usersRes.data ?? []);
    setRoles(rolesRes.data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  if (role !== 'admin') {
    return <div className="rounded-lg bg-white p-6 text-red-700">{t('adminOnly')}</div>;
  }

  const updateRole = async (userId: string, nextRoleId: string) => {
    await supabase.from('profiles').update({ role_id: nextRoleId }).eq('id', userId);
    load();
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-3 font-semibold">{t('usersManagement')}</h2>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="grid items-center gap-2 rounded border p-3 md:grid-cols-[1fr_220px]">
            <div>
              <div className="font-medium">{user.full_name || user.id}</div>
              <div className="text-sm text-slate-600">{t('currentRole')}: {user.roles?.[0]?.name ?? '-'}</div>
            </div>

            <select
              className="rounded border p-2"
              value={user.role_id ?? ''}
              onChange={(e) => updateRole(user.id, e.target.value)}
            >
              <option value="">-</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
