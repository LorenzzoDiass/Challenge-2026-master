const API_URL = "http://localhost:3001";

export async function buscarClientes() {
  const resposta = await fetch(`${API_URL}/clientes`);
  const dados = await resposta.json();

  return dados;
}

export async function buscarClientePorId(id: string) {
  const resposta = await fetch(`${API_URL}/clientes/${id}`);
  const dados = await resposta.json();

  return dados;
}

export async function atualizarStatus(id: string, status: string) {
  const resposta = await fetch(
    `${API_URL}/clientes/${id}/status`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
      }),
    }
  );

  const dados = await resposta.json();

  return dados;
}
export async function buscarAgendamentos() {
  const resposta = await fetch(`${API_URL}/agendamentos`);

  const dados = await resposta.json();

  return dados;
}

export async function criarAgendamento(dadosAgendamento: any) {
  const resposta = await fetch(`${API_URL}/agendamentos`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(dadosAgendamento),
  });

  const dados = await resposta.json();

  return dados;
}