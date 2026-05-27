import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { buscarClientePorId, criarAgendamento } from "../services/api";

export default function Agendamento() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [cliente, setCliente] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  const [unidade, setUnidade] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [servico, setServico] = useState("");
  const [observacao, setObservacao] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    async function carregarCliente() {
      try {
        const dados = await buscarClientePorId(id as string);
        setCliente(dados);
      } catch (erro) {
        console.log("Erro ao carregar cliente:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarCliente();
  }, [id]);

  async function confirmarAgendamento() {
    try {
      await criarAgendamento({
        clienteId: cliente.id,
        unidade,
        data,
        horario,
        servico,
        observacao,
      });

      setConfirmado(true);

      setTimeout(() => {
        router.replace("/agendamentos");
      }, 1200);
    } catch (erro) {
      console.log("Erro ao criar agendamento:", erro);
    }
  }

  if (carregando) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Carregando cliente...
        </Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Cliente não encontrado.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={isMobile && styles.scrollMobile}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        onPress={() =>
          router.replace({
            pathname: "/detalhes",
            params: { id: cliente.id },
          })
        }
      >
        <Text style={styles.back}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={[styles.title, isMobile && styles.titleMobile]}>
        Agendar revisão
      </Text>

      <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
        Preencha as informações para registrar o agendamento do cliente.
      </Text>

      <View style={[styles.clientCard, isMobile && styles.cardMobile]}>
        <Text style={[styles.clientName, isMobile && styles.clientNameMobile]}>
          {cliente.nome}
        </Text>

        <Text style={styles.clientInfo}>{cliente.modelo}</Text>

        <Text style={styles.clientInfo}>
          {cliente.km.toLocaleString("pt-BR")} km • {cliente.cidade}
        </Text>
      </View>

      <View style={[styles.formCard, isMobile && styles.cardMobile]}>
        <Text style={styles.label}>Unidade / concessionária</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Ford Center Morumbi"
          placeholderTextColor="#7F91AA"
          value={unidade}
          onChangeText={setUnidade}
        />

        <View style={[styles.inputRow, isMobile && styles.inputRowMobile]}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 28/05/2026"
              placeholderTextColor="#7F91AA"
              value={data}
              onChangeText={setData}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horário</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 14:30"
              placeholderTextColor="#7F91AA"
              value={horario}
              onChangeText={setHorario}
            />
          </View>
        </View>

        <Text style={styles.label}>Tipo de serviço</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Revisão preventiva"
          placeholderTextColor="#7F91AA"
          value={servico}
          onChangeText={setServico}
        />

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ex: Cliente solicitou avaliação dos freios."
          placeholderTextColor="#7F91AA"
          multiline
          value={observacao}
          onChangeText={setObservacao}
        />

        <TouchableOpacity style={styles.button} onPress={confirmarAgendamento}>
          <Text style={styles.buttonText}>Confirmar agendamento</Text>
        </TouchableOpacity>
      </View>

      {confirmado && (
        <View style={[styles.successBox, isMobile && styles.cardMobile]}>
          <Text style={[styles.successTitle, isMobile && styles.successTitleMobile]}>
            Agendamento confirmado
          </Text>

          <Text style={styles.successText}>
            Revisão agendada para {cliente.nome} em{" "}
            {data || "data não informada"} às{" "}
            {horario || "horário não informado"}.
          </Text>

          <Text style={styles.successText}>
            Unidade: {unidade || "não informada"}
          </Text>

          <Text style={styles.successText}>
            Serviço: {servico || "não informado"}
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

  input: {
    backgroundColor: "#0A1A33",
    borderWidth: 1,
    borderColor: "#0D2A52",
    borderRadius: 14,
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

  button: {
    backgroundColor: "#0057FF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
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