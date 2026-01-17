"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../globals.css"

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [uNameError, setUNameError] = useState("");
    const [passError, setPassError] = useState("");
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const [clientReady, setClientReady] = useState(false);
    useEffect(() => {
        setClientReady(true);
    }, []);
    if (!clientReady)
        return null;


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

            localStorage.setItem("accessToken", response.data.accessToken);

            const role = response.data.userExists.role;
            const id = response.data.userExists.id;

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
                    alert(message);
                else
                    alert("Something went wrong. Please try again later.");
            }
            else
                alert("Server not reachable. Check your internet connection.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="field">
                <label>Username: </label>
                <input type="text" placeholder="Username" value={username} onChange={e => { setUsername(e.target.value); setUNameError(""); }} /> <p style={{ color: "red", paddingLeft: "100px"}}> {uNameError} </p> <br></br>
            </div>

            <div className="field">
                <label>Password: </label>
                <input type="password" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setPassError(""); }} /> <p style={{ color: "red", paddingLeft: "100px" }}> {passError} </p>
            </div>

            <Link href="/forgotpass" style={{ textAlign: "right", color: "red", paddingLeft: "100px", paddingTop: "10px" }}>Forgot Password?</Link><br></br>

            <button type="submit">Login</button> <br></br>
        </form>
    );
}
