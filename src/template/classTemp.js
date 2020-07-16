/* eslint-disable no-restricted-globals */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */

/**
 * Example output [NOT REAL]:
 *
 * ###  http://jcr.di.uminho.pt/m51-clav#c100
 */
import { proc_c400_10_001, printJustPCA, printJustDF } from "../helper.js";
import { invDfDistinto, relacoesDfPca } from "../invariantes.js";

export default function template(
  classe,
  print,
  report,
  { entidade, tipologia, legislacao, classes }
) {
  if (classes.lvl3 === undefined) classes.lvl3 = [];
  print(
    `###  http://jcr.di.uminho.pt/m51-clav#${classe.classCod}`,
    `:${classe.classCod} rdf:type owl:NamedIndividual ;`,
    `\t:classeStatus "${classe.estado}";`,
    `\trdf:type :Classe_N${classe.classe.length};`,
    `\t:codigo "${classe.codigo}";`,
    `\t:titulo "${classe.titulo}";`,
    classe.classe ? "\t:pertenceLC :lc1 ;" : false,
    printFather(classe), // :temPai :Lc1 || :temPai :c100.10
    printTipoProc(classe), // :processoTipoVC :vc_processoTipo_pc
    printTransversalProc(classe), // :processoTransversal "S"|"N"
    printParticipantProc(classe, entidade, tipologia), // :temParticipanteAssessor :tip_AP ;
    printOwnersProc(classe, entidade, tipologia),
    PrintRelProc(classe, classes, report),
    PrintRelLeg(classe, legislacao),
    PrintDim(classe),
    PrintUnif(classe),
    `\t:descricao "${classe.descricao}".`,
    PrintMigraNa(classe),
    PrintMigraExNa(classe),
    PrintMigraNe(classe),
    PrintPCAl3(classe, classes, legislacao, report),
    PrintDFl3(classe, classes, legislacao, report),
    PrintPCAl4(classe, classes, legislacao),
    PrintDFl4(classe, classes, legislacao)
  );
}

function printFather(classe) {
  if (classe.classe.length === 1) return "\t:temPai :lc1 ;";
  return `\t:temPai :c${[...classe.classe.slice(0, -1)].join(".")} ;`;
}

function printTipoProc(classe) {
  if (classe.classe.length !== 3) return "";
  if (classe.tipoProc === "PC" || classe.tipoProc === "PE")
    return `\t:processoTipoVC :vc_processoTipo_${classe.tipoProc.toLowerCase()} ;`;
  return "";
}

function printTransversalProc(classe) {
  if (!classe["Processo transversal (S/N)"]) return "";
  return `\t:processoTransversal "${classe[
    "Processo transversal (S/N)"
  ].trim()}" ;`;
}

function printParticipantProc(classe, entidade, tipologia) {
  if (classe["Processo transversal (S/N)"] === "S") {
    const output = classe.parts.reduce((prev, part, index) => {
      part = part.replace(/^[_]+/, "");
      if (!part) return prev;
      if (index) prev += "\n";
      const prefix = getPrefix(part, entidade, tipologia);

      if (!classe.tiposInt[index]) return prev;

      return `${prev}\t:temParticipante${
        {
          Apreciar: "Apreciador",
          Assessorar: "Assessor",
          Comunicar: "Comunicador",
          Decidir: "Decisor",
          Executar: "Executor",
          Iniciar: "Iniciador"
        }[classe.tiposInt[index]]
      } :${prefix}${part} ; `;
    }, "");
    return output;
  }
  return "";
}

function printOwnersProc(classe, entidade, tipologia) {
  return classe.donosProc.reduce((prev, dono, index) => {
    if (!dono) return prev;
    if (index) prev += "\n";
    const prefix = getPrefix(dono, entidade, tipologia);

    return `${prev}\t:temDono :${prefix}${dono} ;`;
  }, "");
}

