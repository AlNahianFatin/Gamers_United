"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
    const pathname = usePathname();
    const id = pathname.split("/") [2];
  return (
    <>
      <div className="bg-red-500">
        <div style={{ alignContent: "center" }}>
          <Link href="/" style={{ textAlign: "right" }}>Home</Link> | <Link href="/login" style={{ textAlign: "right" }}>Login</Link> | <Link href="/signup">Signup</Link>
        </div>
      </div>
        <h2 style={{ textAlign: "center", color: "white" }}>User not found</h2>
        <p style={{ textAlign: "center", color: "white" }}>User id {id} could not be found</p>
    </>
  );
}
