"use client";
import Greeting from "@/app/components/Greeting";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const params = useParams();
  const [clientReady, setClientReady] = useState(false);
  const [userData, setUserData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!params.id) return;
    setClientReady(true);

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getAdminByID/${params.id}`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
        setUserData(response.data);

      }
      catch (error) {
        console.log(error);
      }
    };
    
    fetchUser();
  }, [params.id]);
  
  if (!clientReady)
    return null;
  
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/getAdminPicByID/${params.id}`;
  return (
    <>
      <div className="bg-red-500">
        <Link href="/" style={{ textAlign: "right" }}>Home</Link> | <Link href="/" style={{ textAlign: "right" }}>Logout</Link>
      </div>
      {userData ? (<Greeting name={userData.username || "Unknown"} />) : (<p>Loading...</p>)}
      <img src={imageUrl} alt="Admin Profile" width={150} height={150} style={{ borderRadius: "50%", marginTop: "10px" }} />
    </>
  );
}