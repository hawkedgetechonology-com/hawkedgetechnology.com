import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hawkedgetechnologies.com"),
  title: "HawkEdge Technologies | Precision Software Engineering for Modern Enterprises",
  description: "HawkEdge Technologies partners with founders, executives, and product teams to design, build, and scale premium software that drives measurable business growth.",
  openGraph: {
    title: "HawkEdge Technologies | Precision Software Engineering",
    description: "HawkEdge Technologies partners with founders, executives, and product teams to design, build, and scale premium software that drives measurable business growth.",
    url: "https://hawkedgetechnologies.com",
    siteName: "HawkEdge Technologies",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HawkEdge Technologies - Precision Software Engineering",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HawkEdge Technologies | Precision Software Engineering",
    description: "HawkEdge Technologies partners with founders, executives, and product teams to design, build, and scale premium software that drives measurable business growth.",
    images: ["/og-image.jpg"],
  },
};

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("auth_token");

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Navbar isLoggedIn={isLoggedIn} />
        <main className="flex-1 pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
