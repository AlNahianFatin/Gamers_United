"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../globals.css"
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";

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
            {globalError && <ErrorAlert text={globalError} />}
            <form onSubmit={handleSubmit} className="bg-base-200 border-base-300 rounded-box w-xs border p-4">
                {/* <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"> */}
                <legend className="fieldset-legend">Login</legend>
                <div className="field">
                    <label>Username: </label>
                    <input type="text" placeholder="Username" value={username} onChange={e => { setUsername(e.target.value); setUNameError(""); }} /> <p style={{ color: "red", paddingLeft: "100px" }}> {uNameError} </p> <br></br>
                </div>

                <div className="field">
                    <label>Password: </label>
                    <input type="password" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setPassError(""); }} /> <p style={{ color: "red", paddingLeft: "100px" }}> {passError} </p>
                </div>

                <Link href="/forgotpass" style={{ textAlign: "right", color: "red", paddingLeft: "100px", paddingTop: "10px" }}>Forgot Password?</Link><br></br>

                {/* <button type="submit">Login</button> <br></br> */}
                <Button text={"Login"}></Button> <br></br>
                {/* </fieldset> */}
            </form>
        </>
    );
}