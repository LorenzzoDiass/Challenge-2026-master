import { buscarToken } from "./sessionService";

const API_URL = "https://challenge-2026-master.onrender.com";

async function criarHeadersAutenticados() {
  const token = await buscarToken();

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function lerResposta(resposta: Response) {
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        "Erro ao processar solicitação"
    );
  }

  return dados;
}

export async function fazerLogin(
  email: string,
  senha: string
) {
  const resposta = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    }
  );

  return lerResposta(resposta);
}

export async function fazerLoginClienteDemo() {
  const resposta = await fetch(
    `${API_URL}/login-cliente-demo`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return lerResposta(resposta);
}

export async function buscarClientes() {
  const headers =
    await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/clientes`,
    {
      headers,
    }
  );

  return lerResposta(resposta);
}

export async function buscarClientePorId(
  id: string
) {
  const headers =
    await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/clientes/${id}`,
    {
      headers,
    }
  );

  return lerResposta(resposta);
}

export async function atualizarStatus(
  id: string,
  status: string
) {
  const headers =
    await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/clientes/${id}/status`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        status,
      }),
    }
  );

  return lerResposta(resposta);
}

export async function atualizarQuilometragem(
  id: string,
  quilometragem: number
) {
  const headers =
    await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/clientes/${id}/quilometragem`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        quilometragem,
      }),
    }
  );

  return lerResposta(resposta);
}

export async function buscarAgendamentos() {
  const headers =
    await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/agendamentos`,
    {
      headers,
    }
  );

  return lerResposta(resposta);
}

export async function buscarAgendamentosDoCliente(
  id: string
) {
  const headers =
    await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/clientes/${id}/agendamentos`,
    {
      headers,
    }
  );

  return lerResposta(resposta);
}

export async function criarAgendamento(
  dadosAgendamento: any
) {
  const headers =
    await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/agendamentos`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(
        dadosAgendamento
      ),
    }
  );

  return lerResposta(resposta);
}

export async function concluirAgendamento(
  id: string
) {
  const headers =
    await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/agendamentos/${id}/concluir`,
    {
      method: "PUT",
      headers,
    }
  );

  return lerResposta(resposta);
}

export async function buscarConcessionarias() {
  const resposta = await fetch(
    `${API_URL}/concessionarias`
  );

  return lerResposta(resposta);
}

export async function criarUsuario(
  nome: string,
  email: string,
  senha: string
) {
  const resposta = await fetch(
    `${API_URL}/usuarios`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        senha,
      }),
    }
  );

  return lerResposta(resposta);
}