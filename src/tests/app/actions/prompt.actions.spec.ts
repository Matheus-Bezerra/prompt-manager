import { searchPromptAction } from "@/app/actions/prompt.actions";

jest.mock("@/lib/prisma", () => ({ prisma: {} }));
const mockedSearchExecute = jest.fn();

jest.mock("@/core/application/prompts/search-prompts.use-case", () => ({
  SearchPromptsUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute,
  })),
}));

describe("Server Actions: Prompts", () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
  });

  describe("searchPromptAction", () => {
    it("should return success with term not null and empty prompts", async () => {
      const input = [{ id: "1", title: "test", content: "test" }];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.set("q", "test");

      const result = await searchPromptAction(
        { success: true, prompts: input },
        formData,
      );

      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it("should return success and list all prompts to term null", async () => {
      const input = [{ id: "1", title: "test", content: "test" }];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchPromptAction(
        { success: true, prompts: input },
        formData,
      );

      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it("should return the error general when search prompts use case throws an error", async () => {
      const error = new Error("UNKNOWN");
      mockedSearchExecute.mockRejectedValue(error);

      const formData = new FormData();
      formData.set("q", "test");

      const result = await searchPromptAction({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.prompts).toBeUndefined();
      expect(result.message).toBe("Falha ao buscar prompts");
    });
  });
});
