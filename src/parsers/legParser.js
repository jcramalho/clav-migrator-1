import nanoid from "nanoid";

function parseCode({ Tipo, Entidade, Número }) {
  let code = Tipo.trim();

  code += Entidade ? ` ${Entidade.replace(/(\r\n|\n|\r| )/gm, "")}` : "";
  code += Número ? ` ${Número}` : "";
  return code;
}

function parseEntidades({ Entidade }) {
  if (Entidade) {
    return Entidade.replace(/(\r\n|\n|\r| )/gm, "").split(/;|,/);
  }
  return [];
}

export default function legParser(data, _, report) {
  const tipoCode = parseCode(data);
  return {
    ...data,
    tipoCode,
    legCode: `leg_${nanoid()}`,
    sumario: data.Sumário.replace(/"/gm, '\\"').replace(/(\r\n|\n|\r)/gm, ""),
    entidadesResp: parseEntidades(data),
    estado: data.Estado ? data.Estado : "A",
    numero: data.Número
      ? data.Número
      : report(
          { msg: `Legislação ${tipoCode} sem Número`, type: "parsing" },
          ""
        )
  };
}

// FIXME: LegCatalog -> legislacoes duplicadas
// FIXME: data.Estado ????
