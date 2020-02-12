export default function entTemp(data) {
  let ttl = "";
  ttl += data.reduce((prev, ent) => {
    let temp = `${prev}###  http://jcr.di.uminho.pt/m51-clav#ent_${ent.sigla}\n`;
    temp += `:ent_${ent.sigla} rdf:type owl:NamedIndividual ,\n \t\t:Entidade ;\n`;
    temp += `\t:entEstado "${ent.estado}";\n`;
    temp += `\t:entSIOE "${ent["ID SIOE"]}";\n`;
    temp += `\t:entSigla "${ent.sigla}";\n`;
    // TODO: datas criação e extinçao
    temp += `\t:entDesignacao "${ent.Designação}";\n`;
    temp += `\t:entInternacional "${ent.international}";.\n`;
    if (ent.entTipo) {
      temp += ent.entTipo.reduce((previous, tip) => {
        if (tip) {
          return `${previous}:ent_${ent.sigla} :pertenceTipologiaEnt :tip_${tip}.\n`;
        }
        return previous;
      }, "");
    }

    return temp;
  }, "");
  return ttl;
}
