"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, MessageSquare, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "DM Strategy", href: "/dm-strategy", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[250px] flex-col border-r bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg text-zinc-900 dark:text-zinc-100"
        >
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500 bg-clip-text text-transparent">
            LinkedIn CRM
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive
                    ? "text-blue-700 dark:text-blue-400"
                    : "text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800/50">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Need help?
          </p>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-400">
            Check our documentation or contact support for assistance.
          </p>
          <Link
            href="/docs"
            className="mt-4 block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View documentation →
          </Link>
        </div>
      </div>
    </div>
  );
}
