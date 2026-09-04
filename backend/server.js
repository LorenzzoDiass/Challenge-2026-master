const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./database");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| ROTA PRINCIPAL
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.send("API Ford Retain rodando!");
});

/*
|--------------------------------------------------------------------------
| CONCESSIONÁRIAS
|--------------------------------------------------------------------------
*/

app.get("/concessionarias", (req, res) => {
  const concessionarias = [
    "Ford Center Morumbi",
    "Ford Center Norte",
    "Ford Center Tatuapé",
    "Ford Center Santo Amaro",
    "Ford Center Alphaville",
  ];

  res.json(concessionarias);
});

/*
|--------------------------------------------------------------------------
| USUÁRIOS
|--------------------------------------------------------------------------
*/

app.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      mensagem: "Nome, e-mail e senha são obrigatórios",
    });
  }

  const nomeLimpo = nome.trim();
  const emailLimpo = email.trim().toLowerCase();

  if (nomeLimpo.length < 3) {
    return res.status(400).json({
      mensagem: "O nome deve ter pelo menos 3 caracteres",
    });
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValido.test(emailLimpo)) {
    return res.status(400).json({
      mensagem: "Informe um e-mail válido",
    });
  }

  if (senha.length < 6) {
    return res.status(400).json({
      mensagem: "A senha deve ter pelo menos 6 caracteres",
    });
  }

  db.get(
    `
    SELECT id
    FROM usuarios
    WHERE email = ?
    `,
    [emailLimpo],
    async (erro, usuarioExistente) => {
      if (erro) {
        console.log("Erro ao verificar usuário:", erro);

        return res.status(500).json({
          mensagem: "Erro interno do servidor",
        });
      }

      if (usuarioExistente) {
        return res.status(409).json({
          mensagem: "Este e-mail já está cadastrado",
        });
      }

      try {
        const senhaHash = await bcrypt.hash(senha, 10);

        db.run(
          `
          INSERT INTO usuarios (
            nome,
            email,
            senha
          )
          VALUES (?, ?, ?)
          `,
          [nomeLimpo, emailLimpo, senhaHash],
          function (erroInsert) {
            if (erroInsert) {
              console.log(
                "Erro ao cadastrar usuário:",
                erroInsert
              );

              return res.status(500).json({
                mensagem: "Erro ao cadastrar usuário",
              });
            }

            return res.status(201).json({
              mensagem: "Usuário cadastrado com sucesso",
              usuario: {
                id: this.lastID,
                nome: nomeLimpo,
                email: emailLimpo,
              },
            });
          }
        );
      } catch (erroHash) {
        console.log("Erro ao proteger senha:", erroHash);

        return res.status(500).json({
          mensagem: "Erro interno do servidor",
        });
      }
    }
  );
});

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios",
    });
  }

  const emailLimpo = email.trim().toLowerCase();

  db.get(
    `
    SELECT id, nome, email, senha
    FROM usuarios
    WHERE email = ?
    `,
    [emailLimpo],
    async (erro, usuario) => {
      if (erro) {
        console.log("Erro no login:", erro);

        return res.status(500).json({
          mensagem: "Erro interno do servidor",
        });
      }

      if (!usuario) {
        return res.status(401).json({
          mensagem: "E-mail ou senha inválidos",
        });
      }

      try {
        let senhaCorreta = false;

        if (usuario.senha.startsWith("$2")) {
          senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
          );
        } else {
          senhaCorreta = senha === usuario.senha;
        }

        if (!senhaCorreta) {
          return res.status(401).json({
            mensagem: "E-mail ou senha inválidos",
          });
        }

        return res.json({
          mensagem: "Login realizado com sucesso",
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
          },
        });
      } catch (erroComparacao) {
        console.log(
          "Erro ao validar senha:",
          erroComparacao
        );

        return res.status(500).json({
          mensagem: "Erro interno do servidor",
        });
      }
    }
  );
});

/*
|--------------------------------------------------------------------------
| CLIENTES
|--------------------------------------------------------------------------
*/

app.get("/clientes", (req, res) => {
  db.all(
    `
    SELECT *
    FROM clientes
    ORDER BY id
    `,
    [],
    (erro, clientes) => {
      if (erro) {
        console.log("Erro ao buscar clientes:", erro);

        return res.status(500).json({
          mensagem: "Erro ao buscar clientes",
        });
      }

      res.json(clientes);
    }
  );
});

/*
|--------------------------------------------------------------------------
| BUSCAR CLIENTE
|--------------------------------------------------------------------------
*/

app.get("/clientes/:id", (req, res) => {
  db.get(
    `
    SELECT *
    FROM clientes
    WHERE id = ?
    `,
    [req.params.id],
    (erro, cliente) => {
      if (erro) {
        console.log("Erro ao buscar cliente:", erro);

        return res.status(500).json({
          mensagem: "Erro ao buscar cliente",
        });
      }

      if (!cliente) {
        return res.status(404).json({
          mensagem: "Cliente não encontrado",
        });
      }

      res.json(cliente);
    }
  );
});

/*
|--------------------------------------------------------------------------
| ATUALIZAR STATUS DO CLIENTE
|--------------------------------------------------------------------------
*/

app.put("/clientes/:id/status", (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      mensagem: "Status é obrigatório",
    });
  }

  db.run(
    `
    UPDATE clientes
    SET status = ?
    WHERE id = ?
    `,
    [status, req.params.id],
    function (erro) {
      if (erro) {
        console.log("Erro ao atualizar status:", erro);

        return res.status(500).json({
          mensagem: "Erro ao atualizar status",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          mensagem: "Cliente não encontrado",
        });
      }

      db.get(
        `
        SELECT *
        FROM clientes
        WHERE id = ?
        `,
        [req.params.id],
        (erroBusca, clienteAtualizado) => {
          if (erroBusca) {
            return res.status(500).json({
              mensagem:
                "Status atualizado, mas houve erro ao buscar cliente",
            });
          }

          res.json(clienteAtualizado);
        }
      );
    }
  );
});

