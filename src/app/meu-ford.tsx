import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import {
  atualizarQuilometragem,
  buscarClientePorId,
} from "../services/api";

import {
  buscarUsuarioLogado,
  removerUsuarioLogado,
} from "../services/sessionService";

import { buscarImagemVeiculo } from "../utils/vehicleImages";

export default function MeuFord() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet =
    width >= 768 && width < 1100;

  const [clienteId, setClienteId] =
    useState<string | null>(null);

  const [cliente, setCliente] =
    useState<any>(null);

  const [
    quilometragem,
    setQuilometragem,
  ] = useState(0);

  const [
    novaQuilometragem,
    setNovaQuilometragem,
  ] = useState("");

  const [
    editandoKm,
    setEditandoKm,
  ] = useState(false);

  const [erroKm, setErroKm] =
    useState("");

  const [erroTela, setErroTela] =
    useState("");

  const [carregando, setCarregando] =
    useState(true);

  const [salvandoKm, setSalvandoKm] =
    useState(false);

  useEffect(() => {
    carregarSessao();
  }, []);

  async function carregarSessao() {
    try {
      setCarregando(true);
      setErroTela("");

      const usuario =
        await buscarUsuarioLogado();

      if (
        !usuario ||
        usuario.perfil !== "CLIENTE" ||
        !usuario.clienteId
      ) {
        throw new Error(
          "Sessão do cliente não encontrada."
        );
      }

      const id = String(
        usuario.clienteId
      );

      setClienteId(id);

      await carregarCliente(id);
    } catch (erro: any) {
      console.log(
        "Erro ao carregar sessão do cliente:",
        erro
      );

      setErroTela(
        erro?.message ||
        "Não foi possível carregar seus dados."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function carregarCliente(
    id: string
  ) {
    try {
      setErroKm("");

      const dadosCliente =
        await buscarClientePorId(id);

      const kmAtual = Number(
        dadosCliente.km || 0
      );

      setCliente(dadosCliente);

      setQuilometragem(kmAtual);

      setNovaQuilometragem(
        String(kmAtual)
      );
    } catch (erro: any) {
      console.log(
        "Erro ao carregar cliente:",
        erro
      );

      throw new Error(
        erro?.message ||
        "Não foi possível carregar os dados do veículo."
      );
    }
  }

  async function salvarQuilometragem() {
    if (!clienteId) {
      setErroKm(
        "Cliente não identificado."
      );

      return;
    }

    const apenasNumeros =
      novaQuilometragem.replace(
        /\D/g,
        ""
      );

    const valor = Number(
      apenasNumeros
    );

    if (
      !valor ||
      valor <= 0
    ) {
      setErroKm(
        "Digite uma quilometragem válida."
      );

      return;
    }

    if (
      valor < quilometragem
    ) {
      setErroKm(
        `A quilometragem não pode ser menor que ${quilometragem.toLocaleString(
          "pt-BR"
        )} km.`
      );

      return;
    }

    try {
      setSalvandoKm(true);
      setErroKm("");

      const resposta =
        await atualizarQuilometragem(
          clienteId,
          valor
        );

      const clienteAtualizado =
        resposta.cliente || {
          ...cliente,
          km: valor,
        };

      const kmAtualizado =
        Number(
          clienteAtualizado?.km ??
          valor
        );

      setCliente(
        clienteAtualizado
      );

      setQuilometragem(
        kmAtualizado
      );

      setNovaQuilometragem(
        String(kmAtualizado)
      );

      setEditandoKm(false);
    } catch (erro: any) {
      console.log(
        "Erro ao atualizar quilometragem:",
        erro
      );

      setErroKm(
        erro?.message ||
        "Não foi possível atualizar a quilometragem."
      );
    } finally {
      setSalvandoKm(false);
    }
  }

  function cancelarEdicao() {
    setNovaQuilometragem(
      String(quilometragem)
    );

    setErroKm("");
    setEditandoKm(false);
  }

  async function sair() {
    try {
      await removerUsuarioLogado();
    } catch (erro) {
      console.log(
        "Erro ao encerrar sessão:",
        erro
      );
    }

    router.replace("/");
  }

  if (carregando) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
        />

        <Text
          style={
            styles.loadingTitle
          }
        >
          Meu Ford
        </Text>

        <Text
          style={
            styles.loadingText
          }
        >
          Carregando seu veículo...
        </Text>
      </View>
    );
  }

  if (
    erroTela ||
    !cliente
  ) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <Text
          style={
            styles.errorPageTitle
          }
        >
          Não foi possível abrir o Meu Ford
        </Text>

        <Text
          style={
            styles.loadingText
          }
        >
          {erroTela}
        </Text>

        <TouchableOpacity
          style={
            styles.errorBackButton
          }
          onPress={sair}
        >
          <Text
            style={
              styles.errorBackButtonText
            }
          >
            Voltar ao início
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusCliente =
    String(
      cliente?.status || ""
    ).toUpperCase();

  const clienteRetido =
    statusCliente ===
    "CLIENTE RETIDO";

  const nomeCompleto =
    cliente?.nome ||
    "Cliente Ford";

  const nomeCliente =
    nomeCompleto
      .split(" ")[0];

  const modelo =
    cliente?.modelo ||
    "Ford";

  const ano =
    cliente?.ano || "";

  const ultimaRevisao =
    cliente?.ultimaRevisao ||
    "Não informada";

  const garantia =
    cliente?.garantia ||
    "Não informada";

  const cidade =
    cliente?.cidade ||
    "Não informada";

  const proximaRevisao =
    `${(
      (Math.floor(
        quilometragem / 10000
      ) + 1) *
      10000
    ).toLocaleString(
      "pt-BR"
    )} km`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isMobile &&
        styles.contentMobile,
      ]}
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HEADER */}

      <View
        style={[
          styles.header,
          isMobile &&
          styles.headerMobile,
        ]}
      >
        <View
          style={
            styles.headerLeft
          }
        >
          <View
            style={
              styles.brandRow
            }
          >
            <View
              style={
                styles.brandBadge
              }
            >
              <Text
                style={
                  styles.brandBadgeText
                }
              >
                FORD
              </Text>
            </View>

            <Text
              style={
                styles.brandName
              }
            >
              Meu Ford
            </Text>
          </View>

          <Text
            style={[
              styles.title,
              isMobile &&
              styles.titleMobile,
            ]}
          >
            Olá, {nomeCliente}
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Tudo sobre seu veículo e
            sua jornada de pós-venda em
            um só lugar.
          </Text>
        </View>

        <TouchableOpacity
          style={
            styles.exitButton
          }
          onPress={sair}
        >
          <Text
            style={
              styles.exitButtonText
            }
          >
            Sair
          </Text>
        </TouchableOpacity>
      </View>

      {/* HERO DO VEÍCULO */}

      <View
        style={[
          styles.heroCard,
          isMobile &&
          styles.heroCardMobile,
        ]}
      >
        <View
          style={
            styles.vehicleImageWrapper
          }
        >
          <Image
            source={buscarImagemVeiculo(
              modelo
            )}
            style={[
              styles.vehicleImage,
              isMobile &&
              styles.vehicleImageMobile,
            ]}
            resizeMode="cover"
          />

          <View
            style={
              styles.vehicleOverlay
            }
          />

          <View
            style={
              styles.vehicleHeroContent
            }
          >
            <Text
              style={
                styles.vehicleEyebrow
              }
            >
              SEU FORD
            </Text>

            <Text
              style={[
                styles.vehicleName,
                isMobile &&
                styles.vehicleNameMobile,
              ]}
            >
              {modelo}
            </Text>

            <Text
              style={
                styles.vehicleMeta
              }
            >
              {ano}
              {cidade
                ? `  •  ${cidade}`
                : ""}
            </Text>
          </View>

          <View
            style={[
              styles.vehicleStatus,
              clienteRetido &&
              styles.vehicleStatusOk,
            ]}
          >
            <Text
              style={[
                styles.vehicleStatusText,
                clienteRetido &&
                styles.vehicleStatusTextOk,
              ]}
            >
              {clienteRetido
                ? "VEÍCULO EM DIA"
                : "ACOMPANHAMENTO ATIVO"}
            </Text>
          </View>
        </View>
      </View>

      {/* RESUMO */}

      <View
        style={[
          styles.summaryGrid,
          isMobile &&
          styles.summaryGridMobile,
        ]}
      >
        <View
          style={
            styles.summaryCard
          }
        >
          <Text
            style={
              styles.summaryLabel
            }
          >
            QUILOMETRAGEM
          </Text>

          <Text
            style={
              styles.summaryValue
            }
          >
            {quilometragem.toLocaleString(
              "pt-BR"
            )}{" "}
            km
          </Text>

          <Text
            style={
              styles.summaryDescription
            }
          >
            Informada pelo proprietário
          </Text>

          {!editandoKm && (
            <TouchableOpacity
              style={
                styles.summaryAction
              }
              onPress={() => {
                setNovaQuilometragem(
                  String(
                    quilometragem
                  )
                );

                setErroKm("");
                setEditandoKm(true);
              }}
            >
              <Text
                style={
                  styles.summaryActionText
                }
              >
                Atualizar quilometragem
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={
            styles.summaryCard
          }
        >
          <Text
            style={
              styles.summaryLabel
            }
          >
            PRÓXIMA REVISÃO
          </Text>

          <Text
            style={
              styles.summaryValue
            }
          >
            {proximaRevisao}
          </Text>

          <Text
            style={
              styles.summaryDescription
            }
          >
            Manutenção preventiva
          </Text>
        </View>

        <View
          style={
            styles.summaryCard
          }
        >
          <Text
            style={
              styles.summaryLabel
            }
          >
            ÚLTIMA REVISÃO
          </Text>

          <Text
            style={
              styles.summaryValue
            }
          >
            {ultimaRevisao}
          </Text>

          <Text
            style={
              styles.summaryDescription
            }
          >
            Registro da rede Ford
          </Text>
        </View>

        <View
          style={
            styles.summaryCard
          }
        >
          <Text
            style={
              styles.summaryLabel
            }
          >
            GARANTIA
          </Text>

          <Text
            style={[
              styles.summaryValue,
              styles.summaryValueSmall,
            ]}
          >
            {garantia}
          </Text>

          <Text
            style={
              styles.summaryDescription
            }
          >
            Situação atual do veículo
          </Text>
        </View>
      </View>

      {/* EDITOR KM */}

      {editandoKm && (
        <View
          style={
            styles.mileageEditor
          }
        >
          <View
            style={
              styles.editorHeading
            }
          >
            <Text
              style={
                styles.editorTitle
              }
            >
              Atualizar quilometragem
            </Text>

            <Text
              style={
                styles.editorSubtitle
              }
            >
              Informe a leitura atual do
              odômetro do seu veículo.
            </Text>
          </View>

          <TextInput
            style={
              styles.mileageInput
            }
            value={
              novaQuilometragem
            }
            onChangeText={(
              texto
            ) => {
              setNovaQuilometragem(
                texto
              );

              setErroKm("");
            }}
            keyboardType="numeric"
            placeholder="Ex: 115000"
            placeholderTextColor="#6E829E"
            editable={
              !salvandoKm
            }
          />

          {erroKm !== "" && (
            <Text
              style={
                styles.errorText
              }
            >
              {erroKm}
            </Text>
          )}

          <View
            style={[
              styles.editorButtons,
              isMobile &&
              styles.editorButtonsMobile,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.saveButton,
                salvandoKm &&
                styles.disabledButton,
              ]}
              onPress={
                salvarQuilometragem
              }
              disabled={
                salvandoKm
              }
            >
              {salvandoKm ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  Salvar quilometragem
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.cancelButton
              }
              onPress={
                cancelarEdicao
              }
              disabled={
                salvandoKm
              }
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STATUS */}

      <View
        style={[
          styles.statusSection,
          isMobile &&
          styles.statusSectionMobile,
        ]}
      >
        <View
          style={
            styles.statusContent
          }
        >
          <Text
            style={[
              styles.statusEyebrow,
              clienteRetido &&
              styles.statusEyebrowOk,
            ]}
          >
            {clienteRetido
              ? "PÓS-SERVIÇO"
              : "MANUTENÇÃO"}
          </Text>

          <Text
            style={
              styles.statusTitle
            }
          >
            {clienteRetido
              ? "Seu Ford está em dia"
              : "Sua próxima revisão merece atenção"}
          </Text>

          <Text
            style={
              styles.statusText
            }
          >
            {clienteRetido
              ? "Seu último serviço foi concluído na rede autorizada Ford. Continue acompanhando seu veículo para manter a manutenção sempre em dia."
              : "Seu veículo está próximo do período recomendado para uma nova manutenção preventiva. Agendar antecipadamente ajuda a manter seu Ford sempre preparado."}
          </Text>
        </View>

        <View
          style={[
            styles.statusIndicator,
            clienteRetido &&
            styles.statusIndicatorOk,
          ]}
        >
          <Text
            style={
              styles.statusIndicatorLabel
            }
          >
            STATUS
          </Text>

          <Text
            style={[
              styles.statusIndicatorValue,
              clienteRetido &&
              styles.statusIndicatorValueOk,
            ]}
          >
            {clienteRetido
              ? "Em dia"
              : "Revisão recomendada"}
          </Text>
        </View>
      </View>

      {/* BENEFÍCIO */}

      {clienteRetido ? (
        <View
          style={[
            styles.benefitCard,
            styles.benefitCardOk,
            isMobile &&
            styles.benefitCardMobile,
          ]}
        >
          <View
            style={
              styles.benefitContent
            }
          >
            <Text
              style={[
                styles.benefitTag,
                styles.benefitTagOk,
              ]}
            >
              RELACIONAMENTO FORD
            </Text>

            <Text
              style={
                styles.benefitTitle
              }
            >
              Obrigado por escolher a
              rede autorizada Ford
            </Text>

            <Text
              style={
                styles.benefitText
              }
            >
              Seu serviço foi registrado
              com sucesso. Continue
              acompanhando seus serviços
              e benefícios pelo Meu Ford.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.benefitButton,
              styles.benefitButtonOk,
            ]}
            onPress={() =>
              router.push(
                "/meus-agendamentos"
              )
            }
          >
            <Text
              style={
                styles.benefitButtonText
              }
            >
              Ver meus agendamentos
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={[
            styles.benefitCard,
            isMobile &&
            styles.benefitCardMobile,
          ]}
        >
          <View
            style={
              styles.benefitContent
            }
          >
            <Text
              style={
                styles.benefitTag
              }
            >
              BENEFÍCIO EXCLUSIVO
            </Text>

            <Text
              style={
                styles.benefitTitle
              }
            >
              10% OFF na revisão
              preventiva
            </Text>

            <Text
              style={
                styles.benefitText
              }
            >
              Uma condição personalizada
              para ajudar você a manter
              seu Ford em dia na rede
              autorizada.
            </Text>
          </View>

          <TouchableOpacity
            style={
              styles.benefitButton
            }
            onPress={() =>
              router.push({
                pathname:
                  "/agendamento",
                params: {
                  id:
                    clienteId ||
                    "",
                  origem:
                    "cliente",
                },
              })
            }
          >
            <Text
              style={
                styles.benefitButtonText
              }
            >
              Agendar revisão
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* JORNADA */}

      <View
        style={
          styles.sectionHeader
        }
      >
        <View>
          <Text
            style={
              styles.sectionEyebrow
            }
          >
            SUA JORNADA
          </Text>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Meu relacionamento com a
            Ford
          </Text>
        </View>

        {!isMobile && (
          <Text
            style={
              styles.sectionDescription
            }
          >
            Acompanhe manutenção,
            benefícios e serviços do seu
            veículo.
          </Text>
        )}
      </View>

      <View
        style={[
          styles.cardsGrid,
          (isMobile ||
            isTablet) &&
          styles.cardsGridMobile,
        ]}
      >
        <TouchableOpacity
          style={
            styles.smallCard
          }
          onPress={() =>
            router.push(
              "/historico-revisoes"
            )
          }
        >
          <View
            style={
              styles.cardNumber
            }
          >
            <Text
              style={
                styles.cardNumberText
              }
            >
              01
            </Text>
          </View>

          <Text
            style={
              styles.cardLabel
            }
          >
            MANUTENÇÃO
          </Text>

          <Text
            style={
              styles.smallCardTitle
            }
          >
            Histórico de revisões
          </Text>

          <Text
            style={
              styles.smallCardText
            }
          >
            Consulte os serviços
            registrados para seu veículo
            na rede autorizada Ford.
          </Text>

          <Text
            style={
              styles.cardLink
            }
          >
            Consultar histórico →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.smallCard
          }
          onPress={() =>
            router.push(
              "/meus-beneficios"
            )
          }
        >
          <View
            style={
              styles.cardNumber
            }
          >
            <Text
              style={
                styles.cardNumberText
              }
            >
              02
            </Text>
          </View>

          <Text
            style={
              styles.cardLabel
            }
          >
            BENEFÍCIOS
          </Text>

          <Text
            style={
              styles.smallCardTitle
            }
          >
            Meus benefícios
          </Text>

          <Text
            style={
              styles.smallCardText
            }
          >
            Veja ofertas e vantagens
            personalizadas disponíveis
            para sua jornada Ford.
          </Text>

          <Text
            style={
              styles.cardLink
            }
          >
            Ver benefícios →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.smallCard
          }
          onPress={() =>
            router.push(
              "/meus-agendamentos"
            )
          }
        >
          <View
            style={
              styles.cardNumber
            }
          >
            <Text
              style={
                styles.cardNumberText
              }
            >
              03
            </Text>
          </View>

          <Text
            style={
              styles.cardLabel
            }
          >
            SERVIÇOS
          </Text>

          <Text
            style={
              styles.smallCardTitle
            }
          >
            Meus agendamentos
          </Text>

          <Text
            style={
              styles.smallCardText
            }
          >
            Acompanhe suas próximas
            revisões e os serviços
            agendados para seu veículo.
          </Text>

          <Text
            style={
              styles.cardLink
            }
          >
            Ver agendamentos →
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}

      <View
        style={
          styles.footer
        }
      >
        <View>
          <Text
            style={
              styles.footerBrand
            }
          >
            Ford Retain
          </Text>

          <Text
            style={
              styles.footerText
            }
          >
            Pós-venda inteligente para
            manter você e seu Ford sempre
            conectados.
          </Text>
        </View>

        {!isMobile && (
          <Text
            style={
              styles.footerCustomer
            }
          >
            {nomeCompleto}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#020914",
    },

    loadingContainer: {
      flex: 1,
      backgroundColor:
        "#020914",
      justifyContent:
        "center",
      alignItems: "center",
      gap: 12,
      padding: 24,
    },

    loadingTitle: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "900",
      marginTop: 8,
    },

    loadingText: {
      color: "#8295AF",
      fontSize: 15,
      textAlign: "center",
    },

    errorPageTitle: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "900",
      textAlign: "center",
    },

    errorBackButton: {
      backgroundColor:
        "#0057FF",
      borderRadius: 12,
      paddingVertical: 13,
      paddingHorizontal: 20,
      marginTop: 10,
    },

    errorBackButtonText: {
      color: "#FFFFFF",
      fontWeight: "800",
    },

    content: {
      width: "100%",
      maxWidth: 1320,
      alignSelf: "center",
      paddingHorizontal: 32,
      paddingTop: 28,
      paddingBottom: 46,
    },

    contentMobile: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 32,
    },

    header: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "flex-start",
      gap: 24,
      marginBottom: 26,
    },

    headerMobile: {
      flexDirection: "column",
    },

    headerLeft: {
      flex: 1,
    },

    brandRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 18,
    },

    brandBadge: {
      backgroundColor:
        "#0057FF",
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },

    brandBadgeText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.7,
    },

    brandName: {
      color: "#8EA6C7",
      fontSize: 15,
      fontWeight: "800",
    },

    title: {
      color: "#FFFFFF",
      fontSize: 44,
      fontWeight: "900",
      letterSpacing: -1,
    },

    titleMobile: {
      fontSize: 32,
    },

    subtitle: {
      color: "#8EA0B9",
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      maxWidth: 620,
    },

    exitButton: {
      backgroundColor:
        "#07172D",
      borderWidth: 1,
      borderColor: "#17365E",
      borderRadius: 12,
      paddingVertical: 11,
      paddingHorizontal: 20,
    },

    exitButtonText: {
      color: "#D8E5F7",
      fontSize: 13,
      fontWeight: "800",
    },

    heroCard: {
      width: "100%",
      borderRadius: 28,
      overflow: "hidden",
      marginBottom: 18,
      borderWidth: 1,
      borderColor: "#173458",
      backgroundColor:
        "#07162B",
    },

    heroCardMobile: {
      borderRadius: 20,
    },

    vehicleImageWrapper: {
      position: "relative",
      width: "100%",
      overflow: "hidden",
    },

    vehicleImage: {
      width: "100%",
      height: 430,
    },

    vehicleImageMobile: {
      height: 270,
    },

    vehicleOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        "rgba(1, 8, 20, 0.22)",
    },

    vehicleHeroContent: {
      position: "absolute",
      left: 30,
      bottom: 28,
      right: 30,
    },

    vehicleEyebrow: {
      color: "#FFFFFF",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1,
      marginBottom: 7,
    },

    vehicleName: {
      color: "#FFFFFF",
      fontSize: 36,
      fontWeight: "900",
      letterSpacing: -0.5,
    },

    vehicleNameMobile: {
      fontSize: 25,
    },

    vehicleMeta: {
      color: "#D7E2F1",
      fontSize: 15,
      fontWeight: "600",
      marginTop: 6,
    },

    vehicleStatus: {
      position: "absolute",
      right: 24,
      top: 24,
      backgroundColor:
        "rgba(0, 87, 255, 0.94)",
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 13,
    },

    vehicleStatusOk: {
      backgroundColor:
        "rgba(19, 140, 66, 0.95)",
    },

    vehicleStatusText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.5,
    },

    vehicleStatusTextOk: {
      color: "#FFFFFF",
    },

    summaryGrid: {
      flexDirection: "row",
      gap: 14,
      marginBottom: 18,
    },

    summaryGridMobile: {
      flexDirection: "column",
    },

    summaryCard: {
      flex: 1,
      minHeight: 154,
      backgroundColor:
        "#07172D",
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: "#163456",
    },

    summaryLabel: {
      color: "#6F8BAE",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.8,
      marginBottom: 10,
    },

    summaryValue: {
      color: "#FFFFFF",
      fontSize: 23,
      fontWeight: "900",
    },

    summaryValueSmall: {
      fontSize: 18,
      lineHeight: 24,
    },

    summaryDescription: {
      color: "#71849D",
      fontSize: 12,
      marginTop: 5,
    },

    summaryAction: {
      marginTop: 16,
      alignSelf:
        "flex-start",
    },

    summaryActionText: {
      color: "#4C8DFF",
      fontSize: 12,
      fontWeight: "800",
    },

    mileageEditor: {
      backgroundColor:
        "#07172D",
      borderRadius: 20,
      padding: 22,
      borderWidth: 1,
      borderColor: "#21446D",
      marginBottom: 18,
    },

    editorHeading: {
      marginBottom: 16,
    },

    editorTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
    },

    editorSubtitle: {
      color: "#8EA0B9",
      fontSize: 13,
      marginTop: 5,
    },

    mileageInput: {
      backgroundColor:
        "#030D1B",
      borderWidth: 1,
      borderColor: "#274B75",
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      color: "#FFFFFF",
      fontSize: 16,
      outlineStyle:
        "none",
    } as any,

    errorText: {
      color: "#FF7B7B",
      fontSize: 13,
      marginTop: 9,
    },

    editorButtons: {
      flexDirection: "row",
      gap: 10,
      marginTop: 16,
    },

    editorButtonsMobile: {
      flexDirection: "column",
    },

    saveButton: {
      backgroundColor:
        "#0057FF",
      borderRadius: 12,
      paddingVertical: 13,
      paddingHorizontal: 20,
      alignItems: "center",
    },

    disabledButton: {
      opacity: 0.6,
    },

    saveButtonText: {
      color: "#FFFFFF",
      fontWeight: "800",
    },

    cancelButton: {
      borderWidth: 1,
      borderColor: "#274B75",
      backgroundColor:
        "#07172D",
      borderRadius: 12,
      paddingVertical: 13,
      paddingHorizontal: 20,
      alignItems: "center",
    },

    cancelButtonText: {
      color: "#AFC0D6",
      fontWeight: "800",
    },

    statusSection: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      gap: 28,
      backgroundColor:
        "#07172D",
      borderRadius: 24,
      padding: 28,
      borderWidth: 1,
      borderColor: "#163456",
      marginBottom: 18,
    },

    statusSectionMobile: {
      flexDirection: "column",
      alignItems: "stretch",
    },

    statusContent: {
      flex: 1,
    },

    statusEyebrow: {
      color: "#F6C445",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1,
      marginBottom: 8,
    },

    statusEyebrowOk: {
      color: "#39C66D",
    },

    statusTitle: {
      color: "#FFFFFF",
      fontSize: 25,
      fontWeight: "900",
      marginBottom: 8,
    },

    statusText: {
      color: "#9BAEC6",
      fontSize: 14,
      lineHeight: 22,
      maxWidth: 760,
    },

    statusIndicator: {
      minWidth: 205,
      backgroundColor:
        "#0A1F3B",
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: "#3A351A",
    },

    statusIndicatorOk: {
      borderColor: "#164F31",
    },

    statusIndicatorLabel: {
      color: "#758BA8",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.7,
      marginBottom: 7,
    },

    statusIndicatorValue: {
      color: "#F6C445",
      fontSize: 17,
      fontWeight: "900",
    },

    statusIndicatorValueOk: {
      color: "#39C66D",
    },

    benefitCard: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      gap: 28,
      backgroundColor:
        "#F5F8FC",
      borderRadius: 24,
      padding: 28,
      marginBottom: 34,
    },

    benefitCardMobile: {
      flexDirection: "column",
      alignItems: "stretch",
    },

    benefitCardOk: {
      backgroundColor:
        "#F1FAF4",
    },

    benefitContent: {
      flex: 1,
    },

    benefitTag: {
      color: "#0057FF",
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 0.8,
      marginBottom: 8,
    },

    benefitTagOk: {
      color: "#168B45",
    },

    benefitTitle: {
      color: "#06182E",
      fontSize: 28,
      fontWeight: "900",
      letterSpacing: -0.4,
    },

    benefitText: {
      color: "#5E7087",
      fontSize: 14,
      lineHeight: 22,
      marginTop: 9,
      maxWidth: 720,
    },

    benefitButton: {
      backgroundColor:
        "#0057FF",
      borderRadius: 14,
      paddingVertical: 15,
      paddingHorizontal: 22,
      alignItems: "center",
    },

    benefitButtonOk: {
      backgroundColor:
        "#168B45",
    },

    benefitButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "flex-end",
      gap: 20,
      marginBottom: 18,
    },

    sectionEyebrow: {
      color: "#4C8DFF",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1,
      marginBottom: 5,
    },

    sectionTitle: {
      color: "#FFFFFF",
      fontSize: 26,
      fontWeight: "900",
    },

    sectionDescription: {
      color: "#7F93AD",
      fontSize: 13,
      maxWidth: 320,
      textAlign: "right",
    },

    cardsGrid: {
      flexDirection: "row",
      gap: 14,
    },

    cardsGridMobile: {
      flexDirection: "column",
    },

    smallCard: {
      flex: 1,
      minHeight: 245,
      backgroundColor:
        "#07172D",
      borderRadius: 22,
      padding: 22,
      borderWidth: 1,
      borderColor: "#163456",
    },

    cardNumber: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor:
        "#0B2342",
      justifyContent:
        "center",
      alignItems: "center",
      marginBottom: 26,
    },

    cardNumberText: {
      color: "#4C8DFF",
      fontSize: 11,
      fontWeight: "900",
    },

    cardLabel: {
      color: "#4C8DFF",
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 0.8,
      marginBottom: 8,
    },

    smallCardTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
      marginBottom: 8,
    },

    smallCardText: {
      color: "#8FA3BC",
      fontSize: 13,
      lineHeight: 21,
      flex: 1,
    },

    cardLink: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
      marginTop: 24,
    },

    footer: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      gap: 20,
      marginTop: 34,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: "#132944",
    },

    footerBrand: {
      color: "#4C8DFF",
      fontSize: 16,
      fontWeight: "900",
    },

    footerText: {
      color: "#71859E",
      fontSize: 12,
      marginTop: 4,
    },

    footerCustomer: {
      color: "#71859E",
      fontSize: 12,
      fontWeight: "700",
    },
  });