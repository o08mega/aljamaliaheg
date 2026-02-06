import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aljamaliah Portal',
  description: 'Public portal and admin dashboard for Aljamaliah City.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
