"use client";
import Greeting from "@/app/components/Greeting";
import axios from "axios";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const params = useParams();
  const [clientReady, setClientReady] = useState(false);
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      setToken(null);
      router.push(`./login`);
    }
  }

  useEffect(() => {
    if (!params.id)
      return;

    // if (typeof window !== "undefined") {
    //   setToken(storedToken);
    // }

    const fetchUser = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken");
        if (!storedToken)
          router.replace(`/admin/${params.id}/not-found`);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getAdminByID/${params.id}`, { headers: { Authorization: `Bearer ${storedToken}` }, withCredentials: true });
        setUserData(response.data);
        setClientReady(true);

        if (!response.data)
          router.replace(`/admin/${params.id}/not-found`);
      }
      catch (error: any) {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || "Login failed";

          if (status === 400 || status === 403 || status === 404 || status === 401)
            router.replace(`/admin/${params.id}/not-found`);
          // else if (status === 401)
          //   alert(message);
          else
            router.replace(`/admin/${params.id}/not-found`);
        }
        else
          alert("Server not reachable. Check your internet connection.");
      }
    };

    fetchUser();
  }, [params.id]);

  if (!clientReady)
    return null;

  const imageUrl = (`${process.env.NEXT_PUBLIC_API_URL}/admin/getAdminPicByID/${params.id}`);
  return (
    <>
      <div className="bg-red-500">
        <Link href="/" style={{ textAlign: "right" }}>Home</Link> | <Link href="/" style={{ textAlign: "right" }} onClick={logout}>Logout</Link>
      </div>
      <Greeting name={userData?.username || "Unknown"} />
      <img src={imageUrl} alt="Admin Profile" width={150} height={150} style={{ borderRadius: "50%", marginTop: "10px" }} />
    </>
  );
}