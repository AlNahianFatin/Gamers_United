"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../globals.css"

export default function ForgotPass() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const router = useRouter();

    const [clientReady, setClientReady] = useState(false);
    useEffect(() => {
        setClientReady(true);
    }, []);
    if (!clientReady)
        return null;


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email == "") {
            setEmailError("Please enter your email!")
            return;
        }
        else
            setEmailError("")

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/forgotpass`, { email: email });
            router.push(`/verifyotp/${email}`);
        }
        catch (error: any) {
            // console.log("API:", process.env.NEXT_PUBLIC_API_URL);
            // console.log("FULL ERROR:", error);
            // console.log("MESSAGE:", error.message);
            // console.log("CODE:", error.code);
            if (error.response) {
                alert(error.response.data.message || "Something went wrong");
            } else if (error.request) {
                alert("Server not reachable. Check your internet connection.");
            } else {
                alert("Unexpected error occurred");
            }
        }
    };

    return (
        <>
            <div className="bg-red-500">
                <Link href="/" style={{ textAlign: "right" }}>Home</Link> | <Link href="/login" style={{ textAlign: "right" }}>Login</Link> | <Link href="/signup" style={{ textAlign: "right" }}>Signup</Link>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Enter your email: </label>
                    <input type="email" placeholder="Email" name="email" value={email} onChange={e => { setEmail(e.target.value); setEmailError(""); }} /> <p style={{ color: "red", paddingLeft: "140px" }}> {emailError} </p> <br></br>
                </div>
                <button type="submit">Send OTP</button> <br></br>
            </form >
        </>
    );
}
