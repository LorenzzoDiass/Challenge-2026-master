import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function MeusAgendamentos() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.badge}>Área do cliente</Text>

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            Meus agendamentos
          </Text>

          <Text style={styles.subtitle}>
            Acompanhe seus próximos serviços na rede autorizada Ford.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/meu-ford")}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* VEÍCULO */}
      <View style={styles.vehicleCard}>
        <Text style={styles.vehicleLabel}>MEU VEÍCULO</Text>

        <Text style={styles.vehicleName}>
          Ford Ranger Raptor
        </Text>

        <Text style={styles.vehicleInfo}>
          2022 • 98.000 km
        </Text>
      </View>

      {/* AGENDAMENTOS */}
      <Text style={styles.sectionTitle}>
        Próximos agendamentos
      </Text>

      <View style={styles.appointmentCard}>
        <View
          style={[
            styles.appointmentHeader,
            isMobile && styles.appointmentHeaderMobile,
          ]}
        >
          <View style={styles.appointmentHeaderContent}>
            <Text style={styles.serviceName}>
              Revisão preventiva
            </Text>

            <Text style={styles.dealership}>
              Ford Center Morumbi
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              Confirmado
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View
          style={[
            styles.detailsRow,
            isMobile && styles.detailsRowMobile,
          ]}
        >
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>
              Data
            </Text>

            <Text style={styles.detailValue}>
              28/05/2026
            </Text>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>
              Horário
            </Text>

            <Text style={styles.detailValue}>
              14:30
            </Text>
          </View>
        </View>

        <View style={styles.observationBox}>
          <Text style={styles.observationLabel}>
            Observação
          </Text>

          <Text style={styles.observationText}>
            Avaliação geral do veículo solicitada no agendamento.
          </Text>
        </View>
      </View>

      {/* NOVO AGENDAMENTO */}
      <TouchableOpacity
        style={styles.newAppointmentButton}
        onPress={() => router.push("/agendamento?id=1")}
      >
        <Text style={styles.newAppointmentButtonText}>
          Agendar nova revisão
        </Text>
      </TouchableOpacity>

      {/* AJUDA */}
      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>
          Precisa alterar seu agendamento?
        </Text>

        <Text style={styles.helpText}>
          Entre em contato com a unidade Ford responsável pelo atendimento.
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

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 16,
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
});