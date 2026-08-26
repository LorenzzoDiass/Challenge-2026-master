import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  useWindowDimensions,
} from "react-native";

import { router } from "expo-router";
import { useState } from "react";

import { fazerLogin } from "../services/api";

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    try {
      setErro("");
      setCarregando(true);

      await fazerLogin(email, senha);

      router.push("/dashboard");
    } catch (erro: any) {
      setErro(
        erro.message || "Não foi possível realizar o login."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/images/ranger.bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay} />

      <View
        style={[
          styles.contentWrapper,
          isMobile && styles.contentWrapperMobile,
        ]}
      >
        <View
          style={[
            styles.leftContent,
            isMobile && styles.leftContentMobile,
          ]}
        >
          <Text style={styles.badge}>
            Pós-venda inteligente
          </Text>

          <Text
            style={[
              styles.heroTitle,
              isMobile && styles.heroTitleMobile,
            ]}
          >
            Ford Retain
          </Text>

          <View style={styles.line} />

          <Text
            style={[
              styles.heroText,
              isMobile && styles.heroTextMobile,
            ]}
          >
            Monitore clientes, acompanhe veículos e priorize
            contatos de revisão com base no risco de abandono.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            isMobile && styles.cardMobile,
          ]}
        >
          <Image
            source={require("../assets/images/logo.fordd.png")}
            style={[
              styles.logo,
              isMobile && styles.logoMobile,
            ]}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.cardTitle,
              isMobile && styles.cardTitleMobile,
            ]}
          >
            Acesse o painel
          </Text>

          <Text style={styles.cardSubtitle}>
            Área interna Ford
          </Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail corporativo"
            placeholderTextColor="#8EA4C2"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor="#8EA4C2"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Text style={styles.eyeText}>
                {mostrarSenha ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          </View>

          {erro !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {erro}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              carregando && styles.buttonDisabled,
            ]}
            onPress={entrar}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>
              {carregando
                ? "Entrando..."
                : "Entrar no Sistema"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Acesso exclusivo para equipe de pós-venda
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/cadastro")}
          >
            <Text style={styles.registerLink}>
              Primeiro acesso? Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    minHeight: "100%",
    backgroundColor: "#020B18",
  },

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(1, 10, 22, 0.78)",
  },

  contentWrapper: {
    flex: 1,
    width: "100%",
    minHeight: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 80,
    paddingHorizontal: 28,
    paddingVertical: 40,
    zIndex: 2,
  },

  contentWrapperMobile: {
    flexDirection: "column",
    gap: 32,
    paddingHorizontal: 20,
    paddingVertical: 36,
    justifyContent: "center",
  },

  leftContent: {
    maxWidth: 560,
  },

  leftContentMobile: {
    maxWidth: "100%",
    alignItems: "center",
  },

  badge: {
    color: "#DCE9FF",
    fontSize: 22,
    marginBottom: 22,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 82,
    fontWeight: "900",
    marginBottom: 24,
  },

  heroTitleMobile: {
    fontSize: 44,
    textAlign: "center",
    marginBottom: 18,
  },

  line: {
    width: 90,
    height: 4,
    backgroundColor: "#0057FF",
    borderRadius: 999,
    marginBottom: 30,
  },

  heroText: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 38,
    maxWidth: 560,
  },

  heroTextMobile: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    maxWidth: 360,
  },

  card: {
    width: 520,
    backgroundColor: "#FFFFFF",
    borderRadius: 34,
    paddingVertical: 54,
    paddingHorizontal: 46,
    zIndex: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 18,
    },

    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },

  cardMobile: {
    width: "100%",
    maxWidth: 390,
    borderRadius: 28,
    paddingVertical: 34,
    paddingHorizontal: 24,
  },

  logo: {
    width: 330,
    height: 130,
    alignSelf: "center",
    marginBottom: 16,
  },

  logoMobile: {
    width: 230,
    height: 90,
    marginBottom: 12,
  },

  cardTitle: {
    color: "#06182E",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  cardTitleMobile: {
    fontSize: 26,
  },

  cardSubtitle: {
    color: "#6B7D94",
    fontSize: 17,
    textAlign: "center",
    marginBottom: 34,
  },

  input: {
    backgroundColor: "#F6F8FB",
    borderWidth: 1,
    borderColor: "#D7E0EC",
    borderRadius: 14,
    paddingVertical: 17,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 16,
    color: "#06182E",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FB",
    borderWidth: 1,
    borderColor: "#D7E0EC",
    borderRadius: 14,
    marginBottom: 16,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 17,
    paddingLeft: 18,
    paddingRight: 8,
    fontSize: 16,
    color: "#06182E",
    outlineStyle: "none",
  } as any,

  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  eyeText: {
    fontSize: 19,
  },

  errorBox: {
    backgroundColor: "#FFF1F0",
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },

  errorText: {
    color: "#D93025",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  button: {
    backgroundColor: "#0057FF",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  helperText: {
    color: "#7B8BA3",
    textAlign: "center",
    fontSize: 14,
    marginTop: 24,
  },

  registerLink: {
    color: "#0057FF",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 14,
  },
});