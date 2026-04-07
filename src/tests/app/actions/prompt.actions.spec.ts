import {
  createPromptAction,
  deletePromptAction,
  searchPromptAction,
  updatePromptAction,
} from "@/app/actions/prompt.actions";

jest.mock("@/lib/prisma", () => ({ prisma: {} }));
const mockedSearchExecute = jest.fn();
const mockedCreateExecute = jest.fn();
const mockedUpdateExecute = jest.fn();
const mockedDeleteExecute = jest.fn();

jest.mock("@/core/application/prompts/search-prompts.use-case", () => ({
  SearchPromptsUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute,
  })),
}));

jest.mock("@/core/application/prompts/create-prompt.use-case", () => ({
  CreatePromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedCreateExecute,
  })),
}));

jest.mock("@/core/application/prompts/update-prompt.use-case", () => ({
  UpdatePromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedUpdateExecute,
  })),
}));

jest.mock("@/core/application/prompts/delete-prompt.use-case", () => ({
  DeletePromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedDeleteExecute,
  })),
}));

describe("Server Actions: Prompts", () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
    mockedCreateExecute.mockReset();
    mockedUpdateExecute.mockReset();
    mockedDeleteExecute.mockReset();
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

    it("should resolve successfully of the query also term is empty", async () => {
      const input = [{ id: "1", title: "test", content: "test" }];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.set("q", "");

      const result = await searchPromptAction(
        { success: true, prompts: input },
        formData,
      );

      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });
  });

  describe("createPromptAction", () => {
    it("should return success when data is valid", async () => {
      mockedCreateExecute.mockResolvedValue(undefined);

      const data = { title: "test", content: "test" };
      const result = await createPromptAction(data);

      expect(result?.success).toBe(true);
      expect(result?.message).toBe("Prompt criado com sucesso");
    });

    it("should return validation error when data is invalid", async () => {
      const data = { title: "", content: "" };
      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Erro de validação");
      expect(result?.errors).toBeDefined();
    });

    it("should return error when prompt already exists", async () => {
      mockedCreateExecute.mockRejectedValue(new Error("PROMPT_ALREADY_EXISTS"));

      const data = { title: "test", content: "test" };
      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Este prompt já existe");
    });

    it("should return error generic when create prompt use case throws an error", async () => {
      const error = new Error("UNKNOWN");
      mockedCreateExecute.mockRejectedValue(error);

      const data = { title: "test", content: "test" };
      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Falha ao criar prompt");
    });
  });

  describe("updatePromptAction", () => {
    it("should return success when data is valid", async () => {
      mockedUpdateExecute.mockResolvedValue({
        id: "1",
        title: "Atualizado",
        content: "Conteúdo atualizado",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const data = { id: "1", title: "Atualizado", content: "Conteúdo atualizado" };
      const result = await updatePromptAction(data);

      expect(result?.success).toBe(true);
      expect(result?.message).toBe("Prompt atualizado com sucesso");
    });

    it("should return validation error when data is invalid", async () => {
      const data = { id: "", title: "", content: "" };
      const result = await updatePromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Erro de validação");
      expect(result?.errors).toBeDefined();
    });

    it("should return error when prompt is not found", async () => {
      mockedUpdateExecute.mockRejectedValue(new Error("PROMPT_NOT_FOUND"));

      const data = { id: "missing", title: "test", content: "test" };
      const result = await updatePromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Prompt não encontrado");
    });

    it("should return error generic when update prompt use case throws an error", async () => {
      const error = new Error("UNKNOWN");
      mockedUpdateExecute.mockRejectedValue(error);

      const data = { id: "1", title: "test", content: "test" };
      const result = await updatePromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Falha ao atualizar prompt");
    });
  });

  describe("deletePromptAction", () => {
    it("should return success when id is valid", async () => {
      mockedDeleteExecute.mockResolvedValue(undefined);

      const result = await deletePromptAction("1");

      expect(result?.success).toBe(true);
      expect(result?.message).toBe("Prompt removido com sucesso");
    });

    it("should return validation error when id is invalid", async () => {
      const result = await deletePromptAction("");

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Erro de validação");
      expect(result?.errors).toBeDefined();
    });

    it("should return error when prompt is not found", async () => {
      mockedDeleteExecute.mockRejectedValue(new Error("PROMPT_NOT_FOUND"));

      const result = await deletePromptAction("missing");

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Prompt não encontrado");
    });

    it("should return error generic when delete prompt use case throws an error", async () => {
      mockedDeleteExecute.mockRejectedValue(new Error("UNKNOWN"));

      const result = await deletePromptAction("1");

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Falha ao remover prompt");
    });
  });
});
