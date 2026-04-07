import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { deletePromptAction } from "@/app/actions/prompt.actions";
import {
  PromptCard,
  type PromptCardProps,
} from "@/components/prompts/prompt-card";

const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

jest.mock("@/app/actions/prompt.actions", () => ({
  deletePromptAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const makeSut = ({ prompt }: PromptCardProps) => {
  return render(<PromptCard prompt={prompt} />);
};

describe("PromptCard", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    refreshMock.mockClear();
    jest.mocked(toast.success).mockClear();
    jest.mocked(toast.error).mockClear();
    jest.mocked(deletePromptAction).mockReset();
  });

  it("should render the link with href correctly", () => {
    const prompt = { id: "1", title: "Prompt 1", content: "Content 1" };
    makeSut({ prompt });

    expect(screen.getByRole("link")).toHaveAttribute("href", `/${prompt.id}`);
  });

  it("should open the dialog of the remove prompt button", async () => {
    const prompt = { id: "1", title: "Prompt 1", content: "Content 1" };
    makeSut({ prompt });

    const removeButton = screen.getByRole("button", { name: "Remover Prompt" });

    expect(removeButton).toHaveAttribute("data-state", "closed");
    await user.click(removeButton);
    expect(removeButton).toHaveAttribute("data-state", "open");
  });

  it("should remove prompt and show success message", async () => {
    jest.mocked(deletePromptAction).mockResolvedValue({
      success: true,
      message: "Prompt removido com sucesso",
    });

    const prompt = { id: "1", title: "Prompt 1", content: "Content 1" };
    makeSut({ prompt });

    const removeButton = screen.getByRole("button", { name: "Remover Prompt" });
    await user.click(removeButton);
    await user.click(screen.getByRole("button", { name: "Confirmar Remoção" }));

    expect(deletePromptAction).toHaveBeenCalledWith("1");
    expect(jest.mocked(toast.success)).toHaveBeenCalledTimes(1);
    expect(jest.mocked(toast.success)).toHaveBeenCalledWith(
      "Prompt removido com sucesso",
    );
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
