import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Prompt Manager",
  description: "Gerencie seus prompts de forma eficiente",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex h-dvh min-h-0 flex-col overflow-hidden bg-gray-900 text-white">
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <NuqsAdapter>
            <Sidebar />
          </NuqsAdapter>

          <main className="relative min-h-0 min-w-0 flex-1 overflow-auto">
            <div className="mx-auto h-full max-w-full p-4 sm:p-6 md:max-w-3xl md:p-8">
              {children}
            </div>
          </main>
        </div>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
