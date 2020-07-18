/* eslint-disable import/no-cycle */
import { invCritAdmin } from "./invariantes.js";

/* eslint-disable camelcase */
export function getEstado(estado, codigo, report) {
  if (estado === undefined || estado.trim() === "") return "A";
  if (/[hH][aA][rR][mM][oO][nN]/.test(estado)) return "H";
  if (/[iI][nN][Aa][tT][iI][vV]/.test(estado)) return "I";
  return report({ msg: `Classe ${codigo} sem Estado`, type: "parsing" }, "");
}

export function getClasse(cod) {
  const digArray = cod.split(".");

  if (digArray.length > 4) return false;
  return digArray;
}

// Migração do Processo c400.10.001______________________________________
export function proc_c400_10_001(classe) {
  let myTriples = `###  http://jcr.di.uminho.pt/m51-clav#${classe.pcaCode}\n`;
  myTriples += `:${classe.pcaCode} rdf:type owl:NamedIndividual ,\n`;
  myTriples += "\t:PCA ;\n";
  myTriples += "\t:pcaValor 30;\n";
  myTriples += "\t:pcaValor 50;\n";
  myTriples += "\t:pcaValor 100;\n";
  myTriples += '\t:pcaNota "30 anos após a data do assento de óbito";\n';
  myTriples += '\t:pcaNota "50 anos sobre a data do registo de casamento";\n';
  myTriples += '\t:pcaNota "100 anos após a data do assento de nascimento".\n';
  myTriples += `:${classe.pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_disposicaoLegal .\n`;
  myTriples += `:${classe.pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.01 .\n`;
  myTriples += `:${classe.pcaCode} :pcaFormaContagem "(1) Data do assento de óbito (2) Data do registo de casamento. (3) Data do assento de nascimento. No caso dos registos em livro os prazos contam-se a partir da data do último assento lavrado no livro.".\n`;
  myTriples += `:c${classe.codigo} :temPCA :${classe.pcaCode}.\n`;
  // Justificação do PCA
  myTriples += "###  http://jcr.di.uminho.pt/m51-clav#just_pca_c400.10.001\n";
  myTriples += ":just_pca_c400.10.001 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t:JustificacaoPCA.\n";
  myTriples += ":pca_c400.10.001 :temJustificacao :just_pca_c400.10.001.\n";
  // Critério
  myTriples += ":crit_just_pca_c400.10.001_1 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t:CriterioJustificacaoLegal;\n";
  myTriples +=
    '\t:conteudo "[DL 324/2007], artº 15; 1 - Os livros cujos registos tenham sido objecto de informatização são transferidos para a entidade responsável pelos arquivos nacionais; 2 - O disposto no número anterior é aplicável aos livros de registo relativamente aos quais tenha decorrido, à data do último assento: a) Mais de 30 anos, quanto aos livros de assentos de óbito; b) Mais de 50 anos, quanto aos livros de assentos de casamento; c) Mais de 100 anos, quanto aos restantes livros de assentos; 3 - O disposto no número anterior é aplicável aos documentos que tenham servido de base aos assentos nele referidos; (Tem por base o tempo médio de vida da pessoa, visa a utilidade gestionária esgotando quase na totalidade as necessidades administrativas de consulta).".\n';
  myTriples += ":crit_just_pca_c400.10.001_1 :temLegislacao :leg_602.\n";
  myTriples +=
    ":just_pca_c400.10.001 :temCriterio :crit_just_pca_c400.10.001_1 .\n";
  // Destino Final
  myTriples += "###  http://jcr.di.uminho.pt/m51-clav#df_c400.10.001\n";
  myTriples += ":df_c400.10.001 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t:DestinoFinal ;\n";
  myTriples += '\t:dfValor "C".\n';
  myTriples += ":c400.10.001 :temDF :df_c400.10.001 .\n";
  // Justificação do Destino Final
  myTriples += "###  http://jcr.di.uminho.pt/m51-clav#just_df_c400.10.001\n";
  myTriples += ":just_df_c400.10.001 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t\t:JustificacaoDF.\n";

  myTriples += ":df_c400.10.001 :temJustificacao :just_df_c400.10.001 .\n";

  myTriples += ":crit_just_df_c400.10.001_1 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t:CriterioJustificacaoLegal;\n";
  myTriples +=
    '\t:conteudo "Código Civil, [DL 47344/66] (conservação para garante do exercício dos direitos de personalidade. Consagram direitos que não prescrevem no tempo).".\n';
  myTriples +=
    ":just_df_c400.10.001 :temCriterio :crit_just_df_c400.10.001_1 .\n";
  myTriples += ":crit_just_df_c400.10.001_1 :temLegislacao :leg_6.\n";

  return myTriples;
}

