import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import {
  atualizarQuilometragem,
  buscarClientePorId,
} from "../services/api";

export default function MeuFord() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const CLIENTE_ID = "1";

  const [quilometragem, setQuilometragem] = useState(0);
  const [novaQuilometragem, setNovaQuilometragem] = useState("");
  const [editandoKm, setEditandoKm] = useState(false);
  const [erroKm, setErroKm] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvandoKm, setSalvandoKm] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | BUSCAR DADOS DO CLIENTE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    carregarCliente();
  }, []);

  async function carregarCliente() {
    try {
      setCarregando(true);
      setErroKm("");

      const cliente = await buscarClientePorId(CLIENTE_ID);
      const kmAtual = Number(cliente.km);

      setQuilometragem(kmAtual);
      setNovaQuilometragem(String(kmAtual));
    } catch (erro) {
      console.log("Erro ao carregar cliente:", erro);

      setErroKm(
        "Não foi possível carregar os dados do veículo."
      );
    } finally {
      setCarregando(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SALVAR QUILOMETRAGEM
  |--------------------------------------------------------------------------
  */

  async function salvarQuilometragem() {
    const apenasNumeros = novaQuilometragem.replace(/\D/g, "");
    const valor = Number(apenasNumeros);

    if (!valor || valor <= 0) {
      setErroKm("Digite uma quilometragem válida.");
      return;
    }

    if (valor < quilometragem) {
      setErroKm(
        `A quilometragem não pode ser menor que ${quilometragem.toLocaleString(
          "pt-BR"
        )} km.`
      );
      return;
    }

    try {
      setSalvandoKm(true);
      setErroKm("");

      const resposta = await atualizarQuilometragem(
        CLIENTE_ID,
        valor
      );

      const kmAtualizado = Number(
        resposta.cliente?.km ?? valor
      );

      setQuilometragem(kmAtualizado);
      setNovaQuilometragem(String(kmAtualizado));
      setEditandoKm(false);
    } catch (erro: any) {
      console.log(
        "Erro ao atualizar quilometragem:",
        erro
      );

      setErroKm(
        erro.message ||
          "Não foi possível atualizar a quilometragem."
      );
    } finally {
      setSalvandoKm(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CANCELAR EDIÇÃO
  |--------------------------------------------------------------------------
  */

  function cancelarEdicao() {
    setNovaQuilometragem(String(quilometragem));
    setErroKm("");
    setEditandoKm(false);
  }

  /*
  |--------------------------------------------------------------------------
  | CARREGAMENTO
  |--------------------------------------------------------------------------
  */

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Carregando seu veículo...
        </Text>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | TELA
  |--------------------------------------------------------------------------
  */

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
          <Text style={styles.badge}>
            Área do cliente
          </Text>

          <Text
            style={[
              styles.title,
              isMobile && styles.titleMobile,
            ]}
          >
            Olá, Marcos
          </Text>

          <Text style={styles.subtitle}>
            Acompanhe seu veículo e seus serviços Ford
          </Text>
        </View>

        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.exitButtonText}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>

      {/* VEÍCULO */}

      <View
        style={[
          styles.vehicleCard,
          isMobile && styles.vehicleCardMobile,
        ]}
      >
        <View style={styles.vehicleTop}>
          <View style={styles.vehicleContent}>
            <Text style={styles.label}>
              MEU VEÍCULO
            </Text>

            <Text
              style={[
                styles.vehicleName,
                isMobile && styles.vehicleNameMobile,
              ]}
            >
              Ford Ranger Raptor
            </Text>

            <Text style={styles.vehicleInfo}>
              2022
            </Text>
          </View>

          <View style={styles.vehicleBadge}>
            <Text style={styles.vehicleBadgeText}>
              FORD
            </Text>
          </View>
        </View>

        {/* QUILOMETRAGEM */}

        <View style={styles.mileageBox}>
          <View style={styles.mileageHeader}>
            <View>
              <Text style={styles.mileageLabel}>
                QUILOMETRAGEM ATUAL
              </Text>

              <Text style={styles.mileageValue}>
                {quilometragem.toLocaleString(
                  "pt-BR"
                )}{" "}
                km
              </Text>

              <Text style={styles.mileageUpdateText}>
                Informada pelo proprietário
              </Text>
            </View>

            {!editandoKm && (
              <TouchableOpacity
                style={styles.updateMileageButton}
                onPress={() => {
                  setNovaQuilometragem(
                    String(quilometragem)
                  );

                  setErroKm("");
                  setEditandoKm(true);
                }}
              >
                <Text
                  style={
                    styles.updateMileageButtonText
                  }
                >
                  Atualizar quilometragem
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {editandoKm && (
            <View style={styles.mileageEditor}>
              <Text style={styles.inputLabel}>
                Informe a quilometragem atual
              </Text>

              <TextInput
                style={styles.mileageInput}
                value={novaQuilometragem}
                onChangeText={(texto) => {
                  setNovaQuilometragem(texto);
                  setErroKm("");
                }}
                keyboardType="numeric"
                placeholder="Ex: 99500"
                placeholderTextColor="#6E829E"
                editable={!salvandoKm}
              />

              {erroKm !== "" && (
                <Text style={styles.errorText}>
                  {erroKm}
                </Text>
              )}

              <View
                style={[
                  styles.editorButtons,
                  isMobile &&
                    styles.editorButtonsMobile,
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    salvandoKm &&
                      styles.disabledButton,
                  ]}
                  onPress={salvarQuilometragem}
                  disabled={salvandoKm}
                >
                  {salvandoKm ? (
                    <ActivityIndicator />
                  ) : (
                    <Text
                      style={styles.saveButtonText}
                    >
                      Salvar quilometragem
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelarEdicao}
                  disabled={salvandoKm}
                >
                  <Text
                    style={styles.cancelButtonText}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <Text style={styles.statusTitle}>
          Revisão recomendada
        </Text>

        <Text style={styles.statusText}>
          Seu veículo está próximo da quilometragem
          indicada para a próxima manutenção
          preventiva.
        </Text>

        <View
          style={[
            styles.infoRow,
            isMobile && styles.infoRowMobile,
          ]}
        >
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>
              Próxima revisão
            </Text>

            <Text style={styles.infoValue}>
              100.000 km
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>
              Última revisão
            </Text>

            <Text style={styles.infoValue}>
              15/08/2025
            </Text>
          </View>
        </View>
      </View>

      {/* BENEFÍCIO */}

      <View style={styles.benefitCard}>
        <Text style={styles.benefitSmall}>
          BENEFÍCIO EXCLUSIVO
        </Text>

        <Text
          style={[
            styles.benefitTitle,
            isMobile && styles.benefitTitleMobile,
          ]}
        >
          10% OFF na revisão preventiva
        </Text>

        <Text style={styles.benefitText}>
          Benefício personalizado para manter seu
          veículo em dia na rede autorizada Ford.
        </Text>

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
          <Text style={styles.primaryButtonText}>
            Agendar revisão
          </Text>
        </TouchableOpacity>
      </View>

      {/* SERVIÇOS */}

      <Text style={styles.sectionTitle}>
        Meu relacionamento com a Ford
      </Text>

      <View
        style={[
          styles.cardsGrid,
          isMobile && styles.cardsGridMobile,
        ]}
      >
        <TouchableOpacity style={styles.smallCard}>
          <Text style={styles.cardLabel}>
            MANUTENÇÃO
          </Text>

          <Text style={styles.smallCardTitle}>
            Histórico de revisões
          </Text>

          <Text style={styles.smallCardText}>
            Consulte os serviços realizados no seu
            veículo pela rede autorizada Ford.
          </Text>

          <Text style={styles.cardLink}>
            Consultar histórico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallCard}>
          <Text style={styles.cardLabel}>
            VANTAGENS
          </Text>

          <Text style={styles.smallCardTitle}>
            Meus benefícios
          </Text>

          <Text style={styles.smallCardText}>
            Consulte ofertas e vantagens
            personalizadas disponíveis para você.
          </Text>

          <Text style={styles.cardLink}>
            Ver benefícios
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallCard}
          onPress={() =>
            router.push("/meus-agendamentos")
          }
        >
          <Text style={styles.cardLabel}>
            SERVIÇOS
          </Text>

          <Text style={styles.smallCardTitle}>
            Meus agendamentos
          </Text>

          <Text style={styles.smallCardText}>
            Acompanhe as próximas revisões e serviços
            agendados para seu veículo.
          </Text>

          <Text style={styles.cardLink}>
            Ver agendamentos
          </Text>
        </TouchableOpacity>
      </View>

      {/* RODAPÉ */}

      <View style={styles.footerBox}>
        <Text style={styles.footerTitle}>
          Ford Retain
        </Text>

        <Text style={styles.footerText}>
          Uma experiência de pós-venda pensada para
          manter você e seu Ford sempre conectados.
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

  loadingContainer: {
    flex: 1,
    backgroundColor: "#020B18",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  loadingText: {
    color: "#9FB2CC",
    fontSize: 15,
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 30,
  },

  headerContent: {
    flex: 1,
  },

  badge: {
    color: "#4C8DFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
  },

  titleMobile: {
    fontSize: 30,
  },

  subtitle: {
    color: "#9FB2CC",
    fontSize: 16,
    marginTop: 8,
  },

  exitButton: {
    backgroundColor: "#0A1E3B",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#173B70",
  },

  exitButtonText: {
    color: "#DCE9FF",
    fontWeight: "800",
  },

  vehicleCard: {
    backgroundColor: "#07162E",
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 22,
  },

  vehicleCardMobile: {
    padding: 20,
    borderRadius: 22,
  },

  vehicleTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },

  vehicleContent: {
    flex: 1,
  },

  label: {
    color: "#4C8DFF",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },

  vehicleName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  vehicleNameMobile: {
    fontSize: 22,
  },

  vehicleInfo: {
    color: "#9FB2CC",
    fontSize: 16,
    marginTop: 6,
  },

  vehicleBadge: {
    backgroundColor: "#0057FF",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  vehicleBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  mileageBox: {
    backgroundColor: "#0A1E3B",
    borderRadius: 18,
    padding: 20,
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#173B70",
  },

  mileageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },

  mileageLabel: {
    color: "#8FA4C0",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },

  mileageValue: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },

  mileageUpdateText: {
    color: "#7187A5",
    fontSize: 12,
    marginTop: 5,
  },

  updateMileageButton: {
    borderWidth: 1,
    borderColor: "#4C8DFF",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  updateMileageButtonText: {
    color: "#4C8DFF",
    fontSize: 13,
    fontWeight: "800",
  },

  mileageEditor: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#17304F",
  },

  inputLabel: {
    color: "#C7D4E7",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  mileageInput: {
    backgroundColor: "#07162E",
    borderWidth: 1,
    borderColor: "#23466F",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 16,
    outlineStyle: "none",
  } as any,

  errorText: {
    color: "#FF7B7B",
    fontSize: 13,
    marginTop: 8,
  },

  editorButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  editorButtonsMobile: {
    flexDirection: "column",
  },

  saveButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  cancelButton: {
    backgroundColor: "#07162E",
    borderWidth: 1,
    borderColor: "#23466F",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#B7C8DE",
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: "#17304F",
    marginVertical: 22,
  },

  statusTitle: {
    color: "#FFCC4D",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },

  statusText: {
    color: "#C7D4E7",
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 720,
  },

  infoRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 24,
  },

  infoRowMobile: {
    flexDirection: "column",
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#0A1E3B",
    borderRadius: 16,
    padding: 18,
  },

  infoLabel: {
    color: "#8FA4C0",
    fontSize: 13,
    marginBottom: 6,
  },

  infoValue: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  benefitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 28,
    marginBottom: 30,
  },

  benefitSmall: {
    color: "#0057FF",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8,
  },

  benefitTitle: {
    color: "#06182E",
    fontSize: 28,
    fontWeight: "900",
  },

  benefitTitleMobile: {
    fontSize: 23,
  },

  benefitText: {
    color: "#5F7086",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    maxWidth: 720,
  },

  primaryButton: {
    backgroundColor: "#0057FF",
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignSelf: "flex-start",
    marginTop: 22,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
  },

  cardsGrid: {
    flexDirection: "row",
    gap: 16,
  },

  cardsGridMobile: {
    flexDirection: "column",
  },

  smallCard: {
    flex: 1,
    backgroundColor: "#07162E",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#0D2A52",
  },

  cardLabel: {
    color: "#4C8DFF",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 14,
  },

  smallCardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  smallCardText: {
    color: "#9FB2CC",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },

  cardLink: {
    color: "#4C8DFF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 20,
  },

  footerBox: {
    marginTop: 30,
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