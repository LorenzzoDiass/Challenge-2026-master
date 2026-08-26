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

export default function Dashboard() {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  const [clientes, setClientes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

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

  useEffect(() => {
    carregarClientes();
  }, []);

  const alto = clientes.filter(
    (cliente) => cliente.risco === "ALTO"
  ).length;

  const medio = clientes.filter(
    (cliente) => cliente.risco === "MÉDIO"
  ).length;

  const baixo = clientes.filter(
    (cliente) => cliente.risco === "BAIXO"
  ).length;

  const clientesPrioritarios = clientes.filter(
    (cliente) =>
      cliente.risco === "ALTO" || cliente.risco === "MÉDIO"
  );

  return (
    <ImageBackground
      source={require("../assets/images/deshboard.bg.png")}
      style={[styles.container, { width, minHeight: height }]}
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
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.fordd.png")}
              style={[
                styles.headerLogo,
                isMobile && styles.headerLogoMobile,
              ]}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.subtitle,
                isMobile && styles.subtitleMobile,
              ]}
            >
              Painel inteligente de retenção pós-venda
            </Text>
          </View>

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
        </View>

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
              <View style={[styles.card, styles.redCard]}>
                <Text style={styles.cardLabel}>
                  🔴 Alto risco
                </Text>

                <Text
                  style={[
                    styles.cardNumber,
                    isMobile && styles.cardNumberMobile,
                  ]}
                >
                  {alto}
                </Text>

                <Text style={styles.cardDescription}>
                  Clientes precisam de atenção imediata
                </Text>
              </View>

              <View style={[styles.card, styles.yellowCard]}>
                <Text style={styles.cardLabel}>
                  🟡 Médio risco
                </Text>

                <Text
                  style={[
                    styles.cardNumber,
                    isMobile && styles.cardNumberMobile,
                  ]}
                >
                  {medio}
                </Text>

                <Text style={styles.cardDescription}>
                  Clientes próximos da revisão
                </Text>
              </View>

              <View style={[styles.card, styles.greenCard]}>
                <Text style={styles.cardLabel}>
                  🟢 Baixo risco
                </Text>

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
              <Text
                style={[
                  styles.sectionTitle,
                  isMobile && styles.sectionTitleMobile,
                ]}
              >
                Clientes com maior risco de abandono
              </Text>

              {clientesPrioritarios.map((cliente) => (
                <View
                  key={cliente.id}
                  style={[
                    styles.clientCard,
                    isMobile && styles.clientCardMobile,
                  ]}
                >
                  <View style={styles.clientInfoWrapper}>
                    <Text style={styles.clientName}>
                      {cliente.nome}
                    </Text>

                    <Text style={styles.clientInfo}>
                      {cliente.modelo} •{" "}
                      {cliente.km.toLocaleString("pt-BR")} km
                    </Text>
                  </View>

                  <View
                    style={
                      cliente.risco === "ALTO"
                        ? styles.dangerBadge
                        : styles.warningBadge
                    }
                  >
                    <Text style={styles.badgeText}>
                      {cliente.risco}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View
              style={[
                styles.buttonsContainer,
                isMobile && styles.buttonsMobile,
              ]}
            >
              <TouchableOpacity
                style={styles.analyticsButton}
                onPress={() => router.push("/agendamentos")}
              >
                <Text style={styles.analyticsButtonText}>
                  Ver Agendamentos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/clientes")}
              >
                <Text style={styles.buttonText}>
                  Ver Todos os Clientes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.analyticsButton}
                onPress={() => router.push("/analytics")}
              >
                <Text style={styles.analyticsButtonText}>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 34,
    zIndex: 2,
  },

  headerMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 18,
  },

  logoContainer: {
    justifyContent: "center",
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

  headerButton: {
    backgroundColor: "rgba(0, 87, 255, 0.18)",
    borderWidth: 1,
    borderColor: "#0057FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },

  headerButtonMobile: {
    width: "100%",
    alignItems: "center",
  },

  headerButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
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
    borderRadius: 24,
    padding: 24,
    backgroundColor: "rgba(10, 20, 38, 0.82)",

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

  section: {
    backgroundColor: "rgba(12, 22, 40, 0.82)",
    borderRadius: 26,
    padding: 24,
    marginBottom: 28,
    zIndex: 2,

    borderWidth: 1,
    borderColor: "rgba(0, 87, 255, 0.18)",
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
    backgroundColor: "rgba(17, 31, 51, 0.92)",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
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
    backgroundColor: "rgba(0, 87, 255, 0.12)",
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