// Migração JUSTIFICACOES______________________________________
// Auxiliares

function getJustification(name, text, codigo, report) {
  const cleanTxt = text.replace(/(\r\n|\n|\r)/gm, "");
  const lexRegex = new RegExp(`#${name}:[^#]+`, "g");
  let result = cleanTxt.match(lexRegex);

  if (!result)
    return report(
      {
        msg: `Justificação do PCA/DF da classe ${codigo} não tem ${name}`,
        type: "parsing"
      },
      false
    );

  result = result.map(res => res.replace(`#${name}:`, "").replace(/"/g, '\\"'));

  return result;
}

function printSingleJust(criteria, content, critCode, justCode) {
  let output = "";
  output += `:${critCode} rdf:type owl:NamedIndividual ,\n`;
  output += `\t:${criteria};\n`;
  output += `\t:conteudo "${content.replace(/"/gm, '"')}".\n`;
  output += `:${justCode} :temCriterio :${critCode}.\n`;
  return output;
}

// ------ Legislacao Associada -----
function hasLegAssoc(proc, legList, critCode) {
  const legAssoc = proc.match(/\[[a-zA-Z0-9\-/ ]+\]/g);
  if (legAssoc) {
    const out = legAssoc.reduce((procOut, leg) => {
      const legRef = leg.substring(1, leg.length - 1);
      const index = legList.findIndex(
        legislacao => legislacao.tipoCode === legRef
      );
      if (index > -1)
        return `${procOut}:${critCode} :critTemLegAssoc :${legList[index].legCode}.\n`;
      return procOut;
    }, "");
    return out;
  }
  return "";
}

// ------ Classe Associada -----
function hasProcRel(procRel, procList, critCode) {
  if (procRel) {
    const out = procRel.reduce((procOut, classProc) => {
      const index = procList.findIndex(pr => pr.codigo === classProc);
      if (index > -1) {
        return `${procOut}:${critCode} :critTemProcRel :c${classProc}.\n`;
      }
      return procOut;
    }, "");
    return out;
  }
  return "";
}

// ------ Migra JustPCA-----

export function getPcaJust(data, codigo, report) {
  if (!data)
    return report(
      { msg: `Classe ${codigo} sem Justificação PCA`, type: "parsing" },
      false
    );

  const legal = getJustification("Critério legal", data, codigo, report);
  const gest = getJustification("Critério gestionário", data, codigo, report);
  const admin = getJustification(
    "Critério de utilidade administrativa",
    data,
    codigo,
    report
  );
  return { legal, gest, admin };
}

export function printJustPCA(pcas, justPcaCode, legList, procList, classe) {
  let output = "";
  let critCode = "";
  let counter = 0;

  if (pcas.legal) {
    output += pcas.legal.reduce((prev, crit) => {
      let out = "";
      counter += 1;
      critCode = `crit_${justPcaCode}_${counter}`;
      out += printSingleJust(
        "CriterioJustificacaoLegal",
        crit,
        critCode,
        justPcaCode
      );

      out += hasLegAssoc(crit, legList, critCode);
      out += hasProcRel(
        crit.match(/\d{3}\.\d{2,3}\.\d{3}/g),
        procList,
        critCode
      );

      return prev + out;
    }, "");
  }

  if (pcas.gest) {
    output += pcas.gest.reduce((prev, crit) => {
      let out = "";
      counter += 1;
      critCode = `crit_${justPcaCode}_${counter}`;
      out += printSingleJust(
        "CriterioJustificacaoGestionario",
        crit,
        critCode,
        justPcaCode
      );
      out += hasLegAssoc(crit, legList, critCode);
      out += hasProcRel(
        crit.match(/\d{3}\.\d{2,3}\.\d{3}/g),
        procList,
        critCode
      );

      return prev + out;
    }, "");
  }

  if (pcas.admin) {
    output += pcas.admin.reduce((prev, crit) => {
      let out = "";
      counter += 1;
      critCode = `crit_${justPcaCode}_${counter}`;
      out += printSingleJust(
        "CriterioJustificacaoUtilidadeAdministrativa",
        crit,
        critCode,
        justPcaCode
      );
      out += hasLegAssoc(crit, legList, critCode);
      out += hasProcRel(
        crit.match(/\d{3}\.\d{2,3}\.\d{3}/g),
        procList,
        critCode
      );

      out += classe.tipoRelProc.reduce((tempout, tipo, index) => {
        const relProc = getRelProc(tipo);
        const procRel = classe.codProcRel[index];

        return (
          tempout + invCritAdmin(relProc, procRel, classe, procList, critCode)
        );
      }, "");

      return prev + out;
    }, "");
  }
  return output;
}

// ------ Migra JustDF-----

export function getDfJust(data, codigo, report) {
  if (!data)
    return report(
      { msg: `Classe ${codigo} sem Justificação DF`, type: "parsing" },
      false
    );

  const legal = getJustification("Critério legal", data, codigo, report);
  const dens = getJustification(
    "Critério de densidade informacional",
    data,
    codigo,
    report
  );
  const comp = getJustification(
    "Critério de complementaridade informacional",
    data,
    codigo,
    report
  );
  return { legal, dens, comp };
}

export function printJustDF(dfs, justDfCode, legList, procList) {
  let output = "";
  let critCode = "";
  let counter = 0;
  let procRel = "";

  if (dfs.legal) {
    output += dfs.legal.reduce((prev, crit) => {
      let out = "";
      counter += 1;
      critCode = `crit_${justDfCode}_${counter}`;
      out += printSingleJust(
        "CriterioJustificacaoLegal",
        crit,
        critCode,
        justDfCode
      );

      procRel = crit.match(/\d{3}\.\d{2,3}\.\d{3}\.\d{2}/g);

      if (!procRel) procRel = [];

      const procLvl3 = crit.match(/\d{3}\.\d{2,3}\.\d{3}(?!\.)/g);

      if (procLvl3) {
        procRel = [...procRel, ...procLvl3];
      }

      out += hasLegAssoc(crit, legList, critCode);
      out += hasProcRel(procRel, procList, critCode);

      return prev + out;
    }, "");
  }

  if (dfs.comp) {
    output += dfs.comp.reduce((prev, crit) => {
      let out = "";
      counter += 1;
      critCode = `crit_${justDfCode}_${counter}`;
      out += printSingleJust(
        "CriterioJustificacaoComplementaridadeInfo",
        crit,
        critCode,
        justDfCode
      );

      procRel = crit.match(/\d{3}\.\d{2,3}\.\d{3}\.\d{2}/g);

      if (!procRel) procRel = [];

      const procLvl3 = crit.match(/\d{3}\.\d{2,3}\.\d{3}(?!\.)/g);

      if (procLvl3) {
        procRel = [...procRel, ...procLvl3];
      }

      out += hasLegAssoc(crit, legList, critCode);
      out += hasProcRel(procRel, procList, critCode);

      return prev + out;
    }, "");
  }

  if (dfs.dens) {
    output += dfs.dens.reduce((prev, crit) => {
      let out = "";
      counter += 1;
      critCode = `crit_${justDfCode}_${counter}`;
      out += printSingleJust(
        "CriterioJustificacaoDensidadeInfo",
        crit,
        critCode,
        justDfCode
      );

      procRel = crit.match(/\d{3}\.\d{2,3}\.\d{3}\.\d{2}/g);

      if (!procRel) procRel = [];

      const procLvl3 = crit.match(/\d{3}\.\d{2,3}\.\d{3}(?!\.)/g);

      if (procLvl3) {
        procRel = [...procRel, ...procLvl3];
      }

      out += hasLegAssoc(crit, legList, critCode);
      out += hasProcRel(procRel, procList, critCode);

      return prev + out;
    }, "");
  }
  return output;
}

export function getFilhos(classe, classes) {
  const code = classe.join(".");

  const lexRegex = new RegExp(`${code}.\\d{2}`, "g");

  return classes.filter(item => {
    if (item.codigo === code) return false;
    return item.codigo.match(lexRegex);
  });
}

/**
 * :FIXME:
 * @param {} tipo
 */
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
