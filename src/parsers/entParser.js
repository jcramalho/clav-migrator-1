function getEntTipo(data) {
  if (!data) return false;
  const tipList = data.replace(/(\r\n|\n|\r|\s)/gm, "").split("#");
  return tipList.map(tip => tip.replace(/\.|,/gm, "_"));
}

export default function entParser(data) {
  return {
    ...data,
    sigla: data.Sigla.replace(/\.|,/gm, "_").replace(/ /gm, "_"),
    estado: !data.Estado || data.Estado === "Ativo" ? "A" : "I",
    international: !data.International ? "" : data.International,
    entTipo: getEntTipo(data["Tipologia de Entidade"])
  };
}
