import test, { expect } from "@playwright/test";

test("should render the home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Selecione um prompt" }),
  ).toBeVisible();

  await expect(
    page.getByText(
      "Escolha um prompt da lista ao lado para visualizar e editar",
    ),
  ).toBeVisible();
});
