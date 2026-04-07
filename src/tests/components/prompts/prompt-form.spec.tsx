import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromptForm, type PromptFormProps } from "@/components/prompts/prompt-form";
import type { Prompt } from "@/core/domain/prompts/prompt.entity";

const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

const createPromptActionMock = jest.fn();
const updatePromptActionMock = jest.fn();

jest.mock("@/app/actions/prompt.actions", () => ({
  createPromptAction: (...args: unknown[]) => createPromptActionMock(...args),
  updatePromptAction: (...args: unknown[]) => updatePromptActionMock(...args),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { toast } from "sonner";

const makeSut = (props: PromptFormProps = {}) => render(<PromptForm {...props} />);

const makePrompt = (overrides: Partial<Prompt> = {}): Prompt => ({
  id: "prompt-1",
  title: "Título existente",
  content: "Conteúdo existente",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-02"),
  ...overrides,
});

describe("PromptForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    refreshMock.mockClear();
    createPromptActionMock.mockReset();
    updatePromptActionMock.mockReset();
    jest.mocked(toast.success).mockClear();
    jest.mocked(toast.error).mockClear();
  });

  describe("create mode", () => {
    it("should render fields and submit button", () => {
      makeSut();

      expect(
        screen.getByPlaceholderText("Título do prompt"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Digite o conteúdo do prompt"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Salvar" }),
      ).toBeInTheDocument();
    });

    it("should call createPromptAction and toast success with router refresh when save succeeds", async () => {
      createPromptActionMock.mockResolvedValue({
        success: true,
        message: "Prompt criado com sucesso",
      });

      makeSut();

      await user.type(screen.getByPlaceholderText("Título do prompt"), "Novo título");
      await user.type(
        screen.getByPlaceholderText("Digite o conteúdo do prompt"),
        "Novo conteúdo",
      );
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(createPromptActionMock).toHaveBeenCalledWith({
          title: "Novo título",
          content: "Novo conteúdo",
        });
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Prompt criado com sucesso");
      });
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });

    it("should show error toast and not refresh when create fails", async () => {
      createPromptActionMock.mockResolvedValue({
        success: false,
        message: "Este prompt já existe",
      });

      makeSut();

      await user.type(screen.getByPlaceholderText("Título do prompt"), "X");
      await user.type(screen.getByPlaceholderText("Digite o conteúdo do prompt"), "Y");
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Este prompt já existe");
      });
      expect(toast.success).not.toHaveBeenCalled();
      expect(refreshMock).not.toHaveBeenCalled();
    });

    it("should show validation message when title is empty", async () => {
      makeSut();

      await user.type(
        screen.getByPlaceholderText("Digite o conteúdo do prompt"),
        "Só conteúdo",
      );
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      expect(await screen.findByText("Título é obrigatório")).toBeInTheDocument();
      expect(createPromptActionMock).not.toHaveBeenCalled();
    });
  });

  describe("edit mode", () => {
    it("should pre-fill fields from prompt", () => {
      const prompt = makePrompt();
      makeSut({ prompt });

      expect(screen.getByPlaceholderText("Título do prompt")).toHaveValue(
        prompt.title,
      );
      expect(screen.getByPlaceholderText("Digite o conteúdo do prompt")).toHaveValue(
        prompt.content,
      );
    });

    it("should call updatePromptAction and toast success with router refresh when save succeeds", async () => {
      const prompt = makePrompt();
      updatePromptActionMock.mockResolvedValue({
        success: true,
        message: "Prompt atualizado com sucesso",
      });

      makeSut({ prompt });

      await user.clear(screen.getByPlaceholderText("Título do prompt"));
      await user.type(screen.getByPlaceholderText("Título do prompt"), "Atualizado");
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(updatePromptActionMock).toHaveBeenCalledWith({
          id: prompt.id,
          title: "Atualizado",
          content: prompt.content,
        });
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Prompt atualizado com sucesso",
        );
      });
      expect(refreshMock).toHaveBeenCalledTimes(1);
      expect(createPromptActionMock).not.toHaveBeenCalled();
    });

    it("should show error toast and not refresh when update fails", async () => {
      const prompt = makePrompt();
      updatePromptActionMock.mockResolvedValue({
        success: false,
        message: "Prompt não encontrado",
      });

      makeSut({ prompt });

      await user.click(screen.getByRole("button", { name: "Salvar" }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Prompt não encontrado");
      });
      expect(refreshMock).not.toHaveBeenCalled();
    });
  });
});
