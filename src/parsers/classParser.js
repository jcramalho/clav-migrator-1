/* eslint-disable import/extensions */
import nanoid from "nanoid";
import { getClasse, getEstado, getPcaJust, getDfJust } from "../helper.js";

export default function classParser(data, _, report) {
  const codigo = data["Código"]
    ? data["Código"].toString().replace(/(\r\n|\n|\r|\s)/gm, "")
    : "";
  const titulo = data["Título"]
    ? data["Título"].trim().replace(/(\r\n|\n|\r)/gm, "")
    : report({ msg: `Classe ${codigo} sem Título`, type: "parsing" }, "");
  // MigraNA
  const naText = data["Notas de aplicação"]
    ? data["Notas de aplicação"]
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/"/g, '\\"')
        .split("#")
    : report(
        { msg: `Classe ${codigo} sem Notas de aplicação`, type: "parsing" },
        []
      );
  const naList = naText
    .filter(conteudo => conteudo.trim())
    .map(conteudo => {
      return {
        id: `na_c${codigo}_${nanoid()}`,
        conteudo
      };
    });
  // MigraExNa
  const exNaText = data["Exemplos de NA"]
    ? data["Exemplos de NA"].replace(/(\r\n|\n|\r)/gm, "").split("#")
    : report(
        { msg: `Classe ${codigo} sem Exemplos de NA`, type: "parsing" },
        []
      );
  const exNaList = exNaText
    .filter(conteudo => conteudo.trim())
    .map(conteudo => {
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
    : report(
        { msg: `Classe ${codigo} sem Notas de exclusão`, type: "parsing" },
        []
      );
  const neList = neText
    .filter(conteudo => conteudo.trim())
    .map(conteudo => {
      return {
        id: `ne_c${codigo}_${nanoid()}`,
        conteudo
      };
    });
  return {
    ...data,
    estado: getEstado(data.Estado, codigo, report),
    codigo,
    classe: getClasse(codigo),
    classCod: `c${codigo}`,
    titulo,
    tipoProc: data["Tipo de Processo"]
      ? data["Tipo de Processo"].trim()
      : report({ msg: `Classe ${codigo} sem Título`, type: "parsing" }, ""),
    parts: data["Participante no processo"]
      ? data["Participante no processo"]
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/\.| |,/gm, "_")
          .split("#")
      : report(
          {
            msg: `Classe ${codigo} sem Participante no processo`,
            type: "parsing"
          },
          []
        ),
    tiposInt: data["Tipo de intervenção do participante"]
      ? data["Tipo de intervenção do participante"]
          .replace(/(\r\n|\n|\r| )/gm, "")
          .split("#")
      : report(
          {
            msg: `Classe ${codigo} sem Tipo de intervenção do participante`,
            type: "parsing"
          },
          []
        ),
    donosProc: data["Dono do processo"]
      ? data["Dono do processo"]
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/\.| |,/gm, "_")
          .split("#")
      : report(
          { msg: `Classe ${codigo} sem Dono do processo`, type: "parsing" },
          []
        ),
    codProcRel: data["Código do processo relacionado"]
      ? data["Código do processo relacionado"]
          .replace(/(\r\n|\n|\r|\s)/gm, "")
          .split("#")
      : report(
          {
            msg: `Classe ${codigo} sem Código do processo relacionado`,
            type: "parsing"
          },
          []
        ),
    tipoRelProc: data["Tipo de relação entre processos"]
      ? data["Tipo de relação entre processos"]
          .replace(/(\r\n|\n|\r)/gm, "")
          .split("#")
      : report(
          {
            msg: `Classe ${codigo} sem Tipo de relação entre processos`,
            type: "parsing"
          },
          []
        ),
    diplomas: data["Diplomas jurídico-administrativos REF"]
      ? data["Diplomas jurídico-administrativos REF"]
          .replace(/(\r\n|\n|\r)/gm, "")
          .split("#")
      : report(
          { msg: `Classe ${codigo} sem Diplomas REF`, type: "parsing" },
          []
        ),
    unifProc: data["Uniformização do processo"]
      ? data["Uniformização do processo"].trim().replace(/(\r\n|\n|\r)/gm, "")
      : report(
          {
            msg: `Classe ${codigo} sem Uniformização do processo`,
            type: "parsing"
          },
          ""
        ),
    dimQual: data["Dimensão qualitativa do processo"]
      ? data["Dimensão qualitativa do processo"].trim()
      : report(
          {
            msg: `Classe ${codigo} sem Dimensão qualitativa do processo`,
            type: "parsing"
          },
          ""
        ),
    descricao: data["Descrição"]
      ? data["Descrição"].replace(/"/gm, '\\"').replace(/(\r\n|\n|\r)/gm, "")
      : report({ msg: `Classe ${codigo} sem Descrição`, type: "parsing" }, ""),
    // MigraNA
    naList,
    // MigraExNa
    exNaList,
    // MigraNE
    neList,
    // MigraPCA
    pcaCode: `pca_c${codigo}`,
    justPcaCode: `just_pca_c${codigo}`,
    pcaJust: getPcaJust(data["Justificação PCA"], codigo, report),
    // MigraDF
    dfCode: `df_c${codigo}`,
    justDfCode: `just_df_c${codigo}`,
    dfJust: getDfJust(data["Justificação DF"], codigo, report)
  };
}