function PrintRelProc(classe, classes, report) {
  classe.codProcRel.pop();
  classe.tipoRelProc.pop();

  const out = invDfDistinto(classe, classes);

  if (classe.codProcRel.length !== classe.tipoRelProc.length) {
    report(
      {
        msg: `Os processos relacionados e os tipos de relação da classe ${classe.codigo} tem diferentes comprimentos`,
        type: "invariantes"
      },
      ""
    );
    return (
      out +
      classe.codProcRel.reduce((prev, cod, index) => {
        if (index) prev += "\n";
        return `${prev}\t:temRelProc ":c${cod}" ;`;
      }, "")
    );
  }

  return (
    out +
    classe.tipoRelProc.reduce((prev, tipo, index) => {
      if (index) prev += "\n";
      return `${prev}\t:${getRelProc(tipo)} :c${classe.codProcRel[index]} ;`;
    }, "")
  );
}

function PrintRelLeg(classe, legislacao) {
  return classe.diplomas.reduce((prev, diploma, index) => {
    diploma.trim();
    const tipLoc = legislacao.findIndex(({ tipoCode }) => tipoCode === diploma);
    if (tipLoc > -1) {
      if (index) prev += "\n";
      return `${prev}\t:temLegislacao :${legislacao[index].legCode} ;`;
    }
    return prev;
  }, "");
}

function PrintDim(classe) {
  if (
    classe.classe.length > 2 &&
    classe.dimQual.match(/Elevada|Reduzida|Média/i)
  )
    return `\t:processoDimQual "${classe.dimQual}" ;`;
}

function PrintUnif(classe) {
  if (classe.classe.length > 2 && classe.unifProc.match(/S|N/i))
    return `\t:processoUniform "${classe.unifProc}" ;`;
}

function PrintMigraNa(classe) {
  // classe.naList.pop();
  const migraNa = MigraBuilder(
    "NotaAplicacao",
    "Nota de Aplicação",
    "temNotaAplicacao"
  );
  return classe.naList.reduce((prev, na, index) => {
    if (index) prev += "\n";
    return `${prev}${migraNa(na.id, na.conteudo, classe.classCod)}`;
  }, "");
}

function PrintMigraExNa(classe) {
  const migraExNa = MigraBuilder(
    "ExemploNotaAplicacao",
    "Exemplo de nota de aplicação",
    "temExemploNA"
  );
  return classe.exNaList.reduce((prev, exNa, index) => {
    if (index) prev += "\n";
    return `${prev}${migraExNa(exNa.id, exNa.conteudo, classe.classCod)}`;
  }, "");
}

function PrintMigraNe(classe) {
  const migraNe = MigraBuilder(
    "NotaExclusao",
    "Nota de Exclusão",
    "temNotaExclusao"
  );
  return classe.neList.reduce((prev, ne, index) => {
    if (index) prev += "\n";
    return `${prev}${migraNe(ne.id, ne.conteudo, classe.classCod)}`;
  }, "");
}

function PrintPCAl3(classe, classes, legislacao, report) {
  if (classe.codigo === "400.10.001") return proc_c400_10_001(classe);
  if (classe.classe.length === 3) {
    if (
      relacoesDfPca(classe, classes, report) &&
      (classe["Prazo de conservação administrativa"] ||
        classe["Prazo de conservação administrativa"] === 0)
    ) {
      return procPCA(
        classe,
        classe.pcaCode,
        classe.codigo,
        legislacao,
        classes
      );
    }

    if (!(classe.codigo in classes.lvl3)) classes.lvl3.push(classe.codigo);
  }
}

function PrintDFl3(classe, classes, legislacao, report) {
  if (classe.codigo === "400.10.001") return "";
  if (classe.classe.length === 3) {
    if (classe["Destino final"] && relacoesDfPca(classe, classes, report))
      return procDF(classe, classe.dfCode, classe.codigo, legislacao, classes);
    if (!(classe.codigo in classes.lvl3)) classes.lvl3.push(classe.codigo);
  }
}