/*
|--------------------------------------------------------------------------
| ATUALIZAR QUILOMETRAGEM
|--------------------------------------------------------------------------
*/

app.put("/clientes/:id/quilometragem", (req, res) => {
  const { quilometragem } = req.body;

  if (
    quilometragem === undefined ||
    quilometragem === null
  ) {
    return res.status(400).json({
      mensagem: "Quilometragem é obrigatória",
    });
  }

  const km = Number(quilometragem);

  if (!Number.isFinite(km) || km <= 0) {
    return res.status(400).json({
      mensagem: "Informe uma quilometragem válida",
    });
  }

  db.get(
    `
    SELECT *
    FROM clientes
    WHERE id = ?
    `,
    [req.params.id],
    (erroBusca, cliente) => {
      if (erroBusca) {
        console.log(
          "Erro ao buscar cliente:",
          erroBusca
        );

        return res.status(500).json({
          mensagem: "Erro ao buscar cliente",
        });
      }

      if (!cliente) {
        return res.status(404).json({
          mensagem: "Cliente não encontrado",
        });
      }

      if (km < Number(cliente.km)) {
        return res.status(400).json({
          mensagem:
            "A nova quilometragem não pode ser menor que a atual",
        });
      }

      db.run(
        `
        UPDATE clientes
        SET km = ?
        WHERE id = ?
        `,
        [km, req.params.id],
        function (erroUpdate) {
          if (erroUpdate) {
            console.log(
              "Erro ao atualizar quilometragem:",
              erroUpdate
            );

            return res.status(500).json({
              mensagem:
                "Erro ao atualizar quilometragem",
            });
          }

          if (this.changes === 0) {
            return res.status(404).json({
              mensagem: "Cliente não encontrado",
            });
          }

          db.get(
            `
            SELECT *
            FROM clientes
            WHERE id = ?
            `,
            [req.params.id],
            (erroRetorno, clienteAtualizado) => {
              if (erroRetorno) {
                console.log(
                  "Erro ao retornar cliente:",
                  erroRetorno
                );

                return res.status(500).json({
                  mensagem:
                    "Quilometragem atualizada, mas houve erro ao retornar o cliente",
                });
              }

              return res.json({
                mensagem:
                  "Quilometragem atualizada com sucesso",
                cliente: clienteAtualizado,
              });
            }
          );
        }
      );
    }
  );
});

/*
|--------------------------------------------------------------------------
| AGENDAMENTOS
|--------------------------------------------------------------------------
*/

app.get("/agendamentos", (req, res) => {
  db.all(
    `
    SELECT *
    FROM agendamentos
    ORDER BY id
    `,
    [],
    (erro, agendamentos) => {
      if (erro) {
        console.log(
          "Erro ao buscar agendamentos:",
          erro
        );

        return res.status(500).json({
          mensagem: "Erro ao buscar agendamentos",
        });
      }

      res.json(agendamentos);
    }
  );
});

/*
|--------------------------------------------------------------------------
| CRIAR AGENDAMENTO
|--------------------------------------------------------------------------
*/

app.post("/agendamentos", (req, res) => {
  const {
    clienteId,
    unidade,
    data,
    horario,
    servico,
    observacao,
  } = req.body;

  if (
    !clienteId ||
    !unidade ||
    !data ||
    !horario ||
    !servico
  ) {
    return res.status(400).json({
      mensagem:
        "Preencha todos os campos obrigatórios",
    });
  }

  db.get(
    `
    SELECT *
    FROM clientes
    WHERE id = ?
    `,
    [clienteId],
    (erro, cliente) => {
      if (erro) {
        console.log("Erro ao buscar cliente:", erro);

        return res.status(500).json({
          mensagem: "Erro ao buscar cliente",
        });
      }

      if (!cliente) {
        return res.status(404).json({
          mensagem: "Cliente não encontrado",
        });
      }

      db.run(
        `
        INSERT INTO agendamentos (
          clienteId,
          cliente,
          veiculo,
          unidade,
          data,
          horario,
          servico,
          observacao,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          cliente.id,
          cliente.nome,
          cliente.modelo,
          unidade,
          data,
          horario,
          servico,
          observacao,
          "Confirmado",
        ],
        function (erroInsert) {
          if (erroInsert) {
            console.log(
              "Erro ao criar agendamento:",
              erroInsert
            );

            return res.status(500).json({
              mensagem:
                "Erro ao criar agendamento",
            });
          }

          const agendamentoId = this.lastID;

          db.run(
            `
            UPDATE clientes
            SET status = ?
            WHERE id = ?
            `,
            ["REVISÃO AGENDADA", cliente.id],
            (erroStatus) => {
              if (erroStatus) {
                console.log(
                  "Erro ao atualizar status do cliente:",
                  erroStatus
                );
              }

              db.get(
                `
                SELECT *
                FROM agendamentos
                WHERE id = ?
                `,
                [agendamentoId],
                (
                  erroBusca,
                  novoAgendamento
                ) => {
                  if (erroBusca) {
                    return res.status(500).json({
                      mensagem:
                        "Agendamento criado, mas houve erro ao retornar os dados",
                    });
                  }

                  res
                    .status(201)
                    .json(novoAgendamento);
                }
              );
            }
          );
        }
      );
    }
  );
});

/*
|--------------------------------------------------------------------------
| INICIAR SERVIDOR
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );
});