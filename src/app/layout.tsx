import type { Metadata } from "next";
import "./globals.css";
import ConditionalSidebar from "@/components/ConditionalSidebar";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "🌸 Thamizh World",
  description: "Every small step becomes a stronger tomorrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex font-sans">
        <ConditionalSidebar />
        <div className="flex-1 min-h-screen overflow-y-auto">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
