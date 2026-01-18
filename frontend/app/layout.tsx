import { ReactNode } from 'react';
import Image from "next/image";
import { Jaro, Itim, Inika, Inter } from 'next/font/google';
import "./globals.css"

const jaro = Jaro({ subsets: ['latin'], weight: '400' });
const itim = Itim({ subsets: ['latin'], weight: '400' });
const inika = Inika({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();
  return (
    <html>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "30px" }} className='bg-red-500'>
          <Image src='/Logo.png' style={{ height: "100px" }} alt={"Gamers United Logo"} width={100} height={100} />
          <h1 className="bg-red-500" style={{ textAlign: "center", fontFamily: "Jaro", color: "black" }}>Gamers United</h1>
        </header>
        <main style={{ flex: 1, backgroundColor: "black" }}>{children}</main>

        <footer style={{ textAlign: "center", padding: "20px", fontFamily: "Inter" }} className='bg-red-500'>&copy; {currentYear} Gamers United, Bangladesh
        </footer>
      </body>
    </html>
  );
}