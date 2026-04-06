import { CreatePromptUseCase } from "@/core/application/prompts/create-prompt.use-case";
import type { PromptRepository } from "@/core/domain/prompts/prompt.repository";

const makeRepository = (overrides: Partial<PromptRepository>) => {
  const base = {
    create: jest.fn(),
  };

  return {
    ...base,
    ...overrides,
  } as PromptRepository;
};

describe("CreatePromptUseCase", () => {
  it("should create a prompt not duplicate", async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue(null),
    });

    const useCase = new CreatePromptUseCase(repository);
    const input = {
      title: "Prompt 1",
      content: "Content 1",
    };

    await expect(useCase.execute(input)).resolves.toBeUndefined();

    expect(repository.create).toHaveBeenCalledWith(input);
  });

  it("should not create a prompt if it already exists", async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue({
        id: "1",
        title: "Prompt 1",
        content: "Content 1",
      }),
    });

    const useCase = new CreatePromptUseCase(repository);
    const input = {
      title: "Prompt 1",
      content: "Content 1",
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      new Error("PROMPT_ALREADY_EXISTS"),
    );
  });
});
