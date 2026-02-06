import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Newspaper, ShieldCheck, Stethoscope } from 'lucide-react';

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations();

  return (
    <main className="container mx-auto p-6 space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-blue-900">{t('siteName')}</h1>
        <p className="text-lg text-gray-700">{t('tagline')}</p>
        <div className="flex gap-3">
          <Link href={`/${locale}/contact`} className="rounded bg-blue-700 px-4 py-2 text-white">
            {t('contact')}
          </Link>
          <Link href={`/${locale}/admin/login`} className="rounded border border-blue-700 px-4 py-2 text-blue-700">
            {t('adminLogin')}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg bg-white p-4 shadow-sm">
          <Newspaper className="mb-2 text-blue-700" />
          <h2 className="font-semibold">{t('news')}</h2>
        </article>
        <article className="rounded-lg bg-white p-4 shadow-sm">
          <Stethoscope className="mb-2 text-emerald-700" />
          <h2 className="font-semibold">{t('services')}</h2>
        </article>
        <article className="rounded-lg bg-white p-4 shadow-sm">
          <ShieldCheck className="mb-2 text-violet-700" />
          <h2 className="font-semibold">{t('admin')}</h2>
        </article>
      </section>

      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <Image
          src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80"
          alt="City view"
          width={1400}
          height={600}
          className="h-64 w-full object-cover"
          priority
        />
      </section>
    </main>
  );
}
