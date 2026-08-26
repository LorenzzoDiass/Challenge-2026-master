import { router } from "expo-router";
import { useState } from "react";

import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { criarUsuario } from "../services/api";

export default function Cadastro() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [
    mostrarConfirmarSenha,
    setMostrarConfirmarSenha,
  ] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] =
    useState(false);

  function emailValido(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  }

  async function cadastrar() {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (
      !nomeLimpo ||
      !emailLimpo ||
      !senha ||
      !confirmarSenha
    ) {
      setErro("Preencha todos os campos.");
      setSucesso("");
      return;
    }

    if (nomeLimpo.length < 3) {
      setErro("Digite um nome válido.");
      setSucesso("");
      return;
    }

    if (!emailValido(emailLimpo)) {
      setErro("Digite um e-mail válido.");
      setSucesso("");
      return;
    }

    if (senha.length < 6) {
      setErro(
        "A senha deve ter pelo menos 6 caracteres."
      );
      setSucesso("");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      setSucesso("");
      return;
    }

    try {
      setErro("");
      setSucesso("");
      setCarregando(true);

      await criarUsuario(
        nomeLimpo,
        emailLimpo,
        senha
      );

      setSucesso("Conta criada com sucesso.");

      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      setTimeout(() => {
        router.replace("/");
      }, 1200);
    } catch (erro: any) {
      setErro(
        erro.message ||
          "Não foi possível criar a conta."
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
            Crie seu acesso para utilizar o sistema de
            retenção e gestão de clientes do pós-venda Ford.
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
            Criar conta
          </Text>

          <Text style={styles.cardSubtitle}>
            Cadastro da equipe de pós-venda
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#8EA4C2"
            value={nome}
            onChangeText={setNome}
          />

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
              onPress={() =>
                setMostrarSenha(!mostrarSenha)
              }
            >
              <Text style={styles.eyeText}>
                {mostrarSenha ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar senha"
              placeholderTextColor="#8EA4C2"
              secureTextEntry={!mostrarConfirmarSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() =>
                setMostrarConfirmarSenha(
                  !mostrarConfirmarSenha
                )
              }
            >
              <Text style={styles.eyeText}>
                {mostrarConfirmarSenha
                  ? "🙈"
                  : "👁️"}
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

          {sucesso !== "" && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                {sucesso}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              carregando && styles.buttonDisabled,
            ]}
            onPress={cadastrar}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>
              {carregando
                ? "Criando conta..."
                : "Criar conta"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/")}
          >
            <Text style={styles.loginLink}>
              Já possui uma conta? Entrar
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
    paddingVertical: 46,
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
    width: 260,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },

  logoMobile: {
    width: 210,
    height: 80,
  },

  cardTitle: {
    color: "#06182E",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  cardTitleMobile: {
    fontSize: 26,
  },

  cardSubtitle: {
    color: "#6B7D94",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
  },

  input: {
    backgroundColor: "#F6F8FB",
    borderWidth: 1,
    borderColor: "#D7E0EC",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 14,
    color: "#06182E",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FB",
    borderWidth: 1,
    borderColor: "#D7E0EC",
    borderRadius: 14,
    marginBottom: 14,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
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
    marginBottom: 10,
  },

  errorText: {
    color: "#D93025",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  successBox: {
    backgroundColor: "#ECFFF2",
    borderWidth: 1,
    borderColor: "#28D764",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  successText: {
    color: "#138A3D",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  button: {
    backgroundColor: "#0057FF",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  loginLink: {
    color: "#0057FF",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 22,
  },
});