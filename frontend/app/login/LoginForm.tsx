"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../globals.css"
import Button from "../components/Button";
import Alert from "../components/Alert";

export default function LoginForm() {
    const [clientReady, setClientReady] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [globalError, setGlobalError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    // const [uNameError, setUNameError] = useState("");
    // const [passError, setPassError] = useState("");

    const router = useRouter();

    // const [cookie, setCookie] = useCookie('jwtToken');
    useEffect(() => { setClientReady(true); }, []);

    if (!clientReady)
        return null;

    const showError = (msg: string) => {
        setGlobalError(msg);
        setTimeout(() => {
            setGlobalError("");
        }, 2000);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!username.trim())
            newErrors.username = "Please enter username first!";
        // else
        //     newErrors.username = "";

        if (password == "")
            newErrors.password = "Please enter password first!";
        // else
        //     newErrors.password = "Please enter password first!";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0)
            return;

        try {
            const userData = {
                username: username.trim(),
                password: password
            };

            // if (!userData.username) {
            //     setUNameError("Username cannot be empty");
            //     return;
            // }

            // if (!userData.password) {
            //     setPassError("Password cannot be empty");
            //     return;
            // }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, userData, { withCredentials: true });
            // setIsLoggedIn(true);

            const role = response.data.userExists.role;
            const id = response.data.userExists.id;

            localStorage.setItem("id", id);

            if (role === "admin")
                router.push(`./admin/${id}`);
            else if (role === "developer")
                router.push(`./developer/${id}`);
            else
                router.push(`./player/${id}`);
        }
        catch (error: any) {
            console.log("FULL ERROR:", error);
            console.log("MESSAGE:", error.message);
            console.log("CODE:", error.code);

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
            {globalError && <Alert text={globalError} type="error" />}
            <div className="flex items-center justify-center p-4">
                <form onSubmit={handleSubmit} className="bg-base-200 border-base-900 rounded-box min-w-[30em] max-w-xs border p-6 my-[1em]">
                    <legend className="text-2xl font-bold text-center">Login</legend>

                    <div className="form-control w-full max-w-md">
                        <label>Username: </label>
                        <input type="text" placeholder="Username" className="input input-bordered w-full max-w-md" name="username" value={username} onChange={e => { setUsername(e.target.value); setErrors(prev => ({ ...prev, username: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.username} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <label>Password: </label>
                        <input type="password" placeholder="Password" className="input input-bordered w-full max-w-md" name="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.password} </p>
                    </div>

                    <Link href="/forgotpass" style={{ color: "red", textAlign: "right", marginTop: "1em" }}>Forgot Password?</Link><br></br>

                    <Button text={"Login"}></Button> <br></br>
                </form>
            </div>
        </>
    );
}