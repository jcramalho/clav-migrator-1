import nanoid from "nanoid";

export default function tiParser(data) {
  return {
    ...data,
    tiCode: `ti_${nanoid()}`,
    classCode: `c${data.Código}`,
    termo: data.Termo.replace(/(\r\n|\n|\r)/gm, " ")
  };
}
