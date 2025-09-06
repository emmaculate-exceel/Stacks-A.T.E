'use client';

import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { useEffect, ReactNode } from 'react';
import config from '../config/stacks.config';
import * as fcl from '@onflow/fcl';
import FloatingChat from '@/components/layout/FloatingChat';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // useEffect(() => {
  //   // Initialize Flow FCL
  //   fcl.config(config);
  // }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>African Trade Empire</title>
        <meta name="description" content="Build your trading empire in the heart of Africa" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full overflow-x-hidden">
              <div className="w-full max-w-[100vw] min-h-[calc(100vh-64px)]">
                {children}
              </div>
            </main>
            <FloatingChat/>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
