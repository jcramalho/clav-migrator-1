/**
 * Example output [NOT REAL]:
 *
 * ###  http://jcr.di.uminho.pt/m51-clav#ent_ACSS
 * :leg_653H24ow0HTpLUaoMiemN rdf:type owl:NamedIndividual ,
 *  :Legislacao ;
 * :rdfs:label "Leg.: Portaria 1185/90";
 * :diplomaTipo "Portaria";
 * :temEntidadeResponsavel :ent_CEE;
 * :diplomaNumero "1185/90";
 * :diplomaData "16-08-1991";
 * :diplomaSumario "Estabelece um conjunto de normas relativas à avaliação";
 * :diplomaEstado "Revogado";
 * :diplomaFonte "PGD";
 * :diplomaLink "https://dre.pt/application/file/a/565294".
 */
export default function template(
  classe,
  print,
  report,
  { entidade, tipologia, legislacao }
) {
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
    PrintRelProc(classe, report),
    PrintRelLeg(classe, legislacao),
    PrintDim(classe),
    PrintUnif(classe),
    `\t:descricao "${classe.descricao}".`
  );
}

function printFather(classe) {
  if (classe.classe.length === 1) return "\t:temPai :lc1 ;";
  return `\t:temPai :c${[...classe.classe.slice(0, -1)].join(".")} ;`;
}

//TODO: Test all functions bellow
function printTipoProc(classe) {
  if (classe.classe.length !== 3) return;
  if (classe.tipoProc === "PC" || classe.tipoProc === "PE")
    return `\t:processoTipoVC :vc_processoTipo_${classe.tipoProc.toLowerCase()} ;`;
  return;
}

function printTransversalProc(classe) {
  if (!classe["Processo transversal (S/N)"]) return;
  return `\t:processoTransversal "${classe["Processo transversal (S/N)"]}" ;`;
}

function printParticipantProc(classe, entidade, tipologia) {
  if (classe["Processo transversal (S/N)"] === "S") {
    let output = classe.parts.reduce((prev, part, index) => {
      //FIXME: Move to parser???
      part.replace(/^[_]+/, "");
      if (!part) return prev;
      if (index) prev += "\n";
      let prefix = getPrefix(part, entidade, tipologia);

      return `${prev}\t:temParticipante${
        {
          Apreciar: "Apreciador",
          Assessorar: "Assessor",
          Comunicar: "Comunicador",
          Decidir: "Decisor",
          Executar: "Executor",
          Iniciar: "Iniciador",
        }[classe.tiposInt[index]]
      } :${prefix}${part} ; `;
    }, "");
    return output;
  }
  return;
}

function printOwnersProc(classe, entidade, tipologia) {
  return classe.donosProc.reduce((prev, dono, index) => {
    if (!dono) return prev;
    if (index) prev += "\n";
    let prefix = getPrefix(dono, entidade, tipologia);
    return `${prev}\t:temDono :${prefix}${dono} ;`;
  }, "");
}

function PrintRelProc(classe, report) {
  classe.codProcRel.pop(); // FIXME: CORRECT THIS IN THE PARSER
  classe.tipoRelProc.pop(); // FIXME: CORRECT THIS IN THE PARSER

  if (classe.codProcRel.length !== classe.tipoRelProc.length) {
    report("teste: Lengths dont match");
    return classe.codProcRel.reduce((prev, cod, index) => {
      if (index) prev += "\n";
      return `${prev}\t:temRelProc ":c${cod}" ;`;
    }, "");
  }
  return classe.tipoRelProc.reduce((prev, tipo, index) => {
    if (index) prev += "\n";
    return `${prev}\t:${getRelProc(tipo)} :c${classe.codProcRel[index]} ;`;
  }, "");
}

function PrintRelLeg(classe, legislacao) {
  return classe.diplomas.reduce((prev, diploma, index) => {
    diploma.trim();
    let tipLoc = legislacao.findIndex(({ tipoCode }) => tipoCode === diploma);
    if (tipLoc > -1) {
      if (index) prev += "\n";
      `${prev}\t:temLegislacao :${legislacao[index].legCode} ;`;
    }
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

/**
 *
 * HELPER FUNCTIONS BELLOW
 *
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

function getPrefix(part, entidade, tipologia) {
  if (hasPart(part, entidade)) return "ent_";
  if (hasPart(part, tipologia)) return "tip_";
  return false;
}

function hasPart(part, arr) {
  return arr.findIndex(({ sigla }) => sigla == part) > -1;
}
