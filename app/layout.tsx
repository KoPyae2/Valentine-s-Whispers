import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers'
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import { NextIntlClientProvider } from 'next-intl';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Valentine's Whispers",
  description: "Share your heartfelt messages anonymously",
};

async function getMessages(locale: string) {
  try {
    return (await import(`../locales/${locale}.json`)).default;
  } catch {
    // If messages file not found, return null
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('preferred-language')?.value || 'en'
  const messages = await getMessages(locale)
  
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
