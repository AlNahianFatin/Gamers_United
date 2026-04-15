"use client";

import { useEffect, useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";

export default function SignupForm() {
    const [clientReady, setClientReady] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [NID, setNid] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [rpassword, setRPassword] = useState("");

    const [globalError, setGlobalError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const router = useRouter();

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

        if (username === "")
            newErrors.username = "Please enter username first!";

        if (email === "")
            newErrors.email = "Please enter email first!";

        if (!image || image === null)
            newErrors.image = "Please select a profile image first!";

        if (NID === "")
            newErrors.NID = "Please enter NID No. first!";

        if (phone === "")
            newErrors.phone = "Please enter phone no. first!";

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
            const userData = new FormData();
            userData.append('username', username);
            userData.append('email', email);
            if (image && image !== null)
                userData.append("image", image);
            userData.append('NID', NID);
            userData.append('phone', phone);
            userData.append('password', password);

            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/signup', userData);

            if (response.status === 201)
                router.push(`./login`);
        }
        catch (error: any) {
            // console.log("FULL ERROR:", error);
            // console.log("MESSAGE:", error.message);
            // console.log("CODE:", error.code);

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
            {globalError && <ErrorAlert text={globalError} />}
            <form onSubmit={handleSubmit} className="bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Signup</legend>

                <div className="field">
                    <label>Username:</label>
                    <input type="text" placeholder="Username" name="username" value={username} onChange={e => { setUsername(e.target.value); setErrors(prev => ({ ...prev, username: "" })); }} /> <p style={{ color: "red", paddingLeft: "100px" }}> {errors.username} </p> <br></br>
                </div>

                <div className="field">
                    <label>Email:</label>
                    <input type="email" placeholder="Email" name="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }} /> <p style={{ color: "red", paddingLeft: "60px" }}> {errors.email} </p> <br></br>
                </div>

                <div className="field">
                    <label>Profile Image:</label>
                    {/* <input type="file" className="file-input file-input-error" id="image" placeholder="Profile Image" name="image" onChange={(e) => { if (e.target.files && e.target.files.length > 0) { setImage(e.target.files[0]); } }} /> <p style={{ color: "red", paddingLeft: "120px" }}> {errors.image} </p> <br></br> */}
                    <input type="file" id="image" placeholder="Profile Image" name="image" onChange={(e) => { if (e.target.files && e.target.files.length > 0) { setImage(e.target.files[0]); } }} /> <p style={{ color: "red", paddingLeft: "120px" }}> {errors.image} </p> <br></br>
                </div>

                <div className="field">
                    <label>NID:</label>
                    <input type="text" placeholder="NID" name="NID" value={NID} onChange={e => { setNid(e.target.value); setErrors(prev => ({ ...prev, NID: "" })); }} /> <p style={{ color: "red", paddingLeft: "40px" }}> {errors.NID} </p> <br></br>
                </div>

                <div className="field">
                    <label>Phone No.:</label>
                    <input type="tel" placeholder="Phone No." name="phone" value={phone} onChange={e => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: "" })); }} /> <p style={{ color: "red", paddingLeft: "100px" }}> {errors.phone} </p> <br></br>
                </div>

                <div className="field">
                    <label>Password:</label>
                    <input type="password" placeholder="Password" name="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }} /> <p style={{ color: "red", paddingLeft: "90px" }}> {errors.password} </p> <br></br>
                </div>

                <div className="field">
                    <label>Retype Password:</label>
                    <input type="password" placeholder="Retype Password" name="rpassword" value={rpassword} onChange={e => { setRPassword(e.target.value); setErrors(prev => ({ ...prev, rpassword: "" })); }} /> <p style={{ color: "red", paddingLeft: "150px" }}> {errors.rpassword} </p> <br></br>
                </div>

                {/* <button type="submit">Register</button><br></br> */}
                {/* <Button text={"Signup"} /> <br></br> */}
                <Button text={"Signup"}></Button> <br></br>
            </form>
        </>
    )
}