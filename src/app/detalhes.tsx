import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import {
  buscarClientePorId,
  atualizarStatus,
} from "../services/api";

export default function Detalhes() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [cliente, setCliente] = useState<any>(null);
  const [statusAtual, setStatusAtual] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarCliente() {
      try {
        const dados = await buscarClientePorId(id as string);

        setCliente(dados);
        setStatusAtual(dados.status);
      } catch (erro) {
        console.log("Erro ao carregar cliente:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarCliente();
  }, [id]);

  function imagemDoCarro(modelo: string) {
    if (modelo?.includes("Ranger")) {
      return require("../assets/images/rangerr.jpg");
    }

    if (modelo?.includes("Territory")) {
      return require("../assets/images/territory.jpg");
    }

    if (modelo?.includes("Maverick")) {
      return require("../assets/images/maverick.jpg");
    }

    if (modelo?.includes("Bronco")) {
      return require("../assets/images/bronco.jpg");
    }

    if (modelo?.includes("Edge")) {
      return require("../assets/images/edge.jpg");
    }

    return require("../assets/images/mustang.jpg");
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Carregando cliente...</Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Cliente não encontrado.</Text>
      </View>
    );
  }

  const riscoStyle =
    cliente.risco === "ALTO"
      ? styles.alto
      : cliente.risco === "MÉDIO"
      ? styles.medio
      : styles.baixo;

  const statusStyle =
    statusAtual === "SEM CONTATO"
      ? styles.semContato
      : statusAtual === "CONTATO REALIZADO"
      ? styles.contato
      : statusAtual === "REVISÃO AGENDADA"
      ? styles.agendado
      : styles.recuperado;

  const scoreRisco =
    cliente.risco === "ALTO" ? 92 : cliente.risco === "MÉDIO" ? 64 : 28;

  async function alterarStatus(novoStatus: string) {
    try {
      await atualizarStatus(cliente.id, novoStatus);
      setStatusAtual(novoStatus);
    } catch (erro) {
      console.log("Erro ao atualizar status:", erro);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroWrapper}>
        <Image
          source={imagemDoCarro(cliente.modelo)}
          style={[styles.heroImage, isMobile && styles.heroImageMobile]}
        />

        <View style={[styles.overlay, isMobile && styles.overlayMobile]} />

        <TouchableOpacity
          style={[styles.floatingBack, isMobile && styles.floatingBackMobile]}
          onPress={() => router.replace("/clientes")}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.content, isMobile && styles.contentMobile]}>
        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <View style={isMobile && styles.headerTextMobile}>
            <Text
              style={[styles.clientName, isMobile && styles.clientNameMobile]}
            >
              {cliente.nome}
            </Text>

            <Text
              style={[styles.modelName, isMobile && styles.modelNameMobile]}
            >
              {cliente.modelo}
            </Text>
          </View>

          <View style={[styles.badgesColumn, isMobile && styles.badgesMobile]}>
            <View style={[styles.riskBadge, riscoStyle]}>
              <Text style={styles.riskText}>{cliente.risco}</Text>
            </View>

            <View style={[styles.statusBadge, statusStyle]}>
              <Text style={styles.statusText}>{statusAtual}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.scoreCard, isMobile && styles.scoreCardMobile]}>
          <View style={isMobile && styles.scoreTextMobile}>
            <Text
              style={[
                styles.sectionTitle,
                isMobile && styles.sectionTitleMobile,
              ]}
            >
              Score de abandono
            </Text>

            <Text style={styles.scoreSubtitle}>
              Probabilidade estimada com base em KM, revisão e garantia.
            </Text>
          </View>

          <Text
            style={[styles.scoreNumber, isMobile && styles.scoreNumberMobile]}
          >
            {scoreRisco}%
          </Text>
        </View>

        <View style={[styles.grid, isMobile && styles.gridMobile]}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Quilometragem</Text>

            <Text style={styles.value}>
              {cliente.km.toLocaleString("pt-BR")} km
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Ano</Text>
            <Text style={styles.value}>{cliente.ano}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Última revisão</Text>
            <Text style={styles.value}>{cliente.ultimaRevisao}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Garantia</Text>
            <Text style={styles.value}>{cliente.garantia}</Text>
          </View>
        </View>

        <View style={[styles.twoColumns, isMobile && styles.twoColumnsMobile]}>
          <View style={styles.card}>
            <Text
              style={[
                styles.sectionTitle,
                isMobile && styles.sectionTitleMobile,
              ]}
            >
              Dados do cliente
            </Text>

            <Text style={styles.text}>Telefone: {cliente.telefone}</Text>
            <Text style={styles.text}>E-mail: {cliente.email}</Text>
            <Text style={styles.text}>Cidade: {cliente.cidade}</Text>
            <Text style={styles.text}>Status atual: {statusAtual}</Text>
          </View>

          <View style={styles.card}>
            <Text
              style={[
                styles.sectionTitle,
                isMobile && styles.sectionTitleMobile,
              ]}
            >
              Timeline de revisão
            </Text>

            <Text style={styles.timelineItem}>
              ✓ Revisão anterior registrada
            </Text>

            <Text style={styles.timelineItem}>
              ✓ Última revisão: {cliente.ultimaRevisao}
            </Text>

            <Text style={styles.timelineAlert}>
              ⚠ Próxima ação: contato pós-venda
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text
            style={[
              styles.sectionTitle,
              isMobile && styles.sectionTitleMobile,
            ]}
          >
            Motivo do risco
          </Text>

          <Text style={styles.text}>{cliente.motivo}</Text>
        </View>

        <View style={styles.aiCard}>
          <Text
            style={[
              styles.sectionTitle,
              isMobile && styles.sectionTitleMobile,
            ]}
          >
            Ação sugerida pela IA
          </Text>

          <Text style={styles.text}>{cliente.acao}</Text>
        </View>

        <View style={[styles.actions, isMobile && styles.actionsMobile]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => alterarStatus("CONTATO REALIZADO")}
          >
            <Text style={styles.primaryButtonText}>Entrar em contato</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={async () => {
              await alterarStatus("REVISÃO AGENDADA");

              router.push({
                pathname: "/agendamento",
                params: { id: cliente.id },
              });
            }}
          >
            <Text style={styles.secondaryButtonText}>Abrir agendamento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostButton}
            onPress={() => alterarStatus("CLIENTE RECUPERADO")}
          >
            <Text style={styles.ghostButtonText}>Registrar retorno</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B18",
  },

  notFound: {
    color: "#FFFFFF",
    fontSize: 20,
    padding: 24,
  },

  heroWrapper: {
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: 440,
  },

  heroImageMobile: {
    height: 260,
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: 440,
    backgroundColor: "rgba(2, 8, 20, 0.42)",
  },

  overlayMobile: {
    height: 260,
  },

  floatingBack: {
    position: "absolute",
    top: 28,
    left: 28,
    backgroundColor: "rgba(2, 8, 20, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },

  floatingBackMobile: {
    top: 18,
    left: 18,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  content: {
    padding: 28,
    marginTop: -42,
    backgroundColor: "#07111F",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },

  contentMobile: {
    padding: 18,
    marginTop: -28,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  headerMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
  },

  headerTextMobile: {
    width: "100%",
  },

  clientName: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 6,
  },

  clientNameMobile: {
    fontSize: 30,
  },

  modelName: {
    color: "#9FB2CC",
    fontSize: 21,
  },

  modelNameMobile: {
    fontSize: 17,
  },

  badgesColumn: {
    alignItems: "flex-end",
    gap: 10,
  },

  badgesMobile: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  riskBadge: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 999,
  },

  riskText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  statusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  alto: {
    backgroundColor: "#FF3B30",
  },

  medio: {
    backgroundColor: "#FFB800",
  },

  baixo: {
    backgroundColor: "#1ED760",
  },

  semContato: {
    backgroundColor: "#5B6472",
  },

  contato: {
    backgroundColor: "#0057FF",
  },

  agendado: {
    backgroundColor: "#FFB800",
  },

  recuperado: {
    backgroundColor: "#28D764",
  },

  scoreCard: {
    backgroundColor: "rgba(0, 87, 255, 0.14)",
    borderWidth: 1,
    borderColor: "#0057FF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scoreCardMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 18,
    padding: 20,
  },

  scoreTextMobile: {
    width: "100%",
  },

  scoreSubtitle: {
    color: "#9FB2CC",
    fontSize: 15,
    marginTop: 6,
  },

  scoreNumber: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
  },

  scoreNumberMobile: {
    fontSize: 40,
  },

  grid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },

  gridMobile: {
    flexDirection: "column",
  },

  infoCard: {
    flex: 1,
    backgroundColor: "#0D1829",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 87, 255, 0.18)",
  },

  label: {
    color: "#8FA4C2",
    fontSize: 14,
    marginBottom: 8,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  twoColumns: {
    flexDirection: "row",
    gap: 18,
  },

  twoColumnsMobile: {
    flexDirection: "column",
    gap: 0,
  },

  card: {
    flex: 1,
    backgroundColor: "#0D1829",
    padding: 22,
    borderRadius: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 87, 255, 0.18)",
  },

  aiCard: {
    backgroundColor: "rgba(0, 87, 255, 0.14)",
    padding: 22,
    borderRadius: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#0057FF",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },

  sectionTitleMobile: {
    fontSize: 20,
  },

  text: {
    color: "#D7E3F4",
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 6,
  },

  timelineItem: {
    color: "#D7E3F4",
    fontSize: 16,
    marginBottom: 10,
  },

  timelineAlert: {
    color: "#FFB800",
    fontSize: 16,
    fontWeight: "800",
  },

  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 6,
    marginBottom: 40,
  },

  actionsMobile: {
    flexDirection: "column",
  },

  primaryButton: {
    flex: 1,
    backgroundColor: "#0057FF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0057FF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  ghostButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  ghostButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});