function PrintPCAl4(classe, classes, legislacao) {
  if (
    (classe.classe.length === 4 &&
      hasL3(classe.codigo, classes.lvl3) &&
      classe["Prazo de conservação administrativa"]) ||
    classe["Prazo de conservação administrativa"] === 0
  )
    return procPCA(classe, classe.pcaCode, classe.codigo, legislacao, classes);
}

function PrintDFl4(classe, classes, legislacao) {
  if (
    classe.classe.length === 4 &&
    hasL3(classe.codigo, classes.lvl3) &&
    classe["Destino final"]
  )
    return procDF(classe, classe.dfCode, classe.codigo, legislacao, classes);
}

/**
 *
 * HELPER FUNCTIONS BELLOW
 *
 */

function hasL3(code, l3List) {
  const sep = code.lastIndexOf(".");
  const father = code.slice(0, sep);
  return l3List.indexOf(father) > -1;
}

function MigraBuilder(note, label, hasNote) {
  return (id, content, code) => {
    let out = `###  http://jcr.di.uminho.pt/m51-clav#${id}\n`;
    out += `:${id} rdf:type owl:NamedIndividual ,\n`;
    out += `\t\t:${note} ;\n`;
    out += `\t:rdfs:label "${label}";\n`;
    out += `\t:conteudo "${content}".\n\n`;
    out += `:${code} :${hasNote} :${id} .`;
    return out;
  };
}

