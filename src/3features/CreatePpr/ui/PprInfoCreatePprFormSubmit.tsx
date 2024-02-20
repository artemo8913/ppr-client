"use client";

import { Button } from "antd";
import { useFormStatus } from "react-dom";

export function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} id="add" name="add" type="primary" htmlType="submit">
      Добавить
    </Button>
  );
}
