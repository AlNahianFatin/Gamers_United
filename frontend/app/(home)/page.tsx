import FiveBestsellers from "./fiveBestsellers";

import Link from "next/link";
import Accordion from "../components/Accordion";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <>
      <div className="bg-red-500">
        <div className="container">
          <h2 style={{ fontFamily: "Itim", fontSize: "25px" }} className="type">Stronger Together, One Game At A Time..</h2>
        </div>

        <div className="flex justify-end">
          <ul className="flex">
            <li className="mr-3">
              <Link className="inline-block border border-red-500 rounded py-1 px-3 bg-white text-black" href={"/"}>Home</Link>
            </li>

            <li className="mr-3">
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/login">Login</Link>
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

      <Accordion></Accordion>

      <p style={{ fontWeight: "bold", margin: "3em 0 0 0" }}> <Link href="/bestsellers"> Top Bestsellers &gt; </Link> </p>
      <div style={{ margin: "3em 0" }} className="flex flex-wrap justify-center gap-20">
        <FiveBestsellers />
      </div>
    </>
  );
}