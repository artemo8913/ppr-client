"use client";
import Input from "antd/es/input";
import Button from "antd/es/button";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { serverRedirect } from "@/1shared/lib/serverRedirect";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      username: formData?.get("username"),
      password: formData?.get("password"),
      redirect: false,
    });
    if (!res?.error) {
      serverRedirect('/');
    } else {
      setErrorMessage("Не верный логин / пароль");
    }
    setIsLoading(false);
  };
  return (
    <form className="w-[300px] m-auto flex flex-col gap-4 justify-center" onSubmit={handleSubmit}>
      <Input type="text" name="username" placeholder="Логин" required />
      <Input type="password" name="password" placeholder="Пароль" required />
      <Button loading={isLoading} aria-disabled={isLoading} htmlType="submit">
        Войти
      </Button>
      {Boolean(errorMessage) && <div>{errorMessage}</div>}
    </form>
  );
}
