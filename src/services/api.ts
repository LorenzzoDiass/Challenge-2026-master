import { buscarToken } from "./sessionService";

const API_URL = "http://10.0.0.131:3001";

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

export async function fazerLogin(
  email: string,
  senha: string
) {
  const resposta = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || "Erro ao realizar login"
    );
  }

  return dados;
}

export async function buscarClientes() {
  const headers = await criarHeadersAutenticados();

  const resposta = await fetch(`${API_URL}/clientes`, {
    headers,
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || "Erro ao buscar clientes"
    );
  }

  return dados;
}

export async function buscarClientePorId(id: string) {
  const headers = await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/clientes/${id}`,
    {
      headers,
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || "Erro ao buscar cliente"
    );
  }

  return dados;
}

export async function atualizarStatus(
  id: string,
  status: string
) {
  const headers = await criarHeadersAutenticados();

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

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || "Erro ao atualizar status"
    );
  }

  return dados;
}

export async function atualizarQuilometragem(
  id: string,
  quilometragem: number
) {
  const headers = await criarHeadersAutenticados();

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

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        "Erro ao atualizar quilometragem"
    );
  }

  return dados;
}

export async function buscarAgendamentos() {
  const headers = await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/agendamentos`,
    {
      headers,
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        "Erro ao buscar agendamentos"
    );
  }

  return dados;
}

export async function buscarAgendamentosDoCliente(
  id: string
) {
  const headers = await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/clientes/${id}/agendamentos`,
    {
      headers,
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        "Erro ao buscar agendamentos do cliente"
    );
  }

  return dados;
}

export async function criarAgendamento(
  dadosAgendamento: any
) {
  const headers = await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/agendamentos`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(dadosAgendamento),
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        "Erro ao criar agendamento"
    );
  }

  return dados;
}

export async function concluirAgendamento(
  id: string
) {
  const headers = await criarHeadersAutenticados();

  const resposta = await fetch(
    `${API_URL}/agendamentos/${id}/concluir`,
    {
      method: "PUT",
      headers,
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        "Erro ao concluir agendamento"
    );
  }

  return dados;
}

export async function buscarConcessionarias() {
  const resposta = await fetch(
    `${API_URL}/concessionarias`
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        "Erro ao buscar concessionárias"
    );
  }

  return dados;
}

export async function criarUsuario(
  nome: string,
  email: string,
  senha: string
) {
  const resposta = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      email,
      senha,
    }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
        "Erro ao cadastrar usuário"
    );
  }

  return dados;
}