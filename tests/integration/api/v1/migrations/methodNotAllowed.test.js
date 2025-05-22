import database from "infra/database";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeAll(cleanDatabase);

test("DELETE method to /api/v1/migrations should return 405", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });
  expect(response.status).toBe(405);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    error: "Method DELETE not allowed",
  });
});

test("PUT method to /api/v1/migrations should return 405", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PUT",
  });
  expect(response.status).toBe(405);

  const responseBody = await response.json();

  expect(responseBody).toEqual({
    error: "Method PUT not allowed",
  });
});
