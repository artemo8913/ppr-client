"use client";
import { LoginForm } from "@/3features/loginUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: userData } = useSession();
  const router = useRouter();

  useEffect(()=>{
    if(userData?.user.id){
      router.refresh();
      router.push('/');
    }
  });
  return (
    <div className="h-screen flex justify-center">
      <LoginForm />
    </div>
  );
}
