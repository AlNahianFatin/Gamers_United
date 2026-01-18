import Link from "next/link";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <>
      <div className="bg-red-500">
        <Link href="/" style={{ textAlign: "right" }}>Home</Link> | <Link href="/aboutUs"> About Us</Link>
      </div>
      <LoginForm />
      <div style={{ background: "black", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <label>Don't have an account?</label>
        <Link href="/signup" style={{  paddingLeft: "10px" }}>Signup</Link>
      </div>
    </>
  );
}