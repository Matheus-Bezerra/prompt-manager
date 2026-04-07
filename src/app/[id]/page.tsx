import { PromptForm } from "@/components/prompts";
import { prisma } from "@/lib/prisma";
import { PrismaPromptRepository } from "../infra/repository/prisma-prompt.repository";

type PromptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params;
  const repository = new PrismaPromptRepository(prisma);
  const prompt = await repository.findById(id);

  return <PromptForm prompt={prompt} />;
}
