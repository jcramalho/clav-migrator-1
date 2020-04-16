export default function tiTemp(data) {
  let ttl = "";
  let counter = 0;
  ttl += data.ti.reduce((prev, ti) => {
    counter += 1;
    let temp = `${prev}###  http://jcr.di.uminho.pt/m51-clav#${ti.tiCode}\n`;
    temp += `:${ti.tiCode} rdf:type owl:NamedIndividual ,\n`;
    temp += `\t:TermoIndice ;\n`;
    temp += `\trdfs:label "TI: ${ti.termo}";\n`;
    temp += `\t:estaAssocClasse :${ti.classCode};\n`;
    temp += `\t:estado "A";\n`;
    temp += `\t:termo "${ti.termo}".\n`;

    return temp;
  }, "");

  console.log(`Foram migradas ${counter} termos-índice`);

  return ttl;
}
