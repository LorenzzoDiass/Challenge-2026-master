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

  const [usuario, setUsuario] =
    useState<UsuarioLogado | null>(null);

  /*
  |--------------------------------------------------------------------------
  | CARREGAR CLIENTES
  |--------------------------------------------------------------------------
  */

  async function carregarClientes() {
    try {
      setCarregando(true);

      const dados = await buscarClientes();

      setClientes(dados);
    } catch (erro) {
      console.log(
        "Erro ao buscar clientes:",
        erro
      );
    } finally {
      setCarregando(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CARREGAR USUÁRIO
  |--------------------------------------------------------------------------
  */

  async function carregarUsuario() {
    try {
      const usuarioSalvo =
        await buscarUsuarioLogado();

      if (usuarioSalvo) {
        setUsuario(usuarioSalvo);
      } else {
        /*
         * Usuário padrão temporário.
         * Quando conectarmos o login ao AsyncStorage,
         * os dados reais do login aparecerão aqui.
         */
        setUsuario({
          id: 1,
          nome: "Equipe Pós-venda Ford",
          email: "admin@ford.com",
        });
      }
    } catch (erro) {
      console.log(
        "Erro ao carregar usuário:",
        erro
      );

      setUsuario({
        id: 1,
        nome: "Equipe Pós-venda Ford",
        email: "admin@ford.com",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SAIR
  |--------------------------------------------------------------------------
  */

  async function sair() {
    try {
      await removerUsuarioLogado();

      router.replace("/");
    } catch (erro) {
      console.log(
        "Erro ao sair da conta:",
        erro
      );

      router.replace("/");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CARREGAMENTO INICIAL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    carregarClientes();
    carregarUsuario();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CONTADORES
  |--------------------------------------------------------------------------
  */

  const alto = clientes.filter(
    (cliente) => cliente.risco === "ALTO"
  ).length;

  const medio = clientes.filter(
    (cliente) => cliente.risco === "MÉDIO"
  ).length;

  const baixo = clientes.filter(
    (cliente) => cliente.risco === "BAIXO"
  ).length;

  const clientesPrioritarios =
    clientes.filter(
      (cliente) =>
        cliente.risco === "ALTO" ||
        cliente.risco === "MÉDIO"
    );

  /*
  |--------------------------------------------------------------------------
  | TELA
  |--------------------------------------------------------------------------
  */

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
          isMobile &&
            styles.scrollContentMobile,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}

        <View
          style={[
            styles.header,
            isMobile && styles.headerMobile,
          ]}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.fordd.png")}
              style={[
                styles.headerLogo,
                isMobile &&
                  styles.headerLogoMobile,
              ]}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.subtitle,
                isMobile &&
                  styles.subtitleMobile,
              ]}
            >
              Painel inteligente de retenção
              pós-venda
            </Text>
          </View>

          <View
            style={[
              styles.headerRight,
              isMobile &&
                styles.headerRightMobile,
            ]}
          >
            {/* HUB DO USUÁRIO */}

            <View
              style={[
                styles.userHub,
                isMobile &&
                  styles.userHubMobile,
              ]}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {usuario?.nome
                    ?.charAt(0)
                    .toUpperCase() || "F"}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userLabel}>
                  USUÁRIO CONECTADO
                </Text>

                <Text
                  style={styles.userName}
                  numberOfLines={1}
                >
                  {usuario?.nome ||
                    "Equipe Pós-venda Ford"}
                </Text>

                <Text
                  style={styles.userEmail}
                  numberOfLines={1}
                >
                  {usuario?.email ||
                    "admin@ford.com"}
                </Text>
              </View>
            </View>

            {/* BOTÕES DO HEADER */}

            <View
              style={[
                styles.headerButtons,
                isMobile &&
                  styles.headerButtonsMobile,
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.headerButton,
                  isMobile &&
                    styles.headerButtonMobile,
                ]}
                onPress={carregarClientes}
              >
                <Text
                  style={
                    styles.headerButtonText
                  }
                >
                  Atualizar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  isMobile &&
                    styles.headerButtonMobile,
                ]}
                onPress={sair}
              >
                <Text
                  style={styles.logoutButtonText}
                >
                  Sair
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CONTEÚDO */}

        {carregando ? (
          <View
            style={styles.loadingContainer}
          >
            <Text style={styles.loadingText}>
              Carregando dados...
            </Text>
          </View>
        ) : (
          <>
            {/* CARDS DE RISCO */}

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
                <Text style={styles.cardLabel}>
                  Alto risco
                </Text>

                <Text
                  style={[
                    styles.cardNumber,
                    isMobile &&
                      styles.cardNumberMobile,
                  ]}
                >
                  {alto}
                </Text>

                <Text
                  style={
                    styles.cardDescription
                  }
                >
                  Clientes precisam de atenção
                  imediata
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  styles.yellowCard,
                ]}
              >
                <Text style={styles.cardLabel}>
                  Médio risco
                </Text>

                <Text
                  style={[
                    styles.cardNumber,
                    isMobile &&
                      styles.cardNumberMobile,
                  ]}
                >
                  {medio}
                </Text>

                <Text
                  style={
                    styles.cardDescription
                  }
                >
                  Clientes próximos da revisão
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  styles.greenCard,
                ]}
              >
                <Text style={styles.cardLabel}>
                  Baixo risco
                </Text>

                <Text
                  style={[
                    styles.cardNumber,
                    isMobile &&
                      styles.cardNumberMobile,
                  ]}
                >
                  {baixo}
                </Text>

                <Text
                  style={
                    styles.cardDescription
                  }
                >
                  Clientes em situação saudável
                </Text>
              </View>
            </View>

            {/* CLIENTES PRIORITÁRIOS */}

            <View
              style={[
                styles.section,
                isMobile &&
                  styles.sectionMobile,
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  isMobile &&
                    styles.sectionTitleMobile,
                ]}
              >
                Clientes com maior risco de
                abandono
              </Text>

              {clientesPrioritarios.map(
                (cliente) => (
                  <View
                    key={cliente.id}
                    style={[
                      styles.clientCard,
                      isMobile &&
                        styles.clientCardMobile,
                    ]}
                  >
                    <View
                      style={
                        styles.clientInfoWrapper
                      }
                    >
                      <Text
                        style={
                          styles.clientName
                        }
                      >
                        {cliente.nome}
                      </Text>

                      <Text
                        style={
                          styles.clientInfo
                        }
                      >
                        {cliente.modelo} •{" "}
                        {cliente.km.toLocaleString(
                          "pt-BR"
                        )}{" "}
                        km
                      </Text>
                    </View>

                    <View
                      style={
                        cliente.risco ===
                        "ALTO"
                          ? styles.dangerBadge
                          : styles.warningBadge
                      }
                    >
                      <Text
                        style={
                          styles.badgeText
                        }
                      >
                        {cliente.risco}
                      </Text>
                    </View>
                  </View>
                )
              )}
            </View>

            {/* NAVEGAÇÃO */}

            <View
              style={[
                styles.buttonsContainer,
                isMobile &&
                  styles.buttonsMobile,
              ]}
            >
              <TouchableOpacity
                style={
                  styles.analyticsButton
                }
                onPress={() =>
                  router.push(
                    "/agendamentos"
                  )
                }
              >
                <Text
                  style={
                    styles.analyticsButtonText
                  }
                >
                  Ver Agendamentos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  router.push("/clientes")
                }
              >
                <Text
                  style={styles.buttonText}
                >
                  Ver Todos os Clientes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.analyticsButton
                }
                onPress={() =>
                  router.push("/analytics")
                }
              >
                <Text
                  style={
                    styles.analyticsButtonText
                  }
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
    backgroundColor: "rgba(2, 8, 20, 0.78)",
  },

  scroll: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    padding: 28,
    paddingBottom: 60,
    width: "100%",
  },

  scrollContentMobile: {
    padding: 18,
    paddingBottom: 40,
  },

  /*
  |--------------------------------------------------------------------------
  | HEADER
  |--------------------------------------------------------------------------
  */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 34,
    zIndex: 2,
    gap: 30,
  },

  headerMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 20,
  },

  logoContainer: {
    justifyContent: "center",
    flexShrink: 1,
  },

  headerLogo: {
    width: 180,
    height: 70,
    marginBottom: 8,
  },

  headerLogoMobile: {
    width: 140,
    height: 54,
  },

  subtitle: {
    color: "#9FB2CC",
    fontSize: 16,
  },

  subtitleMobile: {
    fontSize: 14,
  },

  /*
  |--------------------------------------------------------------------------
  | LADO DIREITO DO HEADER
  |--------------------------------------------------------------------------
  */

  headerRight: {
    alignItems: "flex-end",
    gap: 12,
  },

  headerRightMobile: {
    width: "100%",
    alignItems: "stretch",
  },

  /*
  |--------------------------------------------------------------------------
  | HUB DO USUÁRIO
  |--------------------------------------------------------------------------
  */

  userHub: {
    minWidth: 310,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,

    backgroundColor:
      "rgba(7, 22, 46, 0.92)",

    borderWidth: 1,
    borderColor:
      "rgba(76, 141, 255, 0.28)",

    paddingVertical: 13,
    paddingHorizontal: 16,

    borderRadius: 16,
  },

  userHubMobile: {
    width: "100%",
    minWidth: 0,
  },

  avatar: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "#0057FF",

    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  userInfo: {
    flex: 1,
  },

  userLabel: {
    color: "#4C8DFF",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 3,
  },

  userName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  userEmail: {
    color: "#8FA4C0",
    fontSize: 12,
    marginTop: 3,
  },

  /*
  |--------------------------------------------------------------------------
  | BOTÕES DO HEADER
  |--------------------------------------------------------------------------
  */

  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },

  headerButtonsMobile: {
    width: "100%",
  },

  headerButton: {
    backgroundColor:
      "rgba(0, 87, 255, 0.18)",

    borderWidth: 1,
    borderColor: "#0057FF",

    paddingVertical: 11,
    paddingHorizontal: 20,

    borderRadius: 12,

    alignItems: "center",
  },

  headerButtonMobile: {
    flex: 1,
  },

  headerButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  logoutButton: {
    backgroundColor:
      "rgba(255, 76, 76, 0.10)",

    borderWidth: 1,
    borderColor:
      "rgba(255, 100, 100, 0.55)",

    paddingVertical: 11,
    paddingHorizontal: 20,

    borderRadius: 12,

    alignItems: "center",
  },

  logoutButtonText: {
    color: "#FF9C9C",
    fontWeight: "800",
    fontSize: 14,
  },

  /*
  |--------------------------------------------------------------------------
  | CARREGAMENTO
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | CARDS DE RISCO
  |--------------------------------------------------------------------------
  */

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
    borderRadius: 24,
    padding: 24,

    backgroundColor:
      "rgba(10, 20, 38, 0.82)",

    shadowColor: "#0057FF",

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },

  redCard: {
    borderWidth: 1,
    borderColor: "#FF3B30",
  },

  yellowCard: {
    borderWidth: 1,
    borderColor: "#FFB800",
  },

  greenCard: {
    borderWidth: 1,
    borderColor: "#1ED760",
  },

  cardLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  cardNumber: {
    color: "#FFFFFF",
    fontSize: 56,
    fontWeight: "900",
    marginBottom: 10,
  },

  cardNumberMobile: {
    fontSize: 42,
  },

  cardDescription: {
    color: "#B8C5D6",
    fontSize: 15,
    lineHeight: 22,
  },

  /*
  |--------------------------------------------------------------------------
  | CLIENTES PRIORITÁRIOS
  |--------------------------------------------------------------------------
  */

  section: {
    backgroundColor:
      "rgba(12, 22, 40, 0.82)",

    borderRadius: 26,
    padding: 24,
    marginBottom: 28,

    zIndex: 2,

    borderWidth: 1,

    borderColor:
      "rgba(0, 87, 255, 0.18)",
  },

  sectionMobile: {
    padding: 18,
    borderRadius: 22,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 24,
  },

  sectionTitleMobile: {
    fontSize: 20,
  },

  clientCard: {
    backgroundColor:
      "rgba(17, 31, 51, 0.92)",

    borderRadius: 20,
    padding: 20,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 16,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.06)",
  },

  clientCardMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 14,
  },

  clientInfoWrapper: {
    flex: 1,
    paddingRight: 12,
  },

  clientName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  clientInfo: {
    color: "#9FB2CC",
    fontSize: 15,
  },

  dangerBadge: {
    backgroundColor: "#FF3B30",

    paddingVertical: 10,
    paddingHorizontal: 18,

    borderRadius: 999,
  },

  warningBadge: {
    backgroundColor: "#FFB800",

    paddingVertical: 10,
    paddingHorizontal: 18,

    borderRadius: 999,
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },

  /*
  |--------------------------------------------------------------------------
  | BOTÕES INFERIORES
  |--------------------------------------------------------------------------
  */

  buttonsContainer: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 40,
  },

  buttonsMobile: {
    flexDirection: "column",
  },

  button: {
    flex: 1,

    backgroundColor: "#0057FF",

    paddingVertical: 20,

    borderRadius: 18,

    alignItems: "center",

    shadowColor: "#0057FF",

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18,
  },

  analyticsButton: {
    flex: 1,

    backgroundColor:
      "rgba(0, 87, 255, 0.12)",

    borderWidth: 1,
    borderColor: "#0057FF",

    paddingVertical: 20,

    borderRadius: 18,

    alignItems: "center",

    shadowColor: "#0057FF",

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
  },

  analyticsButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18,
  },
});