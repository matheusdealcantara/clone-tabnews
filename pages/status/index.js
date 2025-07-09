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
  let dependencies = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    dependencies = data.dependencies;
  }

  return (
    <div>
      <p>Última atualização: {updatedAtText}</p>
      <p>
        Banco de dados utilizado: PostgreSQL
        <pre>
          <p>Versão: {dependencies.database.version}</p>
          <p>Conexões permitidas: {dependencies.database.max_connections}</p>
          <p>Conexões abertas: {dependencies.database.opened_connections}</p>
        </pre>
      </p>
    </div>
  );
}
