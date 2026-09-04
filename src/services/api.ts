const API_URL = "http://10.0.0.131:3001";

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
  const resposta = await fetch(`${API_URL}/clientes`);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar clientes");
  }

  const dados = await resposta.json();

  return dados;
}

export async function buscarClientePorId(id: string) {
  const resposta = await fetch(
    `${API_URL}/clientes/${id}`
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar cliente");
  }

  const dados = await resposta.json();

  return dados;
}

export async function atualizarStatus(
  id: string,
  status: string
) {
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
  const resposta = await fetch(
    `${API_URL}/clientes/${id}/quilometragem`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

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
  const resposta = await fetch(
    `${API_URL}/agendamentos`
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar agendamentos");
  }

  const dados = await resposta.json();

  return dados;
}

export async function criarAgendamento(
  dadosAgendamento: any
) {
  const resposta = await fetch(
    `${API_URL}/agendamentos`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(dadosAgendamento),
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || "Erro ao criar agendamento"
    );
  }

  return dados;
}

export async function buscarConcessionarias() {
  const resposta = await fetch(
    `${API_URL}/concessionarias`
  );

  if (!resposta.ok) {
    throw new Error(
      "Erro ao buscar concessionárias"
    );
  }

  const dados = await resposta.json();

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
      dados.mensagem || "Erro ao cadastrar usuário"
    );
  }

  return dados;
}