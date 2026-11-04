import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BNI Anchor 香港分會｜星期四商務人脈網絡與會員名錄",
  description:
    "BNI Anchor 是香港的 BNI 星期四分會。瀏覽會員名錄與客戶，或經 WhatsApp 預約商務會議。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://burkaslarry.github.io/bni-anchor/"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Noto+Sans+TC:wght@400;600;700;900&family=Noto+Serif+TC:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
