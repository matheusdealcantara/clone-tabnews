import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;
  dbClient = await database.getNewClient();

  try {
    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dbClient,
      });
      await dbClient?.end();
      return response.status(200).json(pendingMigrations);
    }
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(request, response) {
  let dbClient;
  dbClient = await database.getNewClient();

  try {
    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dbClient,
        dryRun: false,
      });

      await dbClient?.end();

      if (migratedMigrations.length === 0) {
        return response.status(200).json(migratedMigrations);
      }

      return response.status(201).json(migratedMigrations);
    }
  } finally {
    await dbClient?.end();
  }
}
