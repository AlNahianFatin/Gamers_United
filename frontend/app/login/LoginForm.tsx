"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../globals.css"
import Button from "../components/Button";
import Alert from "../components/Alert";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [globalError, setGlobalError] = useState("");
    const [uNameError, setUNameError] = useState("");
    const [passError, setPassError] = useState("");
    // const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();

    // const [cookie, setCookie] = useCookie('jwtToken');
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (username == "")
            setUNameError("Please enter username first!")
        else
            setUNameError("")

        if (password == "")
            setPassError("Please enter password first!")
        else
            setPassError("")

        if (username == "" || password == "")
            return;

        try {
            const userData = {
                username: username.trim(),
                password: password.trim()
            };

            if (!userData.username) {
                setUNameError("Username cannot be empty");
                return;
            }

            if (!userData.password) {
                setPassError("Password cannot be empty");
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, userData, { withCredentials: true });
            // setIsLoggedIn(true);

            const role = response.data.userExists.role;
            const id = response.data.userExists.id;

            // localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("id", id);

            // if (cookie) {
            //     setCookie('jwtToken', cookie, {
            //         maxAge: 60 * 60 * 24,
            //         sameSite: 'strict',
            //         httpOnly: true, 
            //     });
            // }

            if (role === "admin")
                router.push(`./admin/${id}`);
            else if (role === "developer")
                router.push(`./developer/${id}`);
            else
                router.push(`./player/${id}`);
        }
        catch (error: any) {
            // console.log("FULL ERROR:", error);
            // console.log("MESSAGE:", error.message);
            // console.log("CODE:", error.code);
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || "Login failed";

                if (status === 404)
                    setUNameError(message);
                else if (status === 400)
                    setPassError(message);
                else if (status === 401)
                    showError(message);
                else
                    showError(message);
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
                        <input type="text" placeholder="Username" className="input input-bordered w-full max-w-md" value={username} onChange={e => { setUsername(e.target.value); setUNameError(""); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {uNameError} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <label>Password: </label>
                        <input type="password" placeholder="Password" className="input input-bordered w-full max-w-md" value={password} onChange={e => { setPassword(e.target.value); setPassError(""); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {passError} </p>
                    </div>

                    <Link href="/forgotpass" style={{ color: "red", textAlign: "right", marginTop: "1em" }}>Forgot Password?</Link><br></br>

                    <Button text={"Login"}></Button> <br></br>
                </form>
            </div>
        </>
    );
}