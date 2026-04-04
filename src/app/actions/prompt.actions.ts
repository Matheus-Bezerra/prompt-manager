"use server";

import { SearchPromptsUseCase } from "@/core/application/prompts/search-prompts.use-case";
import type { PromptSummary } from "@/core/domain/prompts/prompt.entity";
import { prisma } from "@/lib/prisma";
import { PrismaPromptRepository } from "../infra/repository/prisma-prompt.repository";

type SearchFormState = {
  success: boolean;
  prompts?: PromptSummary[];
  message?: string;
};

export async function searchPromptAction(
  prev: SearchFormState,
  formdata: FormData,
): Promise<SearchFormState> {
  const term = String(formdata.get("q") ?? "").trim();

  const repository = new PrismaPromptRepository(prisma);
  const useCase = new SearchPromptsUseCase(repository);

  try {
    const results = await useCase.execute(term);

    const summaries = results.map(({ id, title, content }) => ({
      id,
      title,
      content,
    }));

    return {
      success: true,
      prompts: summaries,
    };
  } catch (_) {
    return {
      success: false,
      message: "Falha ao buscar prompts",
    };
  }
}
