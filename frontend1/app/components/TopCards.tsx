"use client"

import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";

export default function TopCards({ children, name }: any) {
    const [totalSales, setTotalSales] = useState(0);
    const [activePlayers, setActivePlayers] = useState(0);
    const [totalGames, setTotalGames] = useState(0);

    const [loading, setLoading] = useState(true);

    const [globalError, setGlobalError] = useState("");

    const showError = (msg: string) => {
        setGlobalError(msg);
        setTimeout(() => {
            setGlobalError("");
        }, 2000);
    };

    useEffect(() => {
        const fetchTotalSales = async () => {
            try {
                const sales = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getLastWeekTotalPurchases`, { withCredentials: true });
                setTotalSales(Number(sales.data));
            }
            catch (error: any) {
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data?.message || "Login failed";

                    showError(`${status}: ${message}`);
                }
                else
                    showError("Server not reachable. Check your internet connection.");
            }
        };
        fetchTotalSales();

        const fetchActivePlayers = async () => {
            try {
                const players = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getNoOfActivePlayers`, { withCredentials: true });
                setActivePlayers(Number(players.data));
            }
            catch (error: any) {
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data?.message || "Login failed";

                    showError(`${status}: ${message}`);
                }
                else
                    showError("Server not reachable. Check your internet connection.");
            }
        };
        fetchActivePlayers();

        const fetchTotalGames = async () => {
            try {
                const games = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getTotalNoOfGames`, { withCredentials: true });
                setTotalGames(Number(games.data));
            }
            catch (error: any) {
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data?.message || "Login failed";

                    showError(`${status}: ${message}`);
                }
                else
                    showError("Server not reachable. Check your internet connection.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchTotalGames();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className='grid lg:grid-cols-5 gap-4 p-4'>

            <div className='lg:col-span-2 col-span-1 bg-gray-900 flex justify-between w-full border p-4 rounded-lg'>
                <div className='flex flex-col w-full pb-4'>
                    <p className='text-2xl font-bold pb-5'>${totalSales}</p>
                    <p className='text-yellow-600'>Total Sales This Week</p>
                </div>
                {/* <p className='bg-green-200 flex justify-center items-center p-2 rounded-lg'>
                    <span className='text-green-700 text-lg'>+18%</span>
                </p> */}
            </div>

            <div className='lg:col-span-2 col-span-1 bg-gray-900 flex justify-between w-full border p-4 rounded-lg'>
                <div className='flex flex-col w-full pb-4'>
                    <p className='text-2xl font-bold pb-5'>{activePlayers}</p>
                    <p className='text-yellow-600'>Active Players</p>
                </div>
                {/* <p className='bg-green-200 flex justify-center items-center p-2 rounded-lg'>
                    <span className='text-green-700 text-lg'>+11%</span>
                </p> */}
            </div>

            <div className='bg-gray-900 flex justify-between w-full border p-4 rounded-lg'>
                <div className='flex flex-col w-full pb-4'>
                    <p className='text-2xl font-bold pb-5'>{totalGames}</p>
                    <p className='text-yellow-600'>Games</p>
                </div>
                {/* <p className='bg-green-200 flex justify-center items-center p-2 rounded-lg'>
                    <span className='text-green-700 text-lg'>+17%</span>
                </p> */}
            </div>

        </div>
    )
}