function getRelProc(tipo) {
  if (tipo.match(/S[íi]ntese[ ]*\(s[ií]ntetizad[oa]\)/gi))
    return "eSintetizadoPor";
  if (tipo.match(/S[íi]ntese[ ]*\(sintetiza\)/gi)) return "eSinteseDe";
  if (tipo.startsWith("Complementar")) return "eComplementarDe";
  if (tipo.match(/\s*Cruzad/gi)) return "eCruzadoCom";
  if (tipo.match(/\s*Suplement.?\s*de/)) return "eSuplementoDe";
  if (tipo.match(/\s*Suplement.?\s*para/)) return "eSuplementoPara";
  if (tipo.match(/Sucessão[ ]*\(suce/gi)) return "eSucessorDe";
  if (tipo.match(/\s*Sucessão\s*\(antece/gi)) return "eAntecessorDe";
  return "temRelProc";
}

function getPrefix(part, entidade, tipologia) {
  if (hasPart(part, entidade)) return "ent_";
  if (hasPart(part, tipologia)) return "tip_";
  return false;
}

function hasPart(part, arr) {
  return arr.findIndex(({ sigla }) => sigla === part) > -1;
}

function procPCA(data, pcaCode, cod, leg, classes) {
  let out = `###  http://jcr.di.uminho.pt/m51-clav#${pcaCode}\n`;
  out += `:${pcaCode} rdf:type owl:NamedIndividual ,\n`;
  out += "\t:PCA .\n";

  const regex = RegExp("[]*[0-9]+[]*");
  if (regex.test(data["Prazo de conservação administrativa"])) {
    out += `:${pcaCode} :pcaValor ${data["Prazo de conservação administrativa"]}.\n`;
  } else {
    out += `:${pcaCode} :pcaValor "${data["Prazo de conservação administrativa"]}".\n`;
  }

  if (data["Nota ao PCA"] && data["Nota ao PCA"].trim() !== "") {
    out +=
      `:${pcaCode} :pcaNota ` +
      `"${data["Nota ao PCA"].replace(/"/g, '\\"').replace(/\n/g, " ")}".\n\n`;
  }

  out += `:c${cod} :temPCA :${pcaCode}.\n`;

  const myContagem = data["Forma de contagem do PCA"];
  if (myContagem) {
    const re_fc_concProc = /conclusão.*procedimento/;
    const re_fc_cessVig = /cessação.*vigência/;
    const re_fc_extEnt = /extinção.*entidade/;
    const re_fc_extDir = /extinção.*direito/;
    const re_fc_dispLeg = /disposição.*legal/;
    const re_fc_inicProc = /início.*procedimento/;
    const re_fc_emiTit = /emissão.*título/;

    if (re_fc_concProc.test(myContagem)) {
      out += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_conclusaoProcedimento .\n`;
    } else if (re_fc_dispLeg.test(myContagem)) {
      out += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_disposicaoLegal .\n`;

      const linhasSubforma = myContagem.split("\n");
      linhasSubforma.splice(0, 1);
      const mySubforma = linhasSubforma.join("\n");
      if (mySubforma.trim().startsWith("10", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.10 .\n`;
      } else if (mySubforma.trim().startsWith("11", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.11 .\n`;
      } else if (mySubforma.trim().startsWith("12", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.12 .\n`;
      } else if (mySubforma.trim().startsWith("1", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.01 .\n`;
      } else if (mySubforma.trim().startsWith("2", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.02 .\n`;
      } else if (mySubforma.trim().startsWith("3", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.03 .\n`;
      } else if (mySubforma.trim().startsWith("4", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.04 .\n`;
      } else if (mySubforma.trim().startsWith("5", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.05 .\n`;
      } else if (mySubforma.trim().startsWith("6", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.06 .\n`;
      } else if (mySubforma.trim().startsWith("7", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.07 .\n`;
      } else if (mySubforma.trim().startsWith("8", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.08 .\n`;
      } else if (mySubforma.trim().startsWith("9", 0)) {
        out += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.09 .\n`;
      } else {
        // console.log(
        //   `ERRO: Subforma de contagem inválida: ${mySubforma} em ${pcaCode}`
        // );
      }
    } else if (re_fc_extEnt.test(myContagem)) {
      out += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_extincaoEntidade .\n`;
    } else if (re_fc_extDir.test(myContagem)) {
      out += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_extincaoDireito .\n`;
    } else if (re_fc_cessVig.test(myContagem)) {
      out += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_cessacaoVigencia .\n`;
    } else if (re_fc_inicProc.test(myContagem)) {
      out += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_inicioProcedimento .\n`;
    } else if (re_fc_emiTit.test(myContagem)) {
      out += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_emissaoTitulo .\n`;
    } else {
      // console.log(
      //   `ERRO: Forma de contagem inválida: ${myContagem} em ${pcaCode}`
      // );
    }
  }

  if (data["Justificação PCA"]) {
    out += `###  http://jcr.di.uminho.pt/m51-clav#${data.justPcaCode}\n`;
    out += `:${data.justPcaCode} rdf:type owl:NamedIndividual ,\n`;
    out += "\t:JustificacaoPCA.\n";
    out += `:${pcaCode} :temJustificacao :${data.justPcaCode}.\n`;

    out += printJustPCA(data.pcaJust, data.justPcaCode, leg, classes);
  }

  return out;
}

function procDF(data, dfCode, cod, leg, classes) {
  let out = `###  http://jcr.di.uminho.pt/m51-clav#${dfCode}\n`;
  out += `:${dfCode} rdf:type owl:NamedIndividual ,\n`;
  out += "\t:DestinoFinal";
  out += ` ;\n\t:dfValor "${data["Destino final"]
    .trim()
    .replace(/(\r\n|\n|\r)/gm, "")}"`;
  if (data["Nota ao DF"]) {
    out += `;\n\t:dfNota "${data["Nota ao DF"]
      .trim()
      .replace(/(\r\n|\n|\r)/gm, "")}".\n`;
  } else {
    out += ".\n";
  }

  out += `:c${cod} :temDF :${dfCode}.\n`;

  if (data["Justificação DF"]) {
    out += `###  http://jcr.di.uminho.pt/m51-clav#${data.justDfCode}\n`;
    out += `:${data.justDfCode} rdf:type owl:NamedIndividual ,\n`;
    out += "\t:JustificacaoDF.\n";

    out += `:${dfCode} :temJustificacao :${data.justDfCode}.\n`;
    out += printJustDF(data.dfJust, data.justDfCode, leg, classes);
  }
  return out;
}
