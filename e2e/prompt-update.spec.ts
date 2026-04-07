import { randomUUID } from "node:crypto";
import test, { expect } from "@playwright/test";
import { runTsxScript } from "./run-tsx-script";

test.describe("prompt update", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    await runTsxScript("prisma/e2e-clean-prompts.ts");
  });

  test("should update a prompt", async ({ page }) => {
    const title = `E2E Prompt ${randomUUID()}`;
    const content = `E2E Content ${randomUUID()}`;

    await page.goto("/new");
    await page.fill('input[name="title"]', title);
    await page.fill('textarea[name="content"]', content);
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("Prompt criado com sucesso")).toBeVisible({
      timeout: 15_000,
    });

    const promptList = page.getByRole("navigation", {
      name: "Lista de prompts",
    });
    await promptList.getByRole("link").filter({ hasText: title }).click();

    await expect(page).not.toHaveURL(/\/new$/);
    await expect(page.getByPlaceholder("Título do prompt")).toHaveValue(title, {
      timeout: 15_000,
    });

    const updatedTitle = `${title} (updated)`;
    const updatedContent = `${content} (updated)`;

    await page.fill('input[name="title"]', updatedTitle);
    await page.fill('textarea[name="content"]', updatedContent);
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("Prompt atualizado com sucesso")).toBeVisible({
      timeout: 15_000,
    });

    await expect(page.getByPlaceholder("Título do prompt")).toHaveValue(
      updatedTitle,
    );
  });
});
