const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("./database");

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("ERRO: JWT_SECRET não foi definida no arquivo .env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

function autenticarToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      mensagem: "Token de acesso não informado",
    });
  }

  const partes = authorization.split(" ");

  if (
    partes.length !== 2 ||
    partes[0] !== "Bearer"
  ) {
    return res.status(401).json({
      mensagem: "Token de acesso inválido",
    });
  }

  const token = partes[1];

  try {
    const usuario = jwt.verify(
      token,
      JWT_SECRET
    );

    req.usuario = usuario;

    next();
  } catch (erro) {
    return res.status(401).json({
      mensagem:
        "Token inválido ou expirado",
    });
  }
}

/*
|--------------------------------------------------------------------------
| RETAIN SCORE
|--------------------------------------------------------------------------
*/

function converterDataBrasileira(data) {
  if (
    !data ||
    typeof data !== "string"
  ) {
    return null;
  }

  const partes = data.split("/");

  if (partes.length !== 3) {
    return null;
  }

  const dia = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const ano = Number(partes[2]);

  const dataConvertida = new Date(
    ano,
    mes,
    dia
  );

  if (
    Number.isNaN(
      dataConvertida.getTime()
    )
  ) {
    return null;
  }

  return dataConvertida;
}

function calcularMesesDesdeData(data) {
  const dataConvertida =
    converterDataBrasileira(data);

  if (!dataConvertida) {
    return 0;
  }

  const hoje = new Date();

  let meses =
    (hoje.getFullYear() -
      dataConvertida.getFullYear()) *
      12 +
    (hoje.getMonth() -
      dataConvertida.getMonth());

  if (
    hoje.getDate() <
    dataConvertida.getDate()
  ) {
    meses--;
  }

  return Math.max(0, meses);
}

function calcularRetainScore(cliente) {
  let score = 10;

  const fatoresRisco = [];

  const km =
    Number(cliente.km) || 0;

  const mesesSemRevisao =
    calcularMesesDesdeData(
      cliente.ultimaRevisao
    );

  if (km >= 90000) {
    score += 25;

    fatoresRisco.push(
      "Alta quilometragem"
    );
  } else if (km >= 60000) {
    score += 18;

    fatoresRisco.push(
      "Quilometragem elevada"
    );
  } else if (km >= 40000) {
    score += 10;

    fatoresRisco.push(
      "Quilometragem de atenção"
    );
  }

  if (mesesSemRevisao >= 12) {
    score += 30;

    fatoresRisco.push(
      "Mais de 12 meses desde a última revisão"
    );
  } else if (
    mesesSemRevisao >= 8
  ) {
    score += 22;

    fatoresRisco.push(
      "Longo período desde a última revisão"
    );
  } else if (
    mesesSemRevisao >= 5
  ) {
    score += 12;

    fatoresRisco.push(
      "Revisão se aproximando"
    );
  }

  const garantia = String(
    cliente.garantia || ""
  ).toLowerCase();

  if (
    garantia.includes("fora") ||
    garantia.includes("encerrada") ||
    garantia.includes("expirada")
  ) {
    score += 20;

    fatoresRisco.push(
      "Veículo fora da garantia"
    );
  }

  const status = String(
    cliente.status || ""
  ).toUpperCase();

  if (
    status === "SEM CONTATO"
  ) {
    score += 12;

    fatoresRisco.push(
      "Cliente ainda sem contato"
    );
  }

  if (
    status === "REVISÃO AGENDADA"
  ) {
    score -= 20;
  }

  if (
    status === "CLIENTE RETIDO"
  ) {
    score -= 35;
  }

  score = Math.max(
    0,
    Math.min(100, score)
  );

  let classificacao = "BAIXO";

  if (score >= 70) {
    classificacao = "ALTO";
  } else if (score >= 40) {
    classificacao = "MÉDIO";
  }

  let acaoRecomendada =
    "Manter acompanhamento regular do cliente.";

  if (
    classificacao === "ALTO"
  ) {
    acaoRecomendada =
      "Realizar contato prioritário e oferecer benefício para retorno à rede autorizada.";
  } else if (
    classificacao === "MÉDIO"
  ) {
    acaoRecomendada =
      "Enviar lembrete de manutenção e oferta personalizada.";
  }

  if (
    status === "REVISÃO AGENDADA"
  ) {
    acaoRecomendada =
      "Acompanhar o agendamento e manter o relacionamento pós-serviço.";
  }

  if (
    status === "CLIENTE RETIDO"
  ) {
    acaoRecomendada =
      "Cliente retornou à rede autorizada. Manter relacionamento e acompanhamento pós-serviço.";
  }

  return {
    retainScore: score,
    classificacaoRetain:
      classificacao,
    fatoresRisco,
    mesesSemRevisao,
    acaoRecomendada,
  };
}

