"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "tailwindcss";
import Greeting from "../../components/Greeting";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import TopCards from "../../components/TopCards";
import BarChart from "../../components/BarChart";
import RecentPurchases from "../../components/RecentPurchases";
import ErrorAlert from "../../components/ErrorAlert";

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

export default function Game() {
    const params = useParams();
    const [game, setGame] = useState<Game>();
    const [loading, setLoading] = useState(true);

    const [clientReady, setClientReady] = useState(false);

    const [globalError, setGlobalError] = useState("");

    const router = useRouter();

    const showError = (msg: string) => {
        setGlobalError(msg);
        setTimeout(() => {
            setGlobalError("");
        }, 2000);
    };

    useEffect(() => {
        if (!params.id) {
            router.push(`/`);
            return;
        }
        fetchGame();
    }, [params.id, router]);


    const fetchGame = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getFullGameByID/${params.id}`, { withCredentials: true });
            setGame(response.data);
        }
        catch (error) {
            setGlobalError("Server Connection Lost!");
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


    const imageUrl = (`${process.env.NEXT_PUBLIC_API_URL}/getGamePicByID/${params.id}`);
    return (
        <>
        <div className="bg-red-500">

                <div className="flex justify-end">
                    <ul className="flex">
                        <li className="mr-3">
                            <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/">Home</Link>
                        </li>

                        <li className="mr-3">
                            <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href={"/login"}>Login</Link>
                        </li>

                        <li className="mr-3">
                            <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/signup">Signup</Link>
                        </li>

                        <li className="mr-3">
                            <Link className="inline-block border border-white rounded hover:border-gray-200 text-black hover:bg-gray-200 py-1 px-3" href="/aboutus">About Us</Link>
                        </li>
                    </ul>
                </div>

            </div>
            
            <div className="w-full min-w-0 flex flex-col gap-6">
                <div key={game?.id} className="relative w-full min-w-0 bg-base-100 shadow-md rounded-lg p-4 flex flex-col md:flex-row gap-4">

                    <div className="flex flex-col gap-3 shrink-0">
                        <img src={imageUrl} alt={game?.title} className="w-48 object-contain rounded" />
                    </div>

                    <div className="flex flex-col gap-2 flex-1">

                        <h2 className="text-lg font-semibold">{game?.title}</h2>

                        <p className="font-medium">ID: #{game?.id}</p>

                        <p className="text-gray-600">{game?.description}</p>

                        <div className="flex items-center gap-2 text-sm">
                            <img src="/coloreddeveloper.png" alt="Developer" className="w-6 h-auto" />
                            <strong>Developer: {game?.developer.username}</strong>
                        </div>

                        {game?.published_at && (
                            <p className="text-sm">
                                Publish Date: {new Date(game.published_at).toLocaleString()}
                            </p>
                        )}


                        <p className="text-sm">${game?.price}</p>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {game?.categories.map((cat) => (
                                <span key={cat.id} className="badge badge-outline"> {cat.name} </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 shrink-0">
                        <video src={`${process.env.NEXT_PUBLIC_API_URL}/getGameTrailerByID/${game?.id}`} controls className="w-68 h-46 object-contain rounded" />
                    </div>
                </div>
            </div>
        </>
    );
}