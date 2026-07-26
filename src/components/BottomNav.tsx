"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/habits", label: "Habits", icon: "🌸" },
  { href: "/study", label: "Study", icon: "📚" },
  { href: "/fitness", label: "Fitness", icon: "💪" },
  { href: "/books", label: "Books", icon: "📖" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/achievements", label: "Awards", icon: "🏆" },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-primary/20 flex items-stretch">
      <div className="flex w-full overflow-x-auto scrollbar-hide">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2.5 px-3 flex-shrink-0 transition-all min-w-[60px] ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
              <span className="text-xl leading-none relative">{icon}</span>
              <span className={`text-[10px] font-medium mt-0.5 ${isActive ? "text-primary font-semibold" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
