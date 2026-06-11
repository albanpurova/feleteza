import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const baloo = Baloo_2({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FLETËZA — Karta edukative për fëmijë",
    template: "%s · FLETËZA",
  },
  description:
    "Zbuloni botën me Fletëza — karta edukative të krijuara nga ekspertë të zhvillimit të hershëm, për lojë dhe mësim me fëmijën tuaj.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-screen antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
