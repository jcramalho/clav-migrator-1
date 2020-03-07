export function getEstado(estado) {
  if (estado === undefined || estado.trim() === "") return "A";
  if (/[hH][aA][rR][mM][oO][nN]/.test(estado)) return "H";
  if (/[iI][nN][Aa][tT][iI][vV]/.test(estado)) return "I";
  return false;
}

export function getClasse(cod) {
  const digArray = cod.split(".");

  if (digArray.length > 4) return false;
  return digArray;
}

// Migração do Processo c400.10.001______________________________________
export function proc_c400_10_001(classe) {
  let myTriples = `###  http://jcr.di.uminho.pt/m51-clav#${classe.pcaCode}\n`;
  myTriples += `:${classe.pcaCode} rdf:type owl:NamedIndividual ,\n`;
  myTriples += "\t:PCA ;\n";
  myTriples += "\t:pcaValor 30;\n";
  myTriples += "\t:pcaValor 50;\n";
  myTriples += "\t:pcaValor 100;\n";
  myTriples += '\t:pcaNota "30 anos após a data do assento de óbito";\n';
  myTriples += '\t:pcaNota "50 anos sobre a data do registo de casamento";\n';
  myTriples += '\t:pcaNota "100 anos após a data do assento de nascimento".\n';
  myTriples += `:${classe.pcaCode} :pcaFormaContagemNormalizada :vc_pcaFormaContagem_disposicaoLegal .\n`;
  myTriples += `:${classe.pcaCode} :pcaSubformaContagem :vc_pcaSubformaContagem_F01.01 .\n`;
  myTriples += `:${classe.pcaCode} :pcaFormaContagem "(1) Data do assento de óbito (2) Data do registo de casamento. (3) Data do assento de nascimento. No caso dos registos em livro os prazos contam-se a partir da data do último assento lavrado no livro.".\n`;
  myTriples += `:c${classe.codigo} :temPCA :${classe.pcaCode}.\n`;
  // Justificação do PCA
  myTriples += "###  http://jcr.di.uminho.pt/m51-clav#just_pca_c400.10.001\n";
  myTriples += ":just_pca_c400.10.001 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t:JustificacaoPCA.\n";
  myTriples += ":pca_c400.10.001 :temJustificacao :just_pca_c400.10.001.\n";
  // Critério
  myTriples += ":crit_just_pca_c400.10.001_1 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t:CriterioJustificacaoLegal;\n";
  myTriples +=
    '\t:conteudo "[DL 324/2007], artº 15; 1 - Os livros cujos registos tenham sido objecto de informatização são transferidos para a entidade responsável pelos arquivos nacionais; 2 - O disposto no número anterior é aplicável aos livros de registo relativamente aos quais tenha decorrido, à data do último assento: a) Mais de 30 anos, quanto aos livros de assentos de óbito; b) Mais de 50 anos, quanto aos livros de assentos de casamento; c) Mais de 100 anos, quanto aos restantes livros de assentos; 3 - O disposto no número anterior é aplicável aos documentos que tenham servido de base aos assentos nele referidos; (Tem por base o tempo médio de vida da pessoa, visa a utilidade gestionária esgotando quase na totalidade as necessidades administrativas de consulta).".\n';
  myTriples += ":crit_just_pca_c400.10.001_1 :temLegislacao :leg_602.\n";
  myTriples +=
    ":just_pca_c400.10.001 :temCriterio :crit_just_pca_c400.10.001_1 .\n";
  // Destino Final
  myTriples += "###  http://jcr.di.uminho.pt/m51-clav#df_c400.10.001\n";
  myTriples += ":df_c400.10.001 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t:DestinoFinal ;\n";
  myTriples += '\t:dfValor "C".\n';
  myTriples += ":c400.10.001 :temDF :df_c400.10.001 .\n";
  // Justificação do Destino Final
  myTriples += "###  http://jcr.di.uminho.pt/m51-clav#just_df_c400.10.001\n";
  myTriples += ":just_df_c400.10.001 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t\t:JustificacaoDF.\n";

  myTriples += ":df_c400.10.001 :temJustificacao :just_df_c400.10.001 .\n";

  myTriples += ":crit_just_df_c400.10.001_1 rdf:type owl:NamedIndividual ,\n";
  myTriples += "\t:CriterioJustificacaoLegal;\n";
  myTriples +=
    '\t:conteudo "Código Civil, [DL 47344/66] (conservação para garante do exercício dos direitos de personalidade. Consagram direitos que não prescrevem no tempo).".\n';
  myTriples +=
    ":just_df_c400.10.001 :temCriterio :crit_just_df_c400.10.001_1 .\n";
  myTriples += ":crit_just_df_c400.10.001_1 :temLegislacao :leg_6.\n";

  return myTriples;
}
