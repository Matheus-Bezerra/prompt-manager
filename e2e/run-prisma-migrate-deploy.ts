import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Aplica migrações no banco atual (DATABASE_URL).
 * Usa o entrypoint JS do pacote prisma (portável; evita depender do shell em .bin).
 */
export async function runPrismaMigrateDeploy(): Promise<void> {
  const root = process.cwd();
  const prismaEntry = resolve(root, "node_modules/prisma/build/index.js");
  if (!existsSync(prismaEntry)) {
    throw new Error(`Prisma CLI não encontrado: ${prismaEntry}`);
  }

  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(process.execPath, [prismaEntry, "migrate", "deploy"], {
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
      reject(new Error(`prisma migrate deploy saiu com código ${code}`));
    });
  });
}
