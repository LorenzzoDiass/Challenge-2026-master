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

import {
  buscarAgendamentosDoCliente,
  buscarClientePorId,
} from "../services/api";

const CLIENTE_ID = "1";

export default function MeusAgendamentos() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [cliente, setCliente] = useState<any>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const [dadosCliente, dadosAgendamentos] =
        await Promise.all([
          buscarClientePorId(CLIENTE_ID),
          buscarAgendamentosDoCliente(CLIENTE_ID),
        ]);

      setCliente(dadosCliente);
      setAgendamentos(dadosAgendamentos);
    } catch (erro) {
      console.log(
        "Erro ao carregar agendamentos:",
        erro
      );

      setErro(
        "Não foi possível carregar seus agendamentos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Carregando seus agendamentos...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isMobile && styles.contentMobile,
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
        <View style={styles.headerContent}>
          <Text style={styles.badge}>
            Área do cliente
          </Text>

          <Text
            style={[
              styles.title,
              isMobile && styles.titleMobile,
            ]}
          >
            Meus agendamentos
          </Text>

          <Text style={styles.subtitle}>
            Acompanhe seus próximos serviços na rede
            autorizada Ford.
          </Text>
        </View>

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
      </View>

      {/* VEÍCULO */}
      {cliente && (
        <View style={styles.vehicleCard}>
          <Text style={styles.vehicleLabel}>
            MEU VEÍCULO
          </Text>

          <Text style={styles.vehicleName}>
            {cliente.modelo}
          </Text>

          <Text style={styles.vehicleInfo}>
            {cliente.ano} •{" "}
            {Number(cliente.km).toLocaleString(
              "pt-BR"
            )}{" "}
            km
          </Text>
        </View>
      )}

      {/* ERRO */}
      {erro ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            Não foi possível carregar os dados
          </Text>

          <Text style={styles.errorText}>
            {erro}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={carregarDados}
          >
            <Text style={styles.retryButtonText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* AGENDAMENTOS */}
          <View
            style={[
              styles.sectionHeader,
              isMobile &&
                styles.sectionHeaderMobile,
            ]}
          >
            <View>
              <Text style={styles.sectionTitle}>
                Próximos agendamentos
              </Text>

              <Text style={styles.sectionSubtitle}>
                Serviços registrados para o seu
                veículo
              </Text>
            </View>

            <View style={styles.totalBadge}>
              <Text style={styles.totalNumber}>
                {agendamentos.length}
              </Text>

              <Text style={styles.totalText}>
                {agendamentos.length === 1
                  ? "agendamento"
                  : "agendamentos"}
              </Text>
            </View>
          </View>

          {agendamentos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                Nenhum agendamento encontrado
              </Text>

              <Text style={styles.emptyText}>
                Você ainda não possui serviços
                agendados na rede autorizada Ford.
              </Text>
            </View>
          ) : (
            agendamentos.map((agendamento) => (
              <View
                key={agendamento.id}
                style={styles.appointmentCard}
              >
                <View
                  style={[
                    styles.appointmentHeader,
                    isMobile &&
                      styles.appointmentHeaderMobile,
                  ]}
                >
                  <View
                    style={
                      styles.appointmentHeaderContent
                    }
                  >
                    <Text style={styles.serviceName}>
                      {agendamento.servico}
                    </Text>

                    <Text style={styles.dealership}>
                      {agendamento.unidade}
                    </Text>
                  </View>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {agendamento.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View
                  style={[
                    styles.detailsRow,
                    isMobile &&
                      styles.detailsRowMobile,
                  ]}
                >
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>
                      Data
                    </Text>

                    <Text style={styles.detailValue}>
                      {agendamento.data}
                    </Text>
                  </View>

                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>
                      Horário
                    </Text>

                    <Text style={styles.detailValue}>
                      {agendamento.horario}
                    </Text>
                  </View>
                </View>

                {agendamento.observacao ? (
                  <View
                    style={styles.observationBox}
                  >
                    <Text
                      style={
                        styles.observationLabel
                      }
                    >
                      Observação
                    </Text>

                    <Text
                      style={
                        styles.observationText
                      }
                    >
                      {agendamento.observacao}
                    </Text>
                  </View>
                ) : null}
              </View>
            ))
          )}

          {/* NOVO AGENDAMENTO */}
          <TouchableOpacity
            style={styles.newAppointmentButton}
            onPress={() =>
              router.push(
                "/agendamento?id=1&origem=cliente"
              )
            }
          >
            <Text
              style={
                styles.newAppointmentButtonText
              }
            >
              Agendar nova revisão
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* AJUDA */}
      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>
          Precisa alterar seu agendamento?
        </Text>

        <Text style={styles.helpText}>
          Entre em contato com a unidade Ford
          responsável pelo atendimento.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B18",
  },

  content: {
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 50,
  },

  contentMobile: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 28,
  },

  headerMobile: {
    flexDirection: "column",
  },

  headerContent: {
    flex: 1,
  },

  badge: {
    color: "#4C8DFF",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
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
    lineHeight: 23,
  },

  backButton: {
    backgroundColor: "#0A1E3B",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#173B70",
  },

  backButtonText: {
    color: "#DCE9FF",
    fontWeight: "800",
  },

  vehicleCard: {
    backgroundColor: "#07162E",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 28,
  },

  vehicleLabel: {
    color: "#4C8DFF",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 7,
  },

  vehicleName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  vehicleInfo: {
    color: "#9FB2CC",
    fontSize: 15,
    marginTop: 6,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 16,
  },

  sectionHeaderMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: "#7F93AD",
    fontSize: 13,
    marginTop: 5,
  },

  totalBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    backgroundColor: "#07162E",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#173B70",
    paddingVertical: 9,
    paddingHorizontal: 14,
  },

  totalNumber: {
    color: "#4C8DFF",
    fontSize: 18,
    fontWeight: "900",
  },

  totalText: {
    color: "#9FB2CC",
    fontSize: 12,
    fontWeight: "700",
  },

  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 26,
    marginBottom: 18,
  },

  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },

  appointmentHeaderMobile: {
    flexDirection: "column",
  },

  appointmentHeaderContent: {
    flex: 1,
  },

  serviceName: {
    color: "#06182E",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
  },

  dealership: {
    color: "#657A96",
    fontSize: 15,
  },

  statusBadge: {
    backgroundColor: "#E9F8EF",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  statusText: {
    color: "#168A45",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },

  divider: {
    height: 1,
    backgroundColor: "#E1E7EF",
    marginVertical: 22,
  },

  detailsRow: {
    flexDirection: "row",
    gap: 14,
  },

  detailsRowMobile: {
    flexDirection: "column",
  },

  detailBox: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    borderRadius: 14,
    padding: 17,
  },

  detailLabel: {
    color: "#7B8BA3",
    fontSize: 13,
    marginBottom: 6,
  },

  detailValue: {
    color: "#06182E",
    fontSize: 19,
    fontWeight: "900",
  },

  observationBox: {
    marginTop: 16,
    backgroundColor: "#F6F8FB",
    borderRadius: 14,
    padding: 17,
  },

  observationLabel: {
    color: "#7B8BA3",
    fontSize: 13,
    marginBottom: 6,
  },

  observationText: {
    color: "#36495F",
    fontSize: 15,
    lineHeight: 22,
  },

  emptyCard: {
    backgroundColor: "#07162E",
    borderRadius: 20,
    padding: 26,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 18,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
  },

  emptyText: {
    color: "#9FB2CC",
    fontSize: 14,
    lineHeight: 21,
  },

  errorCard: {
    backgroundColor: "#07162E",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#783838",
    marginBottom: 24,
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  errorText: {
    color: "#C5A1A1",
    fontSize: 14,
    lineHeight: 21,
  },

  retryButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: "#0057FF",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  newAppointmentButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 22,
  },

  newAppointmentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  helpCard: {
    backgroundColor: "#07162E",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#0D2A52",
  },

  helpTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  helpText: {
    color: "#9FB2CC",
    fontSize: 14,
    lineHeight: 21,
  },

  loadingContainer: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#020B18",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});