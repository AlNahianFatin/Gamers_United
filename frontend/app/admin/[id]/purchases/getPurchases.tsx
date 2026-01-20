"use client";

import Button from "@/app/components/Button";
import axios from "axios";
import { useEffect, useState } from "react";

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
    game_ids: Game[];
};

type Purchase = {
    id: number;
    player: Player;
    game: Game;
    purchase_date: string;
    amount: number | 0;
};

export default function getPlayers() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getPurchases`, { withCredentials: true });
            setPurchases(response.data);
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
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                </div>
            </>
        )
    }

    return (
        <div className="w-full min-w-0 flex flex-col gap-6">
            {purchases.map((item) => (
                <div key={item.id} className="relative w-full min-w-0 bg-base-100 shadow-md rounded-lg p-4 flex flex-col md:flex-row gap-4" >

                    <div className="flex flex-col gap-3 shrink-0">
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/admin/getGamePicByID/${item.game.id}`} alt={item.player.username} className="w-48 object-contain rounded" />
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        <h2 className="text-lg font-semibold">Purchase ID: #{item.id}</h2>

                        <div className="flex items-center gap-2 text-sm md:text-base">
                            <img src="/coloredplayer.png" alt="Player" className="w-10 h-auto" />
                            <strong className="text-lg md:text-xl font-semibold"> {item.player.username}</strong>
                        </div>

                        <div className="flex items-center gap-2 text-sm md:text-base mt-1">
                            <img src="/coloredgame.png" alt="Game" className="w-10 h-auto" />
                            <strong className="text-lg md:text-xl font-semibold"> {item.game.title}</strong>
                        </div>

                        <p className="text-sm"> Purchased On: {new Date(item.purchase_date).toLocaleString()} </p>

                        <p className="text-sm">${item.amount}</p>
                    </div>

                    <div className="absolute bottom-4 right-4">
                        <div className="flex flex-row gap-[5em]">
                            {/* <Button text="Update" /> */}
                            <Button text="Delete" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0">
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/admin/getPlayerPicByID/${item.player.id}`} alt={item.player.username} className="w-26 object-contain rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}