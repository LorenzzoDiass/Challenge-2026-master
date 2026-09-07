export function buscarImagemVeiculo(modelo: string) {
  const modeloNormalizado = String(modelo || "").toLowerCase();

  if (modeloNormalizado.includes("ranger")) {
    return require("../assets/images/rangerr.jpg");
  }

  if (modeloNormalizado.includes("territory")) {
    return require("../assets/images/territory.jpg");
  }

  if (modeloNormalizado.includes("maverick")) {
    return require("../assets/images/maverick.jpg");
  }

  if (modeloNormalizado.includes("bronco")) {
    return require("../assets/images/bronco.jpg");
  }

  if (modeloNormalizado.includes("edge")) {
    return require("../assets/images/edge.jpg");
  }

  if (modeloNormalizado.includes("mustang")) {
    return require("../assets/images/mustang.jpg");
  }

  return require("../assets/images/logo.fordd.png");
}