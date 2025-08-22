import { Page } from "@playwright/test";

import { ROUTE_ROOT } from "@/1shared/lib/routes";

export async function login(page: Page, credentials: { username: string; password: string }) {
  await page.getByRole("textbox", { name: "Логин" }).fill(credentials.username);
  await page.getByRole("textbox", { name: "Пароль" }).fill(credentials.password);
  await page.getByRole("button", { name: "Войти" }).click();

  await page.waitForURL(ROUTE_ROOT);
}
