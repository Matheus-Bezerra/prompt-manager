import { randomUUID } from "node:crypto";
import test, { expect } from "@playwright/test";
import { runTsxScript } from "./run-tsx-script";

test.describe("prompt delete", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    await runTsxScript("prisma/e2e-clean-prompts.ts");
  });

  test("should remove a prompt after confirming in the dialog", async ({
    page,
  }) => {
    const title = `E2E Prompt ${randomUUID()}`;
    const content = `E2E Content ${randomUUID()}`;

    await page.goto("/new");

    await expect(page.getByPlaceholder("Título do prompt")).toBeVisible({
      timeout: 15_000,
    });
    await page.fill('input[name="title"]', title);
    await expect(
      page.getByPlaceholder("Digite o conteúdo do prompt"),
    ).toBeVisible();
    await page.fill('textarea[name="content"]', content);
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("Prompt criado com sucesso")).toBeVisible({
      timeout: 15_000,
    });

    const promptList = page.getByRole("navigation", {
      name: "Lista de prompts",
    });

    await expect(
      promptList.getByRole("heading", { name: title }),
    ).toBeVisible({ timeout: 15_000 });

    const card = promptList.getByRole("listitem").filter({ hasText: title });
    await card.getByRole("button", { name: "Remover Prompt" }).click();

    await expect(page.getByRole("alertdialog")).toBeVisible();
    await expect(
      page.getByText("Tem certeza que deseja remover este prompt?"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Confirmar Remoção" }).click();

    await expect(page.getByText("Prompt removido com sucesso")).toBeVisible({
      timeout: 15_000,
    });

    await expect(promptList.getByRole("heading", { name: title })).toHaveCount(
      0,
    );
  });

  test("should keep the prompt when canceling the dialog", async ({ page }) => {
    const title = `E2E Prompt ${randomUUID()}`;
    const content = `E2E Content ${randomUUID()}`;

    await page.goto("/new");

    await expect(page.getByPlaceholder("Título do prompt")).toBeVisible({
      timeout: 15_000,
    });
    await page.fill('input[name="title"]', title);
    await expect(
      page.getByPlaceholder("Digite o conteúdo do prompt"),
    ).toBeVisible();
    await page.fill('textarea[name="content"]', content);
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("Prompt criado com sucesso")).toBeVisible({
      timeout: 15_000,
    });

    const promptList = page.getByRole("navigation", {
      name: "Lista de prompts",
    });

    await expect(
      promptList.getByRole("heading", { name: title }),
    ).toBeVisible({ timeout: 15_000 });

    const card = promptList.getByRole("listitem").filter({ hasText: title });
    await card.getByRole("button", { name: "Remover Prompt" }).click();

    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.getByRole("button", { name: "Cancelar" }).click();

    await expect(page.getByRole("alertdialog")).not.toBeVisible();
    await expect(
      promptList.getByRole("heading", { name: title }),
    ).toBeVisible();
  });
});
