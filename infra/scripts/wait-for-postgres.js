const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stderr.write(".");
      checkPostgres();
      return;
    }
    console.log("\nPostgres aceitando conexões!\n");
  }
}

process.stdout.write("\n\nAguardando postgres aceitar conexões...");
checkPostgres();
