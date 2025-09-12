"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, setLoading } from "@/store/slices/auth.slice";
import axios from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

const publicPaths = ["/auth/login", "/auth/register"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await axios.get("/api/auth");
        if (data.success) {
          dispatch(setUser(data.user));
        } else if (!publicPaths.includes(pathname)) {
          router.replace("/auth/login");
        }
      } catch (err) {
        if (!publicPaths.includes(pathname)) {
          router.replace("/auth/login");
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch, pathname, router]);

  if (loading) {
    return <Loader />;
  }

  return children;
}
