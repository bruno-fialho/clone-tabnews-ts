import { exec } from "node:child_process";

function checkPostgres(): void {
  exec("docker exec tabnews_pg_dev pg_isready --host localhost", handleReturn);

  function handleReturn(error: Error | null, stdout: string): void {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n🟢 Postgres está pronto e aceitando conexões!");

    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
}

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões");

checkPostgres();
