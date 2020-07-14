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
export default function template(tipo, print) {
  print(
    `###  http://jcr.di.uminho.pt/m51-clav#tip_${tipo.sigla}`,
    `\t:tip_${tipo.sigla} rdf:type owl:NamedIndividual ,`,
    `\t:TipologiaEntidade ;`,
    `\t:tipEstado "A";`,
    `\t:tipSigla "${tipo.sigla}";`,
    `\t:tipDesignacao "${tipo.Designação}".`
  );
}
