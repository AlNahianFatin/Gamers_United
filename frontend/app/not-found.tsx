import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="bg-red-500">
        <div style={{ alignContent: "center" }}>
          <Link href="/login" style={{ textAlign: "right" }}>Login</Link> | <Link href="/signup">Signup</Link>
        </div>
      </div>
        <h2 style={{ textAlign: "center", color: "white" }}>Page not found</h2>
        <p style={{ textAlign: "center", color: "white" }}>Could not find requested resource</p>
    </>
  );
}
