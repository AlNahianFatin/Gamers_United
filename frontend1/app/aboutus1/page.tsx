import Link from "next/link";
import { Jaro, Itim, Inika, Inter } from 'next/font/google';
import "../globals.css"

const jaro = Jaro({ subsets: ['latin'], weight: '400' });
const itim = Itim({ subsets: ['latin'], weight: '400' });
const inika = Inika({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'] });

export default function AboutPage() {
  return (
    <div className="bg-black h-screen">
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
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/signup">Signup</Link>
            </li>

            <li className="mr-3">
              <Link className="inline-block border border-red-500 rounded py-1 px-3 bg-white text-black" href={"/aboutus"}>About Us</Link>
            </li>
          </ul>
        </div>

      </div>
      <p style={{ textAlign: "center", fontFamily: "Inika", marginBottom: "3rem", padding: "20px" }}>We are young developers aiming to learn and build qualityful industry level web applications.<br></br>
        This web application was built on NEXT.JS for frontend and NestJS for backend following Node.JS architecture.<br></br>
        Feel free to share your thoughts!
      </p>

      <div className="flex flex-wrap justify-center gap-20" style={{ fontFamily: "Inter" }}>
        <div className="card bg-base-100 w-66 shadow-sm">
          <figure className="px-10 pt-10">
            <img src="/Fatin.jpg" alt="Al Nahian Fatin" className="rounded-xl" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Al Nahian Fatin</h2>
            <p>ID: 23-50884-1</p>
          </div>
        </div>
        <div className="card bg-base-100 w-66 shadow-sm">
          <figure className="px-10 pt-10">
            <img src="/Murshed.jpeg" alt="Murshed Ahmed" className="rounded-xl" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Murshed Ahmed</h2>
            <p>ID: 23-50910-1</p>
          </div>
        </div>
        <div className="card bg-base-100 w-66 shadow-sm">
          <figure className="px-10 pt-10">
            <img src="/Nuhin.jpg" alt="Shanjidul Islam" className="rounded-xl" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Shanjidul Islam</h2>
            <p>ID: 23-50912-1</p>
          </div>
        </div>
      </div>
    </div>
  );
}