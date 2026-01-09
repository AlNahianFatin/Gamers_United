import Link from "next/link";
import Greeting from "./components/Greeting";

export default function HomePage() {
  return (
    <>
      <div className="bg-red-500">
        <h1 style={{ textAlign: "center" }}>Welcome to Gamers United</h1>
        <div style={{ alignContent: "center" }}>
          <Link href="/login" style={{ textAlign: "right" }}>Login</Link> | <Link href="/signup">Signup</Link>
        </div>
      </div>
    </>
  );
}
