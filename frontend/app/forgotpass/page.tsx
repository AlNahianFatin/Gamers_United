"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../globals.css"
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";

export default function ForgotPass() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const router = useRouter();

    const [globalError, setGlobalError] = useState("");

    const [clientReady, setClientReady] = useState(false);
    useEffect(() => {
        setClientReady(true);
    }, []);
    if (!clientReady)
        return null;

    const showError = (msg: string) => {
        setGlobalError(msg);
        setTimeout(() => {
            setGlobalError("");
        }, 2000);
    };

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
            if (error.response)
                setEmailError(error.response.data.message || "Something went wrong")
            // alert(error.response.data.message || "Something went wrong");
            else if (error.request)
                showError("Server not reachable. Check your internet connection.");

            else
                showError("Unexpected error occurred");
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
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Enter your email: </label>
                    <input type="email" placeholder="Email" name="email" value={email} onChange={e => { setEmail(e.target.value); setEmailError(""); }} /> <p style={{ color: "red", paddingLeft: "140px" }}> {emailError} </p> <br></br>
                </div>
                <Button>Send OTP</Button> <br></br>
                {/* <Button text={"Send OTP"} /> <br></br> */}
                {/* <button type="submit">Send OTP</button> <br></br> */}
            </form >
        </>
    );
}
