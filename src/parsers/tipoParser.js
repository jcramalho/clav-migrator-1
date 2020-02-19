export default function tipoParser(data) {
  return {
    ...data,
    sigla: data.Sigla.replace(/(\r\n|\n|\r)/gm, " ")
  };
}
