import { SearchPromptsUseCase } from "@/core/application/prompts/search-prompts.use-case";
import type { Prompt } from "@/core/domain/prompts/prompt.entity";
import type { PromptRepository } from "@/core/domain/prompts/prompt.repository";

describe("SearchPromptsUseCase", () => {
  const input: Prompt[] = [
    {
      id: "1",
      title: "test1",
      content: "test1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "test2",
      content: "test2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const repository: PromptRepository = {
    findById: async (id) =>
      Promise.resolve(input.find((prompt) => prompt.id === id) ?? null),
    findMany: async () => input,
    searchMany: async (term) =>
      input.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(term.toLowerCase()) ||
          prompt.content.toLowerCase().includes(term.toLowerCase()),
      ),
    findByTitle: async (title) =>
      Promise.resolve(input.find((prompt) => prompt.title === title) ?? null),
    create: async () => Promise.resolve(undefined),
    update: async (id, data) =>
      Promise.resolve(
        input.find((prompt) => prompt.id === id) ?? {
          id,
          title: data.title ?? "",
          content: data.content ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ),
    delete: async () => Promise.resolve(undefined),
  };

  it("should return all prompts when term is empty", async () => {
    const useCase = new SearchPromptsUseCase(repository);
    const results = await useCase.execute("");

    expect(results).toHaveLength(input.length);
  });

  it("should filter prompts per term search", async () => {
    const useCase = new SearchPromptsUseCase(repository);
    const results = await useCase.execute(input[0].title);

    expect(results).toHaveLength(1);
    expect(results).toEqual([input[0]]);
  });

  it("should apply trim in find with term in spaces white and return all prompts", async () => {
    const useCase = new SearchPromptsUseCase(repository);
    const results = await useCase.execute("  test  ");

    expect(results).toHaveLength(input.length);
    expect(results).toEqual(input);
  });
});
