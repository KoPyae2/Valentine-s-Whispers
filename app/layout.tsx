import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers'
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "Valentine's Whispers",
  description: "Share your heartfelt messages anonymously ❤️",
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('preferred-language')?.value || 'en'
  
  return (
    <html lang={locale}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      <body className={inter.className}>
          <ConvexClientProvider>
            {children}
            <Toaster position="top-center" richColors />
          </ConvexClientProvider>
      </body>
    </html>
  );
}
