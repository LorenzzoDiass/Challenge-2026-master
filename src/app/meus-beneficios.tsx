import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { buscarClientePorId } from "../services/api";

export default function MeusBeneficios() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const CLIENTE_ID = "1";

  const [cliente, setCliente] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarCliente();
  }, []);

  async function carregarCliente() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarClientePorId(CLIENTE_ID);

      setCliente(dados);
    } catch (erro) {
      console.log("Erro ao carregar benefícios:", erro);

      setErro(
        "Não foi possível carregar seus benefícios."
      );
    } finally {
      setCarregando(false);
    }
  }

  const statusCliente = String(
    cliente?.status || ""
  ).toUpperCase();

  const clienteRetido =
    statusCliente === "CLIENTE RETIDO";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isMobile && styles.contentMobile,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.replace("/meu-ford")
          }
        >
          <Text style={styles.backButtonText}>
            Voltar
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            isMobile && styles.titleMobile,
          ]}
        >
          Meus benefícios
        </Text>

        <Text style={styles.subtitle}>
          Ofertas e vantagens personalizadas para sua
          jornada de pós-venda Ford
        </Text>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />

            <Text style={styles.loadingText}>
              Carregando benefícios...
            </Text>
          </View>
        ) : erro !== "" ? (
          <View style={styles.messageCard}>
            <Text style={styles.errorText}>
              {erro}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={carregarCliente}
            >
              <Text style={styles.retryButtonText}>
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>
                BENEFÍCIOS DISPONÍVEIS
              </Text>

              <Text style={styles.summaryNumber}>
                {clienteRetido ? 2 : 1}
              </Text>

              <Text style={styles.summaryText}>
                Vantagens personalizadas para você e seu
                Ford
              </Text>
            </View>

            {!clienteRetido ? (
              <View
                style={[
                  styles.benefitCard,
                  isMobile &&
                    styles.benefitCardMobile,
                ]}
              >
                <View
                  style={[
                    styles.benefitHeader,
                    isMobile &&
                      styles.benefitHeaderMobile,
                  ]}
                >
                  <View style={styles.benefitTitleArea}>
                    <Text style={styles.benefitLabel}>
                      OFERTA PERSONALIZADA
                    </Text>

                    <Text style={styles.benefitTitle}>
                      10% OFF na revisão preventiva
                    </Text>
                  </View>

                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>
                      ATIVO
                    </Text>
                  </View>
                </View>

                <Text style={styles.benefitText}>
                  Benefício disponibilizado para incentivar
                  o retorno à rede autorizada Ford e manter
                  seu veículo em dia.
                </Text>

                <View
                  style={[
                    styles.infoRow,
                    isMobile && styles.infoRowMobile,
                  ]}
                >
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>
                      Benefício
                    </Text>

                    <Text style={styles.infoValue}>
                      10% de desconto
                    </Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>
                      Aplicação
                    </Text>

                    <Text style={styles.infoValue}>
                      Revisão preventiva
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() =>
                    router.push({
                      pathname: "/agendamento",
                      params: {
                        id: CLIENTE_ID,
                        origem: "cliente",
                      },
                    })
                  }
                >
                  <Text
                    style={styles.primaryButtonText}
                  >
                    Usar benefício e agendar
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View
                  style={[
                    styles.benefitCard,
                    styles.retainedCard,
                    isMobile &&
                      styles.benefitCardMobile,
                  ]}
                >
                  <View
                    style={[
                      styles.benefitHeader,
                      isMobile &&
                        styles.benefitHeaderMobile,
                    ]}
                  >
                    <View style={styles.benefitTitleArea}>
                      <Text
                        style={[
                          styles.benefitLabel,
                          styles.retainedLabel,
                        ]}
                      >
                        BENEFÍCIO UTILIZADO
                      </Text>

                      <Text style={styles.benefitTitle}>
                        10% OFF na revisão preventiva
                      </Text>
                    </View>

                    <View style={styles.usedBadge}>
                      <Text style={styles.usedBadgeText}>
                        UTILIZADO
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.benefitText}>
                    Este benefício fez parte da jornada de
                    retenção e foi concluído com o retorno
                    do cliente à rede autorizada Ford.
                  </Text>

                  <View style={styles.statusBox}>
                    <Text style={styles.statusTitle}>
                      Ciclo concluído
                    </Text>

                    <Text style={styles.statusText}>
                      Serviço realizado e cliente retido na
                      rede autorizada Ford.
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.benefitCard,
                    isMobile &&
                      styles.benefitCardMobile,
                  ]}
                >
                  <View
                    style={[
                      styles.benefitHeader,
                      isMobile &&
                        styles.benefitHeaderMobile,
                    ]}
                  >
                    <View style={styles.benefitTitleArea}>
                      <Text style={styles.benefitLabel}>
                        VANTAGEM PÓS-SERVIÇO
                      </Text>

                      <Text style={styles.benefitTitle}>
                        Acompanhamento de manutenção
                      </Text>
                    </View>

                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>
                        ATIVO
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.benefitText}>
                    Continue acompanhando revisões,
                    quilometragem e próximos serviços para
                    manter seu Ford sempre em dia.
                  </Text>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() =>
                      router.push(
                        "/historico-revisoes"
                      )
                    }
                  >
                    <Text
                      style={
                        styles.secondaryButtonText
                      }
                    >
                      Ver histórico de revisões
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View style={styles.retentionInfo}>
              <Text style={styles.retentionInfoTitle}>
                Benefícios personalizados
              </Text>

              <Text style={styles.retentionInfoText}>
                O Ford Retain usa informações da jornada de
                pós-venda para apoiar ações de retenção e
                apresentar ofertas mais relevantes para
                cada cliente.
              </Text>
            </View>
          </>
        )}

        <View style={styles.footerBox}>
          <Text style={styles.footerTitle}>
            Ford Retain
          </Text>

          <Text style={styles.footerText}>
            Benefícios que aproximam você da rede
            autorizada Ford em toda a jornada de
            pós-venda.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B18",
  },
  content: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 50,
  },
  contentMobile: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#4C8DFF",
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
  },
  titleMobile: {
    fontSize: 30,
  },
  subtitle: {
    color: "#9FB2CC",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    marginBottom: 28,
    maxWidth: 720,
  },
  loadingContainer: {
    paddingVertical: 70,
    alignItems: "center",
    gap: 14,
  },
  loadingText: {
    color: "#9FB2CC",
    fontSize: 14,
  },
  messageCard: {
    backgroundColor: "#07162E",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
    alignItems: "center",
  },
  errorText: {
    color: "#FF7B7B",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 18,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  summaryCard: {
    backgroundColor: "#07162E",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 24,
  },
  summaryLabel: {
    color: "#4C8DFF",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
  },
  summaryText: {
    color: "#8FA4C0",
    fontSize: 13,
    marginTop: 6,
  },
  benefitCard: {
    backgroundColor: "#07162E",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 18,
  },
  benefitCardMobile: {
    padding: 18,
    borderRadius: 20,
  },
  retainedCard: {
    borderColor: "rgba(30, 215, 96, 0.35)",
  },
  benefitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  benefitHeaderMobile: {
    flexDirection: "column",
  },
  benefitTitleArea: {
    flex: 1,
  },
  benefitLabel: {
    color: "#4C8DFF",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 8,
  },
  retainedLabel: {
    color: "#1ED760",
  },
  benefitTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 30,
  },
  benefitText: {
    color: "#A7B7CA",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 15,
    maxWidth: 760,
  },
  activeBadge: {
    backgroundColor: "rgba(0, 87, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(76, 141, 255, 0.4)",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  activeBadgeText: {
    color: "#6FA4FF",
    fontSize: 10,
    fontWeight: "900",
  },
  usedBadge: {
    backgroundColor: "rgba(30, 215, 96, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(30, 215, 96, 0.35)",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  usedBadgeText: {
    color: "#1ED760",
    fontSize: 10,
    fontWeight: "900",
  },
  infoRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 20,
  },
  infoRowMobile: {
    flexDirection: "column",
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#0A1E3B",
    borderRadius: 14,
    padding: 16,
  },
  infoLabel: {
    color: "#8196B2",
    fontSize: 12,
    marginBottom: 6,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  primaryButton: {
    backgroundColor: "#0057FF",
    alignSelf: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#4C8DFF",
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 20,
  },
  secondaryButtonText: {
    color: "#4C8DFF",
    fontSize: 14,
    fontWeight: "900",
  },
  statusBox: {
    backgroundColor: "rgba(30, 215, 96, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(30, 215, 96, 0.20)",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  statusTitle: {
    color: "#1ED760",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
  },
  statusText: {
    color: "#A4B7CD",
    fontSize: 13,
    lineHeight: 20,
  },
  retentionInfo: {
    backgroundColor: "rgba(0, 87, 255, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(0, 87, 255, 0.28)",
    borderRadius: 18,
    padding: 20,
    marginTop: 6,
  },
  retentionInfoTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },
  retentionInfoText: {
    color: "#9FB2CC",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 760,
  },
  footerBox: {
    marginTop: 28,
    backgroundColor: "#051226",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },
  footerTitle: {
    color: "#4C8DFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  footerText: {
    color: "#93A6C0",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 600,
  },
});