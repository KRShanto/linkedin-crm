import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkedIn CRM",
  description: "Manage your LinkedIn connections and prospects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-0">
              <header className="h-[60px] border-b flex items-center justify-end px-6">
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
