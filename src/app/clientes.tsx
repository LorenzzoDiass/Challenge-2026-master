import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
} from "react-native";

import { useEffect, useState } from "react";
import { router } from "expo-router";
import { buscarClientes } from "../services/api";

export default function Clientes() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  const numColumns = isMobile ? 1 : isTablet ? 2 : 3;
  const cardWidth = isMobile ? "100%" : isTablet ? "48%" : "32%";

  const [clientes, setClientes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("TODOS");

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

  const clientesFiltrados = clientes.filter((cliente) => {
    const textoBusca = busca.toLowerCase();

    const bateComBusca =
      cliente.nome?.toLowerCase().includes(textoBusca) ||
      cliente.modelo?.toLowerCase().includes(textoBusca) ||
      cliente.cidade?.toLowerCase().includes(textoBusca);

    const bateComFiltro = filtro === "TODOS" || cliente.risco === filtro;

    return bateComBusca && bateComFiltro;
  });

  if (carregando) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/dashboard")}
      >
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={[styles.title, isMobile && styles.titleMobile]}>
        Clientes e Veículos
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por cliente, veículo ou cidade..."
        placeholderTextColor="#7F91AA"
        value={busca}
        onChangeText={setBusca}
      />

      <View style={[styles.filters, isMobile && styles.filtersMobile]}>
        {["TODOS", "ALTO", "MÉDIO", "BAIXO"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              filtro === item && styles.filterButtonActive,
            ]}
            onPress={() => setFiltro(item)}
          >
            <Text
              style={[
                styles.filterText,
                filtro === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        key={numColumns}
        data={clientesFiltrados}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={!isMobile ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={() =>
              router.push({
                pathname: "/detalhes",
                params: { id: item.id },
              })
            }
          >
            <Image
              source={imagemDoCarro(item.modelo)}
              style={[styles.image, isMobile && styles.imageMobile]}
            />

            <View style={styles.badgesRow}>
              <View
                style={[
                  styles.badge,
                  item.risco === "ALTO"
                    ? styles.alto
                    : item.risco === "MÉDIO"
                    ? styles.medio
                    : styles.baixo,
                ]}
              >
                <Text style={styles.badgeText}>{item.risco}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  item.status === "SEM CONTATO"
                    ? styles.semContato
                    : item.status === "CONTATO REALIZADO"
                    ? styles.contato
                    : item.status === "REVISÃO AGENDADA"
                    ? styles.agendado
                    : styles.recuperado,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.modelo}>{item.modelo}</Text>

            <Text style={styles.info}>KM: {item.km}</Text>
            <Text style={styles.info}>Ano: {item.ano}</Text>

            <Text style={styles.info}>
              Cidade: {item.cidade || "Não informado"}
            </Text>

            <Text style={styles.info}>
              Telefone: {item.telefone || "Não informado"}
            </Text>

            <Text style={styles.info}>
              E-mail: {item.email || "Não informado"}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/detalhes",
                  params: { id: item.id },
                })
              }
            >
              <Text style={styles.buttonText}>Ver detalhes</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B18",
    padding: 20,
  },

  containerMobile: {
    padding: 16,
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    marginBottom: 14,
  },

  backText: {
    color: "#1D6BFF",
    fontSize: 18,
    fontWeight: "700",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 46,
    fontWeight: "900",
    marginBottom: 24,
  },

  titleMobile: {
    fontSize: 32,
  },

  searchInput: {
    backgroundColor: "#07162E",
    borderWidth: 1,
    borderColor: "#0D2A52",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
  },

  filters: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 26,
    flexWrap: "wrap",
  },

  filtersMobile: {
    gap: 8,
  },

  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "#07162E",
    borderWidth: 1,
    borderColor: "#0D2A52",
  },

  filterButtonActive: {
    backgroundColor: "#0057FF",
    borderColor: "#0057FF",
  },

  filterText: {
    color: "#9FB2CC",
    fontWeight: "800",
    fontSize: 13,
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  row: {
    gap: 18,
    marginBottom: 22,
    justifyContent: "flex-start",
  },

  card: {
    backgroundColor: "#07162E",
    borderRadius: 24,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#0D2A52",
  },

  image: {
    width: "100%",
    height: 170,
    borderRadius: 18,
    marginBottom: 16,
  },

  imageMobile: {
    height: 190,
  },

  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },

  alto: {
    backgroundColor: "#FF3B30",
  },

  medio: {
    backgroundColor: "#FFC107",
  },

  baixo: {
    backgroundColor: "#28D764",
  },

  statusBadge: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: "flex-start",
  },

  statusText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 11,
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

  nome: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },

  modelo: {
    color: "#A8B7CC",
    fontSize: 16,
    marginBottom: 14,
  },

  info: {
    color: "#D7E2F0",
    fontSize: 15,
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#0D5EFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  emptyText: {
    color: "#9FB2CC",
    fontSize: 18,
    marginTop: 20,
  },
});