function adicionarRetainScore(
  cliente
) {
  return {
    ...cliente,
    ...calcularRetainScore(
      cliente
    ),
  };
}

/*
|--------------------------------------------------------------------------
| ROTA PRINCIPAL
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.send(
    "API Ford Retain rodando!"
  );
});

/*
|--------------------------------------------------------------------------
| CONCESSIONÁRIAS
|--------------------------------------------------------------------------
*/

app.get(
  "/concessionarias",
  (req, res) => {
    const concessionarias = [
      "Ford Center Morumbi",
      "Ford Center Norte",
      "Ford Center Tatuapé",
      "Ford Center Santo Amaro",
      "Ford Center Alphaville",
    ];

    res.json(
      concessionarias
    );
  }
);

/*
|--------------------------------------------------------------------------
| USUÁRIOS
|--------------------------------------------------------------------------
*/

app.post(
  "/usuarios",
  async (req, res) => {
    const {
      nome,
      email,
      senha,
    } = req.body;

    if (
      !nome ||
      !email ||
      !senha
    ) {
      return res
        .status(400)
        .json({
          mensagem:
            "Nome, e-mail e senha são obrigatórios",
        });
    }

    const nomeLimpo =
      nome.trim();

    const emailLimpo =
      email
        .trim()
        .toLowerCase();

    if (
      nomeLimpo.length < 3
    ) {
      return res
        .status(400)
        .json({
          mensagem:
            "O nome deve ter pelo menos 3 caracteres",
        });
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailValido.test(
        emailLimpo
      )
    ) {
      return res
        .status(400)
        .json({
          mensagem:
            "Informe um e-mail válido",
        });
    }

    if (
      senha.length < 6
    ) {
      return res
        .status(400)
        .json({
          mensagem:
            "A senha deve ter pelo menos 6 caracteres",
        });
    }

    db.get(
      `
      SELECT id
      FROM usuarios
      WHERE email = ?
      `,
      [emailLimpo],
      async (
        erro,
        usuarioExistente
      ) => {
        if (erro) {
          console.log(
            "Erro ao verificar usuário:",
            erro
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro interno do servidor",
            });
        }

        if (
          usuarioExistente
        ) {
          return res
            .status(409)
            .json({
              mensagem:
                "Este e-mail já está cadastrado",
            });
        }

        try {
          const senhaHash =
            await bcrypt.hash(
              senha,
              10
            );

          db.run(
            `
            INSERT INTO usuarios (
              nome,
              email,
              senha,
              perfil
            )
            VALUES (?, ?, ?, ?)
            `,
            [
              nomeLimpo,
              emailLimpo,
              senhaHash,
              "FUNCIONARIO",
            ],
            function (
              erroInsert
            ) {
              if (
                erroInsert
              ) {
                console.log(
                  "Erro ao cadastrar usuário:",
                  erroInsert
                );

                return res
                  .status(500)
                  .json({
                    mensagem:
                      "Erro ao cadastrar usuário",
                  });
              }

              return res
                .status(201)
                .json({
                  mensagem:
                    "Usuário cadastrado com sucesso",
                  usuario: {
                    id: this.lastID,
                    nome:
                      nomeLimpo,
                    email:
                      emailLimpo,
                    perfil:
                      "FUNCIONARIO",
                  },
                });
            }
          );
        } catch (
          erroHash
        ) {
          console.log(
            "Erro ao proteger senha:",
            erroHash
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro interno do servidor",
            });
        }
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

app.post(
  "/login",
  (req, res) => {
    const {
      email,
      senha,
    } = req.body;

    if (
      !email ||
      !senha
    ) {
      return res
        .status(400)
        .json({
          mensagem:
            "E-mail e senha são obrigatórios",
        });
    }

    const emailLimpo =
      email
        .trim()
        .toLowerCase();

    db.get(
      `
      SELECT
        id,
        nome,
        email,
        senha,
        perfil
      FROM usuarios
      WHERE email = ?
      `,
      [emailLimpo],
      async (
        erro,
        usuario
      ) => {
        if (erro) {
          console.log(
            "Erro no login:",
            erro
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro interno do servidor",
            });
        }

        if (!usuario) {
          return res
            .status(401)
            .json({
              mensagem:
                "E-mail ou senha inválidos",
            });
        }

        try {
          let senhaCorreta =
            false;

          if (
            usuario.senha.startsWith(
              "$2"
            )
          ) {
            senhaCorreta =
              await bcrypt.compare(
                senha,
                usuario.senha
              );
          } else {
            senhaCorreta =
              senha ===
              usuario.senha;
          }

          if (
            !senhaCorreta
          ) {
            return res
              .status(401)
              .json({
                mensagem:
                  "E-mail ou senha inválidos",
              });
          }

          const token =
            jwt.sign(
              {
                id: usuario.id,
                nome:
                  usuario.nome,
                email:
                  usuario.email,
                perfil:
                  usuario.perfil,
              },
              JWT_SECRET,
              {
                expiresIn:
                  "8h",
              }
            );

          return res.json({
            mensagem:
              "Login realizado com sucesso",
            token,
            usuario: {
              id: usuario.id,
              nome:
                usuario.nome,
              email:
                usuario.email,
              perfil:
                usuario.perfil,
            },
          });
        } catch (
          erroComparacao
        ) {
          console.log(
            "Erro ao validar senha:",
            erroComparacao
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro interno do servidor",
            });
        }
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| CLIENTES
|--------------------------------------------------------------------------
*/

app.get(
  "/clientes",
  autenticarToken,
  (req, res) => {
    db.all(
      `
      SELECT *
      FROM clientes
      ORDER BY id
      `,
      [],
      (
        erro,
        clientes
      ) => {
        if (erro) {
          console.log(
            "Erro ao buscar clientes:",
            erro
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro ao buscar clientes",
            });
        }

        const clientesComScore =
          clientes.map(
            adicionarRetainScore
          );

        res.json(
          clientesComScore
        );
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| BUSCAR CLIENTE
|--------------------------------------------------------------------------
*/

app.get(
  "/clientes/:id",
  autenticarToken,
  (req, res) => {
    db.get(
      `
      SELECT *
      FROM clientes
      WHERE id = ?
      `,
      [req.params.id],
      (
        erro,
        cliente
      ) => {
        if (erro) {
          console.log(
            "Erro ao buscar cliente:",
            erro
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro ao buscar cliente",
            });
        }

        if (!cliente) {
          return res
            .status(404)
            .json({
              mensagem:
                "Cliente não encontrado",
            });
        }

        res.json(
          adicionarRetainScore(
            cliente
          )
        );
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| ATUALIZAR STATUS DO CLIENTE
|--------------------------------------------------------------------------
*/

app.put(
  "/clientes/:id/status",
  autenticarToken,
  (req, res) => {
    const { status } =
      req.body;

    if (!status) {
      return res
        .status(400)
        .json({
          mensagem:
            "Status é obrigatório",
        });
    }

    db.run(
      `
      UPDATE clientes
      SET status = ?
      WHERE id = ?
      `,
      [
        status,
        req.params.id,
      ],
      function (erro) {
        if (erro) {
          console.log(
            "Erro ao atualizar status:",
            erro
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro ao atualizar status",
            });
        }

        if (
          this.changes === 0
        ) {
          return res
            .status(404)
            .json({
              mensagem:
                "Cliente não encontrado",
            });
        }

        db.get(
          `
          SELECT *
          FROM clientes
          WHERE id = ?
          `,
          [
            req.params.id,
          ],
          (
            erroBusca,
            clienteAtualizado
          ) => {
            if (
              erroBusca
            ) {
              return res
                .status(500)
                .json({
                  mensagem:
                    "Status atualizado, mas houve erro ao buscar cliente",
                });
            }

            res.json(
              adicionarRetainScore(
                clienteAtualizado
              )
            );
          }
        );
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| ATUALIZAR QUILOMETRAGEM
|--------------------------------------------------------------------------
*/

app.put(
  "/clientes/:id/quilometragem",
  autenticarToken,
  (req, res) => {
    const {
      quilometragem,
    } = req.body;

    if (
      quilometragem ===
        undefined ||
      quilometragem === null
    ) {
      return res
        .status(400)
        .json({
          mensagem:
            "Quilometragem é obrigatória",
        });
    }

    const km = Number(
      quilometragem
    );

    if (
      !Number.isFinite(km) ||
      km <= 0
    ) {
      return res
        .status(400)
        .json({
          mensagem:
            "Informe uma quilometragem válida",
        });
    }

    db.get(
      `
      SELECT *
      FROM clientes
      WHERE id = ?
      `,
      [req.params.id],
      (
        erroBusca,
        cliente
      ) => {
        if (erroBusca) {
          console.log(
            "Erro ao buscar cliente:",
            erroBusca
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro ao buscar cliente",
            });
        }

        if (!cliente) {
          return res
            .status(404)
            .json({
              mensagem:
                "Cliente não encontrado",
            });
        }

        if (
          km <
          Number(
            cliente.km
          )
        ) {
          return res
            .status(400)
            .json({
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
          [
            km,
            req.params.id,
          ],
          function (
            erroUpdate
          ) {
            if (
              erroUpdate
            ) {
              console.log(
                "Erro ao atualizar quilometragem:",
                erroUpdate
              );

              return res
                .status(500)
                .json({
                  mensagem:
                    "Erro ao atualizar quilometragem",
                });
            }

            if (
              this.changes ===
              0
            ) {
              return res
                .status(404)
                .json({
                  mensagem:
                    "Cliente não encontrado",
                });
            }

            db.get(
              `
              SELECT *
              FROM clientes
              WHERE id = ?
              `,
              [
                req.params
                  .id,
              ],
              (
                erroRetorno,
                clienteAtualizado
              ) => {
                if (
                  erroRetorno
                ) {
                  console.log(
                    "Erro ao retornar cliente:",
                    erroRetorno
                  );

                  return res
                    .status(500)
                    .json({
                      mensagem:
                        "Quilometragem atualizada, mas houve erro ao retornar o cliente",
                    });
                }

                return res.json({
                  mensagem:
                    "Quilometragem atualizada com sucesso",
                  cliente:
                    adicionarRetainScore(
                      clienteAtualizado
                    ),
                });
              }
            );
          }
        );
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| AGENDAMENTOS
|--------------------------------------------------------------------------
*/

app.get(
  "/agendamentos",
  autenticarToken,
  (req, res) => {
    db.all(
      `
      SELECT *
      FROM agendamentos
      ORDER BY id
      `,
      [],
      (
        erro,
        agendamentos
      ) => {
        if (erro) {
          console.log(
            "Erro ao buscar agendamentos:",
            erro
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro ao buscar agendamentos",
            });
        }

        res.json(
          agendamentos
        );
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| AGENDAMENTOS DO CLIENTE
|--------------------------------------------------------------------------
*/

app.get(
  "/clientes/:id/agendamentos",
  autenticarToken,
  (req, res) => {
    db.all(
      `
      SELECT *
      FROM agendamentos
      WHERE clienteId = ?
      ORDER BY id DESC
      `,
      [req.params.id],
      (
        erro,
        agendamentos
      ) => {
        if (erro) {
          console.log(
            "Erro ao buscar agendamentos do cliente:",
            erro
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro ao buscar agendamentos do cliente",
            });
        }

        res.json(
          agendamentos
        );
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| CRIAR AGENDAMENTO
|--------------------------------------------------------------------------
*/

app.post(
  "/agendamentos",
  autenticarToken,
  (req, res) => {
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
      return res
        .status(400)
        .json({
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
      (
        erro,
        cliente
      ) => {
        if (erro) {
          console.log(
            "Erro ao buscar cliente:",
            erro
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro ao buscar cliente",
            });
        }

        if (!cliente) {
          return res
            .status(404)
            .json({
              mensagem:
                "Cliente não encontrado",
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
          function (
            erroInsert
          ) {
            if (
              erroInsert
            ) {
              console.log(
                "Erro ao criar agendamento:",
                erroInsert
              );

              return res
                .status(500)
                .json({
                  mensagem:
                    "Erro ao criar agendamento",
                });
            }

            const agendamentoId =
              this.lastID;

            db.run(
              `
              UPDATE clientes
              SET status = ?
              WHERE id = ?
              `,
              [
                "REVISÃO AGENDADA",
                cliente.id,
              ],
              (
                erroStatus
              ) => {
                if (
                  erroStatus
                ) {
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
                  [
                    agendamentoId,
                  ],
                  (
                    erroBusca,
                    novoAgendamento
                  ) => {
                    if (
                      erroBusca
                    ) {
                      return res
                        .status(
                          500
                        )
                        .json({
                          mensagem:
                            "Agendamento criado, mas houve erro ao retornar os dados",
                        });
                    }

                    return res
                      .status(
                        201
                      )
                      .json(
                        novoAgendamento
                      );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| CONCLUIR AGENDAMENTO
|--------------------------------------------------------------------------
*/

app.put(
  "/agendamentos/:id/concluir",
  autenticarToken,
  (req, res) => {
    db.get(
      `
      SELECT *
      FROM agendamentos
      WHERE id = ?
      `,
      [req.params.id],
      (
        erroBusca,
        agendamento
      ) => {
        if (
          erroBusca
        ) {
          console.log(
            "Erro ao buscar agendamento:",
            erroBusca
          );

          return res
            .status(500)
            .json({
              mensagem:
                "Erro ao buscar agendamento",
            });
        }

        if (
          !agendamento
        ) {
          return res
            .status(404)
            .json({
              mensagem:
                "Agendamento não encontrado",
            });
        }

        if (
          String(
            agendamento.status ||
              ""
          ).toUpperCase() ===
          "CONCLUÍDO"
        ) {
          return res
            .status(400)
            .json({
              mensagem:
                "Este agendamento já foi concluído",
            });
        }

        db.run(
          `
          UPDATE agendamentos
          SET status = ?
          WHERE id = ?
          `,
          [
            "CONCLUÍDO",
            req.params.id,
          ],
          function (
            erroUpdateAgendamento
          ) {
            if (
              erroUpdateAgendamento
            ) {
              console.log(
                "Erro ao concluir agendamento:",
                erroUpdateAgendamento
              );

              return res
                .status(500)
                .json({
                  mensagem:
                    "Erro ao concluir agendamento",
                });
            }

            db.run(
              `
              UPDATE clientes
              SET
                status = ?,
                ultimaRevisao = ?
              WHERE id = ?
              `,
              [
                "CLIENTE RETIDO",
                agendamento.data,
                agendamento.clienteId,
              ],
              (
                erroUpdateCliente
              ) => {
                if (
                  erroUpdateCliente
                ) {
                  console.log(
                    "Erro ao atualizar cliente após serviço:",
                    erroUpdateCliente
                  );

                  return res
                    .status(500)
                    .json({
                      mensagem:
                        "Agendamento concluído, mas houve erro ao atualizar o cliente",
                    });
                }

                db.get(
                  `
                  SELECT *
                  FROM clientes
                  WHERE id = ?
                  `,
                  [
                    agendamento.clienteId,
                  ],
                  (
                    erroCliente,
                    clienteAtualizado
                  ) => {
                    if (
                      erroCliente
                    ) {
                      console.log(
                        "Erro ao buscar cliente atualizado:",
                        erroCliente
                      );

                      return res
                        .status(
                          500
                        )
                        .json({
                          mensagem:
                            "Serviço concluído, mas houve erro ao retornar o cliente",
                        });
                    }

                    db.get(
                      `
                      SELECT *
                      FROM agendamentos
                      WHERE id = ?
                      `,
                      [
                        req.params
                          .id,
                      ],
                      (
                        erroAgendamento,
                        agendamentoAtualizado
                      ) => {
                        if (
                          erroAgendamento
                        ) {
                          console.log(
                            "Erro ao buscar agendamento atualizado:",
                            erroAgendamento
                          );

                          return res
                            .status(
                              500
                            )
                            .json({
                              mensagem:
                                "Serviço concluído, mas houve erro ao retornar o agendamento",
                            });
                        }

                        return res.json(
                          {
                            mensagem:
                              "Serviço concluído e cliente retido com sucesso",
                            agendamento:
                              agendamentoAtualizado,
                            cliente:
                              adicionarRetainScore(
                                clienteAtualizado
                              ),
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);

/*
|--------------------------------------------------------------------------
| INICIAR SERVIDOR
|--------------------------------------------------------------------------
*/

app.listen(
  PORT,
  () => {
    console.log(
      `Servidor rodando em http://localhost:${PORT}`
    );
  }
);