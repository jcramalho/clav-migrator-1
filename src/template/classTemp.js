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
          temp += `\t:eCruzadoCom ${classe.codProcRel[index]} ;\n`;
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

    return temp;
  }, "");
  return ttl;
};
