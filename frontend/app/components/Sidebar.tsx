"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RxSketchLogo, RxDashboard, RxPerson, RxHome } from 'react-icons/rx';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { useRouter } from "next/navigation";
import axios from 'axios';
import PopUp from './PopUp';

export default function Sidebar({ children, id, index }: any) {
    const [showPopup, setShowPopup] = React.useState(false);

    const router = useRouter();

    const logout = async () => {
        try {
            localStorage.clear();
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, { withCredentials: true });
            router.push(`../login`);
        }
        catch (error) {
            console.warn("Logout failed, forcing client logout. Error:", error);
            router.push("/");
        }
    };


    return (
        <>
            {showPopup && (<PopUp topic="Confirm Logout" text="Are you sure you want to logout?" option1="Yes" option2="Cancel" onConfirm={logout} onClose={() => setShowPopup(false)} />)}
            <div className="flex flex-1 min-h-full">
                <div className='w-20 h-full p-4 bg-black border-r-[1px] flex flex-col justify-between' style={{ borderColor: "red" }}>
                    <div className='flex flex-col items-center'>

                        <Link href='/'>
                            <div className='bg-purple-500 text-white p-3 rounded-lg inline-block hover:bg-purple-800 tooltip' data-tip={"Home"}>
                                <img src="/home.png" alt="Home" style={{ width: "30px", height: "auto" }} />
                            </div>
                        </Link>
                        <span className='border-b-[1px] border-gray-200 w-full p-2' style={{ borderColor: "red" }}></span>

                        <Link href={`/admin/${id}`}>
                            <div className={`${index === 1 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-400 cursor-pointer'} my-4 p-3 rounded-lg inline-block tooltip`} data-tip={"Dashboard"}>
                                <img src="/dashboard.png" alt="Dashboard" style={{ width: "30px", height: "auto" }} />
                            </div>
                        </Link>

                        <Link href={`/admin/${id}/admins`}>
                            <div className={`${index === 2 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-400 cursor-pointer'} my-4 p-3 rounded-lg inline-block tooltip`} data-tip={"Admins"}>
                                <img src="/admin.png" alt="Admins" style={{ width: "30px", height: "auto" }} />
                            </div>
                        </Link>

                        <Link href={`/admin/${id}/developers`}>
                            <div className={`${index === 3 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-400 cursor-pointer'} my-4 p-3 rounded-lg inline-block tooltip`} data-tip={"Developers"}>
                                <img src="/developer.png" alt="Developers" style={{ width: "30px", height: "auto" }} />
                            </div>
                        </Link>

                        <Link href={`/admin/${id}/players`}>
                            <div className={`${index === 4 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-400 cursor-pointer'} my-4 p-3 rounded-lg inline-block tooltip`} data-tip={"Players"}>
                                <img src="/player.png" alt="Players" style={{ width: "30px", height: "auto" }} />
                            </div>
                        </Link>

                        <Link href={`/admin/${id}/games`}>
                            <div className={`${index === 5 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-400 cursor-pointer'} my-4 p-3 rounded-lg inline-block tooltip`} data-tip={"Games"}>
                                <img src="/game.png" alt="Games" style={{ width: "30px", height: "auto" }} />
                            </div>
                        </Link>

                        <Link href={`/admin/${id}/purchases`}>
                            <div className={`${index === 6 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-400 cursor-pointer'} my-4 p-3 rounded-lg inline-block tooltip`} data-tip={"Purchases"}>
                                <img src="/purchase.png" alt="Purchases" style={{ width: "30px", height: "auto" }} />
                            </div>
                        </Link>

                        <Link href={`/admin/${id}/update/${id}`}>
                            <div className={`${index === 7 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-400 cursor-pointer'} my-4 p-3 rounded-lg inline-block tooltip`} data-tip={"Update"}>
                                <img src="/settings.png" alt="Update" style={{ width: "30px", height: "auto" }} />
                            </div>
                        </Link>

                        <button onClick={() => setShowPopup(true)}>
                            <div className='bg-black border-[1px] border-gray-200 hover:bg-red-400 cursor-pointer my-4 p-3 rounded-lg inline-block tooltip' data-tip={"Logout"}>
                                <FiLogOut size={20} />
                            </div>
                        </button>

                    </div>
                </div>
                {/* <main className='ml-20 w-full'>{children}</main> */}
                <main className="flex-1 flex flex-col min-h-full">
                    {children}
                </main>

                {/* <main className='w-full'>{children}</main> */}
            </div>
        </>
    );
};