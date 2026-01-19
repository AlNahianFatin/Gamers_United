"use client";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../../globals.css";
import Button from "@/app/components/Button";

export default function VerifyOTPPage() {
    const [password, setPassword] = useState("");
    const [rpassword, setRPassword] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});
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
                alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <>
            <div className="bg-red-500">
                <Link href="/" style={{ textAlign: "right" }}>Home</Link>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Password:</label>
                    <input type="password" placeholder="Password" name="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }} /> <p style={{ color: "red", paddingLeft: "90px" }}> {errors.password} </p> <br></br>
                </div>

                <div className="field">
                    <label>Retype Password:</label>
                    <input type="password" placeholder="Retype Password" name="rpassword" value={rpassword} onChange={e => { setRPassword(e.target.value); setErrors(prev => ({ ...prev, rpassword: "" })); }} /> <p style={{ color: "red", paddingLeft: "140px" }}> {errors.rpassword} </p> <br></br>
                </div>

                {/* <button type="submit">Reset</button><br></br> */}
                {/* <Button text={"Reset"} /> <br></br> */}
                <Button>Reset</Button> <br></br>
            </form>
        </>
    );
}