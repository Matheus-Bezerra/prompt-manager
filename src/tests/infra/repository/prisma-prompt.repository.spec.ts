import { PrismaPromptRepository } from "@/app/infra/repository/prisma-prompt.repository";
import type { PrismaClient } from "@/generated/prisma/client";

function createMockPrisma() {
  return {
    prompt: {
      findMany: jest.fn(),
    },
  };
}

describe("PrismaPromptRepository", () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let repository: PrismaPromptRepository;

  beforeEach(() => {
    prisma = createMockPrisma();
    repository = new PrismaPromptRepository(prisma as unknown as PrismaClient);
  });

  const now = new Date();

  describe("findMany", () => {
    it("should return all prompts and order by createdAt descending", async () => {
      const input = [
        {
          id: "1",
          title: "Prompt 1",
          content: "Content 1",
          createdAt: now,
        },
        {
          id: "2",
          title: "Prompt 2",
          content: "Content 2",
          createdAt: now.setDate(now.getDate() - 1),
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.findMany();

      expect(results).toEqual(input);
      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: "desc",
        },
      });
    });
  });

  describe("searchMany", () => {
    it("should return with term empty and return all prompts", async () => {
      const input = [
        {
          id: "1",
          title: "Prompt 1",
          content: "Content 1",
          createdAt: now,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany("");

      expect(results).toEqual(input);
      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should return with term not empty and return prompts with term in title or content", async () => {
      const input = [
        {
          id: "1",
          title: "Prompt 1",
          content: "Content 1",
          createdAt: now,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany("Prompt 1");

      expect(results).toEqual(input);
      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: "Prompt 1", mode: "insensitive" } },
            { content: { contains: "Prompt 1", mode: "insensitive" } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });
  });
});
