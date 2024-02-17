"use client";
import { Button, Input } from "antd";
import { authenticate } from "../lib/actions";
import { useFormState, useFormStatus } from "react-dom";

export function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <form action={dispatch}>
      <Input type="email" name="email" placeholder="Почта" required />
      <Input type="password" name="password" placeholder="Пароль" required />
      <div>{errorMessage && <p>{errorMessage}</p>}</div>
      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} aria-disabled={pending} htmlType="submit">
      Войти
    </Button>
  );
}
