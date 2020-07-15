/**
 * Example output [NOT REAL]:
 *
 * ###  http://jcr.di.uminho.pt/m51-clav#ti_9_m1NIOuma8tisqbwvYyZ
 * :ti_9_m1NIOuma8tisqbwvYyZ rdf:type owl:NamedIndividual ,
 * :TermoIndice ;
 * rdfs:label "TI: Ato legislativo (produção e comunicação)";
 * :estaAssocClasse :c100.10.001;
 * :tipDesignacao "Assembleias de apuramento geral dos resultados".
 * :termo "Ato legislativo (produção e comunicação)".
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
