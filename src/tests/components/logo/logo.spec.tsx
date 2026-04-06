import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/logo/logo";

describe("Logo", () => {
  it("should render the logo with the text correctly", () => {
    render(<Logo />);

    const logo = screen.getByRole("link");
    expect(logo).toHaveTextContent("PROMPTS");
    expect(logo).toHaveAttribute("href", "/");
  });
});
