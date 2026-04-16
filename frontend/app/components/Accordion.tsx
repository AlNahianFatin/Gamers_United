"use client"

// import React from 'react'

export default function Accordion({ children, name }: any) {
    return (
        <>
            <details className="collapse collapse-arrow bg-gray-900 border border-transparent open:border-white transition-all" name="my-accordion-det-1">
                <summary className="collapse-title font-semibold">How do I create an account?</summary>
                <div className="collapse-content text-sm">Click the "Signup" button in the top right corner and follow the registration process.</div>
            </details>
            <details className="collapse collapse-arrow bg-gray-900 border border-transparent open:border-white transition-all" name="my-accordion-det-1">
                <summary className="collapse-title font-semibold">I forgot my password. What should I do?</summary>
                <div className="collapse-content text-sm">Click on "Forgot Password?" on the login page and enter the OTP sent to your email.</div>
            </details>
            <details className="collapse collapse-arrow bg-gray-900 border border-transparent open:border-white transition-all" name="my-accordion-det-1">
                <summary className="collapse-title font-semibold">How do I update my profile information?</summary>
                <div className="collapse-content text-sm">Go to "My Account" settings and select "Edit Profile" to make changes.</div>
            </details>
        </>
    )
}