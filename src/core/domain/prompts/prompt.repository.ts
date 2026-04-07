import type { CreatePromptDTO } from "@/core/application/prompts/create-prompt.dto";
import type { UpdatePromptDTO } from "@/core/application/prompts/update-prompt.dto";
import type { Prompt } from "./prompt.entity";

export interface PromptRepository {
  findById(id: string): Promise<Prompt | null>;
  findMany(): Promise<Prompt[]>;
  findByTitle(title: string): Promise<Prompt | null>;
  searchMany(term: string): Promise<Prompt[]>;
  create(data: CreatePromptDTO): Promise<void>;
  update(id: string, data: Partial<UpdatePromptDTO>): Promise<Prompt>;
  delete(id: string): Promise<void>;
}
