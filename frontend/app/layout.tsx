import { ReactNode } from 'react';
import "./globals.css"
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <header>
          <h1 className="bg-red-500" style={{ textAlign: "center" }}>Gamers United</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
