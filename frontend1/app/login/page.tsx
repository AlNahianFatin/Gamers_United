import Link from "next/link";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <>
      <div className="bg-red-500">

        <div className="flex justify-end">
          <ul className="flex">
            <li className="mr-3">
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/">Home</Link>
            </li>

            <li className="mr-3">
              <Link className="inline-block border border-red-500 rounded py-1 px-3 bg-white text-black" href={"/login"}>Login</Link>
            </li>

            <li className="mr-3">
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/signup">Signup</Link>
            </li>

            <li className="mr-3">
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/aboutus">About Us</Link>
            </li>
          </ul>
        </div>

      </div>
      <LoginForm />
      <div style={{ background: "black", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <label>Don't have an account?</label>
        <Link href="/signup" style={{  paddingLeft: "10px" }}>Signup</Link>
      </div>
    </>
  );
}