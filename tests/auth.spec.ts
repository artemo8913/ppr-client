import { test, expect } from "@playwright/test";

import { ROUTE_ROOT } from "@/1shared/lib/routes";

import { login } from "./lib/login";
import { CREDENTIALS } from "./mock/testCredentials";

test.describe("Аутентификация: ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTE_ROOT);
  });

  test("инженер может залогиниться", async ({ page }) => {
    await login(page, CREDENTIALS.engineer1);

    await expect(page.getByText("Отраслевой инженер")).toBeVisible();
  });

  test("начальник подразделения может залогиниться", async ({ page }) => {
    await login(page, CREDENTIALS.subdivision11);

    await expect(page.getByText("Начальник подразделения")).toBeVisible();
  });
});
