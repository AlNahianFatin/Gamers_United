"use client";

import Button from "@/app/components/Button";
import axios from "axios";
import { useEffect, useState } from "react";

// type Category = {
//     id: number;
//     name: string;
//     description: string;
// };

type Login = {
    id: number;
    username: string;
    password: string;
    email: string;
    role: string;
    activation: boolean;
    ban: boolean;
};

type Game = {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
    trailer: string;
    game: string;
    published_at: string;
    view_count: number;
    play_count: number;
    purchase_count: number;
};

type Developer = {
    id: number;
    username: string;
    image: string | null;
    NID: string;
    phone: string;
    created_at: string;
    login: Login;
    games: Game[];
};

export default function getDevelopers() {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getDevelopers`, { withCredentials: true });
            setDevelopers(response.data);
        }
        catch (error) {
            <p className="text-center mt-10">Server Connection Lost!</p>;
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <>
                {/* <p className="text-center mt-10">Loading...</p>; */}
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                </div>
            </>
        )
    }

    return (
        <div className="w-full min-w-0 flex flex-col gap-6">
            {developers.map((item) => (
                <div
                    key={item.id}
                    className="relative w-full min-w-0 bg-base-100 shadow-md rounded-lg p-4 flex flex-col md:flex-row gap-4"
                >
                    <div className="flex flex-col gap-3 shrink-0">
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/admin/getDeveloperPicByID/${item.id}`} alt={item.username} className="w-48 object-contain rounded" />
                    </div>

                    <div className="flex flex-col gap-2 flex-1">

                        <h2 className="text-lg font-semibold">{item.username}</h2>

                        <p className="font-medium">ID: #{item.id}</p>

                        <p className="text-sm">NID: {item.NID}</p>

                        <p className="text-sm">Contact No.: {item.phone}</p>

                        <p className="text-sm"> Account Opened: {new Date(item.created_at).toLocaleString()} </p>

                        <p className="text-sm">Email: {item.login.email}</p>

                        <p className="text-sm"> Status: {item.login.activation ? "Active ✅" : "Inactive❌"} </p>

                        <p className="text-sm"> Ban: {item.login.ban ? "Banned🔒" : "Not Banned🔓"} </p>

                        <p className="text-sm"> Total Games: {item.games?.length} </p>

                        Games:
                        <div className="flex flex-wrap gap-2 mt-2">
                            {item.games?.map((g) => (
                                <span key={g.id} className="badge badge-outline"> {g.title} </span>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4">
                        <div className="flex flex-row gap-[5em]">
                            <Button text="Update" />
                            <Button text="Delete" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}