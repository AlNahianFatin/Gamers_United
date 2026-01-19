import React from 'react'

export default function Header({ children, name, imageUrl }: any) {
    return (
        <>
            <div className='flex justify-end px-4 pt-4'>
                {/* <h2>Dashboard</h2> */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <img src={imageUrl} alt="Admin Profile" width={"10%"} height={"10%"} style={{ minWidth: "100px", minHeight: "100px", margin: "10px 1em" }} />
                </div>
            </div>
            <h2 className='flex justify-end px-4 pt-4'>Welcome Back, {name}</h2>
        </>
    )
}