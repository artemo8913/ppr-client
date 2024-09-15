import React from "react";

import { LoginForm } from "@/3features/loginUser";
import ClueTable from "./ClueTable";

interface ILoginPageProps {
  className?: string;
}

export default function LoginPage(props: ILoginPageProps) {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <LoginForm />
      <ClueTable />
    </div>
  );
}
