import { test, expect } from "@playwright/test";

import { ROUTE_PPR_ACTION_TEST, ROUTE_ROOT } from "@/1shared/lib/routes";

import { login } from "./lib/login";
import { CREDENTIALS } from "./mock/testCredentials";
import { reloadDatabase } from "./lib/reloadDatabase";
import { logout } from "./lib/logout";

const YEAR_PLAN_NAME = "ЭЧК-9 ППР 2026";
const MONTH_PLAN_NAME = "ЭЧК10 2025год";
const APROVE = "Согласовать";
const AGREE = "Утвердить";

test.describe("Годовой план", () => {
    test.beforeEach(async ({ page }) => {
        await reloadDatabase();
        await page.goto(ROUTE_ROOT);
    });

    test.afterAll(async () => {
        await reloadDatabase();
    });

    test("инженер может открыть Годовой план ЭЧК", async ({ page }) => {
        await login(page, CREDENTIALS.engineer1);
        await page.getByRole("link", { name: "Перейти на страницу планов ТОиР" }).click();
        await page.getByRole("link", { name: "ЭЧК10 2025год" }).click();

        await expect(page.getByRole("heading")).toMatchAriaSnapshot(
            `- heading "ЗАТРАТЫ ТРУДА на запланированные и фактически выполненные работы" [level=2]`
        );

        await expect(page).toHaveScreenshot({ fullPage: true });

        await logout(page);
    });

    test("Действия с работами годового плана", async ({ page }) => {
        await login(page, CREDENTIALS.engineer1);
        await expect(page.getByRole("link", { name: "Перейти на страницу планов ТОиР" })).toHaveCount(1);

        await page.goto(ROUTE_PPR_ACTION_TEST);

        await test.step("добавить объезд с осмотром", async () => {
            await expect(page.getByText('Следование к месту работы и обратно')).toHaveCount(1);
            await page.getByText('Следование к месту работы и обратно').hover();
            await page.getByRole('button', { name: 'plus' }).click();
            await page.getByRole('row', { name: 'объезд с осмотром контактной сети, выполняемый электромехаником 1' }).getByLabel('', { exact: true }).check();
            await page.getByRole('textbox', { name: 'Примечание' }).click();
            await page.getByRole('textbox', { name: 'Примечание' }).fill('asd');
            await page.getByRole('button', { name: 'Добавить' }).click();
            await page.getByText('объезд с осмотром контактной сети, выполняемый электромехаником').first().click();
        });

        await test.step("задать план на февраль для объезда", async () => {
            await page.locator('tr:nth-child(4) > td:nth-child(22) > .flex > .TableCell_TableCell__bfiVn > .TableCell_InputCell__vuerh').click();
            await page.locator('tr:nth-child(4) > td:nth-child(22) > .flex > .TableCell_TableCell__bfiVn > .TableCell_InputCell__vuerh').fill('10');
            await page.locator('tr:nth-child(4) > td:nth-child(22) > .flex > .TableCell_TableCell__bfiVn > .TableCell_InputCell__vuerh').press('Enter');
        });

        await test.step("копировать план по объезду", async () => {
            await page.getByText('объезд с осмотром контактной сети, выполняемый электромехаником').first().hover();
            await page.getByLabel('План ТОиР').getByRole('button', { name: 'copy' }).click();
            await page.locator('td:nth-child(21) > .flex > .TableCell_TableCell__bfiVn > .TableCell_InputCell__vuerh').click();
            await page.locator('td:nth-child(21) > .flex > .TableCell_TableCell__bfiVn > .TableCell_InputCell__vuerh').fill('10');
            await page.locator('td:nth-child(21) > .flex > .TableCell_TableCell__bfiVn > .TableCell_InputCell__vuerh').press('Enter');
        });

        await test.step("переместить работу ниже в таблице", async () => {
            await page.getByText('Следование к месту работы и обратно').hover();
            await page.getByRole('button', { name: 'arrow-down' }).click();
        });

        await test.step("удалить следование к месту работы и обратно", async () => {
            await page.getByText('Следование к месту работы и обратно').hover();

            page.once('dialog', dialog => {
                console.log(`Dialog message: ${dialog.message()}`);
                dialog.accept().catch(() => { });
            });
            await page.getByRole('button', { name: 'minus' }).click();
        });

        expect(await page.getByRole('tabpanel', { name: 'План ТОиР' }).ariaSnapshot()).toMatchSnapshot("ppr-action-snapshot.yaml");
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
        await page.getByRole('button', { name: APROVE }).click();

        await expect(
            page.getByRole('button', { name: APROVE })
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
