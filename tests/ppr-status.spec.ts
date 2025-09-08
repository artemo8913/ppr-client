import { test, expect } from "@playwright/test";

import { ROUTE_ROOT } from "@/1shared/lib/routes";

import { login } from "./lib/login";
import { CREDENTIALS } from "./mock/testCredentials";
import { reloadDatabase } from "./lib/reloadDatabase";
import { logout } from "./lib/logout";

const YEAR_PLAN_NAME = "ЭЧК-9 ППР 2026";
const MONTH_PLAN_NAME = "ЭЧК10 2025год";
const APROVE = "Согласовать";
const AGREE = "Утвердить";

test.describe("Согласование / утверждение планов", () => {
    test.beforeEach(async ({ page }) => {
        await reloadDatabase();
        await page.goto(ROUTE_ROOT);
    });

    test.afterAll(async () => {
        await reloadDatabase();
    });

    test("годовой ппр может быть согласован и утвержден", async ({ page }) => {
        test.slow();
        // Начальник цеха
        await login(page, CREDENTIALS.subdivision11);
        await page.getByRole("link", { name: YEAR_PLAN_NAME }).click();
        await page.getByRole("button", { name: "Отправить на проверку ЭУ-" }).click();

        await expect(
            page.getByRole("button", { name: "Отозвать с проверки ЭУ-" })
        ).toMatchAriaSnapshot(
            `- button "Отозвать с проверки ЭУ-132"`
        );

        await logout(page);

        // Инженер
        await login(page, CREDENTIALS.engineer1);
        await page.getByRole("link", { name: YEAR_PLAN_NAME }).click();
        await page.getByRole("button", { name: APROVE }).click();

        await expect(
            page.getByRole("button", { name: APROVE })
        ).toHaveCount(0);

        await logout(page);

        // Нормировщик
        await login(page, CREDENTIALS.norm1);
        await page.getByRole("link", { name: YEAR_PLAN_NAME }).click();
        await page.getByRole("button", { name: APROVE }).click();

        await expect(
            page.getByRole("button", { name: APROVE })
        ).toHaveCount(0);

        await logout(page);

        // Заместитель начальника
        await login(page, CREDENTIALS.subboss1);
        await page.getByRole("link", { name: YEAR_PLAN_NAME }).click();
        await page.getByRole("button", { name: APROVE }).click();

        await expect(
            page.getByRole("button", { name: APROVE })
        ).toHaveCount(0);

        await logout(page);

        // Начальник / главный инженер
        await login(page, CREDENTIALS.boss1);
        await page.getByRole("link", { name: YEAR_PLAN_NAME }).click();
        await page.getByRole("button", { name: AGREE }).click();

        await expect(
            page.getByRole("button", { name: AGREE })
        ).toHaveCount(0);
    });

    test("месячный ппр может быть согласован и утвержден", async ({ page }) => {
        test.slow();
        // Начальник цеха
        await login(page, CREDENTIALS.subdivision12);
        await page.getByRole("link", { name: MONTH_PLAN_NAME }).click();
        await page.getByRole('button', { name: 'Запланировать работы на май' }).click();

        await expect(
            page.getByRole('button', { name: 'Отправить на проверку' })
        ).toMatchAriaSnapshot(
            `- button "Отправить на проверку"`
        );

        await page.getByRole('button', { name: 'Отправить на проверку' }).click();

        await expect(page.getByRole('button', { name: 'Отозвать план с проверки' })).toBeVisible();

        await logout(page);


        // Нормировщик
        await login(page, CREDENTIALS.norm1);
        await page.getByRole("link", { name: MONTH_PLAN_NAME }).click();
        await page.getByRole('button', { name: 'Согласовать' }).click();

        await expect(
            page.getByRole('button', { name: 'Согласовать' })
        ).toHaveCount(0);

        await logout(page);

        // Инженер
        await login(page, CREDENTIALS.engineer1);
        await page.getByRole("link", { name: MONTH_PLAN_NAME }).click();
        await page.getByRole("button", { name: APROVE }).click();

        await expect(
            page.getByRole("button", { name: APROVE })
        ).toHaveCount(0);

        await logout(page);


        // Заместитель начальника
        await login(page, CREDENTIALS.subboss1);
        await page.getByRole("link", { name: MONTH_PLAN_NAME }).click();
        await page.getByRole("button", { name: AGREE }).click();

        await expect(
            page.getByRole("button", { name: AGREE })
        ).toHaveCount(0);

        await logout(page);
    });
});
