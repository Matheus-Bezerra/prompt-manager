import { DeletePromptUseCase } from "@/core/application/prompts/delete-prompt.use-case";
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
    delete: jest.fn(),
  };

  return {
    ...base,
    ...overrides,
  } as PromptRepository;
};

describe("DeletePromptUseCase", () => {
  it("should delete when prompt exists", async () => {
    const existing: Prompt = {
      id: "p1",
      title: "Title",
      content: "Body",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(existing),
      delete: jest.fn().mockResolvedValue(undefined),
    });

    const useCase = new DeletePromptUseCase(repository);

    await expect(
      useCase.execute({ id: "p1" }),
    ).resolves.toBeUndefined();

    expect(repository.delete).toHaveBeenCalledWith("p1");
  });

  it("should throw when prompt does not exist", async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(null),
    });

    const useCase = new DeletePromptUseCase(repository);

    await expect(useCase.execute({ id: "missing" })).rejects.toThrow(
      new Error("PROMPT_NOT_FOUND"),
    );

    expect(repository.delete).not.toHaveBeenCalled();
  });
});
