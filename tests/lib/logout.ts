import { Page } from "@playwright/test";

export async function logout(page: Page) {
    await page.getByRole('menuitem', { name: 'logout Выйти' }).locator('a').click();

}
