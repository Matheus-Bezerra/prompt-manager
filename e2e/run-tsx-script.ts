import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Executa um .ts com o tsx do projeto (evita importar Prisma no runner do Playwright).
 */
export async function runTsxScript(scriptRelativeFromRoot: string): Promise<void> {
  const root = process.cwd();
  const tsxCli = resolve(root, "node_modules/tsx/dist/cli.mjs");
  const scriptPath = resolve(root, scriptRelativeFromRoot);

  if (!existsSync(tsxCli)) {
    throw new Error(`tsx não encontrado: ${tsxCli}`);
  }
  if (!existsSync(scriptPath)) {
    throw new Error(`Script não encontrado: ${scriptPath}`);
  }

  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(process.execPath, [tsxCli, scriptPath], {
      cwd: root,
      env: process.env,
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }
      reject(new Error(`Script saiu com código ${code}`));
    });
  });
}
