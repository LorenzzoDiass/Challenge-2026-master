import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_USUARIO = "@ford_retain_usuario";
const CHAVE_TOKEN = "@ford_retain_token";

export type UsuarioLogado = {
  id: number;
  nome: string;
  email: string;
};

export async function salvarUsuarioLogado(usuario: UsuarioLogado) {
  await AsyncStorage.setItem(
    CHAVE_USUARIO,
    JSON.stringify(usuario)
  );
}

export async function buscarUsuarioLogado(): Promise<UsuarioLogado | null> {
  const usuarioSalvo = await AsyncStorage.getItem(CHAVE_USUARIO);

  if (!usuarioSalvo) {
    return null;
  }

  return JSON.parse(usuarioSalvo);
}

export async function salvarToken(token: string) {
  await AsyncStorage.setItem(CHAVE_TOKEN, token);
}

export async function buscarToken(): Promise<string | null> {
  return await AsyncStorage.getItem(CHAVE_TOKEN);
}

export async function removerUsuarioLogado() {
  await AsyncStorage.multiRemove([
    CHAVE_USUARIO,
    CHAVE_TOKEN,
  ]);
}