"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "../../../../components/Button";
import Alert from "../../../../components/Alert";

export default function UpdateForm({ adminID }: { adminID: number }) {
    const [clientReady, setClientReady] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [NID, setNid] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [rpassword, setRPassword] = useState("");
    const [noInput, setNoInput] = useState("");

    const [globalError, setGlobalError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // const router = useRouter();
    const [successMsg, setSuccessMsg] = useState("");

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

        if (!username.trim() && !email.trim() && !image && !NID.trim() && !phone.trim()) {
            setErrors({ noInput: "Please update at least one field" });
            return;
        }
        // else {
        //     newErrors.noInput = "";
        //     setErrors(prev => ({ ...prev, noInput: "" }));
        // }

        if (password === "")
            newErrors.password = "Please enter current password first!";

        if (rpassword === "")
            newErrors.rpassword = "Please reenter your password for confirmation!";

        if (password && rpassword && password !== rpassword)
            newErrors.rpassword = "Passwords do not match. Recheck your password";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0)
            return;

        try {
            // const existingData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getAdminByID/${adminID}`, { withCredentials: true });

            const userData = new FormData();
            if (username.trim()) userData.set('username', username);
            if (email.trim()) userData.set('email', email);
            if (NID.trim()) userData.set('NID', NID);
            if (phone.trim()) userData.set('phone', phone);
            if (image) userData.set("image", image);

            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/updateFullAdmin/${adminID}`, userData, { withCredentials: true });
            console.log("BODY SENT:", Object.fromEntries(userData.entries()));

            if (response.status === 200) {
                setUsername("");
                setEmail("");
                setImage(null);
                setNid("");
                setPhone("");
                setPassword("");
                setRPassword("");
                setErrors({});

                setSuccessMsg("Profile updated successfully");
                setTimeout(() => {
                    setSuccessMsg("");
                }, 2000);
            }
        }
        catch (error: any) {
            console.log("FULL ERROR:", error);
            console.log("MESSAGE:", error.message);
            console.log("CODE:", error.code);

            // if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
            //     const backendErrors: Record<string, string> = {};
            //     // error.response.data.message.forEach((err: any) => {
            //     //     backendErrors[err.field] = err.messages.join(', ');
            //     // });
            //     error.response?.data?.message.forEach((err: any) => {
            //         backendErrors[err.property] =
            //             Object.values(err.constraints).join(", ");
            //     });
            //     setErrors(prev => ({ ...prev, ...backendErrors }));
            // }
            // // if (error.response?.data?.message) {
            // //     if (Array.isArray(error.response.data.message)) {
            // //         setErrors({ backendErrors: error.response.data.message.join(", ") });
            // //     } else {
            // //         setErrors({ backendErrors: error.response.data.message });
            // //     }
            // // }
            // else
            //     showError("Server not reachable. Check your internet connection.");

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
            {successMsg && <Alert text={successMsg} type="success" />}
            {globalError && <Alert text={globalError} type="error" />}
            <div className="min-h-screen flex items-center justify-center p-4">
                <form onSubmit={handleSubmit} className="bg-base-200 border-base-900 rounded-box min-w-[40em] max-w-xs border p-6 my-[1em]">
                    <legend className="text-2xl font-bold text-center">Update Profile</legend>

                    <div className="form-control w-full max-w-md">
                        <label>Username:</label>
                        <input type="text" placeholder="Username" className="input input-bordered w-full max-w-md" name="username" value={username} onChange={e => { setUsername(e.target.value); setErrors(prev => ({ ...prev, noInput: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.username} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <label>Email:</label>
                        <input type="email" placeholder="Email" className="input input-bordered w-full max-w-md" name="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, noInput: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.email} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <label>Profile Image:</label>
                        <input type="file" id="image" className="file-input file-input-bordered w-full max-w-md" name="image" onChange={e => { if (e.target.files && e.target.files.length > 0) { setImage(e.target.files[0]); }; setErrors(prev => ({ ...prev, noInput: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.image} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <label>NID:</label>
                        <input type="text" placeholder="NID" className="input input-bordered w-full max-w-md" name="NID" value={NID} onChange={e => { setNid(e.target.value); setErrors(prev => ({ ...prev, noInput: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.NID} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <label>Phone No.:</label>
                        <input type="tel" placeholder="Phone No." className="input input-bordered w-full max-w-md" name="phone" value={phone} onChange={e => { setPhone(e.target.value); setErrors(prev => ({ ...prev, noInput: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.phone} </p> <br></br>
                    </div>

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

                    <p style={{ color: "red", textAlign: "center" }}> {errors.noInput} </p> <br></br>

                    <Button text={"Update"}></Button> <br></br>
                    <Button text={"Change Password"} type=""></Button> <br></br>
                </form>
            </div>
        </>
    )
}