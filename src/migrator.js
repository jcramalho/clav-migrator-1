import xlsx from "xlsx";

const migrator = { data: {}, readName: "default" };

migrator.read = function read(sheet, name) {
  let readName = name;
  if (!readName) readName = this.readName;
  if (!this.data[readName]) this.data[readName] = [];
  this.data[readName] = [
    ...this.data[readName],
    ...xlsx.utils.sheet_to_json(sheet, {
      dateNF: "dd.mm.yyyy",
    }),
  ];
  this.readName = readName;
  return this;
};

migrator.parse = function parse(parser, name) {
  this.data[name] = this.data[name].map(line =>
    parser(line, this.data, this.report)
  );
  return this;
};

migrator.convert = function convert(template) {
  return template(this.data);
};

migrator.convert2 = function convert(template, name) {
  let document = "";

  let print = (...lines) =>
    lines.forEach(line => {
      if (!line) return;
      document += line + "\n";
    });

  this.data[name].forEach(item =>
    template(item, print, this.report, this.data)
  );

  return document;
};

migrator.report = function report(msg, defaultVal = null) {
  console.log(msg);
  return defaultVal;
};

export default migrator;
