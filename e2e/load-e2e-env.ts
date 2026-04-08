import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config as dotenvConfig } from "dotenv";

/**
 * Carrega `.env` e, se existir, `.env.e2e` (override) — só fora de CI.
 * Os testes E2E usam **apenas** `E2E_DATABASE_URL`: ela vira `DATABASE_URL`
 * no processo (Prisma/Next/scripts). Sem ela, lança erro e nada inicia.
 */
export function loadE2eEnv(cwd: string = process.cwd()): void {
  if (!process.env.CI) {
    dotenvConfig({ path: resolve(cwd, ".env") });

    const e2eEnvPath = resolve(cwd, ".env.e2e");
    if (existsSync(e2eEnvPath)) {
      dotenvConfig({ path: e2eEnvPath, override: true });
    }
  }

  const e2eUrl = process.env.E2E_DATABASE_URL?.trim();
  if (!e2eUrl) {
    throw new Error(
      "[E2E] Defina E2E_DATABASE_URL (Postgres só para E2E). " +
        "O `DATABASE_URL` do `.env` de desenvolvimento não é usado nos testes E2E.",
    );
  }

  process.env.DATABASE_URL = e2eUrl;
  console.info("[E2E] Usando banco isolado (E2E_DATABASE_URL → DATABASE_URL no processo).");
}
