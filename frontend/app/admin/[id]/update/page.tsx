"use client";

import Greeting from "@/app/components/Greeting";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import TopCards from "@/app/components/TopCards";
import BarChart from "@/app/components/BarChart";
import RecentPurchases from "@/app/components/RecentPurchases";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "tailwindcss";

export default function AdminPage() {
  const params = useParams();
  const [clientReady, setClientReady] = useState(false);
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const logout = async () => {
    try {
      localStorage.clear();
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, { withCredentials: true });
      router.push(`./login`);
    }
    catch (error) {
      console.warn("Logout failed, forcing client logout. Error:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!params.id) {
      router.replace(`/admin/${params.id}/not-found`);
      return;
    }

    const fetchUser = async () => {
      try {
        const storedToken = localStorage.getItem("id");
        if (!storedToken)
          router.replace(`/admin/${params.id}/not-found`);

        const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, { withCredentials: true });

        if (Number(params.id) !== profileRes.data.id) {
          router.replace(`/admin/${params.id}/not-found`);
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getAdminByID/${profileRes.data.id}`, { withCredentials: true });
        setUserData(response.data);
        console.log(userData);
        setClientReady(true);

      }
      catch (error: any) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || "Login failed";

          if (status === 400 || status === 403 || status === 404 || status === 401)
            router.replace(`/admin/${params.id}/not-found`);
          else
            router.replace(`/admin/${params.id}/not-found`);
        }
        else {
          alert("Server not reachable. Check your internet connection.");
          router.push('/login');
        }
      }
    };

    fetchUser();
  }, [params.id]);

  if (!clientReady)
    return null;

  const imageUrl = (`${process.env.NEXT_PUBLIC_API_URL}/admin/getAdminPicByID/${params.id}`);
  return (
    <>
      {/* <div className="bg-red-500"> */}
      {/* <Link href="/" style={{ textAlign: "right" }}>Home</Link> | <Link href="/" style={{ textAlign: "right" }} onClick={logout}>Logout</Link> */}
      {/* </div> */}

      {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <img src={imageUrl} alt="Admin Profile" width={"10%"} height={"10%"} style={{ minWidth: "100px", minHeight: "100px", margin: "10px 1em" }} />
      </div>
      <Header name={userData?.username || "Unknown"} /> */}
      <Sidebar id={userData?.id} index={6}></Sidebar>
      {/* <TopCards></TopCards>
      <div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4">
        <BarChart></BarChart>
        <RecentPurchases></RecentPurchases>
      </div> */}
    </>
  );
}