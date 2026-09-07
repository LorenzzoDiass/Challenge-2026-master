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

import { useState } from "react";
import { router } from "expo-router";

import {
  fazerLogin as fazerLoginApi,
} from "../services/api";

import {
  salvarUsuarioLogado,
  salvarToken,
} from "../services/sessionService";

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [tipoAcesso, setTipoAcesso] =
    useState<"inicio" | "funcionario">(
      "inicio"
    );

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");

  const [
    mostrarCredenciais,
    setMostrarCredenciais,
  ] = useState(false);

  const [entrando, setEntrando] =
    useState(false);

  const emailDemo =
    "funcionario@fordretain.com";

  const senhaDemo = "ford123";

  /*
  |--------------------------------------------------------------------------
  | LOGIN DO FUNCIONÁRIO
  |--------------------------------------------------------------------------
  */

  async function fazerLogin() {
    setErro("");

    if (
      !email.trim() ||
      !senha.trim()
    ) {
      setErro(
        "Preencha o e-mail e a senha."
      );

      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      );

    if (!emailValido) {
      setErro(
        "Digite um e-mail válido."
      );

      return;
    }

    try {
      setEntrando(true);

      /*
       * Envia o e-mail e a senha
       * para o backend.
       */

      const dados =
        await fazerLoginApi(
          email.trim(),
          senha
        );

      /*
       * O backend pode retornar:
       *
       * {
       *   mensagem: "...",
       *   usuario: {...}
       * }
       *
       * Por segurança também aceitamos
       * caso o próprio objeto retornado
       * já seja o usuário.
       */

      const usuario =
        dados.usuario || dados;

      if (
        !usuario ||
        !usuario.id ||
        !usuario.nome ||
        !usuario.email
      ) {
        throw new Error(
          "Não foi possível identificar o usuário."
        );
      }

      /*
       * Salva quem entrou.
       */

      await salvarUsuarioLogado({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      });

      if (!dados.token) {
        throw new Error("Token de acesso não recebido.");
      }

      await salvarToken(dados.token);

      /*
       * Vai para o painel.
       */

      router.replace("/dashboard");
    } catch (erro: any) {
      console.log(
        "Erro ao fazer login:",
        erro
      );

      setErro(
        erro?.message ||
        "Não foi possível realizar o login."
      );
    } finally {
      setEntrando(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CREDENCIAIS DE DEMONSTRAÇÃO
  |--------------------------------------------------------------------------
  */

  function usarCredenciaisDemo() {
    setEmail(emailDemo);
    setSenha(senhaDemo);
    setErro("");
  }

  /*
  |--------------------------------------------------------------------------
  | VOLTAR
  |--------------------------------------------------------------------------
  */

  function voltarInicio() {
    setTipoAcesso("inicio");

    setEmail("");
    setSenha("");
    setErro("");

    setMostrarCredenciais(false);
  }

  /*
  |--------------------------------------------------------------------------
  | TELA
  |--------------------------------------------------------------------------
  */

  return (
    <ImageBackground
      source={require("../assets/images/ranger.bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View
        style={styles.darkOverlay}
      />

      <View
        style={[
          styles.contentWrapper,
          isMobile &&
          styles.contentWrapperMobile,
        ]}
      >
        {/* LADO ESQUERDO */}

        <View
          style={[
            styles.leftContent,
            isMobile &&
            styles.leftContentMobile,
          ]}
        >
          <Text style={styles.badge}>
            Pós-venda inteligente
          </Text>

          <Text
            style={[
              styles.heroTitle,
              isMobile &&
              styles.heroTitleMobile,
            ]}
          >
            Ford Retain
          </Text>

          <View style={styles.line} />

          <Text
            style={[
              styles.heroText,
              isMobile &&
              styles.heroTextMobile,
            ]}
          >
            Monitore clientes, acompanhe
            veículos e priorize contatos de
            revisão com base no risco de
            abandono.
          </Text>
        </View>

        {/* CARD */}

        <View
          style={[
            styles.card,
            isMobile &&
            styles.cardMobile,
          ]}
        >
          <Image
            source={require("../assets/images/logo.fordd.png")}
            style={[
              styles.logo,
              isMobile &&
              styles.logoMobile,
            ]}
            resizeMode="contain"
          />

          {tipoAcesso === "inicio" ? (
            <>
              <Text
                style={
                  styles.welcomeSmall
                }
              >
                Bem-vindo ao
              </Text>

              <Text
                style={[
                  styles.cardTitle,
                  isMobile &&
                  styles.cardTitleMobile,
                ]}
              >
                Ford Retain
              </Text>

              <Text
                style={
                  styles.cardSubtitle
                }
              >
                Escolha seu tipo de acesso
              </Text>

              {/* FUNCIONÁRIO */}

              <View
                style={
                  styles.accessSection
                }
              >
                <Text
                  style={
                    styles.accessLabel
                  }
                >
                  ACESSO CORPORATIVO
                </Text>

                <Text
                  style={
                    styles.accessTitle
                  }
                >
                  Funcionário Ford
                </Text>

                <TouchableOpacity
                  style={
                    styles.primaryButton
                  }
                  onPress={() =>
                    setTipoAcesso(
                      "funcionario"
                    )
                  }
                >
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    Entrar no painel
                  </Text>
                </TouchableOpacity>
              </View>

              {/* DIVISOR */}

              <View
                style={styles.divider}
              >
                <View
                  style={
                    styles.dividerLine
                  }
                />
              </View>

              {/* CLIENTE */}

              <View
                style={
                  styles.accessSection
                }
              >
                <Text
                  style={
                    styles.accessLabel
                  }
                >
                  ÁREA DO PROPRIETÁRIO
                </Text>

                <Text
                  style={
                    styles.accessTitle
                  }
                >
                  Cliente Ford
                </Text>

                <TouchableOpacity
                  style={
                    styles.secondaryButton
                  }
                  onPress={() =>
                    router.push(
                      "/meu-ford"
                    )
                  }
                >
                  <Text
                    style={
                      styles.secondaryButtonText
                    }
                  >
                    Acessar Meu Ford
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={
                  styles.accessFooter
                }
              >
                Uma única plataforma para
                conectar a Ford ao cliente no
                pós-venda.
              </Text>
            </>
          ) : (
            <>
              {/* LOGIN CORPORATIVO */}

              <Text
                style={[
                  styles.cardTitle,
                  isMobile &&
                  styles.cardTitleMobile,
                ]}
              >
                Acesse o painel
              </Text>

              <Text
                style={
                  styles.cardSubtitle
                }
              >
                Área interna Ford
              </Text>

              {/* E-MAIL */}

              <TextInput
                style={[
                  styles.input,
                  erro &&
                    !email.trim()
                    ? styles.inputError
                    : null,
                ]}
                placeholder="E-mail corporativo"
                placeholderTextColor="#8EA4C2"
                value={email}
                onChangeText={(texto) => {
                  setEmail(texto);
                  setErro("");
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!entrando}
              />

              {/* SENHA */}

              <TextInput
                style={[
                  styles.input,
                  erro &&
                    !senha.trim()
                    ? styles.inputError
                    : null,
                ]}
                placeholder="Senha"
                placeholderTextColor="#8EA4C2"
                secureTextEntry
                value={senha}
                onChangeText={(texto) => {
                  setSenha(texto);
                  setErro("");
                }}
                onSubmitEditing={
                  fazerLogin
                }
                editable={!entrando}
              />

              {/* ERRO */}

              {erro ? (
                <Text
                  style={
                    styles.errorText
                  }
                >
                  {erro}
                </Text>
              ) : null}

              {/* ENTRAR */}

              <TouchableOpacity
                style={[
                  styles.button,
                  entrando &&
                  styles.buttonDisabled,
                ]}
                onPress={fazerLogin}
                disabled={entrando}
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {entrando
                    ? "Entrando..."
                    : "Entrar no Sistema"}
                </Text>
              </TouchableOpacity>

              {/* CREDENCIAIS */}

              <TouchableOpacity
                disabled={entrando}
                onPress={() =>
                  setMostrarCredenciais(
                    !mostrarCredenciais
                  )
                }
              >
                <Text
                  style={
                    styles.credentialsToggle
                  }
                >
                  {mostrarCredenciais
                    ? "Ocultar credenciais de demonstração"
                    : "Ver credenciais de demonstração"}
                </Text>
              </TouchableOpacity>

              {mostrarCredenciais && (
                <View
                  style={
                    styles.demoBox
                  }
                >
                  <Text
                    style={
                      styles.demoTitle
                    }
                  >
                    Credenciais de demonstração
                  </Text>

                  <Text
                    style={
                      styles.demoText
                    }
                  >
                    E-mail: {emailDemo}
                  </Text>

                  <Text
                    style={
                      styles.demoText
                    }
                  >
                    Senha: {senhaDemo}
                  </Text>

                  <TouchableOpacity
                    style={
                      styles.demoButton
                    }
                    onPress={
                      usarCredenciaisDemo
                    }
                    disabled={entrando}
                  >
                    <Text
                      style={
                        styles.demoButtonText
                      }
                    >
                      Usar credenciais
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* VOLTAR */}

              <TouchableOpacity
                style={
                  styles.backButton
                }
                onPress={voltarInicio}
                disabled={entrando}
              >
                <Text
                  style={
                    styles.backButtonText
                  }
                >
                  Voltar
                </Text>
              </TouchableOpacity>

              <Text
                style={
                  styles.helperText
                }
              >
                Acesso exclusivo para equipe
                de pós-venda
              </Text>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      minHeight: "100%",
      backgroundColor: "#020B18",
    },

    darkOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        "rgba(1, 10, 22, 0.78)",
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
      width: 500,
      backgroundColor: "#FFFFFF",
      borderRadius: 34,
      paddingVertical: 40,
      paddingHorizontal: 42,
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
      paddingVertical: 30,
      paddingHorizontal: 22,
    },

    logo: {
      width: 260,
      height: 105,
      alignSelf: "center",
      marginBottom: 8,
    },

    logoMobile: {
      width: 215,
      height: 85,
    },

    welcomeSmall: {
      color: "#6B7D94",
      fontSize: 15,
      textAlign: "center",
      marginBottom: 3,
    },

    cardTitle: {
      color: "#06182E",
      fontSize: 32,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: 7,
    },

    cardTitleMobile: {
      fontSize: 26,
    },

    cardSubtitle: {
      color: "#6B7D94",
      fontSize: 15,
      textAlign: "center",
      marginBottom: 30,
    },

    accessSection: {
      width: "100%",
    },

    accessLabel: {
      color: "#0057FF",
      fontSize: 11,
      fontWeight: "900",
      marginBottom: 5,
      textAlign: "center",
    },

    accessTitle: {
      color: "#06182E",
      fontSize: 20,
      fontWeight: "900",
      textAlign: "center",
      marginBottom: 14,
    },

    primaryButton: {
      backgroundColor: "#0057FF",
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
    },

    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
    },

    secondaryButton: {
      backgroundColor: "#FFFFFF",
      borderWidth: 1.5,
      borderColor: "#0057FF",
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
    },

    secondaryButtonText: {
      color: "#0057FF",
      fontSize: 16,
      fontWeight: "800",
    },

    divider: {
      marginVertical: 24,
    },

    dividerLine: {
      width: "100%",
      height: 1,
      backgroundColor: "#D7E0EC",
    },

    accessFooter: {
      color: "#7B8BA3",
      fontSize: 13,
      lineHeight: 19,
      textAlign: "center",
      marginTop: 24,
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

    inputError: {
      borderColor: "#FF3B30",
    },

    errorText: {
      color: "#FF3B30",
      fontSize: 14,
      textAlign: "center",
      marginTop: 4,
      marginBottom: 6,
    },

    button: {
      backgroundColor: "#0057FF",
      paddingVertical: 18,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 10,
    },

    buttonDisabled: {
      opacity: 0.65,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "800",
    },

    credentialsToggle: {
      color: "#0057FF",
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 16,
      marginBottom: 12,
    },

    demoBox: {
      backgroundColor: "#F1F5FB",
      borderWidth: 1,
      borderColor: "#D7E0EC",
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
    },

    demoTitle: {
      color: "#06182E",
      fontSize: 15,
      fontWeight: "800",
      marginBottom: 10,
    },

    demoText: {
      color: "#4A5B72",
      fontSize: 14,
      marginBottom: 6,
    },

    demoButton: {
      backgroundColor: "#E3ECFA",
      paddingVertical: 11,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },

    demoButtonText: {
      color: "#0057FF",
      fontSize: 14,
      fontWeight: "800",
    },

    backButton: {
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 4,
    },

    backButtonText: {
      color: "#657A96",
      fontSize: 14,
      fontWeight: "700",
    },

    helperText: {
      color: "#7B8BA3",
      textAlign: "center",
      fontSize: 13,
      marginTop: 4,
    },
  });