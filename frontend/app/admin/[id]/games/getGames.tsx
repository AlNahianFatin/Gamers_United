"use client";

import Button from "@/app/components/Button";
import axios from "axios";
import { useEffect, useState } from "react";

type Category = {
    id: number;
    name: string;
    description: string;
};

type Developer = {
    id: number;
    username: string;
    image: string | null;
    NID: string;
    phone: string;
    created_at: string;
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
    categories: Category[];
    developer: Developer;
};

export default function getGames() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getGames`, { withCredentials: true });
            setGames(response.data);
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
            {games.map((item) => (
                <div key={item.id} className="relative w-full min-w-0 bg-base-100 shadow-md rounded-lg p-4 flex flex-col md:flex-row gap-4">

                    <div className="flex flex-col gap-3 shrink-0">
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/getGamePicByID/${item.id}`} alt={item.title} className="w-48 object-contain rounded" />
                    </div>

                    <div className="flex flex-col gap-2 flex-1">

                        <h2 className="text-lg font-semibold">{item.title}</h2>

                        <p className="font-medium">ID: #{item.id}</p>

                        <p className="text-gray-600">{item.description}</p>

                        <div className="flex items-center gap-2 text-sm">
                            <img src="/coloreddeveloper.png" alt="Developer" className="w-6 h-auto" />
                            <strong>Developer: {item.developer.username}</strong>
                        </div>

                        <p className="text-sm">Publish Date: {new Date(item.published_at).toLocaleString()}</p>

                        <p className="text-sm">Copies Sold: {item.purchase_count}</p>

                        <p className="text-sm">${item.price}</p>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {item.categories.map((cat) => (
                                <span key={cat.id} className="badge badge-outline"> {cat.name} </span>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4">
                        <div className="flex flex-row gap-[5em]">
                            <Button text={"Update"} />
                            <Button text={"Delete"} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0">
                        <video src={`${process.env.NEXT_PUBLIC_API_URL}/getGameTrailerByID/${item.id}`} controls className="w-68 h-46 object-contain rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}