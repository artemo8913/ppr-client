import { LoginForm } from "@/3features/login";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function LoginPage() {
  return (
    <AntdRegistry>
      <div className="h-screen flex justify-center">
        <LoginForm />
      </div>
    </AntdRegistry>
  );
}
