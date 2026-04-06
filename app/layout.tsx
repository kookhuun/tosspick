import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomTabBar from "@/components/layout/BottomTabBar";
import TopNavbar from "@/components/layout/TopNavbar";
import AppHeader from "@/components/layout/AppHeader";
import FloatingHelper from "@/components/learn/FloatingHelper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "투자판 — 초보 투자자를 위한 뉴스 & 시장 분석",
  description: "복잡한 금융 정보를 한 마디로. AI가 뉴스를 요약하고 인과관계를 설명합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gray-50">
        {/* 데스크톱 상단 네비게이션 */}
        <TopNavbar />
        {/* 모바일 상단 헤더 */}
        <AppHeader />
        {/* 메인 컨텐츠 */}
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        {/* 모바일 하단 탭바 */}
        <BottomTabBar />
        {/* 전역 플로팅 헬퍼 버튼 */}
        <FloatingHelper />
      </body>
    </html>
  );
}
