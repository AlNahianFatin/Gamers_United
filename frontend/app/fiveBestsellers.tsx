"use client";

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

export default function FiveBestsellers() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getFiveBestsellerGames`);
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
                {/* <p className="text-center mt-10">Loading...</p>; */}
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                </div>
            </>
        )
    }

    return (
        <div className="flex flex-wrap gap-15 justify-center p-6">
            {games.map((item, index) => (
                <div key={item.id} className="card bg-base-100 w-60 shadow-md">
                    <div className="relative h-56 w-full overflow-hidden">
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/getGamePicByID/${item.id}`} alt={item.title} className="h-full w-full object-contain" />
                    </div>

                    <div className="card-body">
                        <h2 className="card-title"> {item.title}
                            <div className="badge badge-secondary ml-2"> #{index + 1} </div>
                        </h2>

                        <p>{item.description}</p>

                        <div className="flex items-center gap-2 text-sm">
                            <img src="/coloreddeveloper.png" alt="Developer" style={{ width: "30px", height: "auto" }} />
                            <span> <strong> {item.developer.username} </strong> </span>
                        </div>

                        <p className="text-sm"> ${item.price} </p>

                        {/* <p className="text-sm"> <strong>Purchases:</strong> {item.purchase_count} </p> */}

                        <div className="card-actions justify-end flex-wrap"> {item.categories.map((cat) => (
                            <div key={cat.id} className="badge badge-outline"> {cat.name} </div>
                        ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
