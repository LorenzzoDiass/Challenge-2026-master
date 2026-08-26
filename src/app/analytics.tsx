import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
} from "react-native";

import { useEffect, useState } from "react";
import { router } from "expo-router";
import { buscarClientes } from "../services/api";

export default function Analytics() {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;

  const [clientes, setClientes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [relatorioGerado, setRelatorioGerado] = useState(false);

  useEffect(() => {
    async function carregarClientes() {
      try {
        const dados = await buscarClientes();
        setClientes(dados);
      } catch (erro) {
        console.log("Erro ao buscar clientes:", erro);
      } finally {
        setCarregando(false);
      }
    }

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

  const total = clientes.length;

  const mediaKm =
    total > 0
      ? Math.round(
          clientes.reduce(
            (soma, cliente) => soma + cliente.km,
            0
          ) / total
        )
      : 0;

  const percentualAlto =
    total > 0 ? Math.round((alto / total) * 100) : 0;

  const percentualMedio =
    total > 0 ? Math.round((medio / total) * 100) : 0;

  const percentualBaixo =
    total > 0 ? Math.round((baixo / total) * 100) : 0;

  const cidadesCriticas = clientes
    .filter((cliente) => cliente.risco === "ALTO")
    .map((cliente) => cliente.cidade);

  const insightIA =
    alto >= 2
      ? "A IA detectou aumento crítico de risco em clientes com alta quilometragem e revisões atrasadas. Recomenda-se contato imediato e campanhas prioritárias."
      : "Os clientes monitorados apresentam comportamento estável no pós-venda, sem aumento crítico de abandono.";

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
        <TouchableOpacity
          onPress={() => router.replace("/dashboard")}
        >
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            isMobile && styles.titleMobile,
          ]}
        >
          Analytics & IA
        </Text>

        <Text
          style={[
            styles.subtitle,
            isMobile && styles.subtitleMobile,
          ]}
        >
          Inteligência aplicada à retenção de clientes no
          pós-venda Ford
        </Text>

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
                styles.grid,
                isMobile && styles.gridMobile,
              ]}
            >
              <View style={styles.card}>
                <Text style={styles.label}>
                  Clientes analisados
                </Text>

                <Text
                  style={[
                    styles.number,
                    isMobile && styles.numberMobile,
                  ]}
                >
                  {total}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>
                  Média de quilometragem
                </Text>

                <Text
                  style={[
                    styles.number,
                    isMobile && styles.numberMobile,
                  ]}
                >
                  {mediaKm.toLocaleString("pt-BR")} km
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>
                  Clientes em alerta
                </Text>

                <Text
                  style={[
                    styles.number,
                    styles.red,
                    isMobile && styles.numberMobile,
                  ]}
                >
                  {alto + medio}
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
                Distribuição de risco
              </Text>

              <View style={styles.progressWrapper}>
                <View
                  style={[
                    styles.progressBar,
                    styles.redBar,
                    { width: `${percentualAlto}%` },
                  ]}
                />

                <View
                  style={[
                    styles.progressBar,
                    styles.yellowBar,
                    { width: `${percentualMedio}%` },
                  ]}
                />

                <View
                  style={[
                    styles.progressBar,
                    styles.greenBar,
                    { width: `${percentualBaixo}%` },
                  ]}
                />
              </View>

              <View
                style={[
                  styles.riskGrid,
                  isMobile && styles.riskGridMobile,
                ]}
              >
                <View style={styles.riskItem}>
                  <Text style={styles.riskLabel}>
                    🔴 Alto risco
                  </Text>

                  <Text style={styles.riskValue}>
                    {alto} clientes • {percentualAlto}%
                  </Text>
                </View>

                <View style={styles.riskItem}>
                  <Text style={styles.riskLabel}>
                    🟡 Médio risco
                  </Text>

                  <Text style={styles.riskValue}>
                    {medio} clientes • {percentualMedio}%
                  </Text>
                </View>

                <View style={styles.riskItem}>
                  <Text style={styles.riskLabel}>
                    🟢 Baixo risco
                  </Text>

                  <Text style={styles.riskValue}>
                    {baixo} clientes • {percentualBaixo}%
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.twoColumns,
                isMobile && styles.twoColumnsMobile,
              ]}
            >
              <View style={styles.sectionSmall}>
                <Text
                  style={[
                    styles.sectionTitle,
                    isMobile && styles.sectionTitleMobile,
                  ]}
                >
                  Cidades críticas
                </Text>

                {cidadesCriticas.map((cidade, index) => (
                  <Text key={index} style={styles.row}>
                    {index + 1}. {cidade}
                  </Text>
                ))}
              </View>

              <View style={styles.sectionSmall}>
                <Text
                  style={[
                    styles.sectionTitle,
                    isMobile && styles.sectionTitleMobile,
                  ]}
                >
                  Insight operacional
                </Text>

                <Text style={styles.row}>
                  {alto} clientes precisam de contato imediato.
                </Text>

                <Text style={styles.row}>
                  {medio} clientes devem receber campanha
                  preventiva.
                </Text>

                <Text style={styles.row}>
                  {baixo} clientes estão em situação saudável.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.aiBox,
                isMobile && styles.aiBoxMobile,
              ]}
            >
              <Text
                style={[
                  styles.aiTitle,
                  isMobile && styles.aiTitleMobile,
                ]}
              >
                Sugestão da IA
              </Text>

              <Text style={styles.aiText}>
                {insightIA}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => setRelatorioGerado(true)}
            >
              <Text style={styles.reportButtonText}>
                Gerar relatório inteligente
              </Text>
            </TouchableOpacity>

            {relatorioGerado && (
              <View style={styles.reportBox}>
                <Text
                  style={[
                    styles.reportTitle,
                    isMobile && styles.reportTitleMobile,
                  ]}
                >
                  Relatório gerado
                </Text>

                <Text style={styles.reportText}>
                  Foram analisados {total} clientes.
                  Atualmente, {alto} estão em alto risco,{" "}
                  {medio} em médio risco e {baixo} em baixo
                  risco.
                </Text>

                <Text style={styles.reportText}>
                  A média de quilometragem da base é de{" "}
                  {mediaKm.toLocaleString("pt-BR")} km.
                </Text>

                <Text style={styles.reportText}>
                  Recomendação da IA: priorizar contato
                  imediato com clientes de alto risco e criar
                  campanhas preventivas para clientes em médio
                  risco.
                </Text>
              </View>
            )}
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
  },

  scrollContent: {
    padding: 28,
    paddingBottom: 60,
  },

  scrollContentMobile: {
    padding: 18,
    paddingBottom: 40,
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
    fontSize: 34,
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

  loadingContainer: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 28,
  },

  gridMobile: {
    flexDirection: "column",
  },

  card: {
    flex: 1,
    backgroundColor: "rgba(7, 22, 46, 0.92)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
  },

  label: {
    color: "#9FB2CC",
    fontSize: 15,
    marginBottom: 12,
  },

  number: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
  },

  numberMobile: {
    fontSize: 34,
  },

  red: {
    color: "#FF3B30",
  },

  section: {
    backgroundColor: "rgba(7, 22, 46, 0.92)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 24,
  },

  sectionMobile: {
    padding: 18,
    borderRadius: 22,
  },

  sectionSmall: {
    flex: 1,
    backgroundColor: "rgba(7, 22, 46, 0.92)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
  },

  sectionTitleMobile: {
    fontSize: 20,
  },

  progressWrapper: {
    flexDirection: "row",
    height: 18,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#0D2A52",
    marginBottom: 22,
  },

  progressBar: {
    height: "100%",
  },

  redBar: {
    backgroundColor: "#FF3B30",
  },

  yellowBar: {
    backgroundColor: "#FFC107",
  },

  greenBar: {
    backgroundColor: "#28D764",
  },

  riskGrid: {
    flexDirection: "row",
    gap: 16,
  },

  riskGridMobile: {
    flexDirection: "column",
  },

  riskItem: {
    flex: 1,
    backgroundColor: "#0A1A33",
    borderRadius: 18,
    padding: 18,
  },

  riskLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  riskValue: {
    color: "#9FB2CC",
    fontSize: 15,
  },

  twoColumns: {
    flexDirection: "row",
    gap: 18,
  },

  twoColumnsMobile: {
    flexDirection: "column",
    gap: 0,
  },

  row: {
    color: "#D7E3F4",
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 12,
  },

  aiBox: {
    backgroundColor: "rgba(0, 87, 255, 0.16)",
    borderRadius: 24,
    padding: 26,
    borderWidth: 1,
    borderColor: "#0057FF",
    marginBottom: 24,
  },

  aiBoxMobile: {
    padding: 20,
    borderRadius: 22,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 14,
  },

  aiTitleMobile: {
    fontSize: 22,
  },

  aiText: {
    color: "#D7E3F4",
    fontSize: 17,
    lineHeight: 28,
  },

  reportButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#0057FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },

  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  reportBox: {
    backgroundColor: "rgba(7, 22, 46, 0.92)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0057FF",
    marginTop: 20,
    marginBottom: 40,
  },

  reportTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 14,
  },

  reportTitleMobile: {
    fontSize: 21,
  },

  reportText: {
    color: "#D7E3F4",
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 12,
  },
});