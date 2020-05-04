/**
 * Example output [NOT REAL]:
 *
 * ###  http://jcr.di.uminho.pt/m51-clav#tip_AC
 * :tip_AAGR rdf:type owl:NamedIndividual ,
 * :TipologiaEntidade ;
 * :tipEstado "A";
 * :tipSigla "AAGR";
 * :tipDesignacao "Assembleias de apuramento geral dos resultados".
 */
export default function template(ti, print) {
  print(
    `###  http://jcr.di.uminho.pt/m51-clav#${ti.tiCode}`,
    `:${ti.tiCode} rdf:type owl:NamedIndividual ,`,
    `\t:TermoIndice ;`,
    `\trdfs:label "TI: ${ti.termo}";`,
    `\t:estaAssocClasse :${ti.classCode};`,
    `\t:estado "A";`,
    `\t:termo "${ti.termo}".`
  );
}
