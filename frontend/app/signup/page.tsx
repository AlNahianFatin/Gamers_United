"use client";
import SignupForm from "./SignupForm";

import Link from "next/link";
import "../globals.css";

export default function SignupPage() {
  return (
    <>
      <div className="bg-red-500">

        <div className="flex justify-end">
          <ul className="flex">
            <li className="mr-3">
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/">Home</Link>
            </li>

            <li className="mr-3">
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/login">Login</Link>
            </li>

            <li className="mr-3">
              <Link className="inline-block border border-red-500 rounded py-1 px-3 bg-white text-black" href={"/signup"}>Signup</Link>
            </li>

            <li className="mr-3">
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/aboutus">About Us</Link>
            </li>
          </ul>
        </div>

      </div>

      <SignupForm />
      <div style={{ background: "black", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <label>Already have an account?</label>
        <Link href="/login" style={{ color: "red", paddingLeft: "10px" }}>Login</Link>
      </div>
    </>
  );
}