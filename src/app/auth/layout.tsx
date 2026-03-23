"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    authClient.getSession().then(session => {
      if (session.data != null) router.push("/");
    });
  }, [router]);

  return <div>{children}</div>;
};

export default AuthLayout;
