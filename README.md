# Aljamaliah Portal

بوابة مدينة الجمالية (الدقهلية) مبنية بـ **Next.js 14 (App Router)** مع **Supabase** و**i18n (عربي/إنجليزي)**.

---

## ✨ المزايا الحالية

- Next.js 14 + TypeScript + Tailwind CSS
- دعم لغتين: `ar` و `en` مع RTL/LTR
- Supabase Auth (صفحة تسجيل دخول الإدارة)
- نموذج تواصل مربوط بقاعدة البيانات (`contact_messages`)
- أساس RBAC + RLS في Supabase (Admin / Editor / Viewer)
- إعدادات جاهزة للنشر على Vercel

---

## 🧱 المتطلبات

- Node.js 18+
- npm 9+
- مشروع Supabase جاهز

---

## 📁 هيكل المشروع (مختصر)

```text
src/
  app/
    [locale]/
      page.tsx
      contact/page.tsx
      admin/login/page.tsx
      admin/dashboard/page.tsx
  i18n/
    config.ts
    request.ts
    messages/{ar,en}.json
  lib/supabase/client.ts
supabase/migrations/
```

---

## ⚙️ إعداد البيئة (Environment Variables)

أنشئ ملف `.env.local` في جذر المشروع:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co

# الخيار الأساسي
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY

# أو (مدعوم كـ fallback)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
```

> الكود يدعم المفتاحين: `NEXT_PUBLIC_SUPABASE_ANON_KEY` أو `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.

---

## 🚀 التشغيل المحلي

```bash
npm install
npm run dev
```

افتح:

- `http://localhost:3000/ar`
- `http://localhost:3000/en`

---

## 🗄️ إعداد قاعدة البيانات (Supabase)

نفّذ ملفات الـ migrations بالترتيب من مجلد:

- `supabase/migrations/202602060001_init_schema_rls.sql`
- `supabase/migrations/202602060002_roles_editor_viewer_policies.sql`

### ماذا تفعل هذه المايجريشن؟

1. إنشاء الجداول الأساسية (profiles, news, services, businesses, ads, contact_messages...).
2. إنشاء الأدوار (admin/editor/viewer).
3. تفعيل RLS.
4. سياسات صلاحيات Admin/Editor/Viewer.
5. Trigger يربط أي مستخدم جديد بدور `viewer` افتراضيًا.

---

## 📬 ربط صفحة التواصل بقاعدة البيانات

الصفحة:

- `src/app/[locale]/contact/page.tsx`

ترسل `name`, `email`, `message` إلى جدول:

- `public.contact_messages`

ويجب أن تكون سياسة insert مفعّلة للـ `anon` و `authenticated` (وهي موجودة في migration الأولى).

---

## 🔐 مسارات الإدارة

- تسجيل الدخول: `/[locale]/admin/login`
- لوحة الإدارة: `/[locale]/admin/dashboard`

> ملاحظة: حماية Routes على مستوى الجلسة/الدور يمكن توسيعها بخطوة إضافية (middleware auth checks + role guard).

---

## 🌐 النشر على Vercel

### 1) رفع المشروع إلى GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2) على Vercel

1. Import Project من GitHub.
2. Framework preset: **Next.js** (تلقائي).
3. أضف Environment Variables نفسها الموجودة في `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` أو `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
4. Deploy.

### 3) إعادة النشر بعد أي تغيير

- كل push للفرع المتصل بالمشروع سيطلق Deployment تلقائي.

---

## 🧪 أوامر مفيدة

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

---

## 🛠️ استكشاف الأخطاء

- **`next: not found`**: يعني dependencies غير مثبتة → شغّل `npm install`.
- **Supabase env missing**: تأكد من المتغيرات في `.env.local` أو Vercel Project Settings.
- **RLS يمنع الإدخال/القراءة**: راجع Policies في migrations ونفّذها على نفس مشروع Supabase الصحيح.

---

## 📌 ملاحظات تطوير لاحقة

- إضافة Route guards فعلية لـ Admin/Editor/Viewer.
- استكمال CRUD كامل للأخبار والخدمات من Dashboard.
- إضافة إدارة المستخدمين والأدوار من لوحة الإدارة.
- إضافة CI (lint + typecheck + tests) قبل النشر.

---

## 📄 الترخيص

هذا المشروع مخصص كبداية عملية قابلة للتطوير.
