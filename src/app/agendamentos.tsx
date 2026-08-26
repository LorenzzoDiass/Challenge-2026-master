import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { buscarAgendamentos } from "../services/api";

export default function Agendamentos() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarAgendamentos() {
      try {
        const dados = await buscarAgendamentos();
        setAgendamentos(dados);
      } catch (erro) {
        console.log("Erro ao buscar agendamentos:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarAgendamentos();
  }, []);

  if (carregando) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Carregando agendamentos...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, isMobile && styles.containerMobile]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={() => router.replace("/dashboard")}>
        <Text style={styles.back}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={[styles.title, isMobile && styles.titleMobile]}>
        Agendamentos
      </Text>

      <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
        Revisões registradas pela equipe de pós-venda
      </Text>

      {agendamentos.length === 0 && (
        <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
      )}

      {agendamentos.map((item) => (
        <View key={item.id} style={[styles.card, isMobile && styles.cardMobile]}>
          <View style={[styles.header, isMobile && styles.headerMobile]}>
            <View style={styles.headerText}>
              <Text style={[styles.clientName, isMobile && styles.clientNameMobile]}>
                {item.cliente}
              </Text>

              <Text style={styles.vehicle}>{item.veiculo}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.status === "Confirmado"
                  ? styles.confirmado
                  : styles.pendente,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <Text style={styles.info}>Unidade: {item.unidade}</Text>
          <Text style={styles.info}>Data: {item.data}</Text>
          <Text style={styles.info}>Horário: {item.horario}</Text>
          <Text style={styles.info}>Serviço: {item.servico}</Text>

          {item.observacao ? (
            <Text style={styles.info}>Observação: {item.observacao}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B18",
    padding: 28,
  },

  containerMobile: {
    padding: 18,
  },

  back: {
    color: "#4C8DFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
  },

  titleMobile: {
    fontSize: 32,
  },

  subtitle: {
    color: "#9FB2CC",
    fontSize: 17,
    marginTop: 8,
    marginBottom: 28,
  },

  subtitleMobile: {
    fontSize: 15,
    lineHeight: 22,
  },

  emptyText: {
    color: "#9FB2CC",
    fontSize: 17,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#07162E",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 20,
  },

  cardMobile: {
    borderRadius: 20,
    padding: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 16,
  },

  headerMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  headerText: {
    flex: 1,
  },

  clientName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
  },

  clientNameMobile: {
    fontSize: 21,
  },

  vehicle: {
    color: "#9FB2CC",
    fontSize: 16,
  },

  info: {
    color: "#D7E3F4",
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },

  statusBadge: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
  },

  confirmado: {
    backgroundColor: "#28D764",
  },

  pendente: {
    backgroundColor: "#FFB800",
  },

  statusText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },
});