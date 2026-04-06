import { act, fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyButton, type CopyButtonProps } from "@/components/button-actions";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

import { toast } from "sonner";

const writeTextMock = jest.fn();

const user = userEvent.setup();

const makeSut = (props: CopyButtonProps = { content: "" }) =>
  render(<CopyButton {...props} />);

describe("CopyButton", () => {
  beforeEach(() => {
    writeTextMock.mockReset();
    writeTextMock.mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });
    jest.mocked(toast.error).mockClear();
  });

  it("should button be disabled when content is empty", () => {
    const { getByRole } = makeSut({ content: "" });
    expect(getByRole("button")).toBeDisabled();
  });

  it("should copy to clipboard, show 'Copiado', then after 2s show 'Copiar' with button enabled", async () => {
    jest.useFakeTimers();

    try {
      const { getByText, getByRole } = makeSut({ content: "test" });
      const button = getByRole("button");

      fireEvent.click(button);

      await act(async () => {
        await Promise.resolve();
      });

      expect(getByText("Copiado")).toBeInTheDocument();
      expect(writeTextMock).toHaveBeenCalledWith("test");
      expect(button).not.toBeDisabled();

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(getByText("Copiar")).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    } finally {
      jest.useRealTimers();
    }
  });

  it("should show a toast error when the copying fails", async () => {
    writeTextMock.mockRejectedValueOnce(new Error("clipboard denied"));

    const { getByText } = makeSut({ content: "test" });

    await user.click(getByText("Copiar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Falha ao copiar texto: clipboard denied",
      );
    });
  });
});
