"use client";

import { useAppSelector } from "@/store/hooks/index";
import Image from "next/image";

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div>
      <p>{user?.username}</p>
      <Image
        src={user?.avatar || "/banner.jpg"}
        alt={user?.username || "User"}
        width={40}
        height={40}
        className="rounded-full"
      />
    </div>
  );
}
