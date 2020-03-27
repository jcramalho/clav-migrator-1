import xlsx from "xlsx";

const migrator = { data: {}, readName: "default" };

migrator.read = function read(sheet, name) {
  let readName = name;
  if (!readName) readName = this.readName;
  if (!this.data[readName]) this.data[readName] = [];
  this.data[readName] = [
    ...this.data[readName],
    ...xlsx.utils.sheet_to_json(sheet, {
      dateNF: "dd.mm.yyyy"
    })
  ];
  this.readName = readName;
  return this;
};

migrator.parse = function parse(parser, name) {
  this.data[name] = this.data[name].map(line => parser(line, this.data));
  return this;
};

migrator.convert = function convert(template) {
  return template(this.data);
};

export default migrator;
