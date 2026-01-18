"use client";
import SignupForm from "./SignupForm";

import Link from "next/link";
import "../globals.css";

export default function SignupPage() {
  return (
    <>
      <div className="bg-red-500">
        <Link href="/" style={{ textAlign: "right" }}>Home</Link> | <Link href="/aboutUs"> About Us</Link>
      </div>
      <SignupForm />
      <div style={{ background: "black", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <label>Already have an account?</label>
        <Link href="/login" style={{ paddingLeft: "10px" }}>Login</Link>
      </div>
    </>
  );
}