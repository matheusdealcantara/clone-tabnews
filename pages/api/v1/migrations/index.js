import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  let allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      await dbClient.end();
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      await dbClient.end();

      if (migratedMigrations.length === 0) {
        return response.status(200).json(migratedMigrations);
      }

      return response.status(201).json(migratedMigrations);
    }
  } catch (error) {
    console.error("Error running migrations", error);
    return response.status(500).json({
      error: "Error running migrations",
    });
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
