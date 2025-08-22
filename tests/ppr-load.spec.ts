import { test, expect } from "@playwright/test";

import { ROUTE_ROOT } from "@/1shared/lib/routes";

import { login } from "./lib/login";
import { CREDENTIALS } from "./mock/testCredentials";

test.describe("Открытие Годового плана:", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTE_ROOT);
  });

  test("инженер может открыть Годовой план ЭЧК", async ({ page }) => {
    await login(page, CREDENTIALS.engineer1);
    await page.getByRole("link", { name: "Перейти на страницу планов ТОиР" }).click();
    await page.getByRole("link", { name: "ЭЧК10 2025год" }).click();

    await expect(page.getByRole("heading")).toMatchAriaSnapshot(
      `- heading "ЗАТРАТЫ ТРУДА на запланированные и фактически выполненные работы" [level=2]`
    );

    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});
