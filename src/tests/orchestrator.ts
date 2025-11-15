import retry from "async-retry";
import { faker } from "@faker-js/faker";

import { database } from "@/infra/database";
import { migrator } from "@/models/migrator";
import { user, UserInputValues } from "@/models/user";

async function clearDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

async function createUser(userObject?: Partial<UserInputValues>) {
  return await user.create({
    username:
      userObject?.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject?.email || faker.internet.email(),
    password: userObject?.password || "senha123",
  });
}

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

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

export const orchestrator = {
  clearDatabase,
  createUser,
  runPendingMigrations,
  waitForAllServices,
};
