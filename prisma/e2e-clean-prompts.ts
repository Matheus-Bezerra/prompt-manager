import { cleanDatabase } from "./seed";

async function main() {
  await cleanDatabase();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
