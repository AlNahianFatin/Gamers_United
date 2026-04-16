"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../globals.css"
import Button from "../components/Button";
import ErrorAlert from "../components/Alert";

export default function ForgotPass() {
    const [email, setEmail] = useState("");
    // const [emailError, setEmailError] = useState("");
    const [globalError, setGlobalError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const router = useRouter();
    const [clientReady, setClientReady] = useState(false);

    useEffect(() => { setClientReady(true); }, []);
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
        const newErrors: Record<string, string> = {};

        if (email.trim() == "")
            newErrors.email = "Please enter your email!";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0)
            return;

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/forgotpass`, { email: email });

            if (response.status === 201)
                router.push(`/verifyotp/${email}`);
        }
        catch (error: any) {
            if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
                const backendErrors: Record<string, string> = {};
                error.response.data.message.forEach((err: any) => {
                    backendErrors[err.field] = err.messages.join(', ');
                });
                setErrors(backendErrors);
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
                        <label>Enter your email: </label>
                        <input type="email" placeholder="Email" className="input input-bordered w-full max-w-md" name="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.email} </p> <br></br>
                    </div>
                    <Button text={"Send OTP"}></Button> <br></br>
                </form >
            </div>
        </>
    );
}