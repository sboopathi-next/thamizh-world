"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/habits", label: "Habits", icon: "🌸" },
  { href: "/study", label: "Study", icon: "📚" },
  { href: "/fitness", label: "Fitness", icon: "💪" },
  { href: "/books", label: "Books", icon: "📖" },
  { href: "/calendar", label: "Cal", icon: "📅" },
  { href: "/achievements", label: "Awards", icon: "🏆" },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <>
      {/* Spacer so page content isn't hidden behind the nav */}
      <div className="md:hidden h-20 flex-shrink-0" />

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "rgba(255, 235, 245, 0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1.5px solid rgba(220, 130, 170, 0.25)",
          boxShadow: "0 -4px 24px rgba(200, 100, 150, 0.08)",
        }}
        className="md:hidden"
      >
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3px",
                  padding: "10px 14px 12px",
                  flexShrink: 0,
                  minWidth: "60px",
                  flex: 1,
                  textDecoration: "none",
                  color: isActive ? "hsl(330, 80%, 60%)" : "hsl(330, 10%, 55%)",
                  position: "relative",
                  transition: "color 0.15s",
                }}
              >
                {/* Active indicator bar at top */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "28px",
                      height: "3px",
                      borderRadius: "0 0 4px 4px",
                      background: "hsl(330, 80%, 60%)",
                    }}
                  />
                )}
                <span style={{ fontSize: "20px", lineHeight: 1 }}>{icon}</span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "0.01em",
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
