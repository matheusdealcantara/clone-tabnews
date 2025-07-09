import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <GetStatus />
    </>
  );
}

function GetStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";
  let versionText = "Carregando...";
  let maxConnectionsText = "Carregando...";
  let openedConnectionsText = "Carregando";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    versionText = data.dependencies.database.version;
    maxConnectionsText = data.dependencies.database.max_connections;
    openedConnectionsText = data.dependencies.database.opened_connections;
  }

  return (
    <div>
      <p>Última atualização: {updatedAtText}</p>
      <div>
        Banco de dados utilizado: PostgreSQL
        <p>Versão: {versionText}</p>
        <p>Conexões permitidas: {maxConnectionsText}</p>
        <p>Conexões abertas: {openedConnectionsText}</p>
      </div>
    </div>
  );
}
