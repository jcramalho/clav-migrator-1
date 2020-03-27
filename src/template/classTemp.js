/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import { proc_c400_10_001, printJustPCA, printJustDF } from "../helper.js";

// import { proc_c400_10_001 } from "../helper";

/* eslint-disable no-nested-ternary */
export default code => data => {
  let ttl = "";
  ttl += data[code].reduce((prev, classe) => {
    let temp = `${prev}###  http://jcr.di.uminho.pt/m51-clav#${classe.classCod}\n`;
    temp += `:${classe.classCod} rdf:type owl:NamedIndividual ;\n`;
    temp += `\t:classeStatus "${classe.estado}";\n`;
    temp += `\trdf:type :Classe_N${classe.classe.length};\n`;
    temp += `\t:codigo "${classe.codigo}";\n`;
    temp += `\t:titulo "${classe.titulo}";\n`;

    if (classe.classe) {
      temp += "\t:pertenceLC :lc1 ;\n";
    }

    const paiClass = [...classe.classe];

    paiClass.pop();

    switch (classe.classe.length) {
      case 1:
        temp += "\t:temPai :lc1 ;\n";
        break;
      case 2:
      case 3:
      case 4:
        temp += `\t:temPai :c${paiClass.join(".")} ;\n`;
        break;
      default:
        break;
    }

    if (classe.classe.length === 3) {
      switch (classe.tipoProc) {
        case "PC":
          temp += "\t:processoTipoVC :vc_processoTipo_pc ;\n";
          break;
        case "PE":
          temp += "\t:processoTipoVC :vc_processoTipo_pe ;\n";
          break;
        default:
          break;
      }

      if (classe["Processo transversal (S/N)"]) {
        temp += `\t:processoTransversal "${classe["Processo transversal (S/N)"]}" ;\n`;
        if (classe["Processo transversal (S/N)"] === "S") {
          // Participantes do processo
          if (classe["Participante no processo"]) {
            classe.parts.map((part, index) => {
              // FIXME: Mudar para parser?
              part.replace(/^[_]+/, "");
              if (part) {
                const prefixo = data.entidade.filter(ent => ent.sigla === part)
                  .length
                  ? "ent_"
                  : data.tipologia.filter(tip => tip.sigla === part).length
                  ? "tip_"
                  : false;
                if (prefixo) {
                  // Tipo de participação
                  switch (classe.tiposInt[index]) {
                    case "Apreciar":
                      temp += `\t:temParticipanteApreciador :${prefixo}${part} ;\n`;
                      break;
                    case "Assessorar":
                      temp += `\t:temParticipanteAssessor :${prefixo}${part} ;\n`;
                      break;
                    case "Comunicar":
                      temp += `\t:temParticipanteComunicador :${prefixo}${part} ;\n`;
                      break;
                    case "Decidir":
                      temp += `\t:temParticipanteDecisor :${prefixo}${part} ;\n`;
                      break;
                    case "Executar":
                      temp += `\t:temParticipanteExecutor :${prefixo}${part} ;\n`;
                      break;
                    case "Iniciar":
                      temp += `\t:temParticipanteIniciador :${prefixo}${part} ;\n`;
                      break;
                    default:
                      break;
                  }
                }
              }
              return "";
            });
          }
        }
      }
      // Donos do processo

      classe.donosProc.map(dono => {
        if (dono) {
          const prefixo = data.entidade.filter(ent => ent.sigla === dono).length
            ? "ent_"
            : data.tipologia.filter(tip => tip.sigla === dono).length
            ? "tip_"
            : false;

          temp += `\t:temDono :${prefixo}${dono} ;\n`;
        }
        return "";
      });
    }

    classe.codProcRel.pop();
    classe.tipoRelProc.pop();

    // Relações com os outros processos
    if (classe.codProcRel.length !== classe.tipoRelProc.length) {
      classe.codProcRel.map(cod => {
        temp += `\t:temRelProc ":c${cod}" ;\n`;
        return "";
      });
    } else {
      classe.tipoRelProc.map((tipo, index) => {
        if (tipo.match(/S[íi]ntese[ ]*\(s[ií]ntetizad[oa]\)/gi)) {
          temp += `\t:eSintetizadoPor :c${classe.codProcRel[index]} ;\n`;
        } else if (tipo.match(/S[íi]ntese[ ]*\(sintetiza\)/gi)) {
          temp += `\t:eSinteseDe :c${classe.codProcRel[index]} ;\n`;
        } else if (tipo.startsWith("Complementar")) {
          temp += `\t:eComplementarDe :c${classe.codProcRel[index]} ;\n`;
        } else if (tipo.match(/\s*Cruzad/gi)) {
          temp += `\t:eCruzadoCom :c${classe.codProcRel[index]} ;\n`;
        } else if (tipo.match(/\s*Suplement.?\s*de/)) {
          temp += `\t:eSuplementoDe :c${classe.codProcRel[index]} ;\n`;
        } else if (tipo.match(/\s*Suplement.?\s*para/)) {
          temp += `\t:eSuplementoPara :c${classe.codProcRel[index]} ;\n`;
        } else if (tipo.match(/Sucessão[ ]*\(suce/gi)) {
          temp += `\t:eSucessorDe :c${classe.codProcRel[index]} ;\n`;
        } else if (tipo.match(/\s*Sucessão\s*\(antece/gi)) {
          temp += `\t:eAntecessorDe :c${classe.codProcRel[index]} ;\n`;
        } else {
          temp += `\t:temRelProc :c${classe.codProcRel[index]} ;\n`;
        }

        return "";
      });
    }

    // Relações com a legislação
    classe.diplomas.map(diploma => {
      diploma.trim();
      const index = data.legislacao.findIndex(leg => leg.tipoCode === diploma);
      if (index > -1) {
        temp += `\t:temLegislacao :${data.legislacao[index].legCode} ;\n`;
      }
      return "";
    });

    if (classe.classe.length > 2) {
      // Dimensão qualitativa do processo
      if (classe.dimQual.match(/Elevada|Reduzida|Média/i))
        temp += `\t:processoDimQual "${classe.dimQual}" ;\n`;
      // Uniformização do processo
      if (classe.unifProc.match(/S|N/i)) {
        temp += `\t:processoUniform "${classe.unifProc}" ;\n`;
      }
    }

    temp += `\t:descricao "${classe.descricao}".\n`;

    // MigraNA
    classe.naList.pop();

    temp += classe.naList.reduce((prevNa, na) => {
      let out = `${prevNa}###  http://jcr.di.uminho.pt/m51-clav#${na.id}\n`;
      out += `:${na.id} rdf:type owl:NamedIndividual ,\n`;
      out += "\t\t:NotaAplicacao ;\n";
      out += '\t:rdfs:label "Nota de Aplicação";\n';
      out += `\t:conteudo "${na.conteudo}".\n\n`;
      // criar as relações com das notas de aplicação com a classe
      out += `:${classe.classCod} :temNotaAplicacao :${na.id} .\n`;
      return out;
    }, "");

    // MigraExNA

    classe.exNaList.pop();

    temp += classe.exNaList.reduce((prevExNa, exNa) => {
      let out = `${prevExNa}###  http://jcr.di.uminho.pt/m51-clav#${exNa.id}\n`;
      out += `:${exNa.id} rdf:type owl:NamedIndividual ,\n`;
      out += "\t:ExemploNotaAplicacao ;\n";
      out += '\t:rdfs:label "Exemplo de nota de aplicação";\n';
      out += `\t:conteudo "${exNa.conteudo}".\n\n`;
      // criar as relações com dos exemplos das notas de aplicação com a classe
      out += `:${classe.classCod} :temExemploNA :${exNa.id} .\n`;
      return out;
    }, "");

    // MigraNE

    classe.neList.pop();

    temp += classe.neList.reduce((prevNe, ne) => {
      let out = `${prevNe}###  http://jcr.di.uminho.pt/m51-clav#${ne.id}\n`;
      out += `:${ne.id} rdf:type owl:NamedIndividual ,\n`;
      out += "\t:NotaExclusao ;\n";
      out += '\t:rdfs:label "Nota de Exclusão";\n';
      out += `\t:conteudo "${ne.conteudo}".\n\n`;
      // criar as relações com das notas de exclusão com a classe
      out += `:${classe.classCod} :temNotaExclusao :${ne.id} .\n`;

      return out;
    }, "");

    if (!Array.isArray(data.classesLvl3)) {
      data.classesLvl3 = [];
    }

    if (classe.codigo === "400.10.001") {
      temp += proc_c400_10_001(classe);
    } else if (classe.classe.length === 3) {
      if (classe["Prazo de conservação administrativa"]) {
        temp += procPCA(
          classe,
          classe.pcaCode,
          classe.codigo,
          data.legislacao,
          data.classes
        );
      } else if (!(classe.codigo in data.classesLvl3)) {
        // Registar a classe para tratar o nível 4
        data.classesLvl3.push(classe.codigo);
      }
      if (classe["Destino final"]) {
        temp += procDF(
          classe,
          classe.dfCode,
          classe.codigo,
          data.legislacao,
          data.classes
        );
      } else if (!(classe.codigo in data.classesLvl3)) {
        // Registar a classe para tratar o nível 4
        data.classesLvl3.push(classe.codigo);
      }
    } else if (classe.classe.length === 4) {
      const sep = classe.codigo.lastIndexOf(".");
      const pai = classe.codigo.slice(0, sep);
      const index = data.classesLvl3.indexOf(pai);
      if (index > -1) {
        if (classe["Prazo de conservação administrativa"]) {
          temp += procPCA(
            classe,
            classe.pcaCode,
            classe.codigo,
            data.legislacao,
            data.classes
          );
        }
        if (classe["Destino final"]) {
          temp += procDF(
            classe,
            classe.dfCode,
            classe.codigo,
            data.legislacao,
            data.classes
          );
        }
        /*
        else if(jsonObj['Nota ao PCA']){
          console.error('WARN: PCA descrito em nota: ' + cod)
        }
        */
      }
    }

    if (!Array.isArray(data.indClasses)) {
      data.indClasses = [];
    }
    data.indClasses.push(classe.codigo);

    return temp;
  }, "");
  return ttl;
};

// Migração do PCA_____________________________________________________________

function procPCA(data, pcaCode, cod, leg, classes) {
  let myTriples = `###  http://jcr.di.uminho.pt/m51-clav#${pcaCode}\n`;
  myTriples += `:${pcaCode} rdf:type owl:NamedIndividual ,\n`;
  myTriples += "\t:PCA .\n";

  const regex = RegExp("[]*[0-9]+[]*");
  if (regex.test(data["Prazo de conservação administrativa"])) {
    myTriples += `:${pcaCode} :pcaValor ${data["Prazo de conservação administrativa"]}.\n`;
  }

  if (data["Nota ao PCA"] && data["Nota ao PCA"].trim() !== "") {
    myTriples +=
      `:${pcaCode} :pcaNota ` +
      `"${data["Nota ao PCA"].replace(/"/g, '\\"')}".\n\n`;
  }

  myTriples += `:c${cod} :temPCA :${pcaCode}.\n`;

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
      myTriples += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_conclusaoProcedimento .\n`;
    } else if (re_fc_dispLeg.test(myContagem)) {
      myTriples += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_disposicaoLegal .\n`;

      const linhasSubforma = myContagem.split("\n");
      linhasSubforma.splice(0, 1);
      const mySubforma = linhasSubforma.join("\n");
      if (mySubforma.trim().startsWith("10", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.10 .\n`;
      } else if (mySubforma.trim().startsWith("11", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.11 .\n`;
      } else if (mySubforma.trim().startsWith("12", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.12 .\n`;
      } else if (mySubforma.trim().startsWith("1", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.01 .\n`;
      } else if (mySubforma.trim().startsWith("2", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.02 .\n`;
      } else if (mySubforma.trim().startsWith("3", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.03 .\n`;
      } else if (mySubforma.trim().startsWith("4", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.04 .\n`;
      } else if (mySubforma.trim().startsWith("5", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.05 .\n`;
      } else if (mySubforma.trim().startsWith("6", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.06 .\n`;
      } else if (mySubforma.trim().startsWith("7", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.07 .\n`;
      } else if (mySubforma.trim().startsWith("8", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.08 .\n`;
      } else if (mySubforma.trim().startsWith("9", 0)) {
        myTriples += `:${pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.09 .\n`;
      } else {
        console.log(
          `ERRO: Subforma de contagem inválida: ${mySubforma} em ${pcaCode}`
        );
      }
    } else if (re_fc_extEnt.test(myContagem)) {
      myTriples += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_extincaoEntidade .\n`;
    } else if (re_fc_extDir.test(myContagem)) {
      myTriples += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_extincaoDireito .\n`;
    } else if (re_fc_cessVig.test(myContagem)) {
      myTriples += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_cessacaoVigencia .\n`;
    } else if (re_fc_inicProc.test(myContagem)) {
      myTriples += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_inicioProcedimento .\n`;
    } else if (re_fc_emiTit.test(myContagem)) {
      myTriples += `:${pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_emissaoTitulo .\n`;
    } else {
      console.log(
        `ERRO: Forma de contagem inválida: ${myContagem} em ${pcaCode}`
      );
    }
  }

  if (data["Justificação PCA"]) {
    myTriples += `###  http://jcr.di.uminho.pt/m51-clav#${data.justPcaCode}\n`;
    myTriples += `:${data.justPcaCode} rdf:type owl:NamedIndividual ,\n`;
    myTriples += "\t:JustificacaoPCA.\n";
    myTriples += `:${pcaCode} :temJustificacao :${data.justPcaCode}.\n`;

    myTriples += printJustPCA(data.pcaJust, data.justPcaCode, leg, classes);
  }

  return myTriples;
}

// Migração do DF_____________________________________________________________

function procDF(data, dfCode, cod, leg, classes) {
  let myTriples = `###  http://jcr.di.uminho.pt/m51-clav#${dfCode}\n`;
  myTriples += `:${dfCode} rdf:type owl:NamedIndividual ,\n`;
  myTriples += "\t:DestinoFinal";
  myTriples += ` ;\n\t:dfValor "${data["Destino final"].replace(
    /(\r\n|\n|\r)/gm,
    ""
  )}"`;
  if (data["Nota ao DF"]) {
    myTriples += `;\n\t:dfNota "${data["Nota ao DF"].replace(
      /(\r\n|\n|\r)/gm,
      ""
    )}".\n`;
  } else {
    myTriples += ".\n";
  }

  myTriples += `:c${cod} :temDF :${dfCode}.\n`;

  if (data["Justificação DF"]) {
    myTriples += `###  http://jcr.di.uminho.pt/m51-clav#${data.justDfCode}\n`;
    myTriples += `:${data.justDfCode} rdf:type owl:NamedIndividual ,\n`;
    myTriples += "\t:JustificacaoDF.\n";

    myTriples += `:${dfCode} :temJustificacao :${data.justDfCode}.\n`;
    myTriples += printJustDF(data.dfJust, data.justDfCode, leg, classes);
  }
  return myTriples;
}
