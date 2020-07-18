/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
import { getFilhos } from "./helper.js";

/*
2.2) DF distinto: Deve haver uma relação de síntese (de ou por) entre as classes 4 filhas -> CORRIGIDO
*/
export function invDfDistintoasas(classe, classes) {
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

export function invDfDistinto(classe, classes) {
  if (classe.classe.length !== 4) return { codProcRel: [], tipoRelProc: [] };

  const codL4 = classe.classe;
  const codL3 = [codL4[0], codL4[1], codL4[2]].join(".");

  const lexRegex = new RegExp(`${codL3}.\\d{2}`, "g");

  const irmao = classes.filter(item => {
    if (item.codigo === classe.codigo) return false;
    return lexRegex.test(item.codigo);
  });

  return {
    codProcRel: [...irmao.map(item => item.codigo)],
    tipoRelProc: [...irmao.map(() => "Síntese (sintetiza)")]
  };
}

/*
2.4) As relações temDF e temPCA, não existem numa classe 3 se esta tiver filhos -> CORRIGIDO + REPORT

2.5) As relações temDF e temPCA, existem numa classe 3 se esta não tiver filhos -> REPORT

3.1) Um processo sem desdobramento ao 4º nível tem de ter uma justificação associada ao PCA -> REPORT
*/

export function relacoesPca(classe, classes, report) {
  const codL3 = classe.codigo;
  const lexRegex = new RegExp(`${codL3}.\\d{2}`, "g");

  const filhos = classes.filter(item => {
    return item.codigo.match(lexRegex);
  });

  if (filhos.length > 0) {
    if (
      classe["Prazo de conservação administrativa"] ||
      classe["Prazo de conservação administrativa"] === 0
    )
      report(
        {
          msg: `A classe ${codL3} não pode ter filhos e PCA`,
          type: 2,
          code: 4
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
        type: 2,
        code: 5
      },
      false
    );
  if (!classe["Justificação PCA"])
    report(
      {
        msg: `A classe ${codL3} não tem filhos nem Justificação de PCA`,
        type: 3,
        code: 1
      },
      false
    );
  return true;
}

export function relacoesDf(classe, classes, report) {
  const codL3 = classe.codigo;
  const lexRegex = new RegExp(`${codL3}.\\d{2}`, "g");

  const filhos = classes.filter(item => {
    return item.codigo.match(lexRegex);
  });

  if (filhos.length > 0) {
    if (classe["Destino final"])
      report(
        {
          msg: `A classe ${codL3} não pode ter filhos e DF`,
          type: 2,
          code: 4
        },
        false
      );
    return false;
  }
  if (!classe["Destino final"])
    report(
      {
        msg: `A classe ${codL3} não tem filhos nem DF`,
        type: 2,
        code: 5
      },
      false
    );
  return true;
}

/*
3.14) Um diploma legislativo referenciado num critério de justicação tem de estar associado na zona de contexto do processo que tem essa justificação (Classes de nível 3) -> CORRIGIDO

3.15) Um diploma legislativo referenciado num critério de justicação tem de estar associado na zona de contexto do processo que tem essa justificação (Classes de nível 4) -> CORRIGIDO
*/

export function legsCritLegal(critLegal, legList) {
  const legAssoc = critLegal.reduce((prev, leg) => {
    const l = leg.match(/\[[a-zA-Z0-9\-/ ]+\]/g);

    if (Array.isArray(l)) prev.push(...l);
    return prev;
  }, []);

  if (legAssoc) {
    const out = legAssoc.reduce((prev, leg, i) => {
      if (i) prev += "\n";
      const legRef = leg.substring(1, leg.length - 1);
      const index = legList.findIndex(
        legislacao => legislacao.tipoCode === legRef
      );
      if (index > -1)
        return `${prev}\t:temLegislacao :${legList[index].legCode} ;`;
      return prev;
    }, "");
    return out;
  }
  return "";
}

/**
 * 4.1) ... -> REPORT
 */
export function invSuplementoPara(relProc, classe, classes, report) {
  if (
    relProc === "eSuplementoPara" &&
    !classe.pcaJust.admin &&
    getFilhos(classe.classe, classes).length === 0
  ) {
    report({
      msg: `A classe ${classe.codigo} é suplemento para outra mas não tem critério de Utilidade Administrativa na Justificaçao de PCA`,
      type: 4,
      code: 1
    });
  }
}

/**
 * 4.2) ... -> CORRIGIDO
 */
export function invCritAdmin(relProc, procRel, classe, classes, critCode) {
  if (
    relProc === "eSuplementoPara" &&
    classe.pcaJust.admin &&
    getFilhos(classe.classe, classes).length === 0 &&
    classe.classe.length === 3
  ) {
    return `:${critCode} :critTemProcRel :c${procRel}.\n`;
  }
  return "";
}

/**
 * 5.3) ... -> REPORT
 */
export function invSintese(relProc, classe, classes, report) {
  if (
    (relProc === "eSinteseDe" || relProc === "eSintetizadoPor") &&
    !classe.dfJust.dens &&
    getFilhos(classe.classe, classes).length === 0
  ) {
    report({
      msg: `A classe ${classe.codigo} é sintetizada, não tem critério de Densidade Informacional na Justificação do DF`,
      type: 5,
      code: 3
    });
  }
}
