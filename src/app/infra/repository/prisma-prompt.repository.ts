import type { CreatePromptDTO } from "@/core/application/prompts/create-prompt.dto";
import type { UpdatePromptDTO } from "@/core/application/prompts/update-prompt.dto";
import type { Prompt } from "@/core/domain/prompts/prompt.entity";
import type { PromptRepository } from "@/core/domain/prompts/prompt.repository";
import type { PrismaClient } from "@/generated/prisma/client";

export class PrismaPromptRepository implements PromptRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Prompt | null> {
    return this.prisma.prompt.findUnique({
      where: { id },
    });
  }

  async findMany(): Promise<Prompt[]> {
    return this.prisma.prompt.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByTitle(title: string): Promise<Prompt | null> {
    return this.prisma.prompt.findUnique({
      where: { title },
    });
  }

  async searchMany(term: string): Promise<Prompt[]> {
    const q = term.trim() ?? "";

    const prompts = await this.prisma.prompt.findMany({
      where: q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return prompts;
  }

  async create(data: CreatePromptDTO): Promise<void> {
    await this.prisma.prompt.create({ data });
  }

  async update(id: string, data: Partial<UpdatePromptDTO>): Promise<Prompt> {
    return this.prisma.prompt.update({
      where: { id },
      data,
    });
  }
}
