import { render, screen } from "@testing-library/react";
import {
  PromptList,
  type PromptListProps,
} from "@/components/prompts/prompt-list";

const makeSut = ({ prompts = [] }: PromptListProps) => {
  return render(<PromptList prompts={prompts} />);
};

describe("PromptList", () => {
  it("should render the prompt list with the prompts", () => {
    const prompts = [
      { id: "1", title: "Prompt 1", content: "Content 1" },
      { id: "2", title: "Prompt 2", content: "Content 2" },
    ];
    makeSut({ prompts });

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Prompt 1")).toBeInTheDocument();
    expect(screen.getByText("Prompt 2")).toBeInTheDocument();
  });

  it("should render the prompt list with no prompts", () => {
    makeSut({ prompts: [] });

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
