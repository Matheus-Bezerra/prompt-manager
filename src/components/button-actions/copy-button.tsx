"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export type CopyButtonProps = {
  content: string;
};

export const CopyButton = ({ content }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isContentEmpty = !content.trim();

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCopy = async () => {
    const text = content.trim();

    if (text.length === 0) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      if (timerRef.current) {
        clearTimer();
      }

      timerRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      const _error = error as Error;
      toast.error(`Falha ao copiar texto: ${_error.message}`);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: clearTimer is called when the component unmounts
  useEffect(() => {
    clearTimer();
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isContentEmpty}
      onClick={handleCopy}
      aria-label="Copiar conteúdo"
      title="Copiar conteúdo"
    >
      {isCopied ? (
        <CheckIcon className="w-4 h-4 text-green-400" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
      <motion.span
        key={isCopied ? "copiado" : "copiar"}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -2 }}
        transition={{ duration: 0.5 }}
      >
        {isCopied ? "Copiado" : "Copiar"}
      </motion.span>
    </Button>
  );
};
