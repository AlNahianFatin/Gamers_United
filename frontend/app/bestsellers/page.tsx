import GetBestsellers from "./getBestsellers";

import Link from "next/link";
import { Jaro, Itim, Inika, Inter } from 'next/font/google';
import "../globals.css";

export const dynamic = "force-dynamic";

const jaro = Jaro({ subsets: ['latin'], weight: '400' });
const itim = Itim({ subsets: ['latin'], weight: '400' });
const inika = Inika({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'] });

export default async function HomePage() {
    return (
        <>
            <div className="bg-red-500">
                <div style={{ alignContent: "center" }}>
                    <Link href="/" style={{ textAlign: "right" }}>Home</Link> | <Link href="/login" style={{ textAlign: "right" }}>Login</Link> |
                    <Link href="/signup"> Signup</Link> | <Link href="/aboutUs">About Us</Link>
                </div>
            </div>

            <div style={{ margin: "3em 0" }} className="flex flex-wrap justify-center gap-20">
                <GetBestsellers />
            </div>
        </>
    );
}