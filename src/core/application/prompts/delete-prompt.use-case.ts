import type { PromptRepository } from "@/core/domain/prompts/prompt.repository";
import type { DeletePromptDTO } from "./delete-prompt.dto";

export class DeletePromptUseCase {
  constructor(private readonly promptRepository: PromptRepository) {}

  async execute(data: DeletePromptDTO): Promise<void> {
    const promptExists = await this.promptRepository.findById(data.id);

    if (!promptExists) {
      throw new Error("PROMPT_NOT_FOUND");
    }

    await this.promptRepository.delete(data.id);
  }
}
