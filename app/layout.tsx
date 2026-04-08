import type { Metadata } from "next";
import "./globals.css";
import TopNavbar from "@/components/layout/TopNavbar";
import FloatingHelper from "@/components/learn/FloatingHelper";

export const metadata: Metadata = {
  title: "투잡판 - 초보를 위한 투자 훈련소",
  description: "어려운 투자를 쉽고 재미있게 배우는 투자 훈련 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-[#f2f4f6]">
        {/* 상단 바가 이제 메인 내비게이션 역할을 합니다 */}
        <TopNavbar />
        
        <div className="pt-14">
          {children}
        </div>

        {/* 하단 탭 바 제거됨 */}
        
        <FloatingHelper />
      </body>
    </html>
  );
}
