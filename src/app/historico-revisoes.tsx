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
import { buscarAgendamentosDoCliente } from "../services/api";

export default function HistoricoRevisoes() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const CLIENTE_ID = "1";

  const [revisoes, setRevisoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarAgendamentosDoCliente(
        CLIENTE_ID
      );

      const concluidos = dados.filter(
        (agendamento: any) =>
          String(
            agendamento.status || ""
          ).toUpperCase() === "CONCLUÍDO"
      );

      setRevisoes(concluidos);
    } catch (erro) {
      console.log(
        "Erro ao carregar histórico de revisões:",
        erro
      );

      setErro(
        "Não foi possível carregar o histórico de revisões."
      );
    } finally {
      setCarregando(false);
    }
  }

  function obterData(agendamento: any) {
    return (
      agendamento.data ||
      agendamento.dataAgendamento ||
      agendamento.data_agendamento ||
      "Data não informada"
    );
  }

  function obterHorario(agendamento: any) {
    return (
      agendamento.horario ||
      agendamento.hora ||
      agendamento.horaAgendamento ||
      agendamento.hora_agendamento ||
      "Horário não informado"
    );
  }

  function obterConcessionaria(agendamento: any) {
    return (
      agendamento.concessionaria ||
      agendamento.nomeConcessionaria ||
      agendamento.concessionariaNome ||
      "Rede autorizada Ford"
    );
  }

  function obterServico(agendamento: any) {
    return (
      agendamento.servico ||
      agendamento.tipoServico ||
      agendamento.tipo_servico ||
      "Revisão preventiva"
    );
  }

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
          Histórico de revisões
        </Text>

        <Text style={styles.subtitle}>
          Serviços concluídos na rede autorizada Ford
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            SERVIÇOS REALIZADOS
          </Text>

          <Text style={styles.summaryNumber}>
            {revisoes.length}
          </Text>

          <Text style={styles.summaryText}>
            Revisões registradas no histórico do veículo
          </Text>
        </View>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />

            <Text style={styles.loadingText}>
              Carregando histórico...
            </Text>
          </View>
        ) : erro !== "" ? (
          <View style={styles.messageCard}>
            <Text style={styles.errorText}>
              {erro}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={carregarHistorico}
            >
              <Text style={styles.retryButtonText}>
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : revisoes.length === 0 ? (
          <View style={styles.messageCard}>
            <Text style={styles.emptyTitle}>
              Nenhuma revisão concluída
            </Text>

            <Text style={styles.emptyText}>
              Quando um serviço for concluído na rede
              autorizada Ford, ele aparecerá aqui.
            </Text>
          </View>
        ) : (
          <View style={styles.historyContainer}>
            {revisoes.map((agendamento, index) => (
              <View
                key={String(
                  agendamento.id ?? index
                )}
                style={[
                  styles.revisionCard,
                  isMobile &&
                    styles.revisionCardMobile,
                ]}
              >
                <View
                  style={[
                    styles.revisionHeader,
                    isMobile &&
                      styles.revisionHeaderMobile,
                  ]}
                >
                  <View style={styles.revisionTitleArea}>
                    <Text style={styles.revisionLabel}>
                      SERVIÇO FORD
                    </Text>

                    <Text style={styles.revisionTitle}>
                      {obterServico(agendamento)}
                    </Text>
                  </View>

                  <View style={styles.statusBadge}>
                    <Text
                      style={styles.statusBadgeText}
                    >
                      CONCLUÍDO
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View
                  style={[
                    styles.infoGrid,
                    isMobile &&
                      styles.infoGridMobile,
                  ]}
                >
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>
                      Data do serviço
                    </Text>

                    <Text style={styles.infoValue}>
                      {obterData(agendamento)}
                    </Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>
                      Horário
                    </Text>

                    <Text style={styles.infoValue}>
                      {obterHorario(agendamento)}
                    </Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>
                      Concessionária
                    </Text>

                    <Text style={styles.infoValue}>
                      {obterConcessionaria(
                        agendamento
                      )}
                    </Text>
                  </View>
                </View>

                <View style={styles.completedBox}>
                  <Text style={styles.completedTitle}>
                    Serviço concluído
                  </Text>

                  <Text style={styles.completedText}>
                    Esta manutenção foi registrada como
                    concluída na rede autorizada Ford e
                    faz parte do histórico de pós-venda
                    do veículo.
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footerBox}>
          <Text style={styles.footerTitle}>
            Ford Retain
          </Text>

          <Text style={styles.footerText}>
            Seu histórico de manutenção ajuda a manter o
            veículo em dia e fortalece o relacionamento
            com a rede autorizada Ford.
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
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 23,
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
    lineHeight: 21,
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
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  emptyText: {
    color: "#9FB2CC",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 500,
  },
  historyContainer: {
    gap: 18,
  },
  revisionCard: {
    backgroundColor: "#07162E",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
  },
  revisionCardMobile: {
    padding: 18,
    borderRadius: 20,
  },
  revisionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  revisionHeaderMobile: {
    flexDirection: "column",
  },
  revisionTitleArea: {
    flex: 1,
  },
  revisionLabel: {
    color: "#4C8DFF",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 7,
  },
  revisionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  statusBadge: {
    backgroundColor: "rgba(30, 215, 96, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(30, 215, 96, 0.35)",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  statusBadgeText: {
    color: "#1ED760",
    fontSize: 10,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: "#17304F",
    marginVertical: 20,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 14,
  },
  infoGridMobile: {
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
    lineHeight: 21,
  },
  completedBox: {
    backgroundColor: "rgba(30, 215, 96, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(30, 215, 96, 0.20)",
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
  },
  completedTitle: {
    color: "#1ED760",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
  },
  completedText: {
    color: "#A4B7CD",
    fontSize: 13,
    lineHeight: 20,
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