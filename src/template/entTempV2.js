/**
 * Example output [NOT REAL]:
 *
 * ###  http://jcr.di.uminho.pt/m51-clav#ent_ACSS
 * :ent_ACSS rdf:type owl:NamedIndividual ,
 * :Entidade ;
 * :entEstado "A";
 * :entSIOE "149110000";
 * :entSigla "ACSS";
 * :entDesignacao "Administração Central do Sistema de Saúde, IP";
 * :entInternacional "".
 * :ent_ACSS :pertenceTipologiaEnt :tip_AP.
 * :ent_ACSS :pertenceTipologiaEnt :tip_IP.
 */
export default function template(ent, print) {
  print(
    `###  http://jcr.di.uminho.pt/m51-clav#ent_${ent.sigla}`,
    `:ent_${ent.sigla} rdf:type owl:NamedIndividual ,`,
    `\t:Entidade ;`,
    `\t:entEstado "${ent.estado}";`,
    `\t:entSIOE "${ent["ID SIOE"]}";`,
    `\t:entSigla "${ent.sigla}";`,
    `\t:entDesignacao "${ent.Designação}";`,
    `\t:entInternacional "${ent.international}".`,
    entTipo(ent.sigla, ent.entTipo)
  );
}

function entTipo(sigla, tipo) {
  if (!tipo) return "";
  return tipo.reduce((prev, tip, index) => {
    if (!tip) return prev;
    if (index) prev += "\n";
    return `${prev}:ent_${sigla} :pertenceTipologiaEnt :tip_${tip}.`;
  }, "");
}
