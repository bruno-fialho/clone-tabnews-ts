import retry from "async-retry";

import { database } from "@/infra/database";
import { migrator } from "@/models/migrator";

async function waitForAllServices(): Promise<void> {
  async function waitForWebServer(): Promise<void> {
    async function fetchStatusPage(): Promise<void> {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }

    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1_000,
    });
  }

  await waitForWebServer();
}

async function clearDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

export const orchestrator = {
  clearDatabase,
  runPendingMigrations,
  waitForAllServices,
};
