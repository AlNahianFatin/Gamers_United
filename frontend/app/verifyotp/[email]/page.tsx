"use client";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../../globals.css";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const [clientReady, setClientReady] = useState(false);
  useEffect(() => {
    setClientReady(true);
  }, []);
  if (!clientReady) return null;

  // useEffect(() => {
  //   if (params.otp) {
  //     setOtp(params.otp as string);
  //   }
  // }, [params.otp]);

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
        alert("Server not reachable. Check your internet connection.");
    }
  };

  return (
    <>
      <div className="bg-red-500">
        <Link href="/" style={{ textAlign: "right" }}>Home</Link> | <Link href="/login" style={{ textAlign: "right" }}>Login</Link> | <Link href="/signup" style={{ textAlign: "right" }}>Signup</Link>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Enter OTP: </label>
        <input type="text" placeholder="OTP" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} /> <br />
        {otpError && <p style={{ color: "red" }}>{otpError}</p>}
        <button type="submit">Validate OTP</button>
        <br />
      </form>
    </>
  );
}