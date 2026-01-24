"use client";

import Button from "@/app/components/Button";
import axios from "axios";
import { useEffect, useState } from "react";

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

type Player = {
    id: number;
    username: string;
    image: string | null;
    NID: string;
    phone: string;
    created_at: string;
    game_ids: string[];
    login: Login;
};

export default function getPlayers() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameTitles, setGameTitles] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(true);

    const [globalError, setGlobalError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const showError = (msg: string) => {
        setGlobalError(msg);
        setTimeout(() => {
            setGlobalError("");
        }, 2000);
    };

    async function fetchData() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getPlayers`, { withCredentials: true });
            setPlayers(response.data);

            const allGameIds = response.data.flatMap((p: any) => p.game_ids.map((id: string) => Number(id.trim())));
            const uniqueGameIds = Array.from(new Set(allGameIds));

            const titles: { [key: number]: string } = {};
            await Promise.all(uniqueGameIds.map(async (id: any) => {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getFullGameByID/${id}`, { withCredentials: true });
                titles[id] = res.data.title;
            }));
            setGameTitles(titles);
        }
        catch (error) {
            showError("Server not reachable. Check your internet connection.");
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                </div>
            </>
        )
    }

    async function GameTitles(id: number) {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getFullGameByID/${id}`, { withCredentials: true });
            return response.data.title;
        }
        catch (error) {
            showError("Server not reachable. Check your internet connection.");
            console.error(error);
        }
    }

    return (
        <div className="w-full min-w-0 flex flex-col gap-6">
            {players.map((item) => (
                <div
                    key={item.id}
                    className="relative w-full min-w-0 bg-base-100 shadow-md rounded-lg p-4 flex flex-col md:flex-row gap-4"
                >
                    <div className="flex flex-col gap-3 shrink-0">
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/admin/getPlayerPicByID/${item.id}`} alt={item.username} className="w-48 object-contain rounded" />
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

                        <p className="text-sm"> Total Owned Games: {item.game_ids?.length ? item.game_ids.length : 0} </p>

                        {item.game_ids?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {item.game_ids.map((g) => {
                                    const id = Number(g.trim());
                                    return (
                                        <span key={id} className="badge badge-outline">
                                            {gameTitles[id] || "Loading..."}
                                        </span>
                                    )
                                })}
                            </div>
                        )}

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