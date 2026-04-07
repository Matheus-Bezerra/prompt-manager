import type { PromptRepository } from "@/core/domain/prompts/prompt.repository";
import type { UpdatePromptDTO } from "./update-prompt.dto";

export class UpdatePromptUseCase {
  constructor(private readonly promptRepository: PromptRepository) {}

  async execute(data: UpdatePromptDTO) {
    const promptExists = await this.promptRepository.findById(data.id);

    if (!promptExists) {
      throw new Error("PROMPT_NOT_FOUND");
    }

    return this.promptRepository.update(data.id, {
      title: data.title,
      content: data.content,
    });
  }
}
