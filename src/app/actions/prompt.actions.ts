"use server";

import z from "zod";
import {
  type CreatePromptDTO,
  createPromptSchema,
} from "@/core/application/prompts/create-prompt.dto";
import { CreatePromptUseCase } from "@/core/application/prompts/create-prompt.use-case";
import { SearchPromptsUseCase } from "@/core/application/prompts/search-prompts.use-case";
import {
  type UpdatePromptDTO,
  updatePromptSchema,
} from "@/core/application/prompts/update-prompt.dto";
import { UpdatePromptUseCase } from "@/core/application/prompts/update-prompt.use-case";
import type { PromptSummary } from "@/core/domain/prompts/prompt.entity";
import { prisma } from "@/lib/prisma";
import { PrismaPromptRepository } from "../infra/repository/prisma-prompt.repository";

type SearchFormState = {
  success: boolean;
  prompts?: PromptSummary[];
  message?: string;
};

type FormState = {
  success: boolean;
  prompt?: PromptSummary[];
  message?: string;
  errors?: unknown;
};

export async function createPromptAction(
  data: CreatePromptDTO,
): Promise<FormState> {
  const validated = createPromptSchema.safeParse(data);

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);
    return {
      success: false,
      message: "Erro de validação",
      errors: fieldErrors,
    };
  }

  try {
    const repository = new PrismaPromptRepository(prisma);
    const useCase = new CreatePromptUseCase(repository);
    await useCase.execute(validated.data);

    return {
      success: true,
      message: "Prompt criado com sucesso",
    };
  } catch (error) {
    const _error = error as Error;
    if (_error.message === "PROMPT_ALREADY_EXISTS") {
      return {
        success: false,
        message: "Este prompt já existe",
      };
    }

    return {
      success: false,
      message: "Falha ao criar prompt",
    };
  }
}

export async function updatePromptAction(
  data: UpdatePromptDTO,
): Promise<FormState> {
  const validated = updatePromptSchema.safeParse(data);

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);
    return {
      success: false,
      message: "Erro de validação",
      errors: fieldErrors,
    };
  }

  try {
    const repository = new PrismaPromptRepository(prisma);
    const useCase = new UpdatePromptUseCase(repository);
    const prompt = await useCase.execute(validated.data);

    return {
      success: true,
      message: "Prompt atualizado com sucesso",
    };
  } catch (error) {
    const _error = error as Error;
    if (_error.message === "PROMPT_NOT_FOUND") {
      return {
        success: false,
        message: "Prompt não encontrado",
      };
    }

    return {
      success: false,
      message: "Falha ao atualizar prompt",
    };
  }
}

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
