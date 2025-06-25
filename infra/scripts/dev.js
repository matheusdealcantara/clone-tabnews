const { spawn } = require("child_process");

function runDevServer() {
  const devServer = spawn(
    "npm run services:up && npm run services:wait:database && npm run migrations:up && next dev",
    {
      shell: true,
      stdio: "inherit",
    },
  );

  devServer.on("error", (error) => {
    if (error > 0) {
      console.error("Failed to start the development server:", error);
    }
  });

  process.on("SIGINT", () => {
    spawn("npm run services:stop", {
      shell: true,
      stdio: "inherit",
    });
  });
}

if (require.main === module) {
  runDevServer();
}
module.exports = runDevServer;
