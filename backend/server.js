const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const clientes = [
  {
    id: "1",
    nome: "Marcos Silva",
    modelo: "Ford Ranger Raptor",
    ano: 2022,
    km: 98000,
    risco: "ALTO",
    status: "SEM CONTATO",
    telefone: "(11) 99872-4421",
    email: "marcos.silva@gmail.com",
    cidade: "São Paulo - SP",
    ultimaRevisao: "15/08/2025",
    garantia: "Fora da garantia",
    motivo: "Alta quilometragem e muito tempo desde a última revisão.",
    acao: "Contato prioritário com oferta de desconto para revisão.",
  },
  {
    id: "2",
    nome: "Fernanda Costa",
    modelo: "Ford Territory Titanium",
    ano: 2023,
    km: 61000,
    risco: "MÉDIO",
    status: "SEM CONTATO",
    telefone: "(21) 99711-8422",
    email: "fernanda.costa@gmail.com",
    cidade: "Rio de Janeiro - RJ",
    ultimaRevisao: "10/01/2026",
    garantia: "Garantia ativa",
    motivo: "Revisão se aproximando e cliente com risco moderado de atraso.",
    acao: "Enviar lembrete de manutenção preventiva.",
  },
  {
    id: "3",
    nome: "Ricardo Almeida",
    modelo: "Ford Maverick Hybrid",
    ano: 2024,
    km: 12000,
    risco: "BAIXO",
    status: "SEM CONTATO",
    telefone: "(31) 99182-1134",
    email: "ricardo.almeida@gmail.com",
    cidade: "Belo Horizonte - MG",
    ultimaRevisao: "02/04/2026",
    garantia: "Garantia ativa",
    motivo: "Cliente com manutenção recente e boa regularidade.",
    acao: "Manter acompanhamento normal.",
  },
  {
    id: "4",
    nome: "Juliana Martins",
    modelo: "Ford Bronco Sport",
    ano: 2021,
    km: 87000,
    risco: "ALTO",
    status: "SEM CONTATO",
    telefone: "(41) 99572-2210",
    email: "juliana.martins@gmail.com",
    cidade: "Curitiba - PR",
    ultimaRevisao: "20/06/2025",
    garantia: "Fora da garantia",
    motivo: "Cliente não realiza revisão há mais de 10 meses.",
    acao: "Contato urgente com benefício exclusivo.",
  },
  {
    id: "5",
    nome: "Lucas Pereira",
    modelo: "Ford Edge ST",
    ano: 2023,
    km: 43000,
    risco: "MÉDIO",
    status: "SEM CONTATO",
    telefone: "(51) 99111-7812",
    email: "lucas.pereira@gmail.com",
    cidade: "Porto Alegre - RS",
    ultimaRevisao: "18/12/2025",
    garantia: "Garantia ativa",
    motivo: "Quilometragem próxima da revisão preventiva.",
    acao: "Enviar oferta automática para agendamento.",
  },
  {
    id: "6",
    nome: "Amanda Souza",
    modelo: "Ford Mustang GT",
    ano: 2022,
    km: 25000,
    risco: "BAIXO",
    status: "SEM CONTATO",
    telefone: "(85) 99771-6612",
    email: "amanda.souza@gmail.com",
    cidade: "Fortaleza - CE",
    ultimaRevisao: "12/03/2026",
    garantia: "Garantia ativa",
    motivo: "Cliente realiza revisões regularmente.",
    acao: "Manter relacionamento ativo.",
  },
];

let agendamentos = [
  {
    id: "1",
    clienteId: "1",
    cliente: "Marcos Silva",
    veiculo: "Ford Ranger Raptor",
    unidade: "Ford Center Morumbi",
    data: "28/05/2026",
    horario: "14:30",
    servico: "Revisão preventiva",
    observacao: "Cliente pediu avaliação geral do veículo.",
    status: "Confirmado",
  },
  {
    id: "2",
    clienteId: "2",
    cliente: "Fernanda Costa",
    veiculo: "Ford Territory Titanium",
    unidade: "Ford Barra",
    data: "30/05/2026",
    horario: "10:00",
    servico: "Check-up completo",
    observacao: "Verificar pneus e freios.",
    status: "Pendente",
  },
];

app.get("/", (req, res) => {
  res.send("API Ford Retain rodando!");
});

app.get("/clientes", (req, res) => {
  res.json(clientes);
});

app.get("/clientes/:id", (req, res) => {
  const cliente = clientes.find((item) => item.id === req.params.id);

  if (!cliente) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  res.json(cliente);
});

app.put("/clientes/:id/status", (req, res) => {
  const cliente = clientes.find((item) => item.id === req.params.id);

  if (!cliente) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  cliente.status = req.body.status;

  res.json(cliente);
});

app.get("/agendamentos", (req, res) => {
  res.json(agendamentos);
});

app.post("/agendamentos", (req, res) => {
  const {
    clienteId,
    unidade,
    data,
    horario,
    servico,
    observacao,
  } = req.body;

  const cliente = clientes.find((item) => item.id === clienteId);

  if (!cliente) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  const novoAgendamento = {
    id: String(agendamentos.length + 1),
    clienteId: cliente.id,
    cliente: cliente.nome,
    veiculo: cliente.modelo,
    unidade,
    data,
    horario,
    servico,
    observacao,
    status: "Confirmado",
  };

  agendamentos.push(novoAgendamento);

  cliente.status = "REVISÃO AGENDADA";

  res.status(201).json(novoAgendamento);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});