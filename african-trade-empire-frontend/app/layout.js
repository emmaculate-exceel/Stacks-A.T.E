'use client';

import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { useEffect } from 'react';
import config from '../config/stacks.config';
import * as fcl from '@onflow/fcl';
import FloatingChat from '@/components/layout/FloatingChat';


export default function RootLayout({ children }) {
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
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <FloatingChat/>
        </AuthProvider>
      </body>
    </html>
  );
}