import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HawkEdge Technology | Precision Enterprise Systems & AI Engineering',
  description: 'Enterprise custom software engineering, Next.js web applications, NestJS APIs, AI automation, and verified student training paths.',
  metadataBase: new URL('https://hawkedge.io'),
  openGraph: {
    title: 'HawkEdge Technology | Precision Enterprise Systems & AI Engineering',
    description: 'We build production systems with mathematical precision and zero-debt architectures.',
    url: 'https://hawkedge.io',
    siteName: 'HawkEdge Technology',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'HawkEdge Technology',
    'url': 'https://hawkedge.io',
    'logo': 'https://hawkedge.io/logo.png',
    'description': 'Enterprise custom software engineering and high-performance AI automation pipelines.',
    'sameAs': [
      'https://github.com/hawkedge-technology',
      'https://linkedin.com/company/hawkedge'
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-bg-base text-text-primary min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
