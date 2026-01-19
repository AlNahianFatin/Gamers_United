import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RxSketchLogo, RxDashboard, RxPerson, RxHome } from 'react-icons/rx';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { FiLogOut, FiSettings } from 'react-icons/fi';

export default function Sidebar({ children, id, index }: any) {
    return (
        <div className="flex flex-1 min-h-full">
            <div className='w-20 h-full p-4 bg-black border-r-[1px] flex flex-col justify-between' style={{ borderColor: "red" }}>
                <div className='flex flex-col items-center'>

                    <Link href='/'>
                        <div className='bg-purple-500 text-white p-3 rounded-lg inline-block hover:bg-purple-800'>
                            <RxHome size={20} />
                        </div>
                    </Link>
                    <span className='border-b-[1px] border-gray-200 w-full p-2' style={{ borderColor: "red" }}></span>

                    <Link href={`/admin/${id}`}>
                        <div className={`${index === 1 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-500 cursor-pointer'} my-4 p-3 rounded-lg inline-block`}>
                            <img src="/dashboard.png" alt="Dashboard" style={{ width: "30px", height: "auto" }} />
                        </div>
                    </Link>

                    <Link href={`/admin/${id}/developers`}>
                        <div className={`${index === 2 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-500 cursor-pointer'} my-4 p-3 rounded-lg inline-block`}>
                            <img src="/developer.png" alt="Developers" style={{ width: "30px", height: "auto" }} />
                        </div>
                    </Link>

                    <Link href={`/admin/${id}/players`}>
                        <div className={`${index === 3 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-500 cursor-pointer'} my-4 p-3 rounded-lg inline-block`}>
                            <img src="/player.png" alt="Players" style={{ width: "30px", height: "auto" }} />
                        </div>
                    </Link>

                    <Link href={`/admin/${id}/games`}>
                        <div className={`${index === 4 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-500 cursor-pointer'} my-4 p-3 rounded-lg inline-block`}>
                            <img src="/game.png" alt="Games" style={{ width: "30px", height: "auto" }} />
                        </div>
                    </Link>

                    <Link href={`/admin/${id}/purchases`}>
                        <div className={`${index === 5 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-500 cursor-pointer'} my-4 p-3 rounded-lg inline-block`}>
                            <img src="/purchase.svg" alt="Purchases" style={{ width: "30px", height: "auto" }} />
                        </div>
                    </Link>

                    <Link href={`/admin/${id}/update`}>
                        <div className={`${index === 6 ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-500 cursor-pointer'} my-4 p-3 rounded-lg inline-block`}>
                            <img src="/settings.png" alt="Update" style={{ width: "30px", height: "auto" }} />
                        </div>
                    </Link>

                    <Link href='/'>
                        <div className='bg-black border-[1px] border-gray-200 hover:bg-red-500 cursor-pointer my-4 p-3 rounded-lg inline-block'>
                            <FiLogOut size={20} />
                        </div>
                    </Link>

                </div>
            </div>
            {/* <main className='ml-20 w-full'>{children}</main> */}
            <main className="flex-1 flex flex-col min-h-full">
                {children}
            </main>

            {/* <main className='w-full'>{children}</main> */}
        </div>
    );
};