"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PopUp from "../../../components/PopUp";

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
    amount: number;
};

export default function PurchasesPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [globalError, setGlobalError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const showError = (msg: string) => {
        setGlobalError(msg);
        setTimeout(() => setGlobalError(""), 2000);
    };

    async function fetchData() {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/getPurchases`,
                { withCredentials: true }
            );
            setPurchases(response.data);
        } catch (error) {
            showError("Server not reachable. Check your internet connection.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/removePurchase/${id}`,
                { withCredentials: true }
            );

            setPurchases(prev => prev.filter(p => p.id !== id));
            setShowPopup(false);
            setSelectedId(null);
        } catch (error) {
            showError("Server not reachable. Check your internet connection.");
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 flex flex-col gap-6">
            {purchases.map((item) => (
                <React.Fragment key={item.id}>
                    {showPopup && selectedId === item.id && (
                        <PopUp
                            topic="Confirm Delete"
                            text="Are you sure you want to delete this record?"
                            option1="Yes"
                            option2="Cancel"
                            onConfirm={() => handleDelete(item.id)}
                            onClose={() => {
                                setShowPopup(false);
                                setSelectedId(null);
                            }}
                        />
                    )}

                    <div className="relative w-full min-w-0 bg-base-100 shadow-md rounded-lg p-4 flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-3 shrink-0">
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/admin/getGamePicByID/${item.game.id}`}
                                alt={item.player.username}
                                className="w-48 object-contain rounded"
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <h2 className="text-lg font-semibold">
                                Purchase ID: #{item.id}
                            </h2>

                            <div className="flex items-center gap-2 text-sm md:text-base">
                                <img src="/coloredplayer.png" className="w-10 h-auto" />
                                <strong className="text-lg md:text-xl font-semibold">
                                    {item.player.username}
                                </strong>
                            </div>

                            <div className="flex items-center gap-2 text-sm md:text-base mt-1">
                                <img src="/coloredgame.png" className="w-10 h-auto" />
                                <strong className="text-lg md:text-xl font-semibold">
                                    {item.game.title}
                                </strong>
                            </div>

                            <p className="text-sm">
                                Purchased On:{" "}
                                {new Date(item.purchase_date).toLocaleString()}
                            </p>

                            <p className="text-sm">${item.amount}</p>
                        </div>

                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => {
                                    setSelectedId(item.id);
                                    setShowPopup(true);
                                }}
                                className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded w-min"
                            >
                                Delete
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 shrink-0">
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/admin/getPlayerPicByID/${item.player.id}`}
                                alt={item.player.username}
                                className="w-26 object-contain rounded"
                            />
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}
