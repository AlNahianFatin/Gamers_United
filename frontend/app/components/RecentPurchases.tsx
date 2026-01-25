"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingBag } from "react-icons/fa";

type Player = {
  id: number;
  username: string;
  image: string | null;
};

type Purchase = {
  id: number;
  player: Player;
  purchase_date: string;
  amount: string;
};

export default function RecentPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentPurchases() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getRecentTopPurchases`, { withCredentials: true });
        setPurchases(res.data);
      }
      catch (error) {
        console.error("Failed to fetch recent purchases", error);
      }
      finally {
        setLoading(false);
      }
    }

    fetchRecentPurchases();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
      <h1 className="text-lg font-semibold mb-4">Recent Top Sales</h1>

      <ul> {purchases.map((order) => (
        <li key={order.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer relative" >
          <div className="bg-purple-100 rounded-lg p-3">
            <FaShoppingBag className="text-purple-800" />
          </div>

          <div className="pl-4">
            <p className="text-gray-800 font-bold">${order.amount}</p>
            <p className="text-gray-400 text-sm">{order.player.username}</p>
          </div>

          <p className="lg:flex md:hidden absolute right-6 text-sm text-gray-500"> {new Date(order.purchase_date).toLocaleDateString()} </p>
        </li>
      ))}
      </ul>
    </div>
  );
}
