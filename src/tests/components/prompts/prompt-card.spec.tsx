import { render, screen } from "@testing-library/react";
import {
  PromptCard,
  type PromptCardProps,
} from "@/components/prompts/prompt-card";

const makeSut = ({ prompt }: PromptCardProps) => {
  return render(<PromptCard prompt={prompt} />);
};

describe("PromptCard", () => {
  it("should render the link with href correctly", () => {
    const prompt = { id: "1", title: "Prompt 1", content: "Content 1" };
    makeSut({ prompt });

    expect(screen.getByRole("link")).toHaveAttribute("href", `/${prompt.id}`);
  });
});
