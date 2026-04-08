"use client";

import {
  ArrowLeftToLine,
  ArrowRightToLine,
  X as CloseButton,
  MenuIcon,
  PlusIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { searchPromptAction } from "@/app/actions/prompt.actions";
import type { PromptSummary } from "@/core/domain/prompts/prompt.entity";
import { Logo } from "../logo";
import { PromptList } from "../prompts";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export type SidebarContentProps = {
  prompts: PromptSummary[];
};

const fadeTransition = { duration: 0.2, delay: 0.1 };

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formRef = useRef<HTMLFormElement>(null);

  const [searchState, searchAction, isPending] = useActionState(
    searchPromptAction,
    {
      success: true,
      prompts,
    },
  );

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const hasQuery = query.trim().length > 0;
  const promptList = hasQuery ? (searchState?.prompts ?? prompts) : prompts;

  const collapsedSidebar = () => setIsCollapsed(true);
  const expandSidebar = () => setIsCollapsed(false);

  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  const handleNewPrompt = () => router.push("/new");

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValueQuery = event.target.value;
    setQuery(newValueQuery);

    startTransition(() => {
      const url = newValueQuery
        ? `/?q=${encodeURIComponent(newValueQuery)}`
        : "/";
      router.push(url, { scroll: false });

      const formData = new FormData();
      formData.set("q", newValueQuery);
      searchAction(formData);
    });
  };

  useEffect(() => {
    if (!hasQuery) return;

    formRef.current?.requestSubmit();
  }, [hasQuery]);

  return (
    <div>
      <Button
        className="md:hidden fixed top-6 left-6 z-50"
        variant="secondary"
        title="Abrir menu"
        aria-label="Abrir menu"
        aria-expanded={isMobileOpen}
        onClick={openMobile}
      >
        <MenuIcon className="w-5 h-5 text-gray-100" />
      </Button>

      <motion.aside
        aria-label="Sidebar content"
        className={`border-r border-gray-700 flex flex-col h-full bg-gray-800 transition-[transform,width] duration-300 ease-in-out fixed md:relative left-0 top-0 z-50 md:z-auto w-[80vw] sm:w-[320px] ${isCollapsed ? "md:w-[72px]" : "md:w-[384px]"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        initial={false}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isCollapsed && (
          <section className="px-2 py-6">
            <header className="flex items-center justify-center mb-6">
              <Button
                onClick={expandSidebar}
                variant={"icon"}
                className="md:inline-flex p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-lg transition-colors"
                aria-label="Expandir sidebar"
                title="Expandir sidebar"
              >
                <ArrowRightToLine className="w-5 h-5 text-gray-100" />
              </Button>
            </header>

            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={false}
              animate={{ opacity: 1 }}
              transition={fadeTransition}
            >
              <Button
                onClick={handleNewPrompt}
                aria-label="Novo prompt"
                title="Novo prompt"
              >
                <PlusIcon className="w-5 h-5 text-white" />
              </Button>
            </motion.div>
          </section>
        )}

        {!isCollapsed && (
          <div>
            <section className="p-6">
              <div className="md:hidden p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="secondary"
                    aria-label="Fechar menu"
                    title="Fechar menu"
                    onClick={closeMobile}
                  >
                    <CloseButton className="w-5 h-5 text-gray-100" />
                  </Button>
                </div>
              </div>

              <motion.div
                className="flex w-full items-center justify-between mb-6"
                initial={false}
                animate={{ opacity: 1 }}
                transition={fadeTransition}
              >
                <header className="flex w-full items-center justify-between">
                  <Logo />
                  <Button
                    onClick={collapsedSidebar}
                    variant="icon"
                    className="md:inline-flex p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-lg transition-colors"
                    aria-label="Minimizar sidebar"
                    title="Minimizar sidebar"
                  >
                    <ArrowLeftToLine className="w-5 h-5 text-gray-100" />
                  </Button>
                </header>
              </motion.div>

              <section className="mb-5">
                <form
                  ref={formRef}
                  action={searchAction}
                  className="relative group w-full"
                >
                  <Input
                    type="text"
                    name="q"
                    placeholder="Buscar prompts..."
                    value={query}
                    onChange={handleQueryChange}
                    autoFocus
                  />

                  {isPending && (
                    <div
                      title="Carregando prompts"
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-300"
                    >
                      <Spinner />
                    </div>
                  )}
                </form>
              </section>

              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
              >
                <Button onClick={handleNewPrompt} className="w-full" size="lg">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Novo Prompt
                </Button>
              </motion.div>
            </section>

            <motion.nav
              className="flex-1 overflow-y-auto px-6 pb-6"
              aria-label="Lista de prompts"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <PromptList prompts={promptList} />
            </motion.nav>
          </div>
        )}
      </motion.aside>
    </div>
  );
};
