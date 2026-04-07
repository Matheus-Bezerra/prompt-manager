import { PrismaPromptRepository } from "@/app/infra/repository/prisma-prompt.repository";
import type { PrismaClient } from "@/generated/prisma/client";

function createMockPrisma() {
  return {
    prompt: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  describe("create", () => {
    it("should create a prompt", async () => {
      const input = {
        id: "1",
        title: "Prompt 1",
        content: "Content 1",
      };

      prisma.prompt.create.mockResolvedValue(input);

      await repository.create(input);

      expect(prisma.prompt.create).toHaveBeenCalledWith({
        data: input,
      });
    });
  });

  describe("findById", () => {
    it("should return a prompt by id", async () => {
      const input = {
        id: "1",
        title: "Prompt 1",
        content: "Content 1",
        createdAt: now,
        updatedAt: now,
      };

      prisma.prompt.findUnique.mockResolvedValue(input);

      const result = await repository.findById("1");

      expect(result).toEqual(input);
      expect(prisma.prompt.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should return null when prompt does not exist", async () => {
      prisma.prompt.findUnique.mockResolvedValue(null);

      const result = await repository.findById("missing");

      expect(result).toBeNull();
      expect(prisma.prompt.findUnique).toHaveBeenCalledWith({
        where: { id: "missing" },
      });
    });
  });

  describe("update", () => {
    it("should update a prompt and return the updated entity", async () => {
      const updatedAt = new Date(now.getTime() + 1000);
      const updated = {
        id: "1",
        title: "New title",
        content: "New content",
        createdAt: now,
        updatedAt,
      };

      prisma.prompt.update.mockResolvedValue(updated);

      const result = await repository.update("1", {
        title: "New title",
        content: "New content",
      });

      expect(result).toEqual(updated);
      expect(prisma.prompt.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          title: "New title",
          content: "New content",
        },
      });
    });

    it("should update with partial data", async () => {
      const updated = {
        id: "1",
        title: "Only title",
        content: "Unchanged",
        createdAt: now,
        updatedAt: now,
      };

      prisma.prompt.update.mockResolvedValue(updated);

      const result = await repository.update("1", { title: "Only title" });

      expect(result).toEqual(updated);
      expect(prisma.prompt.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { title: "Only title" },
      });
    });
  });

  describe("delete", () => {
    it("should delete a prompt by id", async () => {
      prisma.prompt.delete.mockResolvedValue(undefined);

      await repository.delete("1");

      expect(prisma.prompt.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });
  });

  describe("findByTitle", () => {
    it("should return a prompt by title", async () => {
      const input = {
        id: "1",
        title: "Prompt 1",
        content: "Content 1",
      };

      prisma.prompt.findUnique.mockResolvedValue(input);

      const result = await repository.findByTitle(input.title);

      expect(result).toEqual(input);
      expect(prisma.prompt.findUnique).toHaveBeenCalledWith({
        where: { title: input.title },
      });
    });
  });

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
