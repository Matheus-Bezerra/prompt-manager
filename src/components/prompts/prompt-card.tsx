"use client";

import { LoaderIcon, TrashIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deletePromptAction } from "@/app/actions/prompt.actions";
import type { PromptSummary } from "@/core/domain/prompts/prompt.entity";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export type PromptCardProps = {
  prompt: PromptSummary;
};

export const PromptCard = ({ prompt }: PromptCardProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deletePromptAction(prompt.id);
      if (!result?.success) {
        toast.error(result?.message ?? "Falha ao remover prompt");
        return;
      }

      toast.success(result.message);
      router.refresh();
    } catch (error) {
      const _error = error as Error;
      if (_error.message === "PROMPT_NOT_FOUND") {
        toast.error("Prompt não encontrado");
        return;
      }
      toast.error("Falha ao remover prompt");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.li
      className="p-3 rounded-lg transition-all duration-200 group relative hover:bg-gray-700"
      aria-label={prompt.title}
      initial={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <header className="flex items-start justify-between">
        <Link href={`/${prompt.id}`} prefetch className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-white group-hover:text-accent-300 transition-colors">
            {prompt.title}
          </h3>

          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {prompt.content}
          </p>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="icon"
              size="icon"
              title="Remover Prompt"
              aria-label="Remover Prompt"
            >
              <TrashIcon className="w-3 h-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover Prompt</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover este prompt?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting && (
                  <LoaderIcon className="mr-2 w-4 h-4 animate-spin" />
                )}
                Confirmar Remoção
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
    </motion.li>
  );
};
