"use client";

export default function PasswordField({ children, name }: any) {
    return (
        <>
            <input type="password" className="input validator" required placeholder="Password" minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be at least 8 characters, including number, lowercase letter, uppercase letter" />
            <p className="validator-hint">
                Must be at least 8 characters, including
                <br />At least one number
                <br />At least one lowercase letter
                <br />At least one uppercase letter
            </p>
        </>
    );
}