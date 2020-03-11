/* eslint-disable import/extensions */
import nanoid from "nanoid";
import { getClasse, getEstado } from "../helper.js";

export default function classParser(data) {
  const codigo = data["Código"]
    ? data["Código"].toString().replace(/(\r\n|\n|\r)/gm, "")
    : "";
  const titulo = data["Título"]
    ? data["Título"].replace(/(\r\n|\n|\r)/gm, "")
    : "";
  // MigraNA
  const naText = data["Notas de aplicação"]
    ? data["Notas de aplicação"]
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/"/g, '\\"')
        .split("#")
    : [];
  const naList = naText.map(conteudo => {
    return {
      id: `na_c${codigo}_${nanoid()}`,
      conteudo
    };
  });
  // MigraExNa
  const exNaText = data["Exemplos de NA"]
    ? data["Exemplos de NA"].replace(/(\r\n|\n|\r)/gm, "").split("#")
    : [];
  const exNaList = exNaText.map(conteudo => {
    return {
      id: `exna_c${codigo}_${nanoid()}`,
      conteudo
    };
  });
  // MigraNE
  const neText = data["Notas de exclusão"]
    ? data["Notas de exclusão"]
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/"/g, '\\"')
        .split("#")
    : [];
  const neList = neText.map(conteudo => {
    return {
      id: `ne_c${codigo}_${nanoid()}`,
      conteudo
    };
  });

  return {
    ...data,
    estado: getEstado(data.Estado),
    codigo,
    classe: getClasse(codigo),
    classCod: `c${codigo}`,
    titulo,
    tipoProc: data["Tipo de Processo"] ? data["Tipo de Processo"].trim() : "",
    parts: data["Participante no processo"]
      ? data["Participante no processo"]
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/\.| |,/gm, "_")
          .split("#")
      : [],
    tiposInt: data["Tipo de intervenção do participante"]
      ? data["Tipo de intervenção do participante"]
          .replace(/(\r\n|\n|\r| )/gm, "")
          .split("#")
      : [],
    donosProc: data["Dono do processo"]
      ? data["Dono do processo"]
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/\.| |,/gm, "_")
          .split("#")
      : [],
    codProcRel: data["Código do processo relacionado"]
      ? data["Código do processo relacionado"]
          .replace(/(\r\n|\n|\r|\s)/gm, "")
          .split("#")
      : [],
    tipoRelProc: data["Tipo de relação entre processos"]
      ? data["Tipo de relação entre processos"]
          .replace(/(\r\n|\n|\r)/gm, "")
          .split("#")
      : [],
    diplomas: data["Diplomas jurídico-administrativos REF"]
      ? data["Diplomas jurídico-administrativos REF"]
          .replace(/(\r\n|\n|\r)/gm, "")
          .split("#")
      : [],
    unifProc: data["Uniformização do processo"]
      ? data["Uniformização do processo"].trim().replace(/(\r\n|\n|\r)/gm, "")
      : "",
    dimQual: data["Dimensão qualitativa do processo"]
      ? data["Dimensão qualitativa do processo"].trim()
      : "",
    descricao: data["Descrição"]
      ? data["Descrição"].replace(/"/gm, '\\"').replace(/(\r\n|\n|\r)/gm, "")
      : "",
    // MigraNA
    naList,
    // MigraExNa
    exNaList,
    // MigraNE
    neList,
    // MigraPCA
    pcaCode: `pca_c${codigo}`
  };
}
