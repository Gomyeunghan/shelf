import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/ui/PageTransition";
import { PlayerProvider } from "@/contexts/PlayerContext";
import GlobalPlayerBar from "@/components/playlist/GlobalPlayerBar";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shelf",
  manifest: "/manifest.webmanifest", // Next.js가 manifest.ts를 변환해줌
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shelf",
  },
  description: "친구들과 음악 플레이리스트를 공유하는 그룹 공간",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable,
      )}
    >
      <body className="h-screen overflow-hidden bg-muted/40 md:py-8 flex flex-col">
        <NextTopLoader
          color="var(--foreground)"
          height={2}
          showSpinner={false}
        />
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="lazyOnload"
        />
        <PlayerProvider>
          <div className="w-full max-w-md mx-auto flex flex-col flex-1 md:h-[calc(100vh-4rem)] bg-background border-x border-foreground/5 md:rounded-2xl md:border shadow-[0_0_60px_rgba(0,0,0,0.12)] overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <PageTransition>{children}</PageTransition>
            </div>
            <GlobalPlayerBar />
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}
