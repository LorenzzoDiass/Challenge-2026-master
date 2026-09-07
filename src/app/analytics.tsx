import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import {
  buscarAgendamentos,
  buscarClientes,
} from "../services/api";

export default function Analytics() {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;

  const [clientes, setClientes] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [relatorioGerado, setRelatorioGerado] = useState(false);

  const animacaoBarra = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosClientes, dadosAgendamentos] =
          await Promise.all([
            buscarClientes(),
            buscarAgendamentos(),
          ]);

        setClientes(dadosClientes);
        setAgendamentos(dadosAgendamentos);
      } catch (erro) {
        console.log(
          "Erro ao buscar dados do Analytics:",
          erro
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {
    if (!carregando && clientes.length > 0) {
      animacaoBarra.setValue(0);

      Animated.timing(animacaoBarra, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: false,
      }).start();
    }
  }, [carregando, clientes, animacaoBarra]);

  const total = clientes.length;

  const alto = clientes.filter(
    (cliente) =>
      cliente.classificacaoRetain === "ALTO"
  ).length;

  const medio = clientes.filter(
    (cliente) =>
      cliente.classificacaoRetain === "MÉDIO"
  ).length;

  const baixo = clientes.filter(
    (cliente) =>
      cliente.classificacaoRetain === "BAIXO"
  ).length;

  const emAtencao = alto + medio;

  const clientesComAgendamento = new Set(
    agendamentos
      .map((item) => item.clienteId)
      .filter(
        (clienteId) =>
          clienteId !== undefined &&
          clienteId !== null
      )
      .map((clienteId) => String(clienteId))
  );

  const clientesComServicoConcluido = new Set(
    agendamentos
      .filter(
        (item) =>
          String(
            item.status || ""
          ).toUpperCase() === "CONCLUÍDO"
      )
      .map((item) => item.clienteId)
      .filter(
        (clienteId) =>
          clienteId !== undefined &&
          clienteId !== null
      )
      .map((clienteId) => String(clienteId))
  );

  const agendados = clientesComAgendamento.size;

  const servicosConcluidos =
    clientesComServicoConcluido.size;

  const clientesRetidos = clientes.filter(
    (cliente) =>
      String(
        cliente.status || ""
      ).toUpperCase() === "CLIENTE RETIDO"
  ).length;

  const mediaKm =
    total > 0
      ? Math.round(
          clientes.reduce(
            (soma, cliente) =>
              soma + Number(cliente.km || 0),
            0
          ) / total
        )
      : 0;

  const mediaRetainScore =
    total > 0
      ? Math.round(
          clientes.reduce(
            (soma, cliente) =>
              soma +
              Number(cliente.retainScore || 0),
            0
          ) / total
        )
      : 0;

  const percentualAlto =
    total > 0
      ? Math.round((alto / total) * 100)
      : 0;

  const percentualMedio =
    total > 0
      ? Math.round((medio / total) * 100)
      : 0;

  const percentualBaixo =
    total > 0
      ? Math.round((baixo / total) * 100)
      : 0;

  const percentualAtencao =
    total > 0
      ? Math.round((emAtencao / total) * 100)
      : 0;

  const percentualAgendados =
    total > 0
      ? Math.round((agendados / total) * 100)
      : 0;

  const percentualServicosConcluidos =
    total > 0
      ? Math.round(
          (servicosConcluidos / total) * 100
        )
      : 0;

  const percentualRetorno =
    total > 0
      ? Math.round(
          (clientesRetidos / total) * 100
        )
      : 0;

  const larguraAnimada =
    animacaoBarra.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

  const cidadesCriticas = Array.from(
    new Set(
      clientes
        .filter(
          (cliente) =>
            cliente.classificacaoRetain === "ALTO"
        )
        .map((cliente) => cliente.cidade)
        .filter(Boolean)
    )
  );

  const clientesCriticos = [...clientes]
    .filter(
      (cliente) =>
        cliente.classificacaoRetain === "ALTO"
    )
    .sort(
      (a, b) =>
        Number(b.retainScore || 0) -
        Number(a.retainScore || 0)
    )
    .slice(0, 3);

  const insightRetain =
    clientesRetidos > 0
      ? `${clientesRetidos} cliente${
          clientesRetidos === 1 ? "" : "s"
        } já concluiu${
          clientesRetidos === 1 ? "" : "íram"
        } o ciclo de retenção e retornou${
          clientesRetidos === 1 ? "" : "aram"
        } à rede autorizada. O indicador de retorno atual é de ${percentualRetorno}% da base monitorada.`
      : alto > 0
      ? `${alto} cliente${
          alto === 1 ? "" : "s"
        } apresenta${
          alto === 1 ? "" : "m"
        } risco alto de evasão. A recomendação é priorizar ações de contato e benefícios de retorno à rede autorizada.`
      : medio > 0
      ? `Não há clientes em risco alto no momento, mas ${medio} cliente${
          medio === 1 ? "" : "s"
        } precisa${
          medio === 1 ? "" : "m"
        } de acompanhamento preventivo.`
      : "A base monitorada apresenta baixo risco de evasão no momento.";

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.replace("/dashboard")
          }
        >
          <Text style={styles.back}>
            Voltar
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            isMobile && styles.titleMobile,
          ]}
        >
          Analytics
        </Text>

        <Text
          style={[
            styles.subtitle,
            isMobile && styles.subtitleMobile,
          ]}
        >
          Visão estratégica de retenção e pós-venda Ford
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

                <Text style={styles.cardHint}>
                  Base monitorada
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>
                  Retain Score médio
                </Text>

                <Text
                  style={[
                    styles.number,
                    isMobile && styles.numberMobile,
                  ]}
                >
                  {mediaRetainScore}%
                </Text>

                <Text style={styles.cardHint}>
                  Risco médio da base
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>
                  Clientes em atenção
                </Text>

                <Text
                  style={[
                    styles.number,
                    styles.orange,
                    isMobile && styles.numberMobile,
                  ]}
                >
                  {emAtencao}
                </Text>

                <Text style={styles.cardHint}>
                  Alto ou médio risco
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>
                  Retorno à rede
                </Text>

                <Text
                  style={[
                    styles.number,
                    styles.green,
                    isMobile && styles.numberMobile,
                  ]}
                >
                  {percentualRetorno}%
                </Text>

                <Text style={styles.cardHint}>
                  Indicador operacional
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
                  isMobile &&
                    styles.sectionTitleMobile,
                ]}
              >
                Distribuição do Retain Score
              </Text>

              <Text style={styles.sectionDescription}>
                Classificação atual dos clientes monitorados
              </Text>

              <View style={styles.progressWrapper}>
                <Animated.View
                  style={[
                    styles.progressAnimation,
                    {
                      width: larguraAnimada,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBar,
                      styles.redBar,
                      {
                        width: `${percentualAlto}%`,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.progressBar,
                      styles.yellowBar,
                      {
                        width: `${percentualMedio}%`,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.progressBar,
                      styles.greenBar,
                      {
                        width: `${percentualBaixo}%`,
                      },
                    ]}
                  />
                </Animated.View>
              </View>

              <View
                style={[
                  styles.riskGrid,
                  isMobile &&
                    styles.riskGridMobile,
                ]}
              >
                <View style={styles.riskItem}>
                  <View style={styles.riskTitleRow}>
                    <View
                      style={[
                        styles.riskDot,
                        styles.redDot,
                      ]}
                    />

                    <Text style={styles.riskLabel}>
                      Alto risco
                    </Text>
                  </View>

                  <Text style={styles.riskValue}>
                    {alto} cliente
                    {alto === 1 ? "" : "s"} •{" "}
                    {percentualAlto}%
                  </Text>
                </View>

                <View style={styles.riskItem}>
                  <View style={styles.riskTitleRow}>
                    <View
                      style={[
                        styles.riskDot,
                        styles.yellowDot,
                      ]}
                    />

                    <Text style={styles.riskLabel}>
                      Médio risco
                    </Text>
                  </View>

                  <Text style={styles.riskValue}>
                    {medio} cliente
                    {medio === 1 ? "" : "s"} •{" "}
                    {percentualMedio}%
                  </Text>
                </View>

                <View style={styles.riskItem}>
                  <View style={styles.riskTitleRow}>
                    <View
                      style={[
                        styles.riskDot,
                        styles.greenDot,
                      ]}
                    />

                    <Text style={styles.riskLabel}>
                      Baixo risco
                    </Text>
                  </View>

                  <Text style={styles.riskValue}>
                    {baixo} cliente
                    {baixo === 1 ? "" : "s"} •{" "}
                    {percentualBaixo}%
                  </Text>
                </View>
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
                  styles.funnelHeader,
                  isMobile &&
                    styles.funnelHeaderMobile,
                ]}
              >
                <View style={styles.funnelTitleArea}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      isMobile &&
                        styles.sectionTitleMobile,
                    ]}
                  >
                    Funil de retenção
                  </Text>

                  <Text
                    style={styles.sectionDescription}
                  >
                    Conversão da base monitorada até o retorno à rede autorizada
                  </Text>
                </View>

                <View style={styles.prototypeBadge}>
                  <Text
                    style={styles.prototypeBadgeText}
                  >
                    INDICADOR DO PROTÓTIPO
                  </Text>
                </View>
              </View>

              <View style={styles.funnelItem}>
                <View style={styles.funnelTop}>
                  <Text style={styles.funnelLabel}>
                    Base monitorada
                  </Text>

                  <Text style={styles.funnelValue}>
                    {total} • 100%
                  </Text>
                </View>

                <View style={styles.funnelTrack}>
                  <View
                    style={[
                      styles.funnelFill,
                      styles.funnelBlue,
                      {
                        width: "100%",
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.funnelItem}>
                <View style={styles.funnelTop}>
                  <Text style={styles.funnelLabel}>
                    Clientes em atenção
                  </Text>

                  <Text style={styles.funnelValue}>
                    {emAtencao} •{" "}
                    {percentualAtencao}%
                  </Text>
                </View>

                <View style={styles.funnelTrack}>
                  <View
                    style={[
                      styles.funnelFill,
                      styles.funnelOrange,
                      {
                        width: `${percentualAtencao}%` as any,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.funnelItem}>
                <View style={styles.funnelTop}>
                  <Text style={styles.funnelLabel}>
                    Agendamentos gerados
                  </Text>

                  <Text style={styles.funnelValue}>
                    {agendados} •{" "}
                    {percentualAgendados}%
                  </Text>
                </View>

                <View style={styles.funnelTrack}>
                  <View
                    style={[
                      styles.funnelFill,
                      styles.funnelLightBlue,
                      {
                        width: `${percentualAgendados}%` as any,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.funnelItem}>
                <View style={styles.funnelTop}>
                  <Text style={styles.funnelLabel}>
                    Serviços concluídos
                  </Text>

                  <Text style={styles.funnelValue}>
                    {servicosConcluidos} •{" "}
                    {percentualServicosConcluidos}%
                  </Text>
                </View>

                <View style={styles.funnelTrack}>
                  <View
                    style={[
                      styles.funnelFill,
                      styles.funnelGreen,
                      {
                        width: `${percentualServicosConcluidos}%` as any,
                      },
                    ]}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.funnelItem,
                  styles.funnelItemLast,
                ]}
              >
                <View style={styles.funnelTop}>
                  <Text
                    style={styles.funnelLabelStrong}
                  >
                    Clientes retidos
                  </Text>

                  <Text
                    style={styles.funnelValueStrong}
                  >
                    {clientesRetidos} •{" "}
                    {percentualRetorno}%
                  </Text>
                </View>

                <View style={styles.funnelTrack}>
                  <View
                    style={[
                      styles.funnelFill,
                      styles.funnelGreen,
                      {
                        width: `${percentualRetorno}%` as any,
                      },
                    ]}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.returnBox,
                  isMobile &&
                    styles.returnBoxMobile,
                ]}
              >
                <View style={styles.returnTextArea}>
                  <Text style={styles.returnLabel}>
                    Indicador de retorno à rede
                  </Text>

                  <Text
                    style={styles.returnDescription}
                  >
                    Clientes que concluíram o ciclo de retenção na base monitorada
                  </Text>
                </View>

                <Text style={styles.returnValue}>
                  {percentualRetorno}%
                </Text>
              </View>

              <Text style={styles.vinShareNote}>
                No protótipo, o retorno à rede funciona como indicador operacional de retenção. Em produção, a integração com dados oficiais de pós-venda permitiria acompanhar o VIN Share real.
              </Text>
            </View>

            <View
              style={[
                styles.twoColumns,
                isMobile &&
                  styles.twoColumnsMobile,
              ]}
            >
              <View
                style={[
                  styles.sectionSmall,
                  !isMobile &&
                    styles.sectionSmallDesktop,
                  isMobile &&
                    styles.sectionSmallMobile,
                ]}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    isMobile &&
                      styles.sectionTitleMobile,
                  ]}
                >
                  Clientes críticos
                </Text>

                <Text
                  style={styles.sectionDescription}
                >
                  Maiores Retain Scores da base
                </Text>

                {clientesCriticos.length === 0 ? (
                  <Text style={styles.row}>
                    Nenhum cliente em risco alto.
                  </Text>
                ) : (
                  clientesCriticos.map(
                    (cliente, index) => (
                      <TouchableOpacity
                        key={cliente.id}
                        style={
                          styles.criticalClient
                        }
                        onPress={() =>
                          router.push({
                            pathname:
                              "/detalhes",
                            params: {
                              id: String(
                                cliente.id
                              ),
                            },
                          })
                        }
                      >
                        <View
                          style={
                            styles.criticalTextArea
                          }
                        >
                          <Text
                            style={
                              styles.criticalClientName
                            }
                          >
                            {index + 1}.{" "}
                            {cliente.nome}
                          </Text>

                          <Text
                            style={
                              styles.criticalClientInfo
                            }
                          >
                            {cliente.modelo}
                          </Text>
                        </View>

                        <Text
                          style={
                            styles.criticalClientScore
                          }
                        >
                          {cliente.retainScore}%
                        </Text>
                      </TouchableOpacity>
                    )
                  )
                )}
              </View>

              <View
                style={[
                  styles.sectionSmall,
                  !isMobile &&
                    styles.sectionSmallDesktop,
                  isMobile &&
                    styles.sectionSmallMobile,
                ]}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    isMobile &&
                      styles.sectionTitleMobile,
                  ]}
                >
                  Indicadores operacionais
                </Text>

                <Text
                  style={styles.sectionDescription}
                >
                  Resumo da base monitorada
                </Text>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>
                    Média de quilometragem
                  </Text>

                  <Text style={styles.metricValue}>
                    {mediaKm.toLocaleString("pt-BR")} km
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>
                    Cidades com risco alto
                  </Text>

                  <Text style={styles.metricValue}>
                    {cidadesCriticas.length}
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>
                    Agendamentos gerados
                  </Text>

                  <Text style={styles.metricValue}>
                    {agendados}
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>
                    Serviços concluídos
                  </Text>

                  <Text style={styles.metricValue}>
                    {servicosConcluidos}
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>
                    Clientes retidos
                  </Text>

                  <Text
                    style={[
                      styles.metricValue,
                      styles.green,
                    ]}
                  >
                    {clientesRetidos}
                  </Text>
                </View>

                <View
                  style={[
                    styles.metricRow,
                    styles.metricRowLast,
                  ]}
                >
                  <Text style={styles.metricLabel}>
                    Retorno à rede
                  </Text>

                  <Text
                    style={[
                      styles.metricValue,
                      styles.green,
                    ]}
                  >
                    {percentualRetorno}%
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.insightBox,
                isMobile &&
                  styles.insightBoxMobile,
              ]}
            >
              <View
                style={[
                  styles.insightHeader,
                  isMobile &&
                    styles.insightHeaderMobile,
                ]}
              >
                <Text
                  style={[
                    styles.insightTitle,
                    isMobile &&
                      styles.insightTitleMobile,
                  ]}
                >
                  Insight Retain
                </Text>

                <View style={styles.modelBadge}>
                  <Text style={styles.modelBadgeText}>
                    MODELO EXPLICÁVEL
                  </Text>
                </View>
              </View>

              <Text style={styles.insightText}>
                {insightRetain}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.reportButton}
              onPress={() =>
                setRelatorioGerado(
                  !relatorioGerado
                )
              }
            >
              <Text
                style={styles.reportButtonText}
              >
                {relatorioGerado
                  ? "Ocultar relatório"
                  : "Gerar relatório de retenção"}
              </Text>
            </TouchableOpacity>

            {relatorioGerado && (
              <View style={styles.reportBox}>
                <Text
                  style={[
                    styles.reportTitle,
                    isMobile &&
                      styles.reportTitleMobile,
                  ]}
                >
                  Relatório de retenção
                </Text>

                <Text style={styles.reportText}>
                  A base monitorada possui {total} cliente
                  {total === 1 ? "" : "s"}, com Retain Score médio de{" "}
                  {mediaRetainScore}%.
                </Text>

                <Text style={styles.reportText}>
                  Atualmente, {alto} cliente
                  {alto === 1 ? "" : "s"} está
                  {alto === 1 ? "" : "o"} em alto risco,{" "}
                  {medio} em médio risco e {baixo} em baixo risco.
                </Text>

                <Text style={styles.reportText}>
                  Foram gerados {agendados} agendamento
                  {agendados === 1 ? "" : "s"}, representando{" "}
                  {percentualAgendados}% da base monitorada.
                </Text>

                <Text style={styles.reportText}>
                  Foram concluídos {servicosConcluidos} serviço
                  {servicosConcluidos === 1 ? "" : "s"} na rede autorizada, correspondendo a{" "}
                  {percentualServicosConcluidos}% da base.
                </Text>

                <Text style={styles.reportText}>
                  O indicador de retorno à rede está em{" "}
                  {percentualRetorno}%, com {clientesRetidos} cliente
                  {clientesRetidos === 1 ? "" : "s"} retido
                  {clientesRetidos === 1 ? "" : "s"}.
                </Text>

                <Text style={styles.reportText}>
                  A média de quilometragem atual é de{" "}
                  {mediaKm.toLocaleString("pt-BR")} km.
                </Text>

                <Text style={styles.reportText}>
                  Recomendação operacional: priorizar clientes com Retain Score alto, acompanhar os clientes de médio risco e medir a conversão entre contato, agendamento, conclusão do serviço e retenção.
                </Text>

                <Text style={styles.reportNote}>
                  O indicador de retorno à rede apresentado nesta versão é uma métrica operacional do protótipo. Com integração aos dados oficiais da rede autorizada, a solução pode apoiar o acompanhamento do VIN Share real.
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
    backgroundColor: "rgba(2, 8, 20, 0.80)",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 38,
    paddingTop: 28,
    paddingBottom: 60,
  },
  scrollContentMobile: {
    paddingHorizontal: 17,
    paddingTop: 20,
    paddingBottom: 50,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  back: {
    color: "#65A0FF",
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
  },
  titleMobile: {
    fontSize: 32,
  },
  subtitle: {
    color: "#93A8C3",
    fontSize: 16,
    marginTop: 7,
    marginBottom: 28,
  },
  subtitleMobile: {
    fontSize: 14,
    lineHeight: 21,
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
    gap: 16,
    marginBottom: 26,
  },
  gridMobile: {
    flexDirection: "column",
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(9, 19, 36, 0.88)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(101, 137, 187, 0.18)",
  },
  label: {
    color: "#93A8C3",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  number: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
  },
  numberMobile: {
    fontSize: 32,
  },
  cardHint: {
    color: "#7489A6",
    fontSize: 11,
    marginTop: 8,
  },
  orange: {
    color: "#FFB800",
  },
  green: {
    color: "#1ED760",
  },
  section: {
    backgroundColor: "rgba(9, 19, 36, 0.88)",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(101, 137, 187, 0.18)",
    marginBottom: 24,
  },
  sectionMobile: {
    padding: 18,
  },
  sectionSmall: {
    backgroundColor: "rgba(9, 19, 36, 0.88)",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(101, 137, 187, 0.18)",
    marginBottom: 24,
  },
  sectionSmallDesktop: {
    flex: 1,
  },
  sectionSmallMobile: {
    width: "100%",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },
  sectionTitleMobile: {
    fontSize: 19,
  },
  sectionDescription: {
    color: "#7F94AF",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 18,
    lineHeight: 18,
  },
  progressWrapper: {
    height: 14,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#0D2A52",
    marginBottom: 20,
  },
  progressAnimation: {
    height: "100%",
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 999,
  },
  progressBar: {
    height: "100%",
  },
  redBar: {
    backgroundColor: "#FF4D45",
  },
  yellowBar: {
    backgroundColor: "#FFB800",
  },
  greenBar: {
    backgroundColor: "#1ED760",
  },
  riskGrid: {
    flexDirection: "row",
    gap: 14,
  },
  riskGridMobile: {
    flexDirection: "column",
  },
  riskItem: {
    flex: 1,
    backgroundColor: "rgba(18, 31, 50, 0.84)",
    borderRadius: 14,
    padding: 16,
  },
  riskTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 7,
  },
  riskDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  redDot: {
    backgroundColor: "#FF4D45",
  },
  yellowDot: {
    backgroundColor: "#FFB800",
  },
  greenDot: {
    backgroundColor: "#1ED760",
  },
  riskLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  riskValue: {
    color: "#93A8C3",
    fontSize: 13,
  },
  funnelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    flexWrap: "wrap",
  },
  funnelHeaderMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0,
  },
  funnelTitleArea: {
    flex: 1,
  },
  prototypeBadge: {
    backgroundColor: "rgba(30, 215, 96, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(30, 215, 96, 0.30)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginBottom: 18,
  },
  prototypeBadgeText: {
    color: "#65E58F",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  funnelItem: {
    marginBottom: 17,
  },
  funnelItemLast: {
    marginBottom: 24,
  },
  funnelTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  funnelLabel: {
    color: "#B7C6DA",
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
  },
  funnelLabelStrong: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    flexShrink: 1,
  },
  funnelValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    flexShrink: 0,
  },
  funnelValueStrong: {
    color: "#1ED760",
    fontSize: 15,
    fontWeight: "900",
    flexShrink: 0,
  },
  funnelTrack: {
    height: 9,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  funnelFill: {
    height: "100%",
    borderRadius: 999,
  },
  funnelBlue: {
    backgroundColor: "#0057FF",
  },
  funnelLightBlue: {
    backgroundColor: "#65A0FF",
  },
  funnelOrange: {
    backgroundColor: "#FFB800",
  },
  funnelGreen: {
    backgroundColor: "#1ED760",
  },
  returnBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    backgroundColor: "rgba(30, 215, 96, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(30, 215, 96, 0.25)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  returnBoxMobile: {
    alignItems: "flex-start",
  },
  returnTextArea: {
    flex: 1,
  },
  returnLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  returnDescription: {
    color: "#8FA5BF",
    fontSize: 11,
    lineHeight: 17,
  },
  returnValue: {
    color: "#1ED760",
    fontSize: 32,
    fontWeight: "900",
    flexShrink: 0,
  },
  vinShareNote: {
    color: "#8095AF",
    fontSize: 11,
    lineHeight: 18,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 18,
    alignItems: "flex-start",
  },
  twoColumnsMobile: {
    flexDirection: "column",
    gap: 0,
    width: "100%",
  },
  criticalClient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(18, 31, 50, 0.84)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    gap: 12,
  },
  criticalTextArea: {
    flex: 1,
  },
  criticalClientName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 3,
  },
  criticalClientInfo: {
    color: "#8499B4",
    fontSize: 11,
  },
  criticalClientScore: {
    color: "#FF6B64",
    fontSize: 20,
    fontWeight: "900",
    flexShrink: 0,
  },
  metricRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    gap: 12,
  },
  metricRowLast: {
    borderBottomWidth: 0,
  },
  metricLabel: {
    color: "#A9BAD0",
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },
  metricValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    flexShrink: 0,
    textAlign: "right",
  },
  row: {
    color: "#D7E3F4",
    fontSize: 14,
    lineHeight: 22,
  },
  insightBox: {
    backgroundColor: "rgba(0, 87, 255, 0.10)",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 87, 255, 0.38)",
    marginBottom: 24,
  },
  insightBoxMobile: {
    padding: 18,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  insightHeaderMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  insightTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
  },
  insightTitleMobile: {
    fontSize: 20,
  },
  modelBadge: {
    backgroundColor: "rgba(0, 87, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(74, 135, 255, 0.45)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  modelBadgeText: {
    color: "#75A8FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
  insightText: {
    color: "#D0DDED",
    fontSize: 15,
    lineHeight: 24,
  },
  reportButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: "center",
  },
  reportButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  reportBox: {
    backgroundColor: "rgba(9, 19, 36, 0.92)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(0, 87, 255, 0.45)",
    marginTop: 18,
    marginBottom: 40,
  },
  reportTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 14,
  },
  reportTitleMobile: {
    fontSize: 19,
  },
  reportText: {
    color: "#C3D1E3",
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 10,
  },
  reportNote: {
    color: "#8095AF",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 6,
  },
});