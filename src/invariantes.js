export default function invDfDistinto(classe, classes) {
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
