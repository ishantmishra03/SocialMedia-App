"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";


export default function Home() {
    const router = useRouter();
    const {isAuthenticated} = useAppSelector((state) => state.auth);

    if(isAuthenticated){
        router.replace("/feed");
    }
}
