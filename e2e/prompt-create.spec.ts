import { randomUUID } from "node:crypto";
import test, { expect } from "@playwright/test";
import { runTsxScript } from "./run-tsx-script";

test.describe("prompt create", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    await runTsxScript("prisma/e2e-clean-prompts.ts");
  });

  test("should create of the prompt UI", async ({ page }) => {
    const uniqueTitle = `E2E Prompt ${randomUUID()}`;
    const uniqueContent = `E2E Content ${randomUUID()}`;

    await page.goto("/new");

    await expect(page.getByPlaceholder("Título do prompt")).toBeVisible();
    await page.fill('input[name="title"]', uniqueTitle);
    await expect(
      page.getByPlaceholder("Digite o conteúdo do prompt"),
    ).toBeVisible();
    await page.fill('textarea[name="content"]', uniqueContent);

    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("Prompt criado com sucesso")).toBeVisible({
      timeout: 15_000,
    });

    const promptList = page.getByRole("navigation", {
      name: "Lista de prompts",
    });

    await expect(
      promptList.getByRole("heading", { name: uniqueTitle }),
    ).toBeVisible();
    await expect(promptList.getByText(uniqueContent)).toBeVisible();
  });

  test("validate of the duplicate on the title", async ({ page }) => {
    const title = `E2E Prompt ${randomUUID()}`;
    const content = `E2E Content ${randomUUID()}`;

    await page.goto("/new");

    await page.fill('input[name="title"]', title);
    await page.fill('textarea[name="content"]', content);
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("Prompt criado com sucesso")).toBeVisible({
      timeout: 15_000,
    });

    await page.goto("/new");

    await page.fill('input[name="title"]', title);
    await page.fill('textarea[name="content"]', `${content} (dup)`);
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("Este prompt já existe")).toBeVisible({
      timeout: 15_000,
    });

    const promptList = page.getByRole("navigation", {
      name: "Lista de prompts",
    });
    await expect(promptList.getByRole("heading", { name: title })).toHaveCount(
      1,
    );
  });
});
