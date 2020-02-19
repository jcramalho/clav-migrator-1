export default function legTemp(data) {
  let ttl = "";
  ttl += data.legislacao.reduce((prev, legislacao) => {
    let temp = `${prev}###  http://jcr.di.uminho.pt/m51-clav#${legislacao.legCode}\n`;
    temp += `:${legislacao.legCode} rdf:type owl:NamedIndividual ,\n`;
    temp += `\t:Legislacao ;\n`;
    temp += `\t:rdfs:label "Leg.: ${legislacao.tipoCode}";\n`;
    temp += `\t:diplomaTipo "${legislacao.Tipo}";\n`;
    temp += legislacao.entidadesResp.reduce(
      (prevEnt, entidade) =>
        `${prevEnt}\t:temEntidadeResponsavel :ent_${entidade};\n`,
      ""
    );
    temp += `\t:diplomaNumero "${legislacao.Número}";\n`;
    temp += `\t:diplomaData "${legislacao.Data}";\n`;
    temp += `\t:diplomaSumario "${legislacao.sumario}";\n`;
    temp += `\t:diplomaEstado "${legislacao.estado}";\n`;
    temp += legislacao.Fonte ? `\t:diplomaFonte "${legislacao.Fonte}";\n` : "";
    temp += `\t:diplomaLink "${legislacao.Link}".\n`;
    return temp;
  }, "");
  return ttl;
}

// FIXME Datas incorretas
