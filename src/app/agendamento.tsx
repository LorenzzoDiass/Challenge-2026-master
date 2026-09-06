import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

import {
  buscarClientePorId,
  buscarConcessionarias,
  criarAgendamento,
} from "../services/api";

export default function Agendamento() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const origem = Array.isArray(params.origem) ? params.origem[0] : params.origem;

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const veioDoCliente = origem === "cliente";

  const [cliente, setCliente] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [concessionarias, setConcessionarias] = useState<string[]>([]);
  const [unidade, setUnidade] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horarioSelecionado, setHorarioSelecionado] = useState(new Date());
  const [dataWeb, setDataWeb] = useState("");
  const [horarioWeb, setHorarioWeb] = useState("");
  const [servico, setServico] = useState("");
  const [observacao, setObservacao] = useState("");
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarHorario, setMostrarHorario] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [erroFormulario, setErroFormulario] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        if (!id) {
          setCliente(null);
          return;
        }

        const [dadosCliente, dadosConcessionarias] = await Promise.all([
          buscarClientePorId(id),
          buscarConcessionarias(),
        ]);

        setCliente(dadosCliente);
        setConcessionarias(dadosConcessionarias);
      } catch (erro) {
        console.log("Erro ao carregar dados:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id]);

  function formatarData(data: Date) {
    return data.toLocaleDateString("pt-BR");
  }

  function formatarHorario(data: Date) {
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatarDataWeb(data: string) {
    if (!data) return "";
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function alterarData(event: any, data?: Date) {
    setMostrarCalendario(false);

    if (data) {
      setDataSelecionada(data);
    }
  }

  function alterarHorario(event: any, data?: Date) {
    setMostrarHorario(false);

    if (data) {
      setHorarioSelecionado(data);
    }
  }

  function voltar() {
    if (veioDoCliente) {
      router.replace("/meus-agendamentos");
      return;
    }

    router.replace({
      pathname: "/detalhes",
      params: { id: cliente.id },
    });
  }

  async function confirmarAgendamento() {
    const dataFinal =
      Platform.OS === "web"
        ? formatarDataWeb(dataWeb)
        : formatarData(dataSelecionada);

    const horarioFinal =
      Platform.OS === "web"
        ? horarioWeb
        : formatarHorario(horarioSelecionado);

    if (!unidade || !servico || !dataFinal || !horarioFinal) {
      setErroFormulario("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setEnviando(true);
      setErroFormulario("");

      await criarAgendamento({
        clienteId: cliente.id,
        unidade,
        data: dataFinal,
        horario: horarioFinal,
        servico,
        observacao,
      });

      setConfirmado(true);

      setTimeout(() => {
        if (veioDoCliente) {
          router.replace("/meus-agendamentos");
        } else {
          router.replace("/agendamentos");
        }
      }, 1200);
    } catch (erro: any) {
      console.log("Erro ao criar agendamento:", erro);

      setErroFormulario(
        erro.message || "Não foi possível criar o agendamento."
      );

      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <View
        style={[
          styles.container,
          isMobile && styles.containerMobile,
        ]}
      >
        <Text
          style={[
            styles.title,
            isMobile && styles.titleMobile,
          ]}
        >
          Carregando cliente...
        </Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View
        style={[
          styles.container,
          isMobile && styles.containerMobile,
        ]}
      >
        <Text
          style={[
            styles.title,
            isMobile && styles.titleMobile,
          ]}
        >
          Cliente não encontrado.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        isMobile ? styles.scrollMobile : undefined
      }
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={voltar}>
        <Text style={styles.back}>Voltar</Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          isMobile && styles.titleMobile,
        ]}
      >
        Agendar revisão
      </Text>

      <Text
        style={[
          styles.subtitle,
          isMobile && styles.subtitleMobile,
        ]}
      >
        {veioDoCliente
          ? "Escolha a unidade, a data e o serviço para agendar sua revisão."
          : "Preencha as informações para registrar o agendamento do cliente."}
      </Text>

      <View
        style={[
          styles.clientCard,
          isMobile && styles.cardMobile,
        ]}
      >
        <Text
          style={[
            styles.clientName,
            isMobile && styles.clientNameMobile,
          ]}
        >
          {cliente.nome}
        </Text>

        <Text style={styles.clientInfo}>
          {cliente.modelo}
        </Text>

        <Text style={styles.clientInfo}>
          {cliente.km.toLocaleString("pt-BR")} km • {cliente.cidade}
        </Text>
      </View>

      <View
        style={[
          styles.formCard,
          isMobile && styles.cardMobile,
        ]}
      >
        <Text style={styles.label}>
          Unidade / concessionária *
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={unidade}
            onValueChange={(valor) => setUnidade(valor)}
            style={styles.picker}
            dropdownIconColor="#FFFFFF"
          >
            <Picker.Item
              label="Selecione uma concessionária"
              value=""
            />

            {concessionarias.map((item) => (
              <Picker.Item
                key={item}
                label={item}
                value={item}
              />
            ))}
          </Picker>
        </View>

        <View
          style={[
            styles.inputRow,
            isMobile && styles.inputRowMobile,
          ]}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data *</Text>

            {Platform.OS === "web" ? (
              <input
                type="date"
                value={dataWeb}
                min={new Date().toISOString().split("T")[0]}
                onChange={(event) =>
                  setDataWeb(event.target.value)
                }
                style={{
                  width: "100%",
                  height: 56,
                  backgroundColor: "#0A1A33",
                  border: "1px solid #0D2A52",
                  borderRadius: 14,
                  paddingLeft: 16,
                  paddingRight: 16,
                  color: "#FFFFFF",
                  fontSize: 16,
                  marginBottom: 18,
                  boxSizing: "border-box",
                  colorScheme: "dark",
                }}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() =>
                    setMostrarCalendario(true)
                  }
                >
                  <Text style={styles.selectorText}>
                    {formatarData(dataSelecionada)}
                  </Text>
                </TouchableOpacity>

                {mostrarCalendario && (
                  <DateTimePicker
                    value={dataSelecionada}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={alterarData}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horário *</Text>

            {Platform.OS === "web" ? (
              <input
                type="time"
                value={horarioWeb}
                onChange={(event) =>
                  setHorarioWeb(event.target.value)
                }
                style={{
                  width: "100%",
                  height: 56,
                  backgroundColor: "#0A1A33",
                  border: "1px solid #0D2A52",
                  borderRadius: 14,
                  paddingLeft: 16,
                  paddingRight: 16,
                  color: "#FFFFFF",
                  fontSize: 16,
                  marginBottom: 18,
                  boxSizing: "border-box",
                  colorScheme: "dark",
                }}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.selectorButton}
                  onPress={() =>
                    setMostrarHorario(true)
                  }
                >
                  <Text style={styles.selectorText}>
                    {formatarHorario(horarioSelecionado)}
                  </Text>
                </TouchableOpacity>

                {mostrarHorario && (
                  <DateTimePicker
                    value={horarioSelecionado}
                    mode="time"
                    display="default"
                    is24Hour
                    onChange={alterarHorario}
                  />
                )}
              </>
            )}
          </View>
        </View>

        <Text style={styles.label}>
          Tipo de serviço *
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={servico}
            onValueChange={(valor) => setServico(valor)}
            style={styles.picker}
            dropdownIconColor="#FFFFFF"
          >
            <Picker.Item
              label="Selecione o tipo de serviço"
              value=""
            />

            <Picker.Item
              label="Revisão preventiva"
              value="Revisão preventiva"
            />

            <Picker.Item
              label="Revisão periódica"
              value="Revisão periódica"
            />

            <Picker.Item
              label="Check-up completo"
              value="Check-up completo"
            />

            <Picker.Item
              label="Troca de óleo e filtros"
              value="Troca de óleo e filtros"
            />

            <Picker.Item
              label="Avaliação de freios"
              value="Avaliação de freios"
            />

            <Picker.Item
              label="Diagnóstico do veículo"
              value="Diagnóstico do veículo"
            />

            <Picker.Item
              label="Manutenção corretiva"
              value="Manutenção corretiva"
            />
          </Picker>
        </View>

        <Text style={styles.label}>
          Observações
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.textArea,
          ]}
          placeholder={
            veioDoCliente
              ? "Ex: Gostaria que verificassem os freios."
              : "Ex: Cliente solicitou avaliação dos freios."
          }
          placeholderTextColor="#7F91AA"
          multiline
          value={observacao}
          onChangeText={setObservacao}
        />

        {erroFormulario !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {erroFormulario}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            enviando && styles.buttonDisabled,
          ]}
          onPress={confirmarAgendamento}
          disabled={enviando}
        >
          <Text style={styles.buttonText}>
            {enviando
              ? "Confirmando..."
              : "Confirmar agendamento"}
          </Text>
        </TouchableOpacity>
      </View>

      {confirmado && (
        <View
          style={[
            styles.successBox,
            isMobile && styles.cardMobile,
          ]}
        >
          <Text
            style={[
              styles.successTitle,
              isMobile && styles.successTitleMobile,
            ]}
          >
            Agendamento confirmado
          </Text>

          <Text style={styles.successText}>
            {veioDoCliente
              ? "Sua revisão foi agendada com sucesso."
              : "Agendamento criado com sucesso."}
          </Text>
        </View>
      )}
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

  scrollMobile: {
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

  clientCard: {
    backgroundColor: "#07162E",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 24,
  },

  cardMobile: {
    borderRadius: 20,
    padding: 18,
  },

  clientName: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
  },

  clientNameMobile: {
    fontSize: 22,
  },

  clientInfo: {
    color: "#9FB2CC",
    fontSize: 16,
    marginBottom: 4,
  },

  formCard: {
    backgroundColor: "#07162E",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#0D2A52",
    marginBottom: 24,
  },

  inputRow: {
    flexDirection: "row",
    gap: 16,
  },

  inputRowMobile: {
    flexDirection: "column",
    gap: 0,
  },

  inputGroup: {
    flex: 1,
  },

  label: {
    color: "#D7E3F4",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },

  pickerWrapper: {
    backgroundColor: "#0A1A33",
    borderWidth: 1,
    borderColor: "#0D2A52",
    borderRadius: 14,
    marginBottom: 18,
    overflow: "hidden",
    minHeight: 56,
    justifyContent: "center",
  },

  picker: {
    color: "#FFFFFF",
    backgroundColor: "#0A1A33",
    height: 56,
    width: "100%",
  },

  selectorButton: {
    backgroundColor: "#0A1A33",
    borderWidth: 1,
    borderColor: "#0D2A52",
    borderRadius: 14,
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 18,
    justifyContent: "center",
  },

  selectorText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  input: {
    backgroundColor: "#0A1A33",
    borderWidth: 1,
    borderColor: "#0D2A52",
    borderRadius: 14,
    minHeight: 56,
    paddingVertical: 15,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 18,
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  errorBox: {
    backgroundColor: "rgba(255, 59, 48, 0.12)",
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  errorText: {
    color: "#FF6B63",
    fontSize: 14,
    fontWeight: "700",
  },

  button: {
    backgroundColor: "#0057FF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  successBox: {
    backgroundColor: "rgba(40, 215, 100, 0.14)",
    borderWidth: 1,
    borderColor: "#28D764",
    borderRadius: 24,
    padding: 24,
    marginBottom: 50,
  },

  successTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 12,
  },

  successTitleMobile: {
    fontSize: 21,
  },

  successText: {
    color: "#D7E3F4",
    fontSize: 16,
    lineHeight: 26,
  },
});