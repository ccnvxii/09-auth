import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Your personal note management system',
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanStackProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              {modal}
              <Footer />
            </div>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
