/*
DF distinto: Deve haver uma relação de síntese (de ou por) entre as classes 4 filhas -> CORRIGIDO
*/
export function invDfDistinto(classe, classes) {
  if (classe.classe.length !== 4) return "";

  const codL4 = classe.classe;
  const codL3 = [codL4[0], codL4[1], codL4[2]].join(".");

  const lexRegex = new RegExp(`${codL3}.\\d{2}`, "g");

  const irmao = classes.filter(item => {
    if (item.codigo === classe.codigo) return false;
    return lexRegex.test(item.codigo);
  });

  return irmao.reduce((prev, item, index) => {
    if (index) prev += "\n";
    return `${prev}\t:eSinteseDe :${item.classCod} ;`;
  }, "");
}

/*
1) As relações temDF e temPCA, não existem numa classe 3 se esta tiver filhos -> CORRIGIDO + REPORT

2) As relações temDF e temPCA, existem numa classe 3 se esta não tiver filhos -> REPORT
*/

export function relacoesDfPca(classe, classes, report) {
  const codL3 = classe.codigo;
  const lexRegex = new RegExp(`${codL3}.\\d{2}`, "g");

  const filhos = classes.filter(item => {
    return lexRegex.test(item.codigo);
  });

  if (filhos.length > 0) {
    if (
      classe["Prazo de conservação administrativa"] ||
      classe["Prazo de conservação administrativa"] === 0
    )
      report(
        {
          msg: `A classe ${codL3} não pode ter filhos e PCA`,
          type: "invariantes"
        },
        false
      );
    if (classe["Destino final"])
      report(
        {
          msg: `A classe ${codL3} não pode ter filhos e DF`,
          type: "invariantes"
        },
        false
      );
    return false;
  }

  if (
    !classe["Prazo de conservação administrativa"] ||
    !classe["Prazo de conservação administrativa"] === 0
  )
    report(
      {
        msg: `A classe ${codL3} não tem filhos nem PCA`,
        type: "invariantes"
      },
      false
    );
  if (!classe["Destino final"])
    report(
      {
        msg: `A classe ${codL3} não tem filhos nem DF`,
        type: "invariantes"
      },
      false
    );
  return true;
}
