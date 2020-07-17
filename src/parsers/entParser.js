function getEntTipo(data, sigla, report) {
  if (!data)
    return report(
      { msg: `Entidade ${sigla} sem Tipologia`, type: "parsing" },
      false
    );
  const tipList = data.replace(/(\r\n|\n|\r|\s)/gm, "").split("#");
  return tipList.map(tip => tip.replace(/\.|,/gm, "_"));
}

export default function entParser(data, _, report) {
  return {
    ...data,
    sigla: !data.Sigla
      ? report({ msg: "Entidade sem sigla", type: "parsing" }, "")
      : data.Sigla.trim()
          .replace(/\.|,/gm, "_")
          .replace(/ /gm, "_"),
    estado: !data.Estado || data.Estado === "Ativo" ? "A" : "I",
    international: !data.International ? "" : data.International,
    entTipo: getEntTipo(data["Tipologia de Entidade"], data.Sigla, report),
    idSIOE: data["ID SIOE"]
      ? data["ID SIOE"]
      : report(
          { msg: `Entidade ${data.Sigla} sem idSIOE`, type: "parsing" },
          ""
        )
  };
}
