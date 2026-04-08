import { loadE2eEnv } from "./load-e2e-env";
import { runPrismaMigrateDeploy } from "./run-prisma-migrate-deploy";
import { runTsxScript } from "./run-tsx-script";

async function globalSetup() {
  loadE2eEnv();

  try {
    console.log("[E2E] Aplicando migrações (prisma migrate deploy)…");
    await runPrismaMigrateDeploy();
  } catch (error) {
    const _error = error as Error;
    console.error(`[E2E] migrate deploy falhou: ${_error.message}`);
    throw error;
  }

  try {
    await runTsxScript("prisma/seed.ts");
  } catch (error) {
    const _error = error as Error;
    console.warn(
      `[E2E] Seed do banco de dados falhou, prosseguindo sem seed. ${_error.message}`,
    );
  }
}

export default globalSetup;
