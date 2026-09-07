import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { buscarClientes } from "../services/api";
import {
  buscarUsuarioLogado,
  removerUsuarioLogado,
  UsuarioLogado,
} from "../services/sessionService";

export default function Dashboard() {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  const [clientes, setClientes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [mostrarLeads, setMostrarLeads] = useState(false);
  const [filtroLeads, setFiltroLeads] = useState("TODOS");

  async function carregarClientes() {
    try {
      setCarregando(true);
      const dados = await buscarClientes();
      setClientes(dados);
    } catch (erro) {
      console.log("Erro ao buscar clientes:", erro);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarUsuario() {
    try {
      const usuarioSalvo = await buscarUsuarioLogado();

      if (usuarioSalvo) {
        setUsuario(usuarioSalvo);
      } else {
        setUsuario({
          id: 1,
          nome: "Equipe Pós-venda Ford",
          email: "funcionario@fordretain.com",
        });
      }
    } catch (erro) {
      console.log("Erro ao carregar usuário:", erro);

      setUsuario({
        id: 1,
        nome: "Equipe Pós-venda Ford",
        email: "funcionario@fordretain.com",
      });
    }
  }

  async function sair() {
    try {
      await removerUsuarioLogado();
      router.replace("/");
    } catch (erro) {
      console.log("Erro ao sair da conta:", erro);
      router.replace("/");
    }
  }

  useEffect(() => {
    carregarClientes();
    carregarUsuario();
  }, []);

  const alto = clientes.filter(
    (cliente) => cliente.classificacaoRetain === "ALTO"
  ).length;

  const medio = clientes.filter(
    (cliente) => cliente.classificacaoRetain === "MÉDIO"
  ).length;

  const baixo = clientes.filter(
    (cliente) => cliente.classificacaoRetain === "BAIXO"
  ).length;

  const clientesOrdenados = [...clientes].sort(
    (a, b) =>
      Number(b.retainScore || 0) -
      Number(a.retainScore || 0)
  );

  const clientesPrioritarios = clientesOrdenados.filter(
    (cliente) =>
      cliente.classificacaoRetain === "ALTO" ||
      cliente.classificacaoRetain === "MÉDIO"
  );

  const clientesFiltrados = clientesOrdenados.filter(
    (cliente) => {
      if (filtroLeads === "TODOS") {
        return (
          cliente.classificacaoRetain === "ALTO" ||
          cliente.classificacaoRetain === "MÉDIO"
        );
      }

      if (filtroLeads === "ALTO") {
        return cliente.classificacaoRetain === "ALTO";
      }

      if (filtroLeads === "MÉDIO") {
        return cliente.classificacaoRetain === "MÉDIO";
      }

      if (filtroLeads === "BAIXO") {
        return cliente.classificacaoRetain === "BAIXO";
      }

      if (filtroLeads === "AGENDADO") {
        return cliente.status === "REVISÃO AGENDADA";
      }

      return true;
    }
  );

  const leadsVisiveis = clientesFiltrados.slice(0, 5);

  function estiloBadge(risco: string) {
    if (risco === "ALTO") return styles.dangerBadge;
    if (risco === "MÉDIO") return styles.warningBadge;
    return styles.safeBadge;
  }

  function filtroAtivo(filtro: string) {
    return filtroLeads === filtro;
  }

  return (
    <ImageBackground
      source={require("../assets/images/deshboard.bg.png")}
      style={[
        styles.container,
        {
          width,
          minHeight: height,
        },
      ]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isMobile && styles.scrollContentMobile,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.header,
            isMobile && styles.headerMobile,
          ]}
        >
          <View
            style={[
              styles.headerTop,
              isMobile && styles.headerTopMobile,
            ]}
          >
            <View
              style={[
                styles.brandArea,
                isMobile && styles.brandAreaMobile,
              ]}
            >
              <Image
                source={require("../assets/images/logo.fordd.png")}
                style={[
                  styles.headerLogo,
                  isMobile && styles.headerLogoMobile,
                ]}
                resizeMode="contain"
              />

              <View style={styles.brandTextArea}>
                <Text
                  style={[
                    styles.productName,
                    isMobile && styles.productNameMobile,
                  ]}
                >
                  Ford Retain
                </Text>

                <Text
                  style={[
                    styles.subtitle,
                    isMobile && styles.subtitleMobile,
                  ]}
                >
                  Inteligência de pós-venda e retenção
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.userArea,
                isMobile && styles.userAreaMobile,
              ]}
            >
              <View style={styles.userStatusWrapper}>
                <View style={styles.statusDot} />

                <Text style={styles.userStatusText}>
                  Sessão ativa
                </Text>
              </View>

              <Text
                style={[
                  styles.userName,
                  isMobile && styles.userNameMobile,
                ]}
              >
                {usuario?.nome || "Equipe Pós-venda Ford"}
              </Text>

              <View
                style={[
                  styles.emailBox,
                  isMobile && styles.emailBoxMobile,
                ]}
              >
                <Text
                  style={[
                    styles.userEmail,
                    isMobile && styles.userEmailMobile,
                  ]}
                >
                  {usuario?.email ||
                    "funcionario@fordretain.com"}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.headerButtons,
              isMobile && styles.headerButtonsMobile,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.headerButton,
                isMobile && styles.headerButtonMobile,
              ]}
              onPress={carregarClientes}
            >
              <Text style={styles.headerButtonText}>
                Atualizar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.logoutButton,
                isMobile && styles.headerButtonMobile,
              ]}
              onPress={sair}
            >
              <Text style={styles.logoutButtonText}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerDivider} />

        {carregando ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              Carregando dados...
            </Text>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.cardsContainer,
                (isMobile || isTablet) &&
                  styles.cardsContainerStack,
              ]}
            >
              <View
                style={[
                  styles.card,
                  styles.redCard,
                ]}
              >
                <View style={styles.cardHeaderLine}>
                  <View
                    style={[
                      styles.riskIndicator,
                      styles.redIndicator,
                    ]}
                  />

                  <Text style={styles.cardLabel}>
                    Alto risco
                  </Text>
                </View>

                <Text
                  style={[
                    styles.cardNumber,
                    isMobile && styles.cardNumberMobile,
                  ]}
                >
                  {alto}
                </Text>

                <Text style={styles.cardDescription}>
                  Clientes com Retain Score crítico
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  styles.yellowCard,
                ]}
              >
                <View style={styles.cardHeaderLine}>
                  <View
                    style={[
                      styles.riskIndicator,
                      styles.yellowIndicator,
                    ]}
                  />

                  <Text style={styles.cardLabel}>
                    Médio risco
                  </Text>
                </View>

                <Text
                  style={[
                    styles.cardNumber,
                    isMobile && styles.cardNumberMobile,
                  ]}
                >
                  {medio}
                </Text>

                <Text style={styles.cardDescription}>
                  Clientes que precisam de acompanhamento
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  styles.greenCard,
                ]}
              >
                <View style={styles.cardHeaderLine}>
                  <View
                    style={[
                      styles.riskIndicator,
                      styles.greenIndicator,
                    ]}
                  />

                  <Text style={styles.cardLabel}>
                    Baixo risco
                  </Text>
                </View>

                <Text
                  style={[
                    styles.cardNumber,
                    isMobile && styles.cardNumberMobile,
                  ]}
                >
                  {baixo}
                </Text>

                <Text style={styles.cardDescription}>
                  Clientes em situação saudável
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.section,
                isMobile && styles.sectionMobile,
              ]}
            >
              <View
                style={[
                  styles.sectionHeader,
                  isMobile && styles.sectionHeaderMobile,
                ]}
              >
                <View style={styles.sectionTitleArea}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isMobile && styles.sectionTitleMobile,
                    ]}
                  >
                    Leads de retenção
                  </Text>

                  <Text style={styles.sectionSubtitle}>
                    Clientes priorizados automaticamente pelo
                    Ford Retain Score
                  </Text>
                </View>

                <View
                  style={[
                    styles.leadsHeaderActions,
                    isMobile &&
                      styles.leadsHeaderActionsMobile,
                  ]}
                >
                  <View style={styles.priorityCount}>
                    <Text
                      style={styles.priorityCountNumber}
                    >
                      {clientesPrioritarios.length}
                    </Text>

                    <Text
                      style={styles.priorityCountText}
                    >
                      em atenção
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.toggleLeadsButton}
                    onPress={() =>
                      setMostrarLeads(!mostrarLeads)
                    }
                  >
                    <Text
                      style={styles.toggleLeadsButtonText}
                    >
                      {mostrarLeads
                        ? "Ocultar leads"
                        : "Ver leads"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {mostrarLeads && (
                <>
                  <View style={styles.leadsDivider} />

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={
                      styles.filtersContainer
                    }
                  >
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        filtroAtivo("TODOS") &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() =>
                        setFiltroLeads("TODOS")
                      }
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          filtroAtivo("TODOS") &&
                            styles.filterButtonTextActive,
                        ]}
                      >
                        Todos
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        filtroAtivo("ALTO") &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() =>
                        setFiltroLeads("ALTO")
                      }
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          filtroAtivo("ALTO") &&
                            styles.filterButtonTextActive,
                        ]}
                      >
                        Alto risco
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        filtroAtivo("MÉDIO") &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() =>
                        setFiltroLeads("MÉDIO")
                      }
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          filtroAtivo("MÉDIO") &&
                            styles.filterButtonTextActive,
                        ]}
                      >
                        Médio risco
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        filtroAtivo("BAIXO") &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() =>
                        setFiltroLeads("BAIXO")
                      }
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          filtroAtivo("BAIXO") &&
                            styles.filterButtonTextActive,
                        ]}
                      >
                        Baixo risco
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        filtroAtivo("AGENDADO") &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() =>
                        setFiltroLeads("AGENDADO")
                      }
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          filtroAtivo("AGENDADO") &&
                            styles.filterButtonTextActive,
                        ]}
                      >
                        Revisão agendada
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>

                  <View style={styles.resultsHeader}>
                    <Text style={styles.resultsText}>
                      {clientesFiltrados.length} resultado
                      {clientesFiltrados.length === 1
                        ? ""
                        : "s"}
                    </Text>
                  </View>

                  {leadsVisiveis.length === 0 ? (
                    <View style={styles.emptyLeads}>
                      <Text
                        style={styles.emptyLeadsTitle}
                      >
                        Nenhum cliente encontrado
                      </Text>

                      <Text
                        style={styles.emptyLeadsText}
                      >
                        Não existem clientes para este
                        filtro no momento.
                      </Text>
                    </View>
                  ) : (
                    leadsVisiveis.map((cliente) => (
                      <View
                        key={cliente.id}
                        style={[
                          styles.clientCard,
                          isMobile &&
                            styles.clientCardMobile,
                        ]}
                      >
                        <View style={styles.clientMain}>
                          <View style={styles.clientTop}>
                            <View
                              style={
                                styles.clientInfoWrapper
                              }
                            >
                              <Text
                                style={styles.clientName}
                              >
                                {cliente.nome}
                              </Text>

                              <Text
                                style={styles.clientInfo}
                              >
                                {cliente.modelo} •{" "}
                                {Number(
                                  cliente.km
                                ).toLocaleString("pt-BR")}{" "}
                                km
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.scoreArea,
                                isMobile &&
                                  styles.scoreAreaMobile,
                              ]}
                            >
                              <View
                                style={estiloBadge(
                                  cliente.classificacaoRetain
                                )}
                              >
                                <Text
                                  style={styles.badgeText}
                                >
                                  {
                                    cliente.classificacaoRetain
                                  }
                                </Text>
                              </View>

                              <View style={styles.scoreBox}>
                                <Text
                                  style={styles.scoreLabel}
                                >
                                  RETAIN SCORE
                                </Text>

                                <Text
                                  style={styles.scoreValue}
                                >
                                  {cliente.retainScore}%
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View
                            style={styles.clientDivider}
                          />

                          <Text style={styles.detailLabel}>
                            Fatores de risco
                          </Text>

                          <View
                            style={
                              styles.factorsContainer
                            }
                          >
                            {cliente.fatoresRisco
                              ?.length > 0 ? (
                              cliente.fatoresRisco.map(
                                (
                                  fator: string,
                                  index: number
                                ) => (
                                  <View
                                    key={`${cliente.id}-${index}`}
                                    style={
                                      styles.factorBadge
                                    }
                                  >
                                    <Text
                                      style={
                                        styles.factorText
                                      }
                                    >
                                      {fator}
                                    </Text>
                                  </View>
                                )
                              )
                            ) : (
                              <Text
                                style={
                                  styles.noFactorsText
                                }
                              >
                                Nenhum fator crítico
                                identificado
                              </Text>
                            )}
                          </View>

                          <View style={styles.actionBox}>
                            <View
                              style={styles.actionContent}
                            >
                              <Text
                                style={styles.actionLabel}
                              >
                                Ação recomendada
                              </Text>

                              <Text
                                style={styles.actionText}
                              >
                                {cliente.acaoRecomendada}
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={
                                styles.viewClientButton
                              }
                              onPress={() =>
                                router.push({
                                  pathname: "/detalhes",
                                  params: {
                                    id: String(
                                      cliente.id
                                    ),
                                  },
                                })
                              }
                            >
                              <Text
                                style={
                                  styles.viewClientButtonText
                                }
                              >
                                Ver cliente
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))
                  )}

                  {clientesFiltrados.length > 5 && (
                    <View
                      style={styles.moreLeadsArea}
                    >
                      <Text
                        style={styles.moreLeadsText}
                      >
                        Exibindo os 5 resultados com maior
                        Retain Score
                      </Text>

                      <TouchableOpacity
                        style={styles.allClientsButton}
                        onPress={() =>
                          router.push("/clientes")
                        }
                      >
                        <Text
                          style={
                            styles.allClientsButtonText
                          }
                        >
                          Ver todos os resultados
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>

            <View
              style={[
                styles.buttonsContainer,
                isMobile && styles.buttonsMobile,
              ]}
            >
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  router.push("/agendamentos")
                }
              >
                <Text
                  style={styles.secondaryButtonText}
                >
                  Ver Agendamentos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() =>
                  router.push("/clientes")
                }
              >
                <Text
                  style={styles.primaryButtonText}
                >
                  Ver Todos os Clientes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  router.push("/analytics")
                }
              >
                <Text
                  style={styles.secondaryButtonText}
                >
                  Ver Analytics & IA
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B18",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 8, 20, 0.80)",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 38,
    paddingTop: 28,
    paddingBottom: 60,
    width: "100%",
  },
  scrollContentMobile: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    zIndex: 2,
  },
  headerMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 16,
  },
  headerTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 28,
  },
  headerTopMobile: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  brandArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    flex: 1,
  },
  brandAreaMobile: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
    minWidth: 0,
  },
  headerLogo: {
    width: 145,
    height: 62,
  },
  headerLogoMobile: {
    width: 130,
    height: 52,
  },
  brandTextArea: {
    justifyContent: "center",
  },
  productName: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  productNameMobile: {
    fontSize: 23,
  },
  subtitle: {
    color: "#93A8C3",
    fontSize: 15,
    lineHeight: 21,
  },
  subtitleMobile: {
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 190,
  },
  userArea: {
    alignItems: "flex-end",
    minWidth: 215,
  },
  userAreaMobile: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-end",
    paddingTop: 4,
  },
  userStatusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#42D982",
  },
  userStatusText: {
    color: "#7F96B3",
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    marginBottom: 7,
    textAlign: "right",
  },
  userNameMobile: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 5,
    textAlign: "right",
  },
  emailBox: {
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  emailBoxMobile: {
    alignSelf: "flex-end",
    maxWidth: "100%",
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  userEmail: {
    color: "#AFC0D4",
    fontSize: 12,
    lineHeight: 17,
  },
  userEmailMobile: {
    fontSize: 9,
    lineHeight: 13,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  headerButtonsMobile: {
    width: "100%",
  },
  headerButton: {
    backgroundColor: "rgba(0, 87, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(70, 129, 255, 0.75)",
    paddingVertical: 11,
    paddingHorizontal: 21,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonMobile: {
    flex: 1,
  },
  headerButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    paddingVertical: 11,
    paddingHorizontal: 21,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#C8D4E3",
    fontWeight: "700",
    fontSize: 13,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.075)",
    marginTop: 24,
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 30,
    zIndex: 2,
    width: "100%",
  },
  cardsContainerStack: {
    flexDirection: "column",
  },
  card: {
    flex: 1,
    borderRadius: 22,
    padding: 24,
    backgroundColor: "rgba(9, 19, 36, 0.88)",
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 7,
  },
  redCard: {
    borderColor: "rgba(255, 59, 48, 0.45)",
  },
  yellowCard: {
    borderColor: "rgba(255, 184, 0, 0.45)",
  },
  greenCard: {
    borderColor: "rgba(30, 215, 96, 0.40)",
  },
  cardHeaderLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  riskIndicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  redIndicator: {
    backgroundColor: "#FF4D45",
  },
  yellowIndicator: {
    backgroundColor: "#FFB800",
  },
  greenIndicator: {
    backgroundColor: "#1ED760",
  },
  cardLabel: {
    color: "#E8EEF6",
    fontSize: 16,
    fontWeight: "700",
  },
  cardNumber: {
    color: "#FFFFFF",
    fontSize: 54,
    fontWeight: "900",
    marginBottom: 8,
  },
  cardNumberMobile: {
    fontSize: 42,
  },
  cardDescription: {
    color: "#93A8C3",
    fontSize: 14,
    lineHeight: 21,
  },
  section: {
    backgroundColor: "rgba(9, 19, 36, 0.88)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    zIndex: 2,
    borderWidth: 1,
    borderColor: "rgba(101, 137, 187, 0.18)",
  },
  sectionMobile: {
    padding: 18,
    borderRadius: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  sectionHeaderMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  sectionTitleArea: {
    flex: 1,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 6,
  },
  sectionTitleMobile: {
    fontSize: 20,
  },
  sectionSubtitle: {
    color: "#8195AF",
    fontSize: 13,
    lineHeight: 19,
  },
  leadsHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  leadsHeaderActionsMobile: {
    width: "100%",
    marginTop: 14,
  },
  priorityCount: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 7,
    backgroundColor: "rgba(0, 87, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(0, 87, 255, 0.24)",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  priorityCountNumber: {
    color: "#65A0FF",
    fontSize: 18,
    fontWeight: "900",
  },
  priorityCountText: {
    color: "#9CB0C9",
    fontSize: 11,
    fontWeight: "700",
  },
  toggleLeadsButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleLeadsButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  leadsDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    marginTop: 22,
    marginBottom: 18,
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 9,
    paddingBottom: 17,
  },
  filterButton: {
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  filterButtonActive: {
    backgroundColor: "rgba(0,87,255,0.18)",
    borderColor: "#0057FF",
  },
  filterButtonText: {
    color: "#91A5BE",
    fontSize: 12,
    fontWeight: "700",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  resultsHeader: {
    marginBottom: 12,
  },
  resultsText: {
    color: "#7489A6",
    fontSize: 11,
    fontWeight: "700",
  },
  clientCard: {
    backgroundColor: "rgba(18, 31, 50, 0.84)",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.055)",
  },
  clientCardMobile: {
    padding: 16,
  },
  clientMain: {
    width: "100%",
  },
  clientTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    flexWrap: "wrap",
  },
  clientInfoWrapper: {
    flex: 1,
    minWidth: 200,
  },
  clientName: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 5,
  },
  clientInfo: {
    color: "#90A5BF",
    fontSize: 14,
  },
  scoreArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scoreAreaMobile: {
    width: "100%",
    justifyContent: "space-between",
  },
  dangerBadge: {
    backgroundColor: "rgba(255, 59, 48, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.55)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  warningBadge: {
    backgroundColor: "rgba(255, 184, 0, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(255, 184, 0, 0.50)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  safeBadge: {
    backgroundColor: "rgba(30, 215, 96, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(30, 215, 96, 0.45)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  scoreBox: {
    minWidth: 105,
    alignItems: "flex-end",
  },
  scoreLabel: {
    color: "#7489A6",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  scoreValue: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
  },
  clientDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    marginVertical: 16,
  },
  detailLabel: {
    color: "#8297B2",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  factorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  factorBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.045)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 9,
  },
  factorText: {
    color: "#B7C7DA",
    fontSize: 12,
    fontWeight: "600",
  },
  noFactorsText: {
    color: "#8297B2",
    fontSize: 13,
  },
  actionBox: {
    backgroundColor: "rgba(0, 87, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(0, 87, 255, 0.16)",
    borderRadius: 13,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  actionContent: {
    flex: 1,
    minWidth: 220,
  },
  actionLabel: {
    color: "#5F96F0",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 5,
  },
  actionText: {
    color: "#C6D4E5",
    fontSize: 13,
    lineHeight: 19,
  },
  viewClientButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 11,
    paddingHorizontal: 17,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  viewClientButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyLeads: {
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: 22,
  },
  emptyLeadsTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5,
  },
  emptyLeadsText: {
    color: "#8195AF",
    fontSize: 13,
  },
  moreLeadsArea: {
    marginTop: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.07)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  moreLeadsText: {
    color: "#8195AF",
    fontSize: 12,
  },
  allClientsButton: {
    borderWidth: 1,
    borderColor: "rgba(68, 126, 226, 0.60)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  allClientsButtonText: {
    color: "#DCE8F8",
    fontSize: 12,
    fontWeight: "800",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  buttonsMobile: {
    flexDirection: "column",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#0057FF",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0057FF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.26,
    shadowRadius: 15,
    elevation: 9,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(8, 24, 48, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(68, 126, 226, 0.60)",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#DCE8F8",
    fontWeight: "800",
    fontSize: 16,
  },
});