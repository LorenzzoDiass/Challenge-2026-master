const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

const caminhoBanco = path.join(
  __dirname,
  "ford-retain.db"
);

const db = new sqlite3.Database(
  caminhoBanco,
  (erro) => {
    if (erro) {
      console.log(
        "Erro ao conectar no banco:",
        erro.message
      );

      return;
    }

    console.log(
      "Banco SQLite conectado com sucesso."
    );
  }
);

db.serialize(() => {
  /*
  |--------------------------------------------------------------------------
  | TABELA DE USUÁRIOS
  |--------------------------------------------------------------------------
  */

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
    )
  `);

  /*
  |--------------------------------------------------------------------------
  | TABELA DE CLIENTES
  |--------------------------------------------------------------------------
  */

  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      modelo TEXT NOT NULL,
      ano INTEGER NOT NULL,
      km INTEGER NOT NULL,
      risco TEXT NOT NULL,
      status TEXT NOT NULL,
      telefone TEXT,
      email TEXT,
      cidade TEXT,
      ultimaRevisao TEXT,
      garantia TEXT,
      motivo TEXT,
      acao TEXT
    )
  `);

  /*
  |--------------------------------------------------------------------------
  | TABELA DE AGENDAMENTOS
  |--------------------------------------------------------------------------
  */

  db.run(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clienteId INTEGER NOT NULL,
      cliente TEXT NOT NULL,
      veiculo TEXT NOT NULL,
      unidade TEXT NOT NULL,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      servico TEXT NOT NULL,
      observacao TEXT,
      status TEXT NOT NULL,
      FOREIGN KEY (clienteId) REFERENCES clientes(id)
    )
  `);

  /*
  |--------------------------------------------------------------------------
  | USUÁRIO PADRÃO DO SISTEMA
  |--------------------------------------------------------------------------
  */

  const senhaPadrao = bcrypt.hashSync(
    "ford123",
    10
  );

  /*
   * Se o banco já possuir o usuário antigo,
   * atualizamos ele para a nova credencial.
   */

  db.run(
    `
    UPDATE usuarios
    SET
      nome = ?,
      email = ?,
      senha = ?
    WHERE email = ?
    `,
    [
      "Equipe Pós-venda Ford",
      "funcionario@fordretain.com",
      senhaPadrao,
      "admin@ford.com",
    ]
  );

  /*
   * Caso seja um banco novo, criamos
   * o usuário de demonstração.
   */

  db.run(
    `
    INSERT OR IGNORE INTO usuarios (
      nome,
      email,
      senha
    )
    VALUES (?, ?, ?)
    `,
    [
      "Equipe Pós-venda Ford",
      "funcionario@fordretain.com",
      senhaPadrao,
    ]
  );

  /*
  |--------------------------------------------------------------------------
  | CLIENTES INICIAIS
  |--------------------------------------------------------------------------
  */

  const clientes = [
    [
      1,
      "Marcos Silva",
      "Ford Ranger Raptor",
      2022,
      98000,
      "ALTO",
      "SEM CONTATO",
      "(11) 99872-4421",
      "marcos.silva@gmail.com",
      "São Paulo - SP",
      "15/08/2025",
      "Fora da garantia",
      "Alta quilometragem e muito tempo desde a última revisão.",
      "Contato prioritário com oferta de desconto para revisão.",
    ],

    [
      2,
      "Fernanda Costa",
      "Ford Territory Titanium",
      2023,
      61000,
      "MÉDIO",
      "SEM CONTATO",
      "(21) 99711-8422",
      "fernanda.costa@gmail.com",
      "Rio de Janeiro - RJ",
      "10/01/2026",
      "Garantia ativa",
      "Revisão se aproximando e cliente com risco moderado de atraso.",
      "Enviar lembrete de manutenção preventiva.",
    ],

    [
      3,
      "Ricardo Almeida",
      "Ford Maverick Hybrid",
      2024,
      12000,
      "BAIXO",
      "SEM CONTATO",
      "(31) 99182-1134",
      "ricardo.almeida@gmail.com",
      "Belo Horizonte - MG",
      "02/04/2026",
      "Garantia ativa",
      "Cliente com manutenção recente e boa regularidade.",
      "Manter acompanhamento normal.",
    ],

    [
      4,
      "Juliana Martins",
      "Ford Bronco Sport",
      2021,
      87000,
      "ALTO",
      "SEM CONTATO",
      "(41) 99572-2210",
      "juliana.martins@gmail.com",
      "Curitiba - PR",
      "20/06/2025",
      "Fora da garantia",
      "Cliente não realiza revisão há mais de 10 meses.",
      "Contato urgente com benefício exclusivo.",
    ],

    [
      5,
      "Lucas Pereira",
      "Ford Edge ST",
      2023,
      43000,
      "MÉDIO",
      "SEM CONTATO",
      "(51) 99111-7812",
      "lucas.pereira@gmail.com",
      "Porto Alegre - RS",
      "18/12/2025",
      "Garantia ativa",
      "Quilometragem próxima da revisão preventiva.",
      "Enviar oferta automática para agendamento.",
    ],

    [
      6,
      "Amanda Souza",
      "Ford Mustang GT",
      2022,
      25000,
      "BAIXO",
      "SEM CONTATO",
      "(85) 99771-6612",
      "amanda.souza@gmail.com",
      "Fortaleza - CE",
      "12/03/2026",
      "Garantia ativa",
      "Cliente realiza revisões regularmente.",
      "Manter relacionamento ativo.",
    ],
  ];

  /*
  |--------------------------------------------------------------------------
  | INSERÇÃO DOS CLIENTES
  |--------------------------------------------------------------------------
  */

  const sqlCliente = `
    INSERT OR IGNORE INTO clientes (
      id,
      nome,
      modelo,
      ano,
      km,
      risco,
      status,
      telefone,
      email,
      cidade,
      ultimaRevisao,
      garantia,
      motivo,
      acao
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  clientes.forEach((cliente) => {
    db.run(
      sqlCliente,
      cliente
    );
  });
});

module.exports = db;