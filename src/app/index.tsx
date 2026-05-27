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

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

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
          <Text style={styles.badge}>Pós-venda inteligente</Text>

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
            Monitore clientes, acompanhe veículos e priorize contatos de
            revisão com base no risco de abandono.
          </Text>
        </View>

        <View style={[styles.card, isMobile && styles.cardMobile]}>
          <Image
            source={require("../assets/images/logo.fordd.png")}
            style={[styles.logo, isMobile && styles.logoMobile]}
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
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#8EA4C2"
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/dashboard")}
          >
            <Text style={styles.buttonText}>
              Entrar no Sistema
            </Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Acesso exclusivo para equipe de pós-venda
          </Text>
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

  button: {
    backgroundColor: "#0057FF",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
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
});