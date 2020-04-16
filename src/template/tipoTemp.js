export default function tipoTemp(data) {
  let ttl = "";
  let counter = 0;
  ttl += data.tipologia.reduce((prev, tipologia) => {
    counter += 1;
    let temp = `${prev}###  http://jcr.di.uminho.pt/m51-clav#tip_${tipologia.Sigla}\n`;
    temp += `:tip_${tipologia.Sigla} rdf:type owl:NamedIndividual ,\n`;
    temp += `\t\t:TipologiaEntidade ;\n`;
    temp += `\t:tipEstado "A";\n`;
    temp += `\t:tipSigla "${tipologia.Sigla}";\n`;
    temp += `\t:tipDesignacao "${tipologia.Designação}".\n`;

    return temp;
  }, "");

  console.log(`Foram migradas ${counter} tipologias`);

  return ttl;
}
