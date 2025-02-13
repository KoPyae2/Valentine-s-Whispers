import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ConvexClientProvider } from "../providers/ConvexClientProvider";
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Valentine's Whispers",
  description: "Share your heartfelt messages anonymously",
};

// Validate that the incoming `locale` parameter is valid
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }, { locale: 'my' }];
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'zh', 'my'].includes(locale)) notFound();

  // Enable static rendering
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
} 