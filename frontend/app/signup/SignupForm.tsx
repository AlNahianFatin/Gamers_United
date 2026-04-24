"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "../components/Button";
import Alert from "../components/Alert";

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

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        setClientReady(true);

        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    if (!clientReady)
        return null;

    const showError = (msg: string) => {
        setGlobalError(msg);
        setTimeout(() => {
            setGlobalError("");
        }, 2000);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, image: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (username.trim() === "")
            newErrors.username = "Please enter username first!";

        if (email.trim() === "")
            newErrors.email = "Please enter email first!";

        if (!image || image === null)
            newErrors.image = "Please select a profile image first!";

        if (NID.trim() === "")
            newErrors.NID = "Please enter NID No. first!";

        if (phone.trim() === "")
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
            userData.append('username', username.trim());
            userData.append('email', email.trim());
            if (image && image !== null)
                userData.append("image", image);
            userData.append('NID', NID.trim());
            userData.append('phone', phone.trim());
            userData.append('password', password);

            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/signup', userData);

            if (response.status === 201)
                router.push(`./login`);
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
            {globalError && <Alert text={globalError} type="error" />}
            <div className="min-h-screen flex items-center justify-center p-4">
                <form onSubmit={handleSubmit} className="bg-base-200 border-base-900 rounded-box min-w-[30em] max-w-xs border p-6 my-[1em]">
                    <legend className="text-2xl font-bold text-center">Signup</legend>

                    <div className="form-control w-full max-w-md">
                        <span className="label-text">Username:</span>
                        <input type="text" placeholder="Username" className="input input-bordered w-full max-w-md" name="username" value={username} onChange={e => { setUsername(e.target.value); setErrors(prev => ({ ...prev, username: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.username} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <span className="label-text">Email:</span>
                        <input type="email" placeholder="Email" className="input input-bordered w-full max-w-md" name="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.email} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <span className="label-text">Profile Image:</span>
                        <div className="flex justify-center">
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="w-100% h-32 object-cover rounded" />
                            )}
                        </div>
                        <input type="file" className="file-input file-input-bordered w-full max-w-md" id="file" name="image" onChange={(e) => { handleImageChange(e); if (e.target.files && e.target.files.length > 0) { setImage(e.target.files[0]); setErrors(prev => ({ ...prev, image: "" })); } }} />
                        <p className="label-text-alt font-extralight" style={{ textAlign: "right" }}>Max size 10MB</p>
                        <p style={{ color: "red", textAlign: "center" }}> {errors.image} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <span className="label-text">NID:</span>
                        <input type="text" placeholder="NID" className="input input-bordered w-full max-w-md" name="NID" value={NID} onChange={e => { setNid(e.target.value); setErrors(prev => ({ ...prev, NID: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.NID} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <span className="label-text">Phone No.:</span>
                        <input type="tel" placeholder="Phone No." className="input input-bordered w-full max-w-md" name="phone" value={phone} onChange={e => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.phone} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <span className="label-text">Password:</span>
                        <input type="password" placeholder="Password" className="input input-bordered w-full max-w-md" name="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.password} </p> <br></br>
                    </div>

                    <div className="form-control w-full max-w-md">
                        <span className="label-text">Retype Password:</span>
                        <input type="password" placeholder="Retype Password" className="input input-bordered w-full max-w-md" name="rpassword" value={rpassword} onChange={e => { setRPassword(e.target.value); setErrors(prev => ({ ...prev, rpassword: "" })); }} />
                        <p style={{ color: "red", textAlign: "center" }}> {errors.rpassword} </p> <br></br>
                    </div>

                    <Button text={"Signup"}></Button> <br></br>
                </form>
            </div>
        </>
    )
}