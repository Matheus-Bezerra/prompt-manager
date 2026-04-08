import test, { expect } from "@playwright/test";

test.describe("Sidebar Responsive", () => {
  test("mobile: menu hamburguer should open and close the sidebar", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const openButton = page.getByRole("button", { name: "Abrir menu" });
    const sidebar = page.getByRole("complementary", {
      name: /sidebar content/i,
    });

    await expect(openButton).toBeVisible();
    await expect(openButton).toHaveAttribute("aria-expanded", "false");
    await expect(sidebar).toHaveClass(/-translate-x-full/);

    await openButton.click();

    await expect(openButton).toHaveAttribute("aria-expanded", "true");
    await expect(sidebar).toHaveClass(/translate-x-0/);

    const closeButton = page.getByRole("button", { name: "Fechar menu" });
    await expect(closeButton).toBeVisible();

    await closeButton.click();

    await expect(openButton).toHaveAttribute("aria-expanded", "false");
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });
});
