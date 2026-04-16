"use client";

import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../../globals.css";
import Button from "../../components/Button";
import Alert from "../../components/Alert";

export default function VerifyOTPPage() {
    const [password, setPassword] = useState("");
    const [rpassword, setRPassword] = useState("");

    const [globalError, setGlobalError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const router = useRouter();
    const params = useParams();
    const email = decodeURIComponent(params.email as string);

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

    // useEffect(() => {
    //   if (params.otp) {
    //     setOtp(params.otp as string);
    //   }
    // }, [params.otp]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (password === "")
            newErrors.password = "Please enter password first!";

        if (rpassword === "")
            newErrors.rpassword = "Please reenter your password for confirmation!";

        if (password && rpassword && password !== rpassword)
            newErrors.rpassword = "Password does not match. Recheck your password";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0)
            return;

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/resetpass`, { email, newPass: password.trim() });
            router.push(`/login`);
        }
        catch (error: any) {
            console.log("FULL ERROR:", error);
            console.log("MESSAGE:", error.message);
            console.log("CODE:", error.code);
            if (Array.isArray(error.response.data.message)) {
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

            {globalError && <Alert text={globalError} type="error" />}
            <div className="flex items-center justify-center p-4">
                <form onSubmit={handleSubmit} className="bg-base-200 border-base-900 rounded-box min-w-[30em] max-w-xs border p-6 my-[1em]">
                    <div className="form-control w-full max-w-md">
                        <label>Password:</label>
                        <input type="password" placeholder="Password" className="input input-bordered w-full max-w-md" name="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.password} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <label>Retype Password:</label>
                        <input type="password" placeholder="Retype Password" className="input input-bordered w-full max-w-md" name="rpassword" value={rpassword} onChange={e => { setRPassword(e.target.value); setErrors(prev => ({ ...prev, rpassword: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.rpassword} </p> <br></br>
                    </div>
                    <Button text={"Reset"}></Button> <br></br>
                </form>
            </div>
        </>
    );
}