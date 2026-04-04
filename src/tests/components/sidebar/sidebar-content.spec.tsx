import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SidebarContent,
  type SidebarContentProps,
} from "@/components/sidebar/sidebar-content";

const pushMock = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock("@/app/actions/prompt.actions", () => ({
  searchPromptAction: jest.fn(),
}));

const initialPrompts = [
  {
    id: "1",
    title: "Prompt 1",
    content: "Content 1",
  },
  {
    id: "2",
    title: "Prompt 2",
    content: "Content 2",
  },
];

const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps,
) => {
  return render(<SidebarContent prompts={prompts} />);
};

describe("SidebarContent", () => {
  const user = userEvent.setup();

  describe("base", () => {
    it("should render a new prompt button", () => {
      makeSut();

      expect(screen.getByRole("button", { name: "Novo Prompt" })).toBeVisible();
    });

    it("should render the list of prompts", () => {
      makeSut();

      expect(screen.getByText(initialPrompts[0].title)).toBeVisible();
      expect(screen.getByText(initialPrompts[1].title)).toBeVisible();
    });
  });

  describe("Collapse / Expand sidebar", () => {
    it("should initialize in expanded state and show the button to collapse", () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimizar sidebar/i,
      });

      const expandedButton = screen.queryByRole("button", {
        name: /expandir sidebar/i,
      });

      expect(collapseButton).toBeVisible();
      expect(expandedButton).not.toBeInTheDocument();
    });

    it("should contrariwise and show the button to expand", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimizar sidebar/i,
      });
      await user.click(collapseButton);

      const expandedButton = screen.getByRole("button", {
        name: /expandir sidebar/i,
      });

      expect(expandedButton).toBeVisible();
      expect(collapseButton).not.toBeInTheDocument();
    });

    it("should show button create prompt when the sidebar is collapsed", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimizar sidebar/i,
      });
      await user.click(collapseButton);

      const createPromptButton = screen.getByRole("button", {
        name: /novo prompt/i,
      });
      expect(createPromptButton).toBeVisible();
    });

    it("Should not show the list of prompts when the sidebar is collapsed", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimizar sidebar/i,
      });
      await user.click(collapseButton);

      const navListOfPrompts = screen.queryByRole("navigation", {
        name: /lista de prompts/i,
      });
      expect(navListOfPrompts).not.toBeInTheDocument();
    });
  });

  describe("New prompt button", () => {
    it("Should navigate to the new prompt to /new when the new prompt button is clicked", async () => {
      makeSut();

      const newPromptButton = screen.getByRole("button", {
        name: /novo prompt/i,
      });
      await user.click(newPromptButton);

      expect(pushMock).toHaveBeenCalledWith("/new");
    });
  });

  describe("Search", () => {
    it("should navigate with url code when the user types in the input and clear the input", async () => {
      makeSut();
      const text = "A B";

      const searchInput = screen.getByPlaceholderText("Buscar prompts...");
      await user.type(searchInput, text);

      expect(pushMock).toHaveBeenCalled();
      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe(`/?q=A%20B`);

      await user.clear(searchInput);
      const lastClearedCall = pushMock.mock.calls.at(-1);
      expect(lastClearedCall?.[0]).toBe(`/`);
    });

    it("should submit the form the digit in the search input", async () => {
      const submitSpy = jest.spyOn(HTMLFormElement.prototype, "requestSubmit");
      makeSut();

      const searchInput = screen.getByPlaceholderText("Buscar prompts...");
      await user.type(searchInput, "Prompt 1");

      expect(submitSpy).toHaveBeenCalled();
    });
  });

  it("Should initialize field search with search param", () => {
    const text = "inicial";
    mockSearchParams.set("q", text);
    makeSut();
    const searchInput = screen.getByPlaceholderText("Buscar prompts...");

    expect(searchInput).toHaveValue("inicial");
  });
});
