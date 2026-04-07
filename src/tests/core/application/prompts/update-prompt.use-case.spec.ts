import { UpdatePromptUseCase } from "@/core/application/prompts/update-prompt.use-case";
import type { Prompt } from "@/core/domain/prompts/prompt.entity";
import type { PromptRepository } from "@/core/domain/prompts/prompt.repository";

const makeRepository = (overrides: Partial<PromptRepository>) => {
  const base = {
    findById: jest.fn(),
    findMany: jest.fn(),
    findByTitle: jest.fn(),
    searchMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  return {
    ...base,
    ...overrides,
  } as PromptRepository;
};

describe("UpdatePromptUseCase", () => {
  it("should update a prompt when it exists", async () => {
    const existing: Prompt = {
      id: "p1",
      title: "Old title",
      content: "Old content",
      createdAt: new Date("2020-01-01"),
      updatedAt: new Date("2020-01-01"),
    };

    const updated: Prompt = {
      ...existing,
      title: "New title",
      content: "New content",
      updatedAt: new Date("2025-01-01"),
    };

    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(existing),
      update: jest.fn().mockResolvedValue(updated),
    });

    const useCase = new UpdatePromptUseCase(repository);
    const input = {
      id: "p1",
      title: "New title",
      content: "New content",
    };

    await expect(useCase.execute(input)).resolves.toEqual(updated);

    expect(repository.findById).toHaveBeenCalledWith("p1");
    expect(repository.update).toHaveBeenCalledWith("p1", {
      title: "New title",
      content: "New content",
    });
  });

  it("should not update when prompt does not exist", async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(null),
    });

    const useCase = new UpdatePromptUseCase(repository);

    await expect(
      useCase.execute({
        id: "missing",
        title: "x",
        content: "y",
      }),
    ).rejects.toThrow(new Error("PROMPT_NOT_FOUND"));

    expect(repository.update).not.toHaveBeenCalled();
  });
});
