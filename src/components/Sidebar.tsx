"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/habits", label: "Habits", icon: "🌸" },
  { href: "/study", label: "Study", icon: "📚" },
  { href: "/fitness", label: "Fitness", icon: "💪" },
  { href: "/books", label: "Books", icon: "📖" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/achievements", label: "Achievements", icon: "🏆" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-64 glass hidden md:flex flex-col border-r p-6 shrink-0 z-20 sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-10">
        <div className="text-3xl">🌸</div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Thamizh World
        </h1>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/20 text-primary shadow-sm"
                  : "text-foreground/70 hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              <span className="text-lg">{icon}</span>
              {label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="glass rounded-2xl p-4 text-center border-primary/20">
          <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-primary/50">
            <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Thamizh&backgroundColor=ffb6c1" />
            <AvatarFallback>TH</AvatarFallback>
          </Avatar>
          <p className="font-semibold text-sm">Thamizh</p>
          <p className="text-xs text-muted-foreground mt-0.5">Scholar in Progress 🌸</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-rose-500 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
