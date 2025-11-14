"use client";

import { ReactNode } from "react";
import useSWR from "swr";

interface StatusResponse {
  updated_at: string;
  dependencies: {
    database: {
      version: string;
      opened_connections: number;
      max_connections: number;
    };
  };
}

async function fetchAPI(key: string): Promise<StatusResponse> {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function UpdatedAt() {
  const { data, isLoading } = useSWR<StatusResponse>(
    "/api/v1/status",
    fetchAPI,
    {
      refreshInterval: 2000,
    },
  );

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { data, isLoading } = useSWR<StatusResponse>(
    "/api/v1/status",
    fetchAPI,
    {
      refreshInterval: 2000,
    },
  );

  let databaseStatusInformation: ReactNode = "Carregando...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões máximas: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>

      <div>{databaseStatusInformation}</div>
    </>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}
