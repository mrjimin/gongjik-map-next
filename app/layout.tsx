import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "공직지형도",
  description: "지역과 직종으로 바라보는 대한민국 공무원",
  icons: {
    icon: "/logo.svg",
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <html
          lang="ko"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TG5GBRN4');
          `}
      </Script>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TG5GBRN4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {children}
      </body>
      </html>
  );
}
