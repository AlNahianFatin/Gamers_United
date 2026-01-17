import Link from "next/link";
import { Jaro, Itim, Inika, Inter } from 'next/font/google';
import "./globals.css"

const jaro = Jaro({ subsets: ['latin'], weight: '400' });
const itim = Itim({ subsets: ['latin'], weight: '400' });
const inika = Inika({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'] });

export default function HomePage() {
  return (
    <>
      <div className="bg-red-500">
        <div className="container">
          <h2 style={{ fontFamily: "Itim", fontSize: "25px" }} className="type">Stronger Together, One Game At A Time</h2>
        </div>
        <div style={{ alignContent: "center" }}>
          <Link href="/login" style={{ textAlign: "right" }}>Login</Link> | <Link href="/signup">Signup</Link> |
          <Link href="/aboutUs"> About Us</Link>
        </div>
      </div>
    </>
  );
}