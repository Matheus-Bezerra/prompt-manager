import { z } from "zod";

export const deletePromptSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export type DeletePromptDTO = z.infer<typeof deletePromptSchema>;
