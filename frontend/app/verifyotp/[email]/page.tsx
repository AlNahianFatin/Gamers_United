"use client";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../../globals.css";
import Button from "@/app/components/Button";
import ErrorAlert from "../../components/ErrorAlert";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");

  const [globalError, setGlobalError] = useState("");
  const [otpError, setOtpError] = useState("");

  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const [clientReady, setClientReady] = useState(false);
  useEffect(() => {
    setClientReady(true);
  }, []);

  if (!clientReady)
    return null;

  // useEffect(() => {
  //   if (params.otp) {
  //     setOtp(params.otp as string);
  //   }
  // }, [params.otp]);

  const showError = (msg: string) => {
    setGlobalError(msg);
    setTimeout(() => {
      setGlobalError("");
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setOtpError("Email missing. Please restart password reset.");
      return;
    }
    if (otp === "") {
      setOtpError("Please enter the OTP first!");
      return;
    }
    setOtpError("");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verifyotp`, { email, otp: otp.trim() });
      router.push(`/resetpass/${email}`);
    }
    catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "OTP validation failed";
        setOtpError(message);
      }
      else
        showError("Server not reachable. Check your internet connection.");
    }
  };

  return (
    <>
      <div className="bg-red-500">

        <div className="flex justify-end">
          <ul className="flex">
            <li className="mr-3">
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/">Home</Link>
            </li>

            <li className="mr-3">
              <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href={"/login"}>Login</Link>
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

      {globalError && <ErrorAlert text={globalError} />}
      <div className="flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="bg-base-200 border-base-900 rounded-box min-w-[30em] max-w-xs border p-6 my-[1em]">
          <div className="form-control w-full max-w-md">
            <label>Enter OTP: </label>
            <input type="text" placeholder="OTP" className="input input-bordered w-full max-w-md" name="otp" value={otp} onChange={e => { setOtp(e.target.value); setOtpError(""); }} /> <br />
            <p style={{ color: "red", textAlign: "center" }}> {otpError} </p> <br></br>
          </div>
          <Button text={"Verify"}></Button> <br></br>
        </form>
      </div>
    </>
  );
}