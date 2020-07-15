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
export default function template(leg, print) {
  print(
    `###  http://jcr.di.uminho.pt/m51-clav#${leg.legCode}`,
    `:${leg.legCode} rdf:type owl:NamedIndividual ,`,
    `\t:Legislacao ;`,
    `\t:rdfs:label "Leg.: ${leg.tipoCode}";`,
    `\t:diplomaTipo "${leg.Tipo}";`,
    entResp(leg.entidadesResp),
    `\t:diplomaNumero "${leg.numero}";`,
    `\t:diplomaData "${leg.Data}";`,
    `\t:diplomaSumario "${leg.sumario}";`,
    `\t:diplomaEstado "${leg.estado}";`,
    leg.Fonte ? `\t:diplomaFonte "${leg.Fonte}";` : "",
    `\t:diplomaLink "${leg.Link}".`
  );
}

function entResp(resp) {
  return resp.reduce((prev, ent, index) => {
    if (index) prev += "\n";
    return `${prev}\t:temEntidadeResponsavel :ent_${ent};`;
  }, "");
}
